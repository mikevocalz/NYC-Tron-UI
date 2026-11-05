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

`primitives.spec.mjs` drives the studio form and navigation primitives at
`/primitives`, themed with the InFraX preset values: SegmentedControl arrows
(including RTL), pane TabBar arrows, navigation TabBar links, Select keyboard
and pointer use, ListItem presses, IconButton toggle state, Toolbar arrow
focus, and a 44px minimum for every control at 390px and 834px.
`primitives-shots.spec.mjs` captures the same page light and dark at 390px and
834px (resting, Select open, focused), RTL, and forced colors.

Not covered: iOS/Android rendering, the GestureHandlerDrag transport, screen
readers, Safari and Firefox.
