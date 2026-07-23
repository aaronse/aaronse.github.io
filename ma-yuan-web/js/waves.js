/* ------------------------------------------------------------------ *
 *  waves.js — procedural rendering of Ma Yuan's "黃河逆流"
 *  (Yellow River, Turbulent Flow), coupled to market state.
 *
 *  The painting's language, rebuilt procedurally:
 *    • dense bundles of parallel ink flow-lines heaving over big swells
 *    • spiral whirlpool eddies scattered on the wave faces
 *    • cloud-head foam clusters bursting at the crests
 *
 *  Market volatility ("turbulence") drives it from near-laminar calm to
 *  the painting's full fury: swell height, flow speed, eddy count/size,
 *  foam, and chop all rise with volatility; the day's direction tints
 *  the mood of the silk.
 * ------------------------------------------------------------------ */

'use strict';

/* -- seeded value noise (mulberry32 + smooth interpolation) --------- */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function makeNoise(seed, n) {
  const rnd = mulberry32(seed), table = new Float32Array(n);
  for (let i = 0; i < n; i++) table[i] = rnd() * 2 - 1;
  return function (x) {
    const xi = Math.floor(x), f = x - xi;
    const a = table[((xi % n) + n) % n];
    const b = table[(((xi + 1) % n) + n) % n];
    const u = f * f * (3 - 2 * f);
    return a + (b - a) * u;
  };
}

const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => [
  Math.round(lerp(c1[0], c2[0], t)),
  Math.round(lerp(c1[1], c2[1], t)),
  Math.round(lerp(c1[2], c2[2], t)),
];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const TAU = Math.PI * 2;

/* ------------------------------------------------------------------ *
 *  WaveField
 * ------------------------------------------------------------------ */
class WaveField {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.silk = document.createElement('canvas');
    this.silkCtx = this.silk.getContext('2d');
    this.noise = makeNoise(1337, 1024);
    this.noise2 = makeNoise(7919, 1024);

    this.target = { turb: 0.12, ret: 0, up: 0.5 };
    this.state  = { turb: 0.12, ret: 0, up: 0.5 };

    this.INK_CALM  = [54, 40, 24];
    this.INK_STORM = [28, 20, 12];

    // field-space feature anchors (whirlpool eddies + foam patches).
    // Stored in a virtual field width so they ride the flow and wrap.
    this.FIELD_W = 2600;
    const rnd = mulberry32(0xA5EA);
    this.eddies = [];
    for (let i = 0; i < 64; i++) {
      this.eddies.push({
        fx: rnd() * this.FIELD_W,
        u: 0.30 + Math.pow(rnd(), 0.7) * 0.74,   // biased to foreground
        size: 0.6 + rnd() * 1.2,
        dir: rnd() < 0.5 ? 1 : -1,
        spin: rnd() * TAU,
        thresh: 0.08 + rnd() * 0.5,              // appears as volatility rises
      });
    }
    this.foam = [];
    for (let i = 0; i < 84; i++) {
      this.foam.push({
        fx: rnd() * this.FIELD_W,
        u: 0.24 + rnd() * 0.72,
        scale: 0.6 + rnd() * 1.0,
        seed: (rnd() * 1e6) | 0,
        thresh: 0.05 + rnd() * 0.55,
      });
    }

