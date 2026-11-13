| Lane | Exports built | Exports loaded | Components | Pass | Missing peer | Lane failure | Not attributed | Not run |
|---|---|---|---|---|---|---|---|---|
| windows | 502/555 | 554/555 | 421 | 277 | 32 | 0 | 112 | 0 |
| macos | 502/555 | 502/555 | 421 | 272 | 54 | 0 | 95 | 0 |

Web reference: 503/555 exports loaded, 273/368 components mounted.

## Per export

| Export | windows | macos | Web reference |
|---|---|---|---|
| `.` | Button: pass<br>Card: pass<br>NavigationRail: pass<br>NavigationShell: pass<br>TextField: pass | Button: pass<br>Card: pass<br>NavigationRail: pass<br>NavigationShell: pass<br>TextField: pass | Button: mounted<br>Card: mounted<br>NavigationRail: mounted<br>NavigationShell: mounted<br>TextField: mounted |
| `./components/Button` | Button: pass | Button: pass | Button: mounted |
| `./components/Card` | Card: pass | Card: pass | Card: mounted |
| `./components/DragGrabHandle` | DragGrabHandle: pass | DragGrabHandle: pass | DragGrabHandle: mounted |
| `./components/FieldGroup` | FieldGroup: pass<br>FieldSection: pass | FieldGroup: pass<br>FieldSection: pass | FieldGroup: mounted<br>FieldSection: mounted |
| `./components/IconButton` | IconButton: pass | IconButton: pass | IconButton: mounted |
| `./components/List` | List: pass<br>ListItem: pass | List: pass<br>ListItem: pass | List: mounted<br>ListItem: mounted |
| `./components/NavigationRail` | NavigationRail: pass<br>NavigationShell: pass | NavigationRail: pass<br>NavigationShell: pass | NavigationRail: mounted<br>NavigationShell: mounted |
| `./components/SegmentedControl` | SegmentedControl: pass | SegmentedControl: pass | SegmentedControl: mounted |
| `./components/Select` | Select: pass | Select: pass | Select: mounted |
| `./components/TabBar` | TabBar: pass | TabBar: pass | TabBar: mounted |
| `./components/TextField` | TextField: pass | TextField: pass | TextField: mounted |
| `./components/Toolbar` | Toolbar: pass | Toolbar: pass | Toolbar: mounted |
| `./components/content/KeyValueList` | KeyValueList: pass | KeyValueList: pass | KeyValueList: mounted |
| `./components/data/DataTable` | load missing-peer (@tanstack/react-table) | load missing-peer (@tanstack/react-table) | load failed |
| `./components/data/TreeGrid` | TreeGrid: pass | TreeGrid: pass | TreeGrid: mounted |
| `./components/data/tree-grid` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/data/tree-row-heights` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/feedback/Badge` | Badge: pass | Badge: pass | Badge: mounted |
| `./components/feedback/Banner` | Banner: pass | Banner: pass | Banner: mounted |
| `./components/feedback/EmptyState` | EmptyState: pass | EmptyState: pass | EmptyState: mounted |
| `./components/feedback/ErrorMessage` | ErrorMessage: pass | ErrorMessage: pass | ErrorMessage: mounted |
| `./components/files/DropZone` | DropZone: missing-peer | load missing-peer (expo-drag-drop-content-view) | DropZone: mounted |
| `./components/files/FileImportExportSheet` | FileImportExportSheet: pass | FileImportExportSheet: pass | FileImportExportSheet: mounted |
| `./components/files/FilePicker` | FilePicker: pass | FilePicker: pass | FilePicker: mounted |
| `./components/files/drop-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/files/file-transfer-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/ColorChannels` | ColorChannels: missing-peer | load missing-peer (@expo/ui) | load failed |
| `./components/forge/NativeSeekBar` | NativeSeekBar: missing-peer | load missing-peer (@expo/ui, @expo/ui/jetpack-compose, @expo/ui/swift-ui, @expo/ui/swift-ui/modifiers) | load failed |
| `./components/forge/SpreadsheetGrid` | SpreadsheetGrid: pass | SpreadsheetGrid: pass | SpreadsheetGrid: mounted |
| `./components/forge/WaveformLane` | WaveformLane: pass | WaveformLane: pass | WaveformLane: mounted |
| `./components/forge/audio/AudioClipTrimAndFade` | AudioClipTrimAndFade: not-attributed | AudioClipTrimAndFade: not-attributed | AudioClipTrimAndFade: failed |
| `./components/forge/audio/AudioEffectsPresetPanel` | AudioEffectsPresetPanel: not-attributed | AudioEffectsPresetPanel: not-attributed | AudioEffectsPresetPanel: failed |
| `./components/forge/audio/AudioInterruptionRecoveryDialog` | AudioInterruptionRecoveryDialog: pass | AudioInterruptionRecoveryDialog: pass | AudioInterruptionRecoveryDialog: mounted |
| `./components/forge/audio/AudioPreview` | AudioPreview: pass | AudioPreview: pass | AudioPreview: mounted |
| `./components/forge/audio/AudioProcessingPanel` | AudioProcessingPanel: not-attributed | AudioProcessingPanel: not-attributed | AudioProcessingPanel: failed |
| `./components/forge/audio/AudioVideoSync` | AudioVideoSync: pass | AudioVideoSync: pass | AudioVideoSync: mounted |
| `./components/forge/audio/AutoDuckEnvelopePanel` | AutoDuckEnvelopePanel: pass | AutoDuckEnvelopePanel: pass | AutoDuckEnvelopePanel: mounted |
| `./components/forge/audio/AutomationLane` | AutomationLane: pass | AutomationLane: pass | AutomationLane: mounted |
| `./components/forge/audio/AutomationModePicker` | AutomationModePicker: pass | AutomationModePicker: pass | AutomationModePicker: mounted |
| `./components/forge/audio/BeatDetectionMarkerLane` | BeatDetectionMarkerLane: pass | BeatDetectionMarkerLane: pass | BeatDetectionMarkerLane: mounted |
| `./components/forge/audio/BusAndRoutingMatrix` | BusAndRoutingMatrix: pass | BusAndRoutingMatrix: pass | BusAndRoutingMatrix: mounted |
| `./components/forge/audio/ChannelStrip` | ChannelStrip: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/audio/ClipGainEnvelope` | ClipGainEnvelope: pass | ClipGainEnvelope: pass | ClipGainEnvelope: mounted |
| `./components/forge/audio/DeviceAndChannelPicker` | DeviceAndChannelPicker: pass | DeviceAndChannelPicker: pass | DeviceAndChannelPicker: mounted |
| `./components/forge/audio/DynamicsTransferGraph` | DynamicsTransferGraph: not-attributed | DynamicsTransferGraph: not-attributed | DynamicsTransferGraph: failed |
| `./components/forge/audio/EQFrequencyGraph` | EQFrequencyGraph: not-attributed | EQFrequencyGraph: not-attributed | EQFrequencyGraph: failed |
| `./components/forge/audio/InputMonitorToggle` | InputMonitorToggle: pass | InputMonitorToggle: pass | InputMonitorToggle: mounted |
| `./components/forge/audio/InsertEffectRack` | InsertEffectRack: pass | InsertEffectRack: pass | InsertEffectRack: mounted |
| `./components/forge/audio/LatencyCalibrationPanel` | LatencyCalibrationPanel: pass | LatencyCalibrationPanel: pass | LatencyCalibrationPanel: mounted |
| `./components/forge/audio/LevelFader` | LevelFader: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/audio/LevelMeter` | LevelMeter: pass | LevelMeter: pass | LevelMeter: mounted |
| `./components/forge/audio/LiveRecordingWaveform` | LiveRecordingWaveform: not-attributed | LiveRecordingWaveform: not-attributed | LiveRecordingWaveform: failed |
| `./components/forge/audio/LoopPunchRecording` | LoopPunchRecording: not-attributed | LoopPunchRecording: not-attributed | LoopPunchRecording: failed |
| `./components/forge/audio/LoudnessMeter` | LoudnessMeter: pass | LoudnessMeter: pass | LoudnessMeter: mounted |
| `./components/forge/audio/MixGroupBar` | MixGroupBar: pass | MixGroupBar: pass | MixGroupBar: mounted |
| `./components/forge/audio/MixingConsole` | MixingConsole: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/audio/NativeAudioTransport` | NativeAudioTransport: pass | NativeAudioTransport: pass | NativeAudioTransport: mounted |
| `./components/forge/audio/NoiseReductionMonitor` | NoiseReductionMonitor: pass | NoiseReductionMonitor: pass | NoiseReductionMonitor: mounted |
| `./components/forge/audio/PanAndBalanceControl` | PanAndBalanceControl: pass | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/audio/PanControl` | PanControl: pass | PanControl: pass | PanControl: mounted |
| `./components/forge/audio/PluginPresetBrowser` | PluginPresetBrowser: pass | PluginPresetBrowser: pass | PluginPresetBrowser: mounted |
| `./components/forge/audio/RealtimePeakMeter` | RealtimePeakMeter: pass | RealtimePeakMeter: pass | RealtimePeakMeter: mounted |
| `./components/forge/audio/RecordingArmButton` | RecordingArmButton: pass | RecordingArmButton: pass | RecordingArmButton: mounted |
| `./components/forge/audio/RecordingTrack` | RecordingTrack: pass | RecordingTrack: pass | RecordingTrack: mounted |
| `./components/forge/audio/SampleEditor` | SampleEditor: not-attributed | SampleEditor: not-attributed | SampleEditor: failed |
| `./components/forge/audio/SoloMuteButtons` | SoloMuteButtons: pass | SoloMuteButtons: pass | SoloMuteButtons: mounted |
| `./components/forge/audio/SoundEffectsLibrary` | SoundEffectsLibrary: pass | SoundEffectsLibrary: pass | SoundEffectsLibrary: mounted |
| `./components/forge/audio/SpectrogramView` | SpectrogramView: pass | SpectrogramView: pass | SpectrogramView: mounted |
| `./components/forge/audio/SpeechTranscriptTakeReview` | SpeechTranscriptTakeReview: not-attributed | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/audio/StereoMultichannelWaveform` | StereoMultichannelWaveform: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/audio/SurroundPanView` | SurroundPanView: not-attributed | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/audio/TakePlaylistAndComping` | TakePlaylistAndComping: not-attributed | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/audio/TempoAndMetronome` | TempoAndMetronome: pass | TempoAndMetronome: pass | TempoAndMetronome: mounted |
| `./components/forge/audio/VerticalFader` | VerticalFader: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/audio/VoiceIsolationPanel` | VoiceIsolationPanel: pass | VoiceIsolationPanel: pass | VoiceIsolationPanel: mounted |
| `./components/forge/audio/VoiceoverCountdownAndTakeBin` | VoiceoverCountdownAndTakeBin: not-attributed | VoiceoverCountdownAndTakeBin: not-attributed | VoiceoverCountdownAndTakeBin: failed |
| `./components/forge/audio/audio-recovery-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/audio/automation` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/audio/dynamics-graph` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/audio/eq-graph` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/audio/inserts` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/audio/level` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/audio/level-meter` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/audio/loudness` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/audio/meter-ballistics` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/audio/mix-groups` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/audio/mixer` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/audio/pan` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/audio/preview-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/audio/recording-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/audio/routing` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/audio/spectrogram` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/audio/tempo` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/cad/BakingMapPanel` | BakingMapPanel: not-attributed | BakingMapPanel: not-attributed | BakingMapPanel: failed |
| `./components/forge/cad/DimensionsAndHatching` | DimensionsAndHatching: pass | DimensionsAndHatching: pass | DimensionsAndHatching: mounted |
| `./components/forge/cad/DraftingCommandLine` | DraftingCommandLine: pass | DraftingCommandLine: pass | DraftingCommandLine: mounted |
| `./components/forge/cad/LiveNodeThumbnail` | LiveNodeThumbnail: pass | LiveNodeThumbnail: pass | LiveNodeThumbnail: mounted |
| `./components/forge/cad/Native3DViewport` | Native3DViewport: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/cad/NodeGraphCanvas` | NodeGraphCanvas: not-attributed | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/cad/NodeLibrarySearch` | NodeLibrarySearch: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/cad/ObjectSnapsAndOrtho` | ObjectSnapsAndOrtho: pass | ObjectSnapsAndOrtho: pass | ObjectSnapsAndOrtho: mounted |
| `./components/forge/cad/PBRMaterialInspector` | PBRMaterialInspector: pass | PBRMaterialInspector: pass | PBRMaterialInspector: mounted |
| `./components/forge/cad/PaperSpaceLayout` | PaperSpaceLayout: not-attributed | PaperSpaceLayout: not-attributed | PaperSpaceLayout: failed |
| `./components/forge/cad/ParametricConstraintEditor` | ParametricConstraintEditor: pass | ParametricConstraintEditor: pass | ParametricConstraintEditor: mounted |
| `./components/forge/cad/TextureBrush3D` | TextureBrush3D: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/cad/TextureMaskAndGenerator` | TextureMaskAndGenerator: not-attributed | TextureMaskAndGenerator: not-attributed | TextureMaskAndGenerator: failed |
| `./components/forge/cad/TextureSetPanel` | TextureSetPanel: pass | TextureSetPanel: pass | TextureSetPanel: mounted |
| `./components/forge/cad/TransformGizmo3D` | TransformGizmo3D: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/cad/UVEditor` | UVEditor: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/cad/ViewCubeAndAxisGizmo` | ViewCubeAndAxisGizmo: pass | ViewCubeAndAxisGizmo: pass | ViewCubeAndAxisGizmo: mounted |
| `./components/forge/canvas-tools/ColorDropCanvasTarget` | ColorDropCanvasTarget: pass | ColorDropCanvasTarget: pass | ColorDropCanvasTarget: mounted |
| `./components/forge/canvas-tools/GestureCustomizationPanel` | GestureCustomizationPanel: pass | GestureCustomizationPanel: pass | GestureCustomizationPanel: mounted |
| `./components/forge/canvas-tools/ReferenceImageBoard` | ReferenceImageBoard: pass | ReferenceImageBoard: pass | ReferenceImageBoard: mounted |
| `./components/forge/canvas-tools/color-drop-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/canvas-tools/gesture-map-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/canvas-tools/reference-board-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/canvas/AlignDistributePanel` | AlignDistributePanel: pass | AlignDistributePanel: pass | AlignDistributePanel: mounted |
| `./components/forge/canvas/CanvasPanZoom` | CanvasPanZoom: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/canvas/CanvasRuler` | CanvasRuler: pass | CanvasRuler: pass | CanvasRuler: mounted |
| `./components/forge/canvas/GPUCanvasViewport` | GPUCanvasViewport: missing-peer | load missing-peer (react-native-skia) | load failed |
| `./components/forge/canvas/GuidedCropAndStraighten` | GuidedCropAndStraighten: not-attributed | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/canvas/SmartGuides` | SmartGuides: not-attributed | SmartGuides: not-attributed | SmartGuides: failed |
| `./components/forge/canvas/SnapGridOverlay` | SnapGridOverlay: pass | SnapGridOverlay: pass | SnapGridOverlay: mounted |
| `./components/forge/canvas/SnapGridSettings` | SnapGridSettings: pass | SnapGridSettings: pass | SnapGridSettings: mounted |
| `./components/forge/canvas/TransformOriginHandle` | TransformOriginHandle: not-attributed | TransformOriginHandle: not-attributed | TransformOriginHandle: failed |
| `./components/forge/canvas/align-distribute-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/canvas/canvas-pan-zoom-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/canvas/canvas-viewport` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/canvas/graphite-frame` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/canvas/ruler-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/canvas/smart-guides-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/canvas/snap-grid-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/canvas/transform-origin-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/color` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/color/AlphaSlider` | AlphaSlider: pass | AlphaSlider: pass | AlphaSlider: mounted |
| `./components/forge/color/ColorChannelFields` | ColorChannelFields: pass | ColorChannelFields: pass | ColorChannelFields: mounted |
| `./components/forge/color/ColorDiscPicker` | ColorDiscPicker: pass | ColorDiscPicker: pass | ColorDiscPicker: mounted |
| `./components/forge/color/ColorGradingWheels` | ColorGradingWheels: pass | ColorGradingWheels: pass | ColorGradingWheels: mounted |
| `./components/forge/color/ColorHarmonyAssistant` | ColorHarmonyAssistant: pass | ColorHarmonyAssistant: pass | ColorHarmonyAssistant: mounted |
| `./components/forge/color/ColorPickerDialog` | ColorPickerDialog: pass | load missing-peer (@expo/ui, expo-linear-gradient) | load failed |
| `./components/forge/color/ColorSpaceChooser` | ColorSpaceChooser: pass | ColorSpaceChooser: pass | ColorSpaceChooser: mounted |
| `./components/forge/color/ColorWheel` | ColorWheel: pass | ColorWheel: pass | ColorWheel: mounted |
| `./components/forge/color/CurvesEditor` | CurvesEditor: not-attributed | CurvesEditor: not-attributed | CurvesEditor: failed |
| `./components/forge/color/EyedropperTool` | EyedropperTool: not-attributed | EyedropperTool: not-attributed | EyedropperTool: failed |
| `./components/forge/color/FloatingColorPalette` | FloatingColorPalette: pass | FloatingColorPalette: pass | FloatingColorPalette: mounted |
| `./components/forge/color/FloatingPaletteUndockHandle` | FloatingPaletteUndockHandle: pass | FloatingPaletteUndockHandle: pass | FloatingPaletteUndockHandle: mounted |
| `./components/forge/color/ForegroundBackgroundChips` | ForegroundBackgroundChips: pass | ForegroundBackgroundChips: pass | ForegroundBackgroundChips: mounted |
| `./components/forge/color/GamutWarning` | GamutWarning: pass | GamutWarning: pass | GamutWarning: mounted |
| `./components/forge/color/GradientMeshEditor` | GradientMeshEditor: not-attributed | GradientMeshEditor: not-attributed | GradientMeshEditor: failed |
| `./components/forge/color/GradientStopEditor` | GradientStopEditor: not-attributed | GradientStopEditor: not-attributed | GradientStopEditor: failed |
| `./components/forge/color/HSLSecondaryEditor` | HSLSecondaryEditor: pass | HSLSecondaryEditor: pass | HSLSecondaryEditor: mounted |
| `./components/forge/color/HsvPicker` | HsvPicker: missing-peer | load missing-peer (@expo/ui, expo-linear-gradient) | load failed |
| `./components/forge/color/HueSlider` | HueSlider: pass | HueSlider: pass | HueSlider: mounted |
| `./components/forge/color/LevelsEditor` | LevelsEditor: not-attributed | LevelsEditor: not-attributed | LevelsEditor: failed |
| `./components/forge/color/LiveHistogram` | LiveHistogram: not-attributed | LiveHistogram: not-attributed | LiveHistogram: failed |
| `./components/forge/color/PrintColorChannels` | PrintColorChannels: pass | PrintColorChannels: pass | PrintColorChannels: mounted |
| `./components/forge/color/SVColorField` | SVColorField: pass | SVColorField: pass | SVColorField: mounted |
| `./components/forge/color/SoftProofControls` | SoftProofControls: pass | SoftProofControls: pass | SoftProofControls: mounted |
| `./components/forge/color/SpotAndGlobalColorEditor` | SpotAndGlobalColorEditor: pass | SpotAndGlobalColorEditor: pass | SpotAndGlobalColorEditor: mounted |
| `./components/forge/color/SwatchGrid` | SwatchGrid: pass | SwatchGrid: pass | SwatchGrid: mounted |
| `./components/forge/color/ThemeColorReferences` | ThemeColorReferences: pass | ThemeColorReferences: pass | ThemeColorReferences: mounted |
| `./components/forge/color/VideoScopesPanel` | VideoScopesPanel: not-attributed | VideoScopesPanel: not-attributed | VideoScopesPanel: failed |
| `./components/forge/color/WideGamutChannels` | WideGamutChannels: pass | WideGamutChannels: pass | WideGamutChannels: mounted |
| `./components/forge/color/channel-fields` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/color/color-adjustments` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/color/color-management` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/color/color-pair` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/color/color-picker-dialog-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/color/contrast` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/color/fieldGeometry` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/color/fieldGesture` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/color/floating-palette` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/color/gradient-mesh` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/color/gradient-options` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/color/harmony` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/color/hsl` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/color/swatches` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/color/wheel-geometry` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/design/AutoLayoutInspector` | AutoLayoutInspector: pass | AutoLayoutInspector: pass | AutoLayoutInspector: mounted |
| `./components/forge/design/CollaborationPresence` | CollaborationPresence: pass | CollaborationPresence: pass | CollaborationPresence: mounted |
| `./components/forge/design/CommentPins` | CommentPins: not-attributed | CommentPins: not-attributed | CommentPins: failed |
| `./components/forge/design/ComponentVariantPicker` | ComponentVariantPicker: not-attributed | ComponentVariantPicker: not-attributed | ComponentVariantPicker: failed |
| `./components/forge/design/ConstraintsPanel` | ConstraintsPanel: pass | ConstraintsPanel: pass | ConstraintsPanel: mounted |
| `./components/forge/design/DevHandoffInspector` | DevHandoffInspector: pass | DevHandoffInspector: pass | DevHandoffInspector: mounted |
| `./components/forge/design/FlowOverview` | FlowOverview: pass | FlowOverview: pass | FlowOverview: mounted |
| `./components/forge/design/FrameAndComponentTree` | FrameAndComponentTree: not-attributed | FrameAndComponentTree: not-attributed | FrameAndComponentTree: failed |
| `./components/forge/design/HugFillFixedSizeControls` | HugFillFixedSizeControls: pass | HugFillFixedSizeControls: pass | HugFillFixedSizeControls: mounted |
| `./components/forge/design/InteractionTriggerEditor` | InteractionTriggerEditor: pass | InteractionTriggerEditor: pass | InteractionTriggerEditor: mounted |
| `./components/forge/design/MultiExportSlices` | MultiExportSlices: pass | MultiExportSlices: pass | MultiExportSlices: mounted |
| `./components/forge/design/PrototypeConnectionTool` | PrototypeConnectionTool: not-attributed | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/design/PrototypePreviewPlayer` | PrototypePreviewPlayer: pass | PrototypePreviewPlayer: pass | PrototypePreviewPlayer: mounted |
| `./components/forge/design/ReusableStylesPanel` | ReusableStylesPanel: pass | ReusableStylesPanel: pass | ReusableStylesPanel: mounted |
| `./components/forge/design/VariablesAndModes` | VariablesAndModes: pass | VariablesAndModes: pass | VariablesAndModes: mounted |
| `./components/forge/devices/DevicePairingDialog` | DevicePairingDialog: pass | DevicePairingDialog: pass | DevicePairingDialog: mounted |
| `./components/forge/devices/PenPairingDialog` | PenPairingDialog: pass | PenPairingDialog: pass | PenPairingDialog: mounted |
| `./components/forge/devices/pairing-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/document/BulletsNumberingEditor` | BulletsNumberingEditor: pass | BulletsNumberingEditor: pass | BulletsNumberingEditor: mounted |
| `./components/forge/document/CommentsAndReviewRail` | CommentsAndReviewRail: pass | CommentsAndReviewRail: pass | CommentsAndReviewRail: mounted |
| `./components/forge/document/DictationSessionPanel` | DictationSessionPanel: pass | DictationSessionPanel: pass | DictationSessionPanel: mounted |
| `./components/forge/document/DocumentReadAloudTransport` | DocumentReadAloudTransport: pass | DocumentReadAloudTransport: pass | DocumentReadAloudTransport: mounted |
| `./components/forge/document/FootnoteCitationEditor` | FootnoteCitationEditor: pass | FootnoteCitationEditor: pass | FootnoteCitationEditor: mounted |
| `./components/forge/document/HeadersFootersEditor` | HeadersFootersEditor: pass | HeadersFootersEditor: pass | HeadersFootersEditor: mounted |
| `./components/forge/document/InsertTableGrid` | InsertTableGrid: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/document/LayoutSpreadNavigator` | LayoutSpreadNavigator: pass | LayoutSpreadNavigator: pass | LayoutSpreadNavigator: mounted |
| `./components/forge/document/MailMergeFieldPicker` | MailMergeFieldPicker: not-attributed | MailMergeFieldPicker: not-attributed | MailMergeFieldPicker: failed |
| `./components/forge/document/NavigationOutline` | NavigationOutline: pass | NavigationOutline: pass | NavigationOutline: mounted |
| `./components/forge/document/PageSetupPanel` | PageSetupPanel: not-attributed | PageSetupPanel: not-attributed | PageSetupPanel: failed |
| `./components/forge/document/PaginatedTextCanvas` | PaginatedTextCanvas: not-attributed | PaginatedTextCanvas: not-attributed | PaginatedTextCanvas: failed |
| `./components/forge/document/ParagraphRuler` | ParagraphRuler: not-attributed | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/document/ParagraphStylesGallery` | ParagraphStylesGallery: not-attributed | ParagraphStylesGallery: not-attributed | ParagraphStylesGallery: failed |
| `./components/forge/document/RichTextRibbon` | RichTextRibbon: pass | RichTextRibbon: pass | RichTextRibbon: mounted |
| `./components/forge/document/SpellGrammarPopover` | SpellGrammarContent: not-attributed<br>SpellGrammarPopover: pass | SpellGrammarContent: not-attributed<br>SpellGrammarPopover: pass | SpellGrammarContent: failed<br>SpellGrammarPopover: mounted |
| `./components/forge/document/TableLayoutInspector` | TableLayoutInspector: pass | TableLayoutInspector: pass | TableLayoutInspector: mounted |
| `./components/forge/document/TableOfContentsEditor` | TableOfContentsEditor: pass | TableOfContentsEditor: pass | TableOfContentsEditor: mounted |
| `./components/forge/document/TextSelectionAndCaret` | TextSelectionAndCaret: pass | TextSelectionAndCaret: pass | TextSelectionAndCaret: mounted |
| `./components/forge/document/TextWrapAndFrames` | TextWrapAndFrames: not-attributed | TextWrapAndFrames: not-attributed | TextWrapAndFrames: failed |
| `./components/forge/document/TrackChangesView` | TrackChangesView: pass | TrackChangesView: pass | TrackChangesView: mounted |
| `./components/forge/document/TypographyInspector` | TypographyInspector: pass | TypographyInspector: pass | TypographyInspector: mounted |
| `./components/forge/document/list-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/document/outline-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/document/ribbon-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/formula-refs` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/frame-throttle` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/graph/PatchGraph` | PatchGraph: not-attributed | PatchGraph: not-attributed | PatchGraph: failed |
| `./components/forge/graph/model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/graphics/ImageCropOverlay` | ImageCropOverlay: not-attributed | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/graphics/crop` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/ink/BrushDynamicsInspector` | BrushDynamicsInspector: pass | BrushDynamicsInspector: pass | BrushDynamicsInspector: mounted |
| `./components/forge/ink/BrushPresetBrowser` | BrushPresetBrowser: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/ink/BrushStabilizationPreview` | BrushStabilizationPreview: missing-peer | load missing-peer (react-native-gesture-handler, react-native-skia) | load failed |
| `./components/forge/ink/BrushTaperControl` | BrushTaperControl: pass | BrushTaperControl: pass | BrushTaperControl: mounted |
| `./components/forge/ink/EraserModePicker` | EraserModePicker: not-attributed | EraserModePicker: not-attributed | EraserModePicker: failed |
| `./components/forge/ink/InkStrokePreview` | InkStrokePreview: missing-peer | load missing-peer (react-native-gesture-handler, react-native-skia) | load failed |
| `./components/forge/ink/InkToolbar` | InkToolbar: pass | InkToolbar: pass | InkToolbar: mounted |
| `./components/forge/ink/TimelapsePlaybackExporter` | TimelapsePlaybackExporter: pass | TimelapsePlaybackExporter: pass | TimelapsePlaybackExporter: mounted |
| `./components/forge/ink/brush-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/ink/ink-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/inputs/AssetPresetGallery` | AssetPresetGallery: pass | AssetPresetGallery: pass | AssetPresetGallery: mounted |
| `./components/forge/inputs/InstrumentKnob` | InstrumentKnob: not-attributed | InstrumentKnob: not-attributed | InstrumentKnob: failed |
| `./components/forge/inputs/InstrumentXYPad` | InstrumentXYPad: pass | InstrumentXYPad: pass | InstrumentXYPad: mounted |
| `./components/forge/inputs/OutlineTree` | OutlineTree: not-attributed | OutlineTree: not-attributed | OutlineTree: failed |
| `./components/forge/inputs/PointEditor2D` | PointEditor2D: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/inputs/PrecisionScrubber` | PrecisionScrubber: not-attributed | PrecisionScrubber: not-attributed | PrecisionScrubber: failed |
| `./components/forge/inputs/PropertyInspector` | PropertyInspector: not-attributed | PropertyInspector: not-attributed | PropertyInspector: failed |
| `./components/forge/inputs/precision` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/inputs/precision-scrubber-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/layers/ArtboardNavigator` | ArtboardNavigator: pass | ArtboardNavigator: pass | ArtboardNavigator: mounted |
| `./components/forge/layers/CanvasCompareView` | CanvasCompareView: not-attributed | CanvasCompareView: not-attributed | CanvasCompareView: failed |
| `./components/forge/layers/ClippingMaskControls` | ClipIndicator: pass<br>ClipToggle: pass | ClipIndicator: pass<br>ClipToggle: pass | ClipIndicator: mounted<br>ClipToggle: mounted |
| `./components/forge/layers/LayerBlendAndOpacity` | LayerBlendAndOpacity: pass | LayerBlendAndOpacity: pass | LayerBlendAndOpacity: mounted |
| `./components/forge/layers/LayerStack` | LayerStack: pass | LayerStack: pass | LayerStack: mounted |
| `./components/forge/layers/LayerThumbnail` | LayerThumbnail: not-attributed | LayerThumbnail: not-attributed | LayerThumbnail: failed |
| `./components/forge/layers/MaskThumbnailAndEditor` | MaskThumbnailAndEditor: pass | MaskThumbnailAndEditor: pass | MaskThumbnailAndEditor: mounted |
| `./components/forge/layers/artboard-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/layers/clipping-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/layers/compare-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/layers/layer-blend-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/layers/layer-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/layers/layer-thumbnail-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/layers/layer-tree-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/layers/mask-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/midi/MIDIPianoRoll` | MIDIPianoRoll: not-attributed | MIDIPianoRoll: not-attributed | MIDIPianoRoll: failed |
| `./components/forge/midi/MIDIVelocityLane` | MIDIVelocityLane: not-attributed | MIDIVelocityLane: not-attributed | MIDIVelocityLane: failed |
| `./components/forge/midi/MidiChannelPicker` | MidiChannelPicker: pass<br>MidiValueStepper: pass | MidiChannelPicker: pass<br>MidiValueStepper: pass | MidiChannelPicker: mounted<br>MidiValueStepper: mounted |
| `./components/forge/midi/StepSequencer` | StepSequencer: not-attributed | StepSequencer: not-attributed | StepSequencer: failed |
| `./components/forge/midi/note-grid` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/midi/velocity-line` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/motion/CameraAndLightControls` | CameraAndLightControls: not-attributed | CameraAndLightControls: not-attributed | CameraAndLightControls: failed |
| `./components/forge/motion/CompositionLayerTree` | CompositionLayerTree: not-attributed | CompositionLayerTree: not-attributed | CompositionLayerTree: failed |
| `./components/forge/motion/EasingPresetGallery` | EasingPresetGallery: pass | EasingPresetGallery: pass | EasingPresetGallery: mounted |
| `./components/forge/motion/EffectStackAndInspector` | EffectStackAndInspector: not-attributed | EffectStackAndInspector: not-attributed | EffectStackAndInspector: failed |
| `./components/forge/motion/ExpressionEditor` | ExpressionEditor: pass | ExpressionEditor: pass | ExpressionEditor: mounted |
| `./components/forge/motion/KeyframeSpeedGraph` | KeyframeSpeedGraph: not-attributed | KeyframeSpeedGraph: not-attributed | KeyframeSpeedGraph: failed |
| `./components/forge/motion/KeyframeValueGraph` | KeyframeValueGraph: not-attributed | KeyframeValueGraph: not-attributed | KeyframeValueGraph: failed |
| `./components/forge/motion/MatteAndMaskPanel` | MatteAndMaskPanel: not-attributed | MatteAndMaskPanel: not-attributed | MatteAndMaskPanel: failed |
| `./components/forge/motion/MotionKeyframeTimeline` | MotionKeyframeTimeline: not-attributed | MotionKeyframeTimeline: not-attributed | MotionKeyframeTimeline: failed |
| `./components/forge/motion/MotionPathEditor` | MotionPathEditor: pass | MotionPathEditor: pass | MotionPathEditor: mounted |
| `./components/forge/motion/NodeGraphEditor` | NodeGraphEditor: not-attributed | NodeGraphEditor: not-attributed | NodeGraphEditor: failed |
| `./components/forge/motion/ParticleEmitterControls` | ParticleEmitterControls: pass | ParticleEmitterControls: pass | ParticleEmitterControls: mounted |
| `./components/forge/motion/RenderQueuePanel` | RenderQueuePanel: pass | RenderQueuePanel: pass | RenderQueuePanel: mounted |
| `./components/forge/motion/TimeRemapCurve` | TimeRemapCurve: not-attributed | TimeRemapCurve: not-attributed | TimeRemapCurve: failed |
| `./components/forge/motion/Transform3DInspector` | Transform3DInspector: pass | Transform3DInspector: pass | Transform3DInspector: mounted |
| `./components/forge/motion/composition-tree` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/motion/motion-curves` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/motion/motion-easing` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/motion/motion-effects` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/motion/motion-expression` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/motion/motion-node-graph` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/motion/motion-path` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/motion/motion-render` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/motion/motion-settings` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/motion/motion-timeline` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/office/ReadAloudTransport` | ReadAloudTransport: pass | ReadAloudTransport: pass | ReadAloudTransport: mounted |
| `./components/forge/office/office-controls` | ChevronGlyph: pass<br>CloseMark: pass<br>PauseGlyph: pass<br>PlayGlyph: pass<br>PlusGlyph: pass<br>SkipGlyph: pass<br>ToolButton: pass | ChevronGlyph: pass<br>CloseMark: pass<br>PauseGlyph: pass<br>PlayGlyph: pass<br>PlusGlyph: pass<br>SkipGlyph: pass<br>ToolButton: pass | ChevronGlyph: mounted<br>CloseMark: mounted<br>PauseGlyph: mounted<br>PlayGlyph: mounted<br>PlusGlyph: mounted<br>SkipGlyph: mounted<br>ToolButton: mounted |
| `./components/forge/office/read-aloud-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/pdf/AnnotationToolbar` | AnnotationToolbar: pass | AnnotationToolbar: pass | AnnotationToolbar: mounted |
| `./components/forge/pdf/BookmarkOutline` | BookmarkOutline: not-attributed | BookmarkOutline: not-attributed | BookmarkOutline: failed |
| `./components/forge/pdf/CommentsThreadPanel` | CommentsThreadPanel: pass | CommentsThreadPanel: pass | CommentsThreadPanel: mounted |
| `./components/forge/pdf/EncryptPermissionsPanel` | EncryptPermissionsPanel: pass | EncryptPermissionsPanel: pass | EncryptPermissionsPanel: mounted |
| `./components/forge/pdf/ExtractMergeSplitDialog` | ExtractMergeSplitDialog: pass | ExtractMergeSplitDialog: pass | ExtractMergeSplitDialog: mounted |
| `./components/forge/pdf/HyperlinkInspector` | HyperlinkInspector: pass | HyperlinkInspector: pass | HyperlinkInspector: mounted |
| `./components/forge/pdf/PDFCompareOverlay` | PDFCompareOverlay: pass | PDFCompareOverlay: pass | PDFCompareOverlay: mounted |
| `./components/forge/pdf/PDFFormFieldEditor` | PDFFormFieldEditor: not-attributed | PDFFormFieldEditor: not-attributed | PDFFormFieldEditor: failed |
| `./components/forge/pdf/PDFInlineTextEdit` | PDFInlineTextEdit: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/pdf/PDFPageLayoutSelector` | PDFPageLayoutSelector: pass | PDFPageLayoutSelector: pass | PDFPageLayoutSelector: mounted |
| `./components/forge/pdf/PDFReadAloudTransport` | PDFReadAloudTransport: not-attributed | PDFReadAloudTransport: not-attributed | PDFReadAloudTransport: failed |
| `./components/forge/pdf/PDFScanSession` | PDFScanSession: not-attributed | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/pdf/PDFTextSelection` | PDFTextSelection: pass | PDFTextSelection: pass | PDFTextSelection: mounted |
| `./components/forge/pdf/PDFThumbnailSidebar` | PDFThumbnailSidebar: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/pdf/PDFVoiceNoteAttachment` | PDFVoiceNoteAttachment: not-attributed | PDFVoiceNoteAttachment: not-attributed | PDFVoiceNoteAttachment: failed |
| `./components/forge/pdf/PageReorderOrganizer` | PageReorderOrganizer: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/pdf/PrintAndExportPreview` | PrintAndExportPreview: not-attributed | PrintAndExportPreview: not-attributed | PrintAndExportPreview: failed |
| `./components/forge/pdf/RedactionReviewTool` | RedactionReviewTool: pass | RedactionReviewTool: pass | RedactionReviewTool: mounted |
| `./components/forge/pdf/SignatureStampTool` | SignatureStampTool: missing-peer | load missing-peer (react-native-gesture-handler, react-native-skia) | load failed |
| `./components/forge/pdf/TextSearchResults` | TextSearchResults: not-attributed | TextSearchResults: not-attributed | TextSearchResults: failed |
| `./components/forge/pdf/VirtualPDFPageViewer` | VirtualPDFPageViewer: pass | VirtualPDFPageViewer: pass | VirtualPDFPageViewer: mounted |
| `./components/forge/pdf/annotation-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/pdf/comments-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/pdf/search-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/photo/BatchExportPanel` | BatchExportPanel: pass | BatchExportPanel: pass | BatchExportPanel: mounted |
| `./components/forge/photo/BeforeAfterCompare` | BeforeAfterCompare: not-attributed | BeforeAfterCompare: not-attributed | BeforeAfterCompare: failed |
| `./components/forge/photo/CatalogFilterBar` | CatalogFilterBar: not-attributed | CatalogFilterBar: not-attributed | CatalogFilterBar: failed |
| `./components/forge/photo/CleanupAndRetouchPanel` | CleanupAndRetouchPanel: pass | CleanupAndRetouchPanel: pass | CleanupAndRetouchPanel: mounted |
| `./components/forge/photo/EightBandColorMixer` | EightBandColorMixer: not-attributed | EightBandColorMixer: not-attributed | EightBandColorMixer: failed |
| `./components/forge/photo/ExposureAndWhiteBalance` | ExposureAndWhiteBalance: not-attributed | ExposureAndWhiteBalance: not-attributed | ExposureAndWhiteBalance: failed |
| `./components/forge/photo/LensCorrectionPanel` | LensCorrectionPanel: pass | LensCorrectionPanel: pass | LensCorrectionPanel: mounted |
| `./components/forge/photo/LinearRadialGradientMask` | LinearRadialGradientMask: not-attributed | LinearRadialGradientMask: not-attributed | LinearRadialGradientMask: failed |
| `./components/forge/photo/LocalMaskBrush` | LocalMaskBrush: pass | LocalMaskBrush: pass | LocalMaskBrush: mounted |
| `./components/forge/photo/LuminanceColorRangeMask` | LuminanceColorRangeMask: pass | LuminanceColorRangeMask: pass | LuminanceColorRangeMask: mounted |
| `./components/forge/photo/PhotoLibraryGrid` | PhotoLibraryGrid: pass | PhotoLibraryGrid: pass | PhotoLibraryGrid: mounted |
| `./components/forge/photo/PhotoMetadataInspector` | PhotoMetadataInspector: pass | PhotoMetadataInspector: pass | PhotoMetadataInspector: mounted |
| `./components/forge/photo/PhotoVersionHistoryBrowser` | PhotoVersionHistoryBrowser: not-attributed | PhotoVersionHistoryBrowser: not-attributed | PhotoVersionHistoryBrowser: failed |
| `./components/forge/photo/PresetFilmstrip` | PresetFilmstrip: pass | PresetFilmstrip: pass | PresetFilmstrip: mounted |
| `./components/forge/photo/PresetManager` | PresetManager: not-attributed | PresetManager: not-attributed | PresetManager: failed |
| `./components/forge/photo/RAWDevelopPanel` | RAWDevelopPanel: not-attributed | RAWDevelopPanel: not-attributed | RAWDevelopPanel: failed |
| `./components/forge/photo/RatingAndFlagControl` | RatingAndFlagControl: pass | RatingAndFlagControl: pass | RatingAndFlagControl: mounted |
| `./components/forge/photo/ToneAndPresence` | ToneAndPresence: pass | ToneAndPresence: pass | ToneAndPresence: mounted |
| `./components/forge/photo/photo-adjustments` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/photo/photo-catalog` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/photo/photo-export` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/photo/photo-masks` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/photo/photo-metadata` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/photo/photo-presets` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/platform/AccessiblePrecisionScrubControl` | AccessiblePrecisionScrubControl: not-attributed | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/range-paste` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/range-tsv` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/selection/MagicSelectionControls` | MagicSelectionControls: pass<br>MagicWandCanvas: pass | MagicSelectionControls: pass<br>MagicWandCanvas: pass | MagicSelectionControls: mounted<br>MagicWandCanvas: mounted |
| `./components/forge/selection/MultiSelectionControls` | MultiSelectionControls: pass | MultiSelectionControls: pass | MultiSelectionControls: mounted |
| `./components/forge/selection/SelectionBounds` | SelectionBounds: pass | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/selection/SelectionMarquee` | SelectionMarquee: pass | SelectionMarquee: pass | SelectionMarquee: mounted |
| `./components/forge/selection/magic-selection-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/selection/multi-selection-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/selection/selection-bounds-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/selection/selection-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/sheet-window` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/slides/ChartAndTableEditor` | ChartAndTableEditor: pass | ChartAndTableEditor: pass | ChartAndTableEditor: mounted |
| `./components/forge/slides/ConnectorAndDiagramTools` | ConnectorAndDiagramTools: pass | ConnectorAndDiagramTools: pass | ConnectorAndDiagramTools: mounted |
| `./components/forge/slides/InkAndLaserPointer` | InkAndLaserPointer: missing-peer | load missing-peer (react-native-gesture-handler, react-native-skia) | load failed |
| `./components/forge/slides/MasterLayoutEditor` | MasterLayoutEditor: not-attributed | MasterLayoutEditor: not-attributed | MasterLayoutEditor: failed |
| `./components/forge/slides/MediaInsertInspector` | MediaInsertInspector: not-attributed | MediaInsertInspector: not-attributed | MediaInsertInspector: failed |
| `./components/forge/slides/MorphPreview` | MorphPreview: pass | MorphPreview: pass | MorphPreview: mounted |
| `./components/forge/slides/PresenterInkOverlay` | PresenterInkOverlay: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/slides/PresenterInkStrip` | PresenterInkStrip: pass | PresenterInkStrip: pass | PresenterInkStrip: mounted |
| `./components/forge/slides/PresenterView` | PresenterView: not-attributed | PresenterView: not-attributed | PresenterView: failed |
| `./components/forge/slides/RehearsalTimers` | RehearsalTimers: pass | RehearsalTimers: pass | RehearsalTimers: mounted |
| `./components/forge/slides/ShapePresetGallery` | ShapePresetGallery: not-attributed | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/slides/SlideAnimationPane` | SlideAnimationPane: pass | SlideAnimationPane: pass | SlideAnimationPane: mounted |
| `./components/forge/slides/SlideCanvas` | SlideCanvas: pass | SlideCanvas: pass | SlideCanvas: mounted |
| `./components/forge/slides/SlideFilmstrip` | SlideFilmstrip: pass | SlideFilmstrip: pass | SlideFilmstrip: mounted |
| `./components/forge/slides/SlideNotesEditor` | SlideNotesEditor: pass | SlideNotesEditor: pass | SlideNotesEditor: mounted |
| `./components/forge/slides/SlideSorter` | SlideSorter: pass | SlideSorter: pass | SlideSorter: mounted |
| `./components/forge/slides/SlideThumbnail` | SlideObjectView: pass<br>SlideThumbnail: pass | SlideObjectView: pass<br>SlideThumbnail: pass | SlideObjectView: mounted<br>SlideThumbnail: mounted |
| `./components/forge/slides/ThemeAndTemplateGallery` | ThemeAndTemplateGallery: not-attributed | ThemeAndTemplateGallery: not-attributed | ThemeAndTemplateGallery: failed |
| `./components/forge/slides/TransitionPicker` | TransitionPicker: pass | TransitionPicker: pass | TransitionPicker: mounted |
| `./components/forge/slides/animation-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/slides/canvas-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/slides/presenter-ink-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/slides/slide-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/spreadsheet/CellFormatInspector` | CellFormatInspector: not-attributed | CellFormatInspector: not-attributed | CellFormatInspector: failed |
| `./components/forge/spreadsheet/CellSelectionOverlay` | CellSelectionOverlay: not-attributed | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/spreadsheet/ChartBuilder` | ChartBuilder: pass | ChartBuilder: pass | ChartBuilder: mounted |
| `./components/forge/spreadsheet/ConditionalFormatRules` | ConditionalFormatRules: not-attributed | ConditionalFormatRules: not-attributed | ConditionalFormatRules: failed |
| `./components/forge/spreadsheet/DataImportWizard` | DataImportWizard: not-attributed | DataImportWizard: not-attributed | DataImportWizard: failed |
| `./components/forge/spreadsheet/FillHandleAndAutoFill` | AutoFillModePicker: pass<br>FillHandleAndAutoFill: not-attributed | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/spreadsheet/FormulaAutocomplete` | FormulaAutocomplete: pass | FormulaAutocomplete: pass | FormulaAutocomplete: mounted |
| `./components/forge/spreadsheet/FormulaBar` | FormulaBar: pass | FormulaBar: pass | FormulaBar: mounted |
| `./components/forge/spreadsheet/FormulaReferenceText` | FormulaReferenceText: pass | FormulaReferenceText: pass | FormulaReferenceText: mounted |
| `./components/forge/spreadsheet/FreezeSplitControls` | FreezeSplitControls: pass | FreezeSplitControls: pass | FreezeSplitControls: mounted |
| `./components/forge/spreadsheet/NameBox` | NameBox: pass | NameBox: pass | NameBox: mounted |
| `./components/forge/spreadsheet/PivotFieldList` | PivotFieldList: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/spreadsheet/RangeComments` | RangeComments: not-attributed | RangeComments: not-attributed | RangeComments: failed |
| `./components/forge/spreadsheet/ReferenceColorizer` | ReferenceColorizer: pass | ReferenceColorizer: pass | ReferenceColorizer: mounted |
| `./components/forge/spreadsheet/SavedSheetViewManager` | SavedSheetViewManager: pass | SavedSheetViewManager: pass | SavedSheetViewManager: mounted |
| `./components/forge/spreadsheet/SheetTabs` | SheetTabs: pass | SheetTabs: pass | SheetTabs: mounted |
| `./components/forge/spreadsheet/SortFilterHeader` | SortFilterHeader: pass | SortFilterHeader: pass | SortFilterHeader: mounted |
| `./components/forge/spreadsheet/Sparkline` | Sparkline: pass | Sparkline: pass | Sparkline: mounted |
| `./components/forge/spreadsheet/SparklineEditor` | SparklineEditor: pass | SparklineEditor: pass | SparklineEditor: mounted |
| `./components/forge/spreadsheet/SplitSpreadsheetView` | SplitSpreadsheetView: pass | SplitSpreadsheetView: pass | SplitSpreadsheetView: mounted |
| `./components/forge/spreadsheet/SpreadsheetCardsView` | SpreadsheetCardsView: pass | SpreadsheetCardsView: pass | SpreadsheetCardsView: mounted |
| `./components/forge/spreadsheet/TableStyleGallery` | TableStyleGallery: pass | TableStyleGallery: pass | TableStyleGallery: mounted |
| `./components/forge/spreadsheet/ValidationDropdown` | ValidationDropdown: pass | ValidationDropdown: pass | ValidationDropdown: mounted |
| `./components/forge/spreadsheet/VirtualSpreadsheetGrid` | VirtualSpreadsheetGrid: pass | VirtualSpreadsheetGrid: pass | VirtualSpreadsheetGrid: mounted |
| `./components/forge/spreadsheet/cards-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/spreadsheet/chart-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/spreadsheet/fill-handle` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/spreadsheet/freeze-split-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/spreadsheet/reference-colors` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/spreadsheet/sheet-tabs-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/spreadsheet/sparkline-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/timebase` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/timeline/AudioClipWaveform` | AudioClipWaveform: not-attributed | AudioClipWaveform: not-attributed | AudioClipWaveform: failed |
| `./components/forge/timeline/AutoCaptionTranscriptTimeline` | AutoCaptionTranscriptTimeline: not-attributed | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/timeline/AutoReframeGuides` | AutoReframeGuides: not-attributed | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/timeline/BatchEditPanel` | BatchEditPanel: not-attributed | BatchEditPanel: not-attributed | BatchEditPanel: failed |
| `./components/forge/timeline/CaptionWordTimingHandles` | CaptionWordTimingHandles: not-attributed | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/timeline/ClipTrimHandles` | ClipTrimHandles: not-attributed | ClipTrimHandles: not-attributed | ClipTrimHandles: failed |
| `./components/forge/timeline/CoverFramePicker` | CoverFramePicker: not-attributed | CoverFramePicker: not-attributed | CoverFramePicker: failed |
| `./components/forge/timeline/DragReorderAndRipple` | DragReorderAndRipple: not-attributed | DragReorderAndRipple: not-attributed | DragReorderAndRipple: failed |
| `./components/forge/timeline/ExportMonitor` | ExportMonitor: pass | ExportMonitor: pass | ExportMonitor: mounted |
| `./components/forge/timeline/FrameAccurateScrubber` | FrameAccurateScrubber: missing-peer | load missing-peer (@expo/ui, @expo/ui/jetpack-compose, @expo/ui/swift-ui, @expo/ui/swift-ui/modifiers) | load failed |
| `./components/forge/timeline/InOutRangeHandles` | InOutRangeHandles: pass | InOutRangeHandles: pass | InOutRangeHandles: mounted |
| `./components/forge/timeline/JKLShuttleController` | JKLShuttleController: pass | JKLShuttleController: pass | JKLShuttleController: mounted |
| `./components/forge/timeline/LoopRangeBar` | LoopRangeBar: pass | LoopRangeBar: pass | LoopRangeBar: mounted |
| `./components/forge/timeline/MediaMonitor` | MediaMonitor: pass | MediaMonitor: pass | MediaMonitor: mounted |
| `./components/forge/timeline/ModeEdgeHandles` | ModeEdgeHandles: pass | ModeEdgeHandles: pass | ModeEdgeHandles: mounted |
| `./components/forge/timeline/MotionTrackingOverlay` | MotionTrackingOverlay: pass | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/timeline/MulticamAngleViewer` | MulticamAngleViewer: pass | MulticamAngleViewer: pass | MulticamAngleViewer: mounted |
| `./components/forge/timeline/OverlayAndEffectsTrackStack` | OverlayAndEffectsTrackStack: not-attributed | OverlayAndEffectsTrackStack: not-attributed | OverlayAndEffectsTrackStack: failed |
| `./components/forge/timeline/PictureInPictureControls` | PictureInPictureControls: pass | PictureInPictureControls: pass | PictureInPictureControls: mounted |
| `./components/forge/timeline/PlaybackRateMenu` | PlaybackRateMenu: pass | PlaybackRateMenu: pass | PlaybackRateMenu: mounted |
| `./components/forge/timeline/ProgramMonitor` | ProgramMonitor: pass | ProgramMonitor: pass | ProgramMonitor: mounted |
| `./components/forge/timeline/RazorSplitTool` | RazorSplitTool: not-attributed | RazorSplitTool: not-attributed | RazorSplitTool: failed |
| `./components/forge/timeline/RenderCacheIndicator` | RenderCacheIndicator: pass | RenderCacheIndicator: pass | RenderCacheIndicator: mounted |
| `./components/forge/timeline/RollSlipSlideControls` | RollSlipSlideControls: not-attributed | RollSlipSlideControls: not-attributed | RollSlipSlideControls: failed |
| `./components/forge/timeline/SafeAreaOverlay` | SafeAreaOverlay: pass | SafeAreaOverlay: pass | SafeAreaOverlay: mounted |
| `./components/forge/timeline/ScopesDock` | ScopesDock: not-attributed | ScopesDock: not-attributed | ScopesDock: failed |
| `./components/forge/timeline/SeekBar` | SeekBar: pass | SeekBar: pass | SeekBar: mounted |
| `./components/forge/timeline/SourceMonitor` | SourceMonitor: pass | SourceMonitor: pass | SourceMonitor: mounted |
| `./components/forge/timeline/StickerMotionLane` | StickerMotionLane: not-attributed | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/forge/timeline/TimecodeDisplay` | TimecodeDisplay: pass | TimecodeDisplay: pass | TimecodeDisplay: mounted |
| `./components/forge/timeline/TimelineClipLane` | TimelineClipLane: not-attributed | TimelineClipLane: not-attributed | TimelineClipLane: failed |
| `./components/forge/timeline/TimelineMarkers` | TimelineMarkers: pass | TimelineMarkers: pass | TimelineMarkers: mounted |
| `./components/forge/timeline/TimelinePlayhead` | TimelinePlayhead: pass | TimelinePlayhead: pass | TimelinePlayhead: mounted |
| `./components/forge/timeline/TimelineRuler` | TimelineRuler: pass | TimelineRuler: pass | TimelineRuler: mounted |
| `./components/forge/timeline/TimelineZoomAndScroll` | TimelineZoomAndScroll: pass | TimelineZoomAndScroll: pass | TimelineZoomAndScroll: mounted |
| `./components/forge/timeline/TrackHeaders` | TrackHeaders: not-attributed | TrackHeaders: not-attributed | TrackHeaders: failed |
| `./components/forge/timeline/TransitionHandles` | TransitionHandles: not-attributed | TransitionHandles: not-attributed | TransitionHandles: failed |
| `./components/forge/timeline/TransitionPresetBrowser` | TransitionPresetBrowser: pass | TransitionPresetBrowser: pass | TransitionPresetBrowser: mounted |
| `./components/forge/timeline/TransportControls` | TransportControls: pass | TransportControls: pass | TransportControls: mounted |
| `./components/forge/timeline/VideoEffectsBrowser` | VideoEffectsBrowser: not-attributed | VideoEffectsBrowser: not-attributed | VideoEffectsBrowser: failed |
| `./components/forge/timeline/VideoFilmstrip` | VideoFilmstrip: pass | VideoFilmstrip: pass | VideoFilmstrip: mounted |
| `./components/forge/timeline/VideoQualityInspector` | VideoQualityInspector: pass | VideoQualityInspector: pass | VideoQualityInspector: mounted |
| `./components/forge/timeline/VideoSpeedRampCurve` | VideoSpeedRampCurve: not-attributed | VideoSpeedRampCurve: not-attributed | VideoSpeedRampCurve: failed |
| `./components/forge/timeline/VideoStabilizationInspector` | VideoStabilizationInspector: pass | VideoStabilizationInspector: pass | VideoStabilizationInspector: mounted |
| `./components/forge/timeline/batch` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/timeline/edits` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/timeline/loop-range` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/timeline/markers` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/timeline/placement` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/timeline/ruler` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/timeline/safe-area` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/timeline/shuttle` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/timeline/time` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/timeline/track-stack` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/timeline/transition-presets` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/timeline/transitions` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/timeline/trim-modes` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/timeline/viewport` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/timeline/waveform-cache` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/vector/FillStrokeInspector` | FillStrokeInspector: pass | FillStrokeInspector: pass | FillStrokeInspector: mounted |
| `./components/forge/vector/GradientOnCanvasHandles` | GradientOnCanvasHandles: not-attributed | GradientOnCanvasHandles: not-attributed | GradientOnCanvasHandles: failed |
| `./components/forge/vector/PenNodeEditor` | PenNodeEditor: pass | PenNodeEditor: pass | PenNodeEditor: mounted |
| `./components/forge/vector/ShapeBuilder` | ShapeBuilder: pass | ShapeBuilder: pass | ShapeBuilder: mounted |
| `./components/forge/vector/fill-stroke-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/vector/gradient-handles-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/vector/pen-node-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/vector/shape-builder-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/vector/vector-types` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forge/waveform` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forms/choice-keys` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/forms/option-groups` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/gestures/GestureHandlerDrag` | GestureHandlerDrag: missing-peer | load missing-peer (react-native-gesture-handler) | load failed |
| `./components/gestures/PanResponderDrag` | PanResponderDrag: not-attributed | PanResponderDrag: not-attributed | PanResponderDrag: failed |
| `./components/gestures/drag-controller` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/gestures/drag-transport` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/html` | Article: pass<br>Aside: pass<br>Footer: pass<br>Header: pass<br>Heading: pass<br>Input: pass<br>Link: pass<br>Main: pass<br>Nav: pass<br>Page: pass<br>Paragraph: pass<br>Section: pass<br>Text: pass | Article: pass<br>Aside: pass<br>Footer: pass<br>Header: pass<br>Heading: pass<br>Input: pass<br>Link: pass<br>Main: pass<br>Nav: pass<br>Page: pass<br>Paragraph: pass<br>Section: pass<br>Text: pass | Article: mounted<br>Aside: mounted<br>Footer: mounted<br>Header: mounted<br>Heading: mounted<br>Input: mounted<br>Link: mounted<br>Main: mounted<br>Nav: mounted<br>Page: mounted<br>Paragraph: mounted<br>Section: mounted<br>Text: mounted |
| `./components/layout/AdaptiveColumns` | AdaptiveColumn: pass<br>AdaptiveColumns: pass | AdaptiveColumn: pass<br>AdaptiveColumns: pass | AdaptiveColumn: mounted<br>AdaptiveColumns: mounted |
| `./components/layout/ContentFrame` | ContentFrame: pass | ContentFrame: pass | ContentFrame: mounted |
| `./components/navigation/CollapsibleDrawer` | CollapsibleDrawer: pass | CollapsibleDrawer: pass | CollapsibleDrawer: mounted |
| `./components/navigation/drawer-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/overlays/AnchoredPopover` | AnchoredPopover: pass | AnchoredPopover: pass | AnchoredPopover: mounted |
| `./components/overlays/CommandPalette` | CommandPalette: pass | CommandPalette: pass | CommandPalette: mounted |
| `./components/overlays/CommandPopover` | CommandPopover: pass | CommandPopover: pass | CommandPopover: mounted |
| `./components/overlays/anchored-popover-types` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/overlays/command-filter` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/overlays/focus-cycle` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/overlays/focus-restore` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/overlays/measure-anchor` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/overlays/popover-position` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/overlays/useTriggerAnchor` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/AdaptiveDock` | AdaptiveDock: pass | AdaptiveDock: pass | AdaptiveDock: mounted |
| `./components/shell/AssetBrowser` | AssetBrowser: pass | AssetBrowser: pass | AssetBrowser: mounted |
| `./components/shell/ContextMenu` | ContextMenu: pass | ContextMenu: pass | ContextMenu: mounted |
| `./components/shell/ContextualToolbar` | ContextualToolbar: pass | ContextualToolbar: pass | ContextualToolbar: mounted |
| `./components/shell/DocumentTabBar` | DocumentTabBar: pass | DocumentTabBar: pass | DocumentTabBar: mounted |
| `./components/shell/FindReplaceContent` | FindReplaceContent: pass | FindReplaceContent: pass | FindReplaceContent: mounted |
| `./components/shell/FindReplacePopover` | FindReplacePopover: pass | FindReplacePopover: pass | FindReplacePopover: mounted |
| `./components/shell/FocusAndA11yLayer` | FocusAndA11yLayer: pass | FocusAndA11yLayer: pass | FocusAndA11yLayer: mounted |
| `./components/shell/HistoryPanel` | HistoryPanel: pass | HistoryPanel: pass | HistoryPanel: mounted |
| `./components/shell/InspectorPanel` | InspectorPanel: pass | InspectorPanel: pass | InspectorPanel: mounted |
| `./components/shell/InspectorSearch` | InspectorSearch: pass | InspectorSearch: pass | InspectorSearch: mounted |
| `./components/shell/InspectorSection` | InspectorSection: pass | InspectorSection: pass | InspectorSection: mounted |
| `./components/shell/KeyboardShortcutHUD` | KeyboardShortcutHUD: pass | KeyboardShortcutHUD: pass | KeyboardShortcutHUD: mounted |
| `./components/shell/MenuButton` | MenuButton: pass | MenuButton: pass | MenuButton: mounted |
| `./components/shell/NumericScrubField` | NumericScrubField: not-attributed | NumericScrubField: not-attributed | NumericScrubField: failed |
| `./components/shell/PaneSplitter` | PaneSplitter: pass | PaneSplitter: pass | PaneSplitter: mounted |
| `./components/shell/PresetGallery` | PresetGallery: pass | PresetGallery: pass | PresetGallery: mounted |
| `./components/shell/PropertyRow` | PropertyRow: pass | PropertyRow: pass | PropertyRow: mounted |
| `./components/shell/RangeSlider` | RangeSlider: not-attributed | RangeSlider: not-attributed | RangeSlider: failed |
| `./components/shell/RibbonTabs` | RibbonTabs: not-attributed | RibbonTabs: not-attributed | RibbonTabs: failed |
| `./components/shell/RotaryKnob` | RotaryKnob: not-attributed | RotaryKnob: not-attributed | RotaryKnob: failed |
| `./components/shell/SliderField` | SliderField: not-attributed | SliderField: not-attributed | SliderField: failed |
| `./components/shell/SplitButton` | SplitButton: pass | SplitButton: pass | SplitButton: mounted |
| `./components/shell/StatusBar` | StatusBar: pass | StatusBar: pass | StatusBar: mounted |
| `./components/shell/ToastAndProgress` | ToastAndProgress: not-attributed | ToastAndProgress: not-attributed | ToastAndProgress: failed |
| `./components/shell/ToolRail` | ToolRail: pass | ToolRail: pass | ToolRail: mounted |
| `./components/shell/UnitInput` | UnitInput: pass | UnitInput: pass | UnitInput: mounted |
| `./components/shell/WorkspaceHost` | WorkspaceHost: not-attributed | WorkspaceHost: not-attributed | WorkspaceHost: failed |
| `./components/shell/WorkspacePresetSwitcher` | WorkspacePresetSwitcher: pass | WorkspacePresetSwitcher: pass | WorkspacePresetSwitcher: mounted |
| `./components/shell/a11y-audit` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/a11y-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/asset-browser-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/contextual-toolbar-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/dock-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/document-tabs-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/find-replace-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/history-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/inspector-context` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/inspector-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/keyboard-map` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/preset-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/progress-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/ribbon-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/screen-reader-focus` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/shell-keys` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/shortcut-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/slider-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/splitter-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/status-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/tool-rail-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/unit-expression` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/workspace-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/shell/workspace-preset-model` | loaded (no components) | loaded (no components) | loaded (no components) |
| `./components/theme/NightScope` | NightScope: missing-peer | load missing-peer (uniwind) | load failed |

