# Rendered web instrument acceptance

This fixture bundles the real `PrecisionScrubber`, `DragGrabHandle` and
`NativeSeekBar` sources
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
`seekbar.spec.mjs` checks that `NativeSeekBar`'s step buttons and timecode sit
on one row under the slider at 390px and 834px (#27) and that the buttons step
the controlled frame. It renders the `@expo/ui` 58.0.20 universal web build;
`.npmrc` keeps npm from installing that package's `expo` and `react-native`
peers, which the web build does not import.
`shots.spec.mjs` writes review captures to `shots/` (light and dark, 390px phone
and 834px tablet, resting, focused and mid-drag, the seek bar, plus forced colors). They are
uploaded as a CI artifact, not compared as pixel goldens.

`fixtures/<name>.tsx` files are served at `/<name>`. `fixtures/color.tsx`
renders the color cluster against one zustand color store; `color.spec.mjs`
drags the disc, ring and tracks, cancels with Escape, types channel values,
swaps chips, searches swatches and undocks the palette past a simulated hinge.
`color-shots.spec.mjs` captures each palette mode at both widths in both themes,
floating, and in RTL.

`primitives.spec.mjs` loads `/primitives` (`primitives.tsx`): Banner, Badge,
EmptyState, ErrorMessage, KeyValueList, NightScope, the web DropZone and
FilePicker, and the semantic html set. It checks the rendered elements and
roles, the 44pt dismiss, accept filtering on a dispatched drop, the file
chooser, NightScope's dark colors on a light page, KeyValueList columns at 390
and 834px and RTL, and writes `shots/primitives-*` captures (light, dark,
focus, drag-over, RTL, forced colors). `uniwind-shim.tsx` reproduces Uniwind's
web `ScopedTheme` output (a `display: contents` element with the theme class).

Not covered: iOS/Android rendering, native drag and drop, Uniwind itself, the GestureHandlerDrag transport, screen
readers, Safari and Firefox.