    this.resize();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    this.dpr = dpr; this.W = w; this.H = h;
    for (const c of [this.canvas, this.silk]) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    }
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.silkCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.horizonY = h * 0.25;
    this.paintSilk();
  }

  /* worn, warm silk — browner and more weathered than the ripple leaf */
  paintSilk() {
    const g = this.silkCtx, w = this.W, h = this.H;
    g.clearRect(0, 0, w, h);

    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0.00, '#a98d50');
    grad.addColorStop(0.28, '#bfa563');
    grad.addColorStop(0.62, '#b69852');
    grad.addColorStop(1.00, '#a5883f');
    g.fillStyle = grad; g.fillRect(0, 0, w, h);

    const vg = g.createRadialGradient(w * 0.5, h * 0.44, h * 0.18, w * 0.5, h * 0.44, h * 0.98);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(66,46,18,0.40)');
    g.fillStyle = vg; g.fillRect(0, 0, w, h);
    const tg = g.createLinearGradient(0, 0, 0, h * 0.5);
    tg.addColorStop(0, 'rgba(84,60,26,0.24)');
    tg.addColorStop(1, 'rgba(84,60,26,0)');
    g.fillStyle = tg; g.fillRect(0, 0, w, h * 0.5);

    // horizontal silk fibres
    g.save();
    for (let i = 0; i < h; i += 2) {
      const n = this.noise2(i * 0.35);
      g.strokeStyle = `rgba(${n > 0 ? '86,64,32' : '208,186,134'},${0.02 + Math.abs(n) * 0.035})`;
      g.lineWidth = 1;
      g.beginPath(); g.moveTo(0, i + 0.5); g.lineTo(w, i + 0.5); g.stroke();
    }
    g.restore();

    // age stains / mottling (more worn)
    const rnd = mulberry32(24601);
    g.save();
    for (let i = 0; i < 130; i++) {
      const x = rnd() * w, y = rnd() * h, r = 24 + rnd() * 150;
      const s = g.createRadialGradient(x, y, 0, x, y, r);
      const dark = rnd() > 0.45;
      s.addColorStop(0, dark ? 'rgba(74,50,18,0.06)' : 'rgba(222,202,150,0.05)');
      s.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = s; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    }
    g.restore();

    // central panel seam
    const seamX = w * 0.5;
    g.save();
    g.strokeStyle = 'rgba(80,58,26,0.13)'; g.lineWidth = 1.4;
    g.beginPath(); g.moveTo(seamX, 0); g.lineTo(seamX, h); g.stroke();
    g.strokeStyle = 'rgba(255,244,214,0.07)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(seamX - 1.5, 0); g.lineTo(seamX - 1.5, h); g.stroke();
    g.restore();
  }

  setMarket({ turb, ret, up }) {
    this.target.turb = clamp(turb, 0, 1);
    this.target.ret = ret;
    this.target.up = clamp(up, 0, 1);
  }

  render(time) {
    const s = this.state, t = this.target, k = 0.02;   // slow, ambient easing
    s.turb += (t.turb - s.turb) * k;
    s.ret  += (t.ret  - s.ret ) * k;
    s.up   += (t.up   - s.up  ) * k;

    const ctx = this.ctx, w = this.W, h = this.H;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(this.silk, 0, 0, w, h);

    this.paintMood(ctx, s);
    this.paintSea(ctx, time, s);
    this.paintMoodTop(ctx, s);
  }

  paintMood(ctx, s) {
    const w = this.W, h = this.H;
    if (s.turb > 0.02) {
      const gg = ctx.createLinearGradient(0, this.horizonY - 40, 0, h);
      const a = s.turb * 0.30;
      gg.addColorStop(0, `rgba(40,44,52,${a * 0.6})`);
      gg.addColorStop(1, `rgba(20,24,34,${a})`);
      ctx.fillStyle = gg; ctx.fillRect(0, this.horizonY - 40, w, h - this.horizonY + 40);
      const vg = ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.15, w * 0.5, h * 0.5, h * 0.95);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, `rgba(18,14,10,${s.turb * 0.35})`);
      ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    }
    const up = s.up;
    if (up > 0.55) {
      ctx.fillStyle = `rgba(214,150,52,${(up - 0.5) * 0.10})`;
      ctx.fillRect(0, 0, w, h);
    } else if (up < 0.45) {
      ctx.fillStyle = `rgba(24,14,30,${(0.5 - up) * 0.14})`;
      ctx.fillRect(0, this.horizonY - 40, w, h - this.horizonY + 40);
    }
  }

  paintMoodTop(ctx, s) {
    if (s.turb < 0.35) return;
    const w = this.W;
    const gg = ctx.createLinearGradient(0, 0, 0, this.horizonY);
    const a = (s.turb - 0.35) * 0.5;
    gg.addColorStop(0, `rgba(40,44,54,${a * 0.55})`);
    gg.addColorStop(1, 'rgba(40,44,54,0)');
    ctx.fillStyle = gg; ctx.fillRect(0, 0, w, this.horizonY);
  }

  /* --- the swell displacement field (px above rest) at field-x, depth-u */
  makeDisp(time, turb) {
    const W = this.W;
    const ampMax = lerp(20, 168, turb);
    const k1 = TAU / (W * 0.44), k2 = TAU / (W * 0.23), k3 = TAU / (W * 0.115);
    const skew = 0.35 + turb * 0.95;                 // heaping, asymmetric swells
    const slant = 34 + turb * 30;
    const chop = turb * 0.7;
    const ph1 = time * (0.035 + turb * 0.09);        // slow, ambient undulation
    const ph2 = time * (0.024 + turb * 0.07);
    const ph3 = time * (0.048 + turb * 0.11);
    const tn = time * 0.045;
    const noise = this.noise, noise2 = this.noise2;
    return function (fx, u) {
      const A = lerp(1.5, ampMax, Math.pow(u, 1.7));  // foreground-dominant heave
      // slow spatial envelope: a few big swells separated by calmer water
      const env = 0.46 + 0.54 * (0.5 + 0.5 * noise2(fx * 0.0016 + u * 2.0));
      const th = k1 * fx + ph1 + u * slant;
      const sk = th + skew * Math.sin(th);
      const s1 = Math.sin(sk);
      const s2 = Math.sin(k2 * fx - ph2 + u * slant * 0.6);
      const s3 = Math.sin(k3 * fx + ph3 + u * slant * 0.3);
      let d = A * env * (0.66 * s1 + 0.20 * s2 + 0.14 * s3);
      d += A * chop * noise(fx * 0.011 + u * 7 + tn);
      return d;
    };
  }

  paintSea(ctx, time, s) {
    const w = this.W, h = this.H, turb = s.turb;
    const ink = mix(this.INK_CALM, this.INK_STORM, turb);
    const drift = time * (6 + turb * 26);            // slow horizontal flow
    const span = h * 1.12 - this.horizonY;
    const disp = this.makeDisp(time, turb);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // --- ink-wash shading: soft tonal volume under the swells --------
    this.paintWash(ctx, disp, drift, span, turb, ink);

    // --- dense bundled brush flow-lines (variable thick/thin) --------
    const stepX = 8;
    const jitAmp = 0.7;
    let yb = this.horizonY, li = 0;
    for (; yb < h + 130; li++) {
      const u = (yb - this.horizonY) / span;
      const gap = lerp(6.5, 13.0, u);
      // every 3rd line is a bolder "leading" stroke, as in the painting
      const lead = (li % 3 === 0) ? 2.0 : 1.0;
      const baseW = lerp(0.5, 1.7, u) * lead;
      const inkA = lerp(0.17, 0.5, Math.pow(u, 0.9)) * (1 - turb * 0.06)
        * (lead > 1 ? 1.18 : 0.92)
        * (0.85 + 0.3 * (0.5 + 0.5 * this.noise(li * 1.9)));   // per-stroke ink variation
      const jt = li * 3.17;

      const pts = [];
      for (let x = -stepX; x <= w + stepX; x += stepX) {
        const fx = x + drift;
        const y = yb - disp(fx, u) - jitAmp * this.noise(fx * 0.03 + jt);
        pts.push(x, y);
      }
      this.brushStroke(ctx, pts, baseW, ink, inkA, jt);
      yb += gap;
    }

    // --- whirlpool eddies on the wave faces -------------------------
    const fieldShift = ((drift % this.FIELD_W) + this.FIELD_W) % this.FIELD_W;
    for (const e of this.eddies) {
      if (turb <= e.thresh) continue;
      const appear = clamp((turb - e.thresh) / 0.16, 0, 1);
      let sx = e.fx - fieldShift;
      if (sx < -140) sx += this.FIELD_W;
      if (sx > w + 140) sx -= this.FIELD_W;
      if (sx < -140 || sx > w + 140) continue;
      const yb2 = this.horizonY + span * e.u;
      const sy = yb2 - disp(sx + drift, e.u);
      const R = e.size * lerp(7, 27, e.u) * (0.55 + turb * 0.9);
      this.drawSpiral(ctx, sx, sy, R, e.dir, e.spin + time * 0.05 * e.dir,
        turb, ink, appear * lerp(0.34, 0.66, e.u));
    }

    // --- cloud-head foam bursting at crests -------------------------
    for (const f of this.foam) {
      if (turb <= f.thresh) continue;
      const appear = clamp((turb - f.thresh) / 0.18, 0, 1);
      let sx = f.fx - fieldShift;
      if (sx < -80) sx += this.FIELD_W;
      if (sx > w + 80) sx -= this.FIELD_W;
      if (sx < -80 || sx > w + 80) continue;
      const yb2 = this.horizonY + span * f.u;
      const d = disp(sx + drift, f.u);
      // foam favours crests: skip when this patch sits in a trough
      if (d < lerp(1, 10, f.u) * 0.2) continue;
      const sy = yb2 - d;
      const sc = f.scale * lerp(4.5, 11, f.u) * (0.6 + turb * 0.7);
      this.drawFoam(ctx, sx, sy, sc, f.seed, ink, appear * lerp(0.45, 0.74, f.u));
    }
  }

  /* soft ink-wash shading: darker tone pooling in the troughs and on the
     shadowed (back) side of each swell, giving the water painted volume */
  paintWash(ctx, disp, drift, span, turb, ink) {
    const w = this.W, h = this.H;
    const cols = 46;                                  // coarse sampling columns
    const dx = w / cols;
    const rows = 9;                                   // shading depth bands
    ctx.save();
    for (let r = 0; r < rows; r++) {
      const u0 = (r + 0.5) / rows;
      const yb = this.horizonY + span * u0;
      const bandA = lerp(0.05, 0.16, u0) * (0.55 + turb * 0.7);
      ctx.beginPath();
      ctx.moveTo(-dx, h + 140);
      for (let c = 0; c <= cols; c++) {
        const x = c * dx;
        const d = disp(x + drift, u0);
        // slope of the surface -> shade the down-slope (back) faces
        const d2 = disp(x + drift + 12, u0);
        const slope = (d2 - d);
        const y = yb - d + slope * 2.2;               // push shade behind crest
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w + dx, h + 140);
      ctx.closePath();
      ctx.fillStyle = rgba(ink, bandA);
      ctx.fill();
    }
    ctx.restore();
  }

  /* a variable-width brush stroke: fills a ribbon whose half-width swells
     on the steep wave faces (pressure) and tapers at the ends and crests */
  brushStroke(ctx, pts, baseW, ink, alpha, seed) {
    const n = pts.length >> 1;
    if (n < 2) return;
    const top = new Float32Array(n * 2), bot = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      const x = pts[i * 2], y = pts[i * 2 + 1];
      const ip = Math.max(0, i - 1), inx = Math.min(n - 1, i + 1);
      const xp = pts[ip * 2], yp = pts[ip * 2 + 1];
      const xn = pts[inx * 2], yn = pts[inx * 2 + 1];
      let tx = xn - xp, ty = yn - yp;
      const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      const nx = -ty, ny = tx;
      const slope = Math.min(Math.abs((yn - yp) / ((xn - xp) || 1)), 2.6);
      const edge = Math.min(i, n - 1 - i);
      const taper = Math.min(1, edge / 5);
      const organic = 0.65 + 0.7 * (0.5 + 0.5 * this.noise(i * 0.16 + seed));
      let hw = baseW * (0.42 + 1.05 * slope) * organic * taper;   // strong face-pressure
      if (hw < 0.28) hw = 0.28 * taper + 1e-4;
      top[i * 2] = x + nx * hw; top[i * 2 + 1] = y + ny * hw;
      bot[i * 2] = x - nx * hw; bot[i * 2 + 1] = y - ny * hw;
    }
    ctx.beginPath();
    ctx.moveTo(top[0], top[1]);
    for (let i = 1; i < n; i++) ctx.lineTo(top[i * 2], top[i * 2 + 1]);
    for (let i = n - 1; i >= 0; i--) ctx.lineTo(bot[i * 2], bot[i * 2 + 1]);
    ctx.closePath();
    ctx.fillStyle = rgba(ink, alpha);
    ctx.fill();
  }

  /* Archimedean whirlpool curl */
  drawSpiral(ctx, cx, cy, R, dir, spin, turb, ink, a) {
    if (R < 1.2 || a < 0.02) return;
    ctx.strokeStyle = rgba(ink, a);
    ctx.lineWidth = Math.max(0.7, R * 0.12);
    const turns = 1.5 + turb * 1.3;
    const steps = 46;
    const b = R / (turns * TAU);
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const th = (i / steps) * turns * TAU;
      const rr = b * th;
      const x = cx + dir * Math.cos(th + spin) * rr;
      const y = cy + Math.sin(th + spin) * rr;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
  }

  /* cloud-head foam: a rounded cluster of little scallops */
  drawFoam(ctx, cx, cy, sc, seed, ink, a) {
    if (a < 0.02) return;
    const rnd = mulberry32(seed);
    const n = 3 + Math.floor(rnd() * 4);
    ctx.strokeStyle = rgba(ink, a);
    ctx.lineWidth = Math.max(0.5, sc * 0.14);
    for (let i = 0; i < n; i++) {
      const ox = (rnd() - 0.5) * sc * 2.4;
      const oy = -rnd() * sc * 1.1;
      const r = sc * (0.35 + rnd() * 0.5);
      ctx.beginPath();
      ctx.arc(cx + ox, cy + oy, r, Math.PI * 0.05, Math.PI * 0.98, false);
      ctx.stroke();
    }
    // faint pale highlight in the foam
    ctx.fillStyle = `rgba(236,228,204,${a * 0.5})`;
    for (let i = 0; i < n; i++) {
      const ox = (rnd() - 0.5) * sc * 2.0;
      const oy = -rnd() * sc;
      ctx.beginPath(); ctx.arc(cx + ox, cy + oy, sc * 0.16, 0, 7); ctx.fill();
    }
  }
}

window.WaveField = WaveField;
