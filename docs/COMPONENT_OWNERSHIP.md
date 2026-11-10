# Component inventory and ownership

NYC-Tron owns reusable generic and professional controls. Shared RN presentation
lives in `packages/ui/src/components`; the independently exported native
adapters live in their own packages. Nitro Forge owns document engines, complex
editor composition and its cross-engine suite application.

The complete current source inventory is the [341-row canonical ledger](completion/library-progress.json).
The notes below describe individual capabilities and extraction history; native
acceptance must be checked against the exact revision in the
[candidate report](completion/reports/V1-RELEASE-GATES.md).

| Component | Source owner / import | Implementation status | Prior source |
| --- | --- | --- | --- |
| Button | `@nyc-tron/ui/components/Button` | RN semantic foundation | NYC-MON Button, Moyo Button |
| Card | `@nyc-tron/ui/components/Card` | RN semantic foundation | NYC-MON / Moyo Card |
| Select | `@nyc-tron/ui/components/Select`; platform picker via `@nyc-tron/expo-controls/Select` | Token-styled select-only combobox (APG): activedescendant, arrows, Home/End, typeahead, Escape; in-flow list on native; `groups` adds headed sections (grouped listbox on web). The expo-controls entry renders NativeDropdown (SwiftUI Picker / Material exposed dropdown) on iOS/Android and keeps the combobox for a placeholder value or a disabled row. Chromium tests; native picker build unverified on device | NYC-MON `Select` |
| SegmentedControl | `@nyc-tron/ui/components/SegmentedControl` | Radio group, roving tabindex, arrows flipped in RTL, disabled segments skipped, 44pt segments that wrap. Chromium tests | NYC-MON `SegmentedControl` |
| TabBar | `@nyc-tron/ui/components/TabBar` | `tabs` (tablist, selection follows arrows) or `navigation` (links, `aria-current="page"`); `compact` pane density, sized to its tabs so it fits a header row. Chromium tests | NYC-MON `TabBar` |
| Toolbar | `@nyc-tron/ui/components/Toolbar` | Leading slot, title as heading, trailing `role="toolbar"` group with web arrow-key focus. Chromium tests | NYC-MON `Toolbar` |
| List / ListItem | `@nyc-tron/ui/components/List` | Short grouped rows (`list`/`listitem`); pressable rows speak title plus supporting text. Not a virtualized list. Chromium tests | NYC-MON `List` web fork |
| IconButton | `@nyc-tron/ui/components/IconButton` | Icon passed as a child node (no icon dependency); 44/48pt; `selected` exposes toggle state. Aligns with the icon package once #15 merges. Chromium tests | NYC-MON `IconButton` |
| FieldGroup / FieldGroup.Section | `@nyc-tron/ui/components/FieldGroup` | Titled field block, `group` named by its heading, optional footer. Chromium render | NYC-MON `FieldGroup` |
| NavigationRail / Shell | `@nyc-tron/ui/components/NavigationRail` | Controlled RN shell, NOT WinUI | NYC-MON / Moyo adaptive |
| PaneSplitter (A-04) | `@nyc-tron/ui/components/shell/PaneSplitter` (math in `/shell/splitter-model`) | Controlled RN window splitter; minimums, hinge seating from `@nyc-tron/core/folds` features, keyboard, Escape cancel, native adjustable actions. Model tests plus Chromium drag, keyboard, hinge and RTL tests; no device QA | Original |
| AdaptiveDock (A-03) | `@nyc-tron/ui/components/shell/AdaptiveDock` (model in `/shell/dock-model`) | Controlled left/right/bottom stacks and floating panels; move/float/close menu, drag-to-dock from a floating grip, one merged stack on compact widths, floating panels kept inside one usable region. Model tests plus Chromium menu-move, drag-to-dock and compact tests; no device QA | Original; extends AdaptivePaneHost's role, does not replace it |
| DocumentTabBar (A-05) | `@nyc-tron/ui/components/shell/DocumentTabBar` (model in `/shell/document-tabs-model`) | Controlled dirty markers, activation and close proposals; web Ctrl/Cmd+Shift+Arrow reorder and native accessibility move actions. Pointer-drag tab reordering is not implemented; hardware-keyboard acceptance requires its own native evidence | Original |
| ToolRail (A-06) | `@nyc-tron/ui/components/shell/ToolRail` (model in `/shell/tool-rail-model`) | Controlled 44pt toggle tools, variant flyouts on long press, outward arrow or a11y action; app owns shortcuts | Original; NavigationRail stays the app-section rail |
| StatusBar (A-25) | `@nyc-tron/ui/components/shell/StatusBar` (text in `/shell/status-model`) | Controlled zoom steps and presets, unit menu, selection count, render/save/record/error state with polite announcements | Original |
| MenuButton | `@nyc-tron/ui/components/shell/MenuButton` | Button that anchors a CommandPopover; shared by the shell controls | Original |
| AnchoredPopover | `@nyc-tron/ui/components/overlays/AnchoredPopover` (types in `/overlays/anchored-popover-types`, `/overlays/useTriggerAnchor`, `/overlays/measure-anchor`) | Portable RN `Modal` popover placed by `placePopover`, from an `anchor` rect or a `trigger` it measures on open; web Tab cycling, Escape, focus return. It is the web presentation of `@nyc-tron/expo-controls/NativePopover`. Chromium tests | Moved from `NativePopover.web` |
| InspectorPanel (A-09) | `@nyc-tron/ui/components/shell/InspectorPanel` (model in `/shell/inspector-model`) | Controlled selection heading (none, single, multiple), empty state, search that hides non-matching rows and sections | Original |
| InspectorSection (A-10) | `@nyc-tron/ui/components/shell/InspectorSection` | Controlled disclosure, nesting, enable switch that disables rows inside, Reset while modified | Original |
| PropertyRow (A-11) | `@nyc-tron/ui/components/shell/PropertyRow` | Label + editor, Mixed marker, inherited/overridden state with Revert, stacks in narrow panes | Original |
| InspectorSearch (A-21) | `@nyc-tron/ui/components/shell/InspectorSearch` (`matchesQuery` for app lists) | Search field with clear, Escape and a polite match count | Original |
| UnitInput (A-13) | `@nyc-tron/ui/components/shell/UnitInput` (parser in `/shell/unit-expression`) | Bounded recursive-descent unit arithmetic (px, pt, mm, cm, in, %, s, ms, f, smp, dB, x); no eval; length/token/depth limits | Original; replaces the helper-only gap noted on forge #46 |
| SliderField (A-14) | `@nyc-tron/ui/components/shell/SliderField`; OS slider in `@nyc-tron/expo-controls/NativeSliderField` | RN track with typed entry and Reset on every platform; the expo-controls variant renders SwiftUI/Compose `Slider` on iOS/Android and commits when the OS drag ends. Native build and device runs unverified | Original |
| RangeSlider (A-15) | `@nyc-tron/ui/components/shell/RangeSlider` (math in `/shell/slider-model`) | Two ends that never cross, min gap, typed endpoints, per-end keyboard and a11y | Original |
| RotaryKnob (A-16) | `@nyc-tron/ui/components/shell/RotaryKnob` | Relative drag with sideways fine mode, circular (stylus) input, keys, exact entry, Reset. InstrumentKnob and native ArcKnob are unchanged | Original |
| SplitButton (A-17) | `@nyc-tron/ui/components/shell/SplitButton`; OS control in `@nyc-tron/expo-controls/NativeSplitButton` | Primary action and flyout as two 44pt targets. Native: Compose `SplitButtonLayout` + `DropdownMenu`; SwiftUI `Button` + icon-only `Menu`. Native build and device runs unverified | Original |
| RibbonTabs (A-08) | `@nyc-tron/ui/components/shell/RibbonTabs` (model in `/shell/ribbon-model`) | Tabs, contextual tabs, labelled groups, toggles, split buttons, inline galleries with More, collapse | Original |
| ContextMenu (A-19) | `@nyc-tron/ui/components/shell/ContextMenu`; `@nyc-tron/expo-controls/ContextMenu` (OS menu on native) | Right-click and stylus barrel click, long press, Shift+F10, Menu key, screen-reader action | Extends NativeActionMenu (#10) with the keyboard and pointer paths |
| PresetGallery (A-23) | `@nyc-tron/ui/components/shell/PresetGallery` (model in `/shell/preset-model`) | Responsive grid, hover/focus live preview, selection, favorites and filter | Original |
| KeyboardShortcutHUD (A-27) | `@nyc-tron/ui/components/shell/KeyboardShortcutHUD` (model in `/shell/shortcut-model`) | Searchable shortcut sheet, binding recorder with conflict prompt and reset, `commandForChord` for app dispatch | Original; key parsing replaces forge #5 `keyboard-event.ts` |
| FocusAndA11yLayer (A-28) | `@nyc-tron/ui/components/shell/FocusAndA11yLayer` (`useA11yPreferences`, `useAnnounce`, `motionDuration`) | OS reduce motion, screen reader, contrast; web input modality on `<html data-input-modality>`; announcements | Extends overlays focus-cycle/focus-restore |
| HardwareKeyboardMap (N-07) | `@nyc-tron/ui/components/shell/keyboard-map` (`createKeyboardMap`); native and web sources in `@nyc-tron/hardware-keys` (`useHardwareKeyboard`, `getHardwareKeyRecorder`) | Scoped registry over #39's chord model: innermost active scope wins, per-scope conflicts, OS-reserved chords, text-field guard. Expo Modules 2 module: iOS `UIKeyCommand`s on the root controller plus a `UIPress` capture view for recording; Android unhandled-key listeners on every window (API 28+). KeyboardShortcutHUD records on native through `recorder`. Unit, mocked-host render and Chromium dispatch tests; CI APK dex and iOS compile; no device run with a hardware keyboard yet | Original; closes #39's "recording on native" deferral |
| VoiceOverTalkBackSupport (N-06) | `@nyc-tron/ui/components/shell/a11y-audit` (`auditAccessibility`), `/shell/screen-reader-focus` (`focusForScreenReader`) | Static screen-reader audit (names, adjustable value and actions, action handlers, custom action labels, 44pt targets, image labels) run over 13 rendered controls in CI; moves VoiceOver/TalkBack focus with `sendAccessibilityEvent`. No pass with VoiceOver or TalkBack on a device yet | Original; builds on FocusAndA11yLayer (A-28) |
| DataTable | `@nyc-tron/ui/components/data/DataTable` | TanStack Table v9 headless + custom RN renderer; source/typecheck | Moyo / NYC-MON headless table patterns |
| SpreadsheetGrid | `@nyc-tron/ui/components/forge/SpreadsheetGrid` | Custom two-axis viewport, frozen panes, range selection, keyboard, TSV copy, per-reference tone outlines (I-06), fill handle plus Ctrl/Cmd+D/R through `onFillRange` (I-02), `renderCellContent` for in-cell sparklines and `showFormulaBar` for split panes; native QA pending | Forge Tally Rust adapter PR #39 |
| SheetTabs (I-08) | `@nyc-tron/ui/components/forge/spreadsheet/SheetTabs` (rules in `/forge/spreadsheet/sheet-tabs-model`) | Controlled tab strip: select, add, rename (Excel name rules, engine errors shown), duplicate, move, remove with confirm, protect, token tone stripe. Each action renders only when its callback is passed. Chromium tests at 390 px; no device QA | GridCraft `Tabs.kt` (structure only, no code copied) |
| ChartBuilder (I-13) | `@nyc-tron/ui/components/forge/spreadsheet/ChartBuilder` (model `/forge/spreadsheet/chart-model`) | Controlled: line/column/area gallery (the kinds `@nyc-tron/native-charts` draws), A1 range with 4096-cell cap, series orientation, header and x-value options, title and axis titles, preview through `renderPreview`. Non-numeric cells are skipped and counted, never drawn as zero. Chromium tests | New |
| Sparkline + SparklineEditor (I-14) | `@nyc-tron/ui/components/forge/spreadsheet/Sparkline`, `/SparklineEditor` (model `/sparkline-model`) | View-drawn line, column and win/loss sparklines with high/low/negative marks and gaps; editor validates a one-row/one-column range and a single target cell. Drawn in a grid cell through `SpreadsheetGrid.renderCellContent`. Chromium tests | New |
| FreezeSplitControls + SplitSpreadsheetView (I-17) | `@nyc-tron/ui/components/forge/spreadsheet/FreezeSplitControls`, `/SplitSpreadsheetView` (model `/freeze-split-model`) | Freeze top row / first column / at selection / unfreeze; stacked or side-by-side split of one sheet with a drag, arrow-key and screen-reader adjustable divider (136 pt minimum pane, Escape restores). View state only. Chromium tests | New |
| SpreadsheetCardsView (I-20) | `@nyc-tron/ui/components/forge/spreadsheet/SpreadsheetCardsView` (model `/cards-model`) | Table rows as cards: first column titles, three preview fields, full card with in-place field editing through `onCommitField`, previous/next, honest empty state, paged list. Chromium tests at 390 px; no device QA | **Ported** from GridCraft `Cards.kt` @ `72d5bfc` (MIT OR Apache-2.0, see THIRD_PARTY_NOTICES) |
| FormulaReferenceText (I-06) | `@nyc-tron/ui/components/forge/spreadsheet/FormulaReferenceText` (model `/reference-colors`) | Formula text with each reference in the tone the grid outlines it with; same reference, same tone. Chromium test | **Ported** color assignment from GridCraft `FormulaRefs.kt` @ `72d5bfc` |
| Fill math (I-02) | `@nyc-tron/ui/components/forge/spreadsheet/fill-handle` | Pure: dominant-axis fill target, Ctrl+D/R source/target. Unit tests | New |
| WaveformLane | `@nyc-tron/ui/components/forge/WaveformLane` | Source extracted, RN UI | Forge PR #25 / #35 |
| NativeSeekBar | `@nyc-tron/ui/components/forge/NativeSeekBar` | Expo 58 @expo/ui: SwiftUI slider on iOS, Material 3 on Android, range input on web. Drag previews through `onPreview`, release commits once through `onCommit` (`onSeek` is a deprecated alias). Mocked-host render tests and Chromium drag test; native build unverified | Forge PR #25 |
| Timebase math | `@nyc-tron/ui/components/forge/timebase` | Pure: frame clamp/position, `framesToSeconds`/`secondsToFrame`, SMPTE timecode; ported PR #25 tests | Forge PR #25 |
| ColorChannels | `@nyc-tron/ui/components/forge/ColorChannels` | Source extracted, Expo 58 @expo/ui; native build unverified | Forge PR #26 / #34 |
| Banner | `@nyc-tron/ui/components/feedback/Banner` | RN notice: info/success/danger/neutral tones, polite or assertive live region, optional 44pt dismiss and action slot. Chromium/React Native Web tests and captures; no device or screen-reader QA yet | NYC-MON `@acme/ui` Banner |
| Badge | `@nyc-tron/ui/components/feedback/Badge` | Static RN status chip, neutral/info/success/danger/accent. Chromium captures only | NYC-MON `@acme/ui` Badge (neutral tone path) |
| EmptyState | `@nyc-tron/ui/components/feedback/EmptyState` | RN empty state: heading title, honest description slot, `action` or `exitAction` exit. Chromium tests | NYC-MON `@acme/ui` EmptyState |
| ErrorMessage | `@nyc-tron/ui/components/feedback/ErrorMessage` | RN inline alert with a drawn mark; renders nothing without a message. Chromium tests | NYC-MON `@acme/ui` ErrorMessage |
| KeyValueList | `@nyc-tron/ui/components/content/KeyValueList` | RN record fields; two columns from 600pt of its own measured width. Chromium tests at 390 and 834 px | NYC-MON `@acme/ui` KeyValueList |
| NightScope | `@nyc-tron/ui/components/theme/NightScope` | Delegates to Uniwind `ScopedTheme` (optional peer). Chromium test uses a shim of Uniwind's web output; native Uniwind scoping not run here | NYC-MON `@acme/ui` NightScope |
| DropZone | `@nyc-tron/ui/components/files/DropZone` | Web: DOM drag listeners on the view's node, `accept` filtering, built-in FilePicker. Native: expo-drag-drop-content-view 0.9.2 (optional peer). Web drop tested in Chromium; **native drop not run on a device** | NYC-MON `@acme/ui` DropZone (.web/.native) |
| FilePicker | `@nyc-tron/ui/components/files/FilePicker` | Web: button that opens the system chooser and hands `File`s to `onFiles`. Native: button that opens the OS document picker through `documentSource` and hands URIs to `onDocuments`; renders nothing without both. Mocked-host render test; not run on a device | NYC-MON `@acme/ui/html` FilePickerBase |
| HapticsAndFeedback (N-05) | `@nyc-tron/platform-services/haptics` (`createPlatformHaptics`, `useHapticsEnabled`) | Expo Modules 2: `UIFeedbackGenerator` on iOS, `performHapticFeedback` on Android (no permission). Semantic kinds, persisted user opt-out, per-kind rate limit; web unavailable. JS tests and CI native compiles; not felt on a device | Original |
| NativeFileAndShareAdapter (N-12) | `@nyc-tron/platform-services/documents` (`createPlatformDocuments`, `documentPickerSource`) | Expo Modules 2: iOS document picker (import, open-in-place with security scope and bookmarks) and share sheet; Android `ACTION_OPEN_DOCUMENT` with persisted grants and a share chooser through the kit's FileProvider; web share through the Web Share API. JS tests and CI native compiles; no device pick or share yet | Original |
| NativePlaybackLifecycle (N-17) | `@nyc-tron/platform-services/playback` (`createPlatformPlaybackSession`; policy at `/playback-policy`) | Expo Modules 2: `AVAudioSession` interruptions, route loss and resets on iOS; audio focus and output-device loss on Android. Pure pause/resume/duck policy with tests; background audio left to the app. No device interruption run yet | Original; not ported from FilmCraft `Voiceover.kt` |
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
| WindowsNavigationView | `@nyc-tron/windows-fluent-fabric` (`TronNavigationView` and `/navigation`); peer-free host contracts in `@nyc-tron/windows-fluent` | RNW 0.85 native NavigationView, controlled transport and native focus commands implemented. Installed navigation/window lifecycle passed at `0a4f34b`; new native interaction/accessibility checks require their own revision-bound result. Narrator speech remains unverified | WinUI 3 NavigationView; RNW 0.85 `sample-custom-component` |
| Native dropdown/menu/flyout | iOS/Android: `@nyc-tron/expo-controls`; Windows: `@nyc-tron/windows-fluent-fabric/overlays`; AppKit: `@nyc-tron/macos-appkit/menus`, `/context-menu`, `/popover`, `/anchored-inspector`, `/tooltip` | Actual platform controls implemented in separate runtime lanes. The historical iOS/Android 28-step proof remains specific to its targets; new desktop menus, inspector edits, focus and dismissal have dedicated installed-native gates. No screen-reader speech claim | Spark AppKit, WinUI, Expo UI |
| AdaptivePanes/Inspector | `@nyc-tron/panes/AdaptivePaneHost` (takes `regions` from `useReservedRegions`) | RN host over `@nyc-tron/core/pane-plan`; NYC-MON `@acme/ui/adaptive-panes` UI parts not extracted | NYC-MON / Moyo |
| Multi-hinge region planner | `@nyc-tron/core/folds` | Pure contract/tests; also owns `ReservedRegion` types, `foldLayoutsFromRegions`, `foldFeaturesFromRegions`, `foldPostureFromRegions`, single and multi-hinge vertical pane plans and the trailing inspector layout | NYC-MON adaptive geometry; Forge PR #4 `adaptive-layout/fold-layout.ts` |
| Fold / hinge / camera regions | `@nyc-tron/reserved-regions` (`useReservedRegions`, `ReservedRegionsOverride`) | Expo Modules 2 native module: Kotlin WindowInfoTracker FoldingFeature, Swift iOS 27.1 `UIView.reservedRegions`, web Viewport Segments. Source contracts, mocked hook tests and CI Android/iOS compile; no foldable-device or iOS 27.1 runtime QA yet | NYC-MON `reserved-regions*` + `apps/mobile/modules/reserved-regions`; Forge `apps/example/modules/reserved-regions` |
| Spatial panels | `@nyc-tron/core/spatial` | Pure specification, no renderer | Viro / spatial starter |
| PrecisionScrubber | `@nyc-tron/ui/components/forge/inputs/PrecisionScrubber` (math in `/forge/inputs/precision`, logic in `/forge/inputs/precision-scrubber-model`) | Controlled RN control; fine/normal/coarse, detents, one commit, cancel restores, forced colors, adjustable a11y. Model tests plus Chromium/React Native Web drag tests and light/dark/forced-colors captures (`packages/ui/tests/browser`); no device or screen-reader QA yet | Forge `studio-workspace/precision-scrubber.tsx` (PR #32) |
| DragGrabHandle | `@nyc-tron/ui/components/DragGrabHandle` | Controlled RN handle; start/move/commit/cancel, Escape and second-pointer cancel. Transport tests plus Chromium reorder/cancel test; no device QA yet | Forge `studio-workspace/drag-grab-handle.tsx` |
| Drag transports | `@nyc-tron/ui/components/gestures/PanResponderDrag` (default) and `/gestures/GestureHandlerDrag` (optional `react-native-gesture-handler` >=3.4 <4 peer) | Callback logic tested with mocked RN/RNGH; native recognition unverified on device | Forge `studio-gesture.tsx` / `studio-gesture.native.tsx` |
| LevelFader + level math | `@nyc-tron/ui/components/forge/audio/LevelFader`, `.../forge/audio/level` | Controlled RN responder fader (value/onChange/onCommit), dB travel, unit + mocked-host render tests; native device QA pending | Forge PR #25 `NativeLevelSlider` |
| MixingConsole + ChannelStrip (E-13) | `@nyc-tron/ui/components/forge/audio/MixingConsole`, `.../forge/audio/ChannelStrip`, state helpers in `.../forge/audio/mixer` | Controlled RN console: LevelFader, PanControl, SoloMuteButtons per strip, horizontal scroll, solo-over-mute audibility matching the Cadence render, honest empty state. Model and mocked-host render tests, Chromium/React Native Web drags and captures at 390/834 px light/dark and RTL; no device or screen-reader QA yet. **Deferred:** meters (E-16, no engine meter stream), FX slots and routing (E-19/E-20), channel groups (no engine group model) | Original; structure refs Facebook volume sheet, Opal sound mix (Mobbin) |
| PanControl + pan math (E-15) | `@nyc-tron/ui/components/forge/audio/PanControl`, `.../forge/audio/pan` | Controlled mono pan, centre detent, Home/C to centre, adjustable a11y with a "Centre" action; never mirrored in RTL (physical stereo field). Same test coverage as above. **Deferred:** stereo balance and surround (engine stores one mono pan per track) | Original; structure ref Waymo balance/fade (Mobbin) |
| SoloMuteButtons (E-18) | `@nyc-tron/ui/components/forge/audio/SoloMuteButtons` | Controlled M/S toggles (`togglebutton` native, `button` + `aria-pressed` web), dashed "silenced by another solo" state with hint. Same test coverage. **Deferred:** group solo and solo-safe (no engine fields) | Original |
| TempoAndMetronome + tempo math (E-27) | `@nyc-tron/ui/components/forge/audio/TempoAndMetronome`, `.../forge/audio/tempo` | PrecisionScrubber BPM (20..400, the engine's range), tap tempo that commits once when tapping stops, time-signature stepper and unit radios, optional metronome switch and beat dots. The switch is not drawn without a `metronome` binding: the click sound belongs to an audio layer that does not exist yet (E-01) | Original |
| MIDIPianoRoll + note geometry (E-24) | `@nyc-tron/ui/components/forge/midi/MIDIPianoRoll`, `.../forge/midi/note-grid` | Controlled note editor: body drag moves time and pitch in one commit, end grip resizes, tap adds, Delete removes, arrows/Shift+arrows and screen-reader actions as the non-drag path, optional audition callback. Musical time never mirrors in RTL. Notes are plain views (hundreds per clip); a dense arrangement renderer waits on verified Skia | Original; addresses notes by index like Cadence `moveNote`/`resizeNote` |
| MIDIVelocityLane (E-25) | `@nyc-tron/ui/components/forge/midi/MIDIVelocityLane` | Per-note velocity bars, vertical drag or Up/Down/PageUp/PageDown, one commit per gesture; follows the roll's `onScrollX`. **Deferred:** line-draw across bars (needs a batch velocity op; sequential ops would split one gesture into many undo steps) and MIDI channel (notes carry none) | Original |
| StepSequencer (E-26) | `@nyc-tron/ui/components/forge/midi/StepSequencer` | Lanes × steps over one clip's notes; press toggles, long press/A/screen-reader action accents, playhead column. 44pt cells, horizontal scroll | Original |
| WaveformLane viewport (E-02) | `@nyc-tron/ui/components/forge/WaveformLane` (`visibleRange`, `onVisibleRangeCommit`), `.../forge/waveform` (`slicePeaks`, `scrollRange`, `rangePosition`) | Draws only the visible window (work proportional to the span), sideways drag scrolls and commits once, taps seek inside the window, time axis fixed LTR. **Deferred:** Skia GPU lane (backend unverified on devices) | Forge PR #25 / #35 |
| EQ / dynamics graphs | `@nyc-tron/ui/components/forge/audio/EQFrequencyGraph`, `/DynamicsTransferGraph` | Controlled frequency/gain/Q and dynamics parameter editing; renders actual app-supplied response/transfer curves, with scoped previews and commits. Filter/DSP processing remains engine-owned | Forge Cadence work; original reusable UI |
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
| Track headers (D-18) | `components/forge/timeline/TrackHeaders` | Lock/hide/mute/solo, rename, grouped reorder and compact track settings | Original |
| LayerStack + layer model | `@nyc-tron/ui/components/forge/layers/LayerStack`, `.../forge/layers/layer-model` | Controlled RN list: visibility, opacity drag, reorder, rename, optional `kindLabel`, thumbnail and `onRemove`; below its measured row floor the opacity slider becomes a readout that opens a PrecisionScrubber popover (`opacityControl`). Model tests, mocked-host render tests and Chromium/React Native Web remove and keyboard tests; no device or screen-reader QA yet | Forge Prism layer panel |
| Brushes, paint controls | `@nyc-tron/ui/components/forge/ink/BrushPresetBrowser`, `/BrushDynamicsInspector`, `/BrushTaperControl`, `/BrushStabilizationPreview` and the canvas-tool exports | Reviewed controlled brush/ink UI and preview ownership; [P06 report](completion/P06-brush-and-ink-batch.md). Production stroke processing remains with the document/engine owner | Forge Prism work; reviewed source admission per component |
| Eyedropper / canvas sampling | `@nyc-tron/ui/components/forge/color/EyedropperTool` | Controlled point/color sampling through the host's actual pixel provider, with scoped asynchronous ownership. The UI does not create a second renderer or fabricate sampled colors | Forge PR #34 |
| InkToolbar | `@nyc-tron/ui/components/forge/ink/InkToolbar` (state, shortcuts and validation in `/forge/ink/ink-model`) | Controlled RN toolbar, horizontal bar or vertical rail: tool radio group, adjustable size and opacity, host swatches plus an optional custom-color request, pressure switch shown only when the host reports measured pressure, undo/redo with disabled reasons. Shortcut resolver is a pure function; no global listener. Model tests plus Chromium/React Native Web interaction tests and light/dark/RTL captures at 390 and 834 px; no device or screen-reader QA yet | Forge board PRs #18, #19, #22 (`packages/board`, `apps/board-native-lab`) and pen PR #20 |
| Board stroke engine, Skia renderer, BLE pen connection, pen controllers | Nitro Forge `packages/board`, `packages/pen-connect`, `packages/spatial-ink` | **STAYS IN FORGE** by design; InkToolbar only reports intent | Forge PRs #18–20, #22 |
| RecordingTrack | `@nyc-tron/ui/components/forge/audio/RecordingTrack` | Controlled RN view over `RecordingViewState`; lane is `forge/WaveformLane`; mocked-host render tests only, native QA pending | Forge PR #37 `NativeRecordingTrack`, `NativeSourceRecordingTrack` (view parts) |
| LevelMeter | `@nyc-tron/ui/components/forge/audio/LevelMeter` | Controlled RN view; dBFS math and throttled band announcements tested; screen-reader output on device unverified | Forge PR #37 meter history |
| AudioPreview | `@nyc-tron/ui/components/forge/audio/AudioPreview` | Controlled RN view over `PreviewViewState`; mocked-host render tests only | Forge PR #37 `NativeAudioPreview` (view parts) |
| DevicePairingDialog | `@nyc-tron/ui/components/forge/devices/DevicePairingDialog` | Controlled RN Modal over `PairingState`; transport-agnostic. States include OS-owned `system-pairing` and linked-but-unverified `awaiting-input`; `intro` explains the search before it starts; `onStopSearch` and `onClose` replace the deprecated `onCancel`. Model tests, mocked-host render tests and Chromium tests with captures; no device or screen-reader pass | Forge PR #20 `PenConnectionDialog` |
| Paste into a range | SpreadsheetGrid | **DEFERRED** until Tally exposes a batch `setRange`. Fill has its UI (`onFillRange`); the engine operation behind it is the app's | Forge Tally |
| RichTextRibbon (H-03) | `@nyc-tron/ui/components/forge/document/RichTextRibbon` (state in `/forge/document/ribbon-model`) | Controlled RN toolbar: paragraph style, font family and size, B/I/U/S with mixed state, text and highlight color, change case. Each group renders only with its callback. Model tests and Chromium tests and captures; no device or screen-reader QA yet | Original; Forge Quill `applyStyle`/`setBlockKind` |
| BulletsNumberingEditor (H-07) | `@nyc-tron/ui/components/forge/document/BulletsNumberingEditor` (`/forge/document/list-model`) | List kind, indent/outdent under the nesting policy (one level deeper than the item above, nine levels), per-level format, numbered preview. Model and Chromium tests | Original |
| NavigationOutline (H-15) | `@nyc-tron/ui/components/forge/document/NavigationOutline` (`/forge/document/outline-model`) | Heading outline with collapse and current section, page list (thumbnails through `renderPageThumbnail`), bookmarks. Model and Chromium tests | Original |
| DocumentReadAloudTransport (H-21) | `@nyc-tron/ui/components/forge/document/DocumentReadAloudTransport` over `/forge/office/ReadAloudTransport` | Controlled transport; the app owns the voice. Sentence queue from `/forge/office/read-aloud-model` | WordCraft `crates/engine/src/speech.rs` (ported, MIT OR Apache-2.0) |
| TextSearchResults (K-04) | `@nyc-tron/ui/components/forge/pdf/TextSearchResults` (`/forge/pdf/search-model`) | Query, case and whole-word toggles, results grouped by page with the match in context, wrap-round next/previous, hit cap, read error distinct from no matches. On-page highlight needs the host's renderer | PdfCraft `ui/viewer/Search.kt` (ported, MIT OR Apache-2.0) |
| AnnotationToolbar (K-06) | `@nyc-tron/ui/components/forge/pdf/AnnotationToolbar` (`/forge/pdf/annotation-model`) | Only the tools the host lists (engine-storable subtypes), letter shortcuts, undo/redo. Placing marks on the page is the host's page view | Original |
| CommentsThreadPanel (K-07) | `@nyc-tron/ui/components/forge/pdf/CommentsThreadPanel` (`/forge/pdf/comments-model`) | Threads by page; reply (draft kept on failure), resolve/reopen and delete only with callbacks; open/resolved/all filter | Original |
| PDFReadAloudTransport (K-18) | `@nyc-tron/ui/components/forge/pdf/PDFReadAloudTransport` | Shared transport plus page context and page steps | WordCraft `speech.rs` (ported model) |
| SlideFilmstrip (J-01) | `@nyc-tron/ui/components/forge/slides/SlideFilmstrip` | Vertical or horizontal; thumbnails drawn from slide objects (`SlideThumbnail`), select, grip/Alt+arrow/action reorder, add, remove. Chromium tests incl. a horizontal grip drag | Original; Forge Pitch |
| SlideSorter (J-02) | `@nyc-tron/ui/components/forge/slides/SlideSorter` (`/forge/slides/slide-model`) | Fitted grid, multiselect (Shift range, Cmd/Ctrl toggle, touch Select mode), block moves, delete guarded against emptying the deck; `planMoves` turns an order into single engine moves | Original |
| SlideCanvas (J-05) | `@nyc-tron/ui/components/forge/slides/SlideCanvas` (`/forge/slides/canvas-model`) | Select, drag with edge/center snapping guides, corner resize, nudge, rotate, delete, inline text edit; one commit per gesture; not mirrored in RTL | Original |
| SlideAnimationPane (J-09) | `@nyc-tron/ui/components/forge/slides/SlideAnimationPane` (`/forge/slides/animation-model`) | Play-order list, add (effects the host lists, grouped entrance/emphasis/exit; validated seconds), remove, preview | Original |
| Unified icon glyphs / optional animation | `@nyc-tron/icons` | Original outline/filled glyphs and app-owned icon state are implemented. A Rive renderer is a separate optional product integration and is not supplied by this package | Forge PR #21 reference; original NYC-Tron glyphs |

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
- **FilePicker on native (BUILD, 2026-11-05).** React Native has no `File`,
  so native takes a separate contract: `documentSource` opens the OS picker
  and `onDocuments` receives URIs. The kit takes no picker dependency;
  `@nyc-tron/platform-services/documents` supplies the source. Without both
  props native renders nothing, so there is never a button that opens nothing.
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

- **D-18 TrackHeaders is implemented in the local second cluster.** Splice stores lock/hide/mute/solo flags; the host supplies its callbacks.
- **Ripple is implemented in the local second cluster.** The host maps each finished edit to Splice ripple operations, and batch actions use one engine transaction.
- **Constant clip speed is exposed by BatchEditPanel.** Media-bin insertion and keyframed speed remain deferred; `PlaybackRateMenu` remains player rate.
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

## 2026-11-05 NativeSeekBar commits once per drag

`NativeSeekBar` passed the universal `@expo/ui` Slider's `onValueChange`
straight to `onSeek`, so a drag sent the player a seek for every tick and
nothing marked the release. The universal Slider has no end-of-drag event, so
the component is now split by platform, like `NativeSliderField`:

- `NativeSeekBar.native.tsx` renders the SwiftUI `Slider` on iOS and the
  Material 3 `Slider` on Android. A drag ends on `onEditingChanged(false)` on
  iOS and on `onValueChangeFinished` on Android. On iOS a value change outside
  a drag (a VoiceOver increment) commits by itself.
- `NativeSeekBar.web.tsx` keeps the universal slider, an `<input type="range">`,
  and commits on the DOM `change` event, which the browser fires once on
  release and once per arrow-key step.

The API follows `LevelFader`: `onPreview` gets each new frame during a drag,
`onCommit` gets one frame per release, step-button press or keyboard step, and
nothing when the frame is unchanged. `onSeek` still works as a deprecated
alias with the `onCommit` timing. When both are passed only `onCommit` runs.
The thumb and timecode show the dragged frame until the release. The export
map now picks `NativeSeekBar.native.js` under `react-native` and
`NativeSeekBar.web.js` under `browser` and `default`.

Verified: mocked-host render tests of both platform files (red against the
previous source: two ticks sent `onSeek(121)` and `onSeek(122)`), and a
Chromium drag and arrow-key test (red against the previous source: 15 seeks
for one drag). Not verified: the order of SwiftUI and Compose events on a
device, VoiceOver and TalkBack steps, and an iOS or Android build.

## 2026-11-05 Ink toolbar and the Forge board

`InkToolbar` mirrors the board's tool model as of 2026-11-05. The ink lab
session (`apps/board-native-lab/InkLabSession.ts`) has three tools, `pen`,
`highlighter` and a stroke `eraser`, and counts undo and redo steps. The
QuickDraw scene compiler (`packages/board/src/skia/scene.ts`) uses the sizes
`s`/`m`/`l`/`xl` (2.5, 4, 6.5 and 10 points) and draws highlighter strokes 4.5
times wider. `INK_BOARD_TOOLS` and `INK_SIZE_POINTS` copy those values.

Decisions, recorded so the next change does not redo them:

- **BUILD** `marker` and `lasso` exist in the `InkTool` union but not in
  `INK_BOARD_TOOLS`. The board implements neither, so Forge must not list them
  until it does.
- **STRIKE** a tilt toggle. No branch reads tilt, altitude or azimuth, and
  `spatial-ink` reports pressure only. It returns when a board consumes tilt.
- **DEFER** a palm-rejection picker. The board's pointer router already has
  `palmRejection: "off" | "during-pen" | "after-pen"`; it needs a product call on
  whether users choose it or the host fixes it per device.
- **Pressure** renders only when the host passes `pressure`. Forge passes it
  when its pointer router has seen a measured pressure sample or pen-connect
  reaches `ready`; a `linked` Bluetooth pen is not enough.
- **Color** swatches come from the host (QuickDraw's named colors). NYC-Tron
  ships no palette. `onRequestCustomColor` asks the host to open
  `HsvPicker` (or `ColorChannels`) in its own popover. The toolbar does not
  embed the picker, so importing it never pulls in `@expo/ui` or
  `expo-linear-gradient`.
- **Icons** are a host slot (`icons`); text labels show until the planned
  `components/icons/` glyphs land.
- **Disabled controls** stay pressable and put their reason in a polite live
  line. React Native Web's `Pressable` overwrites `aria-disabled` and blocks the
  press, so the accessible name also carries ", unavailable".
- **Placement** is the host's call: pass `orientation="vertical"` and
  `edge="right"` for the physical-right rail on foldables and tablets (also in
  RTL), and a horizontal bar on phones.

## 2026-11-05 studio form and navigation primitives (part A)

Select, SegmentedControl, TabBar, Toolbar, List, IconButton and FieldGroup.

### Studio host slots

Nitro Forge's `StudioUIProvider` takes these primitives directly. Forge's
`tone` props (`royal`, `carolina`) are accepted by its slot types and ignored
here: color comes from the host theme tokens, and active state uses
`primary`. Brand tones belong in the host's theme, not in component props.
NYC-MON's district tones and corner-cut frames were left behind for the same
reason.

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

## 2026-11-05 studio shell commands and overlays (A-08, A-17, A-19, A-23, A-27, A-28)

`SplitButton` keeps the primary action and the flyout as two buttons with
separate 44pt targets. `@nyc-tron/expo-controls/NativeSplitButton` uses the
OS controls: Material 3 `SplitButtonLayout` with a `DropdownMenu` on
Android, and a bordered SwiftUI `Button` beside an icon-only `Menu` on iOS.
SwiftUI's `Menu(primaryAction:)` was not used because it puts both actions
on one target. The Compose trailing button reads "More" because @expo/ui's
Compose `Icon` needs a bundled asset.

`RibbonTabs` validates ids up front. Contextual tabs carry their group name
in the accessible label and an accent rule. Narrow panes scroll the panel
sideways instead of dropping commands. Galleries keep the selected item
inline and list the rest under "More".

`ContextMenu` in `@nyc-tron/ui` covers web and RN-rendered targets: a
`contextmenu` event (mouse right-click, stylus barrel button), long press,
Shift+F10, the Menu key, and a "Show actions" (`longpress`) accessibility
action. `@nyc-tron/expo-controls/ContextMenu` uses `NativeActionMenu` on iOS
and Android, so the OS menu appears there.

`KeyboardShortcutHUD` records bindings from web key events. React Native
delivers hardware key events only on web, so on iOS and Android the list is
read-only. A binding needs Ctrl, Alt or Command (function keys excepted),
since bare letters would fire while typing. A binding already in use asks
before taking it, and Replace clears the other command. Escape while
recording cancels the recording and leaves the sheet open. Bindings are
portable strings (`Mod` is Command on Apple, Control elsewhere);
`commandForChord` lets the app dispatch with the same rules.

`FocusAndA11yLayer` reads reduce motion and screen-reader state from
`AccessibilityInfo`. It reads contrast from darker system colors on iOS,
high text contrast on Android, and `forced-colors` on web. On web it writes
the input modality to `<html data-input-modality>` so app CSS can scope
focus rings. Announcements go to `announceForAccessibility` on native and to
a visually hidden live region on web. An off-screen offset would have
widened the page in RTL, which the first RTL capture showed at 10,390px.

Forced colors paints transparent borders, so unselected ribbon tabs, gallery
items and preset tiles draw no border at all and keep their size with
padding.

Verified: ribbon, preset, shortcut and a11y-store unit tests, and
Chromium/React Native Web interaction tests
(`packages/ui/tests/browser/shell-commands.spec.mjs`) with captures at 390
and 834px in light, dark, RTL, forced colors, and with Apple keycaps. Not
verified: `NativeSplitButton` and the native `ContextMenu` on devices
(source and types only), stylus barrel clicks on real hardware (the web path
is the same `contextmenu` event Chromium sends for a right-click), and
screen-reader output.

## 2026-11-05 spreadsheet cluster (I-01, I-02, I-06, I-08, I-13, I-14, I-17, I-20)

Nitro Forge roster IDs and where they live. Every control is controlled: the
app (for Forge, the Tally engine through `@nitro-forge/tally/grid-adapter`)
owns the workbook, and each component reports the next state or the write it
wants. No component persists anything.

| ID | Component | Notes |
| --- | --- | --- |
| I-01 | `SpreadsheetGrid` | Chromium test scrolls a 1,048,576-row sheet to row 500,001 and checks the mounted cell count stays under 400. Native scroll performance on a device is not measured. |
| I-02 | `SpreadsheetGrid` `onFillRange` + `forge/spreadsheet/fill-handle` | The handle is drawn only when `onFillRange` is passed, so an engine without a fill operation shows no dead handle. |
| I-06 | `SpreadsheetGrid` outlines + `FormulaReferenceText` | Up to eight tones: four token colors (primary, accent, success, info), solid then dashed. `danger` is never used for a reference. |
| I-08 | `SheetTabs` | Arrow keys follow reading direction; Ctrl/Cmd+PageUp/PageDown also switch sheets; F2 renames; Escape cancels. |
| I-13 | `ChartBuilder` | NYC-Tron UI does not import `@nyc-tron/native-charts`; the app renders the preview with it. |
| I-14 | `Sparkline`, `SparklineEditor` | Drawn with views, so it fits inside a grid cell on every platform without a canvas. |
| I-17 | `FreezeSplitControls`, `SplitSpreadsheetView` | Pass `showFormulaBar={false}` to the second pane's grid so the panes share one formula bar. |
| I-20 | `SpreadsheetCardsView` | GridCraft edits a field in an AlertDialog; this edits it in place, since the task needs no interruption. |

Verified here: unit tests (`packages/ui/tests/spreadsheet-cluster.test.mjs`),
TypeScript, package exports, and Chromium/React Native Web interaction tests
plus light/dark captures at 390 and 834 px and an RTL capture
(`packages/ui/tests/browser/spreadsheet.spec.mjs`). Not run: iOS or Android
rendering, VoiceOver/TalkBack, a Surface Duo or other foldable, hardware
keyboards on native, Safari and Firefox.

## 2026-11-05 recording views and device pairing

Per Nitro Forge PR #38 the dependency runs one way: Forge imports these views,
NYC-Tron never imports Forge. Microphone capture, PCM buffers, WAV writing,
playback graphs, Bluetooth discovery and the recorder, player and pen
controllers stay in Forge. NYC-Tron receives only controlled views and their
pure state models:

- `forge/audio/recording-model`, `forge/audio/preview-model`,
  `forge/audio/level-meter` and `forge/devices/pairing-model` hold the state
  unions and copy. Forge maps its controller phase onto them.
- Every state that needs the user has copy and a recovery action: microphone permission denied
  (Settings when the app passes `onOpenSettings`, otherwise ask again), no
  input device, interrupted take (save what was recorded), recorder error,
  no pairing device found (search again), and each pairing error code
  (`permission-denied`, `radio-off`, `connection-failed`, `unknown`) with retry.
  The busy states (`requesting-permission`, `preparing`, `stopping`) show
  progress and no action; the app must move them on or to `error`. Without
  `onOpenSettings` a permission denial offers only "Ask again", which iOS
  and Android ("Don't ask again") answer silently, so pass it.
- `disabled` on `RecordingTrack` never blocks "Stop and save" or "Save what
  was recorded".
- `LevelMeter` is a `progressbar` whose value text is a band, not a number.
  With `announce` it speaks band changes at low priority, at most once per
  `announceIntervalMs` (2 s default); clipping is spoken at once. The bar is not
  a live region. Status lines are polite live regions that change once per
  phase; VoiceOver ignores live regions, so on iOS each phase change is also
  announced. react-native-web has no `announceForAccessibilityWithOptions`;
  the views fall back to the plain call there instead of throwing.
- Closing a connected `DevicePairingDialog` calls `onDone`, never `onCancel`, so
  dismissing the dialog does not disconnect the device.

### 2026-11-05 pairing dialog gaps from Nitro Forge #20

Forge #20 renders `DevicePairingDialog` for its pen and found four gaps. They
are closed in the library; the old API still compiles and behaves as before.

- `intro` (string) shows above the guidance while `idle`, so the host can say
  what the search does first: that it asks for Bluetooth access, or that this
  platform pairs in system Settings.
- `system-pairing` (`steps`, optional `message`) is for platforms where the OS
  owns pairing, such as visionOS. The host's steps render as an ordered list
  ("Step 2 of 3: ..." to screen readers) with Open Settings when
  `onOpenSettings` is set. No spinner: the dialog can't see the OS's progress,
  so the host moves the state on when the OS reports back.
- `awaiting-input` (`device`, optional `message`) sits between `connecting`
  and `connected`: the link is up but the app hasn't seen pen input yet. The
  copy says "Linked to ...", never "Connected", there is no Done button, and
  `renderStatusArt` gets the `connecting` phase. `renderStatusArt` now also
  receives the full state as a second argument for hosts that draw these two
  states differently.
- `onStopSearch` (Stop searching, and Cancel while connecting) and `onClose`
  (close button and back gesture) replace the single `onCancel`. `onCancel`
  is deprecated and still used when the new callbacks are missing. A linked
  dialog (`awaiting-input`, `connected`) never closes through `onCancel` or
  `onStopSearch`: it calls `onClose`, or `onDone` when there is no
  `onClose`, so closing cannot disconnect. With no stop callback at all the
  stop button is disabled rather than dead. The close button is labelled
  "Close" when the host passes `onClose` or the device is linked, and "Cancel
  and close" only on the legacy path.

Both new states put their copy in the `polite` live region and the iOS
announcement, like the others. Evidence: model tests, mocked-host render
tests (callback routing, legacy fallbacks, step labels, announcements and
art phases), and `pairing.spec.mjs` in the Chromium lane, which drives the
buttons and captures every state at 390 and 834 px in light and dark plus RTL
(`shots/pairing-*`). No simulator, device, VoiceOver or TalkBack pass. The
scrim is still the fixed `rgba(0,0,0,0.5)` noted above.

Evidence is Node tests of the state models, mocked-host render tests that
run the real components, and a react-native-web render in Chromium of every
recording, preview, meter and pairing state at phone and tablet widths in
light and dark. That render found the web crash above (a recording track
unmounted the whole screen) and the peak-hold marker vanishing at full
scale; both are fixed. No simulator, device, TalkBack or VoiceOver pass has
been done for these views. The dialog scrim is still a fixed
`rgba(0,0,0,0.5)`: TronTheme has no scrim token yet (DEFER until one is
added to `@nyc-tron/core/theme`).

## Shared icon ownership

NYC-Tron @nyc-tron/icons now owns the original
Forge authored icon catalog, outline/filled geometry and Rive-ready
state contract, extracted from Nitro Forge PR #21. Consumer apps use
the icon package directly rather than importing a Forge engine. Nitro
Forge keeps its own copy until it re-exports this package.
Native OS icon adapters and compiled Rive binaries still require validation.
See docs/ICON_MIGRATION.md.

## 2026-11-05 Design Studio gaps (Nitro Forge #36)

Moving Nitro Forge's Design Studio onto v0.1.0-alpha.2 turned up seven gaps.
Forge carries workarounds for them today; these changes remove the need. Every
API change is additive, so existing callers render as before.

- **LayerStack row floor.** A row with a thumbnail and a remove button needs
  380pt to keep a 96pt name beside a 120pt opacity slider
  (`layerRowMinWidth`). The stack now measures its own width with `onLayout`
  (never the window) and, below that floor, swaps the slider for a 56pt
  percentage readout (`layerOpacityMode`). The readout is a button that opens
  a `PrecisionScrubber` in an `AnchoredPopover`; it previews through
  `onOpacityPreview`, commits once through the same path as a drag, and a
  cancel restores the committed value. Beside the readout the name may shrink
  as a last resort, so the remove button never clips. `opacityControl`
  (`"auto"`, `"slider"`, `"readout"`) forces either presentation. Product
  call: a popover scrubber rather than an inline expansion, so rows keep a
  fixed height and drag-to-reorder math still holds. Checked in Chromium at
  320, 360 and 390pt, light, dark and RTL.
- **TabBar.** A compact TabBar claimed the full width of its row (`w-full`),
  so beside a header action it pushed the action out of the pane. Compact bars
  now size to their tabs and shrink only when the row runs out of room; tabs
  keep their content width (`grow-0 basis-auto`) and the icon never shrinks,
  so a label truncates only when the tabs do not fit. The single-tab
  "Docum..." case did not reproduce in Chromium or in a Yoga 3 layout of the
  same tree; the header-row case did, and that is what changed.
  `navigation` density is unchanged.
- **NativePopover trigger form.** `trigger` (a node or
  `({open,toggle,triggerProps})=>node`) replaces `anchor`: the popover
  renders the trigger, measures it on open and anchors to it. On native the
  invisible SwiftUI/Compose anchor sits over the trigger in its own
  coordinates; the window measurement only picks the preferred side.
  `usableRegions` is optional in this form and defaults to the window. The
  rect form is unchanged. The web presentation moved into the kit as
  `AnchoredPopover`, so `LayerStack` and `NativePopover` share one web popover.
- **NativeDropdown groups.** `groups: {heading, options}[]` in place of
  `options`: SwiftUI `Section`s inside the Picker on iOS, a `labelLarge`
  heading row and dividers in the Material menu on Android, and on web the
  kit `Select`'s grouped listbox, because the universal `<select>` has no
  `<optgroup>`. `Select` (and `@nyc-tron/expo-controls/Select`) takes the same
  `groups`. Helpers live in `/forms/option-groups`.
- **Icons on web.** react-native-svg's web build spreads props onto the DOM
  `<svg>`, so `accessible={false}` reached the DOM and React warned
  ("Received `false` for a non-boolean attribute `accessible`"). On web the
  icon now passes only `aria-hidden` and the string `focusable="false"`;
  native keeps the RN props.
- **PrecisionScrubber.** Ported from Forge's `advancePrecisionGesture`
  (nitro-forge #32): crossing the 28px fine/coarse threshold re-anchors the
  drag on the current value instead of rescaling the whole drag, so the value
  no longer jumps. Detents catch within `detentPixels` of travel (default 6)
  in normal and coarse mode; the old half-step window equalled rounding, so a
  detent never changed the result. Fine mode never catches. Typed entry snaps
  to a tenth of `step` and clamps (`snapTypedPrecision`).
- **HsvPicker hue slider name.** The universal `@expo/ui` Slider takes no
  label, and its iOS and Android hosts expose only modifiers (the Compose
  host has no state description for "degrees"). On iOS and Android the slider
  now sits in an adjustable wrapper named "Hue" whose value reads "N degrees"
  and whose increment/decrement step by `hueStep`; the native slider inside
  is hidden from VoiceOver and TalkBack so it is not a second, unnamed stop.
  On web the range input keeps keyboard control and gets `aria-label` and
  `aria-valuetext` set on it directly.

Evidence: Node model tests (red on the old code for the scrubber, icon and
hue changes), mocked-host render tests for LayerStack readout rows and the
hue slider, and Chromium/React Native Web tests and captures for LayerStack
at 320/360/390pt, TabBar header rows, grouped Select and the trigger-form
popover. The Android and iOS compile lanes build the native example, which
now renders a grouped NativeDropdown and a trigger-form NativePopover. No
simulator, device, VoiceOver or TalkBack pass has been done for any of these.


## Timeline cluster 2 — local phase 2

All controls below are original implementations; no third-party source was copied for this cluster. Existing timeline-core source notices remain intact. Every name has an independent `@nyc-tron/ui/components/forge/timeline/<Name>` export. No Forge engine is imported by this repository.

| Control | Roster | Controlled callback / responsibility |
| --- | --- | --- |
| JKLShuttleController | D-09 | Host player rate and frame-step intent; reverse is opt-in, no decoder provided |
| LoopRangeBar | D-13 | One stored range commit; actual player looping remains host state |
| TrackHeaders | D-18 | Flags, rename and reorder; compact headers open full settings below lanes |
| RollSlipSlideControls | D-21 | Slip/slide/roll/ripple edit intent; selected clip and media bounds required |
| DragReorderAndRipple | D-22 | Insert/overwrite policy and ripple delete; no media-bin decoder |
| TransitionHandles | D-23 | Cut selection and one duration commit per completed gesture |
| TimelineMarkers | D-24 | Add, move, range, name/note and remove; Enter followed by blur commits once |
| OverlayAndEffectsTrackStack | D-31 | Overlay/video/audio groups; effects tracks remain deferred on a compositor |
| TransitionPresetBrowser | D-37 | Static diagrams and preset intent; no rendered video preview |
| BatchEditPanel | D-41 | Shift, speed, remove and ripple-delete lists for one engine transaction |
| ModeEdgeHandles | D-19/D-21 | Internal/shared edge gesture presentation for the selected trim mode |

Phase 2 includes pure model/source tests and Chromium interaction tests with a Zustand stand-in. Forge separately verifies the callback shapes against this checkout's built declarations and runs the bound callbacks against real Rust. Browser captures cover light/dark phone/tablet and RTL. These are local source/browser/protocol checks, not a publication or native/device acceptance claim.

## 2026-11-05 canvas/layers recovery

The local canvas, layers, selection, canvas-tools and vector controls are integrated with independent public exports. Ownership, callback boundaries, preserved ProCraft provenance and platform limits are recorded in [CANVAS_CLUSTER.md](CANVAS_CLUSTER.md). Generic controls remain owned by NYC-Tron; the Prism engine and adapter remain owned by Forge. No unpublished component is claimed as part of the alpha.3 release.

## 2026-11-05 audio cluster 2 recovery

The local audio automation/routing/inserts/analysis and MIDI extensions are integrated with independent exports. See [AUDIO_CLUSTER_2.md](AUDIO_CLUSTER_2.md) for ownership, input/accessibility fixes, control mappings and platform/backend limits. NYC-Tron owns generic UI; Forge owns Cadence DSP/document operations and its mixer adapter. These controls are unpublished and are not attributed to the alpha.3 release.

## 2026-11-05 workspace, color and transfer recovery

See [WORKSPACE_COLOR_TRANSFER.md](WORKSPACE_COLOR_TRANSFER.md) for the integrated WorkspaceHost/presets, ContextualToolbar, FileImportExportSheet, ColorPickerDialog and presenter ink controls. NYC-Tron owns generic UI and normalized session overlay geometry. Forge owns document/session persistence, engine color writes and real byte formats. These additions remain unpublished and carry separate native/device gates.
