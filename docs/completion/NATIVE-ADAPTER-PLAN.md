# Native adapter workstream plan — P19/P20 platform evidence

Status: planning document only. This file records scope, ordering and
evidence conventions for the remaining native-adapter block. It changes no
code, promotes no `acceptance` field and certifies no platform.

Sources read for this plan: `AGENTS.md` (rules 3, 4, 5, 9, 10),
`docs/ARCHITECTURE.md`, `docs/ROSTER.md`, `docs/AGENT_WORKSTREAMS.md`,
`docs/completion/PROGRAM.md`, `docs/completion/P19-native-library-contract.md`,
`docs/completion/library-progress.json`, and the foldable-layout skill at
`nyc-mon/skills/mikevocalz-foldable-layouts/SKILL.md` (2026-10-15 revision,
pin `d60f539b263863027ec7593ffaea38304ad1e5d8`).

## 1. Current-state inventory

All native code in this repository is Expo Modules–style (Swift on iOS,
Kotlin/Compose on Android) or TypeScript contract code. There is no macOS,
Windows Runtime, visionOS, Quest or PICO native artifact except the Windows
entries listed under W-2.

### iOS (Swift) — exists, simulator-validated only

| Package | Native sources | What it is |
| --- | --- | --- |
| `packages/native-navigation` | `ios/NYCTronNavigationModule.swift`, `ios/TronNavigationRailView.swift`, `ios/NYCTronNavigation.podspec` | SwiftUI navigation rail via Expo Modules Core view DSL; declares `swiftui` in `expo-module.config.json` |
| `packages/native-controls` | `ios/NYCTronInstrumentsModule.swift`, `TronArcKnobView.swift`, `TronXYPadView.swift`, `TronDisplayP3DiscView.swift`, `TronAVPlayerSurface.swift`, `TronPlayerLayerView.swift`, `TronVideoPlayerView.swift`, `TronVideoPlayerCoordinator.swift`, `TronVideoPlayerProps.swift`, `TronDisplayP3DiscProps.swift`, `View+zeroContentOrigin.swift` | SwiftUI ArcKnob/XYPad/P3 disc plus AVPlayerLayer video surface |
| `packages/native-charts` | `ios/NYCTronChartsModule.swift`, `TronChartKind.swift`, `TronChartPoint.swift`, `TronChartProps.swift`, `NYCTronCharts.podspec` | Swift Charts line/column/area, iOS 16.4+ |
| `packages/reserved-regions` | `ios/NYCTronReservedRegionsModule.swift`, `ReservedRegionMargins.swift`, `ReservedRegionRecord.swift`, `Extensions/*` | Reserved-region (safe-area/fold-adjacent) records |
| `packages/hardware-keys` | `ios/NYCTronHardwareKeysModule.swift`, `HardwareKeyRouter.swift`, `HardwareKeyCaptureView.swift`, `KeyBindingRecord.swift`, `KeyChordRecord.swift`, `Extensions/*` | Hardware-key chord routing |
| `packages/platform-services` | `ios/NYCTronDocumentsModule.swift`, `DocumentPickerSession.swift`, `DecodedAudioRecord.swift`, `AudioSessionObserver.swift`, `ActivateOptionsRecord.swift`, `AudioRequest*.swift` | Documents picker, decoded audio, audio session |

### Android (Kotlin/Compose) — exists, emulator-validated only

| Package | Native sources | What it is |
| --- | --- | --- |
| `packages/native-navigation` | `android/.../NYCTronNavigationModule.kt`, `TronNavigationRailView.kt`, `build.gradle` | Compose navigation rail, ExpoUIView registration |
| `packages/native-controls` | `android/.../instruments/*` (TronVideoPlayerView/TronVideoSurface/TronVideoOwner/TronVideoStatusPayload/TronVideoPlayerProps, TronXYPadView, TronArcKnobView, TronDisplayP3DiscView/Props, NYCTronInstrumentsModule) | Compose controls; video surface is an owned `MediaPlayer` + `SurfaceView`, not `VideoView` |
| `packages/native-charts` | `android/...` | Vico 3.2.3 Compose charts |
| `packages/reserved-regions` | `android/.../WindowLayoutInfo+toReservedRegionRecords.kt`, `NYCTronReservedRegionsModule.kt`, `ReservedRegionRecord.kt`, `RegionMarginsRecord.kt` | Jetpack WindowManager `FoldingFeature` → division regions (no hinge-angle fabrication) |
| `packages/hardware-keys` | `android/.../hardwarekeys/*` | Key-chord routing with window attachment |
| `packages/platform-services` | `android/...` | Documents picker, audio decode/session services |

