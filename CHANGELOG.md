# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions apply to all
fifteen distributable packages together: thirteen workspace packages from
`tooling/pack-release.mjs` and two isolated desktop packages retained from their
successful native consumer jobs.

## [1.0.0] - Unreleased

Changes since `v0.1.0-alpha.4`. This remains a release candidate; no v1.0.0
tag or release is implied. Scope and release conditions are recorded in
[docs/V1_DECISIONS.md](docs/V1_DECISIONS.md).

All 341 original rows now have implementation owners: 332 local implementations
and nine pinned external implementations, including all twelve previously
deferred native/service rows. All 341 rows keep `acceptance: "unverified"`;
none has complete accepted evidence across the eight required platforms.
The [candidate report](docs/completion/reports/V1-RELEASE-GATES.md) records
actual native and browser results against their own source and archive inputs.

### Added

- **Shell and workspace** (P04): workspace identity and docking, scoped shell
  commands, inspector and precision input ownership, asset history, find and
  progress controls. Native overlay scenario run on iOS and Android
  (`3333d09`; results in `docs/completion/P04-native-overlays-proof.json`).
- **Canvas** (P05): canvas pan and pinch navigation, rulers, snapping and
  pivot edits, multi-selection with shared property transactions, selection
  bounds editing, layer groups with inherited locks and reparenting, alpha and
  compositing policy controls, masks and clipping, artboard navigation, vector
  and guided crop controls, and a Skia 3 Graphite canvas viewport
  (`cd6ede2`).
- **Brush and ink** (P06): brush, ink, pen and timelapse controls.
- **Color** (P07): profile-preserving color management, curves, meshes,
  grading and decoded scopes, native Display P3 disc rendering.
- **Photo**: non-destructive develop and rating, virtualized catalog and
  source metadata, presets, version restore, batch export contracts, mask and
  retouch controls.
- **Motion**: scene controls, render queue and easing presets, Bezier value
  and speed graphs, keyframe timeline, virtualized composition layer tree,
  motion path editing, effect stack and inspector, expression editor with
  owned language services, typed node graph.
- **Timeline and video** (P08): scoped transport, seek and range controls,
  timeline editing family, monitors, cached media, multicam and playback
  status, video production components.
- **Audio and MIDI** (P09): input, automation, fader and metering controls;
  clip comping, recording and clock workflows; processing, speech and sound
  library controls; mixer analysis, presets and MIDI editors; rational MIDI
  grids with controlled scrolling; app-owned audio targets and localized
  labels.
- **Documents**: typography, page layout, ruler and table controls; review,
  structure and speech controls; text surfaces, frames and references;
  host-authoritative list markers.
- **Spreadsheet**: virtual grid, formula and range controls; formatting,
  pivot, import and saved views; sheet management, charts and virtual record
  views.
- **Slides**: master, theme, shape and presenter workflows; connectors, morph,
  media and chart-table tools; virtual deck canvas, animation and native ink.
- **PDF**: virtual page selection, bookmarks and text edit; organization and
  output; signature, form and capture components.
- **Design, 3D and CAD**: layout styles and variables, prototype
  collaboration and handoff, 3D and texture authoring controls, CAD graph and
  drafting components.
- **Platform**: native video presentation timestamps, platform controls and
  native video surfaces, host-owned sizing bounds.
- **Media services**: Android decoder over MediaExtractor and MediaCodec
  (`c903eba`), decoded browser frame timestamps and cancellable media
  requests, persisted checkpoints in `@nyc-tron/platform-services`
  (`./checkpoints`).
