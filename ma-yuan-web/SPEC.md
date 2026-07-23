# 黃河逆流 × S&P 500 — Session Spec

A record of the conversation that produced this project: every user prompt, what
was built in response, and the consolidated specification the code now
implements.

**Project:** an animated homage to Ma Yuan's Song-dynasty water study *Yellow
River, Turbulent Flow*, whose water is driven by S&P 500 volatility.

**Session date:** 2026-07-22
**Working directory:** `E:\git\ma-yuan-web`

---

## 1. Session log

### Exchange 1 — Initial brief

> **Prompt**
>
> So I want to take this picture by my yuan and animate it and I want the
> animation to reflect the movement of the stock market of the S&P 500
>
> for reference use `E:\git\ma-yuan-web\research\ma-yuan-yangzi-ten-thousand-ripples.jpg`

**Response**

Identified the reference as Ma Yuan's *Yangzi River — Ten Thousand Ripples*
(長江萬頃), one of the twelve leaves of his *Water Album*: rhythmic ink waves on
aged silk. Noted the project folder was empty apart from the research image, so
this was a greenfield build.

Three decisions genuinely branched the implementation, so they were put to the
user rather than assumed:

| Question | Options offered | **Chosen** |
| --- | --- | --- |
| Data source | Live+historical (Stooq) · Historical playback (bundled) · Simulated | **Historical playback (bundled)** |
| Market → wave mapping | Volatility → turbulence · Price → sea level & speed · Both | **Volatility → turbulence** |
| Visual technique | Procedural Ma Yuan waves · Warp the actual photo | **Procedural Ma Yuan waves** |

Then built v1: real S&P 500 history bundled offline, a procedurally drawn ink
sea on aged silk, and a playback UI (play/pause, scrubber, speed, era jump
chips, volatility sparkline).

---

### Exchange 2 — Change the source painting

> **Prompt**
>
> `E:\git\ma-yuan-web\research\ma-yuan-yangzi-ten-thousand-ripples.jpg`
>
> `E:\git\ma-yuan-web\research\ma-yuan-yellow-river-breaches.jpg`
>
> Please use yellow river breaches as the basis of the animation

**Response**

Read the new reference — *黃河逆流* (Yellow River, Turbulent Flow) — and noted it
is a far better fit, because its subject **is** turbulent water: the painting's
full fury can represent a market crash while calm markets smooth it toward
laminar flow.

Catalogued the painting's distinct visual language versus the ripple leaf:

1. Large heaping swells rather than uniform ripples.
2. Dense bundles of parallel flow-lines contouring over each swell.
3. Spiral whirlpool eddies scattered on the wave faces.
4. Cloud-head foam clusters bursting at the crests.
5. Warmer, browner, more worn silk.

Rewrote `js/waves.js` around those primitives, retitled the piece to 黃河逆流,
retoned the silk, and copied the image into `assets/`.

Three visual iterations followed, each verified in the browser:

1. First pass — flow-lines read correctly but swells were far too flat and
   eddies/foam nearly invisible.
2. Raised amplitude, shortened swell wavelength, added a spatial envelope so
   distinct large swells form separated by calmer stretches; enlarged eddies
   and foam.
3. Pushed foreground amplitude harder (steeper depth ramp), raised the envelope
   floor, extended the water lower, increased eddy/foam density.

Verified at COVID (2020-03-16, "Tempest", 79.3% vol) and a calm date
(1997-01-02, "Glass calm", 14.6% vol); the calm↔storm contrast read clearly.

---

### Exchange 3 — Painterly, granular, ambient

> **Prompt**
>
> Can you make it more like a painting with shading and thick and thin lines.
> Implement a setting that enables us to set the granularity of the data We want
> to be able to by default look at a day's worth of data and also the vibe
> should be very Cal currently it's it's very agitated and and almost flickering
> because it's so rapidly moving.
>
> Yeah I also wanted to have more of an ambient feel about it

**Response**

Treated this as three requests and addressed them together.

**(a) More painterly — shading and thick/thin lines**

- Replaced fixed-width stroked lines with **variable-width brush ribbons**
  (`brushStroke`): each stroke is a filled polygon whose half-width swells on
  steep wave faces (brush pressure), tapers at the ends, and varies organically
  via noise. Every 3rd line is a bolder "leading" stroke, plus per-stroke ink
  variation.
- Added **`paintWash`**, a soft ink-wash pass that pools darker tone in the
  troughs and on the shadowed back-faces of the swells, giving painted volume
  instead of flat line-art.
- Gave the whirlpool eddies more ink weight.

**(b) Granularity setting**

