/* ------------------------------------------------------------------ *
 *  app.js — market model, playback engine, and UI wiring
 * ------------------------------------------------------------------ */

'use strict';

(function () {
  const D = window.SPX;                 // { name, symbol, start, end, d[], c[] }
  const N = D.c.length;

  /* -- derived series: log returns + 21-day annualized realized vol -- */
  const ret = new Float64Array(N);      // daily simple return
  const lr  = new Float64Array(N);      // daily log return
  for (let i = 1; i < N; i++) {
    ret[i] = D.c[i] / D.c[i - 1] - 1;
    lr[i]  = Math.log(D.c[i] / D.c[i - 1]);
  }
  const W = 21, ANN = Math.sqrt(252);
  const vol = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    const lo = Math.max(1, i - W + 1);
    let n = 0, m = 0, s2 = 0;
    for (let j = lo; j <= i; j++) { n++; m += lr[j]; }
    if (n >= 2) {
      m /= n;
      for (let j = lo; j <= i; j++) { const d = lr[j] - m; s2 += d * d; }
      vol[i] = Math.sqrt(s2 / (n - 1)) * ANN;
    }
  }
  // turbulence: map annualized vol -> [0,1] (calm ~0.10, storm ~0.55+)
  const turbOf = (v) => {
    const t = clamp((v - 0.07) / 0.46, 0, 1);
    return t * t * (3 - 2 * t);          // smoothstep for a softer low end
  };

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  const idxByDate = new Map(D.d.map((s, i) => [s, i]));
  const nearestIdx = (dateStr) => {
    if (idxByDate.has(dateStr)) return idxByDate.get(dateStr);
    let best = 0, bd = Infinity;
    for (let i = 0; i < N; i++) {
      const dd = Math.abs(new Date(D.d[i]) - new Date(dateStr));
      if (dd < bd) { bd = dd; best = i; }
    }
    return best;
  };

  const SEA_STATES = [
    [0.08, 'Glass calm'], [0.18, 'Rippling'], [0.32, 'Gentle swell'],
    [0.48, 'Rough water'], [0.66, 'Heavy sea'], [0.82, 'Gale'], [1.01, 'Tempest'],
  ];
  const seaState = (t) => SEA_STATES.find(s => t < s[0])[1];

  const fmt = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtDate = (s) => {
    const [y, m, d] = s.split('-');
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  /* ================================================================ */
  const canvas = document.getElementById('sea');
  const field = new WaveField(canvas);

  const el = {
    date:   document.getElementById('m-date'),
    level:  document.getElementById('m-level'),
    change: document.getElementById('m-change'),
    vol:    document.getElementById('m-vol'),
    sea:    document.getElementById('m-sea'),
    volBar: document.getElementById('vol-bar'),
    play:   document.getElementById('play'),
    gran:   document.getElementById('gran'),
    scrub:  document.getElementById('scrub'),
    head:   document.getElementById('playhead'),
    spark:  document.getElementById('spark'),
    chips:  document.getElementById('chips'),
    label:  document.getElementById('event-label'),
  };

  /* -- granularity: how much time each moment reflects --------------- *
   * daysPerSec = ambient playback rate; smooth = trailing days the
   * volatility is averaged over (coarser granularity = calmer signal). */
  const GRAN = {
    day:     { daysPerSec: 1,   smooth: 1 },
    week:    { daysPerSec: 3,   smooth: 5 },
    month:   { daysPerSec: 10,  smooth: 21 },
    quarter: { daysPerSec: 30,  smooth: 63 },
    year:    { daysPerSec: 110, smooth: 252 },
  };
  let gran = GRAN.day;

  /* -- playback state ------------------------------------------------ */
  let pos = N - 1;                      // default: the latest day
  let playing = false;                 // start still — ambient, one day in view
  let lastT = null;

  el.scrub.min = 0; el.scrub.max = N - 1; el.scrub.step = 'any';

  function setPlaying(p) {
    playing = p;
    el.play.textContent = p ? '❚❚' : '▶';
    el.play.setAttribute('aria-label', p ? 'Pause' : 'Play');
  }

  /* -- events / jump chips ------------------------------------------ */
  const EVENTS = [
    { date: '1997-01-02', label: 'Calm bull market · late 1990s' },
    { date: '2000-03-24', label: 'Dot-com peak, March 2000' },
    { date: '2008-10-10', label: 'Global Financial Crisis, Oct 2008' },
    { date: '2020-03-16', label: 'COVID crash, March 2020 — record volatility' },
    { date: '2022-06-16', label: '2022 bear market' },
    { date: D.d[N - 1], label: 'Today' },
  ];
  const CHIPS = [
    ['Late 90s', '1997-01-02'], ['Dot-com', '2000-03-24'],
    ['2008 GFC', '2008-10-10'], ['COVID', '2020-03-16'],
    ['2022', '2022-06-16'], ['Today', D.d[N - 1]],
  ];
  CHIPS.forEach(([name, date]) => {
    const b = document.createElement('button');
    b.className = 'chip'; b.textContent = name;
    b.onclick = () => { jumpTo(nearestIdx(date)); flashLabel(date); };
    el.chips.appendChild(b);
  });
  function flashLabel(dateStr) {
    const ev = EVENTS.find(e => e.date === dateStr);
    if (!ev) return;
    el.label.textContent = ev.label;
    el.label.classList.add('show');
    clearTimeout(flashLabel._t);
    flashLabel._t = setTimeout(() => el.label.classList.remove('show'), 3200);
  }
  function jumpTo(i) { pos = clamp(i, 0, N - 1); setPlaying(false); syncUI(); }

  /* -- sparkline (index history + crash shading) --------------------- */
  function drawSpark() {
    const c = el.spark, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = c.clientWidth, h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr;
    const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    let mn = Infinity, mx = -Infinity;
    for (let i = 0; i < N; i++) { const v = Math.log(D.c[i]); if (v < mn) mn = v; if (v > mx) mx = v; }
    const X = i => (i / (N - 1)) * w;
    const Y = v => h - 6 - ((Math.log(v) - mn) / (mx - mn)) * (h - 12);
    // turbulence shading
    for (let i = 0; i < N; i += 2) {
      const t = turbOf(vol[i]);
      if (t > 0.25) { g.fillStyle = `rgba(150,40,32,${t * 0.28})`; g.fillRect(X(i), 0, w / N * 2 + 1, h); }
    }
    // index line
    g.beginPath();
    for (let i = 0; i < N; i++) { const x = X(i), y = Y(D.c[i]); i ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.strokeStyle = 'rgba(58,44,30,0.75)'; g.lineWidth = 1; g.stroke();
    g.lineTo(w, h); g.lineTo(0, h); g.closePath();
    g.fillStyle = 'rgba(58,44,30,0.10)'; g.fill();
  }

  /* -- per-frame market read + UI ------------------------------------ */
  function marketAt(f) {
    const i = clamp(Math.floor(f), 0, N - 1);
    const j = Math.min(i + 1, N - 1);
    const frac = f - i;
    const close = lerp(D.c[i], D.c[j], frac);
    // volatility smoothed over the granularity window (calmer when coarse)
    const sw = Math.max(1, gran.smooth);
    let acc = 0, cnt = 0;
    for (let q = i - sw + 1; q <= i; q++) { if (q >= 0) { acc += vol[q]; cnt++; } }
    const v = cnt ? acc / cnt : vol[i];
    // day return: use the day we're currently "on"
    const r = ret[j] || ret[i];
    return { i, close, v, r };
  }

  function syncUI() {
    const m = marketAt(pos);
    const t = turbOf(m.v);
    field.setMarket({ turb: t, ret: m.r, up: clamp(0.5 + m.r * 12, 0, 1) });

    el.date.textContent = fmtDate(D.d[m.i]);
    el.level.textContent = fmt.format(m.close);
    const pct = m.r * 100;
    el.change.textContent = (pct >= 0 ? '▲ +' : '▼ ') + fmt.format(pct) + '%';
    el.change.className = 'chg ' + (pct >= 0 ? 'up' : 'down');
    el.vol.textContent = (m.v * 100).toFixed(1) + '%';
    el.sea.textContent = seaState(t);
    el.volBar.style.width = (t * 100).toFixed(1) + '%';

    el.scrub.value = pos;
    el.head.style.left = (pos / (N - 1) * 100) + '%';
  }

  /* -- main loop ----------------------------------------------------- */
  function frame(ts) {
    if (lastT == null) lastT = ts;
    const dt = Math.min((ts - lastT) / 1000, 0.1);
    lastT = ts;

    if (playing) {
      pos += dt * gran.daysPerSec;
      if (pos >= N - 1) { pos = N - 1; setPlaying(false); }
    }
    syncUI();
    field.render(ts / 1000);
    requestAnimationFrame(frame);
  }

  /* -- controls ------------------------------------------------------ */
  el.play.onclick = () => { if (pos >= N - 1) pos = 0; setPlaying(!playing); };
  el.gran.onchange = () => { gran = GRAN[el.gran.value] || GRAN.day; };
  el.scrub.oninput = () => { pos = parseFloat(el.scrub.value); setPlaying(false); syncUI(); };
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); if (pos >= N - 1) pos = 0; setPlaying(!playing); }
    else if (e.code === 'ArrowRight') { jumpTo(pos + 21); }
    else if (e.code === 'ArrowLeft') { jumpTo(pos - 21); }
  });

  let rz;
  window.addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => { field.resize(); drawSpark(); }, 120);
  });

  /* -- boot ---------------------------------------------------------- */
  drawSpark();
  setPlaying(false);
  syncUI();
  requestAnimationFrame(frame);
})();
