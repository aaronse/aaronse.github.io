# 黃河逆流 — Yellow River, Turbulent Flow

An animated homage to **Ma Yuan's** Song-dynasty water study *Yellow River,
Turbulent Flow* (from the *Water Album*), where the movement of the river is
driven by the **S&P 500**.

The water is redrawn procedurally in Ma Yuan's brush idiom — dense bundles of
variable-weight (thick/thin) ink flow-lines heaving over big swells, spiral
whirlpool eddies, and cloud-head foam bursting at the crests, over a soft
ink-wash that shades the troughs and back-faces for painted volume, on aged
silk. Motion is deliberately slow and ambient. Because the painting's very
subject is turbulent water, market **volatility** maps onto it directly:

- **Calm markets** → the current smooths toward near-laminar flow: gentle
  swells, flat streamlines, almost no eddies or foam.
- **Volatile markets** → the river breaches: tall heaving swells, quickened
  flow, whirlpools multiplying across the surface, foam at the crests, and a
  stormy draining of the light. The painting's full fury arrives at the crashes.
- The **day's direction** (up/down) subtly warms or shadows the mood.

## Run it

Just open `index.html` in any modern browser — everything is self-contained,
no build step and no network needed at runtime.

For a dev server (avoids browser file-cache quirks):

```bash
python -m http.server 5188
```

then visit http://localhost:5188.

## Controls

It opens **paused on the latest day** — an ambient, single-day view. The water
keeps flowing gently even while paused.

- **Play / Pause** and the **timeline scrubber** (the sparkline shows the index
  history; red bands mark high-volatility periods).
- **Granularity** selector — how much time each moment reflects: **Day**
  (default), Week, Month, Quarter, Year. Coarser granularity plays through
  history faster *and* averages the volatility over a longer window, so the
  water reads calmer and more big-picture; Day dwells on a single day.
- **Jump chips**: Late 90s · Dot-com · 2008 GFC · COVID · 2022 · Today.
- Keyboard: `Space` play/pause, `←/→` step a month.

## Data

`js/data.js` bundles **S&P 500 (^GSPC)** daily closes from 1990-01-02 to 2026,
sourced from Yahoo Finance. Daily log-returns and a 21-day annualized realized
volatility are computed in-browser (`js/app.js`); volatility is mapped to a
0–1 "turbulence" that drives the wave field in `js/waves.js`.

## Files

| File | Role |
|------|------|
| `index.html`     | page structure + HUD |
| `css/style.css`  | museum-quiet framing |
| `js/data.js`     | bundled S&P 500 daily history |
| `js/waves.js`    | procedural Ma Yuan wave field + market coupling |
| `js/app.js`      | market model, playback engine, UI |
| `assets/`, `research/` | the reference painting |

Waves after Ma Yuan (馬遠, c. 1160–1225). Market data © respective sources,
for illustration only — not investment advice.
