# Component inventory and ownership

The **source owner** for every reusable generic or professional Forge control is
`NYC-Tron-UI/packages/ui/src/components/`. Nitro Forge owns document engines,
complex editor screen composition and its cross-engine suite application.

| Component | Source owner / import | Implementation status | Prior source |
| --- | --- | --- | --- |
| Button | `@nyc-tron/ui/components/Button` | RN semantic foundation | NYC-MON Button, Moyo Button |
| Card | `@nyc-tron/ui/components/Card` | RN semantic foundation | NYC-MON / Moyo Card |
| Select | `@nyc-tron/ui/components/Select`; platform picker via `@nyc-tron/expo-controls/Select` | Token-styled select-only combobox (APG): activedescendant, arrows, Home/End, typeahead, Escape; in-flow list on native. The expo-controls entry renders NativeDropdown (SwiftUI Picker / Material exposed dropdown) on iOS/Android and keeps the combobox for a placeholder value or a disabled row. Chromium tests; native picker build unverified on device | NYC-MON `Select` |
| SegmentedControl | `@nyc-tron/ui/components/SegmentedControl` | Radio group, roving tabindex, arrows flipped in RTL, disabled segments skipped, 44pt segments that wrap. Chromium tests | NYC-MON `SegmentedControl` |
| TabBar | `@nyc-tron/ui/components/TabBar` | `tabs` (tablist, selection follows arrows) or `navigation` (links, `aria-current="page"`); `compact` pane density. Chromium tests | NYC-MON `TabBar` |
| Toolbar | `@nyc-tron/ui/components/Toolbar` | Leading slot, title as heading, trailing `role="toolbar"` group with web arrow-key focus. Chromium tests | NYC-MON `Toolbar` |
| List / ListItem | `@nyc-tron/ui/components/List` | Short grouped rows (`list`/`listitem`); pressable rows speak title plus supporting text. Not a virtualized list. Chromium tests | NYC-MON `List` web fork |
| IconButton | `@nyc-tron/ui/components/IconButton` | Icon passed as a child node (no icon dependency); 44/48pt; `selected` exposes toggle state. Aligns with the icon package once #15 merges. Chromium tests | NYC-MON `IconButton` |
| FieldGroup / FieldGroup.Section | `@nyc-tron/ui/components/FieldGroup` | Titled field block, `group` named by its heading, optional footer. Chromium render | NYC-MON `FieldGroup` |
| NavigationRail / Shell | `@nyc-tron/ui/components/NavigationRail` | Controlled RN shell, NOT WinUI | NYC-MON / Moyo adaptive |
| DataTable | `@nyc-tron/ui/components/data/DataTable` | TanStack Table v9 headless + custom RN renderer; source/typecheck | Moyo / NYC-MON headless table patterns |
| SpreadsheetGrid | `@nyc-tron/ui/components/forge/SpreadsheetGrid` | Custom two-axis viewport, frozen panes, range selection, keyboard, TSV copy and formula reference highlights; native QA pending | Forge Tally Rust adapter PR #39 |
| WaveformLane | `@nyc-tron/ui/components/forge/WaveformLane` | Source extracted, RN UI | Forge PR #25 / #35 |
| NativeSeekBar | `@nyc-tron/ui/components/forge/NativeSeekBar` | Source extracted, Expo 58 @expo/ui; native build unverified | Forge PR #25 |
| Timebase math | `@nyc-tron/ui/components/forge/timebase` | Pure: frame clamp/position, `framesToSeconds`/`secondsToFrame`, SMPTE timecode; ported PR #25 tests | Forge PR #25 |
| ColorChannels | `@nyc-tron/ui/components/forge/ColorChannels` | Source extracted, Expo 58 @expo/ui; native build unverified | Forge PR #26 / #34 |
| Banner | `@nyc-tron/ui/components/feedback/Banner` | RN notice: info/success/danger/neutral tones, polite or assertive live region, optional 44pt dismiss and action slot. Chromium/React Native Web tests and captures; no device or screen-reader QA yet | NYC-MON `@acme/ui` Banner |
| Badge | `@nyc-tron/ui/components/feedback/Badge` | Static RN status chip, neutral/info/success/danger/accent. Chromium captures only | NYC-MON `@acme/ui` Badge (neutral tone path) |
| EmptyState | `@nyc-tron/ui/components/feedback/EmptyState` | RN empty state: heading title, honest description slot, `action` or `exitAction` exit. Chromium tests | NYC-MON `@acme/ui` EmptyState |
| ErrorMessage | `@nyc-tron/ui/components/feedback/ErrorMessage` | RN inline alert with a drawn mark; renders nothing without a message. Chromium tests | NYC-MON `@acme/ui` ErrorMessage |
| KeyValueList | `@nyc-tron/ui/components/content/KeyValueList` | RN record fields; two columns from 600pt of its own measured width. Chromium tests at 390 and 834 px | NYC-MON `@acme/ui` KeyValueList |
| NightScope | `@nyc-tron/ui/components/theme/NightScope` | Delegates to Uniwind `ScopedTheme` (optional peer). Chromium test uses a shim of Uniwind's web output; native Uniwind scoping not run here | NYC-MON `@acme/ui` NightScope |
| DropZone | `@nyc-tron/ui/components/files/DropZone` | Web: DOM drag listeners on the view's node, `accept` filtering, built-in FilePicker. Native: expo-drag-drop-content-view 0.9.2 (optional peer). Web drop tested in Chromium; **native drop not run on a device** | NYC-MON `@acme/ui` DropZone (.web/.native) |
| FilePicker | `@nyc-tron/ui/components/files/FilePicker` | Web: button that opens the system chooser. Native: renders nothing (**DEFERRED**, see below) | NYC-MON `@acme/ui/html` FilePickerBase |
| Semantic html set | `@nyc-tron/ui/components/html` (Page, Main, Header, Footer, Section, Nav, Article, Aside, Text, Paragraph, Heading, Link, Input) | Web: real elements through React Native Web's element factory. Native: View/Text with ARIA `role`. Web tested in Chromium; native roles typechecked only | NYC-MON `@acme/ui/html` |
| HsvPicker | `@nyc-tron/ui/components/forge/color/HsvPicker` | Source extracted with unit-tested field geometry/gesture (`/forge/color/fieldGeometry`, `/forge/color/fieldGesture`); optional peers `@expo/ui` + `expo-linear-gradient`; native build and device QA unverified | Forge PR #34 |
| Display color math (hex, RGBA, HSV) | `@nyc-tron/ui/components/forge/color` | Pure, tested; the one copy shared by ColorChannels and HsvPicker | Forge PR #26 / #34 |
| ColorWheel (C-03) | `@nyc-tron/ui/components/forge/color/ColorWheel` (geometry in `/forge/color/wheel-geometry`) | Controlled RN hue ring: jump on the ring, fine adjustment inside the hole, keys, adjustable a11y. Model tests plus Chromium drag/key tests | ProCraft `ColorPanel.kt` (ported, MIT OR Apache-2.0) |
| AlphaSlider (C-05) | `@nyc-tron/ui/components/forge/color/AlphaSlider` | Controlled RN checkerboard opacity track with typed percent entry; one commit per release, key or entry | Original |
| ColorChannelFields (C-06) | `@nyc-tron/ui/components/forge/color/ColorChannelFields` (math in `/forge/color/hsl`, `/forge/color/channel-fields`) | Typed RGB/HSL/HSV, hex and opacity fields; closes the HSL gap next to the `ColorChannels` sliders | Original |
| ForegroundBackgroundChips (C-12) | `@nyc-tron/ui/components/forge/color/ForegroundBackgroundChips` (`/forge/color/color-pair`) | Controlled chips with Swap and Reset | Original |
| SwatchGrid (C-13) | `@nyc-tron/ui/components/forge/color/SwatchGrid` (`/forge/color/swatches`) | Recent/document/saved/named groups, name and hex search, honest empty states, arrow-key focus | Original |
| ColorHarmonyAssistant (C-18) | `@nyc-tron/ui/components/forge/color/ColorHarmonyAssistant` (`/forge/color/harmony`, `/forge/color/contrast`) | Five harmony rules and WCAG 2.2 contrast spelled out per color | Original |
| FloatingColorPalette (C-26) | `@nyc-tron/ui/components/forge/color/FloatingColorPalette` (`/forge/color/floating-palette`) | Dock/undock palette with compact/classic/palettes modes; hinge-safe placement; holds no color | ProCraft `ColorPanel.kt` (ported) |
| ColorDiscPicker (C-27) | `@nyc-tron/ui/components/forge/color/ColorDiscPicker` | Hue/saturation disc and brightness track; hue kept through gray; sRGB preview only | ProCraft `ColorPanel.kt` (ported geometry) |
| FloatingPaletteUndockHandle (B-28) | `@nyc-tron/ui/components/forge/color/FloatingPaletteUndockHandle` | `DragGrabHandle`-based grip: 30-unit undock threshold, move, dock, keyboard nudge | ProCraft `ColorPanel.kt` (ported) |
| Corner-cut geometry | `@nyc-tron/geometry/corner-cut` | Pure geometry tests | NYC-MON NeonBlade port |
| WindowsNavigationView | Future native Windows adapter | **NOT IMPLEMENTED** | WinUI 3 NavigationView |
| Native dropdown/menu/flyout | Future target-specific adapters | **NOT IMPLEMENTED** | Spark AppKit, WinUI, Expo UI |
| AdaptivePanes/Inspector | `@nyc-tron/panes/AdaptivePaneHost` (takes `regions` from `useReservedRegions`) | RN host over `@nyc-tron/core/pane-plan`; NYC-MON `@acme/ui/adaptive-panes` UI parts not extracted | NYC-MON / Moyo |
| Multi-hinge region planner | `@nyc-tron/core/folds` | Pure contract/tests; also owns `ReservedRegion` types, `foldLayoutsFromRegions`, `foldFeaturesFromRegions`, `foldPostureFromRegions`, single and multi-hinge vertical pane plans and the trailing inspector layout | NYC-MON adaptive geometry; Forge PR #4 `adaptive-layout/fold-layout.ts` |
| Fold / hinge / camera regions | `@nyc-tron/reserved-regions` (`useReservedRegions`, `ReservedRegionsOverride`) | Expo Modules 2 native module: Kotlin WindowInfoTracker FoldingFeature, Swift iOS 27.1 `UIView.reservedRegions`, web Viewport Segments. Source contracts, mocked hook tests and CI Android/iOS compile; no foldable-device or iOS 27.1 runtime QA yet | NYC-MON `reserved-regions*` + `apps/mobile/modules/reserved-regions`; Forge `apps/example/modules/reserved-regions` |
| Spatial panels | `@nyc-tron/core/spatial` | Pure specification, no renderer | Viro / spatial starter |
| PrecisionScrubber | `@nyc-tron/ui/components/forge/inputs/PrecisionScrubber` (math in `/forge/inputs/precision`, logic in `/forge/inputs/precision-scrubber-model`) | Controlled RN control; fine/normal/coarse, detents, one commit, cancel restores, forced colors, adjustable a11y. Model tests plus Chromium/React Native Web drag tests and light/dark/forced-colors captures (`packages/ui/tests/browser`); no device or screen-reader QA yet | Forge `studio-workspace/precision-scrubber.tsx` (PR #32) |
| DragGrabHandle | `@nyc-tron/ui/components/DragGrabHandle` | Controlled RN handle; start/move/commit/cancel, Escape and second-pointer cancel. Transport tests plus Chromium reorder/cancel test; no device QA yet | Forge `studio-workspace/drag-grab-handle.tsx` |
| Drag transports | `@nyc-tron/ui/components/gestures/PanResponderDrag` (default) and `/gestures/GestureHandlerDrag` (optional `react-native-gesture-handler` >=3.4 <4 peer) | Callback logic tested with mocked RN/RNGH; native recognition unverified on device | Forge `studio-gesture.tsx` / `studio-gesture.native.tsx` |
| LevelFader + level math | `@nyc-tron/ui/components/forge/audio/LevelFader`, `.../forge/audio/level` | Controlled RN responder fader (value/onChange/onCommit), dB travel, unit + mocked-host render tests; native device QA pending | Forge PR #25 `NativeLevelSlider` |
| Track/mixer / EQ controls | `components/forge/audio/` planned | **NOT EXTRACTED** | Forge Cadence work |
| Rational time model (frames, samples, timecode) | `@nyc-tron/ui/components/forge/timeline/time` (reuses `/forge/timebase`) | Pure, tested: BigInt frame/sample conversion, drop-frame parse, typed-time parse | Original |
| SeekBar (D-04) | `@nyc-tron/ui/components/forge/timeline/SeekBar` | RN seek track with played and buffered ranges and a drag-end commit; `NativeSeekBar` stays the `@expo/ui` variant | Original |
| TransportControls (D-06) | `@nyc-tron/ui/components/forge/timeline/TransportControls` | Play/pause, stop, jumps, frame steps, keyboard; not mirrored in RTL | Original |
| PlaybackRateMenu (D-07) | `@nyc-tron/ui/components/forge/timeline/PlaybackRateMenu` | Rates, optional reverse, optional preserve-pitch switch | `speedLabel` ported from FilmCraft `TimelineMath.kt` |
| TimecodeDisplay (D-08) | `@nyc-tron/ui/components/forge/timeline/TimecodeDisplay` | Timecode (drop-frame), frames, seconds, sample clock; editable | Original |
| TimelineRuler (D-10) | `@nyc-tron/ui/components/forge/timeline/TimelineRuler` (`/forge/timeline/ruler`) | Frame/second/minute steps, marks, drag-to-seek | FilmCraft `TimelineMath.kt` (ported, MIT OR Apache-2.0) |
| TimelinePlayhead (D-11) | `@nyc-tron/ui/components/forge/timeline/TimelinePlayhead` (`followPlayhead` in `/forge/timeline/viewport`) | Line across lanes, 44pt adjustable head, pinned at the edge when off screen | Original |
| InOutRangeHandles (D-12) | `@nyc-tron/ui/components/forge/timeline/InOutRangeHandles` (`setMark` in `/forge/timeline/edits`) | Set in/out at playhead, draggable adjustable marks | Original |
| TimelineZoomAndScroll (D-14) | `@nyc-tron/ui/components/forge/timeline/TimelineZoomAndScroll` (`/forge/timeline/viewport`) | Zoom about the playhead, fit selection/all, mini-map; pinch and Ctrl/Cmd-wheel in the clip lane | Zoom limits ported from FilmCraft |
| TimelineClipLane (D-15) | `@nyc-tron/ui/components/forge/timeline/TimelineClipLane` (`/forge/timeline/edits`) | Multi-track lanes, visible-only mounting, select, move with snapping and overlap refusal, pan, pinch, `renderClipContent` for thumbnails | Original |
| ClipTrimHandles (D-19) | `@nyc-tron/ui/components/forge/timeline/ClipTrimHandles` | Head/tail trims, speed-aware, media and neighbour limits, apply order for Splice | FilmCraft `Timeline.kt` trim drag (ported) |
| RazorSplitTool (D-20) | `@nyc-tron/ui/components/forge/timeline/RazorSplitTool` | Razor toggle and split at playhead; ripple deferred | Original |
| SafeAreaOverlay (D-25) | `@nyc-tron/ui/components/forge/timeline/SafeAreaOverlay` (`/forge/timeline/safe-area`) | SMPTE/legacy safe areas, aspect mattes, thirds, center | Original |
| Track headers (D-18) | `components/forge/timeline/` | **DEFERRED**: Splice tracks have no lock/hide/mute flags yet (add/remove only) | Forge Splice |
| LayerStack + layer model | `@nyc-tron/ui/components/forge/layers/LayerStack`, `.../forge/layers/layer-model` | Controlled RN list: visibility, opacity drag, reorder, rename, optional `kindLabel`, thumbnail and `onRemove`. Model tests, mocked-host render tests and Chromium/React Native Web remove and keyboard tests; no device or screen-reader QA yet | Forge Prism layer panel |
| Brushes, paint controls | `components/forge/graphics/` planned | **NOT EXTRACTED** | Forge Prism work |
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
Audio:         @nitro-forge/cadence   + /forge/WaveformLane, /forge/audio/LevelFader etc.
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

## 2026-11-05 studio content and feedback primitives (part B)

Nitro Forge's studio host took these from NYC-MON's `@acme/ui`. They are now
NYC-Tron components; part A (Select, SegmentedControl, TabBar, Toolbar, List,
IconButton, FieldGroup) is a separate change.

### Forge slot map

| Forge slot or import | NYC-Tron import |
| --- | --- |
| `StudioUIComponents.Banner` | `Banner` from `@nyc-tron/ui/components/feedback/Banner` |
| `StudioUIComponents.Badge` | `Badge` from `@nyc-tron/ui/components/feedback/Badge` |
| `StudioUIComponents.EmptyState` | `EmptyState` from `@nyc-tron/ui/components/feedback/EmptyState` |
| `StudioUIComponents.ErrorMessage` | `ErrorMessage` from `@nyc-tron/ui/components/feedback/ErrorMessage` |
| `StudioUIComponents.KeyValueList` | `KeyValueList` from `@nyc-tron/ui/components/content/KeyValueList` |
| `StudioUIComponents.NightScope` | `NightScope` from `@nyc-tron/ui/components/theme/NightScope` |
| `StudioUIComponents.DropZone` | `DropZone` from `@nyc-tron/ui/components/files/DropZone` |
| `@acme/ui/studio-controls/web` `FilePicker` | `FilePicker` from `@nyc-tron/ui/components/files/FilePicker` |
| `@acme/ui/html` `Page`, `Main`, `Header`, `Footer`, `Section`, `Nav`, `Text`, `Heading`, `Paragraph`, `Link`, `Input` | same names from `@nyc-tron/ui/components/html` |

`packages/ui/tests/forge-slots.typecheck.tsx` copies Forge's slot prop types
and assigns each component to its slot, so `pnpm typecheck` fails if a
component stops accepting what Forge passes.

Props Forge passes that no longer pick colors: `EmptyState` `tone`
(`royal`/`carolina`) and `KeyValueList`/`ErrorMessage` `surface`. They are
accepted so call sites compile; colors come from the app's tokens and the
nearest `NightScope`. Forge's studio preview clears the DropZone well with
`className="border-0 p-0 ..."`; pass `unstyled` instead, since two
conflicting utilities resolve by stylesheet order, not by their order in the
string.

### Decisions

- **Semantic set on web (BUILD).** React Native Web's `unstable_createElement`
  emits `<main>`, `<header>`, `<section>`, `<h2>`, `<a>` with RN style and aria
  handling. A View with `role` reaches most of these elements too but always
  writes the role attribute, so a header nested in a section would announce a
  second page banner. The elements get RN View's flex-column defaults;
  text elements default to `dir="auto"` like RNW Text and inherit the page font.
- **Native semantic set (BUILD).** View/Text with the ARIA `role` prop, never
  `accessibilityRole`, whose Android enum throws on landmark roles. Landmarks
  are silent to VoiceOver and TalkBack. A native `Link` opens only absolute
  `http(s):`, `mailto:` and `tel:` hrefs; an app-router path needs `onPress`,
  and without it the link renders as plain text, not a link that does nothing.
- **FilePicker on native (DEFER).** The contract hands the app `File`
  objects, which React Native does not have, and the kit has no
  document-picker peer. A native adapter returning URIs would be a different
  contract and lands as its own subpath. Until then native FilePicker renders
  nothing, and native apps take files through DropZone or their own picker.
- **DropZone web without expo-drag-drop-content-view (BUILD).** Its 0.9.2 web
  bundle ships JSX in a `.js` file that Vite/Rolldown parse as JavaScript. The
  web fork attaches `dragenter`/`dragover`/`dragleave`/`drop` listeners to the
  view's DOM node and keeps the package's `DropAsset` shape.
- **NightScope (BUILD).** Delegates to Uniwind's `ScopedTheme`, which on web
  renders a `display: contents` element with the theme class and on native
  resolves the theme's variables. The app's theme CSS must scope that class.
- **Status tones (BUILD).** `info` and `success` join `TronTheme` as optional
  tokens; see THEME_TOKENS.md.
- **Marks drawn with views.** Banner, ErrorMessage and Badge marks are views
  with borders, so forced colors keeps them; pass `icon` to Banner for the
  app's icon set.

### Verified, and not

Chromium through React Native Web (`packages/ui/tests/browser`,
`primitives.spec.mjs`): semantic elements and attributes, live regions, 44pt
dismiss, keyboard dismiss, accept filtering on drop, one enter per drag, the
file chooser path, NightScope colors on a light page, KeyValueList columns at
390 and 834 px, RTL, plus light/dark, focus, drag-over and forced-colors
captures. Not run: iOS/Android rendering, expo-drag-drop-content-view drops on
a device, Uniwind's native ScopedTheme, screen readers, Safari and Firefox.
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

## 2026-11-05 level fader and timebase helpers

Forge PR #25 `NativeLevelSlider` moves here as
`components/forge/audio/LevelFader`, per Nitro Forge PR #38 (Forge imports
NYC-Tron UI; NYC-Tron never imports Forge). The source fired its callback on
every slider move. LevelFader keeps the same linear-gain `value` but splits
the callback: `onChange` previews during a drag, `onCommit` fires once on
release or once per button/screen-reader step, and a cancelled drag restores
`value` without committing. Travel is linear in dB between `range.minDb` and
`range.maxDb`, with silence at the bottom. It draws its own track instead of
wrapping `@expo/ui` Slider, so it has no Expo host requirement.

