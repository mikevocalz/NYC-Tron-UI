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
| Spark 0.0.2 / Expo SDK 55 | 0.83.10, React Native macOS 0.83.0 | `macos-appkit` (React 19.2.0, Expo 55.0.32, Nitro Modules 0.37.0) |

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

## Peer range policy

Peer ranges are lower bounds with no upper cap where the manifest says so,
for example `react >=19.0.0` and `react-native >=0.88.0`. A future major
release of React or React Native satisfies the range but is not tested and
not guaranteed to work. Expo-coupled peers use caret ranges (`expo ^58.0.0`,
`@expo/ui ^58.0.0`), and a few `ui` peers carry explicit caps
(`react-native-gesture-handler >=3.4.0 <4`, `uniwind >=1.12.2 <2`,
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
