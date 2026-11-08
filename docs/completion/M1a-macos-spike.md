# M1-a spike — macOS AppKit adapter feasibility

Status: spike report. This document records what was tried, what ran, and
what is still unproven. It changes no product code and certifies no
platform; `platformEvidence.macos` stays absent until M1-b produces real
adapter artifacts.

Machine: macOS 27.0 (26A428), Apple M3 Pro, arm64. Xcode 27.1
(27A9269), `swiftc` Apple Swift 6.4 (swiftlang-6.4.0.34.1),
`xcodebuild -version` and `swiftc --version` both succeed. Node/npm present;
`spark doctor` reports "Native toolchain available."

## 1. Spark version matrix — the incompatibility claim holds

Repo pins (`examples/native-instruments/package.json`,
`packages/expo-controls/package.json`):

- `expo` 58.0.23, `react-native` 0.88.1, `react` 19.3.0, `@expo/ui` 58.0.27.
- `examples/native-instruments/app.json` declares `"platforms": ["ios",
  "android"]` only. Expo SDK 58 has no shipping macOS target.

Spark (`@legendapp/spark`, the react-native-macos successor; latest npm
release **0.0.3**, published 2026-11-06 — newer than the 0.0.2 the plan
cites, same lineage):

- peerDependencies pin **exact** versions: `expo` 55.0.32,
  `react-native` 0.83.10, `react` ^19.2.0, `react-native-macos` is pulled
  as a runtime dep at 0.83.x (`react-native-windows` 0.83.2 also pinned).
- `spark create` scaffold verified on this machine produces
  `expo` 55.0.32, `react-native` 0.83.10, `react-native-macos` 0.83.0,
  `react` 19.2.0, `expo-desktop` 1.0.6.
- npm `react-native-macos` latest is **0.83.0** — there is no RN 0.88
  macOS runtime upstream, and Spark has no SDK 58 line. The Expo 58 / RN
  0.88 dependency graph cannot build or run on macOS today through any
  RN-macOS host.

Conclusion: AGENTS.md rule 3 ("Spark SDK 55 desktop must remain isolated")
is confirmed and, if anything, stronger than documented — the repo's RN
0.88 packages cannot share a host with Spark at all. Isolation means: a
separate app directory with its own lockfile, no `workspace:*` imports of
the Expo-58 packages, and per-package API-compatibility checks before any
`@nyc-tron/*` code is ported (M1-b work, not done here).

## 2. Option survey

- **(a) Spark isolated host — VERIFIED RUNNABLE (see §3).** Spark vendors
  real AppKit implementations: `spark-ui/macos/native-select/
  RNNativeSegmentedControl.mm` wraps a real `NSSegmentedControl`;
  `spark-ui/macos/appkit-split-view/RNSidebarSplitViewComponent.mm` is a
  Fabric component hosting an `NSSplitView`-class sidebar; `spark-ui/macos/`
  also ships `sidebar/`, `glass-effect-view/`, `sf-symbol/`,
  `swipe-actions/`, `text-input-search/`, `RNSparkButton.mm`,
  `RNSparkTextInput.mm`. Public JS API: `@legendapp/spark/ui`
  (`Button`, `TextInput`, `Select`, `SegmentedControl`),
  `@legendapp/spark/ui/sidebar`, `ui/split-view`, `windows/macos`
  (AppKit toolbar ops). Spark's own README says "Experimental — not ready
  for production use."
- **(b) RNW / Catalyst — not applicable.** React Native Windows targets
  Windows only; it cannot host macOS. Catalyst wraps iPad/iOS apps and
  does not apply to an RN-macOS codebase. No path here.
- **(c) Expo-module-style native view — blocked by platform, not by
  effort.** Expo Modules Core in this repo targets iOS/Android only;
  there is no `macos/` platform in Expo SDK 58. Spark's own modules are
  ordinary react-native-macos native modules inside its private
  `spark-*` packages — they cannot be consumed by the Expo 58 app.
- **(d) Bare AppKit shell hosting JS — rejected for the same reason as
  before:** without RN-macOS there is no real RN runtime to host; a
  WKWebView/AppKit shell would be a shell demo, not an adapter.