`framesToSeconds`/`secondsToFrame` join the existing `forge/timebase` module;
there is no second timebase file. WaveformLane's math works on signed sample
extrema and has no dB conversion, so `audio/level.ts` shares nothing with it.

The fader claims a touch only after 4 pt of travel-axis movement and then
keeps it, so cross-axis swipes scroll a parent ScrollView and a same-axis
ScrollView cannot cancel a drag halfway. Arrow keys step a focused track.

Verified: unit tests, a mocked-host render test of the real component and
PanResponder config, and a react-native-web render in Chromium (phone and
tablet widths, light and dark, RTL). In that browser run, synthesized touch
drags moved vertical and horizontal faders, a horizontal swipe across a
vertical fader scrolled the mixer without a gain change, a vertical swipe
on a horizontal fader scrolled the page, and Tab plus arrow keys stepped the
level. Not verified: iOS/Android/Windows/macOS device gestures, native
ScrollView arbitration, and VoiceOver/TalkBack/Narrator output.

## 2026-11-05 color cluster

C-03, C-05, C-06, C-12, C-13, C-18, C-26, C-27 and B-28 live in
`packages/ui/src/components/forge/color/`, one subpath each, with their pure
models on separate subpaths. Every control is controlled: the host passes the
committed color and gets `onPreview` during a drag and one `onCommit` per
release, key press, typed entry or button. Escape during a drag restores the
start value without a commit. The floating palette and its grip hold no color;
whatever picker the host renders in each mode edits the host's one color
store, so docking, undocking and switching modes never change a color.