### Cross-platform native-ish packages

- `packages/expo-controls` — SwiftUI/Compose controls via `@expo/ui`
  (`@expo/ui/community/menu`, universal `Picker`, `Host`). iOS/Android/web
  only; no desktop or XR path.
- `packages/ui` — seven `.native.tsx` files under
  `src/components/forge/` use `@expo/ui` SwiftUI/Compose primitives
  (e.g. `NativeSeekBar.native.tsx` Slider on both platforms).
- `packages/core` — `src/navigation.ts` (device-family capability model:
  phone/foldable/dual-screen/tablet/headset/desktop/unknown) and
  `src/folds.ts` (pure hinge/occlusion geometry; consumes UIKit regions and
  Android `FoldingFeature`s). This is the shared foldable contract the
  skill mandates; it is platform-agnostic TypeScript, not a native adapter.
- `packages/windows-fluent` — see W-1/W-2 below.
- `tooling/native/presentation-index-ios/Harness.swift` — iOS-only test
  harness, not a shipped adapter.

### Windows — partial, not connected to RNW

`packages/windows-fluent` has two layers:

1. `windows/NYCTron.Fluent.WinUI3/` — a real WinUI 3 XAML `NavigationView`
   shell (`TronNavigationShell.xaml(.cs)`, `TronDestination.cs`,
   `NYCTron.Fluent.WinUI3.csproj`, `net10.0-windows10.0.19041.0`,
   Windows App SDK 1.8). README states it is a native shell plus a
   TypeScript controlled-transport contract (`src/controller.ts`),
   "explicitly not connected yet" to a React Native host.
2. `rnw-fabric/` (`@nyc-tron/windows-fluent-fabric`) — an RNW Fabric
   community component (`windows/NYCTronFluentFabric/*.cpp/.h/.vcxproj/.sln`,
   `ReactPackageProvider`, `TronNavigationView.cpp`) that hosts a real
   `Microsoft.UI.Xaml.Controls.NavigationView` inside a XAML island via
   `ContentIslandComponentView`. Code adapted from Microsoft's RNW v0.85
   `sample-custom-component` ComboBox pattern (MIT; see
   `rnw-fabric/THIRD_PARTY_NOTICES.md`). A standalone RN 0.85.3 /
   RNW 0.85.0 example host exists at `rnw-fabric/example/` with
   `scripts/uia-smoke.ps1` and `scripts/prepare-host.mjs`.

The README is explicit: the Fabric adapter compiles-or-doesn't is unproven;
no Windows host build or event roundtrip evidence exists in this repo.
RNW 0.85 targets RN 0.85 while the Expo 58 mobile packages run RN 0.88 —
two different host lineages (see `docs/ARCHITECTURE.md`,
`docs/AGENT_WORKSTREAMS.md`).

### macOS — nothing

No `macos/` directory, no AppKit/Spark sources anywhere in `packages/`.
`docs/ROSTER.md` records "macOS Spark AppKit native adapter — NOT
IMPLEMENTED". `docs/ARCHITECTURE.md` notes Spark 0.0.2 targets
Expo 55/RN 0.83 and "is **not compatible by default**" with the Expo 58 /
RN 0.88 native host — hence the AGENTS.md rule that Spark desktop must
remain isolated.

### visionOS / Quest / PICO — nothing