Replaced the playback-speed selector with a **Granularity** selector
(Day/Week/Month/Quarter/Year, **Day default**) that controls both playback rate
and the trailing window over which volatility is averaged.

**(c) Calm, ambient vibe**

- Cut every motion rate roughly 4–5× — horizontal drift, wave phases, the
  shimmer noise term, and eddy spin. This removed the flicker.
- Slowed state easing from `0.06` to `0.02` so transitions glide.
- Changed the default to **paused on the latest day**; the water still flows
  gently while paused.

Verified: today (Jul 2026, "Glass calm") is serene and clearly painterly;
2008-10-10 ("Tempest", 61.6% vol) surges with dense brushwork, many whirlpools,
foam, and deep shading. No console errors.

**Environment problem found and fixed:** port 5173 had been taken over by a
separate Vite/React dev server titled *"Market Landscapes"* (an unrelated
project on the same machine). The static server could not bind, so the browser
silently loaded that other app instead. This project's dev server was moved to
**port 5188**. Project files were never affected. A stale-JS browser cache also
briefly showed old playback defaults; a cache-busting reload resolved it.

---

### Exchange 4 — This document

> **Prompt**
>
> write this chat session's prompts and your responses to a markdown spec within
> `E:\git\ma-yuan-web\`

**Response** — this file (`SPEC.md`).

---

## 2. Consolidated specification

### 2.1 Data pipeline

**Source.** Yahoo Finance chart API, symbol `^GSPC`:

```
https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?period1=631152000&period2=1784800000&interval=1d
```

**Sources rejected during the build:**

| Source | Outcome |
| --- | --- |
| Stooq CSV (`stooq.com/q/d/l/?s=^spx&i=d`) | Blocked — returns a JavaScript proof-of-work bot challenge, not CSV |
| Yahoo `range=max&interval=1d` | Silently degraded to 168 quarterly points; unusable for volatility |
| Yahoo explicit `period1`/`period2` | **Used** — full daily granularity |

**Dataset.** 9,205 clean daily closes, **1990-01-02 → 2026-07-22**. Covers the
dot-com crash, the 2008 GFC, COVID, and the 2022 bear market.

**Bundling.** Written to `js/data.js` (~190 KB) as a global rather than a
fetched JSON file, so the page works from `file://` with no network and no CORS
problem:

```js
window.SPX = { symbol, name, start, end, d: [ISO dates…], c: [closes…] };
```

**Derived series** (computed in `app.js` at load, not baked into the bundle, so
the mapping stays tunable):

- `ret[i]` — daily simple return.
- `lr[i]` — daily log return.
- `vol[i]` — 21-day **annualized realized volatility**: sample standard
  deviation of log returns over a trailing 21-day window × √252.

**Reference statistics** (21-day annualized realized vol across the dataset):

| Statistic | Value |
| --- | --- |
| Minimum | 3.5% |
| Median | 13.1% |
| 90th percentile | 25.0% |
| 99th percentile | 50.9% |
| Maximum | 97.6% |

Largest single-day moves in the set: −12.0% (2020-03-16), −9.5% (2020-03-12),
−9.0% (2008-10-15); +11.6% (2008-10-13), +10.8% (2008-10-28), +9.5%
(2025-04-09).

### 2.2 Market → visual mapping

**Turbulence** is the master control, derived from volatility with a smoothstep
for a softer low end:

```js
turbOf(v) = smoothstep( clamp((v - 0.07) / 0.46, 0, 1) )
```

So ~7% annualized vol reads as dead calm and ~53%+ saturates at full storm.

| Turbulence drives | Calm (turb → 0) | Storm (turb → 1) |
| --- | --- | --- |
| Swell amplitude | ~20 px | ~168 px |
| Flow drift speed | ~6 px/s | ~32 px/s |
| Swell asymmetry (skew) | 0.35 | 1.30 |
| Chop / fine noise | none | strong |
| Whirlpool eddies | none | dozens, larger |
| Crest foam | none | frequent |
| Ink tone | warm brown `[54,40,24]` | near-black `[28,20,12]` |
| Light | open silk | stormy darkening + vignette |

