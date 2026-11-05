# Rendered web instrument acceptance

This fixture bundles the real `PrecisionScrubber`, `DragGrabHandle`,
`NativeSeekBar` and `LayerStack` sources through React Native Web, styled by
Tailwind v4 from the reference light and dark
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
`layers.spec.mjs` covers LayerStack kind labels and thumbnails, removal by
pointer, Enter and Delete, the fixture's undo, and locked rows refusing removal.
`shots.spec.mjs` writes review captures to `shots/`: light and dark, 390px phone
and 834px tablet, resting, focused and mid-drag, the seek bar, forced colors,
and the layer stack at both widths with a focused remove button, plus RTL via
`?dir=rtl`. They are uploaded as a CI artifact, not compared as pixel goldens.

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

`fixtures/forms.tsx` renders the studio form and navigation primitives at
`/forms`, themed with the InFraX preset values. `forms.spec.mjs` drives
SegmentedControl arrows (including RTL), pane TabBar arrows, navigation TabBar
links, Select keyboard and pointer use, ListItem presses, IconButton toggle
state, Toolbar arrow focus, and a 44px minimum for every control at 390px and
834px. `forms-shots.spec.mjs` captures the same page light and dark at 390px
and 834px (resting, Select open, focused), RTL, and forced colors.

Set `UI_ACCEPTANCE_PORT` to run the lane on a port other than 4179.

`primitives.spec.mjs` loads `/primitives` (`primitives.tsx`): Banner, Badge,
EmptyState, ErrorMessage, KeyValueList, NightScope, the web DropZone and
FilePicker, and the semantic html set. It checks the rendered elements and
roles, the 44pt dismiss, accept filtering on a dispatched drop, the file
chooser, NightScope's dark colors on a light page, KeyValueList columns at 390
and 834px and RTL, and writes `shots/primitives-*` captures (light, dark,
focus, drag-over, RTL, forced colors). `uniwind-shim.tsx` reproduces Uniwind's
web `ScopedTheme` output (a `display: contents` element with the theme class).

`mixer.spec.mjs` loads `/mixer` (`fixtures/mixer.tsx`), with a zustand store standing
in for the Cadence engine: fader and pan drags commit once, mute/solo with the
silenced-by-solo description, pan arrows and Home, a piano-roll note drag
that commits time and pitch together, Shift+arrow resize, Delete, audition,
a velocity bar drag, step toggles and the A accent key, tap tempo committing
once after the taps stop, time signature and metronome, and a waveform
window scroll plus seek. It writes `shots/mixer-*` captures (light and dark at
390 and 834 px, focus states, RTL) and asserts no horizontal page scroll and
that musical time stays left to right in RTL.

Not covered: iOS/Android rendering, native drag and drop, Uniwind itself, the GestureHandlerDrag transport, screen
readers, Safari and Firefox.