None of these controls needs an optional peer. Tracks, the hue ring and the
hue/saturation disc are drawn from solid views: `expo-linear-gradient` and
Skia are not required by these subpaths, and React Native has no conic
gradient. The color values in those segments are computed from the color
model, not theme colors; every surface, border, ring and label uses the
documented tokens.

`wrapHue` now returns in-range hues unchanged. The modulo form turned 217.4
into 217.39999999999998 and atan2's `-0` into `-0`, which made HSL edits
drift the hue by float error.

Decisions recorded here:

- **Wide-gamut preview (part of C-27): DEFERRED.** The disc previews sRGB
  only. Display P3 needs the owning engine's color management and a P3
  rendering path; drawing P3 values through sRGB views would be wrong.
- **`ColorChannels` keeps its `@expo/ui` RGB sliders.** HSL and HSV arrive as
  typed fields in `ColorChannelFields` rather than more native sliders, so the
  numeric path renders on web and needs no optional peer.
- **Sliders mirror under RTL; the hue ring and disc do not.** Hue angles are a
  color-model convention, not reading direction. On web, pass `rtl`;
  `I18nManager.isRTL` is the native default.

Verified: types, unit tests for every model (HSL/HSV round trips at a grid of
values, WCAG reference contrasts, ring and disc geometry, fine-zone drag,
hinge avoidance, swatch search and grid keys, single-commit gestures), package
exports, and React Native Web in Chromium: drag, cancel, key and typed-entry
tests (`tests/browser/color.spec.mjs`) plus captures at 390 and 834 px in light
and dark, floating over a simulated hinge, and RTL. Not verified: iOS, Android
or foldable device runs, VoiceOver/TalkBack output, and pinch or pen input.