No visionOS, Horizon, Viro, or XR runtime code or config exists. The only
XR-adjacent artifact is the pending ledger row N-09
`XRPresentationAdapter` (`libraryScope: false`, `implementationReview:
pending`). `docs/AGENT_WORKSTREAMS.md` lists "Viro / PICO / visionOS panel
runtime — NOT RUN" in `docs/ROSTER.md`. PROGRAM.md requires
`expo-horizon-core` for Meta Horizon/Quest application configuration, with
scene geometry kept separate from the app-window contract.

### Foldable/adaptive geometry — TypeScript contract exists, native feeds partial

- `packages/core/src/folds.ts` + `navigation.ts` implement the skill's
  §3–§5 contract (capability vs geometry vs product state; multi-feature
  normalization; physical-right rail policy).
- Android feed: real Jetpack WindowManager `FoldingFeature` data via
  `packages/reserved-regions`.
- iOS feed: `reserved-regions` iOS module reports UIKit reserved regions;
  no `UIWindowScene` hinge-split API is claimed.
- No Windows (WinUI `AppWindow`/`DisplayRegion` or `HwndId` overlap) or
  macOS (`NSScreen`/`safeAreaInsets` on foldables) native geometry feed
  exists. No XR posture feed exists.
- `examples/native-instruments` declares `"platforms": ["ios","android"]`
  in `app.json`; no macOS/Windows/visionOS targets, and
  `orientation: "default"` is the preserved app-window contract.

## 2. Per-platform adapter workstreams

"Real" per AGENTS.md rule 3 means an actual Fluent NavigationView, AppKit
control, SwiftUI view or Compose composable — not an RN View wearing a
platform name. Every adapter keeps the app-authored router/selection
owner, the Zustand/refs state policy, and the `platformEvidence` honesty
rule.

### W-1 — Windows Fluent NavigationView (highest readiness)

Scope: connect the existing `@nyc-tron/windows-fluent-fabric` Fabric
component to a verified RNW host and produce Windows runtime evidence.

- Required tech: React Native Windows 0.85.x host (RN 0.85.3),
  WinUI 3 / Windows App SDK 1.8 `NavigationView`, C++/WinRT Fabric codegen.
  This is a **separate host lineage** from the Expo 58 app; do not merge
  the two dependency graphs. Expo Modules v2 does not apply — RNW Fabric
  community components are the correct mechanism here.
- Estimated slices:
  1. W1-a: Build `rnw-fabric/example` on a Windows machine
     (`init-windows` cpp-app template → `react-native run-windows`), fix
     codegen/compile errors, record build logs. (~1 slice)
  2. W1-b: Event roundtrip — `ItemInvoked`/`PaneOpened`/`PaneClosed` →
     JS emitter → controlled `controller.ts` reconciliation; verify
     selection only moves on `SetSelectedId` commit. (~1–2 slices)
  3. W1-c: Layout/focus/a11y pass — pane modes (`Auto/Left/LeftCompact/
     LeftMinimal`), Narrator names, keyboard traversal, resize. (~1 slice)
  4. W1-d: Integrate the WinUI 3 shell embedding path if the RNW
     Composition island cannot host the full app surface; decide and
     document which of the two layers (`NYCTron.Fluent.WinUI3` shell vs
     Fabric component) is the shipped adapter. (~1 slice, decision-heavy)
- Blocker: **requires Windows hardware/VM with Visual Studio 2026 and the
  Windows App SDK**. Cannot be produced on this Mac. CI compile is
  possible only if a Windows runner exists; check `.github/workflows`
  before assuming.

### M-1 — macOS AppKit adapter (Spark isolation)

Scope: a real AppKit control surface for the desktop shell — at minimum a
native sidebar/toolbar-equivalent and the controls `packages/panes` and
`packages/ui` currently render as RN views on macOS.

- Required tech: Spark (`react-native-macos`) is the only RN-macOS host
  that can carry this codebase's RN version lineage, but Spark 0.0.2 is
  pinned to Expo 55/RN 0.83 — incompatible by default with Expo 58/RN
  0.88. AGENTS.md therefore requires Spark desktop to remain **isolated**:
  a separate app/host, separate lockfile, no shared `node_modules` with
  the Expo 58 packages, and no claim that Expo-58-built artifacts run on
  Spark. Alternative under evaluation: a thin AppKit host that embeds the
  web/JS bundle — rejected unless it can host the real RN runtime, which
  it cannot without RN-macOS.
