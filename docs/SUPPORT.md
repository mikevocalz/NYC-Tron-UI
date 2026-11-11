# Support policy

Applies to v1.0.0. Source of the tiers: [v1.0.0 decisions](V1_DECISIONS.md) D3.

## Tiers

| Tier | Contents | Evidence today |
|---|---|---|
| Supported | Web (React Native Web), iOS SwiftUI controls, Android Compose controls, shared TS packages | Node, Chromium, native compile in CI; two passing iOS and Android scenario runs for overlays |
| Experimental | `@nyc-tron/windows-fluent` and `windows-fluent-fabric` (RN 0.85 lane), native charts, native media decoding | Compiles on `windows-2025`; UIA smoke test; no Narrator, high-contrast or resize runs |
| Not included | AppKit/macOS adapter, multi-window native bridge, visionOS, Quest, PICO | No code or no proof |

"Supported" describes what CI checks. It is not device acceptance: every row
in `docs/completion/library-progress.json` has `acceptance: "unverified"`.
The two overlay scenario runs per platform are recorded in
`docs/completion/P04-native-overlays-proof.json`: 28 steps, two passes on iOS
target `BBCC4078-E64D-4642-893B-ACF80ACB29A1` and two on Android
`emulator-5554`. The file does not say whether the iOS target is a simulator.

## Two runtime lanes

| Lane | React Native | Packages |
|---|---|---|
| Expo SDK 58 | 0.88 | `ui`, `expo-controls`, `native-controls`, `native-navigation`, `native-charts`, `hardware-keys`, `platform-services`, `reserved-regions` |
| React Native Windows 0.85 | 0.85.3 | `windows-fluent-fabric` (peers pin `react-native` `0.85.3` and `react-native-windows` `0.85.0`) |

No app can consume both lanes. `@nyc-tron/ui` requires `react-native >=0.88.0`
and `windows-fluent-fabric` pins `react-native` `0.85.3`, so no single
`react-native` version satisfies both.

Some packages accept either lane:

- `@nyc-tron/core` and `@nyc-tron/geometry` have no peer dependencies.
- `@nyc-tron/icons` accepts `react-native >=0.85.0` (optional peer).
- `@nyc-tron/panes` accepts `react-native >=0.85.0`.
- `@nyc-tron/windows-fluent` has no peer dependencies; its WinUI 3 project
  (`windows/NYCTron.Fluent.WinUI3`) is built by the Windows host.

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
This list was built with grep over `packages/ui/src` and the built `dist`;
it was not checked by installing the package without Skia.

## Reporting problems

Open an issue at https://github.com/mikevocalz/NYC-Tron-UI/issues with the
package, version, platform and the lane (Expo SDK 58 or RNW 0.85).
