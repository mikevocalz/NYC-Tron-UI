# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions apply to
all 14 packages together, because `tooling/pack-release.mjs` requires one
version per tag.

## [1.0.0] - Unreleased

Built from `v0.1.0-alpha.4` plus 127 commits (`git log v0.1.0-alpha.4..HEAD`
at `d5207cc7`: 124 commits and 3 merges, including PR #26). Scope and
deferrals: [docs/V1_DECISIONS.md](docs/V1_DECISIONS.md).

v1.0.0 covers the library: 329 of the 341 rows in
`docs/completion/library-progress.json` are library scope and marked
implemented. All 341 rows keep `acceptance: "unverified"`; no row has a
recorded device acceptance run.

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
- **Exports**: 250 new `@nyc-tron/ui` subpaths, plus new subpaths in
  `native-controls`, `expo-controls`, `geometry`, `panes` and
  `platform-services`. See [docs/MIGRATION.md](docs/MIGRATION.md).
- **Optional peers**: `react-native-skia` on `@nyc-tron/ui`,
  `expo-file-system` on `@nyc-tron/platform-services`.

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

Carried from the `v0.1.0-alpha.4` release notes unless marked otherwise:

- Android media decoding. The alpha.4 notes say "Android decoding is
  unavailable". That was true of the alpha.4 tag. Since then `c903eba` added
  a MediaExtractor/MediaCodec decoder and `101016b` added a `MediaPlayer`
  video path. The platform-services and native-controls Kotlin compiled in a
  local build on 2026-11-07, but no APK was packaged and neither path has run
  on an emulator or device
  (`docs/completion/reports/P03-android-native-validation.md`).
- Browser frame timing is a seek target.
- WebAudio sources are limited to 60 seconds or 64 MiB.
- iOS compilation is verified; real decoder and interruption behavior is not.
- Screen readers and physical-device acceptance remain open.
- Added for 1.0.0: the Windows packages are experimental. They compile and
  pass a UI Automation smoke test on `windows-2025`; Narrator speech, high
  contrast, an RTL run and resize are not run. They cannot be installed in an
  app that uses the React Native 0.88 packages.
- Added for 1.0.0: AppKit/macOS, the native multi-window bridge, visionOS,
  Quest and PICO are not included. See [docs/SUPPORT.md](docs/SUPPORT.md).

## [0.1.0-alpha.4] - 2026-11-06

Published 2026-11-06T03:56:20Z (2026-11-05 in US Eastern time).

See the [GitHub release](https://github.com/mikevocalz/NYC-Tron-UI/releases/tag/v0.1.0-alpha.4).

[1.0.0]: https://github.com/mikevocalz/NYC-Tron-UI/compare/v0.1.0-alpha.4...v1.0.0
[0.1.0-alpha.4]: https://github.com/mikevocalz/NYC-Tron-UI/releases/tag/v0.1.0-alpha.4