## 3. What actually ran (evidence)

### 3a. Standalone AppKit toolchain proof

`tooling/spike/m1a-macos-appkit/AppKitProof.swift` — compiled with
`swiftc -O` (no Xcode project needed) and run. It creates a real
`NSApplication` (accessory policy), a real `NSWindow`, a real
`NSSegmentedControl` (3 segments, select-one), a real `NSButton` and a
real `NSTextField` in `NSStackView`s, orders the window on screen, prints
control facts, finds its `CGWindowID` and stays alive for external
capture.

Commands run:

```sh
swiftc -O AppKitProof.swift -o appkit-proof
./appkit-proof 6 &            # prints control facts + WINDOWID=12771
screencapture -l12771 -x appkit-proof-window.png
```

Output (`evidence/appkit-proof-run.log`):

```text
NSSegmentedControl segments=3 selected=1
NSButton title="Start lesson" bezelStyle=1
NSWindow frame={{80, 440}, {736, 452}} title="M1-a AppKit spike"
WINDOWID=12771
```

`evidence/appkit-proof-window.png` is the WindowServer-captured real
window (1564×996 px, 576 distinct colors). Note: `CGWindowListCreateImage`
is obsoleted in the macOS 15+ SDK (Xcode 27 SDK errors: "Please use
ScreenCaptureKit instead"), and `view.cacheDisplay`/`dataWithPDF`
self-rasterization produced mask-only output for an offscreen accessory
app — the honest capture path is `screencapture -l<windowID>` or
ScreenCaptureKit.

### 3b. Spark host end-to-end (dev mode)

All inside a throwaway `/tmp/m1a-spark` directory (deleted after; ~650 MB
node_modules reclaimed):

```sh
npm install @legendapp/spark@0.0.3
spark create M1aSpikeApp --platform macos     # expo-desktop template
cd M1aSpikeApp && spark doctor                 # "Dependency pins match… Native toolchain available."
spark dev                                      # FAILED — see blocker below
# workaround mirroring spark build's own mechanism:
#   package.json expo.autolinking.exclude = ["react-native-windows"]
spark dev                                      # SUCCEEDED
```

The successful run downloaded the Spark Runner
(`~/.spark/downloads/0.0.3/…/SparkRunner.app`, ~61 MB cache left in
`~/.spark`), started Metro on 127.0.0.1:8081, bundled `index.ts`
(752 modules, platform=macos), launched SparkRunner, and served the JS
bundle to it (`evaluateJavaScript() with JS bundle` in
`evidence/spark-dev.log`). `CGWindowListCopyWindowInfo` reported a real
on-screen window `M1aSpikeApp` (1000×700 at 256,96); captured via
`screencapture -l12776` → `evidence/spark-runner-window.png`
(2224×1624 px, 2393 distinct colors).

The template `App.tsx` was then patched to render
`SegmentedControl` from `@legendapp/spark/ui` (which resolves to
`NativeSegmentedControl` → `RNNativeSegmentedControl.mm` →
`NSSegmentedControl`). Fast Refresh re-rendered the window; a second
capture (`evidence/spark-runner-window-segmented.png`) differs from the
first in the control region (41,105 changed px, bbox
827,581–1398,1050), confirming a live JS→native update roundtrip.

### 3c. Blocker found and worked around

`spark dev` on a fresh macOS-only scaffold **fails out of the box**:
Expo autolinking loads `react-native-windows@0.83.2`'s
`react-native.config.js`, whose RNW CLI probes for `dotnet.exe`/`pwsh.exe`
and throws (`Unable to find pwsh.exe`), killing Metro before start
(`exit 1`). `spark-cli`'s own `build.js` already knows this — it writes
`react-native.config.js` + `expo.autolinking.exclude` including
`react-native-windows` with the comment "RNW's CLI config probes for
PowerShell when Expo autolinking loads it on macOS" — but `spark dev`
does not apply that preparation first. Manually adding
`"expo": { "autolinking": { "exclude": ["react-native-windows"] } }` to
the scaffold's `package.json` (exactly what `spark build` would write)
unblocked `spark dev`. This is a real papercut M1-b must encode in the
host setup (or track upstream).

## 4. Honest limits — what this does NOT prove

- **Dev Runner only.** Evidence is `spark dev` + prebuilt Spark Runner —
  an unsigned dev client, Fast Refresh, dev bundle. No `spark build`,
  signing, notarization or `.app` packaging was attempted (disk stayed
  under ~1 GiB free during the run; a production build was out of scope
  and out of budget).
- **No NYC-Tron code ran on Spark.** The Spark app used its own
  `expo-desktop` template. Zero `@nyc-tron/*` packages were imported;
  they target RN 0.88 APIs and Spark is RN 0.83 — per-package
  compatibility is M1-b work. The segmented control exercised was
  Spark's own `spark-ui`, not a Tron component.
- **AppKit-ness is source-verified, not AX-verified.** The
  `NSSegmentedControl` claim rests on reading
  `RNNativeSegmentedControl.mm` (it literally allocates
  `NSSegmentedControl`) plus a live window capture; no
  NSAccessibility-tree dump was taken (would need an AX grant for the
  capturing process). Pixel diffs prove a re-render happened, not which
  AppKit class drew it — though the code path is unambiguous.
- **Spark is experimental upstream** ("not ready for production use"),
  macOS 14+ Apple Silicon only; Windows/Intel-Mac support is preview.
- Simulator-vs-device labeling: everything here is real hardware (M3
  Pro, real WindowServer), but it is a **development host**, not a
  shipped/packaged app — do not record this as device-acceptance
  evidence for `platformEvidence.macos`.
- Disk: the machine had ~5.6 GiB free at spike start; the Spark
  scaffold+Runner consumed ~1 GiB transiently. All `/tmp` artifacts were
  deleted; `~/.spark` (61 MB Runner cache) remains for reuse.

## 5. Recommended M1 path

1. **M1 proceeds on the Spark isolated host.** It is the only RN-macOS
   runtime that exists for this codebase's lineage, it runs on this
   machine today, and it already ships real AppKit controls
   (segmented/select, sidebar split view, buttons, text inputs, glass,
   SF Symbols, menus, toolbar ops) behind a typed JS API — satisfying
   AGENTS.md rule 3 without writing new AppKit glue for the first
   controls.
2. Host setup must replicate what `spark build` does for `spark dev`:
   exclude `react-native-windows` from autolinking (or fix upstream).
   Keep the host **outside** the pnpm workspace with its own lockfile —
   never `workspace:*`-link Expo-58 packages into it.
3. M1-b order: (i) shell — `ui/sidebar` + `windows/macos` toolbar +
   `core/navigation` macOS-desktop policy (native sidebar, physical
   semantics per AGENTS.md rule 4); (ii) port or gate the controls
   `packages/panes`/`packages/ui` render on macOS — Spark covers
   select/segmented/button/text-input natively, everything else needs
   either a `spark-*`-style native module or an explicitly-labeled RN
   fallback; (iii) per-package RN 0.83 API compatibility matrix before
   importing any `@nyc-tron/*` source.
4. Do **not** pursue RNW/Catalyst or a bespoke AppKit-JS shell — both are
   dead ends for this codebase (§2b/2d).
5. Re-check upstream before committing: Spark is 0.0.x experimental; an
   SDK-58-compatible Spark (or RN-macOS 0.88) would collapse the
   isolation requirement. Until then, isolation is mandatory.

## 6. Reproduce

```sh
cd tooling/spike/m1a-macos-appkit
swiftc -O AppKitProof.swift -o /tmp/appkit-proof
/tmp/appkit-proof 6 &            # note WINDOWID=, then:
screencapture -l<WINDOWID> /tmp/appkit-window.png
```

Spark side (throwaway dir, own lockfile):

```sh
npm i @legendapp/spark@0.0.3
npx spark create Probe --platform macos && cd Probe
# add expo.autolinking.exclude=["react-native-windows"] to package.json
npx spark dev    # Runner downloads on first run; window appears
```
