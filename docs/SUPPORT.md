# Support policy

Applies to v1.0.0. Source of the tiers: [v1.0.0 decisions](V1_DECISIONS.md) D3.

## Candidate scope and verified behavior

The completion target retains iOS/iPadOS, Android, web, macOS, Windows,
visionOS, Quest and PICO. These are required program targets, not a claim that
each native adapter and device scenario has already passed. Exact candidate
results and limits are in the [verification report](completion/reports/V1-RELEASE-GATES.md).

| Area | Current evidence and limits |
|---|---|
| Web and shared TypeScript packages | Actual installed-tarball consumers, source/type/API gates, 686 browser instrument cases, and the four-flow reference app are verified at the reported candidate. |
| iOS SwiftUI and Android Compose | Actual clean-consumer native compilation and media/UI runtime gates are mandatory. Read their exact candidate receipts; a compile alone does not establish native behavior or physical-device acceptance. |
| Windows Fluent/Fabric adapter | The earlier NavigationView consumer passed native compilation, deployment and keyboard UI Automation in the RNW 0.85 lane. The new navigation transport and native window owner have their own installed-tarball gate; earlier runs do not validate these additions. This does not establish the RN 0.88 UI package on Windows, Narrator speech or physical input. |
| XR and Muse integration | Forge's optional Viro presentation adapter and observed Muse pose provider are implemented at pinned revisions. Their physical visionOS/Quest/PICO runtime and input/performance acceptance remain unverified. |
| AppKit/macOS adapter | Independent `@nyc-tron/macos-appkit` exports wrap Spark's native AppKit controls and window owner. An isolated consumer verifies package installation, native control classes and window lifecycle. Source and controller tests remain distinct from that native result and physical input/VoiceOver acceptance. |
| Native desktop windows | Windows and AppKit adapters drive the existing peer-free window registry with native create/close/focus/minimize/restore and display geometry. Each app owns its documents and close/drop decisions. Actual cross-window drag gestures and hardware display changes require their own evidence. |

All 341 source rows are implemented by their recorded owners: 332 local and
nine pinned external. Complete acceptance remains unverified across the eight
required platforms. The existing overlay proof is historical evidence for its
own targets and commits; current receipts do not certify screen-reader speech,
physical pen/fold/headset behavior or hardware performance.

## Three isolated runtime lanes

| Lane | React Native | Packages |
|---|---|---|
| Expo SDK 58 | 0.88 | `ui`, `expo-controls`, `native-controls`, `native-navigation`, `native-charts`, `hardware-keys`, `platform-services`, `reserved-regions` |
| React Native Windows 0.85 | 0.85.3 | `windows-fluent-fabric` (peers pin `react-native` `0.85.3` and `react-native-windows` `0.85.0`) |
| Spark 0.0.3 / Expo SDK 55 | 0.83.10, React Native macOS 0.83.0 | `macos-appkit` (React 19.2.0, Expo 55.0.32, Nitro Modules 0.37.0) |

These runtime lanes cannot share one React Native installation.
`@nyc-tron/ui` requires `react-native >=0.88.0`; `windows-fluent-fabric` pins
`react-native` `0.85.3`, and `macos-appkit` pins `0.83.10`. The Expo consumer
installer rejects both incompatible desktop adapters. Spark's Nitro 0.37.0
stays in its isolated package and is not an upgrade or downgrade of the Expo 58
or Forge Nitro v1 hosts.

Shared policies and compatible packages keep explicit boundaries:

- `@nyc-tron/core` and `@nyc-tron/geometry` have no peer dependencies.
- `@nyc-tron/icons` accepts `react-native >=0.85.0` (optional peer).
- `@nyc-tron/panes` accepts `react-native >=0.85.0`.
- `@nyc-tron/windows-fluent` has no peer dependencies; its WinUI 3 project
  (`windows/NYCTron.Fluent.WinUI3`) remains a standalone shell. The RNW adapter
  binds its typed navigation transport to the supported C++ Fabric host;
  it does not embed RNW Composition in the standalone C# shell.

Peer ranges above are read from each `package.json` at this commit. Running
`icons` or `panes` inside an RNW 0.85 app has not been tested.

## Expo install paths

Gate T4 item 1, run by [install-paths.yml](../.github/workflows/install-paths.yml)
on clean GitHub runners. The one command is in the
[README](../README.md#add-nyc-tron-ui-to-an-expo-app). On a pull request the
workflow packs core and ui from the checked-out commit; a manual run can
install a release's tarballs instead.

Run [43438355006](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43438355006)
(8f62ec3: main a6ac0b1 plus this branch; Node 24.19.0, `create-expo-app`
5.0.0, Expo 58.0.25, React Native 0.88.1). All nine jobs passed:

| Platform | New Expo app | Existing Expo app (default SDK 58 template) |
|---|---|---|
| Web | Pass: Button pressed twice in Chromium, `Pressed 2 times` | Pass: install with the template's gesture handler 3.3.0 kept, Button pressed twice, and a `GestureHandlerDrag` route pressed twice |
| iOS simulator | Pass: Release build, Maestro tapped `tron-button` and saw `Pressed 1 times` | Pass: same flow, opened from the template's Home by deep link, tapping the system "Open" prompt |
| Android emulator | Pass: release APK on an API 35 emulator, same assertion | Pass: same flow, opened from Home by deep link |
| macOS (Spark 0.0.3) | Pass: npm install with the scoped override below, standalone Spark build, `Button` mounted in the native app | Same app |
| Windows (RNW 0.85) | Pass: npm install with the scoped override below, RNW Release build, `Button` mounted in the native app | Same app |

Getting the existing-app route onto a device took two findings, both from
failed runs. In 43208989075 a link sent right after launch raced the app
(Android's reached the activity before JavaScript ran; iOS's "Open in app?"
prompt came about 29 s later than the flow looked for it), so the flow now
waits for the template's Home screen and, on iOS, for the prompt. In
43429832073 the link then arrived and the router stayed on Home on both
platforms. The template's native layout (`src/components/app-tabs.tsx`) is
an Expo Router `NativeTabs`, which renders only routes that have a
`NativeTabs.Trigger`, so an app that uses it needs one for the new route.
The install-path script adds that trigger after it checks that the install
changed only `package.json` and `package-lock.json`, and records the edit as
`screenWiring`. The web layout needs nothing.

Existing Expo 58 apps: Expo SDK 58 pins `react-native-gesture-handler
~3.3.0`. With `@nyc-tron/ui`'s optional peer at `>=3.4.0 <4` (the
`v1.0.0-rc.1` tarballs), npm refused the install with `ERESOLVE`. D5 decision
1 widened the peer to `>=3.3.0 <4`: `ui` uses no 3.4-only API, and the
[gesture-handler-floor](../.github/workflows/gesture-handler-floor.yml)
workflow type-checks `ui`, runs the pan validator test and the browser suite
against 3.3.x, and installs the packed archives into the default Expo 58
template. With the rc.1 tarballs, run `npx expo install
react-native-gesture-handler@^3.4.0` first.

