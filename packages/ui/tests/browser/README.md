# Rendered web instrument acceptance

This fixture bundles the real `PrecisionScrubber` and `DragGrabHandle` sources
through React Native Web, styled by Tailwind v4 from the reference light and dark
tokens in `docs/THEME_TOKENS.md`. `rn-shim.tsx` forwards `className` to React
Native Web as precompiled classes, standing in for the consumer's Uniwind runtime.

```sh
npm ci --ignore-scripts --no-audit --no-fund
npx --no-install playwright install --with-deps chromium
npm test
```

`scrubber.spec.mjs` drags with a real mouse in Chromium: one commit per release,
fine precision on upward travel inside a ScrollView, Escape cancel, arrow keys,
buttons, text entry, disabled state, and handle reorder plus Escape cancel.
`shots.spec.mjs` writes review captures to `shots/` (light and dark, 390px phone
and 834px tablet, resting, focused and mid-drag, plus forced colors). They are
uploaded as a CI artifact, not compared as pixel goldens.

`fixtures/<name>.tsx` files are served at `/<name>`. `fixtures/color.tsx`
renders the color cluster against one zustand color store; `color.spec.mjs`
drags the disc, ring and tracks, cancels with Escape, types channel values,
swaps chips, searches swatches and undocks the palette past a simulated hinge.
`color-shots.spec.mjs` captures each palette mode at both widths in both themes,
floating, and in RTL.

`fixtures/timeline.tsx` renders the timeline core over a seconds-based
stand-in for Splice that applies each `TimelineEdit` as `moveClip`,
`trimClip` and `splitClip` in the order the edit names. `timeline.spec.mjs`
moves, trims, splits, seeks, marks, zooms and pans with a real mouse and
keyboard; `timeline-shots.spec.mjs` captures both widths in both themes, NTSC
drop-frame with a scope matte, and RTL.

Set `UI_ACCEPTANCE_PORT` to run the lane on a port other than 4179.

Not covered: iOS/Android rendering, the GestureHandlerDrag transport, screen
readers, Safari and Firefox.
