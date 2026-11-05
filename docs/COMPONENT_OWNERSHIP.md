# Component inventory and ownership

The **source owner** for every reusable generic or professional Forge control is
`NYC-Tron-UI/packages/ui/src/components/`. Nitro Forge owns document engines,
complex editor screen composition and its cross-engine suite application.

| Component | Source owner / import | Implementation status | Prior source |
| --- | --- | --- | --- |
| Button | `@nyc-tron/ui/components/Button` | RN semantic foundation | NYC-MON Button, Moyo Button |
| Card | `@nyc-tron/ui/components/Card` | RN semantic foundation | NYC-MON / Moyo Card |
| NavigationRail / Shell | `@nyc-tron/ui/components/NavigationRail` | Controlled RN shell, NOT WinUI | NYC-MON / Moyo adaptive |
| PaneSplitter (A-04) | `@nyc-tron/ui/components/shell/PaneSplitter` (math in `/shell/splitter-model`) | Controlled RN window splitter; minimums, hinge seating from `@nyc-tron/core/folds` features, keyboard, Escape cancel, native adjustable actions. Model tests plus Chromium drag, keyboard, hinge and RTL tests; no device QA | Original |
| AdaptiveDock (A-03) | `@nyc-tron/ui/components/shell/AdaptiveDock` (model in `/shell/dock-model`) | Controlled left/right/bottom stacks and floating panels; move/float/close menu, drag-to-dock from a floating grip, one merged stack on compact widths, floating panels kept inside one usable region. Model tests plus Chromium menu-move, drag-to-dock and compact tests; no device QA | Original; extends AdaptivePaneHost's role, does not replace it |
| DocumentTabBar (A-05) | `@nyc-tron/ui/components/shell/DocumentTabBar` (model in `/shell/document-tabs-model`) | Controlled tabs with unsaved marker, close button, keyboard and screen-reader reorder/close; pointer drag reorder deferred | Original |
| ToolRail (A-06) | `@nyc-tron/ui/components/shell/ToolRail` (model in `/shell/tool-rail-model`) | Controlled 44pt toggle tools, variant flyouts on long press, outward arrow or a11y action; app owns shortcuts | Original; NavigationRail stays the app-section rail |
| StatusBar (A-25) | `@nyc-tron/ui/components/shell/StatusBar` (text in `/shell/status-model`) | Controlled zoom steps and presets, unit menu, selection count, render/save/record/error state with polite announcements | Original |
| MenuButton | `@nyc-tron/ui/components/shell/MenuButton` | Button that anchors a CommandPopover; shared by the shell controls | Original |
| InspectorPanel (A-09) | `@nyc-tron/ui/components/shell/InspectorPanel` (model in `/shell/inspector-model`) | Controlled selection heading (none, single, multiple), empty state, search that hides non-matching rows and sections | Original |
| InspectorSection (A-10) | `@nyc-tron/ui/components/shell/InspectorSection` | Controlled disclosure, nesting, enable switch that disables rows inside, Reset while modified | Original |
| PropertyRow (A-11) | `@nyc-tron/ui/components/shell/PropertyRow` | Label + editor, Mixed marker, inherited/overridden state with Revert, stacks in narrow panes | Original |
| InspectorSearch (A-21) | `@nyc-tron/ui/components/shell/InspectorSearch` (`matchesQuery` for app lists) | Search field with clear, Escape and a polite match count | Original |
| UnitInput (A-13) | `@nyc-tron/ui/components/shell/UnitInput` (parser in `/shell/unit-expression`) | Bounded recursive-descent unit arithmetic (px, pt, mm, cm, in, %, s, ms, f, smp, dB, x); no eval; length/token/depth limits | Original; replaces the helper-only gap noted on forge #46 |
| SliderField (A-14) | `@nyc-tron/ui/components/shell/SliderField`; OS slider in `@nyc-tron/expo-controls/NativeSliderField` | RN track with typed entry and Reset on every platform; the expo-controls variant renders SwiftUI/Compose `Slider` on iOS/Android and commits when the OS drag ends. Native build and device runs unverified | Original |
| RangeSlider (A-15) | `@nyc-tron/ui/components/shell/RangeSlider` (math in `/shell/slider-model`) | Two ends that never cross, min gap, typed endpoints, per-end keyboard and a11y | Original |
| RotaryKnob (A-16) | `@nyc-tron/ui/components/shell/RotaryKnob` | Relative drag with sideways fine mode, circular (stylus) input, keys, exact entry, Reset. InstrumentKnob and native ArcKnob are unchanged | Original |
| DataTable | `@nyc-tron/ui/components/data/DataTable` | TanStack Table v9 headless + custom RN renderer; source/typecheck | Moyo / NYC-MON headless table patterns |
| SpreadsheetGrid | `@nyc-tron/ui/components/forge/SpreadsheetGrid` | Custom two-axis viewport, frozen panes, range selection, keyboard, TSV copy and formula reference highlights; native QA pending | Forge Tally Rust adapter PR #39 |
| WaveformLane | `@nyc-tron/ui/components/forge/WaveformLane` | Source extracted, RN UI | Forge PR #25 / #35 |
| NativeSeekBar | `@nyc-tron/ui/components/forge/NativeSeekBar` | Source extracted, Expo 58 @expo/ui; native build unverified | Forge PR #25 |
| ColorChannels | `@nyc-tron/ui/components/forge/ColorChannels` | Source extracted, Expo 58 @expo/ui; native build unverified | Forge PR #26 / #34 |
| HsvPicker | `@nyc-tron/ui/components/forge/color/HsvPicker` | Source extracted with unit-tested field geometry/gesture (`/forge/color/fieldGeometry`, `/forge/color/fieldGesture`); optional peers `@expo/ui` + `expo-linear-gradient`; native build and device QA unverified | Forge PR #34 |
| Display color math (hex, RGBA, HSV) | `@nyc-tron/ui/components/forge/color` | Pure, tested; the one copy shared by ColorChannels and HsvPicker | Forge PR #26 / #34 |
| Corner-cut geometry | `@nyc-tron/geometry/corner-cut` | Pure geometry tests | NYC-MON NeonBlade port |
| WindowsNavigationView | Future native Windows adapter | **NOT IMPLEMENTED** | WinUI 3 NavigationView |
| Native dropdown/menu/flyout | Future target-specific adapters | **NOT IMPLEMENTED** | Spark AppKit, WinUI, Expo UI |
| AdaptivePanes/Inspector | Existing consumer implementation; extraction pending | **NOT EXTRACTED** | NYC-MON / Moyo |
| Multi-hinge region planner | `@nyc-tron/core/folds` | Pure contract/tests | NYC-MON adaptive geometry |
| Spatial panels | `@nyc-tron/core/spatial` | Pure specification, no renderer | Viro / spatial starter |
| PrecisionScrubber | `@nyc-tron/ui/components/forge/inputs/PrecisionScrubber` (math in `/forge/inputs/precision`, logic in `/forge/inputs/precision-scrubber-model`) | Controlled RN control; fine/normal/coarse, detents, one commit, cancel restores, forced colors, adjustable a11y. Model tests plus Chromium/React Native Web drag tests and light/dark/forced-colors captures (`packages/ui/tests/browser`); no device or screen-reader QA yet | Forge `studio-workspace/precision-scrubber.tsx` (PR #32) |
| DragGrabHandle | `@nyc-tron/ui/components/DragGrabHandle` | Controlled RN handle; start/move/commit/cancel, Escape and second-pointer cancel. Transport tests plus Chromium reorder/cancel test; no device QA yet | Forge `studio-workspace/drag-grab-handle.tsx` |
| Drag transports | `@nyc-tron/ui/components/gestures/PanResponderDrag` (default) and `/gestures/GestureHandlerDrag` (optional `react-native-gesture-handler` >=3.4 <4 peer) | Callback logic tested with mocked RN/RNGH; native recognition unverified on device | Forge `studio-gesture.tsx` / `studio-gesture.native.tsx` |
| Track/mixer/fader / EQ controls | `components/forge/audio/` planned | **NOT EXTRACTED** | Forge Cadence work |
| Timeline/tracks/edit handles | `components/forge/timeline/` planned | **NOT EXTRACTED** | Forge Splice work |
| Layers, brushes, paint controls | `components/forge/graphics/` planned | **NOT EXTRACTED** | Forge Prism work |
| Eyedropper / canvas sampling | `components/forge/color/` planned | **NOT EXTRACTED** (needs a Board pixel-sampling API; HSV picker is extracted above) | Forge PR #34 |
| Native whiteboard/ink / Muse tools | `components/forge/ink/` planned | **NOT EXTRACTED** | Forge PRs #18–20 |
| Paste/fill into a range | SpreadsheetGrid | **DEFERRED** until Tally exposes a batch `setRange` (copy, frozen panes and formula highlights are in SpreadsheetGrid) | Forge Tally |
| Text editor/typography | `components/forge/document/` planned | **NOT EXTRACTED** | Forge Quill |
| PDF annotations | `components/forge/pdf/` planned | **NOT EXTRACTED** | Forge Folio |
| Slide/canvas transitions | `components/forge/slides/` planned | **NOT EXTRACTED** | Forge Pitch |
| Unified icon glyphs/Rive | `components/icons/` planned | **NOT EXTRACTED** | Forge PR #21 |

**Important:** An npm import subpath chooses one entry point, not an independent
npm installation. Avoid grouping heavy optional native backends into a single
JS entry. Once package sizes are measurable, release separate optional packages
per native capability if necessary. All components still have ONE source owner
in NYC-Tron UI.

Use `unstyled` with a complete app-authored Tailwind recipe when the desired
visual style conflicts with the library's default recipe. This keeps Moyo's
neubrutalist strokes/shadows distinct from NYC-MON's cut-corner look and from
Forge's professional dark editor controls.

### Responsive table split

`@nyc-tron/ui/components/data/DataTable` is a TanStack Table v9 native
record list: it renders mobile label/value cards inside narrow panes and
full columns in wide ones.

`@nyc-tron/ui/components/forge/SpreadsheetGrid` is a **true**
editable coordinate sheet: on mobile it retains rows/column headers and
horizontal scrolling, stacks the formula bar, and expands touch targets.
It receives data from the separate Tally Rust engine, not from a fake
TanStack document engine.

Read [Responsive tables](RESPONSIVE_TABLES.md) for limitations and mobile
acceptance gates.

## Forge package choices

```text
Image:         @nitro-forge/prism     + /forge/* graphics controls you need
Audio:         @nitro-forge/cadence   + /forge/WaveformLane etc.
Video:         @nitro-forge/splice    + /forge/NativeSeekBar etc.
Documents:     @nitro-forge/quill     + /forge/document/* controls
Spreadsheets:  @nitro-forge/tally     + /forge/spreadsheet/* controls
Slides:        @nitro-forge/pitch     + /forge/slides/* controls
PDF:           @nitro-forge/folio     + /forge/pdf/* controls
All editors:   the consumer installs the above packages; there is no new
               monolithic native engine dependency inside NYC-Tron UI.
```

Some of these package names currently exist only on Nitro Forge draft PRs.
Do not claim npm availability or cross-platform native completion until
their respective distributions and PRs pass.

## 2026-11-04 advanced controls

PR #2 adds source-level prototype controls: InstrumentKnob/InstrumentXYPad, TreeGrid, PatchGraph, ImageCropOverlay and CommandPopover. All source resides in NYC-Tron (not Forge). See [the advanced native catalog](ADVANCED_NATIVE_COMPONENTS.md) and @nyc-tron/core/advanced-catalog for complete planned ports and review gates. Native OS adapters, device QA and source licenses are **not** completed by this extraction.

## 2026-11-05 PrecisionScrubber and DragGrabHandle

Both controls are controlled: the app passes the committed value (scrubber) or owns
the dragged item's position (handle), and each completed gesture produces one
`onCommit`. Neither control holds engine or document state.

Gesture recognition is injected through the `transport` prop. The default,
`PanResponderDrag`, needs no extra dependency. Native apps that mount
`GestureHandlerRootView` can pass `GestureHandlerDrag` instead. It is a separate
subpath, so `react-native-gesture-handler` stays an optional peer and is never
loaded by the scrubber or handle entry points. It uses the RNGH 3 `Gesture`
builder, which RNGH 3 marks deprecated in favour of `usePanGesture` /
`useTapGesture`; it matches the Forge source this was extracted from and should
move to the hook API together with Forge.

`PanResponderDrag` refuses responder termination requests once a drag is
granted. The Forge source allowed them, and in the browser run a parent
`ScrollView` then took the responder on vertical travel, so the fine/coarse
gesture never registered. The OS can still terminate the drag, which cancels it.

On web the forced-colors scale uses `var(--nyc-tron-canvas-text, CanvasText)`
and `var(--nyc-tron-highlight, Highlight)`: React Native Web drops bare system
color keywords. The handle's grip bars are top borders so forced colors keeps
them visible without a prop.

The forced-colors flag is a prop (`forcedColors`), since detecting it is the app's
job. The handle's default glyph is three bars drawn with views; pass `children` to
use an app icon.

## 2026-11-05 HSV picker

`HsvPicker` moved from Nitro Forge PR #34 (`NativeHsvPicker`) into
`packages/ui/src/components/forge/color/`. It is controlled: `value` and
`onValueChange` carry one `HsvColor`, `onApply` and `onCancel` let the Forge
host open and close its own undo transaction, and the picker keeps no color
state. `parseHexColor`, `rgbToHsv`, `hsvToRgb`, `assertHsv` and `wrapHue`
were added to the existing `/forge/color` module, which `ColorChannels` also
imports; there is no second copy of the math.

Screen readers adjust saturation with swipe up/down and reach brightness and
hue through named actions. Saturation and brightness also have 44pt
steppers. The picker has no animation. Consumers that import this subpath
must install `@expo/ui` and `expo-linear-gradient`; other subpaths do not
need them.

Labels (hue, hex, RGBA channels) are app-token RN `Text`; the `@expo/ui`
hosts carry only the sliders. `@expo/ui` Text follows the OS appearance, so
with a dark app theme on a light-mode device it drew black labels on the
dark surface. The universal `@expo/ui` Slider takes no accessible label, so
the hue slider is unnamed; the field's named hue actions are the labeled
path. An opacity-only channel edit keeps h/s/v exactly (`rgbaEditToHsv`).

Verified: source, types, unit tests, package exports, and a
react-native-web render in Chromium with the real `@expo/ui` and
`expo-linear-gradient` web builds (phone and tablet widths, light and dark,
and app theme opposite to the OS scheme). Synthesized touch drags on the
field kept the page from scrolling. Not verified: iOS, Android or foldable
device runs, and VoiceOver/TalkBack output.

## 2026-11-05 studio shell layout (A-03, A-04, A-05, A-06, A-25)

Five Nitro Forge roster controls live in `packages/ui/src/components/shell/`.
Each is controlled: the app passes the size, layout, tab order, active tool
or zoom and gets one proposal per completed change. None of them holds
document state.

`PaneSplitter` and `AdaptiveDock` read hinge geometry as `FoldFeature`
values from `@nyc-tron/core/folds` (a type-only import; `@nyc-tron/core` is
an optional peer of `@nyc-tron/ui`). A splitter given features measures its
own window rect unless the app passes `container`. Its divider never rests
on a hinge: within reach of one it seats on the hinge and spans it, so
neither pane draws under the hinge, and when seating would break a minimum it
moves to the side that keeps it. Split order is physical; `isRTL` puts the
start pane on the right and flips the arrow keys.

`AdaptiveDock` edges are physical. An app that wants left and right mirrored
in RTL swaps them in its layout. Every dock move has a menu path (move to
another edge, float, close); dragging a floating panel's grip onto an edge
also docks it. Below `compactBelow` (600pt by default) every panel joins one
stack under the workspace, and picking a tab there moves that panel into the
bottom stack so the choice survives a return to the wide layout.

`DocumentTabBar` reorders from the keyboard (Ctrl/Cmd+Shift+Arrow) and from
screen-reader actions. **Deferred:** pointer drag reordering of tabs. A tab
is a press target inside a horizontally scrolling strip, and the
`PanResponderDrag` transport cannot share that view with the press without
taking the strip's scroll gesture. It needs a long-press-then-pan composition
on the gesture-handler transport, tested on devices.

`ToolRail` tools are toggle buttons (`aria-pressed`) in a `toolbar`.
Grouped tools open their variants in a `CommandPopover` on long press, on the
arrow key pointing away from the rail's edge, or through the "More tools"
screen-reader action. The rail shows the active variant, else the app's
`groupSelection`, else the first variant.

`StatusBar` announces activity changes once through a polite live region.
The recording clock and the render percentage are left out of the
announcement; the progress bar exposes the percentage.

Glyphs these controls draw (splitter line, close crosses, menu dots, zoom
signs, unsaved marker, progress fill) are borders, so forced-colors mode
keeps them.

Verified: unit tests for the split, dock, tab, status and roving-focus
models; Chromium/React Native Web interaction tests for every control
(`packages/ui/tests/browser/shell-layout.spec.mjs`) and captures at 390 and
834px in light, dark, RTL, forced colors and with a simulated hinge. Not
verified: iOS, Android, Surface Duo or other foldable devices, real hinge
features from a device, VoiceOver/TalkBack/Narrator output, and the
GestureHandlerDrag transport with these controls.

## 2026-11-05 studio shell inspector and inputs (A-09, A-10, A-11, A-13, A-14, A-15, A-16, A-21)

`UnitInput` parses with a recursive-descent parser over a fixed token set:
numbers, the unit names in `UNITS`, `+ - * / ( )`. It never calls `eval` or
`Function`, rejects any other word, and stops at 128 characters, 64 tokens
or 8 levels of nesting. Values are stored in the dimension's base unit
(pixels at 96 per inch, seconds, decibels, or a ratio), so changing the
display unit never changes the value. Bare numbers in a sum take the
display unit; `12mm * 2` doubles, `4 / 2mm` and `2mm * 3mm` are errors.
Frames, samples and length percentages need `frameRate`, `sampleRate` and
`percentOf` in the context and say so when they are missing. Enter commits
and keeps focus, so a parse error stays next to the text; leaving the field
with unparseable text restores the value and shows "Not applied".

`SliderField`, `RangeSlider` and `RotaryKnob` take one `onCommit` per drag,
key press, typed entry, screen-reader action or reset, and `onPreview` for
live canvas updates. Typed entry in all three is a `UnitInput`. The knob's
`input="circular"` is the stylus path: the value follows the pen's angle
and holds at an end across the 90-degree gap at the bottom. The app chooses
it, because React Native's responder events do not report the pointer type.

**Native choice:** @expo/ui 58 has a SwiftUI and a Compose `Slider` (but no
range slider or knob). `@nyc-tron/expo-controls/NativeSliderField` renders
them with the SliderField label, entry and Reset around them and commits on
`onEditingChanged(false)` / `onValueChangeFinished`. The universal
`@expo/ui` Slider reports neither, so it is not used. Its web entry is the
RN `SliderField`. The inspector section switch is React Native's `Switch`
(the platform control on iOS and Android); on web it takes the theme
tokens through `var()`.

`InspectorPanel` filters through a small registry: each `PropertyRow`
reports whether it matches the query, sections hide when nothing in them
matches, and matching sections show open without changing their controlled
`expanded` value. Mixed values are the app's call: the row shows "Mixed"
and the editor gets `mixed` and an accessible name ending in "mixed values".

Directional layout uses leading spacers and flex order, not
`paddingStart`/`marginStart`: React Native Web resolves start/end from
`I18nManager`, not from the CSS `direction` a web app sets, and the first
RTL capture showed indents and the search glyph on the wrong side.

Verified: parser, slider, range, knob and registry unit tests; Chromium/
React Native Web interaction tests for every control
(`packages/ui/tests/browser/shell-inspector.spec.mjs`) and captures at 390
and 834px in light, dark, RTL, forced colors and the three selection states.
Not verified: the SwiftUI/Compose `NativeSliderField` on a device (source
and types only), iOS/Android rendering of the RN controls, stylus input on
hardware, and screen-reader output.