- Estimated slices:
  1. M1-a: Spike — stand up a minimal Spark host, verify which
     `@nyc-tron/*` packages build against RN 0.83-era APIs; record the
     incompatibility matrix honestly. (~1 slice)
  2. M1-b: AppKit `NSSplitViewController`/toolbar sidebar adapter +
     native menu/inspector surface for the P04 shell rows. (~2–3 slices)
  3. M1-c: Port or gate the controls that have no Spark path (Expo
     Modules v2 modules are iOS/Android-only; the Spark host needs
     Objective-C++/AppKit implementations or documented RN-view
     fallbacks — fallbacks must be labeled, not claimed native). (~2 slices)
- Blocker: **macOS hardware is available (this machine), but the Spark
  version matrix is unverified**; M1-a exists precisely to resolve that
  before any adapter code is written. No Windows-style blocker, but no
  upstream AppKit code may be copied without file-level license review
  (AGENTS.md rule 9).

### I-1/I-2 — iOS SwiftUI depth (extends existing, does not restart)

Existing SwiftUI sources cover rail, knobs, pad, P3 disc, charts, video,
keys, reserved regions, platform services. Remaining gaps:

- I-1: foldable/large-screen geometry feed — iOS has no public hinge API;
  the honest feed is `UIWindowScene` size classes + safe-area/reserved
  regions (already partially in `reserved-regions`) plus, on iPhone Duo
  hardware, whatever private/entitlement APIs Apple ships — must be
  verified against the installed SDK, not assumed. Deliverable: extend
  `reserved-regions` to report scene size-class and any new fold
  notifications the SDK actually exposes, gated by availability.
- I-2: coverage expansion — bring the remaining P19 contract surfaces
  (anchored Find is done; popover/menu variants, inspector panels) onto
  real SwiftUI where `@expo/ui` lacks an equivalent; each new view gets
  the same podspec + `expo-module.config.json` registration pattern.
- Evidence: same Argent e2e YAML convention as
  `P19-native-proof.json`, two unchanged passes per flow, on simulator
  first; physical iPhone only when hardware is attached.

### A-1/A-2 — Android Compose depth + foldable runtime

Existing Compose sources cover the same control set. Remaining gaps:

- A-1: foldable hardware evidence — the WindowManager feed exists in
  `reserved-regions`, but all recorded evidence is emulator
  (API 26 manifest + API 36 arm64 debug per P19 contract). Required:
  Surface Duo or equivalent dual-screen/foldable device, or the
  emulator's hinge-posture simulation explicitly labeled as such.
  Deliverable: `FoldingFeature` half-opened/book/tabletop posture runs
  through `folds.ts` into pane layout with right-rail preserved.
- A-2: coverage expansion mirroring I-2; plus the pending Android Find
  flow from P19 (Android History passed twice; Android Find is
  explicitly unverified in the contract).
- Constraint reminder: `@ExpoView`/`@ViewProps` macros are unavailable in
  Expo Modules Core at SDK 58 — new views must use the supported view
  DSL registration (`ExpoUIView` on Android, SwiftUI `View` DSL on iOS)
  exactly as `native-controls` does; do not claim v2 macro support.

### X-1 — visionOS / Quest / PICO (largest unknown, start with spikes)

Scope: N-09 `XRPresentationAdapter` and the requiredPlatforms `visionos`,
`quest`, `pico` rows. There is zero existing code, so the first deliverable
is an honest capability matrix, not controls.

- visionOS: Expo SDK 58 has no shipping visionOS target in this repo.
  Options to verify, in order: (a) Expo's experimental visionOS support
  status at SDK 58 — check installed `expo` package and official docs
  before assuming; (b) bare React Native visionOS (community ports) —
  ABI/host verification required before any Nitro or module reuse;
  (c) a pure-SwiftUI visionOS shell hosting the web bundle — acceptable
  only if it can drive the real RN surface, otherwise it is a shell
  demo, not an adapter. Reality check: the P19 contract's native
  interaction table was written for phones; visionOS acceptance needs its
  own contract rows (volumes, ornaments, focus) before implementation.
