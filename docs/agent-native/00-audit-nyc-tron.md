# NYC-Tron-UI audit (read-only)

Repo: `<scratch>/tron`, HEAD `0e09d3be8263b3dbb2eab1a78e5dd66b83b68e44` (2026-11-13), 2301 tracked files. All figures below were computed from tracked files with grep/node scripts; items marked (guess) were not verified.

Note: the clone is shallow, so the repo's claims about history/CI runs were not checked.

## 0. Layout in one screen

- pnpm workspace (`pnpm-workspace.yaml`: `packages/*`, `examples/*`), `pnpm@12.18.0`, TypeScript 7.0.2, Node >=24.19, ESM. Root `package.json` has no `build` of its own beyond `pnpm -r build`; `verify` chains tooling scripts.
- 16 package.json under `packages/` (15 workspace dirs plus nested `windows-fluent/rnw-fabric` and `macos-appkit/spark`). Version `1.0.0-rc.2` everywhere (single version per tag, enforced by `tooling/pack-release.mjs`).
- Distribution: GitHub Release tarballs only, no npm (`AGENTS.md` rule 9, README "Installing from a release").
- Source files are authored as `.ts/.tsx` with explicit extensions in relative imports (`import {joinClasses} from "./styles.ts"`), compiled by `tsc` to `dist/`. Package `exports` point at `dist/*.js` + `dist/*.d.ts`.
- Code style is dense (long single lines, no spaces after `:` in many files). A registry that copies source will ship that style as is.

## 1. Component inventory

Machine-readable source of truth already in repo: `docs/api-signatures.json` (2.5 MB, `format:1`, per package -> per subpath -> `symbols` map, built by `tooling/api-signatures.mjs`) and `docs/api-surface.json` (28 KB, subpath lists). Symbol counts from api-signatures (types included):

| package | subpaths | symbols |
|---|---:|---:|
| @nyc-tron/ui | 556 | 3167 |
| @nyc-tron/core | 12 | 200 |
| @nyc-tron/platform-services | 7 | 149 |
| @nyc-tron/icons | 7 | 59 |
| @nyc-tron/expo-controls | 11 | 50 |
| @nyc-tron/panes | 4 | 37 |
| @nyc-tron/reserved-regions | 3 | 32 |
| @nyc-tron/native-controls | 7 | 26 |
| @nyc-tron/native-charts | 3 | 25 |
| @nyc-tron/windows-fluent | 3 | 18 |
| @nyc-tron/app-identity | 1 | 15 |
| @nyc-tron/native-navigation | 3 | 14 |
| @nyc-tron/hardware-keys | 2 | 13 |
| @nyc-tron/geometry | 3 | 11 |

(`windows-fluent-fabric` and `macos-appkit` are absent from api-signatures.json; they have separate files `docs/api-signatures-windows.json` and `docs/api-signatures-macos.json`, 56 KB and 66 KB.)

Full per-subpath table (source file, kind, exported names, Props type, first JSDoc line) is generated in Appendix A at the end of this file (404 "component" rows by a heuristic, 167 "module" rows; classification is a regex guess, see caveat there).

### 1.1 @nyc-tron/ui (556 export keys in `package.json`; README says 551, stale)

Root barrel `packages/ui/src/index.ts` exports only: `Button, Card, NavigationRail, NavigationShell, TextField` (+ their Props types). Everything else is a per-file subpath `@nyc-tron/ui/components/<path>`.

Subpath count by directory (from api-signatures):

| dir | subpaths | note |
|---|---:|---|
| forge/audio | 63 | mixers, faders, meters, EQ, spectrogram, routing, takes |
| forge/timeline | 59 | scrubber, ruler, tracks, markers |
| shell | 53 | WorkspaceHost, AdaptiveDock, PaneSplitter, DocumentTabBar, ToolRail, StatusBar, InspectorPanel/Section/Search, PropertyRow, UnitInput, SliderField, RangeSlider, RotaryKnob, ContextMenu, MenuButton, SplitButton, RibbonTabs, PresetGallery, AssetBrowser, HistoryPanel, KeyboardShortcutHUD, ToastAndProgress, FocusAndA11yLayer, FindReplace*, NumericScrubField, ContextualToolbar |
| forge/color | 44 | HsvPicker, ColorWheel, ColorDiscPicker, AlphaSlider, SwatchGrid, ColorHarmonyAssistant, FloatingColorPalette, channel fields |
| forge/spreadsheet | 31 | FormulaBar, SheetTabs, panels (+ top-level `forge/SpreadsheetGrid`) |
| forge/document, motion | 25 each | |
| forge/pdf, photo | 24 each | |
| forge/slides | 23 | |
| forge/cad, canvas | 17 each | `Native3DViewport`, `GPUCanvasViewport` (Skia Graphite) |
| forge/design, layers | 15 each | |
| root `components/*` | 13 | Button, Card, DragGrabHandle, FieldGroup, IconButton, List, NavigationRail, SegmentedControl, Select, TabBar, TextField, Toolbar (+ styles/useLocalStore helpers) |
| forge (top level) | 12 | WaveformLane, NativeSeekBar, ColorChannels, SpreadsheetGrid + models (waveform, timebase, color) |
| overlays | 10 | AnchoredPopover, CommandPopover, CommandPalette + positioning/focus helpers |
| forge/ink 10, inputs 9, vector 9, selection 8, canvas-tools 6, midi 6 | | InstrumentKnob, InstrumentXYPad in inputs |
| files 5, data 4, feedback 4, gestures 4, forms 2, layout 2, navigation 2 | | DataTable, TreeGrid; Badge, Banner, EmptyState, ErrorMessage; DropZone, FilePicker, FileImportExportSheet; ContentFrame, AdaptiveColumns; CollapsibleDrawer |
| forge/devices 3, office 3, graph 2, graphics 2, content 1, theme 1, window 1, platform 1 | | KeyValueList, NightScope, WindowTitleBar, PatchGraph, ImageCropOverlay |

File counts under `packages/ui/src`: 624 files (416 `.tsx`, 208 `.ts`); 493 under `components/forge`, 55 under `components/shell`. Hooks: `useLocalStore`, `forge/inputs/useScopedControl`, `forge/timeline/useFrameScrub`, `gestures/useEditorPan`, `gestures/useLocalPointer`, `overlays/useTriggerAnchor`, `shell/useOwnedAction`. About 74 `*-model.ts` pure-logic files sit beside components (testable without React).

Variant files in ui (platform split by extension, selected by package.json export conditions `browser` / `react-native` / `default`):
- `files/DropZone.{native,web,shared}`, `files/FileImportExportSheet.{native,web,shared}`, `files/FilePicker.{native,web}`
- `forge/NativeSeekBar.{native,web,shared}` (+ `.types.ts`), `forge/timeline/FrameAccurateScrubber.{native,shared}`, `forge/audio/LevelFader.vertical`
- `html/semantic.{native,web}`

Representative public props (read in source): `Button` -> `ButtonProps` { title, variant: "primary"|"secondary"|"ghost"|"danger", size: "sm"|"md"|"lg", loading, disabled, icon, targetSize (>=44), numberOfLines, className, unstyled, labelClassName, iconClassName } (`packages/ui/src/components/Button.tsx`). Components generally expose `className`, per-slot `*ClassName`, and an `unstyled` boolean for full override (README "App-specific Tailwind v4 / Uniwind styling").

### 1.2 Other packages (all subpath exports from each package.json)