## Lane failures with errors


## Provenance

```json
{
  "reference": {
    "preparation": {
      "schema": 1,
      "lane": "web-reference",
      "props": {
        "sha256": "e92c81656777cd56ac615c57313a4575d9e532679a140f68894b3217a8c0a4ff",
        "rule": "required props only; string 'Sample', number 1, boolean false, first literal, no-op functions, one-item arrays, depth 4"
      },
      "ui": {
        "archive": "nyc-tron-ui-1.0.0-rc.1.tgz",
        "sha256": "f4b5a055669437612c2e973bb0422be1393b91ce2bbfa4e2d0acad726080f238"
      },
      "core": {
        "archive": "nyc-tron-core-1.0.0-rc.1.tgz",
        "sha256": "cdc542ab60b7e232779570a670528ea5ac948522d957651bf4d04e9890785e8d"
      },
      "runtime": {
        "react": "19.3.0",
        "react-dom": "19.3.0",
        "react-native-web": "0.21.4",
        "zustand": "5.0.16",
        "esbuild": "0.28.2",
        "playwright": "1.62.1"
      },
      "exports": 555
    },
    "run": {
      "schema": 1,
      "lane": "web-reference",
      "startedAt": "2026-11-12T10:16:43.732Z",
      "status": "completed",
      "unattributedPageErrors": [],
      "finishedAt": "2026-11-12T10:17:08.491Z"
    }
  },
  "windows": {
    "preparation": {
      "schema": 1,
      "lane": "windows",
      "entryFile": "index.js",
      "props": {
        "file": "props.json",
        "sha256": "e92c81656777cd56ac615c57313a4575d9e532679a140f68894b3217a8c0a4ff",
        "rule": "required props only; string 'Sample', number 1, boolean false, first literal, no-op functions, one-item arrays, depth 4"
      },
      "ui": {
        "version": "1.0.0-rc.1",
        "archive": "nyc-tron-ui-1.0.0-rc.1.tgz",
        "sha256": "f4b5a055669437612c2e973bb0422be1393b91ce2bbfa4e2d0acad726080f238",
        "installedWith": "tar extraction; peers not resolved"
      },
      "runtime": {
        "react": "19.2.3",
        "react-native": "0.85.3",
        "react-native-windows": "0.85.0",
        "react-native-macos": null,
        "@legendapp/spark": null,
        "expo": null,
        "zustand": "5.0.8",
        "@nyc-tron/core": "1.0.0-rc.1"
      },
      "exports": 555,
      "bareSpecifiers": [
        "@expo/ui",
        "@expo/ui/jetpack-compose",
        "@expo/ui/swift-ui",
        "@expo/ui/swift-ui/modifiers",
        "@nyc-tron/core/folds",
        "@nyc-tron/core/overlays",
        "@tanstack/react-table",
        "expo-drag-drop-content-view",
        "expo-linear-gradient",
        "react",
        "react-native",
        "react-native-gesture-handler",
        "react-native-skia",
        "react/jsx-runtime",
        "uniwind",
        "zustand",
        "zustand/vanilla"
      ]
    },
    "run": {
      "schema": 1,
      "lane": "windows",
      "startedAt": "2026-11-12T10:32:45.5384732Z",
      "status": "completed",
      "lastProgress": "running:419/420:./components/forge/platform/AccessiblePrecisionScrubControl#AccessiblePrecisionScrubControl",
      "lastProgressAt": "2026-11-12T10:33:15.5649973Z",
      "finalStatus": "done:420:14",
      "finishedAt": "2026-11-12T10:33:16.7175956Z"
    }
  },
  "macos": {
    "preparation": {
      "schema": 1,
      "lane": "macos",
      "entryFile": "index.ts",
      "props": {
        "file": "props.json",
        "sha256": "e92c81656777cd56ac615c57313a4575d9e532679a140f68894b3217a8c0a4ff",
        "rule": "required props only; string 'Sample', number 1, boolean false, first literal, no-op functions, one-item arrays, depth 4"
      },
      "ui": {
        "version": "1.0.0-rc.1",
        "archive": "nyc-tron-ui-1.0.0-rc.1.tgz",
        "sha256": "f4b5a055669437612c2e973bb0422be1393b91ce2bbfa4e2d0acad726080f238",
        "installedWith": "tar extraction; peers not resolved"
      },
      "runtime": {
        "react": "19.2.0",
        "react-native": "0.83.10",
        "react-native-windows": "0.83.2",
        "react-native-macos": "0.83.0",
        "@legendapp/spark": "0.0.3",
        "expo": "55.0.32",
        "zustand": "5.0.8",
        "@nyc-tron/core": "1.0.0-rc.1"
      },
      "exports": 555,
      "bareSpecifiers": [
        "@expo/ui",
        "@expo/ui/jetpack-compose",
        "@expo/ui/swift-ui",
        "@expo/ui/swift-ui/modifiers",
        "@nyc-tron/core/folds",
        "@nyc-tron/core/overlays",
        "@tanstack/react-table",
        "expo-drag-drop-content-view",
        "expo-linear-gradient",
        "react",
        "react-native",
        "react-native-gesture-handler",
        "react-native-skia",
        "react/jsx-runtime",
        "uniwind",
        "zustand",
        "zustand/vanilla"
      ]
    },
    "run": {
      "schema": 1,
      "lane": "macos",
      "startedAt": "2026-11-12T10:37:57.713Z",
      "status": "completed",
      "lastProgress": "running:363/367:./components/forge/cad/DraftingCommandLine#DraftingCommandLine",
      "lastProgressAt": "2026-11-12T10:38:34.651Z",
      "finalStatus": "done:367:14",
      "finishedAt": "2026-11-12T10:38:35.671Z",
      "processExit": {
        "code": null,
        "signal": null
      }
    }
  }
}
```
