# Rendered web acceptance

These fixtures bundle the real `@nyc-tron/ui` sources (and, for pages built on
the examples, the workspace's built package exports) through React Native Web,
styled by Tailwind v4 from the reference light and dark tokens in
`docs/THEME_TOKENS.md`. `rn-shim.tsx` forwards `className` to React Native Web
as precompiled classes, standing in for the consumer's Uniwind runtime.

The editor controls that used to live under `components/forge` moved to Nitro
Forge's `@nitro-forge/editor-controls`, and their pages and specs moved with
them, to [`packages/editor-controls/tests/browser`](https://github.com/mikevocalz/Nitro-Forge/tree/master/packages/editor-controls/tests/browser)
in [mikevocalz/Nitro-Forge](https://github.com/mikevocalz/Nitro-Forge). This
lane covers only Tron's general components.

```sh
npm ci --ignore-scripts --no-audit --no-fund
npx --no-install playwright install --with-deps chromium
npm test
```

`fixture.tsx` (served at `/`) renders `PrecisionScrubber` and a row list
reordered by `DragGrabHandle`. `scrubber.spec.mjs` drags with a real mouse in
Chromium: one commit per release, fine precision on upward travel inside a
ScrollView, Escape cancel, arrow keys, buttons, text entry, disabled state, and
handle reorder plus Escape cancel.
`shots.spec.mjs` writes review captures of the scrubber to `shots/`: light and
dark, 390px phone and 834px tablet, resting, focused and mid-drag, and forced
colors. Captures are uploaded as a CI artifact, not compared as pixel goldens.
`.npmrc` keeps npm from installing `@expo/ui`'s `expo` and `react-native`
peers; the lane renders only its universal web build.

`fixtures/<name>.tsx` files are served at `/<name>`.

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
by `shell-commands-shots.spec.mjs`. The fixture also mounts `useHardwareKeyboard` from
`@nyc-tron/hardware-keys` (web entry) over a `createKeyboardMap` of the same
commands; `hardware-keys.spec.mjs` presses chords on the page and in the
Layer name field, and rebinds through the sheet. Set `UI_ACCEPTANCE_PORT` to run the lane beside another
server on 4179.

Not covered: iOS/Android rendering, native drag and drop, Uniwind itself, the GestureHandlerDrag transport, screen
readers, Safari and Firefox.

`workspace5` covers workspace canvas identity, mode/preset changes, contextual
overflow and file transfer settings/picking. Its stand-in Zustand host is
separate from Forge's real-engine tests. The server resolves `.web` siblings
before generic files so Expo's web implementations are the actual renderers.

`studio-gaps.spec.mjs` loads `/studio-gaps`: compact TabBar panes at the widths
Forge docks them at (whole labels when they fit, truncation inside the pane
when they cannot, 44 pt targets) and a grouped Select, with `shots/studio-*`
captures in light, dark and RTL.

`media6.spec.mjs` loads `/media6` and decodes `platform-services`' test clip
(served at `/decoder.webm`) with the web media decoder: frame zero's
presentation timestamp through WebCodecs, the labelled seek fallback without
WebCodecs, and resampled PCM through WebAudio.

Other pages, each driven by the spec of the same name:

- `basic-accessibility`: Button loading and disabled DOM state, NavigationRail
  selection and disabled destinations, TextField error and helper descriptions.
- `command-ownership`: ContextualToolbar, DocumentTabBar, RibbonTabs,
  SplitButton and ToolRail drop stale commands on selection replacement, close
  menus when disabled, and dispatch exact controlled identities.
- `precision-ownership`: PrecisionScrubber beside the inspector's UnitInput,
  SliderField, RangeSlider and RotaryKnob abandoning held gestures on scope
  replacement, disable and unmount, and rejecting late commits.
- `unit-boundary`: UnitInput from the built `@nyc-tron/ui` exports dropping
  drafts on disable and scope change and keeping full precision.
- `overlay-ownership`: the web NativeActionMenu and NativePopover from
  `@nyc-tron/expo-controls`, CommandPalette, ContextMenu, KeyboardShortcutHUD,
  PresetGallery, StatusBar and FileImportExportSheet closing or resetting on
  scope replacement and ignoring late results.
- `window-chrome`: WindowTitleBar over `@nyc-tron/core/window-chrome` (drawn
  and native title bars, close guards).
- `native-feel` and `reference-app`: the `examples/native-feel` screens and the
  reference app (with the web media decoder).
- `pointer-input`, `shell-consumers` and `workspace-continuity`: the
  `examples/native-instruments` PointerInputDemo, ShellDemo and
  WorkspaceContinuityDemo.

`fixtures/control-density.tsx` (`/control-density`) has no spec; it renders
Button, IconButton and a German-labelled PrecisionScrubber at a 48 pt target
size for manual review.
