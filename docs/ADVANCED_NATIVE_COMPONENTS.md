# Advanced native instruments + portability program

## Status as of 2026-11-04

- NYC-Tron PR #2 is stacked on PR #1; neither is a production release.
- Source implementation in PR #2: InstrumentKnob, InstrumentXYPad, TreeGrid, PatchGraph, ImageCropOverlay, CommandPopover.
- Tested pure primitives: precision math, graph validation and bezier routing, crop geometry, tree projection, hinge-safe popup placement, XR ray-sphere/plane intersection, pinch hysteresis.
- Not done: native SwiftUI/Compose/WinUI/AppKit UI adapters, real platform device tests, Ink runtime, waveform GPU renderer, image processor, DSP ports, 3D splat renderer or XR compositor. The registry marks these PLANNED.
- Keep the complete 341-contract Nitro Forge inventory authoritative. This is an *additive* register for previously untracked or cross-app cases, not a claim that the original list is delivered.

## Shared-source rules

1. NYC-Tron owns reusable RN/Expo/desktop/XR visual and interaction components under packages/ui/src/components; reuse direct subpath exports. Tailwind v4 / Uniwind styling belongs to each consumer, with unstyled escape and token mapping for native OS resources.
2. Nitro Forge owns document state, decoder and image/audio/DSP processing, undo, persistence, native binary/session transport, and typed business commands. Never import a Forge engine from the UI library.
3. Use Zustand only for ephemeral presentation state; engine documents remain the source of truth. onPreview is transient; onCommit is one command on release. For high-frequency tools, replace RN view raster paths with Skia v3/Graphite / platform graphics adapters.
4. No raw HTML, WebView editor shells or Expo Audio/Expo Video. Cadence uses react-native-audio-api where appropriate; Splice video decoder adapters require a dedicated native module.
5. Provide iOS/Android/web/Windows/macOS implementations or an explicit unsupported-platform contract. Surface Duo hinges and occlusions are supplied by the layout owner; never infer hardware from viewport width. XR dimensions use meters.
6. Kinetrell motion, Rive icons, accessibility, touch/pen/mouse/keyboard/VoiceOver/TalkBack, reduced motion and RTL are required product-level acceptance gates.

## Source-port admission — not source copied yet

| Source | License metadata | Target | Required admission |
| --- | --- | --- | --- |
| AudioKit/Controls | MIT | RotaryKnob, XYPad, fine sliders | SwiftUI vs Compose/web behavior parity, copyright notice |
| AudioKit/Flow | MIT | PatchGraph and typed port UI | Real graph connect, move, undo, high-node-count GPU render |
| AudioKit/PianoRoll + Waveform | MIT | Cadence note grid, waveform | MIDI transport and accurate sample timing via Rust/Audio API |
| google/ink | Apache-2.0 | Board, Prism, Muse ink | Native stroke lifecycle, tool/pressure/palm rejection, PencilKit interoperability |
| MetalPetal/MetalPetal | MIT | Prism GPU image pipeline | Metal target, file-level license, crossplatform render parity |
| AcademySoftwareFoundation/OpenColorIO | BSD-3-Clause | LUT, color management | Config provenance, profiles, ICC, output/soft proof correctness |
| guoyingtao/Mantis | MIT | Crop overlay | Engine-owned crop transaction, gestures, a11y, actual pixels |
| Yalantis/uCrop | REVIEW | Android crop adapter | Inspect file license and transitive dependencies before any copy |
| patrykandpatrick/vico | Apache-2.0 | Native chart adapters | React Native custom renderer, scroll and series semantics |
| google/filament | Apache-2.0 | 3D viewer and material inspector | Verify Android/iOS/desktop builds, Viro interoperability, asset loading |
| CommunityToolkit/Windows + microsoft/Win2D | REVIEW (GitHub SPDX unasserted) | Windows native controls/GPU | Verify actual LICENSE + subproject licenses, WinUI 3 build |
| artcraft-android/procraft, filmcraft-android, lightcraft-android | Apache-2.0 metadata | Brush, timeline and color source candidates | File notices and asset review, native iOS/web counterparts |
| artcraft-android/capcraft-android | AGPL-3.0 | Optional video/speed/AI source | Legal combined-work review; disclose corresponding source and build scripts |

License metadata is not permission to copy a particular file, asset, dependency or submodule. Pin commit SHAs and document modifications per admitted file. Translating Java/Kotlin/Swift source into other languages does not defeat a copyleft license. No external source is copied by this PR.

## Additional component families (previously missing)

| Family | Concrete controls to implement | Consumer / authority |
| --- | --- | --- |
| Rigging | BoneManipulator, IKPoseHandle, WeightPaintOverlay, RigHierarchy, AnimationRetargetPanel | NYC-MON and 3D authoring; renderer authority |
| Gaussian splat | GaussianSplatViewport, SplatSelectionBrush, DepthLayerInspector, SceneCapturePanel | Spatial authoring; streamed asset renderer |
| Patchbay | PatchCable, TypedPort, RoutingMatrix, SignalInspector, NodeGraphGPU | Cadence/audio, material graphs, AI workflow tools; separate graph engine |
| Hierarchical data | TreeGrid, ExpandableCell, ColumnReorderHandle, DependencyGraph, DiffMergeViewer | Tally/Moyo Business; native table and data engine |
| XR input | GazeFocusRing, HandGrabHandle, SpatialRadialMenu, DepthAwarePopover, TwoHandTransform | Viro/PICO/visionOS/Specs; headset input APIs |
| Additional platform | NativeMultiWindowDragDrop, MapOverlayCanvas, WatchModelViewerHandoff, AIChangeApprovalPanel | Window managers, native maps, watch app, controlled AI suggestions |

## Delivery slices and acceptance

- **Slice A — committed:** precision instruments, tree navigation, bounded patch graph interaction, crop overlay, portable native modal menu, spatial math contracts and tests. Not device verified.
- **Slice B — next:** native popover/menu adapters and keyboard focus; adaptive dock and multiwindow lifecycle; true foldable-safe anchored menus. Test iOS/Android/Windows/macOS.
- **Slice C — next:** Google Ink pressure/prediction and Logitech Muse native pairing; board capture, crop pixel engine, GPU color management. Validate with pen hardware and actual exported documents.
- **Slice D — next:** AudioKit controls and cross-platform piano roll, DSP waveform and spectrogram; FilmCraft timeline, Media3/AVFoundation decoder surfaces, accurate seek and export. No Expo Audio/Video.
- **Slice E — next:** native charts, frozen panes, clipboard/keyboard and huge-sheet performance on Tally. Keep responsive card mode on narrow DataTable panes.
- **Slice F — next:** Filament/Three/Viro model viewer, Gaussian splat/rig controls, gaze/hand interaction and watch-to-app 3D-viewer deep link. End-to-end headset verification.

All slices must run source/type/unit tests, CI packaging, real device gestures, screen readers, performance budgets, legal checks, and app-specific Moyo/NYC-MON/Forge themes before 'complete' is marked. An issue/contract is not code; a successful GitHub source CI is not native device evidence.