- Quest: Android-based. The pragmatic path is the existing Android build
  running under Horizon OS with `expo-horizon-core` for app
  configuration, plus the `packages/core` foldable/headset device-family
  policy already modeling `headset`. Scene/panel geometry must stay out
  of the app-window contract (PROGRAM.md). Open questions to resolve in
  the spike: whether `@expo/ui` Compose controls render under Quest's
  runtime, whether the preserved window contract (Quest 1280x800dp where
  configured) holds, and what "native" means for panels inside a
  compositor vs. the app window.
- PICO: same Android-derived approach as Quest; verify PICO OS API level
  and whether Jetpack WindowManager/`androidx.window` reports anything
  meaningful (likely nothing — record that honestly rather than
  fabricating hinge geometry).
- Estimated slices: X1-a capability/ABI spike per runtime (3 spikes),
  X1-b shared XRPresentationAdapter contract rows in the ledger,
  X1-c per-runtime adapter once a host is proven. **Hard blocker: no XR
  hardware or emulator is confirmed available on this machine.**

## 3. Dependency and ordering

Unblock graph (arrows = "enables evidence for"):

```
W1-a Windows host build ──► W1-b/c/d ──► platformEvidence.windows on shell rows
M1-a Spark spike ──► M1-b/c ──► platformEvidence.macos
I-1 iOS geometry feed ──► foldable acceptance rows (ios)
A-1 Android foldable device run ──► foldable acceptance rows (android)
A-2 Android Find flow ──► closes P19 contract gap
X1-a XR spikes ──► X1-b/c ──► platformEvidence.visionos/quest/pico + N-09
```

Recommended order:

1. **W1-a** first among new work — the Windows stack is the most complete
   (real Fluent control + Fabric component + example host already
   authored) and its only gap is a Windows machine. If no Windows host is
   available to the program, this stays an explicit recorded gap, not a
   pass.
2. **M1-a** second — runs on this Mac, resolves the Spark/RN-version
   question cheaply before any AppKit code is written.
3. **I-1/A-1/A-2** — extend the already-proven iOS/Android paths; A-1 is
   gated on foldable hardware access.
4. **X1-a** spikes can start any time but produce evidence only with XR
   hardware.

Hardware reality for this machine (macOS host):

- Runnable here: iOS simulator flows (existing Argent e2e path), macOS
  Spark spike compile/run, all TypeScript/unit checks, Windows compile
  only if a Windows runner/VM is provisioned.
- Needs other hardware: Windows PC (W1), Surface Duo-class foldable
  (A-1), physical iPhone for non-simulator claims, Quest/PICO/visionOS
  devices (X1).
- Explicit hard blockers to record, not work around: Windows host,
  foldable Android device, all XR runtimes. visionOS may additionally be
  blocked by Expo SDK 58 lacking a shipping target — M1-a-style spike
  resolves this before scheduling X1-b/c.

## 4. Evidence plan

The ledger gate (`library-progress.json` → `platformEvidence.<platform>`)
requires per-platform artifacts, and `docs/ROSTER.md`/AGENTS.md rule 10
require simulator/emulator/device results to be labeled separately.