ProCraft source: `ColorPanel.kt` at commit
`c2f7518d03141c746a365f90d8df05a44ddef002`, MIT OR Apache-2.0. The ported
files carry the pin, the copyright line and a modification notice; both
license texts and ProCraft's NOTICE are in `licenses/`.

## 2026-11-05 timeline core

D-04, D-06, D-07, D-08, D-10, D-11, D-12, D-14, D-15, D-19, D-20 and D-25 live
in `packages/ui/src/components/forge/timeline/`, one subpath each, with the
pure models on `/time`, `/ruler`, `/viewport`, `/edits` and `/safe-area`.

**Time model.** Timeline positions are whole frames at a rational
`FrameRate` (`/forge/timebase`); audio positions are whole samples at an
integer rate. Frame/sample conversion uses BigInt, so 29.97 fps at 192 kHz
stays exact over a day. `framesToSamples` returns the first sample at or after
a frame's start (ceiling), so the round trip back to frames is exact. Seconds
appear only at the engine boundary: whole frames through `framesToSeconds` and
`secondsToFrame` from `forge/timebase` (re-exported by `/time`, not copied),
fractional media positions through `positionToSeconds`.

**Engine contract.** The lane, trim handles, razor and split button emit one
`TimelineEdit` per finished gesture (release, key press, screen-reader step or
button), never per move. Each edit carries frames for the UI and seconds for
an engine that stores seconds. A Forge adapter maps them onto Splice:

| Edit | Splice ops |
| --- | --- |
| `move` | `moveClip(id, startSeconds)` |
| `trim`, `order: "trim-only"` (tail) | `trimClip(id, inSeconds, outSeconds)` |
| `trim`, `order: "trim-then-move"` (head later) | `trimClip`, then `moveClip` |
| `trim`, `order: "move-then-trim"` (head earlier) | `moveClip`, then `trimClip` |
| `split` | `splitClip(id, atSeconds)` |

Splice's `trimClip` keeps a clip's start fixed, so a head trim is two ops; the
`order` field names the sequence that never overlaps a neighbour midway, and
the adapter applies both inside one undo group. Splice's `timeline` read maps
to `TimelineTrack[]` (`start_s`, `in_s`, `out_s`, `speed` to frames at the
sequence rate). `addClip` and `setSpeed` have no UI here; see below. The
browser fixture applies every edit to a seconds-based stand-in with Splice's
overlap rule, so the mapping above is exercised, not only typed.

Previews never cross the boundary: a move or trim that would overlap a
neighbour is drawn with a danger border and the text "Overlaps another clip",
and release commits nothing.

**Rendering.** `@shopify/react-native-skia` is not an optional peer of
`@nyc-tron/ui`, so dense lanes are React Native views with visible-range
mounting (`visibleClips`) rather than a Skia canvas. Time runs left to right
in RTL layouts, and transport controls are not mirrored, following Material
and Apple guidance for media controls; button rows and labels around them do
mirror.