Desktop apps: the desktop lanes are below ui's React Native floor; only
components on the lane's support list are supported. Spark 0.0.3 ships React
Native 0.83.10 and RNW 0.85 ships 0.85.3, and `ui` keeps `react-native
>=0.88` (D5). The documented install adds one override to the app's
`package.json`, scoped to `ui`'s `react-native` peer, and never uses
`--legacy-peer-deps`:

```json
"overrides": { "@nyc-tron/ui": { "react-native": "$react-native" } }
```

Without it npm fails with `ERESOLVE`, `peer react-native@">=0.88.0"`. The
Spark example's own manifest already overrides `react-native` globally to
0.83.10, which also satisfies the peer; the scoped entry is the documented
form. Spark's Runner and `spark build --dev` modes were not run with `ui`;
CI builds the standalone app only.

No example in this repository commits a generated native project: the Expo
consumers run `expo prebuild`, the Spark example commits only
`desktop.config.json` and JavaScript, and the RNW example's `windows/` host
is generated by `react-native init-windows` and edited by
`scripts/prepare-host.mjs` at build time. That script edits the generated
`.vcxproj`, `.sln` and `App.cpp` rather than using a config plugin; it is
the one native setup step not driven by a config plugin.

Evidence: earlier runs on the rc.1 tarballs, [install-paths-run-43171141013](completion/evidence/T4-desktop-ui-coverage-20261112/install-paths-run-43171141013) and [install-paths-run-43177509488](completion/evidence/T4-desktop-ui-coverage-20261112/install-paths-run-43177509488), where every existing-app path and both desktop lanes failed with `ERESOLVE`.

## Desktop support list

Decision: [v1.0.0 decisions](V1_DECISIONS.md) D5. `@nyc-tron/ui` keeps its
React Native `>=0.88` peer floor in 1.0.0, and on the desktop lanes it
supports only the components below. A struck component returns to a lane when
that lane's host ships React Native `>=0.88`, or when a lane-specific floor
is tested in the lane.

Measured on 2026-11-12 by the coverage harness in `tooling/desktop-lane/`:
each lane installs the packed `@nyc-tron/ui` archive into its own
archive-built consumer, bundles every public export with the lane's Metro
config, and mounts every exported component once with synthesized required
props in the native Release app. The same harness runs on React Native Web
with the same props to tell a lane failure from a props failure.