**Direction** (the day's return) is a secondary, subtler cue: up days warm the
silk slightly, down days shadow the water.

**Sea-state labels** shown in the readout: Glass calm · Rippling · Gentle swell
· Rough water · Heavy sea · Gale · Tempest.

### 2.3 Rendering model

The sea is drawn each frame in four passes over a pre-rendered silk canvas.

**Displacement field.** A single shared function `disp(fieldX, u)` gives the
vertical offset of the water surface, where `u` is the depth parameter
(0 = horizon, 1 = foreground):

- Three sine components at descending wavelengths, the primary one skewed
  (`θ + skew·sin θ`) to make swells heap asymmetrically.
- Amplitude ramps with depth as `u^1.7`, so the foreground dominates.
- A slow spatial envelope from value noise creates a few large swells separated
  by calmer stretches, rather than uniform corrugation.
- A chop term adds fine turbulence proportional to `turb`.

**Pass 1 — ink wash (`paintWash`).** Nine coarse depth bands sampled across 46
columns, each filled below a surface contour that is pushed behind the crest by
the local slope. Produces tonal shading in the troughs and on back-faces.

**Pass 2 — brush flow-lines.** ~60 lines at uniform-ish screen spacing
(`gap` 6.5 → 13 px with depth). Because every line shares one displacement
field, neighbours stay parallel and heave together — the bundled contour look —
while visually converging on steep faces. Each is rendered by `brushStroke`:

```
halfWidth = baseW · (0.42 + 1.05·slope) · organicNoise · endTaper
```

**Pass 3 — whirlpool eddies.** 64 field-space anchors, each with its own
appearance threshold, so eddies emerge progressively as volatility rises.
Rendered as Archimedean spirals (1.5–2.8 turns) sitting on the wave surface.

**Pass 4 — cloud-head foam.** 84 field-space anchors, biased to crests
(anchors sitting in troughs are skipped), drawn as clusters of small scallop
arcs with faint pale highlights.

Feature anchors live in a 2,600 px virtual field width and wrap, so eddies and
foam ride the current instead of sitting still.

**Silk.** Pre-rendered once per resize: warm brown gradient, radial vignette,
horizontal fibre lines, ~130 age stains, and a central panel seam.

**Motion is deliberately slow** throughout — this is an ambient piece, not a
simulation. State changes ease at `0.02` per frame.

### 2.4 Controls

Opens **paused on the latest day** — an ambient single-day view. The water keeps
flowing gently while paused.

| Control | Behaviour |
| --- | --- |
| Play / Pause | Advances through history at the granularity's rate |
| Scrubber | Seek; sparkline shows index history with red high-volatility bands |
| **Granularity** | Day (default) · Week · Month · Quarter · Year |
| Jump chips | Late 90s · Dot-com · 2008 GFC · COVID · 2022 · Today |
| Keyboard | `Space` play/pause · `←/→` step a month |

**Granularity table** — controls playback rate *and* the volatility averaging
window, so coarser settings are calmer and more big-picture:

| Setting | Trading days/sec | Vol smoothing window |
| --- | --- | --- |
| Day (default) | 1 | 1 day (raw) |
| Week | 3 | 5 days |
| Month | 10 | 21 days |
| Quarter | 30 | 63 days |
| Year | 110 | 252 days |

### 2.5 Files

```
E:\git\ma-yuan-web\
├─ index.html                  markup: canvas, title block, readout, transport
├─ SPEC.md                     this document
├─ README.md                   how to run + what it does
├─ css\style.css               silk-toned UI chrome, typography, controls
├─ js\
│  ├─ data.js                  bundled S&P 500 history (window.SPX, ~190 KB)
│  ├─ waves.js                 WaveField: silk, disp field, wash, brush strokes,
│  │                           eddies, foam, market→visual coupling
│  └─ app.js                   derived series, turbulence mapping, granularity,
│                              playback, sparkline, UI wiring
├─ assets\                     both Ma Yuan reference images
├─ research\                   original source images (untouched)
└─ .claude\launch.json         dev server on port 5188
```

No build step, no runtime dependencies, no network access required.

### 2.6 Running it

Open `index.html` directly, or serve it:

```bash
python -m http.server 5188
```

Then visit http://localhost:5188.

---

## 3. Environment notes

1. **Port 5173 is not safe here.** A separate Vite/React project ("Market
   Landscapes") occupies it on this machine. A static server silently fails to
   bind and the browser loads that other app instead. This project uses **5188**.
2. **Browser caching** of `js/*.js` under `python -m http.server` can serve stale
   code after edits; force-reload or append a cache-busting query string when a
   change appears not to have taken effect.
3. The data bundle is a **point-in-time snapshot** ending 2026-07-22. Refreshing
   it means re-running the Yahoo request and regenerating `js/data.js`.

## 4. Possible next steps

Raised but not implemented:

- A tuning panel exposing swell/choppiness/ink parameters directly.
- A fade toggle to compare the animation against the original painting.
- Making the coarse-granularity sweep even calmer.
- Refreshing or extending the bundled dataset (e.g. back to 1928).

---

*Waves after Ma Yuan (馬遠, c. 1160–1225). Market data is historical and shown
for illustration only — not investment advice.*