Decisions recorded here:

- **D-18 TrackHeaders: DEFERRED** until Splice tracks carry lock/hide/mute/solo
  flags. Lanes show the track label meanwhile.
- **Ripple (part of D-20): DEFERRED.** Splice has no ripple op; emulating it
  as N `moveClip`s would not be one undo step.
- **`setSpeed` and `addClip` UI: DEFERRED** to D-22 (drag from the bin) and the
  speed-curve work. `PlaybackRateMenu` is player rate, not clip speed.
- **Mini-map thumbnails and filmstrips (D-16) and waveforms in clips (D-17)**
  are out of scope; `renderClipContent` is where a host draws them.

Verified: types, unit tests (drop-frame parse round trip for every frame of 20
minutes at 29.97 and 59.94, sample math at 44.1/48/192 kHz, ruler steps from
FilmCraft's own test values, zoom about an anchor, follow-playhead, move/trim
previews with snapping, overlap, media limits and speed, apply order, splits,
in/out marks, safe areas), package exports, and React Native Web in Chromium:
`tests/browser/timeline.spec.mjs` (13 tests: move, overlap refusal, trims in
each order, split and razor, ruler and playhead seeking, seek-bar Escape,
transport, timecode entry and formats, playback rate, in/out marks, zoom, fit,
pan, Ctrl/Shift wheel, clip keys, NTSC drop-frame entry) plus captures at 390
and 834 px in light and dark, NTSC with a scope matte, and RTL. Not verified:
iOS, Android or foldable devices, VoiceOver/TalkBack, real touch pinch, pen
input, and a real Splice engine (the fixture's stand-in follows its rules).

FilmCraft source: `TimelineMath.kt` and `Timeline.kt` at commit
`c41b58467edd28d098336286528159b24c5203b5`, MIT OR Apache-2.0. `ruler.ts` and
`ClipTrimHandles.tsx` carry the pin, the copyright line and a modification
notice; both license texts and FilmCraft's NOTICE are in `licenses/`. Nothing
from CapCraft (AGPL) was read into or copied to this code.

## 2026-11-05 LayerStack kind labels, thumbnails and remove

Moving the Forge Prism editor onto `LayerStack` needed three additions. All
are optional, so existing callers render as before.

- `LayerRow.kindLabel` replaces the built-in kind label ("Shape", "Pixel")
  under the name and in the spoken label, so Prism can show "Rectangle",
  "Ellipse" or "Raster". A blank value throws. `layerDetail(row)` returns the
  label the row will use.
- `LayerRow.thumbnail` is either `{fill}`, a colour from the layer's content,
  or `{node}`, an app-rendered preview clipped to a 28pt square. The row stays
  44pt or taller. The thumbnail is always hidden from screen readers; its
  optional `label` ("red fill") is read as part of the row label instead, so
  VoiceOver and TalkBack do not stop on it separately. When any row has a
  thumbnail, rows without one keep an empty slot so names stay in a column.
- `onRemove(id)` adds a remove button at the end of each row, a "Remove"
  screen-reader action, and Delete/Backspace on a focused row. Without the
  prop none of these exist. Locked rows show the button disabled and have no
  action or key. There is no confirmation dialog: removal is a host engine
  operation that the host's undo restores. `removeLayer(layers, id)` applies
  it to app state.

Two RTL fixes came with this. The selection strip is anchored with `start`
rather than `left`, and the opacity drag reads `dx` reversed when
`I18nManager.isRTL`, since the fill grows from the right edge there. On
narrow panes the opacity column shrinks to 88pt before the name drops below
96pt.

Verified: model tests, a mocked-host render test of the real component
(including a red run against the previous source), and a React Native Web
render in Chromium at 390 and 834 px in light and dark plus RTL. In that run,
pointer, Enter on the focused remove button and Delete on a focused row each
removed a layer, the fixture's undo restored it, and Backspace on a locked
row did nothing. Not verified: iOS, Android or foldable device runs, native
`onKeyDown` delivery, and VoiceOver/TalkBack reading of the custom action.

## 2026-11-05 NativeSeekBar transport follows the app theme

`@expo/ui` `Text` takes its colour from the OS scheme, so with a dark app
theme on a light-mode device the seek bar drew black timecode on the dark
surface. The `@expo/ui` host now carries only the slider, as in HsvPicker.
The step buttons are the kit `Button` (secondary, small) and the timecode is
an app-token RN `Text` in an RN row, so both follow the app theme. The
timecode takes the width between the buttons and wraps centred at 390px.
Verified by a Chromium check that the timecode uses the dark text token on a
light OS scheme, a check that the forward button stays inside the card at
390px, and dark/light captures at 390 and 834px. Not verified on iOS or
Android devices.

## 2026-11-05 studio form and navigation primitives (part A)

Select, SegmentedControl, TabBar, Toolbar, List, IconButton and FieldGroup.

### Studio host slots

Nitro Forge's `StudioUIProvider` takes these primitives directly. Forge's
`tone` props (`royal`, `carolina`) are accepted by its slot types and ignored
here: color comes from the host theme tokens, and active state uses
`primary`. Brand tones belong in the host's theme, not in component props.
NYC-MON's district tones and corner-cut frames were left behind for the same
reason.
