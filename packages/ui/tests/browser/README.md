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

Each `fixtures/<name>.tsx` page is served at `/<name>`. `fixtures/shell-layout.tsx`
is an image-editor shell (DocumentTabBar, ToolRail, AdaptiveDock, StatusBar and a
PaneSplitter; `?hinge=1` adds a simulated hinge, `?dir=rtl` flips direction).
`shell-layout.spec.mjs` drives it by keyboard and mouse, and
`shell-layout-shots.spec.mjs` captures it at 390 and 834px in light, dark, RTL,
forced colors and with the hinge.

`fixtures/shell-inspector.tsx` is a layer inspector (InspectorPanel, sections,
PropertyRow, UnitInput, SliderField, RangeSlider, RotaryKnob; `?select=none|multiple`,
`?dir=rtl`), driven by `shell-inspector.spec.mjs` and captured by
`shell-inspector-shots.spec.mjs`.

`fixtures/shell-commands.tsx` holds the ribbon, split buttons, a layer context
menu, a preset gallery and the shortcut sheet inside `FocusAndA11yLayer`
(`?dir=rtl`, `?apple=1`, `?hud=1`), driven by `shell-commands.spec.mjs` and captured
by `shell-commands-shots.spec.mjs`. Set `PORT` to run the lane beside another
server on 4179.

Not covered: iOS/Android rendering, the GestureHandlerDrag transport, screen
readers, Safari and Firefox.
