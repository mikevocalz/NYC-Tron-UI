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

`ink.spec.mjs` loads `?view=ink` (`ink-fixture.tsx`, which plays the Forge
board host) and checks `InkToolbar`: the tool radio group, disabled redo
explaining itself, size, color and pressure intent, in-toolbar shortcuts and
44 px targets. It writes `shots/ink-*` captures in light and dark at 390 px (top
bar) and 834 px (right rail), with keyboard focus and the notice line, plus RTL.

Not covered: iOS/Android rendering, the GestureHandlerDrag transport, screen
readers, Safari and Firefox.