- `@nyc-tron/core` (pure TS, no React, no peers): `.`, `./navigation` (`resolveNavigationShell`), `./folds` (`resolveUsableRegions`), `./spatial`, `./theme` (`TronTheme`, `validateTheme`, `themeCssVariables`, `TRON_THEME_TOKENS`, `TRON_NATIVE_METRICS`), `./spatial-interactions`, `./advanced-catalog` (`advancedNativeCatalog`, 71-line historical registry), `./presets/infrax` (`INFRAX_THEME_NAME`, light/dark theme objects), `./pane-plan`, `./window-lifecycle`, `./overlays`, `./window-chrome`. 12 src files.
- `@nyc-tron/geometry`: `./corner-cut` (`cornerCutClipPath`, `cornerCutPolygon`, `insetCut`), `./overlay-placement` (`computeOverlayPlacement`). Pure functions.
- `@nyc-tron/icons` (7 JS files + `.d.ts`, no TS source): `.`, `./native` (`TronIcon`, `TronIconButton`, `ForgeIcon`), `./web`, `./catalog` (`iconIds`, `searchIcons`, `iconGroups`), `./glyphs` (`glyphs`, `getGlyph`), `./state` (`resolveIconState`, `riveIconInputs`), `./tokens` (`iconSizes`, `iconStroke`, `iconMotion`, `iconColorTokens`, `iconColorsFromTheme`). The catalog's own comment says not all names have finished vector artwork.
- `@nyc-tron/panes`: `AdaptivePaneHost`, `SafeAreaFoldableLayout`, `window-lifecycle` (window registry: `openWindow`, `dragOver`, `dropDrag`, `snapshotLayout` ...). 4 src files.
- `@nyc-tron/expo-controls` (11 subpaths, 25 imports from `@nyc-tron/ui`): `NativeDropdown`, `NativeActionMenu`, `NativePopover`, `Tooltip`, `NativeSliderField`, `NativeSplitButton`, `ContextMenu`, `Select`, `FindReplacePopover`, `menu-model`. Export conditions include `qnx`, `marathon`, `browser`, `react-native`, `default` (e.g. Tooltip -> `.qt.js` for qnx/marathon, `.web.js`, `.native.js`).
- `@nyc-tron/native-controls`: `ArcKnob`, `XYPad`, `DisplayP3DiscLayer`, `NativeVideoPlayer`, `NativePointerInput`, `pointer-input` (`createPointerRouter`). Expo module `NYCTronInstruments`.
- `@nyc-tron/native-navigation`: `NativeNavigationRail`, `navigation-model` (`resolvePhysicalRightRailRegion`, `resolveRailDimensions`, `validateNavigationItems`). Expo module `NYCTronNavigation`.
- `@nyc-tron/native-charts`: `NativeChart` (kinds from `NATIVE_CHART_KINDS`), `types`, `chartColorsFromTheme`. Expo module `NYCTronCharts`.
- `@nyc-tron/hardware-keys`: `useHardwareKeyboard`, `addHardwareKeyListener`, `payload`. Expo module `NYCTronHardwareKeys`.
- `@nyc-tron/platform-services`: `haptics`, `documents`, `playback`, `playback-policy`, `checkpoints`, `media` (decoders). Only package with a runtime `dependencies` entry (`mediabunny 1.65.2`). Expo modules `NYCTronHapticsModule`, `NYCTronDocumentsModule`, `NYCTronPlaybackSessionModule`, `NYCTronMediaDecoderModule`.
- `@nyc-tron/reserved-regions`: `useReservedRegions`, `useWindowControlsInsets`, `ReservedRegionsOverride`, `payload`. Expo module `NYCTronReservedRegions`.
- `@nyc-tron/app-identity`: Node CLI (`nyc-tron-launcher-check`, `nyc-tron-derive-icons`), no React.
- `@nyc-tron/windows-fluent`: `createWindowsNavigationController`, `validateWindowsNavigationState`, `controller`, `types` (TS contract for a standalone WinUI3 C# shell).
- `@nyc-tron/windows-fluent-fabric` (`packages/windows-fluent/rnw-fabric`): `navigation-binding`, `navigation-host`, `windows`, `window-controller`, `window-types`, `window-chrome`, `overlays`, `drag-drop`. RNW 0.85 Fabric XAML island `TronNavigationView`.
- `@nyc-tron/macos-appkit` (`packages/macos-appkit/spark`): `window-controller`, `windows`, `window-chrome`, `sidebar`, `split-view`, `button`, `text-field`, `select`, `segmented-control`, `drag-drop`, `menus`, `context-menu`, `tooltip`, `popover`, `anchored-inspector`.

## 2. Platform targets and renderers (per package)

Declared program targets (`docs/completion/library-progress.json` `requiredPlatforms`): ios, android, web, macos, windows, visionos, quest, pico. `README.md` and `docs/SUPPORT.md` state acceptance on all eight is NOT complete; verified lanes are web (Chromium, 686 cases claimed), iOS/Android clean-consumer builds, and install-path runs (SUPPORT.md "Expo install paths", 9 jobs). I did not re-verify any CI result.

Three isolated runtime lanes (SUPPORT.md): Expo SDK 58 + RN 0.88 (ui, expo-controls, native-controls, native-navigation, native-charts, hardware-keys, platform-services, reserved-regions); RNW 0.85.3 (`windows-fluent-fabric`); Spark 0.0.3 / Expo 55 / RN 0.83.10 / RN-macOS 0.83 (`macos-appkit`). They cannot share one install. `ui` requires `react-native >=0.88.0`; `icons`/`panes` accept `>=0.85`.

| package | platforms | renderer |
|---|---|---|
| ui | iOS, Android, web (via react-native-web style `browser` condition), QNX/Marathon (via `expo-controls` conditions and docs/qt evidence) | RN `View/Text/Pressable` styled with Tailwind v4 classes through Uniwind (`className`); Skia (`react-native-skia`) in 4 files: `forge/canvas/GPUCanvasViewport.tsx` (SkiaGraphiteView), `forge/canvas/graphite-frame.ts`, `forge/ink/InkStrokePreview.tsx`, `forge/slides/InkAndLaserPointer.tsx`; `@expo/ui` (SwiftUI/Compose) in 4 files (`NativeSeekBar.{native,web}`, `ColorChannels`, `color/HsvPicker`); `react-native-gesture-handler` in 28 files; `Native3DViewport` in `forge/cad` (renderer not inspected, guess: native view). No WebGPU/QML code found in ui (grep for `webgpu|navigator.gpu` returned nothing). |
| expo-controls | iOS (SwiftUI via `@expo/ui`), Android (Compose via `@expo/ui`), web (RN Modal fallback), QNX/Marathon (`.qt.js`, shared RN implementations) | `@expo/ui` + RN |
| native-controls | iOS, Android | Expo Modules with SwiftUI (`ios/*.swift`, 16 files) and Jetpack Compose (`android/.../instruments/*.kt`, 17 files); AVPlayer / Media3 video (names `TronAVPlayerSurface.swift`, `TronVideoSurface.kt`) |
| native-navigation | iOS, Android | SwiftUI rail; Material3 NavigationRail (Compose) |
| native-charts | iOS, Android | Swift Charts; Vico (Compose) per README (not verified in code) |
| hardware-keys | iOS, Android, web | `UIKeyCommand`; Android `KeyEvent`; web `document` keydown |
| platform-services | iOS, Android, web | Swift/Kotlin Expo modules (haptics, documents, audio session, media decoder); `mediabunny` + WebCodecs on web (`media/webcodecs-frame.web.ts`) |
| reserved-regions | iOS 27.1+, Android, web | `UIView.reservedRegions`; Jetpack WindowManager; Viewport Segments API |
| panes, core, geometry | all (pure / RN Views) | pure TS; panes use RN Views + zustand |
| icons | iOS, Android, web | `react-native-svg`; Rive input names exposed (`riveIconInputs`) but no Rive dependency |
| windows-fluent(-fabric) | Windows only | WinUI 3 XAML island in RNW Fabric, C++/WinRT (`NYCTronFluentFabric/*.cpp`) |
| macos-appkit | macOS only | AppKit via Spark (`@legendapp/spark`) native components, Obj-C++ (`macos/NYCTronPopover.mm`, `NYCTronDisplays.mm`) |
| app-identity | Node | CLI |

QNX / Marathon: no QML in the repo. Support is by export conditions (`qnx`, `marathon`) in `expo-controls` package.json, selecting shared RN code; the Qt Quick/Fabric host lives in another repo (`mikevocalz/react-native-qnx`, referenced by commit in `docs/qt/qt-fabric-host-2026-11-10.md`). Docs there claim 9 controls ran 39/39 steps on Linux Qt host for both targets; "Physical QNX and Marathon device acceptance remains unverified". `docs/qt/component-coverage.json` classifies 282 of 341 capabilities as shared-source candidates for QNX/Marathon, 50 needing extra providers, 9 external; every row `runtimeAcceptance: unverified`. `tooling/qt-component-coverage.mjs` regenerates it.

## 3. Token sources

Single design contract: `docs/THEME_TOKENS.md` (+ `packages/core/src/theme.ts`, + `packages/ui/tests/contracts.test.mjs` which enforces it). The library ships no palette; the consuming app defines CSS variables.

- Naming: Tailwind v4 `@theme` variables. Colors `--color-{primary,on-primary,surface-raised,surface-sunken,border,text,text-muted,danger,on-danger,accent,info,success,focus}`; radii `--radius-control`, `--radius-card`. Used as utilities: `bg-primary`, `text-on-primary`, `bg-surface-raised`, `bg-surface-sunken`, `border-border`, `text-text`, `text-text-muted`, `bg-danger`, `text-on-danger`, `bg-accent`, `bg-info`, `bg-success`, `ring-focus`, `rounded-control`, `rounded-card` (13 colors + 2 radii; optional: danger, on-danger, accent, info, success).
- JS mirror: `TronTheme` in `packages/core/src/theme.ts`: `colors` (same 13 keys, camelCase), `shape` {controlRadius, cardRadius, borderWidth}, `density` "comfortable"|"compact"|"touch", `motion` {fastMs, standardMs}. `TRON_THEME_TOKENS` maps key -> CSS variable; `themeCssVariables(theme)` emits the variable map; `validateTheme()` accepts deprecated aliases (`surface`, `foreground`, `muted`, `background`, `surfaceRadius`).
- Native-only metrics with no CSS token: `shape.borderWidth`, `density`, `motion.fastMs`, `motion.standardMs` (`TRON_NATIVE_METRICS`). Finding: `fastMs`/`standardMs` are referenced only in `core/src/theme.ts` and `core/src/presets/infrax.ts`; no component or native module reads them (grep). Motion in components is `motion-reduce:transition-none` classes (9 files reference reduce-motion) and `active:opacity-80`.
- Spacing and type: NO tokens. Components use Tailwind default scale classes (`px-3 py-2`, `min-h-11`, `gap-2`, `text-sm`, `text-xs`) and inline numeric style props. Tailwind default-scale usage is inherited from the consumer's Tailwind config (not tokenized by the library).
- Preset: `packages/core/src/presets/infrax.ts` (InFraX light/dark objects, 28 hex literals; doc `docs/themes/INFRAX.md`). Reference light/dark CSS block in THEME_TOKENS.md (neutral blue palette, WCAG ratios claimed).
- Icons have their own tokens (`packages/icons/src/tokens.js`): `iconSizes` {xs 12, sm 16, toolbar 20, default 24, touch 28, feature 32, hero 48}, `iconStroke` {24, 2.35, round}, `iconMotion` (hoverMs 120, pressMs 110, selectMs 225, deselectMs 175, successMs 320, errorMs 240, loadingMs 850, pressScale 0.9, selectedScale 1.075), `iconColorTokens` role -> theme key.
- Theming mechanism: Tailwind v4 + Uniwind in the app (`@import "tailwindcss"; @import "uniwind"; @source ".../@nyc-tron/ui/dist/components"`), light/dark via the app's CSS (`@media (prefers-color-scheme: dark)` shown in docs). `packages/ui/src/components/theme/NightScope.tsx` (28 lines, imports `uniwind`) is the only in-library theme component. Native adapters (`native-charts` `chartColorsFromTheme`, `native-navigation` `defaultIndicatorColor`) take explicit color props derived from `TronTheme`.
- Overrides: `unstyled` + `className`/slot props. `docs/THEME_TOKENS.md` states the build does not fail on a missing variable (utility silently emits nothing).
- Mismatch to note: `examples/theme-bridges/README.md` uses `border-border-strong`, `shadow-card`, `font-display`, which are not in THEME_TOKENS.md (they are the example app's own tokens).

## 4. Hardcoded values (non-test, non-generated, `git ls-files`, excluding `/tests/`, `*.test.*`, `*.d.ts`, `dist`, `licenses`, `third-party`)

Script: `<scratch>/audit_hc.sh`. Languages scanned: ts/tsx/js/mjs/qml/swift/kt/java/m/mm/cpp/h. Spacing regex: `padding*|margin*|gap|rowGap|columnGap : <number>`. Type regex: `fontSize|lineHeight|letterSpacing : <number>`. Duration regex: `duration|delay|timeout (:|=) <int>`.

| package | files | hex | rgba()/hsl() | spacing literals | radius literals | type literals | duration literals | tw arbitrary `p-[..]` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| ui | 624 | 1 | 8 | 1050 | 130 | 91 | 0 | 2 |
| core | 12 | 29 | 0 | 0 | 0 | 0 | 0 | 0 |
| expo-controls | 32 | 0 | 0 | 10 | 0 | 0 | 0 | 0 |
| windows-fluent (incl. rnw-fabric) | 75 | 0 | 0 | 15 | 0 | 0 | 0 | 0 |
| native-navigation | 9 | 0 | 0 | 4 | 1 | 1 | 0 | 0 |
| native-controls | 41 | 4 | 0 | 0 | 0 | 0 | 0 | 0 |
| native-charts | 21 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| panes | 4 | 0 | 2 | 0 | 0 | 0 | 0 | 0 |
| platform-services | 113 | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| others (app-identity, geometry, hardware-keys, icons, macos-appkit, reserved-regions) | | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

Interpretation:
- Hex in `ui` is effectively clean: the single hit is a doc comment / spoken-color string in `forge/vector/vector-types.ts`. `packages/ui/tests/contracts.test.mjs` line ~179 fails on quoted hex literals in ui components, which is why. The 8 `rgba()` hits are scrims/shadows and CSS-string builders:
  - `ui/src/components/forge/devices/DevicePairingDialog.tsx:158` `backgroundColor: "rgba(0,0,0,0.5)"`
  - `ui/src/components/navigation/CollapsibleDrawer.tsx:131` `backgroundColor: "rgba(0,0,0,0.25)"`
  - `ui/src/components/forge/layers/CanvasCompareView.tsx:188,217` `boxShadow:"0 1px 3px rgba(0,0,0,0.25)"`, `"0 4px 12px rgba(0,0,0,0.18)"`
  - `ui/src/components/forge/slides/slide-model.ts:52`, `forge/vector/vector-types.ts:150` (functions that format document colors; legitimate data, not theme)
  - `panes/src/components/AdaptivePaneHost.tsx:160,185` `rgba(0,0,0,0.12)` / `0.18`
- Native hex defaults: `native-controls/android/.../TronArcKnobView.kt:51-52` (`"#8B5CF6"`, `"#F5F5F7"`), `TronXYPadView.kt:41-42` (`"#8B5CF6"`, `"#13131A"`). Additional native color constants (not hex-string): `native-charts/android/.../TronChartColor.kt`, `TronChartView.kt`, `native-navigation/android/.../TronNavigationRailView.kt` (grep `parseColor|0x......|Color(red`: 9 hits across 5 files; counts from a quick scan, not classified).
- Spacing is the big one: 1050 numeric spacing props in ui vs 191 Tailwind `p-/px-/gap-N` class strings. Most frequent inline values: `gap:8` (272+41), `gap:6` (133+20), `gap:4` (86), `padding:8` (34), `gap:12` (23), `gap:2` (25). Font sizes inline: 11 (14x), 12 (18x), 13 (11x), 14 (6x); plus Tailwind `text-sm` 131, `text-xs` 112. Radius: Tailwind `rounded-control` 291, `rounded-card` 40 (tokenized); 130 inline `borderRadius: <n>` literals.
- Duration literals: none in ui by regex. `setTimeout(..., n)` appears 3 times in ui (not classified). `Animated` is used only in `data/TreeGrid.tsx` (scroll-linked). Icons' `Animated.spring` in `icons/src/ForgeIcon.js:70` uses `iconMotion.pressScale`.

10 worst files (count of lines matching spacing/radius/type/hex/rgba/duration regex, per `grep -c`):

| # | lines | file | example |
|---|---:|---|---|
| 1 | 36 | packages/ui/src/components/forge/audio/LoudnessMeter.tsx | `style={{ flexDirection: "row", padding: 2, gap: 2 }}` (l.88); `paddingHorizontal: 10` (l.106) |
| 2 | 19 | packages/ui/src/components/forge/layers/LayerStack.tsx | `style={{padding:12}}` (l.151) |
| 3 | 18 | packages/ui/src/components/forge/audio/BusAndRoutingMatrix.tsx | `style={{gap:8,padding:8}}` (l.142); `paddingHorizontal: 12, paddingVertical: 10` (l.148) |
| 4 | 15 | packages/ui/src/components/shell/KeyboardShortcutHUD.tsx | `minWidth:22,paddingHorizontal:5,paddingVertical:2` (l.138); `gap:3` (l.135) |
| 5 | 13 | packages/ui/src/components/forge/midi/MIDIVelocityLane.tsx | `columnGap: 12, rowGap: 8, padding: 8` (l.212) |
| 6 | 13 | packages/ui/src/components/forge/audio/SpectrogramView.tsx | (not sampled) |
| 7 | 13 | packages/ui/src/components/forge/audio/PluginPresetBrowser.tsx | (not sampled) |
| 8 | 13 | packages/ui/src/components/forge/audio/InsertEffectRack.tsx | (not sampled) |
| 9 | 12 | packages/ui/src/components/forge/pdf/CommentsThreadPanel.tsx | (not sampled) |
| 10 | 12 | packages/ui/src/components/forge/layers/ArtboardNavigator.tsx | (not sampled) |

(Next: `forge/layers/ArtboardNavigator`, `forge/audio/EQFrequencyGraph.tsx` 12, `core/src/presets/infrax.ts` 12 = intentional theme data.)

Color-only worst files: `packages/core/src/presets/infrax.ts` (28 hex, intentional preset), then `native-controls/android/.../TronArcKnobView.kt`, `TronXYPadView.kt`, `panes/.../AdaptivePaneHost.tsx`, `ui/.../DevicePairingDialog.tsx`, `ui/.../CanvasCompareView.tsx`, `ui/.../CollapsibleDrawer.tsx`.

Also hardcoded: Button min sizes (`minWidth 44`, `minHeight 40/44/48`) in `Button.tsx` style prop; 44 pt touch target is a deliberate accessibility constant repeated across files (not tokenized).

## 5. Dependencies

### 5.1 Cross-package imports (static, src files, excluding tests)

| from | to | import statements |
|---|---|---:|
| expo-controls | @nyc-tron/ui | 25 |
| hardware-keys | @nyc-tron/ui | 9 |
| ui | @nyc-tron/core | 9 |
| panes | @nyc-tron/core | 3 |
| reserved-regions | @nyc-tron/core | 9 |
| windows-fluent(-fabric) | @nyc-tron/core | 15 (+1 to windows-fluent) |
| macos-appkit | @nyc-tron/core | 5 |

Peer declarations: `ui` peers `@nyc-tron/core` (optional), `expo-controls` peers `@nyc-tron/ui`, `hardware-keys` peers `@nyc-tron/ui`, `panes` and `reserved-regions` peer `@nyc-tron/core` (required), `windows-fluent-fabric` pins core + windows-fluent to `1.0.0-rc.2`. `workspace:^` appears in published peer ranges; the tarball install guide (README) says sibling packages must be listed together.

### 5.2 External npm deps per package (from import scan + package.json)

| package | imports (src) | peers (package.json) |
|---|---|---|
| ui | react, react-native, zustand (139 files), react-native-gesture-handler (28), @expo/ui (4), react-native-skia (4), @tanstack/react-table (1: `data/DataTable.tsx`), expo-drag-drop-content-view (1: `files/DropZone.native.tsx`), expo-linear-gradient (1: `forge/color/HsvPicker.tsx`), uniwind (1: `theme/NightScope.tsx`) | `react >=19`, `react-native >=0.88` required; optional: `@nyc-tron/core ^`, `@expo/ui ^58`, `@tanstack/react-table ^9`, `expo-drag-drop-content-view >=0.9.2 <1`, `expo-linear-gradient ^58`, `react-native-gesture-handler >=3.3.0 <4`, `uniwind >=1.12.2 <2`, `zustand ^5`, `react-native-skia >=3.9.1 <4` |
| expo-controls | react, react-native, @expo/ui, zustand | react >=19, RN >=0.88, @expo/ui ^58, expo ^58, zustand ^5, @nyc-tron/ui |
| native-controls | react, react-native, expo, @expo/ui | expo >=58.0.21, @expo/ui ^58 |
| native-navigation | react-native, expo, @expo/ui | same |
| native-charts | react, react-native, expo, @expo/ui | same |
| hardware-keys | react, react-native, expo | expo ^58, @nyc-tron/ui |
| platform-services | expo, expo-file-system, zustand, mediabunny | expo ^58, expo-file-system ^58, zustand ^5; `dependencies`: mediabunny 1.65.2 |
| reserved-regions | react, react-native, expo, zustand | expo ^58, zustand ^5, @nyc-tron/core |
| panes | react, react-native, zustand | zustand ^5, @nyc-tron/core |
| icons | react, react-native, react-native-svg | react-native-svg >=15 |
| macos-appkit | react, react-native, @legendapp/spark | exact pins (spark 0.0.3, expo 55.0.32, RN 0.83.10, nitro-modules 0.37.0) |
| windows-fluent-fabric | react, react-native | RN 0.85.3, react-native-windows 0.85.0, react >=19.2 |

Discrepancy: `packages/ui/README.md` lists zustand as needed by 9 subpaths, but 139 ui source files import zustand directly (55 in `shell`, ~75 in `forge`, plus Select, DataTable, TreeGrid, KeyValueList, DropZone ...). `tooling/verify-packages.mjs` is documented as regenerating this table from the compiled graph; whether it matches the README at this commit was not run. So the README table is likely out of date or only lists package-level groupings (guess).

### 5.3 ui internal dependency edges

Everything non-forge funnels through `components/styles.ts` (`joinClasses`, 8 lines) and `useLocalStore`. Edge list for all non-forge-subfolder files is in Appendix B (97 source files, `Button -> styles`, etc.). Directory-level edges: `<scratch>/audit_dep.json` (`ui` key, 224 group edges). Top ones (import statements): forge/timeline -> root 77, forge/color -> root 53, forge/audio -> root 50, forge/audio -> forge/inputs 48, forge/timeline -> forge/inputs 43, forge/timeline -> gestures 42, forge/timeline -> feedback 38, forge/motion -> root 37, forge/timeline -> forge/timebase 35, shell -> root 34, forge/audio -> feedback 34, forge/photo -> root 32, forge/pdf -> forge/inputs 29, forge/cad -> forge/inputs 28, forge/spreadsheet -> root 28 ("root" = Button/Card/TextField/Select/etc. in `components/*.tsx`).

Non-forge edges (selected, from Appendix B):
- Button, Card, FieldGroup, IconButton, List, NavigationRail, TextField, content/KeyValueList, feedback/Badge -> `styles`
- SegmentedControl, TabBar, Toolbar -> `styles`, `forms/choice-keys`; Select -> `styles`, `forms/choice-keys`, `forms/option-groups`
- DragGrabHandle -> `gestures/drag-controller`, `drag-transport`, `PanResponderDrag`
- feedback/EmptyState -> `Button`; Banner/ErrorMessage -> `feedback/glyphs`
- files/FileImportExportSheet.shared -> `Button`, `TextField`, `overlays/popover-position`, `overlays/focus-restore`, `shell/shell-keys`
- overlays/CommandPalette -> `TextField`, popover-position, focus-cycle, focus-restore, command-filter; AnchoredPopover -> popover-position, focus-cycle, focus-restore, useTriggerAnchor, measure-anchor
- shell/AdaptiveDock -> `DragGrabHandle`, `overlays/popover-position`, `shell/MenuButton`, `shell/PaneSplitter`, `shell-keys`, `dock-model`
- shell/AssetBrowser -> `Button`, `Select`, `feedback/ErrorMessage`, `shell/InspectorSearch`
- shell/ContextMenu -> `overlays/CommandPopover`
- forge/NativeSeekBar.shared -> `Button`, `forge/timebase`, `forge/inputs/useScopedControl`
- forge/SpreadsheetGrid -> `gestures/editor-interaction-scope`, `forge/spreadsheet/FormulaBar`, `feedback/ErrorMessage`, `forge/sheet-window`, `range-tsv`, `range-paste`, `cell-commit`
- forge/WaveformLane -> `forge/waveform-gesture`, `forge/waveform`, `feedback/ErrorMessage`, `forge/inputs/useScopedControl`
- gestures/useEditorPan -> `forge/canvas/canvas-gesture-relations` (a non-forge file importing from forge: layering inversion)
- Odd edge: 8 imports resolve to a group named `packages` (relative path escapes `src/components`; not investigated, guess: tests or tooling-style imports).

Implication for a registry: `registryDependencies` for most ui items are 1 to 4 small files (`styles.ts` is universal), but forge items fan into `forge/inputs/*`, `feedback/*`, `gestures/*` and `shell/*`; use `audit_dep.json` for the graph. Subpath imports are claimed independent (AGENTS.md rule 6); `tooling/verify-packages.mjs` enforces that the root barrel reaches no optional peer.

## 6. Existing docs

Present:
- Root: `README.md` (17 KB: positioning, packages table, install from release tarballs, Expo/Tailwind/Uniwind setup, macOS/Windows notes), `AGENTS.md` (4.7 KB; product/contribution rules for agents, not a usage guide), `CHANGELOG.md` (13 KB, Keep a Changelog), `THIRD_PARTY_NOTICES.md`, `LICENSE`, `licenses/` (22 entries).
- `.github/agents/*.agent.md` (3 files: component-system, foldable-spatial, native-platform): maintainer-persona prompts (frontmatter `name/description/tools`), contributor-facing.
- `docs/`: `ARCHITECTURE.md`, `COMPONENT_OWNERSHIP.md` (87 KB table: Component | Source owner/import | Implementation status | Prior source), `ROSTER.md`, `SUPPORT.md` (41 KB), `THEME_TOKENS.md`, `V1_DECISIONS.md`, `EXACT_NATIVE_FEEL.md`, `RESPONSIVE_TABLES.md`, `APP_IDENTITY.md`, `MIGRATION.md`, `WINDOWS_NATIVE_HOST.md`, `FORGE_COMPONENT_INTEGRATION.md`, cluster notes (`AUDIO_CLUSTER_2`, `CANVAS_CLUSTER`, `TIMELINE_CLUSTER_2`, `MEDIA_RECOVERY`, `WORKSPACE_COLOR_TRANSFER`, `ADVANCED_*`), `themes/INFRAX.md`, `qt/*` (Qt/QNX evidence and coverage), `completion/` (program, ~60 phase reports `P02..P10-*.md`, `reports/*`, 336 evidence files, `library-progress.json` 5499 lines, `baseline-roster.tsv` 341 rows, `distribution-review.json`).
- Per-package READMEs for all packages (21 to 216 lines; `ui/README.md` is 26 lines and covers only root exports and optional-peer table). `examples/native-feel` (4-flow reference app + tests), `examples/theme-bridges/README.md`, `examples/native-instruments`, `examples/macos-appkit/spark`.
- Tests: 325 files under `packages/*/tests` (ui: 159 Chromium spec files under `tests/browser`, 14 render tests, plus node tests); `.argent/e2e/*.yaml` (Maestro-style flows, 9 listed).

Coverage gaps for agent use:
- No per-component usage docs. `COMPONENT_OWNERSHIP.md` has one line per component with status, not props, examples, slots, a11y notes or do/don't. No Storybook/MDX/typedoc (`git ls-files | grep -iE 'storybook|\.mdx$|typedoc'` returned nothing).
- API detail exists only as generated JSON (`api-signatures.json` has symbol -> declaration pointers, 2.5 MB) and JSDoc inside source (not uniform: many files have no leading doc comment; Appendix A shows empty purpose cells).
- No machine-readable component metadata (category, platforms, peers, tokens used) per component beyond: `docs/completion/library-progress.json` (341 canonical IDs with status/gates, historical naming A-01.. etc.), `docs/completion/baseline-roster.tsv`, `docs/desktop-support.json` (per-component support on desktop lanes), `docs/qt/component-coverage.json` (per-ID Qt counterpart, selected sources, transitive imports), `packages/core/src/advanced-catalog.ts` ("Historical design/audit registry, not a current completion claim", 71 lines). These are the closest existing artefacts to a registry.
- README props examples are only Button/Card/NavigationRail/WaveformLane/NativeSeekBar.

Stale or inconsistent (verified by reading):
- `README.md:119` "551 export keys" vs 556 in `packages/ui/package.json` exports.
- `README.md:10` "15 GitHub Release tarballs" vs `README.md:297` and `CHANGELOG.md:5,13` "sixteen archives"; README packages table lists 15 rows and has no `@nyc-tron/macos-appkit` row (macOS appears only in install sections).
- `docs/ROSTER.md` is dated 2026-11-10 and its CI table is labeled "historical evidence" for commit `d5207cc7`; it says edits were "uncommitted when this table was written".
- `docs/SUPPORT.md` and `COMPONENT_OWNERSHIP.md` embed run IDs/commit hashes that go stale each release.
- `packages/ui/README.md` zustand/`@expo/ui` peer tables appear incomplete (see 5.2; `@expo/ui` also used by `forge/color/HsvPicker.tsx`, README lists only NativeSeekBar and ColorChannels).
- `docs/completion/library-progress.json` ids (`A-01`, ...) use a roster scheme that does not match component names or subpaths 1:1 (e.g. A-03 = AdaptiveDock).
- `AGENTS.md` instructs agents to first read an external skill in another repo (`mikevocalz/nyc-mon/skills/mikevocalz-foldable-layouts/SKILL.md` at a blob SHA), which an agent without that repo cannot do.

## 7. Existing registry / components.json / llms.txt artefacts

None of the requested ones exist: `git ls-files | grep -iE 'llms|components\.json|registry|SKILL|CLAUDE|\.cursor|AGENTS|mcp'` matched only `AGENTS.md`, `.github/agents/*.agent.md`, `docs/completion/evidence/t3-app-identity-20261112/SKILLS-3.3.md` (evidence note) and `packages/hardware-keys/src/binding-registry.ts` (unrelated key-binding registry). No `registry.json`, `components.json`, `llms.txt`, `SKILL.md`, `CLAUDE.md`, `.cursor`.

Partial equivalents to reuse as generators' inputs: `docs/api-surface.json`, `docs/api-signatures*.json`, `docs/desktop-support.json`, `docs/qt/component-coverage.json`, `docs/completion/library-progress.json`, `docs/completion/baseline-roster.tsv`, `packages/core/src/advanced-catalog.ts`, `docs/advanced-gui-sources.json` (third-party source provenance, 9 KB). Generators already in `tooling/`: `api-surface.mjs`, `api-signatures.mjs`, `import-specifiers.mjs`, `qt-component-coverage.mjs`, `verify-component-program.mjs`, `verify-packages.mjs`, `consumer-smoke.mjs`, `pack-release.mjs`.

## 8. Native code a registry item would have to ship or reference

No Nitro specs exist in this repo (only a `react-native-nitro-modules` peer pin in `macos-appkit`). All iOS/Android native code is Expo Modules (`expo-module.config.json`, `ios/*.podspec` or `Package.swift`, `android/build.gradle`). Counts from `git ls-files`:

| package | iOS | Android | module config | modules |
|---|---|---|---|---|
| native-controls | 16 files (`ios/*.swift`, `NYCTronInstruments.podspec`, root `Package.swift`) | 17 files (`android/src/main/java/com/nyctron/instruments/*.kt`) | `NYCTronInstruments`, coreFeatures swiftui, compose | ArcKnob, XYPad, DisplayP3Disc, VideoPlayer (AVPlayer / Media3), PointerInput |
| native-charts | 9 | 9 | `NYCTronCharts`, swiftui, compose | NativeChart |
| native-navigation | 3 | 3 | `NYCTronNavigation`, swiftui, compose | NavigationRail |
| hardware-keys | 11 | 9 | `NYCTronHardwareKeys` (apple + android) | key commands |
| platform-services | 47 | 32 | `NYCTronPlatformServices` (4 apple modules listed) | haptics, documents, playback session, media decoder; `third-party/mediabunny/LICENSE`; `THIRD_PARTY.md` |
| reserved-regions | 8 | 5 | `NYCTronReservedRegions` | fold/hinge |
| macos-appkit/spark | `macos/NYCTronPopover.{h,mm}`, `NYCTronDisplays.{h,mm}`, `NYCTronPopoverComponentDescriptor.h`, `NYCTronAppKit.podspec`, `react-native.config.cjs` | n/a | Spark autolink | Obj-C++ Fabric component + TurboModule specs `src/NYCTronPopoverNativeComponent.ts`, `src/NativeNYCTronDisplays.ts` |
| windows-fluent/rnw-fabric | n/a | n/a | RNW codegen | 34 C++/WinRT/XAML files under `windows/NYCTronFluentFabric` (e.g. `DesktopSession.cpp`, `DesktopTitleBar.cpp`, `NativeDragBroker.cpp`) + `example/` (56 files), isolated-tests, scripts; plus `windows/NYCTron.Fluent.WinUI3` (C# shell, 4 files in `windows-fluent`) |
| tooling/native | `native-player-ios` (7), `presentation-bridge-ios` (9), `presentation-index-ios` (3), `ui-flows` (5), `IsoBmffTimelineTest.java` | | | test harness / fixtures, not shipped |

No `.qml`, no Kotlin Multiplatform, no C++ in packages besides Windows and macOS. `examples/macos-appkit/spark` (16 files) is a consumer app.

Registry implications (guesses flagged): a shadcn-style source-copy item for `@nyc-tron/ui` components is feasible for pure-JS subpaths, but any item that imports `@nyc-tron/native-*`, `expo-controls`, `hardware-keys`, `platform-services` or `reserved-regions` needs the native package installed as a dependency (config plugin / autolinking, Xcode and Gradle build, Expo 58 dev build); copying source cannot include the Swift/Kotlin without also shipping `expo-module.config.json`, podspec and gradle files. Windows/macOS items live in isolated runtime lanes and cannot share a project with the RN 0.88 packages (SUPPORT.md). (guess for the shape of the solution; the constraints above are from the docs.)

## 9. Things an agent-native pass will trip on (verified facts only)

1. `ui` source imports use `.ts/.tsx` extensions and rely on Tailwind class strings scanned from `dist/components` (README `@source`); copied source would need the consumer's `@source` pointed at it.
2. 139 ui files import zustand for per-instance state, so "optional peer" is optional only for the few primitives (Button, Card, TextField, etc. do not import it).
3. Export-condition resolution (`browser`, `react-native`, `qnx`, `marathon`, `default`) is the platform mechanism; `.native/.web/.shared` file triples are not a flat single file per component.
4. `ui` has no consolidated metadata per component, so categories/descriptions must be derived (JSDoc is partial) or authored.
5. Spacing/type are inline numbers in 100s of places; color is clean; motion tokens exist in `TronTheme` but are unused by components.
6. Source conventions: `AGENTS.md` bans importing `@nitro-forge/*`, requires per-component subpaths, forbids hardcoded palettes, forbids `useState` for new app state (Zustand/refs instead), and requires the no-ai-slop style for docs. Its "honesty" rule (10) requires reporting unit checks separately from device validation.


## Appendix A. Per-subpath export table (generated from docs/api-signatures.json + package.json exports + src first JSDoc)

Caveat: `kind` is a regex guess (component = file has an uppercase exported function/const, forwardRef or memo; module = .ts file; tsx-model = .tsx without such a match). "exports" lists api-signatures symbols minus `*Props` names (types and values are mixed, first 8 shown). Purpose is the first sentence of the first `/** */` block in the file (empty when none). Source shown is the first matching src file for the export target; `[variants: ...]` lists sibling platform files.

### @nyc-tron/app-identity (1 subpaths)

| subpath | source | kind | exports (non-type names shown first; Props types in parens) | purpose (first doc line) |
|---|---|---|---|---|
| `.` | app-identity/src/index.js | module | AppIdentity, CheckResult, DeriveOptions, DeriveResult, DescribedConfig, FORMATS, IconFormat, LabelEntry, +7 |  |

### @nyc-tron/core (12 subpaths)

| subpath | source | kind | exports (non-type names shown first; Props types in parens) | purpose (first doc line) |
|---|---|---|---|---|
| `.` | core/src/index.ts | module | AdvancedComponent, ComponentStage, DeviceFamily, FoldFeature, FoldLayout, FoldOcclusionType, FoldOrientation, FoldPosture, +60 |  |
| `./advanced-catalog` | core/src/advanced-catalog.ts | module | AdvancedComponent, ComponentStage, LicenseReview, advancedNativeCatalog, upstreamCandidates | Historical design/audit registry, not a current completion claim. |
| `./folds` | core/src/folds.ts | module | FoldFeature, FoldLayout, FoldOcclusionType, FoldOrientation, FoldPosture, FoldState, Rect, ReservedRegion, +17 | Pure hinge/occlusion geometry. |
| `./navigation` | core/src/navigation.ts | module | DeviceFamily, NativePlatform, NavigationInput, NavigationShell, Runtime, resolveNavigationShell, windowsPaneMode | Hardware FAMILY selects the navigation shell; live geometry selects the content panes independently. |
| `./overlays` | core/src/overlays.ts | module | CommandMenuItem, PopupPosition, Rect2D, hasUsableRegion, placePopover, placementSide | Popup placement in caller-provided, nonoccluded host/window coordinates. |
| `./pane-plan` | core/src/pane-plan.ts | module | InspectorPlacement, MasterPlacement, PanePlan, PanePlanInput, resolvePanePlan | Master discovers, Detail owns the selected record/workspace, Inspector overlays contextual controls; no duplicate scene or routing state. |
| `./presets/infrax` | core/src/presets/infrax.ts | module | INFRAX_DARK_THEME, INFRAX_THEME, INFRAX_THEME_NAME, InfraxStatusColors, InfraxTokenOptions, infraxTokens | Brand-specific preset built on NYC-Tron primitives. |
| `./spatial` | core/src/spatial.ts | module | SpatialPanelSpec, validateSpatialPanel, validateSpatialPanelSet | Spatial scene coordinates are meters; React Native window units are not. |
| `./spatial-interactions` | core/src/spatial-interactions.ts | module | Hit3, ModelHandoffParams, PinchState, Plane3, Ray3, SpatialModelHandoff, Target3, Vec3, +6 | Engine-neutral XR interactions in METERS, not screen pixels. |
| `./theme` | core/src/theme.ts | module | TRON_NATIVE_METRICS, TRON_THEME_TOKENS, TronTheme, TronThemeColorAliases, TronThemeColors, TronThemeInput, TronThemeShape, themeCssVariables, +1 | Native theme-resource adapter input. |
| `./window-chrome` | core/src/window-chrome.ts | module | DEFAULT_WINDOW_CONTROL_LABELS, DescribeTitleBarOptions, DrawnControlsLayout, NO_TITLE_BAR_INSETS, PageWindowHost, PageWindowHostOptions, TitleBarControls, TitleBarInsets, +13 | Window title bar and window-control contract. |
| `./window-lifecycle` | core/src/window-lifecycle.ts | module | DisplayInfo, DragOffer, DragSession, LayoutSnapshot, MAX_WINDOWS, OpenWindowSpec, Outcome, ReflowResult, +23 | Window lifecycle contract for multiwindow hosts. |

### @nyc-tron/expo-controls (11 subpaths)

| subpath | source | kind | exports (non-type names shown first; Props types in parens) | purpose (first doc line) |
|---|---|---|---|---|
| `.` | expo-controls/src/index.ts [variants: native.ts,shared.ts] | module | NativeDropdown, NativeDropdownGroup, NativeDropdownOption, NativePopoverTriggerState, Rect2D, TronMenuAction (props: ContextMenuProps, NativeActionMenuProps, NativeDropdownProps) |  |
| `./ContextMenu` | expo-controls/src/components/ContextMenu.web.tsx [variants: tsx] | component | ContextMenu (props: ContextMenuProps) | Web: right-click and stylus barrel click (`contextmenu`), long press, Shift+F10 and the Menu key, through the `@nyc-tron/ui` shell ContextMe |
| `./FindReplacePopover` | expo-controls/src/components/FindReplacePopover.web.tsx [variants: tsx] | tsx-model | FindReplacePopover (props: FindReplacePopoverProps) |  |
| `./NativeActionMenu` | expo-controls/src/components/NativeActionMenu.web.tsx [variants: tsx] | component | NativeActionMenu | Shared RN Modal presentation for web, QNX and Marathon. |
| `./NativeDropdown` | expo-controls/src/components/NativeDropdown.tsx [variants: native.tsx,shared.tsx] | component | NativeDropdown, NativeDropdownGroup, NativeDropdownGroupsChoice, NativeDropdownOption, NativeDropdownOptionsChoice, dropdownOptions, validateDropdownOptions (props: NativeDropdownBaseProps, NativeDropdownProps) | Web (and default) presentation. |
| `./NativePopover` | expo-controls/src/components/NativePopover.web.tsx [variants: tsx] | component | NativePopover, NativePopoverTriggerState (props: NativePopoverAnchorProps, NativePopoverProps, NativePopoverTriggerProps) | RN web presentation: the kit's AnchoredPopover, placed by placePopover in the caller's usable regions. |
| `./NativeSliderField` | expo-controls/src/components/NativeSliderField.web.tsx [variants: tsx] | component | NativeSliderField (props: NativeSliderFieldProps) | Web: the token-styled {@linkcode SliderField} from `@nyc-tron/ui`. |
| `./NativeSplitButton` | expo-controls/src/components/NativeSplitButton.web.tsx [variants: tsx] | component | NativeSplitButton (props: NativeSplitButtonProps) | Web: the token-styled {@linkcode SplitButton} from `@nyc-tron/ui`. |
| `./Select` | expo-controls/src/components/Select.web.tsx [variants: tsx] | tsx-model | Select, SelectGroup, SelectOption (props: SelectProps) |  |
| `./Tooltip` | expo-controls/src/components/Tooltip.web.tsx [variants: tsx] | component | Tooltip (props: TooltipProps) | Opens toward the side of the viewport with room, so the tooltip never leaves the window. |
| `./menu-model` | expo-controls/src/components/menu-model.ts | module | NativeMenuItem, TronMenuAction, enabledMenuLeaves, findEnabledMenuAction, menuFocusTarget, normalizeMenuActions | Action semantics shared by native Expo and controlled RN web fallback. |

### @nyc-tron/geometry (3 subpaths)

| subpath | source | kind | exports (non-type names shown first; Props types in parens) | purpose (first doc line) |
|---|---|---|---|---|
| `.` | geometry/src/index.ts | module | CutCorner, cornerCutClipPath, cornerCutPolygon, insetCut |  |
| `./corner-cut` | geometry/src/corner-cut.ts | module | CutCorner, cornerCutClipPath, cornerCutPolygon, insetCut | Geometry adapted from NYC-MON packages/ui/neon/corner-cut.ts. |
| `./overlay-placement` | geometry/src/overlay-placement.ts | module | Placement, Rect, computeOverlayPlacement | Position only; the host owns clipping, focus, portals and native windows. |

### @nyc-tron/hardware-keys (2 subpaths)

| subpath | source | kind | exports (non-type names shown first; Props types in parens) | purpose (first doc line) |
|---|---|---|---|---|
| `.` | hardware-keys/src/index.ts [variants: native.ts] | module | HardwareKeyChord, KeySource, NATIVE_MODULE_NAME, Subscription, UseHardwareKeyboardOptions, addHardwareKeyListener, getHardwareKeyRecorder, isHardwareKeysAvailable, +2 |  |
| `./payload` | hardware-keys/src/payload.ts | module | HardwareKeyChord, NATIVE_MODULE_NAME, toChord | Name both platforms register the Expo module under. |

### @nyc-tron/icons (7 subpaths)

| subpath | source | kind | exports (non-type names shown first; Props types in parens) | purpose (first doc line) |
|---|---|---|---|---|
| `.` | icons/src/index.js | module | ForgeIconOptions, ForgeIconPresentation, ForgeIconSize, ForgeIconState, ForgeIconVariant, getGlyph, getIconMetadata, glyphIds, +15 |  |
| `./catalog` | icons/src/catalog.js | module | getIconMetadata, hasIconId, iconCategories, iconGroups, iconIds, iconsInCategory, searchIcons |  |
| `./glyphs` | icons/src/glyphs.js | module | ForgeIconVariant, getGlyph, glyphIds, glyphs | Forge original 24x24 bold glyph paths. |
| `./native` | icons/src/TronIcon.js | module | ForgeIcon, ForgeIconButton, TronIcon, TronIconButton (props: TronIconButtonProps, TronIconProps) |  |
| `./state` | icons/src/state.js | module | ForgeIconOptions, ForgeIconPresentation, ForgeIconState, resolveIconState, riveIconInputs | Pure presentation state; no React/native dependency, portable to web, iPad, phone and XR. |
| `./tokens` | icons/src/tokens.js | module | ForgeIconSize, ForgeIconState, iconColorTokens, iconColorsFromTheme, iconMotion, iconSizes, iconStates, iconStroke | Icon color roles mapped to `@nyc-tron/core` theme color keys. |
| `./web` | icons/src/TronIcon.js | module | ForgeIcon, ForgeIconButton, TronIcon, TronIconButton (props: TronIconButtonProps, TronIconProps) |  |

### @nyc-tron/native-charts (3 subpaths)

| subpath | source | kind | exports (non-type names shown first; Props types in parens) | purpose (first doc line) |
|---|---|---|---|---|
| `.` | native-charts/src/index.native.ts [variants: ts] | module | CHART_UNAVAILABLE_MESSAGE, ChartThemeColors, NATIVE_CHART_KINDS, NativeChart, NativeChartColors, NativeChartKind, NativeChartPoint, NativeChartSeries, +1 (props: NativeChartProps, toNativeChartProps) |  |
| `./NativeChart` | native-charts/src/NativeChart.native.tsx [variants: tsx] | component | NativeChart | SwiftUI Charts on iOS 16+, Vico (Compose) on Android. |
| `./types` | native-charts/src/NativeChart.types.ts | module | CHART_UNAVAILABLE_MESSAGE, ChartThemeColors, NATIVE_CHART_KINDS, NativeChartColors, NativeChartKind, NativeChartPoint, NativeChartSeries, NativeChartWirePoint, +2 (props: NativeChartProps, NativeChartWireProps, toNativeChartProps) | Mark family drawn for every series in the chart. |

### @nyc-tron/native-controls (7 subpaths)

| subpath | source | kind | exports (non-type names shown first; Props types in parens) | purpose (first doc line) |
|---|---|---|---|---|
| `.` | native-controls/src/index.ts | module | ArcKnob, DisplayP3DiscLayer, XYPad, XYPoint (props: ArcKnobProps, DisplayP3DiscLayerProps, XYPadProps) |  |
| `./ArcKnob` | native-controls/src/ArcKnob.tsx | component | ArcKnob (props: ArcKnobProps) | One native commit per completed gesture; the engine owns persisted state. |
| `./DisplayP3DiscLayer` | native-controls/src/DisplayP3DiscLayer.tsx | component | DisplayP3DiscLayer (props: DisplayP3DiscLayerProps) | Disc diameter in layout units. |
| `./NativePointerInput` | native-controls/src/NativePointerInput.tsx [variants: web.tsx] | component | NativePointerInput (props: NativePointerInputProps) | UIKit/Android input with actual history, pen force/tilt, hover and hardware keys. |
| `./NativeVideoPlayer` | native-controls/src/NativeVideoPlayer.tsx | component | NativeVideoPlayer, NativeVideoStatus (props: NativeVideoPlayerProps) | AVPlayerLayer on iOS, VideoView/MediaPlayer on Android. |
| `./XYPad` | native-controls/src/XYPad.tsx | component | XYPad, XYPoint (props: XYPadProps) |  |
| `./pointer-input` | native-controls/src/pointer-input.ts | module | PointerBatch, PointerKeyEvent, PointerRouter, PointerRouterOptions, PointerSample, PointerStroke, createPointerRouter | A platform sample in local logical pixels. |

### @nyc-tron/native-navigation (3 subpaths)

| subpath | source | kind | exports (non-type names shown first; Props types in parens) | purpose (first doc line) |
|---|---|---|---|---|
| `.` | native-navigation/src/index.ts | module | NativeNavigationItem, RailRegion, defaultIndicatorColor, resolvePhysicalRightRailRegion, resolveRailDimensions, validateNavigationItems (props: NativeRailProps) |  |
| `./NativeNavigationRail` | native-navigation/src/NativeNavigationRail.native.tsx [variants: tsx] | component | NativeNavigationRail |  |
| `./navigation-model` | native-navigation/src/navigation-model.ts | module | NativeNavigationItem, RailRegion, defaultIndicatorColor, resolvePhysicalRightRailRegion, resolveRailDimensions, validateNavigationItems | Stable destination contract with no app theme or routing dependency. |

### @nyc-tron/panes (4 subpaths)

| subpath | source | kind | exports (non-type names shown first; Props types in parens) | purpose (first doc line) |
|---|---|---|---|---|
| `.` | panes/src/index.ts | module | AdaptivePaneHost (props: AdaptivePaneHostProps) |  |
| `./AdaptivePaneHost` | panes/src/components/AdaptivePaneHost.tsx | component | AdaptivePaneHost (props: AdaptivePaneHostProps) | Master/Detail/Inspector are stable React children, not route owners. |
| `./SafeAreaFoldableLayout` | panes/src/components/SafeAreaFoldableLayout.tsx | component | SafeAreaFoldableLayout (props: SafeAreaFoldableLayoutProps) | Only unconsumed insets. |
| `./window-lifecycle` | panes/src/window-lifecycle.ts | module | DisplayInfo, DragOffer, DragSession, LayoutSnapshot, MAX_WINDOWS, OpenWindowSpec, Outcome, ReflowResult, +23 | Compatibility entry for existing pane consumers. |

### @nyc-tron/platform-services (7 subpaths)

| subpath | source | kind | exports (non-type names shown first; Props types in parens) | purpose (first doc line) |
|---|---|---|---|---|
| `.` | platform-services/src/index.ts [variants: native.ts] | module | ActivateOptions, AudioSessionCategory, AudioSessionEvent, DEFAULT_FRAME_EDGE, DOCUMENTS_MODULE_NAME, DecodeAudioOptions, DecodeFrameOptions, DecodedAudio, +61 |  |
| `./checkpoints` | platform-services/src/checkpoints/index.ts [variants: native.ts] | module | CheckpointStorage, createPlatformCheckpointStorage |  |
| `./documents` | platform-services/src/documents/index.ts [variants: native.ts] | module | DOCUMENTS_MODULE_NAME, Documents, DocumentsNative, FilePickerDocumentSource, PickDocumentsOptions, PickMode, PickedDocument, RestoredAccess, +5 |  |
| `./haptics` | platform-services/src/haptics/index.ts [variants: native.ts] | module | HAPTICS_MODULE_NAME, HAPTIC_KINDS, HapticKind, Haptics, HapticsNative, HapticsOptions, HapticsState, PreferenceStorage, +4 |  |
| `./media` | platform-services/src/media/index.ts [variants: native.ts] | module | DEFAULT_FRAME_EDGE, DecodeAudioOptions, DecodeFrameOptions, DecodedAudio, DecodedFrame, DecodedPcm, MAX_DECODE_DURATION_US, MAX_FRAME_EDGE, +19 |  |
| `./playback` | platform-services/src/playback/index.ts [variants: native.ts] | module | ActivateOptions, AudioSessionCategory, AudioSessionEvent, IDLE_PLAYBACK, OutputLossReason, PLAYBACK_SESSION_MODULE_NAME, PlaybackAction, PlaybackLifecycleState, +9 |  |
| `./playback-policy` | platform-services/src/playback/policy.ts | module | AudioSessionEvent, IDLE_PLAYBACK, OutputLossReason, PlaybackAction, PlaybackLifecycleState, PlaybackTransition, nextPlaybackState, setPlaybackIntent, +1 | What the audio session reported. |

### @nyc-tron/reserved-regions (3 subpaths)

| subpath | source | kind | exports (non-type names shown first; Props types in parens) | purpose (first doc line) |
|---|---|---|---|---|
| `.` | reserved-regions/src/index.ts [variants: native.ts] | module | FoldOcclusionType, FoldOrientation, FoldState, NATIVE_MODULE_NAME, NO_WINDOW_CONTROLS, ReservedRegion, ReservedRegionsOverride, TitleBarInsets, +8 (props: ReservedRegionsOverrideProps) |  |
| `./ReservedRegionsOverride` | reserved-regions/src/ReservedRegionsOverride.tsx | component | ReservedRegionsOverride, useReservedRegionsOverride (props: ReservedRegionsOverrideProps) | Window-relative regions in layout units, as the native module reports them. |
| `./payload` | reserved-regions/src/payload.ts | module | FoldOcclusionType, FoldOrientation, FoldState, NATIVE_MODULE_NAME, NO_REGIONS, NO_WINDOW_CONTROLS, ReservedRegion, TitleBarInsets, +4 | The JS name both native modules register under. |

### @nyc-tron/ui (556 subpaths)

| subpath | source | kind | exports (non-type names shown first; Props types in parens) | purpose (first doc line) |
|---|---|---|---|---|
| `.` | ui/src/index.ts | module | Button, ButtonSize, ButtonVariant, Card, NavigationItem, NavigationRail, NavigationShell, TextField (props: ButtonProps, CardProps, NavigationRailProps) |  |
| `./components/Button` | ui/src/components/Button.tsx | component | Button, ButtonSize, ButtonVariant (props: ButtonProps) | Brand-neutral accessible press control. |
| `./components/Card` | ui/src/components/Card.tsx | component | Card, CardSurface (props: CardProps) | No default visual classes: app provides full Tailwind styling. |
| `./components/DragGrabHandle` | ui/src/components/DragGrabHandle.tsx | component | DragGrabHandle, DragPoint (props: DragGrabHandleProps) | Props for {@linkcode DragGrabHandle}. |
| `./components/FieldGroup` | ui/src/components/FieldGroup.tsx | component | FieldGroup, FieldSection (props: FieldGroupProps, FieldSectionProps) | Section heading; also names the group for assistive tech. |
| `./components/IconButton` | ui/src/components/IconButton.tsx | component | IconButton, IconButtonVariant (props: IconButtonProps) | The glyph, supplied by the app's icon system. |
| `./components/List` | ui/src/components/List.tsx | component | List, ListItem (props: ListItemProps, ListProps) | Names the list for assistive tech when the surrounding heading does not. |
| `./components/NavigationRail` | ui/src/components/NavigationRail.tsx | component | NavigationItem, NavigationRail, NavigationShell (props: NavigationRailProps, NavigationShellProps) | Collapses LABELS only, never primary actions or hit targets. |
| `./components/SegmentedControl` | ui/src/components/SegmentedControl.tsx | component | SegmentedControl, SegmentedOption (props: SegmentedControlProps) | A value matching no option leaves every segment unchecked. |
| `./components/Select` | ui/src/components/Select.tsx | component | Select, SelectGroup, SelectGroupsChoice, SelectOption, SelectOptionsChoice, selectOptions (props: SelectBaseProps, SelectProps) | Shown text; the value is shown when omitted. |
| `./components/TabBar` | ui/src/components/TabBar.tsx | component | TabBar, TabBarTab, TabIconState (props: TabBarProps) | Handed to an icon render function so the glyph can follow the active state. |
| `./components/TextField` | ui/src/components/TextField.tsx | component | TextField (props: TextFieldProps) | NYC-Tron semantic native text input. |
| `./components/Toolbar` | ui/src/components/Toolbar.tsx | component | Toolbar (props: ToolbarProps) | Leading control slot (back, menu, drag handle). |
| `./components/content/KeyValueList` | ui/src/components/content/KeyValueList.tsx | component | KeyValueItem, KeyValueList (props: KeyValueListProps) | The rendered value. |
| `./components/data/DataTable` | ui/src/components/data/DataTable.tsx | component | DataTable, TronColumnDef (props: DataTableProps) | TanStack owns row/column logic; NYC-Tron owns actual RN rendering. |
| `./components/data/TreeGrid` | ui/src/components/data/TreeGrid.tsx | component | TreeGrid, TreeGridColumn (props: TreeGridProps) | A value column of {@linkcode TreeGrid}. |
| `./components/data/tree-grid` | ui/src/components/data/tree-grid.ts | module | OrderedTreeColumns, TreeColumnLike, TreeGridKeyInput, TreeGridNavState, TreeGridNode, VisibleTreeRow, moveColumn, orderTreeColumns, +5 | Cycle/duplicate-safe projection. |
| `./components/data/tree-row-heights` | ui/src/components/data/tree-row-heights.ts | module | RowHeightIndex, RowHeightWindow, createRowHeightIndex | Rows overlapping a viewport; `end` is exclusive. |
| `./components/feedback/Badge` | ui/src/components/feedback/Badge.tsx | component | Badge, BadgeSize, BadgeTone (props: BadgeProps) | Props for {@linkcode Badge}. |
| `./components/feedback/Banner` | ui/src/components/feedback/Banner.tsx | component | Banner, BannerTone (props: BannerProps) | Props for {@linkcode Banner}. |
| `./components/feedback/EmptyState` | ui/src/components/feedback/EmptyState.tsx | component | EmptyState, EmptyStateExit (props: EmptyStateProps) | A live way out of the empty state, rendered as the kit's secondary Button. |
| `./components/feedback/ErrorMessage` | ui/src/components/feedback/ErrorMessage.tsx | component | ErrorMessage (props: ErrorMessageProps) | Props for {@linkcode ErrorMessage}. |
| `./components/files/DropZone` | ui/src/components/files/DropZone.web.tsx [variants: tsx] | component | DropAsset, DropAssets, DropZone (props: DropZoneProps) | Web drop target. |
| `./components/files/FileImportExportSheet` | ui/src/components/files/FileImportExportSheet.web.tsx [variants: tsx] | component | FileImportExportSheet (props: FileImportExportSheetProps) | Controlled file transfer form with the existing web picker transport. |
| `./components/files/FilePicker` | ui/src/components/files/FilePicker.web.tsx [variants: tsx] | component | FilePicker (props: FilePickerProps) | Opens the browser's file chooser from a real button. |
| `./components/files/drop-model` | ui/src/components/files/drop-model.ts | module | AcceptRule, FileLike, acceptsFile, dragDepth, matchesAccept, matchesMime, parseAccept | Platform-free rules shared by the web and native DropZone and FilePicker: `accept` strings in the HTML input syntax, MIME allowlists, and th |
| `./components/files/file-transfer-model` | ui/src/components/files/file-transfer-model.ts | module | ExportDestination, ExportDestinationId, ExportFormat, ExportRequest, ExportSettings, FILENAME_MAX, ImportFormat, MetadataField, +17 | Platform-free rules for {@linkcode FileImportExportSheet}: export formats, quality ranges, metadata fields, destinations, file name checks,  |
| `./components/forge/ColorChannels` | ui/src/components/forge/ColorChannels.tsx | component | ColorChannels (props: ColorChannelsProps) | Classes for the hex and channel labels. |
| `./components/forge/NativeSeekBar` | ui/src/components/forge/NativeSeekBar.web.tsx [variants: tsx] | component | NativeSeekBar (props: NativeSeekBarBaseProps, NativeSeekBarCommitProps, NativeSeekBarProps) | The part of a DOM node this file uses; React Native Web Views are DOM nodes. |
| `./components/forge/SpreadsheetGrid` | ui/src/components/forge/SpreadsheetGrid.tsx | component | SpreadsheetCell, SpreadsheetGrid, SpreadsheetWindowRequest (props: SpreadsheetGridProps) | Only presentation data supplied by the app's TallyDocument.getRange(). |
| `./components/forge/WaveformLane` | ui/src/components/forge/WaveformLane.tsx | component | WaveformLane (props: WaveformLaneProps) | Measured real source signal extrema; not synthetic waves. |
| `./components/forge/audio/AudioClipTrimAndFade` | ui/src/components/forge/audio/AudioClipTrimAndFade.tsx | component | AudioClipRegion, AudioClipTrimAndFade (props: AudioClipTrimAndFadeProps) | Report a verified neighbouring overlap before enabling crossfade. |
| `./components/forge/audio/AudioEffectsPresetPanel` | ui/src/components/forge/audio/AudioEffectsPresetPanel.tsx | component | AudioEffectsPresetPanel (props: AudioEffectsPresetPanelProps) | Audio-specific lifecycle around the shared parameter/preset/effect-stack owner. |
| `./components/forge/audio/AudioInterruptionRecoveryDialog` | ui/src/components/forge/audio/AudioInterruptionRecoveryDialog.tsx | component | AudioInterruptionRecoveryDialog (props: AudioInterruptionRecoveryDialogProps) | Host callbacks are required for each recovery kind; no automatic resume or fabricated recovery file. |
| `./components/forge/audio/AudioPreview` | ui/src/components/forge/audio/AudioPreview.tsx | component | AudioPreview (props: AudioPreviewProps) | Props for {@linkcode AudioPreview}. |
| `./components/forge/audio/AudioProcessingPanel` | ui/src/components/forge/audio/AudioProcessingPanel.tsx | component | AudioProcessParameter, AudioProcessingPanel (props: AudioProcessingPanelProps) | Native host admission, including platform, source, rights and model availability. |
| `./components/forge/audio/AudioVideoSync` | ui/src/components/forge/audio/AudioVideoSync.tsx | component | AudioVideoSync (props: AudioVideoSyncProps) | Actual presentation telemetry against the audio master clock, without a second UI timer. |
| `./components/forge/audio/AutoDuckEnvelopePanel` | ui/src/components/forge/audio/AutoDuckEnvelopePanel.tsx | component | AutoDuckEnvelopePanel, DuckSettings (props: AutoDuckEnvelopePanelProps) | Host-generated ducking against dialogue, with an editable sample-local gain envelope. |
| `./components/forge/audio/AutomationLane` | ui/src/components/forge/audio/AutomationLane.tsx | component | AUTOMATION_LANE_INSET, AutomationLane (props: AutomationLaneProps) | Minimum hit size (iOS 44pt / Android 48dp floor). |
| `./components/forge/audio/AutomationModePicker` | ui/src/components/forge/audio/AutomationModePicker.tsx | component | AutomationModePicker (props: AutomationModePickerProps) | Only the host can enable live write/touch/latch/trim support. |
| `./components/forge/audio/BeatDetectionMarkerLane` | ui/src/components/forge/audio/BeatDetectionMarkerLane.tsx | component | BeatDetectionMarkerLane (props: BeatDetectionMarkerLaneProps) | Actual host beat detection, sharing timeline marker movement, naming, adding and removal. |
| `./components/forge/audio/BusAndRoutingMatrix` | ui/src/components/forge/audio/BusAndRoutingMatrix.tsx | component | BusAndRoutingMatrix (props: BusAndRoutingMatrixProps) | Bus and routing matrix (roster E-19). |
| `./components/forge/audio/ChannelStrip` | ui/src/components/forge/audio/ChannelStrip.tsx | component | CHANNEL_STRIP_METER_WIDTH, CHANNEL_STRIP_WIDTH, ChannelMeter, ChannelStrip, channelRouting (props: ChannelStripProps) | Meter values for one strip, linear sample peak as the Cadence `meter` op reports it (not true peak). |
| `./components/forge/audio/ClipGainEnvelope` | ui/src/components/forge/audio/ClipGainEnvelope.tsx | component | ClipGainEnvelope (props: ClipGainEnvelopeProps) | Clip-local sample positions use ticks as integer sample offsets; host owns scheduling. |
| `./components/forge/audio/DeviceAndChannelPicker` | ui/src/components/forge/audio/DeviceAndChannelPicker.tsx | component | AudioDeviceChoice, AudioDeviceSelection, DeviceAndChannelPicker (props: DeviceAndChannelPickerProps) |  |
| `./components/forge/audio/DynamicsTransferGraph` | ui/src/components/forge/audio/DynamicsTransferGraph.tsx | component | DynamicsTransferGraph (props: DynamicsTransferGraphProps) | Minimum hit size (iOS 44pt / Android 48dp floor). |
| `./components/forge/audio/EQFrequencyGraph` | ui/src/components/forge/audio/EQFrequencyGraph.tsx | component | EQFrequencyGraph (props: EQFrequencyGraphProps) | Minimum hit size (iOS 44pt / Android 48dp floor). |
| `./components/forge/audio/InputMonitorToggle` | ui/src/components/forge/audio/InputMonitorToggle.tsx | component | InputMonitorMode, InputMonitorToggle (props: InputMonitorToggleProps) |  |
| `./components/forge/audio/InsertEffectRack` | ui/src/components/forge/audio/InsertEffectRack.tsx | component | InsertEffectRack (props: InsertEffectRackProps) | Insert effect rack (roster E-20). |
| `./components/forge/audio/LatencyCalibrationPanel` | ui/src/components/forge/audio/LatencyCalibrationPanel.tsx | component | LatencyCalibrationPanel (props: LatencyCalibrationPanelProps) | Displays host loopback measurements; calibration tones and device buffers stay native-owned. |
| `./components/forge/audio/LevelFader` | ui/src/components/forge/audio/LevelFader.tsx | component | LevelFader, LevelFaderLabels (props: LevelFaderProps) | Visual thickness of the thumb along the travel axis, in points. |
| `./components/forge/audio/LevelMeter` | ui/src/components/forge/audio/LevelMeter.tsx | component | LevelMeter (props: LevelMeterProps) | Props for {@linkcode LevelMeter}. |
| `./components/forge/audio/LiveRecordingWaveform` | ui/src/components/forge/audio/LiveRecordingWaveform.tsx | component | LiveRecordingWaveform, RecordingPeakWindow (props: LiveRecordingWaveformProps) | A rolling view of measured capture windows. |
| `./components/forge/audio/LoopPunchRecording` | ui/src/components/forge/audio/LoopPunchRecording.tsx | component | LoopPunchConfiguration, LoopPunchRecording (props: LoopPunchRecordingProps) | Sample-clock recording boundaries; the host owns rolling, looping and take allocation. |
| `./components/forge/audio/LoudnessMeter` | ui/src/components/forge/audio/LoudnessMeter.tsx | component | LoudnessMeter, LoudnessStatus (props: LoudnessMeterProps) | Measurement state of a {@linkcode LoudnessMeter}. |
| `./components/forge/audio/MixGroupBar` | ui/src/components/forge/audio/MixGroupBar.tsx | component | MixGroupBar, MixGroupLabels (props: MixGroupBarProps) | Row of mix group chips with group solo and mute. |
| `./components/forge/audio/MixingConsole` | ui/src/components/forge/audio/MixingConsole.tsx | component | MixingConsole (props: MixingConsoleProps) | Props for {@linkcode MixingConsole}. |
| `./components/forge/audio/NativeAudioTransport` | ui/src/components/forge/audio/NativeAudioTransport.tsx | component | AudioTransportAction, NativeAudioTransport (props: NativeAudioTransportProps) | Requests the host's existing native audio session; no second audio graph or UI clock. |
| `./components/forge/audio/NoiseReductionMonitor` | ui/src/components/forge/audio/NoiseReductionMonitor.tsx | component | NoiseReductionMonitor (props: NoiseReductionMonitorProps) | Original/cleaned audition with actual host measurements and reversible processing. |
| `./components/forge/audio/PanAndBalanceControl` | ui/src/components/forge/audio/PanAndBalanceControl.tsx | component | PanAndBalanceControl (props: PanAndBalanceControlProps, StereoPanAndBalanceProps) |  |
| `./components/forge/audio/PanControl` | ui/src/components/forge/audio/PanControl.tsx | component | PanControl, PanControlLabels (props: PanControlProps) | Minimum hit size (iOS 44pt / Android 48dp floor). |
| `./components/forge/audio/PluginPresetBrowser` | ui/src/components/forge/audio/PluginPresetBrowser.tsx | component | PluginPresetBrowser, PresetListStatus (props: PluginPresetBrowserProps) | Plugin preset browser (roster E-23). |
| `./components/forge/audio/RealtimePeakMeter` | ui/src/components/forge/audio/RealtimePeakMeter.tsx | component | RealtimePeakMeasurement, RealtimePeakMeter (props: RealtimePeakMeterProps) | Same monotonic clock as measurement.timeMs; host drives visual falloff ticks. |
| `./components/forge/audio/RecordingArmButton` | ui/src/components/forge/audio/RecordingArmButton.tsx | component | RecordingArmButton (props: RecordingArmButtonProps) |  |
| `./components/forge/audio/RecordingTrack` | ui/src/components/forge/audio/RecordingTrack.tsx | component | RecordingTrack (props: RecordingTrackProps) | Stopping or saving a live take stays available even when `disabled`. |
| `./components/forge/audio/SampleEditor` | ui/src/components/forge/audio/SampleEditor.tsx | component | SampleEditor, SampleKeyboardMap (props: SampleEditorProps) |  |
| `./components/forge/audio/SoloMuteButtons` | ui/src/components/forge/audio/SoloMuteButtons.tsx | component | SoloMuteButtons, SoloMuteLabels (props: SoloMuteButtonsProps) | Props for {@linkcode SoloMuteButtons}. |
| `./components/forge/audio/SoundEffectsLibrary` | ui/src/components/forge/audio/SoundEffectsLibrary.tsx | component | LicensedSoundEffect, SoundEffectsLibrary (props: SoundEffectsLibraryProps) | Searches admitted sound metadata. |
| `./components/forge/audio/SpectrogramView` | ui/src/components/forge/audio/SpectrogramView.tsx | component | SpectrogramStatus, SpectrogramView (props: SpectrogramViewProps) | Load state of a {@linkcode SpectrogramView}. |
| `./components/forge/audio/SpeechTranscriptTakeReview` | ui/src/components/forge/audio/SpeechTranscriptTakeReview.tsx | component | SpeechTranscriptTakeReview (props: SpeechTranscriptTakeReviewProps) | Take selection plus shared ASR speaker/text correction and real word-boundary editing. |
| `./components/forge/audio/StereoMultichannelWaveform` | ui/src/components/forge/audio/StereoMultichannelWaveform.tsx | component | AudioWaveformChannel, StereoMultichannelWaveform (props: StereoMultichannelWaveformProps) |  |
| `./components/forge/audio/SurroundPanView` | ui/src/components/forge/audio/SurroundPanView.tsx | component | SurroundPanView, SurroundPosition, SurroundSpeaker (props: SurroundPanViewProps) | Speaker geometry and source positions come from the native routing engine, not inferred channel layouts. |
| `./components/forge/audio/TakePlaylistAndComping` | ui/src/components/forge/audio/TakePlaylistAndComping.tsx | component | AudioTake, CompRegion, TakePlaylistAndComping (props: TakePlaylistAndCompingProps) | Swipe a take lane to request a comp range; host performs edits and crossfades transactionally. |
| `./components/forge/audio/TempoAndMetronome` | ui/src/components/forge/audio/TempoAndMetronome.tsx | component | MetronomeBinding, TempoAndMetronome, TempoLabels (props: TempoAndMetronomeProps) | Metronome switch, owned by whatever plays the click. |
| `./components/forge/audio/VerticalFader` | ui/src/components/forge/audio/VerticalFader.tsx | component | VerticalFader (props: VerticalFaderProps) | Canonical vertical name for the shared fader owner, including fine/numeric/reset controls. |
| `./components/forge/audio/VoiceIsolationPanel` | ui/src/components/forge/audio/VoiceIsolationPanel.tsx | component | VoiceIsolationPanel (props: VoiceIsolationPanelProps) | Requests the host's admitted speech separation service and reversible output. |
| `./components/forge/audio/VoiceoverCountdownAndTakeBin` | ui/src/components/forge/audio/VoiceoverCountdownAndTakeBin.tsx | component | VoiceoverCountdownAndTakeBin, VoiceoverTake (props: VoiceoverCountdownAndTakeBinProps) | Countdown follows native capture telemetry. |
| `./components/forge/audio/audio-recovery-model` | ui/src/components/forge/audio/audio-recovery-model.ts | module | AudioRecoveryNotice, recoveryMessage, recoveryTitle | Why the host paused or recovered audio. |
| `./components/forge/audio/automation` | ui/src/components/forge/audio/automation.ts | module | AUTOMATION_GAIN_FLOOR_DB, AUTOMATION_LANE_PAD, AUTOMATION_MODES, AUTOMATION_PPQ, AutomationGeometry, AutomationKeyEdit, AutomationKeyOptions, AutomationMode, +30 | Automation lane math for `AutomationLane` and `AutomationModePicker`. |
| `./components/forge/audio/dynamics-graph` | ui/src/components/forge/audio/dynamics-graph.ts | module | DYN_GRID_DB, DYN_MAX_DB, DYN_MAX_RATIO, DYN_MIN_DB, DYN_MIN_RATIO, DynamicsCurvePoint, DynamicsParams, RATIO_STEPS, +15 | Plot math for {@linkcode DynamicsTransferGraph}: a square input/output plot over -60..0 dBFS, the engine's transfer curve as polyline pieces |
| `./components/forge/audio/eq-graph` | ui/src/components/forge/audio/eq-graph.ts | module | EQ_DEFAULT_RANGE_DB, EQ_FREQ_FINE_OCT, EQ_FREQ_STEP_OCT, EQ_GAIN_LIMIT_DB, EQ_MAX_BANDS, EQ_MAX_HZ, EQ_MAX_Q, EQ_MIN_HZ, +31 | Plot math for {@linkcode EQFrequencyGraph}: log-frequency and dB mapping, gridlines, response polyline pieces, band handle positions, drag a |
| `./components/forge/audio/inserts` | ui/src/components/forge/audio/inserts.ts | module | INSERT_KINDS, INSERT_KIND_LABELS, InsertKind, InsertPreset, InsertSlot, MAX_INSERTS, addBlockedReason, describeInsert, +2 | Insert-chain and preset helpers for {@linkcode InsertEffectRack} and {@linkcode PluginPresetBrowser}. |
| `./components/forge/audio/level` | ui/src/components/forge/audio/level.ts | module | FADER_RANGES, FaderRange, assertFaderRange, clampGain, dbToGain, dragToGain, formatDb, gainToDb, +4 | Level math for `LevelFader`. |
| `./components/forge/audio/level-meter` | ui/src/components/forge/audio/level-meter.ts | module | METER_BANDS, METER_BAND_LABELS, METER_FLOOR_DB, MeterAnnouncerOptions, MeterBand, createMeterAnnouncer, levelToDb, meterBand, +1 | Display math for an input level meter. |
| `./components/forge/audio/loudness` | ui/src/components/forge/audio/loudness.ts | module | DEFAULT_LOUDNESS_TARGET, LOUDNESS_CEILING_LUFS, LOUDNESS_FLOOR_LUFS, LOUDNESS_TARGETS, LoudnessReadings, LoudnessTarget, MomentaryBar, PEAK_WARNINGS, +13 | Display math for {@linkcode LoudnessMeter}. |
| `./components/forge/audio/meter-ballistics` | ui/src/components/forge/audio/meter-ballistics.ts | module | MeterReading, PEAK_HOLD_FLOOR, PeakHoldOptions, createPeakHold | Meter ballistics for the mixer's channel meters. |
| `./components/forge/audio/mix-groups` | ui/src/components/forge/audio/mix-groups.ts | module | MixGroup, mixGroups | Mix group summary for {@linkcode MixGroupBar}. |
| `./components/forge/audio/mixer` | ui/src/components/forge/audio/mixer.ts | module | Audibility, AudibilityDetails, AudibilityInput, MixerChannel, MixerSend, audibility, describeAudibility | Mixer state helpers for {@linkcode MixingConsole} and {@linkcode SoloMuteButtons}. |
| `./components/forge/audio/pan` | ui/src/components/forge/audio/pan.ts | module | PAN_CENTRE_DETENT, PAN_QUANTUM, assertPan, describeBalance, describePan, dragToPan, formatPan, panToPosition, +2 | Pan math for {@linkcode PanControl}. |
| `./components/forge/audio/preview-model` | ui/src/components/forge/audio/preview-model.ts | module | PreviewAction, PreviewPresentation, PreviewViewState, presentPreview | Presentational playback states for `AudioPreview`. |
| `./components/forge/audio/recording-model` | ui/src/components/forge/audio/recording-model.ts | module | RecordingAction, RecordingPresentation, RecordingViewState, formatElapsed, presentRecording, spokenElapsed | Presentational recording states. |
| `./components/forge/audio/routing` | ui/src/components/forge/audio/routing.ts | module | DEFAULT_SEND_LEVEL, ROUTING_COLUMNS, ROUTING_GRID_MIN_WIDTH, ResolvedOutput, RouteId, RoutingBus, RoutingLayout, RoutingSend, +14 | Routing model for {@linkcode BusAndRoutingMatrix}. |
| `./components/forge/audio/spectrogram` | ui/src/components/forge/audio/spectrogram.ts | module | AxisTick, IntensityStep, SPECTROGRAM_FLOOR_DB, SPECTROGRAM_MAX_COLUMNS, SPECTROGRAM_MAX_ROWS, SPECTROGRAM_THRESHOLDS_DB, SpectrogramGrid, SpectrogramRun, +8 | Display math for {@linkcode SpectrogramView}. |
| `./components/forge/audio/tempo` | ui/src/components/forge/audio/tempo.ts | module | MAX_BPM, MAX_NUMERATOR, MIN_BPM, TAP_RESET_MS, TAP_WINDOW, TIME_SIG_DENOMINATORS, TimeSignature, addTap, +6 | Tempo, tap-tempo and time-signature math for {@linkcode TempoAndMetronome}. |
| `./components/forge/cad/BakingMapPanel` | ui/src/components/forge/cad/BakingMapPanel.tsx | component | BakeSettings, BakingMapPanel (props: BakingMapPanelProps) |  |
| `./components/forge/cad/DimensionsAndHatching` | ui/src/components/forge/cad/DimensionsAndHatching.tsx | component | DimensionsAndHatching, DraftingAnnotation (props: DimensionsAndHatchingProps) |  |
| `./components/forge/cad/DraftingCommandLine` | ui/src/components/forge/cad/DraftingCommandLine.tsx | component | DraftingCommandLine (props: DraftingCommandLineProps) |  |
| `./components/forge/cad/LiveNodeThumbnail` | ui/src/components/forge/cad/LiveNodeThumbnail.tsx | component | LiveNodeThumbnail (props: LiveNodeThumbnailProps) |  |
| `./components/forge/cad/Native3DViewport` | ui/src/components/forge/cad/Native3DViewport.tsx | component | Native3DViewport, ViewportCameraGesture (props: Native3DViewportProps) | Native gesture front end for an actual host 3D surface. |
| `./components/forge/cad/NodeGraphCanvas` | ui/src/components/forge/cad/NodeGraphCanvas.tsx | component | NodeGraphCanvas (props: NodeGraphCanvasProps) | Optional native/GPU renderer adapter for the same validated graph contract. |
| `./components/forge/cad/NodeLibrarySearch` | ui/src/components/forge/cad/NodeLibrarySearch.tsx | component | NodeLibrarySearch (props: NodeLibrarySearchProps) |  |
| `./components/forge/cad/ObjectSnapsAndOrtho` | ui/src/components/forge/cad/ObjectSnapsAndOrtho.tsx | component | DraftingSnapSettings, ObjectSnapsAndOrtho (props: ObjectSnapsAndOrthoProps) |  |
| `./components/forge/cad/PBRMaterialInspector` | ui/src/components/forge/cad/PBRMaterialInspector.tsx | component | PBRMaterial, PBRMaterialInspector (props: PBRMaterialInspectorProps) |  |
| `./components/forge/cad/PaperSpaceLayout` | ui/src/components/forge/cad/PaperSpaceLayout.tsx | component | PaperSpaceLayout, PaperViewport (props: PaperSpaceLayoutProps) |  |
| `./components/forge/cad/ParametricConstraintEditor` | ui/src/components/forge/cad/ParametricConstraintEditor.tsx | component | ParametricConstraint, ParametricConstraintEditor (props: ParametricConstraintEditorProps) |  |
| `./components/forge/cad/TextureBrush3D` | ui/src/components/forge/cad/TextureBrush3D.tsx | component | SurfaceBrushHit, TextureBrush3D, TextureBrushSettings (props: TextureBrush3DProps) | Synchronous native/JSI ray projection. |
| `./components/forge/cad/TextureMaskAndGenerator` | ui/src/components/forge/cad/TextureMaskAndGenerator.tsx | component | TextureMaskAndGenerator (props: TextureMaskAndGeneratorProps) |  |
| `./components/forge/cad/TextureSetPanel` | ui/src/components/forge/cad/TextureSetPanel.tsx | component | TextureSet, TextureSetPanel (props: TextureSetPanelProps) |  |
| `./components/forge/cad/TransformGizmo3D` | ui/src/components/forge/cad/TransformGizmo3D.tsx | component | TransformGizmo3D (props: TransformGizmo3DProps) |  |
| `./components/forge/cad/UVEditor` | ui/src/components/forge/cad/UVEditor.tsx | component | UVEditor (props: UVEditorProps) | The host supplies the active normalized tile and selected vertex subset; mesh seams, packing and synchronized model projection stay engine-o |
| `./components/forge/cad/ViewCubeAndAxisGizmo` | ui/src/components/forge/cad/ViewCubeAndAxisGizmo.tsx | component | Standard3DView, ViewCubeAndAxisGizmo (props: ViewCubeAndAxisGizmoProps) |  |
| `./components/forge/canvas-tools/ColorDropCanvasTarget` | ui/src/components/forge/canvas-tools/ColorDropCanvasTarget.tsx | component | ColorDropCanvasTarget (props: ColorDropCanvasTargetProps) | Props for {@linkcode ColorDropCanvasTarget}. |
| `./components/forge/canvas-tools/GestureCustomizationPanel` | ui/src/components/forge/canvas-tools/GestureCustomizationPanel.tsx | component | GestureCustomizationPanel (props: GestureCustomizationPanelProps) | Props for {@linkcode GestureCustomizationPanel}. |
| `./components/forge/canvas-tools/ReferenceImageBoard` | ui/src/components/forge/canvas-tools/ReferenceImageBoard.tsx | component | ReferenceImageBoard (props: ReferenceImageBoardProps) | Props for {@linkcode ReferenceImageBoard}. |
| `./components/forge/canvas-tools/color-drop-model` | ui/src/components/forge/canvas-tools/color-drop-model.ts | module | DROP_DOT_SIZE, DROP_KEY_STEP, DROP_SLOP, DropPoint, DropPress, DropRect, FillRequest, MAX_FILL_TOLERANCE, +9 | Movement, in layout units, after which a press on the chip is a drag. |
| `./components/forge/canvas-tools/gesture-map-model` | ui/src/components/forge/canvas-tools/gesture-map-model.ts | module | CANVAS_QUICK_ACTIONS, DEFAULT_GESTURE_MAP, DEFAULT_HOLD_DELAY_S, GestureConflict, GestureDefinition, GestureInput, GestureMap, MAX_HOLD_DELAY_S, +15 | Whether a gesture is made with fingers or a stylus. |
| `./components/forge/canvas-tools/reference-board-model` | ui/src/components/forge/canvas-tools/reference-board-model.ts | module | BoardRect, REFERENCE_BAR_HEIGHT, REFERENCE_FITS, REFERENCE_KEY_STEP, REFERENCE_MIN_HEIGHT, REFERENCE_MIN_OPACITY, REFERENCE_MIN_WIDTH, REFERENCE_OPACITY_STEP, +17 | Where a reference shows: a movable window, a docked side column, or a tracing overlay on the canvas. |
| `./components/forge/canvas/AlignDistributePanel` | ui/src/components/forge/canvas/AlignDistributePanel.tsx | component | AlignDistributePanel (props: AlignDistributePanelProps) | Props for {@linkcode AlignDistributePanel}. |
| `./components/forge/canvas/CanvasPanZoom` | ui/src/components/forge/canvas/CanvasPanZoom.tsx | component | CanvasPanZoom, CanvasViewport, DocRect (props: CanvasPanZoomProps) | Document/viewport identity. |
| `./components/forge/canvas/CanvasRuler` | ui/src/components/forge/canvas/CanvasRuler.tsx | component | CanvasRuler, GuidePreview (props: CanvasRulerProps) | A guide being dragged: a new one out of a ruler, or an existing one by `id`. |
| `./components/forge/canvas/GPUCanvasViewport` | ui/src/components/forge/canvas/GPUCanvasViewport.tsx | component | CanvasGpuStatus, GPUCanvasViewport (props: GPUCanvasViewportProps) | Draw a complete document frame synchronously. |
| `./components/forge/canvas/GuidedCropAndStraighten` | ui/src/components/forge/canvas/GuidedCropAndStraighten.tsx | component | GuidedCropAndStraighten, GuidedCropValue (props: GuidedCropAndStraightenProps) | Render the image in the host's existing renderer using the requested angle. |
| `./components/forge/canvas/SmartGuides` | ui/src/components/forge/canvas/SmartGuides.tsx | component | SmartGuides (props: SmartGuidesProps) | Props for {@linkcode SmartGuides}. |
| `./components/forge/canvas/SnapGridOverlay` | ui/src/components/forge/canvas/SnapGridOverlay.tsx | component | SnapGridOverlay (props: SnapGridOverlayProps) | Props for {@linkcode SnapGridOverlay}. |
| `./components/forge/canvas/SnapGridSettings` | ui/src/components/forge/canvas/SnapGridSettings.tsx | component | SnapGridSettings (props: SnapGridSettingsProps) | Props for {@linkcode SnapGridSettings}. |
| `./components/forge/canvas/TransformOriginHandle` | ui/src/components/forge/canvas/TransformOriginHandle.tsx | component | TransformOriginHandle (props: TransformOriginHandleProps) | Props for {@linkcode TransformOriginHandle}. |
| `./components/forge/canvas/align-distribute-model` | ui/src/components/forge/canvas/align-distribute-model.ts | module | ALIGN_EDGES, ARRANGE_ACTIONS, AlignCommand, AlignEdge, AlignItem, AlignReference, AlignReferenceKind, ArrangeAction, +16 | Align, distribute and arrange rules for {@linkcode AlignDistributePanel} (B-25). |
| `./components/forge/canvas/canvas-pan-zoom-model` | ui/src/components/forge/canvas/canvas-pan-zoom-model.ts | module | CanvasWheelDelta, CanvasZoomLimits, DEFAULT_CANVAS_ZOOM_LIMITS, canvasFromTouches, canvasFromWheel, fitCanvas, panCanvasBy, sameCanvasView, +2 | Change zoom around a screen point, preserving the document coordinate beneath it. |
| `./components/forge/canvas/canvas-viewport` | ui/src/components/forge/canvas/canvas-viewport.ts | module | CanvasAxis, CanvasViewport, DocPoint, DocRect, docPointToScreen, docToScreen, screenPointToDoc, screenToDoc, +4 | Document-to-screen mapping shared by the canvas guide controls ({@linkcode CanvasViewport}). |
| `./components/forge/canvas/graphite-frame` | ui/src/components/forge/canvas/graphite-frame.ts | module | submitCanvasFrame | Synchronously record and submit one complete document frame. |
| `./components/forge/canvas/ruler-model` | ui/src/components/forge/canvas/ruler-model.ts | module | CanvasGuide, DEFAULT_DPI, GuideKeyCommand, NewCanvasGuide, RULER_GUIDE_PAGE_STEP, RULER_GUIDE_STEP, RULER_MAX_TICKS, RULER_MIN_LABEL_SPACING, +22 | Units a {@linkcode CanvasRuler} can count in. |
| `./components/forge/canvas/smart-guides-model` | ui/src/components/forge/canvas/smart-guides-model.ts | module | AlignmentGuide, GapMark, GuideFeature, LayerBounds, LayerBoundsEntry, SMART_GUIDE_MAX_OTHERS, SMART_GUIDE_THRESHOLD, SmartGuideInput, +5 | Smart guide math for {@linkcode SmartGuides} (B-05): while a layer moves, find where its edges or centre line up with other layers' bounds,  |
| `./components/forge/canvas/snap-grid-model` | ui/src/components/forge/canvas/snap-grid-model.ts | module | ArtboardBounds, DEFAULT_GRID, DEFAULT_SNAP, GRID_MAX_LINES, GRID_MAX_SPACING, GRID_MAX_SUBDIVISIONS, GRID_MIN_SCREEN_SPACING, GRID_MIN_SPACING, +22 | A square grid laid over the document. |
| `./components/forge/canvas/transform-origin-model` | ui/src/components/forge/canvas/transform-origin-model.ts | module | ANCHOR_SNAP_RADIUS, BoundsCorners, LayerTransform, ORIGIN_ANCHORS, ORIGIN_ANCHOR_LABELS, ORIGIN_PAGE_STEP, ORIGIN_STEP, OriginAnchor, +16 | A layer transform as Prism reports it: translation, scale, rotation in degrees clockwise on screen, and the origin (pivot) in content coordi |
| `./components/forge/color` | ui/src/components/forge/color.ts | module | HsvColor, RgbaColor, alphaPercent, assertHsv, assertRgba, hsvToRgb, parseHexColor, rgbToHsv, +3 | Document-independent sRGB display color math from Nitro Forge color-ui PRs #26 and #34. |
| `./components/forge/color/AlphaSlider` | ui/src/components/forge/color/AlphaSlider.tsx | component | AlphaSlider (props: AlphaSliderProps) | Props for {@linkcode AlphaSlider}. |
| `./components/forge/color/ColorChannelFields` | ui/src/components/forge/color/ColorChannelFields.tsx | component | ColorChannelFields (props: ColorChannelFieldsProps) | Props for {@linkcode ColorChannelFields}. |
| `./components/forge/color/ColorDiscPicker` | ui/src/components/forge/color/ColorDiscPicker.tsx | component | ColorDiscPicker (props: ColorDiscPickerProps) | Props for {@linkcode ColorDiscPicker}. |
| `./components/forge/color/ColorGradingWheels` | ui/src/components/forge/color/ColorGradingWheels.tsx | component | ColorGrade, ColorGradingWheels (props: ColorGradingWheelsProps) | Three controlled grading ranges with preview and transaction boundaries. |
| `./components/forge/color/ColorHarmonyAssistant` | ui/src/components/forge/color/ColorHarmonyAssistant.tsx | component | ColorHarmonyAssistant (props: ColorHarmonyAssistantProps) | Props for {@linkcode ColorHarmonyAssistant}. |
| `./components/forge/color/ColorPickerDialog` | ui/src/components/forge/color/ColorPickerDialog.tsx | component | ColorPickerDialog (props: ColorPickerDialogProps) | Props for {@linkcode ColorPickerDialog}. |
| `./components/forge/color/ColorSpaceChooser` | ui/src/components/forge/color/ColorSpaceChooser.tsx | component | ColorProfile, ColorSpaceChooser (props: ColorSpaceChooserProps) | Profile choices and explicit profile-change request from ColorSpaceChooser. |
| `./components/forge/color/ColorWheel` | ui/src/components/forge/color/ColorWheel.tsx | component | ColorWheel (props: ColorWheelProps) | Props for {@linkcode ColorWheel}. |
| `./components/forge/color/CurvesEditor` | ui/src/components/forge/color/CurvesEditor.tsx | component | ColorCurve, CurvePoint, CurvesEditor (props: CurvesEditorProps) | One controlled channel curve and its document revision boundary. |
| `./components/forge/color/EyedropperTool` | ui/src/components/forge/color/EyedropperTool.tsx | component | EyedropperRequest, EyedropperTool, SampledColor, validateSampledColor (props: EyedropperToolProps) | Exact document/revision/pixel selection sent to the host's document sampler. |
| `./components/forge/color/FloatingColorPalette` | ui/src/components/forge/color/FloatingColorPalette.tsx | component | FloatingColorPalette (props: FloatingColorPaletteProps) | Props for {@linkcode FloatingColorPalette}. |
| `./components/forge/color/FloatingPaletteUndockHandle` | ui/src/components/forge/color/FloatingPaletteUndockHandle.tsx | component | FloatingPaletteUndockHandle (props: FloatingPaletteUndockHandleProps) | Props for {@linkcode FloatingPaletteUndockHandle}. |
| `./components/forge/color/ForegroundBackgroundChips` | ui/src/components/forge/color/ForegroundBackgroundChips.tsx | component | ForegroundBackgroundChips (props: ForegroundBackgroundChipsProps) | Props for {@linkcode ForegroundBackgroundChips}. |
| `./components/forge/color/GamutWarning` | ui/src/components/forge/color/GamutWarning.tsx | component | GamutReport, GamutWarning (props: GamutWarningProps) | Measured gamut information and optional host inspection action. |
| `./components/forge/color/GradientMeshEditor` | ui/src/components/forge/color/GradientMeshEditor.tsx | component | GradientMesh, GradientMeshEditor, MeshPoint (props: GradientMeshEditorProps) | Host-owned mesh, selection, preview and one-transaction commit boundaries. |
| `./components/forge/color/GradientStopEditor` | ui/src/components/forge/color/GradientStopEditor.tsx | component | GradientStopEditor (props: GradientStopEditorProps) | Gradient stop selection and paint commit are owned by the consuming document. |
| `./components/forge/color/HSLSecondaryEditor` | ui/src/components/forge/color/HSLSecondaryEditor.tsx | component | HSLSecondary, HSLSecondaryEditor (props: HSLSecondaryEditorProps) | Host-owned secondary selection and correction values. |
| `./components/forge/color/HsvPicker` | ui/src/components/forge/color/HsvPicker.tsx | component | HsvPicker (props: HsvPickerProps) | Props for {@linkcode HsvPicker}. |
| `./components/forge/color/HueSlider` | ui/src/components/forge/color/HueSlider.tsx | component | HueSlider (props: HueSliderProps) | Standalone hue control retaining saturation, brightness and alpha. |
| `./components/forge/color/LevelsEditor` | ui/src/components/forge/color/LevelsEditor.tsx | component | ColorLevels, LevelsEditor (props: LevelsEditorProps) | Controlled per-channel levels; select the channel in the consuming app. |
| `./components/forge/color/LiveHistogram` | ui/src/components/forge/color/LiveHistogram.tsx | component | HistogramChannel, LiveHistogram (props: LiveHistogramProps) | Actual histogram bins and their explicit numeric domain. |
| `./components/forge/color/PrintColorChannels` | ui/src/components/forge/color/PrintColorChannels.tsx | component | PrintColor, PrintColorChannels (props: PrintColorChannelsProps) | Controlled, profile-preserving CMYK/Lab editor; every field acceptance commits one change. |
| `./components/forge/color/SVColorField` | ui/src/components/forge/color/SVColorField.tsx | component | SVColorField (props: SVColorFieldProps) | Standalone saturation/value field; hue and alpha remain with the host. |
| `./components/forge/color/SoftProofControls` | ui/src/components/forge/color/SoftProofControls.tsx | component | SoftProofControls, SoftProofSettings (props: SoftProofControlsProps) | Explicit output proof configuration rendered by SoftProofControls. |
| `./components/forge/color/SpotAndGlobalColorEditor` | ui/src/components/forge/color/SpotAndGlobalColorEditor.tsx | component | NamedColor, SpotAndGlobalColorEditor (props: SpotAndGlobalColorEditorProps) | Controlled definition and explicit commit boundary for SpotAndGlobalColorEditor. |
| `./components/forge/color/SwatchGrid` | ui/src/components/forge/color/SwatchGrid.tsx | component | SwatchGrid (props: SwatchGridProps) | Props for {@linkcode SwatchGrid}. |
| `./components/forge/color/ThemeColorReferences` | ui/src/components/forge/color/ThemeColorReferences.tsx | component | ThemeColorReference, ThemeColorReferences (props: ThemeColorReferencesProps) | Identity-bearing color bindings for ThemeColorReferences. |
| `./components/forge/color/VideoScopesPanel` | ui/src/components/forge/color/VideoScopesPanel.tsx | component | ScopeSample, VideoScopesPanel (props: VideoScopesPanelProps) | Frame-tagged engine measurements; a missing frame is different from a measured empty scope. |
| `./components/forge/color/WideGamutChannels` | ui/src/components/forge/color/WideGamutChannels.tsx | component | WideGamutChannels, WideGamutColor (props: WideGamutChannelsProps) | Floating channel editor retaining profile identity and out-of-display-range values. |
| `./components/forge/color/channel-fields` | ui/src/components/forge/color/channel-fields.ts | module | CHANNEL_MODELS, ChannelField, ChannelModel, channelFields, parseChannel, parseOpacityPercent, readChannels, writeChannel | Channel sets offered by `ColorChannelFields`. |
| `./components/forge/color/color-adjustments` | ui/src/components/forge/color/color-adjustments.ts | module | ColorCurve, ColorGrade, ColorLevels, CurvePoint, GradingBand, HSLSecondary, HistogramChannel, ScopeSample, +9 | Normalized point used by CurvesEditor; x is input and y is output. |
| `./components/forge/color/color-management` | ui/src/components/forge/color/color-management.ts | module | ColorConversionPolicy, ColorProfile, GamutReport, NamedColor, PrintColor, ProfileColor, SoftProofSettings, ThemeColorReference, +7 | A selectable, application-supplied profile in ColorSpaceChooser and SoftProofControls. |
| `./components/forge/color/color-pair` | ui/src/components/forge/color/color-pair.ts | module | ColorPair, ColorPairSlot, DEFAULT_COLOR_PAIR, sameColorPair, swapColorPair | The painting foreground and background, edited by `ForegroundBackgroundChips`. |
| `./components/forge/color/color-picker-dialog-model` | ui/src/components/forge/color/color-picker-dialog-model.ts | module | ColorComparisonSide, ComparisonContrast, DialogKeyIntent, DialogKeyTarget, colorChanged, colorDialogTitle, comparisonContrast, comparisonLabel, +6 | Pure state rules for `ColorPickerDialog` (C-01): title and labels, the original/new comparison, key handling and the contrast readout. |
| `./components/forge/color/contrast` | ui/src/components/forge/color/contrast.ts | module | ContrastRating, compositeOver, contrastRating, contrastRatio, relativeLuminance | WCAG 2.2 relative luminance of an opaque sRGB color, 0 (black) to 1 (white). |
| `./components/forge/color/fieldGeometry` | ui/src/components/forge/color/fieldGeometry.ts | module | FieldPoint, FieldSize, hsvToPoint, pointToHsv | A point inside the saturation/value field, in layout units. |
| `./components/forge/color/fieldGesture` | ui/src/components/forge/color/fieldGesture.ts | module | FieldGesture, FieldGestureOptions, createFieldGesture | Accessors the field gesture reads on every event; see {@linkcode createFieldGesture}. |
| `./components/forge/color/floating-palette` | ui/src/components/forge/color/floating-palette.ts | module | FLOATING_PALETTE_WIDTH, PALETTE_MODES, PaletteMode, PalettePlacement, PalettePosition, PaletteRect, UNDOCK_DISTANCE, nudgePalette, +3 | Drag distance, in layout units, after which a docked palette floats. |
| `./components/forge/color/gradient-mesh` | ui/src/components/forge/color/gradient-mesh.ts | module | GradientMesh, MeshPoint, editMeshPoint, rasterizeMesh, validateMesh | One stable, normalized mesh control point consumed by GradientMeshEditor. |
| `./components/forge/color/gradient-options` | ui/src/components/forge/color/gradient-options.ts | module | GradientOptions, changeGradientType, rotateGradient, sampleGradient, validateGradientOptions | Explicit interpolation and interval-midpoint settings for GradientStopEditor. |
| `./components/forge/color/harmony` | ui/src/components/forge/color/harmony.ts | module | HARMONY_KINDS, HarmonyKind, harmonyColors | Color harmony rules offered by `ColorHarmonyAssistant`. |
| `./components/forge/color/hsl` | ui/src/components/forge/color/hsl.ts | module | HslColor, assertHsl, hslToHsv, hslToRgb, hsvToHsl, rgbToHsl | Hue/saturation/lightness plus alpha, edited by `ColorChannelFields`. |
| `./components/forge/color/swatches` | ui/src/components/forge/color/swatches.ts | module | Swatch, SwatchGroup, SwatchGroupKind, filterSwatchGroups, pushRecentSwatch, swatchColumns, swatchGridMove, swatchKey | One color in a {@linkcode SwatchGroup}. |
| `./components/forge/color/wheel-geometry` | ui/src/components/forge/color/wheel-geometry.ts | module | FINE_HUE_RATE, HUE_RETAIN_RADIUS, PolarPoint, RING_INNER_FRACTION, RingDrag, RingDragState, angleDelta, createRingDrag, +6 | Inner over outer radius of the hue ring. |
| `./components/forge/design/AutoLayoutInspector` | ui/src/components/forge/design/AutoLayoutInspector.tsx | component | AutoLayoutInspector, AutoLayoutSettings (props: AutoLayoutInspectorProps) |  |
| `./components/forge/design/CollaborationPresence` | ui/src/components/forge/design/CollaborationPresence.tsx | component | CollaborationPresence, DesignPresence (props: CollaborationPresenceProps) | Geometry is already mapped into viewport points by the collaboration host; no wall-clock freshness inference. |
| `./components/forge/design/CommentPins` | ui/src/components/forge/design/CommentPins.tsx | component | CommentPins (props: CommentPinsProps) | Pins and the shared thread panel reference the same authoritative thread IDs. |
| `./components/forge/design/ComponentVariantPicker` | ui/src/components/forge/design/ComponentVariantPicker.tsx | component | ComponentVariantPicker (props: ComponentVariantPickerProps) |  |
| `./components/forge/design/ConstraintsPanel` | ui/src/components/forge/design/ConstraintsPanel.tsx | component | ConstraintsPanel, DesignConstraints (props: ConstraintsPanelProps) |  |
| `./components/forge/design/DevHandoffInspector` | ui/src/components/forge/design/DevHandoffInspector.tsx | component | DevHandoffInspector (props: DevHandoffInspectorProps) |  |
| `./components/forge/design/FlowOverview` | ui/src/components/forge/design/FlowOverview.tsx | component | FlowOverview (props: FlowOverviewProps) |  |
| `./components/forge/design/FrameAndComponentTree` | ui/src/components/forge/design/FrameAndComponentTree.tsx | component | DesignTreeNode, FrameAndComponentTree (props: FrameAndComponentTreeProps) | One hierarchy owner with native focus, expansion and virtualization. |
| `./components/forge/design/HugFillFixedSizeControls` | ui/src/components/forge/design/HugFillFixedSizeControls.tsx | component | AxisSizing, HUG_FILL_FIXED_SIZE_CAPABILITIES, HugFillFixedSizeControls (props: HugFillFixedSizeControlsProps) |  |
| `./components/forge/design/InteractionTriggerEditor` | ui/src/components/forge/design/InteractionTriggerEditor.tsx | component | InteractionTriggerEditor, PrototypeInteraction (props: InteractionTriggerEditorProps) |  |
| `./components/forge/design/MultiExportSlices` | ui/src/components/forge/design/MultiExportSlices.tsx | component | DesignExportSlice, MultiExportSlices (props: MultiExportSlicesProps) |  |
| `./components/forge/design/PrototypeConnectionTool` | ui/src/components/forge/design/PrototypeConnectionTool.tsx | component | PrototypeConnectionTool, PrototypeFrameTarget, PrototypeHotspot (props: PrototypeConnectionToolProps) |  |
| `./components/forge/design/PrototypePreviewPlayer` | ui/src/components/forge/design/PrototypePreviewPlayer.tsx | component | PrototypePreviewPlayer (props: PrototypePreviewPlayerProps) | Surface and transition clock come from the actual prototype runtime; no UI timer simulates execution. |
| `./components/forge/design/ReusableStylesPanel` | ui/src/components/forge/design/ReusableStylesPanel.tsx | component | ReusableDesignStyle, ReusableStylesPanel (props: ReusableStylesPanelProps) |  |
| `./components/forge/design/VariablesAndModes` | ui/src/components/forge/design/VariablesAndModes.tsx | component | DesignVariable, DesignVariableValue, VariablesAndModes (props: VariablesAndModesProps) |  |
| `./components/forge/devices/DevicePairingDialog` | ui/src/components/forge/devices/DevicePairingDialog.tsx | component | DevicePairingDialog, PairingArtPhase (props: DevicePairingDialogProps) | Coarse phase handed to {@linkcode DevicePairingDialogProps.renderStatusArt}. |
| `./components/forge/devices/PenPairingDialog` | ui/src/components/forge/devices/PenPairingDialog.tsx | component | PairingDevice, PairingState, PenPairingDialog (props: PenPairingDialogProps) | Shared pairing owner preserves linked-versus-verified input and close/cancel semantics. |
| `./components/forge/devices/pairing-model` | ui/src/components/forge/devices/pairing-model.ts | module | PairingAction, PairingDevice, PairingErrorCode, PairingPresentation, PairingState, presentPairing, signalLabel | Transport-agnostic pairing states for `DevicePairingDialog`. |
| `./components/forge/document/BulletsNumberingEditor` | ui/src/components/forge/document/BulletsNumberingEditor.tsx | component | BULLETS_NUMBERING_CAPABILITIES, BulletsNumberingEditor, ListPreviewItem (props: BulletsNumberingEditorProps) | A paragraph the editor shows in its preview. |
| `./components/forge/document/CommentsAndReviewRail` | ui/src/components/forge/document/CommentsAndReviewRail.tsx | component | CommentsAndReviewRail (props: CommentsAndReviewRailProps) | One threaded-comment owner shared by office documents, PDF and range review. |
| `./components/forge/document/DictationSessionPanel` | ui/src/components/forge/document/DictationSessionPanel.tsx | component | DictationSessionPanel (props: DictationSessionPanelProps) | Actual recognition events drive interim/final text; insertion is one host undo transaction. |
| `./components/forge/document/DocumentReadAloudTransport` | ui/src/components/forge/document/DocumentReadAloudTransport.tsx | component | DocumentReadAloudTransport (props: DocumentReadAloudTransportProps) | Props for {@linkcode DocumentReadAloudTransport}. |
| `./components/forge/document/FootnoteCitationEditor` | ui/src/components/forge/document/FootnoteCitationEditor.tsx | component | CitationSource, FootnoteCitationEditor (props: FootnoteCitationEditorProps) |  |
| `./components/forge/document/HeadersFootersEditor` | ui/src/components/forge/document/HeadersFootersEditor.tsx | component | HeaderFooterSettings, HeadersFootersEditor (props: HeadersFootersEditorProps) |  |
| `./components/forge/document/InsertTableGrid` | ui/src/components/forge/document/InsertTableGrid.tsx | component | InsertTableGrid (props: InsertTableGridProps) | Native touch selection plus numeric insertion for larger tables and keyboard/accessibility use. |
| `./components/forge/document/LayoutSpreadNavigator` | ui/src/components/forge/document/LayoutSpreadNavigator.tsx | component | DocumentSpreadPage, LayoutSpreadNavigator (props: LayoutSpreadNavigatorProps) |  |
| `./components/forge/document/MailMergeFieldPicker` | ui/src/components/forge/document/MailMergeFieldPicker.tsx | component | MailMergeFieldPicker, MergeField (props: MailMergeFieldPickerProps) | Preview values are supplied by the selected recipient's admitted data source. |
| `./components/forge/document/NavigationOutline` | ui/src/components/forge/document/NavigationOutline.tsx | component | NavigationOutline, OutlineBookmark, OutlineView (props: NavigationOutlineProps) | A named place in the document. |
| `./components/forge/document/PageSetupPanel` | ui/src/components/forge/document/PageSetupPanel.tsx | component | PageSetup, PageSetupPanel, validatePageSetup (props: PageSetupPanelProps) |  |
| `./components/forge/document/PaginatedTextCanvas` | ui/src/components/forge/document/PaginatedTextCanvas.tsx | component | PageEditorContext, PaginatedTextCanvas, TextCanvasPage (props: PaginatedTextCanvasProps) | Host-layout pages with actual native plain text inputs or an explicit native rich-text adapter. |
| `./components/forge/document/ParagraphRuler` | ui/src/components/forge/document/ParagraphRuler.tsx | component | ParagraphRuler, ParagraphRulerValue (props: ParagraphRulerProps) |  |
| `./components/forge/document/ParagraphStylesGallery` | ui/src/components/forge/document/ParagraphStylesGallery.tsx | component | ParagraphStyle, ParagraphStylesGallery (props: ParagraphStylesGalleryProps) |  |
| `./components/forge/document/RichTextRibbon` | ui/src/components/forge/document/RichTextRibbon.tsx | component | RibbonColor, RibbonParagraphStyle, RichTextRibbon (props: RichTextRibbonProps) | A color the ribbon offers. |
| `./components/forge/document/SpellGrammarPopover` | ui/src/components/forge/document/SpellGrammarPopover.tsx | component | SpellGrammarContent, SpellGrammarPopover, SpellingIssue (props: SpellGrammarContentProps, SpellGrammarPopoverProps) | Portable overlay; content also exports separately for the shared native popover adapters. |
| `./components/forge/document/TableLayoutInspector` | ui/src/components/forge/document/TableLayoutInspector.tsx | component | TableCellLayout, TableLayoutInspector (props: TableLayoutInspectorProps) |  |
| `./components/forge/document/TableOfContentsEditor` | ui/src/components/forge/document/TableOfContentsEditor.tsx | component | ContentsSettings, TableOfContentsEditor (props: TableOfContentsEditorProps) |  |
| `./components/forge/document/TextSelectionAndCaret` | ui/src/components/forge/document/TextSelectionAndCaret.tsx | component | DocumentTextSelection, TextSelectionAndCaret (props: TextSelectionAndCaretProps) | Native buffer seed. |
| `./components/forge/document/TextWrapAndFrames` | ui/src/components/forge/document/TextWrapAndFrames.tsx | component | TextFrame, TextWrapAndFrames (props: TextWrapAndFramesProps) |  |
| `./components/forge/document/TrackChangesView` | ui/src/components/forge/document/TrackChangesView.tsx | component | DocumentChange, TrackChangesView (props: TrackChangesViewProps) |  |
| `./components/forge/document/TypographyInspector` | ui/src/components/forge/document/TypographyInspector.tsx | component | TypographyInspector, TypographySettings (props: TypographyInspectorProps) |  |
| `./components/forge/document/list-model` | ui/src/components/forge/document/list-model.ts | module | BULLETS_NUMBERING_CAPABILITIES, LIST_FORMATS, LIST_MAX_LEVEL, LIST_PREVIEW_MARKER_MAX, ListFormat, ListItemLevel, ListKind, ListMarkerItem, +9 | How one list level numbers its items. |
| `./components/forge/document/outline-model` | ui/src/components/forge/document/outline-model.ts | module | OutlineHeading, OutlineRow, headingAtBlock, headingsByPage, rowForHeading, validateOutline, visibleOutline | A heading in a document outline. |
| `./components/forge/document/ribbon-model` | ui/src/components/forge/document/ribbon-model.ts | module | FONT_SIZE_MAX, FONT_SIZE_MIN, FONT_SIZE_STEPS, INLINE_TOGGLES, InlineToggle, RibbonShortcut, RibbonState, RunStyle, +10 | Character toggles on the ribbon's font group. |
| `./components/forge/formula-refs` | ui/src/components/forge/formula-refs.ts | module | FormulaReference, MAX_SHEET_COLUMNS, MAX_SHEET_ROWS, ReferenceHighlight, formulaReferences, referenceHighlights | One A1-style reference found by {@linkcode formulaReferences}. |
| `./components/forge/frame-throttle` | ui/src/components/forge/frame-throttle.ts | module | FrameScheduler, FrameThrottle, animationFrameScheduler, createFrameThrottle | Scheduler pair for {@linkcode createFrameThrottle}; defaults to `requestAnimationFrame`. |
| `./components/forge/graph/PatchGraph` | ui/src/components/forge/graph/PatchGraph.tsx | component | PatchGraph (props: PatchGraphProps) | Geometry/source changes cancel gestures without replacing focused native views. |
| `./components/forge/graph/model` | ui/src/components/forge/graph/model.ts | module | GRAPH_HEADER_HEIGHT, GRAPH_PORT_ROW_HEIGHT, GraphEdge, GraphEndpoint, GraphNode, GraphPoint, GraphPort, GraphSelection, +4 | Engine-neutral graph contract. |
| `./components/forge/graphics/ImageCropOverlay` | ui/src/components/forge/graphics/ImageCropOverlay.tsx | component | ImageCropOverlay (props: ImageCropOverlayProps) | Ratio in normalized image coordinates, supplied by the host. |
| `./components/forge/graphics/crop` | ui/src/components/forge/graphics/crop.ts | module | CropCorner, CropRect, cropToPixels, fitCropAspect, moveCrop, resizeCrop, resizeCropWithAspect, validateCrop | Normalized, bounded and reversible crop manipulations; pixels remain engine-owned. |
| `./components/forge/ink/BrushDynamicsInspector` | ui/src/components/forge/ink/BrushDynamicsInspector.tsx | component | BrushDynamicsInspector (props: BrushDynamicsInspectorProps) |  |
| `./components/forge/ink/BrushPresetBrowser` | ui/src/components/forge/ink/BrushPresetBrowser.tsx | component | BrushPreset, BrushPresetBrowser (props: BrushPresetBrowserProps) | The host renders the preset's actual stroke thumbnail. |
| `./components/forge/ink/BrushStabilizationPreview` | ui/src/components/forge/ink/BrushStabilizationPreview.tsx | component | BrushStabilizationPreview (props: BrushStabilizationPreviewProps) |  |
| `./components/forge/ink/BrushTaperControl` | ui/src/components/forge/ink/BrushTaperControl.tsx | component | BrushTaperControl (props: BrushTaperControlProps) | Whether the active pen/touch adapter supplies pressure, rather than simulated force. |
| `./components/forge/ink/EraserModePicker` | ui/src/components/forge/ink/EraserModePicker.tsx | component | EraserCapability, EraserMode, EraserModePicker (props: EraserModePickerProps) |  |
| `./components/forge/ink/InkStrokePreview` | ui/src/components/forge/ink/InkStrokePreview.tsx | component | InkStrokePreview (props: InkStrokePreviewProps) | External/native-adapter samples. |
| `./components/forge/ink/InkToolbar` | ui/src/components/forge/ink/InkToolbar.tsx | component | InkToolbar, InkToolbarIcon (props: InkToolbarProps) | Icon slots an {@linkcode InkToolbar} host can fill. |
| `./components/forge/ink/TimelapsePlaybackExporter` | ui/src/components/forge/ink/TimelapsePlaybackExporter.tsx | component | TimelapseArtifact, TimelapseExportSettings, TimelapsePlaybackExporter, TimelapseProgress (props: TimelapsePlaybackExporterProps) | Encode the real, non-destructive history into a file. |
| `./components/forge/ink/brush-model` | ui/src/components/forge/ink/brush-model.ts | module | BRUSH_DYNAMICS_FIELDS, BrushDynamics, BrushStabilization, BrushTaper, BrushTaperSettings, InkSample, MAX_INK_PREVIEW_SAMPLES, stabilizePreview, +4 | Engine-neutral brush settings. |
| `./components/forge/ink/ink-model` | ui/src/components/forge/ink/ink-model.ts | module | INK_BOARD_TOOLS, INK_ENABLED, INK_OPACITY_STEP, INK_SIZES, INK_SIZE_LABELS, INK_SIZE_POINTS, INK_TOOL_LABELS, INK_TOOL_SHORTCUTS, +20 | Engine-neutral ink toolbar contract. |
| `./components/forge/inputs/AssetPresetGallery` | ui/src/components/forge/inputs/AssetPresetGallery.tsx | component | AssetPreset, AssetPresetGallery (props: AssetPresetGalleryProps) | One virtual gallery owner for source-backed presets; all previews and saved metadata are host supplied. |
| `./components/forge/inputs/InstrumentKnob` | ui/src/components/forge/inputs/InstrumentKnob.tsx | component | InstrumentKnob (props: InstrumentKnobProps) | Exactly once per completed gesture, never on every frame. |
| `./components/forge/inputs/InstrumentXYPad` | ui/src/components/forge/inputs/InstrumentXYPad.tsx | component | InstrumentXYPad (props: InstrumentXYPadProps) | Optional override; defaults to the theme's accent token. |
| `./components/forge/inputs/OutlineTree` | ui/src/components/forge/inputs/OutlineTree.tsx | component | OutlineNode, OutlineTree (props: OutlineTreeProps) | Shared virtual tree owner for bookmarks, component/frame trees and hierarchical navigation. |
| `./components/forge/inputs/PointEditor2D` | ui/src/components/forge/inputs/PointEditor2D.tsx | component | EditorPoint2D, PointEditor2D (props: PointEditor2DProps) | Normalized point editor with one active 44pt native grip and equivalent numeric controls. |
| `./components/forge/inputs/PrecisionScrubber` | ui/src/components/forge/inputs/PrecisionScrubber.tsx | component | PrecisionScrubber (props: PrecisionScrubberProps) | Props for {@linkcode PrecisionScrubber}. |
| `./components/forge/inputs/PropertyInspector` | ui/src/components/forge/inputs/PropertyInspector.tsx | component | InspectorProperty, PropertyInspector, PropertyValue, validateInspectorFields (props: PropertyInspectorProps) | Shared bounded field owner; document validation and engine mutations remain in each typed caller. |
| `./components/forge/inputs/precision` | ui/src/components/forge/inputs/precision.ts | module | Point2D, PrecisionGesture, PrecisionGestureConfig, PrecisionGesturePoint, PrecisionScrubInput, RangeConfig, SCRUB_DETENT_PIXELS, SCRUB_MODE_THRESHOLD_PX, +17 | Pure input math. |
| `./components/forge/inputs/precision-scrubber-model` | ui/src/components/forge/inputs/precision-scrubber-model.ts | module | SCRUB_PIXELS_PER_STEP, ScrubberInputs, ScrubberModel, ScrubberState, ScrubberStore, createScrubberModel, initialScrubberState | Transient, view-local state of a {@linkcode PrecisionScrubber}. |
| `./components/forge/layers/ArtboardNavigator` | ui/src/components/forge/layers/ArtboardNavigator.tsx | component | ArtboardNavigator (props: ArtboardNavigatorProps) | Props for {@linkcode ArtboardNavigator}. |
| `./components/forge/layers/CanvasCompareView` | ui/src/components/forge/layers/CanvasCompareView.tsx | component | CanvasCompareView (props: CanvasCompareViewProps) | Props for {@linkcode CanvasCompareView}. |
| `./components/forge/layers/ClippingMaskControls` | ui/src/components/forge/layers/ClippingMaskControls.tsx | component | ClipIndicator, ClipToggle (props: ClipIndicatorProps, ClipToggleProps) | Props for {@linkcode ClipToggle}. |
| `./components/forge/layers/LayerBlendAndOpacity` | ui/src/components/forge/layers/LayerBlendAndOpacity.tsx | component | LayerAlphaMode, LayerAlphaOption, LayerBlendAndOpacity, LayerBlendMode, LayerBlendSpace, LayerBlendValue, defaultAlphaModes (props: LayerBlendAndOpacityProps) | Alpha representations the compositor accepts, one or two entries. |
| `./components/forge/layers/LayerStack` | ui/src/components/forge/layers/LayerStack.tsx | component | LayerStack (props: LayerStackProps) | Props for {@linkcode LayerStack}. |
| `./components/forge/layers/LayerThumbnail` | ui/src/components/forge/layers/LayerThumbnail.tsx | component | LayerThumbnail (props: LayerThumbnailProps) | Props for {@linkcode LayerThumbnail}. |
| `./components/forge/layers/MaskThumbnailAndEditor` | ui/src/components/forge/layers/MaskThumbnailAndEditor.tsx | component | MaskThumbnailAndEditor (props: MaskThumbnailAndEditorProps) | Props for {@linkcode MaskThumbnailAndEditor}. |
| `./components/forge/layers/artboard-model` | ui/src/components/forge/layers/artboard-model.ts | module | ARTBOARD_GAP, ARTBOARD_MAX, ARTBOARD_TILE_MIN, AddArtboardOp, ArtboardItem, ArtboardKeyAction, ArtboardLayout, DEFAULT_ARTBOARD_SIZE, +12 | Engine-neutral artboard list contract for `ArtboardNavigator` (B-14). |
| `./components/forge/layers/clipping-model` | ui/src/components/forge/layers/clipping-model.ts | module | CLIP_INDENT, ClipLayer, ClipRole, GROUP_INDENT, SetClippedOp, clipAccessibilityPhrase, clipReason, clipTarget, +4 | The fields clipping needs from each layer. |
| `./components/forge/layers/compare-model` | ui/src/components/forge/layers/compare-model.ts | module | COMPARE_MODES, CompareImage, CompareMode, CompareSource, REFERENCE_SCALE, SIDE_BY_SIDE_MIN_WIDTH, SPLIT_STEP, SPLIT_STEP_LARGE, +8 | Engine-neutral before/after comparison for `CanvasCompareView` (B-27). |
| `./components/forge/layers/layer-blend-model` | ui/src/components/forge/layers/layer-blend-model.ts | module | LayerAlphaMode, LayerAlphaOption, LayerBlendMode, LayerBlendSpace, LayerBlendValue, defaultAlphaModes, layerBlendProblem, layerOpacityFromPercent, +1 | One alpha representation the host compositor offers for a layer, passed to `LayerBlendAndOpacity` as `alphaModes`. |
| `./components/forge/layers/layer-model` | ui/src/components/forge/layers/layer-model.ts | module | LAYER_NAME_MIN_WIDTH, LAYER_OPACITY_READOUT_WIDTH, LAYER_OPACITY_SLIDER_WIDTH, LAYER_OPACITY_STEP, LAYER_STACK_MAX_ROWS, LAYER_THUMBNAIL_SIZE, LAYER_TOUCH_TARGET, LayerKind, +18 | Engine-neutral layer list contract. |
| `./components/forge/layers/layer-thumbnail-model` | ui/src/components/forge/layers/layer-thumbnail-model.ts | module | CHECKER_CELL, CHECKER_MAX_CELLS, RasterPixels, THUMBNAIL_MAX_EDGE, ThumbnailCache, ThumbnailImage, ThumbnailLoader, ThumbnailSource, +16 | Straight (non-premultiplied) RGBA pixels, 4 bytes per pixel, row-major from the top-left. |
| `./components/forge/layers/layer-tree-model` | ui/src/components/forge/layers/layer-tree-model.ts | module | LayerTreeRow, flattenLayerTree, moveLayerTree, validateLayerTree, validateLayerTreeMove | Validate the complete document, including descendants hidden by a collapsed group. |
| `./components/forge/layers/mask-model` | ui/src/components/forge/layers/mask-model.ts | module | AddMaskOp, FEATHER_RANGE, GROW_RANGE, InvertMaskOp, MASK_FILLS, MaskFill, MaskInfo, NO_REFINE, +13 | Engine-neutral layer-mask contract for `MaskThumbnailAndEditor` (B-12). |
| `./components/forge/midi/MIDIPianoRoll` | ui/src/components/forge/midi/MIDIPianoRoll.tsx | component | MIDIPianoRoll, PIANO_ROLL_KEY_COLUMN (props: MIDIPianoRollProps) | Width of the keyboard column; a {@linkcode MIDIVelocityLane} below insets by it. |
| `./components/forge/midi/MIDIVelocityLane` | ui/src/components/forge/midi/MIDIVelocityLane.tsx | component | MIDIVelocityLane, VelocityTool (props: MIDIVelocityLaneProps) | Velocity lane under a piano roll: per-note bars plus a line tool. |
| `./components/forge/midi/MidiChannelPicker` | ui/src/components/forge/midi/MidiChannelPicker.tsx | component | MidiChannelPicker, MidiValueStepper (props: MidiChannelPickerProps, MidiValueStepperProps) | MIDI channel stepper and the small integer stepper it is built on. |
| `./components/forge/midi/StepSequencer` | ui/src/components/forge/midi/StepSequencer.tsx | component | StepSequencer (props: StepSequencerProps) | Props for {@linkcode StepSequencer}. |
| `./components/forge/midi/note-grid` | ui/src/components/forge/midi/note-grid.ts | module | MAX_MIDI_CHANNEL, MidiGridLine, MidiNote, NoteGrid, NoteKeyEdit, NoteRect, StepCell, StepLane, +20 | Note geometry for {@linkcode MIDIPianoRoll}, {@linkcode MIDIVelocityLane} and {@linkcode StepSequencer}. |
| `./components/forge/midi/velocity-line` | ui/src/components/forge/midi/velocity-line.ts | module | LanePoint, VelocityChange, VelocityLaneGeometry, describeVelocityBatch, noteLaneX, notesInTimeOrder, rampRoom, rampVelocities, +2 | Batch velocity edits for {@linkcode MIDIVelocityLane}: the line tool (drag a straight line across the bars) and the keyboard ramp. |
| `./components/forge/motion/CameraAndLightControls` | ui/src/components/forge/motion/CameraAndLightControls.tsx | component | CameraAndLightControls, MotionCamera, MotionLight (props: CameraAndLightControlsProps) | Lens/view/depth and lighting values, independent from native app window dimensions. |
| `./components/forge/motion/CompositionLayerTree` | ui/src/components/forge/motion/CompositionLayerTree.tsx | component | CompositionLayer, CompositionLayerKind, CompositionLayerTree (props: CompositionLayerTreeProps) | Virtualized nested composition/shape/text/footage/adjustment hierarchy with stable layer identity. |
| `./components/forge/motion/EasingPresetGallery` | ui/src/components/forge/motion/EasingPresetGallery.tsx | component | EasingPresetGallery, MotionEasing, MotionEasingKind, MotionEasingPreset (props: EasingPresetGalleryProps) | Complete typed easing intents. |
| `./components/forge/motion/EffectStackAndInspector` | ui/src/components/forge/motion/EffectStackAndInspector.tsx | component | EffectParameter, EffectParameterValue, EffectStackAndInspector, MotionEffect, MotionEffectMutation (props: EffectStackAndInspectorProps) | Host-controlled effect order and schema-driven settings. |
| `./components/forge/motion/ExpressionEditor` | ui/src/components/forge/motion/ExpressionEditor.tsx | component | ExpressionCompletion, ExpressionDiagnostic, ExpressionEditor, ExpressionQuery, ExpressionRange, ExpressionReference (props: ExpressionEditorProps) | Host-authored text, font, border and density overrides for the native source input. |
| `./components/forge/motion/KeyframeSpeedGraph` | ui/src/components/forge/motion/KeyframeSpeedGraph.tsx | component | KeyframeSpeedGraph (props: KeyframeSpeedGraphProps) | Analytic velocity samples plus editable temporal influence and in/out slopes. |
| `./components/forge/motion/KeyframeValueGraph` | ui/src/components/forge/motion/KeyframeValueGraph.tsx | component | KeyframeValueGraph, MotionCurvePoint, MotionKeyframe, MotionPropertyCurve (props: KeyframeValueGraphProps) | Native Bezier value/time handles and exact numeric keyframe edits. |
| `./components/forge/motion/MatteAndMaskPanel` | ui/src/components/forge/motion/MatteAndMaskPanel.tsx | component | MatteAndMaskPanel, MotionMatte, MotionMatteSource (props: MatteAndMaskPanelProps) | The host excludes descendants/cycles; self-matting and explicitly unavailable sources cannot be selected. |
| `./components/forge/motion/MotionKeyframeTimeline` | ui/src/components/forge/motion/MotionKeyframeTimeline.tsx | component | MotionKeySelection, MotionKeyframe, MotionKeyframeTimeline, MotionPropertyCurve (props: MotionKeyframeTimelineProps) | Virtualized property lanes and full key list share one controlled selection. |
| `./components/forge/motion/MotionPathEditor` | ui/src/components/forge/motion/MotionPathEditor.tsx | component | MotionPathEditor, MotionPathSnapping, NodeRef, PathNode, Subpath, ViewTransform (props: MotionPathEditorProps) | Spatial trajectory editing reuses the vector editor's native gesture, tangent and keyboard owner. |
| `./components/forge/motion/NodeGraphEditor` | ui/src/components/forge/motion/NodeGraphEditor.tsx | component | GraphEdge, GraphEndpoint, GraphNode, GraphPoint, GraphPort, NodeGraphEditor, NodeGraphMutation, NodeGraphPolicy (props: NodeGraphEditorProps) | Typed, bounded graph editor. |
| `./components/forge/motion/ParticleEmitterControls` | ui/src/components/forge/motion/ParticleEmitterControls.tsx | component | MotionParticleEmitter, ParticleEmitterControls (props: ParticleEmitterControlsProps) | Deterministic emitter settings; the compositor owns particle simulation and texture resources. |
| `./components/forge/motion/RenderQueuePanel` | ui/src/components/forge/motion/RenderQueuePanel.tsx | component | MotionRenderFormat, MotionRenderJob, MotionRenderProfile, MotionRenderSettings, RenderQueuePanel (props: RenderQueuePanelProps) | Project identity; progress updates alone should not change this scope. |
| `./components/forge/motion/TimeRemapCurve` | ui/src/components/forge/motion/TimeRemapCurve.tsx | component | TimeRemapCurve (props: TimeRemapCurveProps) | Source seconds against composition seconds; reverse/freeze segments are retained. |
| `./components/forge/motion/Transform3DInspector` | ui/src/components/forge/motion/Transform3DInspector.tsx | component | MotionTransform3D, MotionVector3, Transform3DInspector (props: Transform3DInspectorProps) | Controlled scene/document transform; rotations retain complete turns. |
| `./components/forge/motion/composition-tree` | ui/src/components/forge/motion/composition-tree.ts | module | CompositionLayer, CompositionLayerKind, CompositionTreeRow, compositionAncestors, flattenCompositionLayers, validateCompositionLayers | Stable sibling order follows the supplied document order, independent of expansion. |
| `./components/forge/motion/motion-curves` | ui/src/components/forge/motion/motion-curves.ts | module | MOTION_MAX_TIME, MOTION_TIME_EPSILON, MotionCurvePoint, MotionKeySelection, MotionKeyframe, MotionPropertyCurve, evaluateMotionCurve, evaluateMotionVelocity, +8 | Original bounded scalar animation math. |
| `./components/forge/motion/motion-easing` | ui/src/components/forge/motion/motion-easing.ts | module | MOTION_EASING_PRESETS, MotionEasing, MotionEasingKind, MotionEasingPreset, validateMotionEasing, validateMotionEasingPresets |  |
| `./components/forge/motion/motion-effects` | ui/src/components/forge/motion/motion-effects.ts | module | EffectParameter, EffectParameterValue, MotionEffect, MotionEffectMutation, moveMotionEffect, validateEffectChoices, validateEffectParameterValue, validateMotionEffects |  |
| `./components/forge/motion/motion-expression` | ui/src/components/forge/motion/motion-expression.ts | module | EXPRESSION_MAX_LENGTH, ExpressionCompletion, ExpressionDiagnostic, ExpressionQuery, ExpressionRange, ExpressionReference, isExpressionBoundary, replaceExpressionRange, +5 | Ranges use native UTF-16 offsets and must not split a surrogate pair. |
| `./components/forge/motion/motion-node-graph` | ui/src/components/forge/motion/motion-node-graph.ts | module | NodeGraphPolicy, motionGraphCanvasSize, validateMotionConnection, validateMotionNodeGraph |  |
| `./components/forge/motion/motion-path` | ui/src/components/forge/motion/motion-path.ts | module | MotionPathSnapping, snapMotionPoint, snapMotionTangent, validateMotionPathSnapping | Target points win equal-distance ties with the grid; points outside tolerance remain untouched. |
| `./components/forge/motion/motion-render` | ui/src/components/forge/motion/motion-render.ts | module | MotionRenderFormat, MotionRenderJob, MotionRenderProfile, MotionRenderSettings, moveQueuedRenderJob, validateMotionRenderJobs, validateMotionRenderSettings, validateRenderChoices | Queue rows remain in place while only adjacent queued jobs trade order. |
| `./components/forge/motion/motion-settings` | ui/src/components/forge/motion/motion-settings.ts | module | MotionCamera, MotionLight, MotionMatte, MotionParticleEmitter, MotionTransform3D, MotionVector3, defaultMotionTransform, validateMotionCamera, +5 | Document-space transforms; never an application window contract. |
| `./components/forge/motion/motion-timeline` | ui/src/components/forge/motion/motion-timeline.ts | module | motionSelectionBounds, motionSelectionKey, moveMotionSelection, validateMotionTimeline | Common intersection of every selected key's allowed time translation. |
| `./components/forge/office/ReadAloudTransport` | ui/src/components/forge/office/ReadAloudTransport.tsx | component | ReadAloudStatus, ReadAloudTransport (props: ReadAloudTransportProps) | Where the voice is. |
| `./components/forge/office/office-controls` | ui/src/components/forge/office/office-controls.tsx | component | ChevronGlyph, CloseMark, OFFICE_TOUCH_TARGET, OfficeKeyEvent, PauseGlyph, PlayGlyph, PlusGlyph, SkipGlyph, +2 (props: ToolButtonProps) | Minimum touch target for every office control, in points. |
| `./components/forge/office/read-aloud-model` | ui/src/components/forge/office/read-aloud-model.ts | module | READ_ALOUD_MAX_RATE, READ_ALOUD_MAX_SENTENCE, READ_ALOUD_MAX_SENTENCES, READ_ALOUD_MIN_RATE, READ_ALOUD_RATES, ReadAloudBlock, ReadAloudSentence, clampRate, +8 | Slowest reading speed, as a multiple of the voice's normal rate. |
| `./components/forge/pdf/AnnotationToolbar` | ui/src/components/forge/pdf/AnnotationToolbar.tsx | component | AnnotationToolbar (props: AnnotationToolbarProps) | Props for {@linkcode AnnotationToolbar}. |
| `./components/forge/pdf/BookmarkOutline` | ui/src/components/forge/pdf/BookmarkOutline.tsx | component | BookmarkOutline, PDFBookmark (props: BookmarkOutlineProps) |  |
| `./components/forge/pdf/CommentsThreadPanel` | ui/src/components/forge/pdf/CommentsThreadPanel.tsx | component | CommentsThreadPanel (props: CommentsThreadPanelProps) | Props for {@linkcode CommentsThreadPanel}. |
| `./components/forge/pdf/EncryptPermissionsPanel` | ui/src/components/forge/pdf/EncryptPermissionsPanel.tsx | component | EncryptPermissionsPanel, PDFEncryptionRequest (props: EncryptPermissionsPanelProps) | Passwords live only in this ephemeral, nonpersisted store and the host operation; never in identity, logs or presets. |
| `./components/forge/pdf/ExtractMergeSplitDialog` | ui/src/components/forge/pdf/ExtractMergeSplitDialog.tsx | component | ExtractMergeSplitDialog, PDFSourceDocument (props: ExtractMergeSplitDialogProps) | Native modal review of source order and page selection; host retains file/security scopes and PDF transactions. |
| `./components/forge/pdf/HyperlinkInspector` | ui/src/components/forge/pdf/HyperlinkInspector.tsx | component | HyperlinkInspector, PDFHyperlink (props: HyperlinkInspectorProps) |  |
| `./components/forge/pdf/PDFCompareOverlay` | ui/src/components/forge/pdf/PDFCompareOverlay.tsx | component | PDFCompareOverlay (props: PDFCompareOverlayProps) |  |
| `./components/forge/pdf/PDFFormFieldEditor` | ui/src/components/forge/pdf/PDFFormFieldEditor.tsx | component | PDFFormField, PDFFormFieldEditor (props: PDFFormFieldEditorProps) | Edits actual AcroForm metadata; native signing, field appearance regeneration and validation stay with the PDF host. |
| `./components/forge/pdf/PDFInlineTextEdit` | ui/src/components/forge/pdf/PDFInlineTextEdit.tsx | component | PDFInlineTextEdit, PDFTextRun (props: PDFInlineTextEditProps) | Actual native PDF hit tests/font admission and save acknowledgement; edits never claim an unacknowledged save. |
| `./components/forge/pdf/PDFPageLayoutSelector` | ui/src/components/forge/pdf/PDFPageLayoutSelector.tsx | component | PDFPageLayoutSelector (props: PDFPageLayoutSelectorProps) |  |
| `./components/forge/pdf/PDFReadAloudTransport` | ui/src/components/forge/pdf/PDFReadAloudTransport.tsx | component | PDFReadAloudTransport (props: PDFReadAloudTransportProps) | Props for {@linkcode PDFReadAloudTransport}. |
| `./components/forge/pdf/PDFScanSession` | ui/src/components/forge/pdf/PDFScanSession.tsx | component | PDFScanPage, PDFScanSession (props: PDFScanSessionProps) | Actual native camera surfaces and scan artifacts are supplied by the host; correction never substitutes a CSS transform for a processed imag |
| `./components/forge/pdf/PDFTextSelection` | ui/src/components/forge/pdf/PDFTextSelection.tsx | component | PDFTextSelection (props: PDFTextSelectionProps) | Native PDF reading order and glyph rectangles are supplied by the renderer; Unicode offsets stay explicitly typed. |
| `./components/forge/pdf/PDFThumbnailSidebar` | ui/src/components/forge/pdf/PDFThumbnailSidebar.tsx | component | PDFThumbnailSidebar (props: PDFThumbnailSidebarProps) | Virtual native page list with stable thumbnail bounds, grouping and one scoped reorder per release. |
| `./components/forge/pdf/PDFVoiceNoteAttachment` | ui/src/components/forge/pdf/PDFVoiceNoteAttachment.tsx | component | PDFVoiceNoteArtifact, PDFVoiceNoteAttachment (props: PDFVoiceNoteAttachmentProps) | The same native recording session supplies transport, measured waveform and the real attachment artifact. |
| `./components/forge/pdf/PageReorderOrganizer` | ui/src/components/forge/pdf/PageReorderOrganizer.tsx | component | PageReorderOrganizer (props: PageReorderOrganizerProps) |  |
| `./components/forge/pdf/PrintAndExportPreview` | ui/src/components/forge/pdf/PrintAndExportPreview.tsx | component | PDFOutputSettings, PrintAndExportPreview (props: PrintAndExportPreviewProps) | Actual preview/output/profile-validation telemetry; the native host owns PDF/A checks, printing and output files. |
| `./components/forge/pdf/RedactionReviewTool` | ui/src/components/forge/pdf/RedactionReviewTool.tsx | component | PDFRedactionMark, RedactionReviewTool (props: RedactionReviewToolProps) |  |
| `./components/forge/pdf/SignatureStampTool` | ui/src/components/forge/pdf/SignatureStampTool.tsx | component | PDFSignatureArtifact, SignatureStampTool (props: SignatureStampToolProps) | Visible signature stamp authoring. |
| `./components/forge/pdf/TextSearchResults` | ui/src/components/forge/pdf/TextSearchResults.tsx | component | PdfSearchProgress, TextSearchResults (props: TextSearchResultsProps) | Search progress reported by the host while it walks the pages. |
| `./components/forge/pdf/VirtualPDFPageViewer` | ui/src/components/forge/pdf/VirtualPDFPageViewer.tsx | component | PDFPageDescriptor, PDFPageLayout, PDFPageSurfaceContext, VirtualPDFPageViewer (props: VirtualPDFPageViewerProps) | Actual native PDF text/vector surface. |
| `./components/forge/pdf/annotation-model` | ui/src/components/forge/pdf/annotation-model.ts | module | ANNOTATION_TOOL_INFO, ANNOTATION_TOOL_ORDER, AnnotationTool, orderTools, toolForKey, toolForSubtype | Markup tools a PDF annotation toolbar can offer. |
| `./components/forge/pdf/comments-model` | ui/src/components/forge/pdf/comments-model.ts | module | CommentEntry, CommentFilter, CommentThread, groupThreads, resolveReply, threadCounts, threadLabel | One comment in a thread. |
| `./components/forge/pdf/search-model` | ui/src/components/forge/pdf/search-model.ts | module | PDF_SEARCH_MAX_HITS, PDF_SEARCH_SNIPPET_RADIUS, PdfSearchHit, PdfSearchOptions, findInPageText, groupHitsByPage, insertPageHits, searchPageOrder, +2 | Most hits one search keeps. |
| `./components/forge/photo/BatchExportPanel` | ui/src/components/forge/photo/BatchExportPanel.tsx | component | BatchExportPanel, PhotoBatchExportSettings, PhotoExportFormat, PhotoExportProgress (props: BatchExportPanelProps) | Configures a host's real batch encoder and reports only provider-supplied progress. |
| `./components/forge/photo/BeforeAfterCompare` | ui/src/components/forge/photo/BeforeAfterCompare.tsx | tsx-model | BeforeAfterCompare, CompareMode, CompareSource (props: BeforeAfterCompareProps) | Canonical photo name for the existing shared comparison owner: side-by-side, draggable wipe, overlay and pinned reference, from real host pi |
| `./components/forge/photo/CatalogFilterBar` | ui/src/components/forge/photo/CatalogFilterBar.tsx | component | CatalogChoice, CatalogFilterBar, PhotoCatalogFilter (props: CatalogFilterBarProps) | Explicit host-indexed catalog filters. |
| `./components/forge/photo/CleanupAndRetouchPanel` | ui/src/components/forge/photo/CleanupAndRetouchPanel.tsx | component | CleanupAndRetouchPanel, PhotoRetouchSettings, PhotoRetouchStroke (props: CleanupAndRetouchPanelProps) | Localized heal/remove requests over an actual host photo. |
| `./components/forge/photo/EightBandColorMixer` | ui/src/components/forge/photo/EightBandColorMixer.tsx | component | BandAdjustment, EightBandColorMixer, EightBandSettings, PhotoBand (props: EightBandColorMixerProps) | Eight explicit color ranges; edits retain every other band's exact values. |
| `./components/forge/photo/ExposureAndWhiteBalance` | ui/src/components/forge/photo/ExposureAndWhiteBalance.tsx | component | ExposureAndWhiteBalance, ExposureSettings (props: ExposureAndWhiteBalanceProps) | Controlled non-destructive exposure settings. |
| `./components/forge/photo/LensCorrectionPanel` | ui/src/components/forge/photo/LensCorrectionPanel.tsx | component | LensCorrectionPanel, LensProfile, LensSettings (props: LensCorrectionPanelProps) | Host-supplied calibrated profile identity and manual distortion/CA intent. |
| `./components/forge/photo/LinearRadialGradientMask` | ui/src/components/forge/photo/LinearRadialGradientMask.tsx | component | LinearRadialGradientMask, PhotoGradientGeometry, PhotoGradientMask (props: LinearRadialGradientMaskProps) | Photo identity and revision. |
| `./components/forge/photo/LocalMaskBrush` | ui/src/components/forge/photo/LocalMaskBrush.tsx | component | LocalMaskBrush, PhotoBrushPoint, PhotoImageSize, PhotoMaskBrushSettings, PhotoMaskStroke (props: LocalMaskBrushProps) | Native responder-backed add/subtract marks with bounded radius, feather and force-preserving samples. |
| `./components/forge/photo/LuminanceColorRangeMask` | ui/src/components/forge/photo/LuminanceColorRangeMask.tsx | component | LuminanceColorRangeMask, PhotoRangeMask, PhotoRangeSampleRequest (props: LuminanceColorRangeMaskProps) | Document-only sampling: profile-bearing color is retained, never inferred from an OS screenshot. |
| `./components/forge/photo/PhotoLibraryGrid` | ui/src/components/forge/photo/PhotoLibraryGrid.tsx | component | PhotoCatalogItem, PhotoLibraryGrid (props: PhotoLibraryGridProps) | Virtualized catalog page with host-generated thumbnails; originals are never decoded by the grid. |
| `./components/forge/photo/PhotoMetadataInspector` | ui/src/components/forge/photo/PhotoMetadataInspector.tsx | component | PhotoMetadata, PhotoMetadataInspector, PhotoProvenanceEntry (props: PhotoMetadataInspectorProps) | Read-only original EXIF/provenance, with a separate host-owned editing annotation. |
| `./components/forge/photo/PhotoVersionHistoryBrowser` | ui/src/components/forge/photo/PhotoVersionHistoryBrowser.tsx | component | PhotoVersion, PhotoVersionHistoryBrowser (props: PhotoVersionHistoryBrowserProps) | Read-only snapshots with explicit compare/restore; there is no original-delete operation. |
| `./components/forge/photo/PresetFilmstrip` | ui/src/components/forge/photo/PresetFilmstrip.tsx | component | FilmstripPreset, PresetFilmstrip (props: PresetFilmstripProps) | Horizontal photo preset previews with explicit cancellable apply to the selected photo set. |
| `./components/forge/photo/PresetManager` | ui/src/components/forge/photo/PresetManager.tsx | component | PhotoPreset, PresetManager (props: PresetManagerProps) | Versioned preset transfer with validation before any host write, plus rename/delete. |
| `./components/forge/photo/RAWDevelopPanel` | ui/src/components/forge/photo/RAWDevelopPanel.tsx | component | PhotoDevelopSettings, RAWDevelopPanel (props: RAWDevelopPanelProps) | Camera/engine-specific defaults, not assumed to be a universal RAW white balance. |
| `./components/forge/photo/RatingAndFlagControl` | ui/src/components/forge/photo/RatingAndFlagControl.tsx | component | PhotoRating, RatingAndFlagControl (props: RatingAndFlagControlProps) | Independent star, named color-label and mutually exclusive pick/reject fields. |
| `./components/forge/photo/ToneAndPresence` | ui/src/components/forge/photo/ToneAndPresence.tsx | component | ToneAndPresence, ToneSettings (props: ToneAndPresenceProps) | Controlled non-destructive tone settings. |
| `./components/forge/photo/photo-adjustments` | ui/src/components/forge/photo/photo-adjustments.ts | module | BandAdjustment, EXPOSURE_FIELDS, EightBandSettings, ExposureSettings, LensSettings, PHOTO_BANDS, PhotoBand, PhotoDevelopSettings, +12 | Non-destructive, versioned settings. |
| `./components/forge/photo/photo-catalog` | ui/src/components/forge/photo/photo-catalog.ts | module | CatalogChoice, PhotoCatalogFilter, PhotoCatalogItem, emptyPhotoCatalogFilter, togglePhotoSelection, validPhotoDate, validateCatalogChoices, validateCatalogFilter, +1 | Calendar date without silently changing the source timezone. |
| `./components/forge/photo/photo-export` | ui/src/components/forge/photo/photo-export.ts | module | PhotoBatchExportSettings, PhotoExportFormat, PhotoExportProgress, defaultPhotoBatchExport, validatePhotoExport, validatePhotoExportProgress |  |
| `./components/forge/photo/photo-masks` | ui/src/components/forge/photo/photo-masks.ts | module | MAX_PHOTO_BRUSH_POINTS, PhotoBrushPoint, PhotoBrushSettings, PhotoGradientGeometry, PhotoGradientMask, PhotoImageSize, PhotoMaskBrushSettings, PhotoMaskCombine, +9 | Normalized image coordinates, preserving reported force and unknown force separately. |
| `./components/forge/photo/photo-metadata` | ui/src/components/forge/photo/photo-metadata.ts | module | PhotoMetadata, PhotoProvenanceEntry, validatePhotoMetadata | Values are supplied by the metadata/provenance provider; null means unrecorded. |
| `./components/forge/photo/photo-presets` | ui/src/components/forge/photo/photo-presets.ts | module | PhotoPreset, parsePhotoPreset, serializePhotoPreset, validatePhotoPreset, validatePhotoPresets, validatePhotoTargets |  |
| `./components/forge/platform/AccessiblePrecisionScrubControl` | ui/src/components/forge/platform/AccessiblePrecisionScrubControl.tsx | component | AccessiblePrecisionScrubControl (props: AccessiblePrecisionScrubControlProps) | One precision model for native RNGH pointer, keyboard, switch, adjustable actions and explicit numeric entry. |
| `./components/forge/range-paste` | ui/src/components/forge/range-paste.ts | module | MAX_SHEET_COLUMNS, MAX_SHEET_ROWS, PasteCell, PasteTooLargeError, TsvPaste, TsvToRangeOptions, parseTsv, tsvToRange | Sheet limits shared with SpreadsheetGrid: 1,048,576 rows by 16,384 columns. |
| `./components/forge/range-tsv` | ui/src/components/forge/range-tsv.ts | module | RangeTooLargeError, RangeTsvOptions, TsvValue, rangeToTsv, tsvField | A value {@linkcode rangeToTsv} can serialize. |
| `./components/forge/selection/MagicSelectionControls` | ui/src/components/forge/selection/MagicSelectionControls.tsx | component | MagicSelectionControls, MagicWandCanvas, SelectionEdgeRadii (props: MagicSelectionControlsProps, MagicWandCanvasProps) | Radii the edge tools use, in document pixels. |
| `./components/forge/selection/MultiSelectionControls` | ui/src/components/forge/selection/MultiSelectionControls.tsx | component | MultiSelectionControls, ObjectSelection, SelectableObject, SharedPropertyDefinition, SharedValue (props: MultiSelectionControlsProps) | Lasso geometry is supplied by SelectionMarquee or the host's canvas hit-test owner. |
| `./components/forge/selection/SelectionBounds` | ui/src/components/forge/selection/SelectionBounds.tsx | component | SelectionBounds, SelectionFrame, SelectionHandle (props: SelectionBoundsProps) | Local usable panes from the app's existing layout owner. |
| `./components/forge/selection/SelectionMarquee` | ui/src/components/forge/selection/SelectionMarquee.tsx | component | SelectionMarquee (props: SelectionMarqueeProps) | Props for {@linkcode SelectionMarquee}. |
| `./components/forge/selection/magic-selection-model` | ui/src/components/forge/selection/magic-selection-model.ts | module | MAX_SELECTION_RADIUS, MAX_TOLERANCE, MagicWandRequest, MagicWandSettings, ModifySelectionRequest, RefineEdgeRequest, WAND_SAMPLES, WandSample, +8 | Settings and request builders for {@linkcode MagicSelectionControls} and {@linkcode MagicWandCanvas}. |
| `./components/forge/selection/multi-selection-model` | ui/src/components/forge/selection/multi-selection-model.ts | module | ObjectSelection, ObjectSelectionMode, SelectableObject, SelectionModifiers, SharedPropertyState, SharedValue, combineObjectSelection, pickSelectionObject, +3 | Combines engine/host hit-test results in display order; disabled objects cannot enter a selection. |
| `./components/forge/selection/selection-bounds-model` | ui/src/components/forge/selection/selection-bounds-model.ts | module | RESIZE_HANDLES, ResizeHandle, SelectionEditLimits, SelectionFrame, SelectionHandle, editSelectionFrame, hitTestSelection, selectionFrameCorners, +4 | Clockwise document-space rectangle. |
| `./components/forge/selection/selection-model` | ui/src/components/forge/selection/selection-model.ts | module | BoxShape, DocPoint, DocRect, KEYBOARD_STEP, LASSO_MAX_POINTS, LASSO_MIN_SPACING, MAX_DRAWN_SEGMENTS, MAX_SELECTION_RADIUS, +38 (props: validateSelectionProps) | Engine-neutral pixel-selection contract for {@linkcode SelectionMarquee} and {@linkcode MagicSelectionControls}. |
| `./components/forge/sheet-window` | ui/src/components/forge/sheet-window.ts | module | CellPosition, FrozenSheetWindow, FrozenSheetWindowOptions, RevealCellOptions, SheetBounds, SheetKeyInput, SheetPrefetchOptions, SheetRange, +21 | The 2-D viewport policy for Tally's visible window. |
| `./components/forge/slides/ChartAndTableEditor` | ui/src/components/forge/slides/ChartAndTableEditor.tsx | component | ChartAndTableEditor (props: ChartAndTableEditorProps) | One owner for data, chart series/formatting and table cell layout across office documents. |
| `./components/forge/slides/ConnectorAndDiagramTools` | ui/src/components/forge/slides/ConnectorAndDiagramTools.tsx | component | ConnectorAndDiagramTools, DiagramConnector, DiagramTarget (props: ConnectorAndDiagramToolsProps) | Document-coordinate size; the host canvas renders in this same box. |
| `./components/forge/slides/InkAndLaserPointer` | ui/src/components/forge/slides/InkAndLaserPointer.tsx | component | InkAndLaserPointer (props: InkAndLaserPointerProps) | Native RNGH input with the shared Graphite renderer. |
| `./components/forge/slides/MasterLayoutEditor` | ui/src/components/forge/slides/MasterLayoutEditor.tsx | component | MasterLayoutEditor, MasterPlaceholder (props: MasterLayoutEditorProps) |  |
| `./components/forge/slides/MediaInsertInspector` | ui/src/components/forge/slides/MediaInsertInspector.tsx | component | MediaInsertInspector, SlideMediaSettings (props: MediaInsertInspectorProps) |  |
| `./components/forge/slides/MorphPreview` | ui/src/components/forge/slides/MorphPreview.tsx | component | MorphMatch, MorphPreview (props: MorphPreviewProps) | Correspondence editing and source-rendered morph frames; no second animation clock or substitute thumbnails. |
| `./components/forge/slides/PresenterInkOverlay` | ui/src/components/forge/slides/PresenterInkOverlay.tsx | component | PresenterInkFrame, PresenterInkOverlay (props: PresenterInkOverlayProps) | Optional renderer adapter; default portable Views are limited to 4096 points. |
| `./components/forge/slides/PresenterInkStrip` | ui/src/components/forge/slides/PresenterInkStrip.tsx | component | PresenterInkStrip (props: PresenterInkStripProps) | Presenter tools; colors/size remain the consuming app's existing ink controls. |
| `./components/forge/slides/PresenterView` | ui/src/components/forge/slides/PresenterView.tsx | component | PresenterView (props: PresenterViewProps) | Presenter clock/elapsed values follow the host session. |
| `./components/forge/slides/RehearsalTimers` | ui/src/components/forge/slides/RehearsalTimers.tsx | component | RehearsalTimers (props: RehearsalTimersProps) |  |
| `./components/forge/slides/ShapePresetGallery` | ui/src/components/forge/slides/ShapePresetGallery.tsx | component | ShapeAdjustmentHandle, ShapePresetGallery (props: ShapePresetGalleryProps) | Source-backed vector previews and a selected native drag handle, plus numeric/keyboard alternatives. |
| `./components/forge/slides/SlideAnimationPane` | ui/src/components/forge/slides/SlideAnimationPane.tsx | component | SlideAnimationPane (props: SlideAnimationPaneProps) | Props for {@linkcode SlideAnimationPane}. |
| `./components/forge/slides/SlideCanvas` | ui/src/components/forge/slides/SlideCanvas.tsx | component | SlideCanvas (props: SlideCanvasProps) | Props for {@linkcode SlideCanvas}. |
| `./components/forge/slides/SlideFilmstrip` | ui/src/components/forge/slides/SlideFilmstrip.tsx | component | SlideFilmstrip (props: SlideFilmstripProps) | Props for {@linkcode SlideFilmstrip}. |
| `./components/forge/slides/SlideNotesEditor` | ui/src/components/forge/slides/SlideNotesEditor.tsx | component | SlideNotesEditor (props: SlideNotesEditorProps) | Native notes buffer or an explicit rich-text native editor, sharing the formatting ribbon. |
| `./components/forge/slides/SlideSorter` | ui/src/components/forge/slides/SlideSorter.tsx | component | SlideSorter (props: SlideSorterProps) | Props for {@linkcode SlideSorter}. |
| `./components/forge/slides/SlideThumbnail` | ui/src/components/forge/slides/SlideThumbnail.tsx | component | SlideObjectView, SlideThumbnail (props: SlideThumbnailProps) | Props for {@linkcode SlideThumbnail}. |
| `./components/forge/slides/ThemeAndTemplateGallery` | ui/src/components/forge/slides/ThemeAndTemplateGallery.tsx | component | PresentationPreset, ThemeAndTemplateGallery (props: ThemeAndTemplateGalleryProps) | Actual theme roles, font options and document color IDs; unavailable resources must be admitted by the host. |
| `./components/forge/slides/TransitionPicker` | ui/src/components/forge/slides/TransitionPicker.tsx | component | SlideTransition, TransitionPicker (props: TransitionPickerProps) |  |
| `./components/forge/slides/animation-model` | ui/src/components/forge/slides/animation-model.ts | module | ANIMATION_MAX_SECONDS, AnimationCategory, AnimationEffect, SLIDE_ANIMATION_EFFECTS, SlideAnimation, effectLabel, formatSeconds, parseSeconds, +2 | When in a slide's life an effect plays. |
| `./components/forge/slides/canvas-model` | ui/src/components/forge/slides/canvas-model.ts | module | SLIDE_MIN_OBJECT, SLIDE_SNAP_POINTS, SlideRect, SnapGuide, fitScale, hitTest, nudge, objectLabel, +3 | A box in slide units. |
| `./components/forge/slides/presenter-ink-model` | ui/src/components/forge/slides/presenter-ink-model.ts | module | ERASER_RADIUS, HIGHLIGHTER_OPACITY, HIGHLIGHTER_WIDTH_FACTOR, InkViewSize, LASER_TRAIL_MAX, LASER_TRAIL_MS, LaserSample, MIN_POINT_SPACING, +26 | Pure rules for `PresenterInkOverlay` and `PresenterInkStrip` (J-14): tools, keyboard shortcuts, normalized stroke geometry, eraser hit tests |
| `./components/forge/slides/slide-model` | ui/src/components/forge/slides/slide-model.ts | module | SLIDE_DEFAULT_SIZE, SlideObject, SlideObjectKind, SlideRgba, SlideSize, SlideSummary, gridColumns, gridMove, +8 | RGBA channels 0–255, as presentation engines store document colors. |
| `./components/forge/spreadsheet/CellFormatInspector` | ui/src/components/forge/spreadsheet/CellFormatInspector.tsx | component | CellFormat, CellFormatInspector (props: CellFormatInspectorProps) |  |
| `./components/forge/spreadsheet/CellSelectionOverlay` | ui/src/components/forge/spreadsheet/CellSelectionOverlay.tsx | component | CellSelectionOverlay, SelectionPane (props: CellSelectionOverlayProps) | Separate nonoccluded grid/frozen-pane rectangles supplied by the layout owner. |
| `./components/forge/spreadsheet/ChartBuilder` | ui/src/components/forge/spreadsheet/ChartBuilder.tsx | component | ChartBuilder, ChartPresentation (props: ChartBuilderProps) | Controlled chart builder: type gallery, data range, series orientation, header/x-value options and axis titles. |
| `./components/forge/spreadsheet/ConditionalFormatRules` | ui/src/components/forge/spreadsheet/ConditionalFormatRules.tsx | component | ConditionalFormatRules, ConditionalRule (props: ConditionalFormatRulesProps) |  |
| `./components/forge/spreadsheet/DataImportWizard` | ui/src/components/forge/spreadsheet/DataImportWizard.tsx | component | DataImportWizard, ImportColumn, ImportSettings (props: DataImportWizardProps) | Host file picker/parser/conversion transactions; preview rows and failures are actual supplied results. |
| `./components/forge/spreadsheet/FillHandleAndAutoFill` | ui/src/components/forge/spreadsheet/FillHandleAndAutoFill.tsx | component | AutoFillMode, AutoFillModePicker, FillHandleAndAutoFill (props: AutoFillModePickerProps, FillHandleAndAutoFillProps) | Shares the range recognizer and fill planner. |
| `./components/forge/spreadsheet/FormulaAutocomplete` | ui/src/components/forge/spreadsheet/FormulaAutocomplete.tsx | component | FormulaAutocomplete, FormulaSuggestion (props: FormulaAutocompleteProps) | Uses the host's parser/catalog replacement range; does not guess function semantics or evaluate formulas. |
| `./components/forge/spreadsheet/FormulaBar` | ui/src/components/forge/spreadsheet/FormulaBar.tsx | component | FormulaBar (props: FormulaBarProps) | Controlled formula text; the workbook owns the draft and evaluates only committed input. |
| `./components/forge/spreadsheet/FormulaReferenceText` | ui/src/components/forge/spreadsheet/FormulaReferenceText.tsx | component | FormulaReferenceText (props: FormulaReferenceTextProps) | A formula with each reference drawn in its tone, matching the outlines `SpreadsheetGrid` draws for the same formula. |
| `./components/forge/spreadsheet/FreezeSplitControls` | ui/src/components/forge/spreadsheet/FreezeSplitControls.tsx | component | FreezeSplitControls, describeFreeze (props: FreezeSplitControlsProps) | Controlled freeze-panes and split-view commands. |
| `./components/forge/spreadsheet/NameBox` | ui/src/components/forge/spreadsheet/NameBox.tsx | component | NameBox (props: NameBoxProps) |  |
| `./components/forge/spreadsheet/PivotFieldList` | ui/src/components/forge/spreadsheet/PivotFieldList.tsx | component | PivotAssignment, PivotFieldList, PivotZone (props: PivotFieldListProps) |  |
| `./components/forge/spreadsheet/RangeComments` | ui/src/components/forge/spreadsheet/RangeComments.tsx | component | RangeComments (props: RangeCommentsProps) | Actual workbook/sheet/range label per thread, e.g. |
| `./components/forge/spreadsheet/ReferenceColorizer` | ui/src/components/forge/spreadsheet/ReferenceColorizer.tsx | component | ReferenceColorizer (props: ReferenceColorizerProps) | Shared licensed tokenizer/tone owner; the host places on-sheet range outlines in grid coordinates. |
| `./components/forge/spreadsheet/SavedSheetViewManager` | ui/src/components/forge/spreadsheet/SavedSheetViewManager.tsx | component | SavedSheetView, SavedSheetViewManager, SheetViewSnapshot (props: SavedSheetViewManagerProps) |  |
| `./components/forge/spreadsheet/SheetTabs` | ui/src/components/forge/spreadsheet/SheetTabs.tsx | component | SheetTabs (props: SheetTabsProps) | Controlled worksheet tab strip. |
| `./components/forge/spreadsheet/SortFilterHeader` | ui/src/components/forge/spreadsheet/SortFilterHeader.tsx | component | SheetFilter, SheetSort, SortFilterHeader (props: SortFilterHeaderProps) |  |
| `./components/forge/spreadsheet/Sparkline` | ui/src/components/forge/spreadsheet/Sparkline.tsx | component | Sparkline (props: SparklineProps) | An in-cell chart drawn with plain views, so it renders inside any grid cell on every platform without a canvas. |
| `./components/forge/spreadsheet/SparklineEditor` | ui/src/components/forge/spreadsheet/SparklineEditor.tsx | component | MAX_SPARKLINE_VALUES, SparklineEditor, sparklineValues (props: SparklineEditorProps) | Controlled sparkline editor: type, data range, target cell, high/low and negative markers, axis minimum and a live preview from the cells th |
| `./components/forge/spreadsheet/SplitSpreadsheetView` | ui/src/components/forge/spreadsheet/SplitSpreadsheetView.tsx | component | SplitSpreadsheetView (props: SplitSpreadsheetViewProps) | Two panes of one sheet with a draggable divider. |
| `./components/forge/spreadsheet/SpreadsheetCardsView` | ui/src/components/forge/spreadsheet/SpreadsheetCardsView.tsx | component | SpreadsheetCardsView (props: SpreadsheetCardsViewProps) | Explicit record mode. |
| `./components/forge/spreadsheet/TableStyleGallery` | ui/src/components/forge/spreadsheet/TableStyleGallery.tsx | component | NamedTableStyle, TableStyleGallery (props: TableStyleGalleryProps) |  |
| `./components/forge/spreadsheet/ValidationDropdown` | ui/src/components/forge/spreadsheet/ValidationDropdown.tsx | component | ValidationDropdown (props: ValidationDropdownProps) |  |
| `./components/forge/spreadsheet/VirtualSpreadsheetGrid` | ui/src/components/forge/spreadsheet/VirtualSpreadsheetGrid.tsx | component | VirtualSpreadsheetGrid (props: VirtualSpreadsheetGridProps) | Canonical entry for the existing two-axis, frozen-pane, window-request grid owner. |
| `./components/forge/spreadsheet/cards-model` | ui/src/components/forge/spreadsheet/cards-model.ts | module | CARD_PREVIEW_FIELDS, CardCellValues, SheetCard, SheetCardField, sheetCardAt, sheetCards | How many fields after the title a card in the list shows (GridCraft `CARD_LINES`). |
| `./components/forge/spreadsheet/chart-model` | ui/src/components/forge/spreadsheet/chart-model.ts | module | ChartCellValues, MAX_CHART_CELLS, SHEET_CHART_KINDS, SeriesOrientation, SheetChartData, SheetChartKind, SheetChartSeries, SheetChartSpec, +2 | Mark family a chart draws. |
| `./components/forge/spreadsheet/fill-handle` | ui/src/components/forge/spreadsheet/fill-handle.ts | module | FillBounds, FillDirection, FillPlan, fillFromEdge, fillTarget | Direction a fill extends its source range. |
| `./components/forge/spreadsheet/freeze-split-model` | ui/src/components/forge/spreadsheet/freeze-split-model.ts | module | FreezeCommand, FreezeState, SPLIT_KEY_STEP, SplitAxis, SplitGeometry, SplitState, dragSplitRatio, freezeFor, +1 | Frozen leading rows and columns, as `SpreadsheetGrid` takes them. |
| `./components/forge/spreadsheet/reference-colors` | ui/src/components/forge/spreadsheet/reference-colors.ts | module | ColoredReference, FormulaSegment, REFERENCE_TONE_CLASSES, REFERENCE_TONE_COUNT, ReferenceToneClasses, colorReferences, formulaSegments, referenceEdges | Number of distinct reference tones. |
| `./components/forge/spreadsheet/sheet-tabs-model` | ui/src/components/forge/spreadsheet/sheet-tabs-model.ts | module | MAX_SHEET_NAME_LENGTH, SHEET_TAB_TONES, SheetTab, SheetTabTone, duplicateSheetName, nextSheetName, sheetNameError, sheetTabKeyTarget, +1 | Tone of a sheet tab's color stripe. |
| `./components/forge/spreadsheet/sparkline-model` | ui/src/components/forge/spreadsheet/sparkline-model.ts | module | SPARKLINE_KINDS, SparklineAxisMin, SparklineBar, SparklineGeometry, SparklineGeometryOptions, SparklineKind, SparklineMarkTone, SparklineMarker, +5 | In-cell chart family. |
| `./components/forge/timebase` | ui/src/components/forge/timebase.ts | module | FRAME_RATES, FrameRate, assertFrameRate, clampFrame, formatTimecode, frameToPosition, framesToSeconds, positionToFrame, +1 | Controlled frame math from Nitro Forge media-ui PR #25. |
| `./components/forge/timeline/AudioClipWaveform` | ui/src/components/forge/timeline/AudioClipWaveform.tsx | component | AudioClipWaveform (props: AudioClipWaveformProps) | Real decoded min/max peaks for the requested source interval. |
| `./components/forge/timeline/AutoCaptionTranscriptTimeline` | ui/src/components/forge/timeline/AutoCaptionTranscriptTimeline.tsx | component | AutoCaptionTranscriptTimeline, CaptionSegment (props: AutoCaptionTranscriptTimelineProps) | Edits actual ASR caption blocks; the host owns recognition and playback clocks. |
| `./components/forge/timeline/AutoReframeGuides` | ui/src/components/forge/timeline/AutoReframeGuides.tsx | component | AutoReframeGuides (props: AutoReframeGuidesProps) |  |
| `./components/forge/timeline/BatchEditPanel` | ui/src/components/forge/timeline/BatchEditPanel.tsx | component | BatchEditPanel (props: BatchEditPanelProps) | Props for {@linkcode BatchEditPanel}. |
| `./components/forge/timeline/CaptionWordTimingHandles` | ui/src/components/forge/timeline/CaptionWordTimingHandles.tsx | component | CaptionWord, CaptionWordTimingHandles (props: CaptionWordTimingHandlesProps) | Frame-snapped word boundaries with neighboring-word collision checks. |
| `./components/forge/timeline/ClipTrimHandles` | ui/src/components/forge/timeline/ClipTrimHandles.tsx | component | ClipTrimHandles (props: ClipTrimHandlesProps) | Props for {@linkcode ClipTrimHandles}. |
| `./components/forge/timeline/CoverFramePicker` | ui/src/components/forge/timeline/CoverFramePicker.tsx | component | CoverFramePicker, VideoCover (props: CoverFramePickerProps) | Chooses actual source frames/assets; applying the exported cover remains an engine transaction. |
| `./components/forge/timeline/DragReorderAndRipple` | ui/src/components/forge/timeline/DragReorderAndRipple.tsx | component | DragReorderAndRipple (props: DragReorderAndRippleProps) | Props for {@linkcode DragReorderAndRipple}. |
| `./components/forge/timeline/ExportMonitor` | ui/src/components/forge/timeline/ExportMonitor.tsx | component | ExportMonitor, VideoExportCodec, VideoExportOutput (props: ExportMonitorProps) | Encoder-specific geometry wraps the shared preset/frame-rate/progress queue owner. |
| `./components/forge/timeline/FrameAccurateScrubber` | ui/src/components/forge/timeline/FrameAccurateScrubber.tsx [variants: native.tsx,shared.tsx] | component | FrameAccurateScrubber, FrameSeekRequest, FrameSeekResult (props: FrameAccurateScrubberProps) |  |
| `./components/forge/timeline/InOutRangeHandles` | ui/src/components/forge/timeline/InOutRangeHandles.tsx | component | InOutRangeHandles (props: InOutRangeHandlesProps) | Props for {@linkcode InOutRangeHandles}. |
| `./components/forge/timeline/JKLShuttleController` | ui/src/components/forge/timeline/JKLShuttleController.tsx | component | JKLShuttleController (props: JKLShuttleControllerProps) | Props for {@linkcode JKLShuttleController}. |
| `./components/forge/timeline/LoopRangeBar` | ui/src/components/forge/timeline/LoopRangeBar.tsx | component | LoopRangeBar (props: LoopRangeBarProps) | Props for {@linkcode LoopRangeBar}. |
| `./components/forge/timeline/MediaMonitor` | ui/src/components/forge/timeline/MediaMonitor.tsx | component | MediaMonitor (props: MediaMonitorProps) | Last decoded frame actually presented, separate from the requested/clock frame. |
| `./components/forge/timeline/ModeEdgeHandles` | ui/src/components/forge/timeline/ModeEdgeHandles.tsx | component | ModeEdgeHandles, modeEdge (props: ModeEdgeHandlesProps) | Props for {@linkcode ModeEdgeHandles}. |
| `./components/forge/timeline/MotionTrackingOverlay` | ui/src/components/forge/timeline/MotionTrackingOverlay.tsx | component | MotionTrackingOverlay (props: MotionTrackingOverlayProps) | Actual tracking measurements over the host frame, plus scoped manual correction. |
| `./components/forge/timeline/MulticamAngleViewer` | ui/src/components/forge/timeline/MulticamAngleViewer.tsx | component | MulticamAngle, MulticamAngleViewer (props: MulticamAngleViewerProps) |  |
| `./components/forge/timeline/OverlayAndEffectsTrackStack` | ui/src/components/forge/timeline/OverlayAndEffectsTrackStack.tsx | component | OverlayAndEffectsTrackStack (props: OverlayAndEffectsTrackStackProps) | Props for {@linkcode OverlayAndEffectsTrackStack}. |
| `./components/forge/timeline/PictureInPictureControls` | ui/src/components/forge/timeline/PictureInPictureControls.tsx | component | PictureInPictureControls (props: PictureInPictureControlsProps) | Reflects the OS-reported PiP state. |
| `./components/forge/timeline/PlaybackRateMenu` | ui/src/components/forge/timeline/PlaybackRateMenu.tsx | component | PlaybackRateMenu (props: PlaybackRateMenuProps) | Props for {@linkcode PlaybackRateMenu}. |
| `./components/forge/timeline/ProgramMonitor` | ui/src/components/forge/timeline/ProgramMonitor.tsx | component | ProgramMonitor (props: ProgramMonitorProps) | Actual presented-frame telemetry, timeline compositor surface and framing overlays. |
| `./components/forge/timeline/RazorSplitTool` | ui/src/components/forge/timeline/RazorSplitTool.tsx | component | RazorSplitTool (props: RazorSplitToolProps) | Props for {@linkcode RazorSplitTool}. |
| `./components/forge/timeline/RenderCacheIndicator` | ui/src/components/forge/timeline/RenderCacheIndicator.tsx | component | RenderCacheIndicator, RenderCacheJob (props: RenderCacheIndicatorProps) |  |
| `./components/forge/timeline/RollSlipSlideControls` | ui/src/components/forge/timeline/RollSlipSlideControls.tsx | component | RollSlipSlideControls (props: RollSlipSlideControlsProps) | Props for {@linkcode RollSlipSlideControls}. |
| `./components/forge/timeline/SafeAreaOverlay` | ui/src/components/forge/timeline/SafeAreaOverlay.tsx | component | SafeAreaOverlay (props: SafeAreaOverlayProps) | Props for {@linkcode SafeAreaOverlay}. |
| `./components/forge/timeline/ScopesDock` | ui/src/components/forge/timeline/ScopesDock.tsx | component | ScopesDock (props: ScopesDockProps) | Actual decoder/compositor measurements, with source/program assignment and stale-frame disclosure. |
| `./components/forge/timeline/SeekBar` | ui/src/components/forge/timeline/SeekBar.tsx | component | SeekBar (props: SeekBarProps) | Props for {@linkcode SeekBar}. |
| `./components/forge/timeline/SourceMonitor` | ui/src/components/forge/timeline/SourceMonitor.tsx | component | SourceMonitor (props: SourceMonitorProps) | Source asset preview and in/out marks over the host's actual media surface. |
| `./components/forge/timeline/StickerMotionLane` | ui/src/components/forge/timeline/StickerMotionLane.tsx | component | StickerMotionLane, StickerTransform, TimelineSticker (props: StickerMotionLaneProps) | Sticker objects retain their own ranges, transforms and shared editable motion keys. |
| `./components/forge/timeline/TimecodeDisplay` | ui/src/components/forge/timeline/TimecodeDisplay.tsx | component | TimecodeDisplay (props: TimecodeDisplayProps) | Props for {@linkcode TimecodeDisplay}. |
| `./components/forge/timeline/TimelineClipLane` | ui/src/components/forge/timeline/TimelineClipLane.tsx | component | TimelineClipLane, TimelineTool (props: TimelineClipLaneProps) | What a press or drag on a clip does. |
| `./components/forge/timeline/TimelineMarkers` | ui/src/components/forge/timeline/TimelineMarkers.tsx | component | TimelineMarkers (props: TimelineMarkersProps) | Props for {@linkcode TimelineMarkers}. |
| `./components/forge/timeline/TimelinePlayhead` | ui/src/components/forge/timeline/TimelinePlayhead.tsx | component | TimelinePlayhead (props: TimelinePlayheadProps) | Props for {@linkcode TimelinePlayhead}. |
| `./components/forge/timeline/TimelineRuler` | ui/src/components/forge/timeline/TimelineRuler.tsx | component | TimelineMark, TimelineRuler (props: TimelineRulerProps) | A named point on the ruler. |
| `./components/forge/timeline/TimelineZoomAndScroll` | ui/src/components/forge/timeline/TimelineZoomAndScroll.tsx | component | TimelineZoomAndScroll (props: TimelineZoomAndScrollProps) | Props for {@linkcode TimelineZoomAndScroll}. |
| `./components/forge/timeline/TrackHeaders` | ui/src/components/forge/timeline/TrackHeaders.tsx | component | TRACK_KIND_LABEL, TrackFlag, TrackHeaders, trackCode, trackFlags (props: TrackHeadersProps) | A track switch Splice stores (`setTrackFlags`). |
| `./components/forge/timeline/TransitionHandles` | ui/src/components/forge/timeline/TransitionHandles.tsx | component | TransitionHandles (props: TransitionHandlesProps) | Props for {@linkcode TransitionHandles}. |
| `./components/forge/timeline/TransitionPresetBrowser` | ui/src/components/forge/timeline/TransitionPresetBrowser.tsx | component | PresetBrowserCut, TransitionPresetBrowser (props: TransitionPresetBrowserProps) | The cut the browser applies to, as the host resolved it. |
| `./components/forge/timeline/TransportControls` | ui/src/components/forge/timeline/TransportControls.tsx | component | TransportControls (props: TransportControlsProps) | Props for {@linkcode TransportControls}. |
| `./components/forge/timeline/VideoEffectsBrowser` | ui/src/components/forge/timeline/VideoEffectsBrowser.tsx | component | VideoEffectsBrowser (props: VideoEffectsBrowserProps) | Reuses the schema-driven effect owner; actual video/body-effect rendering stays with the host. |
| `./components/forge/timeline/VideoFilmstrip` | ui/src/components/forge/timeline/VideoFilmstrip.tsx | component | VideoFilmstrip (props: VideoFilmstripProps) | Decode this source frame; max bounds the returned raster edge. |
| `./components/forge/timeline/VideoQualityInspector` | ui/src/components/forge/timeline/VideoQualityInspector.tsx | component | VideoQualityInspector (props: VideoQualityInspectorProps) |  |
| `./components/forge/timeline/VideoSpeedRampCurve` | ui/src/components/forge/timeline/VideoSpeedRampCurve.tsx | component | VideoSpeedRampCurve (props: VideoSpeedRampCurveProps) | Edit speed itself, not its derivative. |
| `./components/forge/timeline/VideoStabilizationInspector` | ui/src/components/forge/timeline/VideoStabilizationInspector.tsx | component | VideoStabilizationInspector, VideoStabilizationSettings (props: VideoStabilizationInspectorProps) |  |
| `./components/forge/timeline/batch` | ui/src/components/forge/timeline/batch.ts | module | BatchEdit, BatchResult, SPEED_RANGE, batchRemove, batchRippleDelete, batchShift, batchSpeed, selectedClips | One change in a batch (D-41). |
| `./components/forge/timeline/edits` | ui/src/components/forge/timeline/edits.ts | module | EditPreview, InOutRange, MoveMode, RippleScope, Snap, SnapOptions, TimelineClip, TimelineEdit, +22 | A clip as the timeline draws it. |
| `./components/forge/timeline/loop-range` | ui/src/components/forge/timeline/loop-range.ts | module | LoopCommit, LoopRange, loopCommit, loopFromMarks, loopNext, setLoopEdge | The playback loop (D-13): `[inFrame, outFrame)`, at least one frame long. |
| `./components/forge/timeline/markers` | ui/src/components/forge/timeline/markers.ts | module | MarkerUpdate, TimelineMarker, adjacentMarker, moveMarker, nextMarkerName, resizeMarker, sortMarkers | A sequence marker (D-24). |
| `./components/forge/timeline/placement` | ui/src/components/forge/timeline/placement.ts | module | Placement, placementEdit, placementPreview, trackAtOffset | Where a dragged clip lands (D-22): which track, and whether it fits there. |
| `./components/forge/timeline/ruler` | ui/src/components/forge/timeline/ruler.ts | module | RulerStep, RulerTick, ZoomLimits, clockLabel, defaultPxPerFrame, rulerStep, rulerTicks, speedLabel, +1 | A ruler step from {@linkcode rulerStep}. |
| `./components/forge/timeline/safe-area` | ui/src/components/forge/timeline/safe-area.ts | module | FRAME_GUIDES, OverlayRect, SAFE_AREA_PRESETS, SafeAreaSpec, fitAspect, guideRect, insetRect, safeAreas | A rectangle in the overlay's layout coordinates. |
| `./components/forge/timeline/shuttle` | ui/src/components/forge/timeline/shuttle.ts | module | DEFAULT_SHUTTLE_LADDER, assertLadder, shuttleLabel, shuttleRate | J/K/L shuttle (D-09). |
| `./components/forge/timeline/time` | ui/src/components/forge/timeline/time.ts | module | FrameRate, SAMPLE_RATE_RANGE, TimeFormat, assertSampleRate, formatSampleClock, formatTime, fps, framesToSamples, +7 | Lowest and highest sample rates accepted, in Hz. |
| `./components/forge/timeline/track-stack` | ui/src/components/forge/timeline/track-stack.ts | module | stackMoveTarget, stackOrder | Track order for `OverlayAndEffectsTrackStack` (D-31): overlay tracks on top, then video, then audio, each group in the host's order. |
| `./components/forge/timeline/transition-presets` | ui/src/components/forge/timeline/transition-presets.ts | module | TRANSITION_KINDS, TransitionDiagram, TransitionKindInfo, filterTransitionKinds, transitionDiagram | Transition kinds for `TransitionPresetBrowser` (D-37). |
| `./components/forge/timeline/transitions` | ui/src/components/forge/timeline/transitions.ts | module | AUDIO_CROSSFADE, TimelineCut, TimelineTransition, TransitionRequest, TransitionTarget, clampTransitionFrames, clipsOfCut, cutsOf, +4 | A transition centered on the cut between two touching clips (D-23). |
| `./components/forge/timeline/trim-modes` | ui/src/components/forge/timeline/trim-modes.ts | module | ClipGeometry, TRIM_MODE_PROBLEM_TEXT, TrimModePreview, TrimModeProblem, nextTouching, previousTouching, rippleDeletePreview, rippleTracks, +10 | Slip, slide, roll and ripple trim (D-21), as pure previews. |
| `./components/forge/timeline/viewport` | ui/src/components/forge/timeline/viewport.ts | module | FrameRange, TimelineViewport, clampViewport, fitRange, followPlayhead, frameToX, minimapScroll, minimapWindow, +5 | The visible slice of a timeline: which frame is at the left edge and how many pixels a frame takes. |
| `./components/forge/timeline/waveform-cache` | ui/src/components/forge/timeline/waveform-cache.ts | module | WaveformResource, createWaveformCache, mediaProviderId, sharedWaveformCache | Source peaks only. |
| `./components/forge/vector/FillStrokeInspector` | ui/src/components/forge/vector/FillStrokeInspector.tsx | component | FillStrokeInspector, PaintSwatch (props: FillStrokeInspectorProps) | A color the host offers as a swatch. |
| `./components/forge/vector/GradientOnCanvasHandles` | ui/src/components/forge/vector/GradientOnCanvasHandles.tsx | component | GradientOnCanvasHandles (props: GradientOnCanvasHandlesProps) | Props for {@linkcode GradientOnCanvasHandles}. |
| `./components/forge/vector/PenNodeEditor` | ui/src/components/forge/vector/PenNodeEditor.tsx | component | PEN_NODE_EDITOR_CAPABILITIES, PenNodeEditor, SetClosedIntent, SetPathNodeIntent (props: PenNodeEditorProps) | Source contract for hosts that require scoped, focus-preserving canvas edits. |
| `./components/forge/vector/ShapeBuilder` | ui/src/components/forge/vector/ShapeBuilder.tsx | component | ShapeBuilder (props: ShapeBuilderProps) | Props for {@linkcode ShapeBuilder}. |
| `./components/forge/vector/fill-stroke-model` | ui/src/components/forge/vector/fill-stroke-model.ts | module | ContentBounds, DASH_OFFSET_RANGE, DASH_PRESETS, DashParse, DashPreset, FILL_TYPES, FillType, MITER_RANGE, +14 | Paint and stroke editing rules for {@linkcode FillStrokeInspector} (B-23). |
| `./components/forge/vector/gradient-handles-model` | ui/src/components/forge/vector/gradient-handles-model.ts | module | FOCAL_LIMIT, GradientHandle, MIN_RADIUS, STOP_KEY_STEP, addStop, addStopAvailability, clampFocal, colorAt, +13 | Geometry for {@linkcode GradientOnCanvasHandles} (B-24): where each handle and stop sits, and the gradient that results from moving one. |
| `./components/forge/vector/pen-node-model` | ui/src/components/forge/vector/pen-node-model.ts | module | HandleSide, InsertNodeIntent, NODE_KINDS, NodeKindIntent, PEN_HANDLE_SIZE, PEN_INSERT_TOLERANCE, PEN_MAX_NODES, PEN_NODE_SIZE, +24 | Pure geometry and command planning for {@linkcode PenNodeEditor} (B-21). |
| `./components/forge/vector/shape-builder-model` | ui/src/components/forge/vector/shape-builder-model.ts | module | BOOLEAN_OPS, BooleanGroup, BuilderLayer, BuilderLayerKind, LayerId, booleanAvailability, booleanIds, booleanOpLabel, +4 | Rules and labels for {@linkcode ShapeBuilder} (B-22). |
| `./components/forge/vector/vector-types` | ui/src/components/forge/vector/vector-types.ts | module | AVAILABLE, Availability, BooleanOp, FillRule, GradientPaint, GradientStop, HandleOffset, IDENTITY_TRANSFORM, +35 | Engine-neutral vector contract shared by the vector-tools cluster ({@linkcode PathNode}, {@linkcode Subpath}, {@linkcode Paint}, {@linkcode  |
| `./components/forge/waveform` | ui/src/components/forge/waveform.ts | module | FULL_RANGE, WaveformBar, WaveformPeak, WaveformRange, assertWaveformRange, normalizePeak, peaksToBars, rangePosition, +3 | Display-only min/max extrema math adapted from the user's Nitro Forge draft media-ui WaveformLane/PR #25. |
| `./components/forms/choice-keys` | ui/src/components/forms/choice-keys.ts | module | ChoiceAxis, WebKey, arrowStep, domIsRTL, isModified, nextChoiceIndex, rovingStop, typeaheadIndex, +1 | Keyboard models shared by SegmentedControl, TabBar, Toolbar and Select. |
| `./components/forms/option-groups` | ui/src/components/forms/option-groups.ts | module | OptionGroup, flattenOptionGroups, validateOptionGroups | Options under a visible heading, as a select or dropdown shows them. |
| `./components/gestures/GestureHandlerDrag` | ui/src/components/gestures/GestureHandlerDrag.tsx | component | GestureHandlerDrag | RNGH 3 native recognizers; value ownership remains in the caller. |
| `./components/gestures/PanResponderDrag` | ui/src/components/gestures/PanResponderDrag.tsx | component | PanResponderDrag | Default {@linkcode DragTransport}: React Native's responder system. |
| `./components/gestures/drag-controller` | ui/src/components/gestures/drag-controller.ts | module | DragController, DragControllerCallbacks, createDragController | Callbacks for {@linkcode createDragController}. |
| `./components/gestures/drag-transport` | ui/src/components/gestures/drag-transport.ts | module | DragPoint, DragTransport, KeyEventLike, keyboardKey (props: DragTransportProps) | A point in page (web) or absolute window (native) coordinates. |
| `./components/html` | ui/src/components/html/semantic.web.tsx [variants: tsx] | component | Article, Aside, Footer, Header, Heading, HeadingLevel, Input, InputType, +7 (props: HeadingProps, InputProps, LinkProps) | Web fork: real `<main>`, `<header>`, `<nav>`, `<h2>`, `<a>`… through React Native Web's own element factory, the path RNW's View and Text us |
| `./components/layout/AdaptiveColumns` | ui/src/components/layout/AdaptiveColumns.tsx | component | AdaptiveColumn, AdaptiveColumns (props: AdaptiveColumnProps, AdaptiveColumnsProps) | App-owned space between columns and wrapped rows, in logical units. |
| `./components/layout/ContentFrame` | ui/src/components/layout/ContentFrame.tsx | component | ContentFrame (props: ContentFrameProps) | App-chosen reading/form/media width in logical layout units. |
| `./components/navigation/CollapsibleDrawer` | ui/src/components/navigation/CollapsibleDrawer.tsx | component | CollapsibleDrawer, DrawerDestination (props: CollapsibleDrawerProps) | Portable RN presentation for left-side native navigation. |
| `./components/navigation/drawer-model` | ui/src/components/navigation/drawer-model.ts | module | DrawerGeometry, DrawerGeometryInput, DrawerMode, drawerGeometry | A strictly controlled React Native Windows-compatible navigation fallback. |
| `./components/overlays/AnchoredPopover` | ui/src/components/overlays/AnchoredPopover.tsx | component | AnchoredPopover, PopoverTriggerState (props: PopoverAnchorProps, PopoverProps, PopoverTriggerProps) | Portable popover drawn with an RN `Modal`, placed by {@linkcode placePopover}. |
| `./components/overlays/CommandPalette` | ui/src/components/overlays/CommandPalette.tsx | component | CommandPalette, PaletteCommand (props: CommandPaletteProps) | Controlled. |
| `./components/overlays/CommandPopover` | ui/src/components/overlays/CommandPopover.tsx | component | CommandMenuItem, CommandPopover (props: CommandPopoverProps) | Use the usable nonoccluded regions from the foldable layout owner; never infer a hinge from width. |
| `./components/overlays/anchored-popover-types` | ui/src/components/overlays/anchored-popover-types.ts | module | PopoverTriggerState, isTriggerPopover, popoverTriggerState, renderPopoverTrigger (props: PopoverAnchorProps, PopoverBaseProps, PopoverProps) | Handed to a trigger render function. |
| `./components/overlays/command-filter` | ui/src/components/overlays/command-filter.ts | module | PaletteCommand, filterCommands, nextActiveCommand, normalizeSearchText, reconcileActiveCommand, validateCommands | A CommandPopover item plus the fields only search needs. |
| `./components/overlays/focus-cycle` | ui/src/components/overlays/focus-cycle.ts | module | cycleFocusIndex, cycleFocusTarget | Tab and Shift+Tab inside an open overlay. |
| `./components/overlays/focus-restore` | ui/src/components/overlays/focus-restore.ts | module | useRestoreFocus | Restore the web opener after close or conditional unmount without replacing a newer focus choice. |
| `./components/overlays/measure-anchor` | ui/src/components/overlays/measure-anchor.ts | module | MeasurableView, measureAnchor, windowRegions | A host view that can report its frame in window coordinates (RN and RN web both can). |
| `./components/overlays/popover-position` | ui/src/components/overlays/popover-position.ts | module | PopupPosition, Rect2D, hasUsableRegion, placePopover, placementSide | Compatibility entry; pure placement is shared with isolated native hosts. |
| `./components/overlays/useTriggerAnchor` | ui/src/components/overlays/useTriggerAnchor.ts | module | TriggerAnchor, useTriggerAnchor | What {@linkcode useTriggerAnchor} returns: the ref to put on the trigger wrapper and its last measured frame. |
| `./components/shell/AdaptiveDock` | ui/src/components/shell/AdaptiveDock.tsx | component | AdaptiveDock, DockEdge, DockLayout, DockPanel, DockStack, DockTarget, FloatingPanel (props: AdaptiveDockProps) | One panel an {@linkcode AdaptiveDock} can place. |
| `./components/shell/AssetBrowser` | ui/src/components/shell/AssetBrowser.tsx | component | AssetBrowser, AssetEntry, AssetLocation, AssetRequest, AssetSort (props: AssetBrowserProps) | A fixed viewport in points, or the available height of a bounded parent. |
| `./components/shell/ContextMenu` | ui/src/components/shell/ContextMenu.tsx | component | CommandMenuItem, ContextMenu, ContextMenuSource, isContextMenuKey, pointAnchor (props: ContextMenuProps) | How a {@linkcode ContextMenu} was opened, for apps that log or adapt to it. |
| `./components/shell/ContextualToolbar` | ui/src/components/shell/ContextualToolbar.tsx | component | ContextualToolbar, ContextualToolbarItem (props: ContextualToolbarProps) | An action shown by {@linkcode ContextualToolbar}. |
| `./components/shell/DocumentTabBar` | ui/src/components/shell/DocumentTabBar.tsx | component | DocumentTab, DocumentTabBar, activeAfterClose, moveDocument (props: DocumentTabBarProps) | Props for {@linkcode DocumentTabBar}. |
| `./components/shell/FindReplaceContent` | ui/src/components/shell/FindReplaceContent.tsx | component | FindDocument, FindMatch, FindQuery, FindReplaceContent, FindResponse, ReplaceRequest (props: FindReplaceContentProps) | Provider-backed search UI. |
| `./components/shell/FindReplacePopover` | ui/src/components/shell/FindReplacePopover.tsx | component | FindReplacePopover (props: FindReplaceContentProps, FindReplacePopoverProps) | Portable anchored search. |
| `./components/shell/FocusAndA11yLayer` | ui/src/components/shell/FocusAndA11yLayer.tsx | component | A11yPreferences, FocusAndA11yLayer, InputModality, Politeness, motionDuration, useA11yPreferences, useAnnounce (props: FocusAndA11yLayerProps) | Props for {@linkcode FocusAndA11yLayer}. |
| `./components/shell/HistoryPanel` | ui/src/components/shell/HistoryPanel.tsx | component | HistoryEntry, HistoryJump, HistoryPanel (props: HistoryPanelProps) | Controlled history. |
| `./components/shell/InspectorPanel` | ui/src/components/shell/InspectorPanel.tsx | component | InspectorPanel, InspectorSelection (props: InspectorPanelProps) | Props for {@linkcode InspectorPanel}. |
| `./components/shell/InspectorSearch` | ui/src/components/shell/InspectorSearch.tsx | component | InspectorSearch, matchesQuery (props: InspectorSearchProps) | Props for {@linkcode InspectorSearch}. |
| `./components/shell/InspectorSection` | ui/src/components/shell/InspectorSection.tsx | component | InspectorSection (props: InspectorSectionProps) | Props for {@linkcode InspectorSection}. |
| `./components/shell/KeyboardShortcutHUD` | ui/src/components/shell/KeyboardShortcutHUD.tsx | component | Binding, ChordRecorder, KeyChord, KeyboardShortcutHUD, ShortcutCommand, bindingFromChord, commandForChord, isApplePlatform (props: KeyboardShortcutHUDProps) | Props for {@linkcode KeyboardShortcutHUD}. |
| `./components/shell/MenuButton` | ui/src/components/shell/MenuButton.tsx | component | CommandMenuItem, MenuButton (props: MenuButtonProps) | Props for {@linkcode MenuButton}. |
| `./components/shell/NumericScrubField` | ui/src/components/shell/NumericScrubField.tsx | tsx-model | NumericScrubField (props: NumericScrubFieldProps) | Canonical shell name for the shared precision scrubber. |
| `./components/shell/PaneSplitter` | ui/src/components/shell/PaneSplitter.tsx | component | PaneSplitter, SplitAxis (props: PaneSplitterProps) | Props for {@linkcode PaneSplitter}. |
| `./components/shell/PresetGallery` | ui/src/components/shell/PresetGallery.tsx | component | Preset, PresetFilter, PresetGallery (props: PresetGalleryProps) | One preset in a {@linkcode PresetGallery}. |
| `./components/shell/PropertyRow` | ui/src/components/shell/PropertyRow.tsx | component | PropertyEditorState, PropertyOverride, PropertyRow (props: PropertyRowProps) | What a {@linkcode PropertyRow} tells its editor. |
| `./components/shell/RangeSlider` | ui/src/components/shell/RangeSlider.tsx | component | RangeSlider, RangeThumb, RangeValue (props: RangeSliderProps) | Props for {@linkcode RangeSlider}. |
| `./components/shell/RibbonTabs` | ui/src/components/shell/RibbonTabs.tsx | component | RibbonButton, RibbonCommand, RibbonGallery, RibbonGalleryItem, RibbonGroup, RibbonSplit, RibbonTab, RibbonTabs (props: RibbonTabsProps) | Props for {@linkcode RibbonTabs}. |
| `./components/shell/RotaryKnob` | ui/src/components/shell/RotaryKnob.tsx | component | KnobInput, RotaryKnob (props: RotaryKnobProps) | How pointer travel maps to a {@linkcode RotaryKnob} value. |
| `./components/shell/SliderField` | ui/src/components/shell/SliderField.tsx | component | SliderField (props: SliderFieldProps) | Props for {@linkcode SliderField}. |
| `./components/shell/SplitButton` | ui/src/components/shell/SplitButton.tsx | component | SplitButton (props: SplitButtonProps) | Props for {@linkcode SplitButton}. |
| `./components/shell/StatusBar` | ui/src/components/shell/StatusBar.tsx | component | SelectionNoun, StatusActivity, StatusBar, StatusUnits, StatusZoom (props: StatusBarProps) | Zoom readout and controls for {@linkcode StatusBar}. |
| `./components/shell/ToastAndProgress` | ui/src/components/shell/ToastAndProgress.tsx | component | JobAction, ProgressJob, ToastAndProgress, ToastMessage (props: ToastAndProgressProps) | Controlled notifications and real job reports. |
| `./components/shell/ToolRail` | ui/src/components/shell/ToolRail.tsx | component | RailTool, RailToolVariant, ToolIcon, ToolRail, shownVariantId, toolIsActive (props: ToolRailProps) | Props for {@linkcode ToolRail}. |
| `./components/shell/UnitInput` | ui/src/components/shell/UnitInput.tsx | component | UnitContext, UnitDimension, UnitInput, UnitName (props: UnitInputProps) | Props for {@linkcode UnitInput}. |
| `./components/shell/WorkspaceHost` | ui/src/components/shell/WorkspaceHost.tsx | component | DockLayout, DockPanel, WorkspaceDocument, WorkspaceHost, WorkspaceHostMode, WorkspaceMode (props: WorkspaceHostProps) | A {@linkcode WorkspaceMode} with an optional tab icon. |
| `./components/shell/WorkspacePresetSwitcher` | ui/src/components/shell/WorkspacePresetSwitcher.tsx | component | WorkspacePreset, WorkspacePresetSwitcher (props: WorkspacePresetSwitcherProps) | Props for {@linkcode WorkspacePresetSwitcher}. |
| `./components/shell/a11y-audit` | ui/src/components/shell/a11y-audit.ts | module | A11yAuditOptions, A11yIssue, A11yRule, auditAccessibility | A static screen-reader audit over a rendered element tree: the plain `{type, props}` objects a test renderer or a mocked `jsx` produces. |
| `./components/shell/a11y-model` | ui/src/components/shell/a11y-model.ts | module | A11yPreferences, A11yState, A11yStore, Announcement, InputModality, Politeness, initialA11yState, modalityAfterKey, +2 | How the person last moved focus: by keyboard or by pointer (mouse, touch, pen). |
| `./components/shell/asset-browser-model` | ui/src/components/shell/asset-browser-model.ts | module | AssetEntry, AssetLocation, AssetRequest, AssetSort, assetDisplayName, filterAssets, formatAssetBytes, selectAsset | Preserve valid whitespace-only filenames while making them visible. |
| `./components/shell/contextual-toolbar-model` | ui/src/components/shell/contextual-toolbar-model.ts | module | OverflowInput, OverflowSplit, ToolbarItemSpec, itemsForSelection, overflowDescription, splitOverflow, validateToolbarItems | One control a {@linkcode ContextualToolbar} may show. |
| `./components/shell/dock-model` | ui/src/components/shell/dock-model.ts | module | DockDefaults, DockEdge, DockLayout, DockStack, DockTarget, FloatingPanel, activatePanel, clampFloatingRect, +7 | A docking edge of an {@linkcode AdaptiveDock}. |
| `./components/shell/document-tabs-model` | ui/src/components/shell/document-tabs-model.ts | module | DocumentTab, activeAfterClose, documentTabLabel, moveDocument, validateDocumentTabs | One open document in a {@linkcode DocumentTabBar}. |
| `./components/shell/find-replace-model` | ui/src/components/shell/find-replace-model.ts | module | FindDocument, FindMatch, FindQuery, FindResponse, ReplaceRequest, findLiteralText, literalSearchToken, replaceLiteralText, +1 | UTF-16 offsets, matching React Native text selection. |
| `./components/shell/history-model` | ui/src/components/shell/history-model.ts | module | HistoryEntry, HistoryJump, validateHistory | Zero is the initial state; N is the state after entry N-1. |
| `./components/shell/inspector-context` | ui/src/components/shell/inspector-context.ts | module | InspectorPanelContext, InspectorPanelContextValue, InspectorSectionContext, InspectorSectionContextValue | Provided by {@linkcode InspectorPanel} to its sections and rows. |
| `./components/shell/inspector-model` | ui/src/components/shell/inspector-model.ts | module | InspectorRegistry, InspectorRegistryState, InspectorRowEntry, InspectorSelection, matchSummary, matchesQuery, matchingRowCount, registerRow, +1 | What the inspector is showing properties for. |
| `./components/shell/keyboard-map` | ui/src/components/shell/keyboard-map.ts | module | KeyDispatchContext, KeyboardMap, KeyboardMapConflict, KeyboardMapEntry, NativeKeyBinding, ReservedBindingIssue, createKeyboardMap, isTextEditingBinding, +2 | One command in a {@linkcode KeyboardMap}. |
| `./components/shell/preset-model` | ui/src/components/shell/preset-model.ts | module | PresetFilter, PresetLike, filterPresets, galleryColumns, gridFocusTarget, validatePresets | Which presets a {@linkcode PresetGallery} shows. |
| `./components/shell/progress-model` | ui/src/components/shell/progress-model.ts | module | JobAction, ProgressJob, ToastMessage, jobActionLabel, validateFeedback |  |
| `./components/shell/ribbon-model` | ui/src/components/shell/ribbon-model.ts | module | RibbonButton, RibbonCommand, RibbonGallery, RibbonGalleryItem, RibbonGroup, RibbonSplit, RibbonTab, inlineGalleryItems, +2 | A plain command button. |
| `./components/shell/screen-reader-focus` | ui/src/components/shell/screen-reader-focus.ts | module | focusForScreenReader | Moves the screen reader's cursor to `target`, e.g. |
| `./components/shell/shell-keys` | ui/src/components/shell/shell-keys.ts | module | ShellAxis, ShellKey, arrowStep, nodeIsRTL, rovingTarget, shellKey | Keyboard helpers shared by the studio shell controls. |
| `./components/shell/shortcut-model` | ui/src/components/shell/shortcut-model.ts | module | Binding, ChordRecorder, KeyChord, ShortcutCommand, bindingFromChord, bindingKeycaps, bindingSpoken, commandForChord, +4 | Key bindings as portable strings: modifiers in a fixed order, then the key, joined by "+", e.g. |
| `./components/shell/slider-model` | ui/src/components/shell/slider-model.ts | module | RangeConfig, RangeThumb, RangeValue, SliderKeyAction, angleAround, applySliderKey, fractionOf, knobAngle, +7 | Snapped value under a point on a slider track. |
| `./components/shell/splitter-model` | ui/src/components/shell/splitter-model.ts | module | HingeBand, SplitAxis, SplitLayout, SplitLimits, hingeBands, mirrorBands, resolveSplit, sizeForEdge, +2 | Direction the panes of a {@linkcode PaneSplitter} are laid out in. |
| `./components/shell/status-model` | ui/src/components/shell/status-model.ts | module | SelectionNoun, StatusActivity, activityAnnouncement, formatElapsed, formatZoom, progressPercent, selectionSummary, stepZoom | What the document is doing right now, as shown by {@linkcode StatusBar}. |
| `./components/shell/tool-rail-model` | ui/src/components/shell/tool-rail-model.ts | module | RailTool, RailToolVariant, ToolIcon, shownVariantId, toolIsActive, validateRailTools | Icon content, or a function that draws it for the active and resting states. |
| `./components/shell/unit-expression` | ui/src/components/shell/unit-expression.ts | module | UNITS, UNIT_EXPRESSION_LIMITS, UnitContext, UnitDimension, UnitName, UnitParseResult, convertFromBase, formatUnitValue, +3 | Bounded unit arithmetic for {@linkcode UnitInput}. |
| `./components/shell/workspace-model` | ui/src/components/shell/workspace-model.ts | module | MODE_SHORTCUT_COUNT, ShortcutKey, WorkspaceDocument, WorkspaceMode, documentLabel, layoutForMode, modeAnnouncement, modeShortcutIndex, +3 | The one document a {@linkcode WorkspaceHost} edits. |
| `./components/shell/workspace-preset-model` | ui/src/components/shell/workspace-preset-model.ts | module | BUILT_IN_PRESET_IDS, BuiltInPresetId, MAX_WORKSPACE_PRESETS, PRESET_NAME_MAX, PresetActions, PresetNameProblem, WorkspacePreset, copyName, +5 | Bounded size of a workspace preset menu. |
| `./components/theme/NightScope` | ui/src/components/theme/NightScope.tsx | component | NightScope (props: NightScopeProps) | Props for {@linkcode NightScope}. |
| `./components/window/WindowTitleBar` | ui/src/components/window/WindowTitleBar.tsx | component | CAPTION_TARGET_WIDTH, CONTROL_TARGET, TITLE_BAR_HEIGHT, WindowTitleBar, useWindowChrome (props: WindowTitleBarProps) | Bar height and minimum hit height, in logical points. |

### @nyc-tron/windows-fluent (3 subpaths)

| subpath | source | kind | exports (non-type names shown first; Props types in parens) | purpose (first doc line) |
|---|---|---|---|---|
| `.` | windows-fluent/src/index.ts | module | WindowsDestination, WindowsNativeNavigationEvent, WindowsNativeNavigationTransport, WindowsNavigationCallbacks, WindowsNavigationController, WindowsNavigationState, WindowsPaneMode, createWindowsNavigationController, +1 |  |
| `./controller` | windows-fluent/src/controller.ts | module | WindowsNavigationCallbacks, WindowsNavigationController, createWindowsNavigationController | Route selection is committed by the app, not this native shell. |
| `./types` | windows-fluent/src/types.ts | module | WindowsDestination, WindowsNativeNavigationEvent, WindowsNativeNavigationTransport, WindowsNavigationState, WindowsPaneMode, validateWindowsNavigationState | App-owned navigation state is separate from the WinUI control. |
## Appendix B. ui non-forge-subfolder file edges (relative imports, extension stripped; paths relative to packages/ui/src/components)

```
Button -> styles
Card -> styles
DragGrabHandle -> gestures/drag-controller, gestures/drag-transport, gestures/PanResponderDrag, styles
FieldGroup -> styles
IconButton -> styles
List -> styles
NavigationRail -> styles
SegmentedControl -> styles, forms/choice-keys
Select -> styles, forms/choice-keys, forms/option-groups
TabBar -> styles, forms/choice-keys
TextField -> styles
Toolbar -> styles, forms/choice-keys
content/KeyValueList -> styles
data/DataTable -> styles, data/table-layout
data/TreeGrid -> data/tree-grid, data/tree-row-heights, styles
feedback/Badge -> styles
feedback/Banner -> styles, feedback/glyphs
feedback/EmptyState -> Button, styles
feedback/ErrorMessage -> styles, feedback/glyphs
feedback/glyphs -> styles
files/DropZone.native -> files/drop-model, files/DropZone.shared, files/DropZone.types
files/DropZone.shared -> styles
files/DropZone.web -> files/drop-model, files/DropZone.shared, files/FilePicker.web, files/DropZone.types
files/FileImportExportSheet.native -> files/FilePicker.native, files/FileImportExportSheet.shared, files/file-transfer-model
files/FileImportExportSheet.shared -> overlays/popover-position, overlays/focus-restore, shell/shell-keys, Button, TextField, styles, files/FilePicker.types, files/file-transfer-model
files/FileImportExportSheet.web -> files/FilePicker.web, files/FileImportExportSheet.shared, files/file-transfer-model
files/FilePicker.native -> styles, files/FilePicker.types
files/FilePicker.web -> styles, files/FilePicker.types
forge/ColorChannels -> styles, forge/color
forge/NativeSeekBar.native -> forge/NativeSeekBar.shared, forge/NativeSeekBar.types
forge/NativeSeekBar.shared -> Button, styles, forge/timebase, forge/NativeSeekBar.types, forge/inputs/useScopedControl
forge/NativeSeekBar.types -> forge/timebase
forge/NativeSeekBar.web -> forge/NativeSeekBar.shared, forge/NativeSeekBar.types
forge/SpreadsheetGrid -> gestures/editor-interaction-scope, forge/spreadsheet/FormulaBar, forge/inputs/useScopedControl, feedback/ErrorMessage, forge/sheet-window, forge/range-tsv, forge/range-paste, forge/cell-commit, styles, forge/spreadsheet/reference-colors, forge/spreadsheet/fill-handle, gestures/drag-transport, gestures/PanResponderDrag
forge/WaveformLane -> forge/waveform-gesture, forge/inputs/useScopedControl, feedback/ErrorMessage, styles, forge/waveform
forge/formula-refs -> forge/sheet-window
forge/range-paste -> forge/sheet-window
forge/range-tsv -> forge/sheet-window
forge/waveform-gesture -> forge/waveform
gestures/GestureHandlerDrag -> gestures/drag-transport
gestures/PanResponderDrag -> gestures/drag-transport, gestures/pan-responder-config
gestures/drag-controller -> gestures/drag-transport
gestures/gesture-handler-config -> gestures/drag-transport
gestures/pan-responder-config -> gestures/drag-transport
gestures/useEditorPan -> forge/canvas/canvas-gesture-relations
gestures/useLocalPointer -> gestures/local-pointer, gestures/editor-interaction-scope
html/Input -> styles, html/types
html/semantic.native -> html/types, html/Input
html/semantic.web -> html/types, html/Input
navigation/CollapsibleDrawer -> navigation/drawer-model, styles
overlays/AnchoredPopover -> overlays/popover-position, overlays/focus-cycle, overlays/focus-restore, overlays/useTriggerAnchor, overlays/measure-anchor, overlays/anchored-popover-types, styles
overlays/CommandPalette -> TextField, styles, overlays/popover-position, overlays/focus-cycle, overlays/focus-restore, overlays/command-filter
overlays/CommandPopover -> overlays/popover-position, overlays/focus-cycle, overlays/focus-restore, styles
overlays/anchored-popover-types -> overlays/popover-position
overlays/command-filter -> overlays/CommandPopover
overlays/measure-anchor -> overlays/popover-position
overlays/useTriggerAnchor -> overlays/measure-anchor, overlays/popover-position
shell/AdaptiveDock -> DragGrabHandle, overlays/popover-position, styles, shell/MenuButton, shell/PaneSplitter, shell/shell-keys, shell/dock-model
shell/AssetBrowser -> Button, Select, feedback/ErrorMessage, shell/InspectorSearch, shell/shell-keys, shell/useOwnedAction, styles, shell/asset-browser-model
shell/ContextMenu -> overlays/CommandPopover, overlays/popover-position, shell/shell-keys
shell/ContextualToolbar -> Toolbar, styles, forge/toggle-a11y, shell/MenuButton, shell/contextual-toolbar-model
shell/DocumentTabBar -> styles, shell/shell-keys, shell/document-tabs-model
shell/FindReplaceContent -> Button, feedback/ErrorMessage, forge/canvas/SettingSwitch, styles, shell/useOwnedAction, shell/find-replace-model
shell/FindReplacePopover -> overlays/AnchoredPopover, shell/FindReplaceContent
shell/FocusAndA11yLayer -> shell/a11y-model
shell/HistoryPanel -> Button, feedback/ErrorMessage, styles, shell/history-model, shell/useOwnedAction
shell/InspectorPanel -> styles, shell/inspector-context, shell/inspector-model, shell/InspectorSearch
shell/InspectorSearch -> styles, shell/shell-keys, shell/inspector-model
shell/InspectorSection -> styles, shell/inspector-context, shell/inspector-model
shell/KeyboardShortcutHUD -> overlays/popover-position, overlays/focus-restore, styles, shell/InspectorSearch, shell/inspector-model, shell/shell-keys, shell/shortcut-model
shell/MenuButton -> overlays/CommandPopover, overlays/popover-position, styles, shell/shell-keys
shell/NumericScrubField -> forge/inputs/PrecisionScrubber
shell/PaneSplitter -> gestures/drag-controller, gestures/drag-transport, gestures/PanResponderDrag, styles, shell/shell-keys, shell/splitter-model
shell/PresetGallery -> styles, shell/shell-keys, shell/preset-model
shell/PropertyRow -> styles, shell/inspector-context, shell/inspector-model
shell/RangeSlider -> forge/inputs/precision, gestures/drag-controller, gestures/drag-transport, gestures/PanResponderDrag, styles, shell/shell-keys, shell/slider-model, shell/UnitInput, shell/unit-expression
shell/RibbonTabs -> overlays/popover-position, styles, shell/MenuButton, shell/SplitButton, shell/shell-keys, shell/ribbon-model
shell/RotaryKnob -> forge/inputs/precision, gestures/drag-controller, gestures/drag-transport, gestures/PanResponderDrag, styles, shell/shell-keys, shell/slider-model, shell/UnitInput, shell/unit-expression
shell/SliderField -> forge/inputs/precision, gestures/drag-controller, gestures/drag-transport, gestures/PanResponderDrag, styles, shell/shell-keys, shell/slider-model, shell/UnitInput, shell/unit-expression
shell/SplitButton -> overlays/CommandPopover, overlays/popover-position, styles, shell/MenuButton
shell/StatusBar -> overlays/popover-position, styles, shell/MenuButton, shell/status-model
shell/ToastAndProgress -> Button, feedback/ErrorMessage, styles, shell/useOwnedAction, shell/progress-model
shell/ToolRail -> overlays/CommandPopover, overlays/popover-position, styles, shell/shell-keys, shell/tool-rail-model
shell/UnitInput -> styles, shell/MenuButton, shell/shell-keys, shell/unit-expression
shell/WorkspaceHost -> forge/announce, overlays/popover-position, styles, shell/AdaptiveDock, shell/dock-model, shell/shell-keys, shell/workspace-model
shell/WorkspacePresetSwitcher -> Button, TextField, forge/announce, overlays/popover-position, styles, shell/MenuButton, shell/workspace-preset-model
shell/dock-model -> overlays/popover-position
shell/inspector-context -> shell/inspector-model
shell/inspector-model -> overlays/command-filter
shell/keyboard-map -> shell/shortcut-model
shell/ribbon-model -> overlays/CommandPopover
shell/slider-model -> forge/inputs/precision
shell/useOwnedAction -> shell/action-owner
shell/workspace-model -> shell/dock-model
shell/workspace-preset-model -> shell/dock-model
useLocalStore -> local-store
window/WindowTitleBar -> styles
```
