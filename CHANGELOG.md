# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions apply to
all 14 packages together, because `tooling/pack-release.mjs` requires one
version per tag.

## [Unreleased]

- Dependency baseline for gate T1: pnpm 12.18.0, TypeScript 7.0.2, Expo
  58.0.24 and React Native 0.88.1 across the workspace. React and react-dom
  stay at 19.3.0; `docs/SUPPORT.md` gives the reason (#68).
- TypeScript 7 changed the quote style of declaration emit: string literal
  types in published `.d.ts` files now use single quotes, for example
  `INFRAX_THEME_NAME: 'InFraX Signal / Infrastructure Orange'`. Six
  declarations in `docs/api-signatures.json` changed this way. The types are
  the same; consumers who diff declarations will see the quote change (#68).

## [1.0.0-rc.2] - Unreleased

### Added

- `LayerBlendAndOpacity` takes an optional `alphaModes` catalog, a list of
  `{id, label, unavailableReason?}` entries built like the existing `modes`
  and `spaces` props (row B-11, F3 decision option A). One entry renders as
  plain text instead of a one-item menu. An entry with `unavailableReason` is
  listed disabled with the reason as its description and cannot be committed.
  When no entry is available, or the menu is locked, the reasons render as
  text under the row. A retained unavailable current alpha locks the
  blend-mode and space menus and the opacity scrubber until the user picks
  an available alpha.
  Omitting the prop keeps the 1.0.0-rc.1 menu exactly;
  `packages/ui/tests/render/layer-blend.render.test.mjs` compares that render
  with a golden captured from the rc.1 source.
- `layer-blend-model` exports `LayerAlphaOption` and `defaultAlphaModes`
  (Straight and Premultiplied, both available). `LayerBlendAndOpacity`
  re-exports both.
- `validateLayerBlend` and `layerBlendProblem` take an optional fourth
  argument, `alphaModes`. Validation throws `RangeError` for an empty catalog,
  more than two entries, a duplicate or unknown id, a blank label or reason,
  or a current `alphaMode` outside the catalog. `layerBlendProblem` reports
  the current entry's `unavailableReason` after blend-mode and space reasons.

This is an additive public API change after 1.0.0-rc.1. Existing callers
compile and render unchanged. `docs/api-signatures.json` records the new and
changed declarations.

### Window chrome (gate T2)

Public API added after `1.0.0-rc.1` by gate T2 (window chrome, ADR in
`docs/completion/reports/T2-WINDOW-CHROME.md`). Compared with `origin/main`,
the three declaration snapshots remove no export and retype no existing
member. R1 rules on these additions; nothing here is accepted on eight
platforms.

New subpath and exports:

- `@nyc-tron/core/window-chrome`: `createWindowChromeController`,
  `createPageWindowHost`, `describeTitleBar` and the types they use
  (`WindowChromeHost`, `WindowChromeController`, `TitleBarInsets`,
  `WindowZoomControl` and others).
- `@nyc-tron/ui/components/window/WindowTitleBar`: `WindowTitleBar`,
  `useWindowChrome`, `WindowTitleBarProps`.
- `@nyc-tron/reserved-regions`: `useWindowControlsInsets`,
  `toWindowControlsInsets`, `windowControlsEqual`, `NO_WINDOW_CONTROLS`.
- `@nyc-tron/macos-appkit/window-chrome` and `createMacOSWindowChrome` on
  `/windows`.
- `@nyc-tron/windows-fluent-fabric/window-chrome` (`createWindowsChromeBridge`)
  and the `WindowsTitleBar` types.

Required members added to existing Windows interfaces. These do not affect
callers, and do affect anyone who implements or mocks the interface:
`WindowsWindowHost.setTitleBar`, `WindowsDesktopTransport.setTitleBar`, and
`WindowsObservedWindow.titleBar`. The native module gains `setTitleBar`
(Windows) and `readTitleBarInsets` (AppKit).

Reference versions in the declaration snapshots moved with the dependency
bumps on main (React Native 0.88.1, Legend Spark 0.0.3).

## [1.0.0-rc.1] - Unreleased

Prerelease cut from `main` at `3b80c1e`. All 15 packed packages carry version
`1.0.0-rc.1`. Stable `1.0.0` is blocked: the v1.0.0 release run on `main`
(Actions run 43067371839) stopped at `tooling/release-readiness.mjs` with
"341 of 341 components lack accepted eight-platform proof; owner distribution
review is pending". The prerelease channel claims neither eight-platform
acceptance nor owner distribution review. Every row in
`docs/completion/library-progress.json` keeps its recorded acceptance status.

Changes since `v0.1.0-alpha.4`, by merged pull request. The [1.0.0] section
below lists them in detail.

- Reusable components and platform UI for the 341-component program (#54).
- MIT license, release gates, paste support and v1.0.0 docs (#55).
- Native appearance, adaptive content and a web reference app (#56).
- Reference flows, native input and release acceptance gates (#57).
- Shared controls routed to Qt targets; audit of all 341 capabilities (#58).
- Native AppKit menus, popovers, tooltips and drag acceptance (#59).
- Native WinUI overlays, drag and navigation acceptance (#60).
- Android cancellation fix; canonical mobile archives verified (#61).
- AppKit drag acceptance waits for laid-out drag surfaces (#65).
- iOS touch-cancel recovery extended to the first Editor tab tap (#66).

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

[1.0.0-rc.2]: https://github.com/mikevocalz/NYC-Tron-UI/compare/v1.0.0-rc.1...HEAD
[1.0.0-rc.1]: https://github.com/mikevocalz/NYC-Tron-UI/compare/v0.1.0-alpha.4...v1.0.0-rc.1
[1.0.0]: https://github.com/mikevocalz/NYC-Tron-UI/compare/v0.1.0-alpha.4...v1.0.0
[0.1.0-alpha.4]: https://github.com/mikevocalz/NYC-Tron-UI/releases/tag/v0.1.0-alpha.4