- **Geometry**: standalone overlay placement port at
  `@nyc-tron/geometry/overlay-placement`, with sources pinned to verified
  commits (PR #26).
- **Exports**: 254 new `@nyc-tron/ui` subpaths, plus new subpaths in
  `core`, `native-controls`, `expo-controls`, `geometry`, `panes`,
  `platform-services` and the isolated desktop adapters. See
  [docs/MIGRATION.md](docs/MIGRATION.md).
- **Optional peers**: `react-native-skia` on `@nyc-tron/ui`,
  `expo-file-system` on `@nyc-tron/platform-services`.
- **Native input and service integration**: observed pointer data, palm and
  prediction boundaries, native decoding, and pinned Forge/Viro owners for
  Muse/XR, persistence, collaboration, scheduling, cache, transactions, binary
  transport and telemetry. The [twelve-row report](docs/completion/reports/V1-PLATFORM-CLOSURE.md)
  separates source coverage from each remaining platform acceptance gate.
- **Desktop adapters**: isolated WinUI/Fabric and Spark/AppKit packages for
  native controls, shared window lifecycle, menus, tooltips, inspectors and
  drag/drop. Their actual native interaction gates must pass on the frozen
  candidate before their tested archives can enter the release.
- **Distribution evidence**: one canonical set of thirteen workspace archives,
  installed-consumer hash and npm integrity checks, and release assembly that
  preserves the two exact desktop archives after successful native consumption.
  Public API gates record export keys and reachable declarations for all three
  runtime lanes.

### Changed

- Shared transient state moved to Zustand (`000bfcd`).
- Android video playback in `native-controls` uses an explicitly owned
  `MediaPlayer` with an aspect-fit `SurfaceView`, replacing the earlier
  `VideoView` candidate (`101016b`). The component makes no audio-focus
  request.
- Documentation: native decoder limits, writing and native-skill
  requirements, and per-phase completion records under `docs/completion/`.

### Fixed

- Control identity, focus and preview ownership across audio, gradient,
  graph, waveform, ruler, selection handles, timeline range handles, MIDI,
  scrubber and drag controls (commits from `d16b462` to `e3198bb`).
- Native pan thresholds validated against the pinned
  react-native-gesture-handler (`60b392c`).
- Android player: rejects unrepresentable seeks, discards terminal seek
  callbacks, resets its rate cache on source replacement (`6d07b08`,
  `0d849cf`, `4886fbd`).
- iOS decoder bridge and player lifecycle (`b192a23`); indexed frames decode
  at exact mapped timestamps (`749d8aa`).
- Shared audio focus arbitration during disposal, reserved-regions linkage
  and native playback lifecycle draining, document access recovery
  (`b853e86`, `7a5f963`, `5b57cf8`).
- Canvas: native Vulkan lifecycle, pinch start, thumbnail resource isolation
  and Graphite host setup (`5dd07e9`, `fb06d19`, `4f1cc92`).

### Known limitations

- [iOS](docs/completion/evidence/v1-native-2a74fbf/ios/README.md) and
  [Android](docs/completion/evidence/v1-native-2a74fbf/android/README.md) native
  decoder and UI flows passed at the retained canonical-archive checkpoint.
  Those receipts establish their recorded revision and inputs. Later source
  changes require fresh native results for the frozen candidate. Physical
  audio/output, interruptions and device performance remain separate gates.
- Browser WebCodecs decoding reports the decoded presentation timestamp;
  its video-element fallback reports a settled seek target.
- WebAudio sources are limited to 60 seconds or 64 MiB.
- Windows and AppKit native interaction gates remain active candidate work;
  earlier compilation or lifecycle passes do not satisfy later interaction
  assertions. Their RNW 0.85 and Spark/Expo 55 hosts are separate from the
  Expo 58 / React Native 0.88 installation.
- AppKit, native desktop windows, visionOS, Quest and PICO remain in the
  approved scope. The implemented optional Forge/Viro adapters do not establish
  headset execution, tracked physical input or GPU performance.
- Spoken screen-reader output, physical pen/palm/fold/display behavior, the
  remaining eight-platform acceptance records and owner distribution review
  remain open. See [docs/SUPPORT.md](docs/SUPPORT.md) and the release conditions.

## [0.1.0-alpha.4] - 2026-11-06

Published 2026-11-06T03:56:20Z (2026-11-05 in US Eastern time).

See the [GitHub release](https://github.com/mikevocalz/NYC-Tron-UI/releases/tag/v0.1.0-alpha.4).

[1.0.0]: https://github.com/mikevocalz/NYC-Tron-UI/compare/v0.1.0-alpha.4...v1.0.0
[0.1.0-alpha.4]: https://github.com/mikevocalz/NYC-Tron-UI/releases/tag/v0.1.0-alpha.4
