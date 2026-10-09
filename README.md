# Bloomtype — a garden you type

An interactive garden that grows as you type. Every keystroke sends vines
curling around your words; roses bloom on mature stems and butterflies drift
between them.

Inspired by a viral interactive-art piece — rebuilt from scratch with an
HTML5 canvas garden engine.

## Controls

- **type** — grow vines, leaves and roses around your words
- **space** — cuts the growing vines
- **backspace** — withers the last letter's growth
- **enter** — clears the garden

Toolbar (top left): force-bloom roses, toggle sparkles, clear.

## Run it

```bash
npm install
npm run dev
```

## How it works

`src/garden.js` holds the whole engine: a vine system (growing tips with curl
physics, alternating leaves, blooming roses), withering/cutting lifecycle,
steering butterflies, and ambient pollen — all drawn each frame on canvas with
sway, glow and bloom easing. `src/App.jsx` wires keyboard / mobile input to it.