| Lane | Runtime | Archive (sha256) | Run | Supported | Struck | Not verified on desktop |
|---|---|---|---|---|---|---|
| macOS, Spark 0.0.3 | React Native 0.83.10, React Native macOS 0.83.0, Expo 55.0.32, React 19.2.0 | `f4b5a055…` (main a6ac0b1 + #69 at d92b1c1) | [43198587853](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43198587853) | 272 of 421 components | 54 | 95 |
| Windows, RNW 0.85 | React Native 0.85.3, React Native Windows 0.85.0, React 19.2.3 | `f4b5a055…` (main a6ac0b1 + #69 at d92b1c1) | [43198587705](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43198587705) | 272 of 421 components | 37 | 112 |

The Windows workflow run 43198587705 shows an overall conclusion of failure.
Its coverage job, "UI desktop coverage in the RNW 0.85 lane", succeeded and
produced the numbers above. The failing job is a different one, "VS 2026 RNW
0.85 XAML Fabric native C++ compile", in its step "Deploy the packaged
consumer the way run-windows does": `npm error code ETARGET`, `No matching
version found for @react-native-community/cli-clean@21.0.0`, a registry
resolution failure that is not in `@nyc-tron/ui` and not in the coverage
harness. The same job is green on 8f62ec3 (run 43438354753). Between d92b1c1
(where the lists were measured) and 8f62ec3 no file under
`tooling/desktop-lane`, `packages/ui`, `packages/windows-fluent` or
`tooling/macos-appkit` changed; the changes are the two workflows, the
install-path scripts, the README, SUPPORT.md, `desktop-support.json` and
the evidence folder. The lists therefore describe the code at 8f62ec3.

All 166 exports without components (hooks, models, helpers) load on both
lanes. The lists are in [desktop-support.json](desktop-support.json); the
full matrix is in [the evidence folder](completion/evidence/T4-desktop-ui-coverage-20261112).
The first T1-graph measurement (archive `c3d0f588…`, runs 43171140883 and
43171140885) and a pre-T1 one (Spark 0.0.2, archive `e3c46a80…`, runs
43169291107 and 43169294389) gave the same lists as each other. They differ
from this one only by the four Windows components fixed below. Both are
recorded beside this one and do not stand in for it.

- **Supported** means every bare import of the component's export resolved in
  the lane and the component mounted and committed without an error.
- **Struck** means the lane failed it: it needs an optional peer the lane's
  consumer does not provide, or it threw in the lane but mounted on the web
  reference.
- **Not verified on desktop** means it threw on the web reference too, with
  the same synthesized props, so the run says nothing about the lane either
  way. It is a third status, separate from struck: these components are not
  on the supported list, and nothing here strikes them. Each one returns when
  it is measured with a per-component props fixture; that work is not done.
  They do not block 1.0.0 (D5, decision 3 of 2026-11-12).

The measurement covers mount and first commit with required props only. It
does not cover interaction, optional props, layout fidelity, accessibility or
physical input on either lane.

| Optional peer the lane does not provide | Struck on macOS (Spark) | Struck on Windows (RNW) |
|---|---|---|
| `@expo/ui` | `forge/ColorChannels`, `forge/NativeSeekBar`, `forge/timeline/FrameAccurateScrubber` | same |
| `@expo/ui, expo-linear-gradient` | `forge/color/ColorPickerDialog`, `forge/color/HsvPicker` | same |
| `@tanstack/react-table` | `data/DataTable` | same |
| `expo-drag-drop-content-view` | `files/DropZone` | same |
| `react-native-gesture-handler` | `forge/audio/ChannelStrip`, `forge/audio/LevelFader`, `forge/audio/MixingConsole`, `forge/audio/PanAndBalanceControl`, `forge/audio/SpeechTranscriptTakeReview`, `forge/audio/StereoMultichannelWaveform`, `forge/audio/SurroundPanView`, `forge/audio/TakePlaylistAndComping`, `forge/audio/VerticalFader`, `forge/cad/Native3DViewport`, `forge/cad/NodeGraphCanvas`, `forge/cad/NodeLibrarySearch`, `forge/cad/TextureBrush3D`, `forge/cad/TransformGizmo3D`, `forge/cad/UVEditor`, `forge/canvas/CanvasPanZoom`, `forge/canvas/GuidedCropAndStraighten`, `forge/design/PrototypeConnectionTool`, `forge/document/InsertTableGrid`, `forge/document/ParagraphRuler`, `forge/graphics/ImageCropOverlay`, `forge/ink/BrushPresetBrowser`, `forge/inputs/PointEditor2D`, `forge/pdf/PDFInlineTextEdit`, `forge/pdf/PDFScanSession`, `forge/pdf/PDFThumbnailSidebar`, `forge/pdf/PageReorderOrganizer`, `forge/platform/AccessiblePrecisionScrubControl`, `forge/selection/SelectionBounds`, `forge/slides/PresenterInkOverlay`, `forge/slides/ShapePresetGallery`, `forge/spreadsheet/CellSelectionOverlay`, `forge/spreadsheet/FillHandleAndAutoFill` (AutoFillModePicker), `forge/spreadsheet/FillHandleAndAutoFill`, `forge/spreadsheet/PivotFieldList`, `forge/timeline/AutoCaptionTranscriptTimeline`, `forge/timeline/AutoReframeGuides`, `forge/timeline/CaptionWordTimingHandles`, `forge/timeline/MotionTrackingOverlay`, `forge/timeline/StickerMotionLane`, `gestures/GestureHandlerDrag` | `forge/audio/ChannelStrip`, `forge/audio/LevelFader`, `forge/audio/MixingConsole`, `forge/audio/PanAndBalanceControl`, `forge/audio/StereoMultichannelWaveform`, `forge/audio/VerticalFader`, `forge/cad/Native3DViewport`, `forge/cad/NodeLibrarySearch`, `forge/cad/TextureBrush3D`, `forge/cad/TransformGizmo3D`, `forge/cad/UVEditor`, `forge/canvas/CanvasPanZoom`, `forge/document/InsertTableGrid`, `forge/ink/BrushPresetBrowser`, `forge/inputs/PointEditor2D`, `forge/pdf/PDFInlineTextEdit`, `forge/pdf/PDFThumbnailSidebar`, `forge/pdf/PageReorderOrganizer`, `forge/selection/SelectionBounds`, `forge/slides/PresenterInkOverlay`, `forge/spreadsheet/FillHandleAndAutoFill` (AutoFillModePicker), `forge/spreadsheet/PivotFieldList`, `forge/timeline/MotionTrackingOverlay`, `gestures/GestureHandlerDrag` |
| `react-native-gesture-handler, react-native-skia` | `forge/ink/BrushStabilizationPreview`, `forge/ink/InkStrokePreview`, `forge/pdf/SignatureStampTool`, `forge/slides/InkAndLaserPointer` | same |
| `react-native-skia` | `forge/canvas/GPUCanvasViewport` | same |
| `uniwind` | `theme/NightScope` | same |

Struck on Windows only until d92b1c1, now supported: `forge/canvas-tools/GestureCustomizationPanel`, `forge/ink/BrushDynamicsInspector`, `forge/ink/TimelapsePlaybackExporter` and `forge/vector/FillStrokeInspector`. On the `c3d0f588…` archive (run 43171140885) each threw `Exception in HostFunction: Loss of precision during arithmetic conversion: (__int64) 0.1` (0.25 for TimelapsePlaybackExporter). All four render `PrecisionScrubber` with a fractional `min`. React Native parses `accessibilityValue` `min`/`max`/`now` as `int`, and React Native Windows does it with `folly::dynamic::asInt()`, which throws on a fraction. Off the web, `PrecisionScrubber` now passes the numeric range only when all three values are whole numbers; `aria-valuetext` still carries the exact value. Other controls that pass `aria-value*` were not audited for fractional values.

<details><summary>Not verified on desktop, either lane (95 components)</summary>

`forge/audio/AudioClipTrimAndFade`, `forge/audio/AudioEffectsPresetPanel`, `forge/audio/AudioProcessingPanel`, `forge/audio/DynamicsTransferGraph`, `forge/audio/EQFrequencyGraph`, `forge/audio/LiveRecordingWaveform`, `forge/audio/LoopPunchRecording`, `forge/audio/SampleEditor`, `forge/audio/VoiceoverCountdownAndTakeBin`, `forge/cad/BakingMapPanel`, `forge/cad/PaperSpaceLayout`, `forge/cad/TextureMaskAndGenerator`, `forge/canvas/SmartGuides`, `forge/canvas/TransformOriginHandle`, `forge/color/CurvesEditor`, `forge/color/EyedropperTool`, `forge/color/GradientMeshEditor`, `forge/color/GradientStopEditor`, `forge/color/LevelsEditor`, `forge/color/LiveHistogram`, `forge/color/VideoScopesPanel`, `forge/design/CommentPins`, `forge/design/ComponentVariantPicker`, `forge/design/FrameAndComponentTree`, `forge/document/MailMergeFieldPicker`, `forge/document/PageSetupPanel`, `forge/document/PaginatedTextCanvas`, `forge/document/ParagraphStylesGallery`, `forge/document/SpellGrammarPopover` (SpellGrammarContent), `forge/document/TextWrapAndFrames`, `forge/graph/PatchGraph`, `forge/ink/EraserModePicker`, `forge/inputs/InstrumentKnob`, `forge/inputs/OutlineTree`, `forge/inputs/PrecisionScrubber`, `forge/inputs/PropertyInspector`, `forge/layers/CanvasCompareView`, `forge/layers/LayerThumbnail`, `forge/midi/MIDIPianoRoll`, `forge/midi/MIDIVelocityLane`, `forge/midi/StepSequencer`, `forge/motion/CameraAndLightControls`, `forge/motion/CompositionLayerTree`, `forge/motion/EffectStackAndInspector`, `forge/motion/KeyframeSpeedGraph`, `forge/motion/KeyframeValueGraph`, `forge/motion/MatteAndMaskPanel`, `forge/motion/MotionKeyframeTimeline`, `forge/motion/NodeGraphEditor`, `forge/motion/TimeRemapCurve`, `forge/pdf/BookmarkOutline`, `forge/pdf/PDFFormFieldEditor`, `forge/pdf/PDFReadAloudTransport`, `forge/pdf/PDFVoiceNoteAttachment`, `forge/pdf/PrintAndExportPreview`, `forge/pdf/TextSearchResults`, `forge/photo/BeforeAfterCompare`, `forge/photo/CatalogFilterBar`, `forge/photo/EightBandColorMixer`, `forge/photo/ExposureAndWhiteBalance`, `forge/photo/LinearRadialGradientMask`, `forge/photo/PhotoVersionHistoryBrowser`, `forge/photo/PresetManager`, `forge/photo/RAWDevelopPanel`, `forge/slides/MasterLayoutEditor`, `forge/slides/MediaInsertInspector`, `forge/slides/PresenterView`, `forge/slides/ThemeAndTemplateGallery`, `forge/spreadsheet/CellFormatInspector`, `forge/spreadsheet/ConditionalFormatRules`, `forge/spreadsheet/DataImportWizard`, `forge/spreadsheet/RangeComments`, `forge/timeline/AudioClipWaveform`, `forge/timeline/BatchEditPanel`, `forge/timeline/ClipTrimHandles`, `forge/timeline/CoverFramePicker`, `forge/timeline/DragReorderAndRipple`, `forge/timeline/OverlayAndEffectsTrackStack`, `forge/timeline/RazorSplitTool`, `forge/timeline/RollSlipSlideControls`, `forge/timeline/ScopesDock`, `forge/timeline/TimelineClipLane`, `forge/timeline/TrackHeaders`, `forge/timeline/TransitionHandles`, `forge/timeline/VideoEffectsBrowser`, `forge/timeline/VideoSpeedRampCurve`, `forge/vector/GradientOnCanvasHandles`, `gestures/PanResponderDrag`, `shell/NumericScrubField`, `shell/RangeSlider`, `shell/RibbonTabs`, `shell/RotaryKnob`, `shell/SliderField`, `shell/ToastAndProgress`, `shell/WorkspaceHost`

</details>

<details><summary>Not verified on desktop, Windows only (17 components; struck on macOS for a missing peer)</summary>

`forge/audio/SpeechTranscriptTakeReview`, `forge/audio/SurroundPanView`, `forge/audio/TakePlaylistAndComping`, `forge/cad/NodeGraphCanvas`, `forge/canvas/GuidedCropAndStraighten`, `forge/design/PrototypeConnectionTool`, `forge/document/ParagraphRuler`, `forge/graphics/ImageCropOverlay`, `forge/pdf/PDFScanSession`, `forge/platform/AccessiblePrecisionScrubControl`, `forge/slides/ShapePresetGallery`, `forge/spreadsheet/CellSelectionOverlay`, `forge/spreadsheet/FillHandleAndAutoFill`, `forge/timeline/AutoCaptionTranscriptTimeline`, `forge/timeline/AutoReframeGuides`, `forge/timeline/CaptionWordTimingHandles`, `forge/timeline/StickerMotionLane`

</details>

<details><summary>Supported on both desktop lanes (272 components)</summary>

`.` (Button), `.` (Card), `.` (NavigationRail), `.` (NavigationShell), `.` (TextField), `Button`, `Card`, `DragGrabHandle`, `FieldGroup`, `FieldGroup` (FieldSection), `IconButton`, `List`, `List` (ListItem), `NavigationRail`, `NavigationRail` (NavigationShell), `SegmentedControl`, `Select`, `TabBar`, `TextField`, `Toolbar`, `content/KeyValueList`, `data/TreeGrid`, `feedback/Badge`, `feedback/Banner`, `feedback/EmptyState`, `feedback/ErrorMessage`, `files/FileImportExportSheet`, `files/FilePicker`, `forge/SpreadsheetGrid`, `forge/WaveformLane`, `forge/audio/AudioInterruptionRecoveryDialog`, `forge/audio/AudioPreview`, `forge/audio/AudioVideoSync`, `forge/audio/AutoDuckEnvelopePanel`, `forge/audio/AutomationLane`, `forge/audio/AutomationModePicker`, `forge/audio/BeatDetectionMarkerLane`, `forge/audio/BusAndRoutingMatrix`, `forge/audio/ClipGainEnvelope`, `forge/audio/DeviceAndChannelPicker`, `forge/audio/InputMonitorToggle`, `forge/audio/InsertEffectRack`, `forge/audio/LatencyCalibrationPanel`, `forge/audio/LevelMeter`, `forge/audio/LoudnessMeter`, `forge/audio/MixGroupBar`, `forge/audio/NativeAudioTransport`, `forge/audio/NoiseReductionMonitor`, `forge/audio/PanControl`, `forge/audio/PluginPresetBrowser`, `forge/audio/RealtimePeakMeter`, `forge/audio/RecordingArmButton`, `forge/audio/RecordingTrack`, `forge/audio/SoloMuteButtons`, `forge/audio/SoundEffectsLibrary`, `forge/audio/SpectrogramView`, `forge/audio/TempoAndMetronome`, `forge/audio/VoiceIsolationPanel`, `forge/cad/DimensionsAndHatching`, `forge/cad/DraftingCommandLine`, `forge/cad/LiveNodeThumbnail`, `forge/cad/ObjectSnapsAndOrtho`, `forge/cad/PBRMaterialInspector`, `forge/cad/ParametricConstraintEditor`, `forge/cad/TextureSetPanel`, `forge/cad/ViewCubeAndAxisGizmo`, `forge/canvas-tools/ColorDropCanvasTarget`, `forge/canvas-tools/GestureCustomizationPanel`, `forge/canvas-tools/ReferenceImageBoard`, `forge/canvas/AlignDistributePanel`, `forge/canvas/CanvasRuler`, `forge/canvas/SnapGridOverlay`, `forge/canvas/SnapGridSettings`, `forge/color/AlphaSlider`, `forge/color/ColorChannelFields`, `forge/color/ColorDiscPicker`, `forge/color/ColorGradingWheels`, `forge/color/ColorHarmonyAssistant`, `forge/color/ColorSpaceChooser`, `forge/color/ColorWheel`, `forge/color/FloatingColorPalette`, `forge/color/FloatingPaletteUndockHandle`, `forge/color/ForegroundBackgroundChips`, `forge/color/GamutWarning`, `forge/color/HSLSecondaryEditor`, `forge/color/HueSlider`, `forge/color/PrintColorChannels`, `forge/color/SVColorField`, `forge/color/SoftProofControls`, `forge/color/SpotAndGlobalColorEditor`, `forge/color/SwatchGrid`, `forge/color/ThemeColorReferences`, `forge/color/WideGamutChannels`, `forge/design/AutoLayoutInspector`, `forge/design/CollaborationPresence`, `forge/design/ConstraintsPanel`, `forge/design/DevHandoffInspector`, `forge/design/FlowOverview`, `forge/design/HugFillFixedSizeControls`, `forge/design/InteractionTriggerEditor`, `forge/design/MultiExportSlices`, `forge/design/PrototypePreviewPlayer`, `forge/design/ReusableStylesPanel`, `forge/design/VariablesAndModes`, `forge/devices/DevicePairingDialog`, `forge/devices/PenPairingDialog`, `forge/document/BulletsNumberingEditor`, `forge/document/CommentsAndReviewRail`, `forge/document/DictationSessionPanel`, `forge/document/DocumentReadAloudTransport`, `forge/document/FootnoteCitationEditor`, `forge/document/HeadersFootersEditor`, `forge/document/LayoutSpreadNavigator`, `forge/document/NavigationOutline`, `forge/document/RichTextRibbon`, `forge/document/SpellGrammarPopover`, `forge/document/TableLayoutInspector`, `forge/document/TableOfContentsEditor`, `forge/document/TextSelectionAndCaret`, `forge/document/TrackChangesView`, `forge/document/TypographyInspector`, `forge/ink/BrushDynamicsInspector`, `forge/ink/BrushTaperControl`, `forge/ink/InkToolbar`, `forge/ink/TimelapsePlaybackExporter`, `forge/inputs/AssetPresetGallery`, `forge/inputs/InstrumentXYPad`, `forge/layers/ArtboardNavigator`, `forge/layers/ClippingMaskControls` (ClipIndicator), `forge/layers/ClippingMaskControls` (ClipToggle), `forge/layers/LayerBlendAndOpacity`, `forge/layers/LayerStack`, `forge/layers/MaskThumbnailAndEditor`, `forge/midi/MidiChannelPicker`, `forge/midi/MidiChannelPicker` (MidiValueStepper), `forge/motion/EasingPresetGallery`, `forge/motion/ExpressionEditor`, `forge/motion/MotionPathEditor`, `forge/motion/ParticleEmitterControls`, `forge/motion/RenderQueuePanel`, `forge/motion/Transform3DInspector`, `forge/office/ReadAloudTransport`, `forge/office/office-controls` (ChevronGlyph), `forge/office/office-controls` (CloseMark), `forge/office/office-controls` (PauseGlyph), `forge/office/office-controls` (PlayGlyph), `forge/office/office-controls` (PlusGlyph), `forge/office/office-controls` (SkipGlyph), `forge/office/office-controls` (ToolButton), `forge/pdf/AnnotationToolbar`, `forge/pdf/CommentsThreadPanel`, `forge/pdf/EncryptPermissionsPanel`, `forge/pdf/ExtractMergeSplitDialog`, `forge/pdf/HyperlinkInspector`, `forge/pdf/PDFCompareOverlay`, `forge/pdf/PDFPageLayoutSelector`, `forge/pdf/PDFTextSelection`, `forge/pdf/RedactionReviewTool`, `forge/pdf/VirtualPDFPageViewer`, `forge/photo/BatchExportPanel`, `forge/photo/CleanupAndRetouchPanel`, `forge/photo/LensCorrectionPanel`, `forge/photo/LocalMaskBrush`, `forge/photo/LuminanceColorRangeMask`, `forge/photo/PhotoLibraryGrid`, `forge/photo/PhotoMetadataInspector`, `forge/photo/PresetFilmstrip`, `forge/photo/RatingAndFlagControl`, `forge/photo/ToneAndPresence`, `forge/selection/MagicSelectionControls`, `forge/selection/MagicSelectionControls` (MagicWandCanvas), `forge/selection/MultiSelectionControls`, `forge/selection/SelectionMarquee`, `forge/slides/ChartAndTableEditor`, `forge/slides/ConnectorAndDiagramTools`, `forge/slides/MorphPreview`, `forge/slides/PresenterInkStrip`, `forge/slides/RehearsalTimers`, `forge/slides/SlideAnimationPane`, `forge/slides/SlideCanvas`, `forge/slides/SlideFilmstrip`, `forge/slides/SlideNotesEditor`, `forge/slides/SlideSorter`, `forge/slides/SlideThumbnail` (SlideObjectView), `forge/slides/SlideThumbnail`, `forge/slides/TransitionPicker`, `forge/spreadsheet/ChartBuilder`, `forge/spreadsheet/FormulaAutocomplete`, `forge/spreadsheet/FormulaBar`, `forge/spreadsheet/FormulaReferenceText`, `forge/spreadsheet/FreezeSplitControls`, `forge/spreadsheet/NameBox`, `forge/spreadsheet/ReferenceColorizer`, `forge/spreadsheet/SavedSheetViewManager`, `forge/spreadsheet/SheetTabs`, `forge/spreadsheet/SortFilterHeader`, `forge/spreadsheet/Sparkline`, `forge/spreadsheet/SparklineEditor`, `forge/spreadsheet/SplitSpreadsheetView`, `forge/spreadsheet/SpreadsheetCardsView`, `forge/spreadsheet/TableStyleGallery`, `forge/spreadsheet/ValidationDropdown`, `forge/spreadsheet/VirtualSpreadsheetGrid`, `forge/timeline/ExportMonitor`, `forge/timeline/InOutRangeHandles`, `forge/timeline/JKLShuttleController`, `forge/timeline/LoopRangeBar`, `forge/timeline/MediaMonitor`, `forge/timeline/ModeEdgeHandles`, `forge/timeline/MulticamAngleViewer`, `forge/timeline/PictureInPictureControls`, `forge/timeline/PlaybackRateMenu`, `forge/timeline/ProgramMonitor`, `forge/timeline/RenderCacheIndicator`, `forge/timeline/SafeAreaOverlay`, `forge/timeline/SeekBar`, `forge/timeline/SourceMonitor`, `forge/timeline/TimecodeDisplay`, `forge/timeline/TimelineMarkers`, `forge/timeline/TimelinePlayhead`, `forge/timeline/TimelineRuler`, `forge/timeline/TimelineZoomAndScroll`, `forge/timeline/TransitionPresetBrowser`, `forge/timeline/TransportControls`, `forge/timeline/VideoFilmstrip`, `forge/timeline/VideoQualityInspector`, `forge/timeline/VideoStabilizationInspector`, `forge/vector/FillStrokeInspector`, `forge/vector/PenNodeEditor`, `forge/vector/ShapeBuilder`, `html` (Article), `html` (Aside), `html` (Footer), `html` (Header), `html` (Heading), `html` (Input), `html` (Link), `html` (Main), `html` (Nav), `html` (Page), `html` (Paragraph), `html` (Section), `html` (Text), `layout/AdaptiveColumns` (AdaptiveColumn), `layout/AdaptiveColumns`, `layout/ContentFrame`, `navigation/CollapsibleDrawer`, `overlays/AnchoredPopover`, `overlays/CommandPalette`, `overlays/CommandPopover`, `shell/AdaptiveDock`, `shell/AssetBrowser`, `shell/ContextMenu`, `shell/ContextualToolbar`, `shell/DocumentTabBar`, `shell/FindReplaceContent`, `shell/FindReplacePopover`, `shell/FocusAndA11yLayer`, `shell/HistoryPanel`, `shell/InspectorPanel`, `shell/InspectorSearch`, `shell/InspectorSection`, `shell/KeyboardShortcutHUD`, `shell/MenuButton`, `shell/PaneSplitter`, `shell/PresetGallery`, `shell/PropertyRow`, `shell/SplitButton`, `shell/StatusBar`, `shell/ToolRail`, `shell/UnitInput`, `shell/WorkspacePresetSwitcher`

</details>

<details><summary>Component-free exports that load on both lanes (166)</summary>

`components/data/tree-grid`, `components/data/tree-row-heights`, `components/files/drop-model`, `components/files/file-transfer-model`, `components/forge/audio/audio-recovery-model`, `components/forge/audio/automation`, `components/forge/audio/dynamics-graph`, `components/forge/audio/eq-graph`, `components/forge/audio/inserts`, `components/forge/audio/level`, `components/forge/audio/level-meter`, `components/forge/audio/loudness`, `components/forge/audio/meter-ballistics`, `components/forge/audio/mix-groups`, `components/forge/audio/mixer`, `components/forge/audio/pan`, `components/forge/audio/preview-model`, `components/forge/audio/recording-model`, `components/forge/audio/routing`, `components/forge/audio/spectrogram`, `components/forge/audio/tempo`, `components/forge/canvas-tools/color-drop-model`, `components/forge/canvas-tools/gesture-map-model`, `components/forge/canvas-tools/reference-board-model`, `components/forge/canvas/align-distribute-model`, `components/forge/canvas/canvas-pan-zoom-model`, `components/forge/canvas/canvas-viewport`, `components/forge/canvas/graphite-frame`, `components/forge/canvas/ruler-model`, `components/forge/canvas/smart-guides-model`, `components/forge/canvas/snap-grid-model`, `components/forge/canvas/transform-origin-model`, `components/forge/color`, `components/forge/color/channel-fields`, `components/forge/color/color-adjustments`, `components/forge/color/color-management`, `components/forge/color/color-pair`, `components/forge/color/color-picker-dialog-model`, `components/forge/color/contrast`, `components/forge/color/fieldGeometry`, `components/forge/color/fieldGesture`, `components/forge/color/floating-palette`, `components/forge/color/gradient-mesh`, `components/forge/color/gradient-options`, `components/forge/color/harmony`, `components/forge/color/hsl`, `components/forge/color/swatches`, `components/forge/color/wheel-geometry`, `components/forge/devices/pairing-model`, `components/forge/document/list-model`, `components/forge/document/outline-model`, `components/forge/document/ribbon-model`, `components/forge/formula-refs`, `components/forge/frame-throttle`, `components/forge/graph/model`, `components/forge/graphics/crop`, `components/forge/ink/brush-model`, `components/forge/ink/ink-model`, `components/forge/inputs/precision`, `components/forge/inputs/precision-scrubber-model`, `components/forge/layers/artboard-model`, `components/forge/layers/clipping-model`, `components/forge/layers/compare-model`, `components/forge/layers/layer-blend-model`, `components/forge/layers/layer-model`, `components/forge/layers/layer-thumbnail-model`, `components/forge/layers/layer-tree-model`, `components/forge/layers/mask-model`, `components/forge/midi/note-grid`, `components/forge/midi/velocity-line`, `components/forge/motion/composition-tree`, `components/forge/motion/motion-curves`, `components/forge/motion/motion-easing`, `components/forge/motion/motion-effects`, `components/forge/motion/motion-expression`, `components/forge/motion/motion-node-graph`, `components/forge/motion/motion-path`, `components/forge/motion/motion-render`, `components/forge/motion/motion-settings`, `components/forge/motion/motion-timeline`, `components/forge/office/read-aloud-model`, `components/forge/pdf/annotation-model`, `components/forge/pdf/comments-model`, `components/forge/pdf/search-model`, `components/forge/photo/photo-adjustments`, `components/forge/photo/photo-catalog`, `components/forge/photo/photo-export`, `components/forge/photo/photo-masks`, `components/forge/photo/photo-metadata`, `components/forge/photo/photo-presets`, `components/forge/range-paste`, `components/forge/range-tsv`, `components/forge/selection/magic-selection-model`, `components/forge/selection/multi-selection-model`, `components/forge/selection/selection-bounds-model`, `components/forge/selection/selection-model`, `components/forge/sheet-window`, `components/forge/slides/animation-model`, `components/forge/slides/canvas-model`, `components/forge/slides/presenter-ink-model`, `components/forge/slides/slide-model`, `components/forge/spreadsheet/cards-model`, `components/forge/spreadsheet/chart-model`, `components/forge/spreadsheet/fill-handle`, `components/forge/spreadsheet/freeze-split-model`, `components/forge/spreadsheet/reference-colors`, `components/forge/spreadsheet/sheet-tabs-model`, `components/forge/spreadsheet/sparkline-model`, `components/forge/timebase`, `components/forge/timeline/batch`, `components/forge/timeline/edits`, `components/forge/timeline/loop-range`, `components/forge/timeline/markers`, `components/forge/timeline/placement`, `components/forge/timeline/ruler`, `components/forge/timeline/safe-area`, `components/forge/timeline/shuttle`, `components/forge/timeline/time`, `components/forge/timeline/track-stack`, `components/forge/timeline/transition-presets`, `components/forge/timeline/transitions`, `components/forge/timeline/trim-modes`, `components/forge/timeline/viewport`, `components/forge/timeline/waveform-cache`, `components/forge/vector/fill-stroke-model`, `components/forge/vector/gradient-handles-model`, `components/forge/vector/pen-node-model`, `components/forge/vector/shape-builder-model`, `components/forge/vector/vector-types`, `components/forge/waveform`, `components/forms/choice-keys`, `components/forms/option-groups`, `components/gestures/drag-controller`, `components/gestures/drag-transport`, `components/navigation/drawer-model`, `components/overlays/anchored-popover-types`, `components/overlays/command-filter`, `components/overlays/focus-cycle`, `components/overlays/focus-restore`, `components/overlays/measure-anchor`, `components/overlays/popover-position`, `components/overlays/useTriggerAnchor`, `components/shell/a11y-audit`, `components/shell/a11y-model`, `components/shell/asset-browser-model`, `components/shell/contextual-toolbar-model`, `components/shell/dock-model`, `components/shell/document-tabs-model`, `components/shell/find-replace-model`, `components/shell/history-model`, `components/shell/inspector-context`, `components/shell/inspector-model`, `components/shell/keyboard-map`, `components/shell/preset-model`, `components/shell/progress-model`, `components/shell/ribbon-model`, `components/shell/screen-reader-focus`, `components/shell/shell-keys`, `components/shell/shortcut-model`, `components/shell/slider-model`, `components/shell/splitter-model`, `components/shell/status-model`, `components/shell/tool-rail-model`, `components/shell/unit-expression`, `components/shell/workspace-model`, `components/shell/workspace-preset-model`

</details>

## Dependency baseline

Checked against npm on 2026-11-11 for gate T1. Each row is either a pin this
repository moved to or a version it holds, with the reason.

| Dependency | Pinned | Action |
|---|---|---|
| pnpm | 12.18.0 | Bumped from 10.32.1; lockfile regenerated. |
| TypeScript (workspace) | 7.0.2 | Bumped from 6.0.3. Tests and tooling that use the compiler API import `@typescript/typescript6` 6.0.2 (TypeScript 6.0.3), because TypeScript 7 has no JavaScript API. |
| TypeScript (isolated desktop packages) | 5.9.3 | Hold. The RNW and AppKit lanes keep their own 5.9.3 compiler and their 5.9.3 declaration baselines as consumer-compatibility checks. |
| expo | 58.0.24 | Bumped and unified; `@expo/ui` 58.0.28, `expo-asset` 58.0.21 and `expo-linear-gradient` 58.0.4 follow Expo 58.0.24's bundled module versions. |
| react-native | 0.88.1 | Unified. Hold 0.89: it is only a release candidate. |
| react, react-dom | 19.3.0 | Hold 19.3.1 for both: React Native 0.88.1 ships a Fabric renderer built from React 19.3.0, and Expo's bundledNativeModules pins 19.3.0. react-dom is pinned beside every react 19.3.0 pin so Expo's react-dom peer no longer resolves to 19.3.1, whose peer is `react ^19.3.1`. |
| @legendapp/spark | 0.0.3 | Bumped inside the AppKit lane only. 0.0.3 still requires Expo 55.0.32, React Native 0.83.10 (React Native Windows 0.83.2 as an optional peer), React ^19.2.0, and bundles Nitro Modules 0.37.0 and TypeScript 5.9.3, the same as 0.0.2. |
| react-native-windows | 0.85.0 | Current. |
| react-native-macos | 0.83.0 | Current. |
| react-native-gesture-handler | 3.5.0 (dev and example) | Optional peer `>=3.3.0 <4` (D5 decision 1), tested against 3.3.0, 3.4.0 and 3.5.0. 3.3.0 is the newest 3.3.x and runs in the `gesture-handler-floor` workflow; 3.4.0 is the version on the P05 native canvas proof; 3.5.0 is the workspace pin. |
| react-native-skia | 3.10.0 (dev and example) | Tested at 3.10.0. The peer range stays `>=3.9.1 <4`. |
| uniwind | 1.13.2 | Current. |
| mediabunny | 1.65.2 | Current. |
| zustand | 5.1.0 | Bumped from 5.0.16; peer range stays `^5.0.0`. |
| tailwindcss | 4.3.5 (native-instruments example) | Bumped from 4.3.3. |

After these changes `pnpm outdated -r` lists only `react` and `react-dom`
19.3.0 → 19.3.1, held for the reason above. The command covers the pnpm workspace; the npm
browser suites and the isolated desktop lanes keep their own locks.

## Peer range policy

Peer ranges are lower bounds with no upper cap where the manifest says so,
for example `react >=19.0.0` and `react-native >=0.88.0`. A future major
release of React or React Native satisfies the range but is not tested and
not guaranteed to work. Expo-coupled peers use caret ranges (`expo ^58.0.0`,
`@expo/ui ^58.0.0`), and a few `ui` peers carry explicit caps
(`react-native-gesture-handler >=3.3.0 <4`, `uniwind >=1.12.2 <2`,
`react-native-skia >=3.9.1 <4`, `expo-drag-drop-content-view >=0.9.2 <1`).

Whether to cap `react-native` is an open owner decision listed in
[v1.0.0 decisions](V1_DECISIONS.md) D1 as a blocker for npm publishing.

## Node

Repository tooling (tests, build, pack) needs Node `>=24.19.0`, from the root
`package.json` `engines` field. The packages themselves declare no `engines`.

## Optional peer: react-native-skia

`@nyc-tron/ui` declares `react-native-skia` (`>=3.9.1 <4`) as an optional
peer. The package name is `react-native-skia`; `@shopify/react-native-skia`
appears nowhere in the manifests or sources.

Four source files in `packages/ui` import it directly:

- `src/components/forge/canvas/GPUCanvasViewport.tsx`
- `src/components/forge/canvas/graphite-frame.ts` (type-only import)
- `src/components/forge/ink/InkStrokePreview.tsx`
- `src/components/forge/slides/InkAndLaserPointer.tsx`

Following relative imports from those files gives six export subpaths that
need it:

| Subpath | How |
|---|---|
| `@nyc-tron/ui/components/forge/canvas/GPUCanvasViewport` | direct import |
| `@nyc-tron/ui/components/forge/canvas/graphite-frame` | type-only import; the emitted JS does not import Skia |
| `@nyc-tron/ui/components/forge/ink/InkStrokePreview` | direct import |
| `@nyc-tron/ui/components/forge/slides/InkAndLaserPointer` | direct import |
| `@nyc-tron/ui/components/forge/ink/BrushStabilizationPreview` | imports `InkStrokePreview` |
| `@nyc-tron/ui/components/forge/pdf/SignatureStampTool` | imports `InkAndLaserPointer` |

The emitted `dist/` JS imports `react-native-skia` in three files:
`GPUCanvasViewport.js`, `InkStrokePreview.js` and `InkAndLaserPointer.js`.
The clean basic UI consumer now installs and runs without Skia and the other
unrelated optional peers; the installed-consumer gate asserts those absences.
The specialized paths listed above still require their declared Skia peer.
See [installed-consumer evidence](completion/reports/V1-RELEASE-GATES.md#what-the-installed-consumer-gate-proves).

## Reporting problems

Open an issue at https://github.com/mikevocalz/NYC-Tron-UI/issues with the
package, version, platform and the lane (Expo SDK 58 or RNW 0.85).
