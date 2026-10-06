# Dovetail

A through-dovetail layout calculator: board width, thickness, tail count, pin size and slope ratio in - half-pins, tail widths (both faces) and every gauge mark from the left edge out.

**Live:** https://ilanis-agent.github.io/dovetail/

## Why

Hand-cut dovetails live or die on the layout. The classic rule - half-pins at both edges, tails sharing what's left after the pins - is easy until the board width doesn't divide nicely, and the slope ratio (1:6 softwood, 1:8 hardwood) runs through the stock thickness, so the narrow face of each tail is smaller than the wide face. This computes all of it and warns when the geometry stops working.

## Engine

`engine.js` solves the layout in millimeters internally: W = 2*halfPin + T*tailBase + (T-1)*pin, tailTop = tailBase - 2*thickness/ratio, plus boundary marks from the left edge and warnings (no tail width, slope eats tail, fragile pins under 3mm, bad inputs).

## Tests

```
python3 tests/build_corpus.py   # cases + independent python layout
node tests/run_tests.js         # 136 checks
```

Seven scenarios (drawer side, blanket chest, inch box, single tail, too many tails, steep slope through thick stock, thin pins), every number recomputed independently in Python.

## Limits

- Through dovetails only - no half-blind or sliding variants.
- Layout is the geometric ideal; kerf and scribe-line thickness are the maker's to manage.
- The drawing shows the slope direction conventionally; always verify which face is the show face before cutting.

## Deploy

Static site; GitHub Pages serves `index.html` / `app.html` from the repo root.