Conventions already established (follow them, don't invent new ones):

- Proof JSONs capture raw runner output verbatim:
  `P19-native-proof.json`, `P04-native-overlays-proof.json`,
  `P04-workspace-native-proof.json`, `P05-native-canvas-proof.json`,
  `P10-native-brush-proof.json`, `P11-native-motion-proof.json`,
  plus `docs/completion/evidence/*` for build/replay logs.
- Two-pass rule from `P19-native-library-contract.md`: each native flow
  must pass **twice unchanged**; a transport/automation failure is an
  unexecuted action, not a pass or fail. Fresh device-scoped services per
  pass where the runner supports it.
- Phase report `.md` + proof `.json` pair, registered in the canonical
  ledger's `evidence`/`platformEvidence` fields; `acceptance` stays
  `unverified` until every required platform row has artifacts.
- platformEvidence statuses observed today: `ios: partial` ×14 rows,
  `android: partial` ×9 rows; zero rows carry `windows`, `macos`,
  `visionos`, `quest` or `pico` keys. New adapters add keys only when
  real artifacts exist.

Per workstream:

- W1: Windows UIA/smoke output (`rnw-fabric/example/scripts/uia-smoke.ps1`
  exists for this), build logs, screenshot/a11y-tree captures; proof JSON
  named e.g. `W1-windows-fluent-proof.json`.
- M1: Spark host run logs + AppKit accessibility (NSAccessibility)
  verification; proof JSON `M1-macos-appkit-proof.json`.
- I/A: extend the existing Argent YAML flows; record device model/OS
  exactly as `P19-native-proof.json` does (`"iosRuntime": "iOS 27.1
  simulator, iPhone Duo cover"`). Foldable runs must name the device and
  posture.
- X1: per-runtime contract rows first (what counts as pass/fail inside a
  headset/compositor), then proof JSONs per runtime. Until hardware
  exists, deliverable is the spike report, not evidence.

## 5. Risks

- **ABI/host verification.** Expo Modules v2 (`@ExpoModule`, `@JS` 2.0)
  works at SDK 58, but `@ExpoView`/`@ViewProps` macros do not — every new
  native view must use the DSL registration path already proven in
  `native-controls`. Nitro v1 is not used by any package here; if a
  future adapter needs it, ABI verification against RN 0.88 is a
  prerequisite gate, not an assumption.
- **Spark isolation.** Spark 0.0.2 (Expo 55/RN 0.83) cannot share a
  dependency graph with Expo 58/RN 0.88 packages. Risk: silent peer
  upgrades or a "works on Spark" claim from Expo-built artifacts. Mitigation:
  separate host, separate lockfile, per-package build verification in
  M1-a before adapter code.
- **RNW version fork.** RNW 0.85/RN 0.85 vs Expo RN 0.88 means the
  Windows adapter can never be an Expo Module; it is a Fabric community
  component in a standalone host. Do not let the Windows package import
  `@expo/ui` or Expo Modules APIs.
- **License/provenance.** `rnw-fabric` already carries MIT-derived XAML
  island code with `THIRD_PARTY_NOTICES.md`; `native-controls` carries
  AudioKit/Controls MIT attribution; `native-charts` carries Vico.
  Any upstream AppKit/SwiftUI/Compose/WinUI source copied into new
  adapters requires the same file-level audit and notice retention
  (AGENTS.md rule 9). Packages ship as GitHub Release tarballs only.
- **Hinge-angle fabrication.** WindowManager `FoldingFeature` and UIKit
  regions carry no continuous angle; the skill and `folds.ts` forbid
  synthesizing one. Any adapter that "improves" geometry by inventing
  angles or single-feature assumptions fails review.
- **Navigation policy drift.** Windows desktop = LEFT collapsible drawer,
  macOS = native sidebar, foldable/tablet/headset = physical RIGHT rail,
  web = header (+phone-width tabs), ordinary phone = bottom tabs. These
  are hardware-family decisions, not width breakpoints; adapters must
  consume `packages/core` `navigation.ts` rather than re-deriving policy.
- **Evidence honesty.** Simulator/emulator passes do not certify device
  behavior; ART/Dex-verifier ANRs on the Android emulator were environment
  issues, not app passes (P19 contract). Every report must keep
  unit/source, simulator, emulator and physical-device results in
  separate labeled buckets.

## 6. What this plan does not claim

No adapter described here is implemented by this document. The Windows
Fabric component, WinUI 3 shell, Spark host and XR paths are all
unverified or absent. `implementationReview` stays `implemented` only
where it already is; `acceptance` remains `unverified` for all 341 rows.
This plan sequences the work; it does not schedule it, and it does not
substitute for the per-phase reports each slice must produce.
