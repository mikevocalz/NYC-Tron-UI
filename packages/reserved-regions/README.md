# @nyc-tron/reserved-regions

Fold, hinge and camera geometry for the current window, as one
`ReservedRegion[]` shape on every platform:

| Platform | Source | Notes |
| --- | --- | --- |
| Android | Jetpack WindowManager `FoldingFeature` via `WindowInfoTracker` | `division` regions in dp with `orientation`, `state` (`flat` / `halfOpened`), `occlusionType` and `separating`. No hinge angle: WindowManager has none. Pushes a `changed` event while a listener exists; collection pauses with the Activity. |
| iOS 27.1+ | `UIView.reservedRegions(kind:options:)` on the key window's root view | `division` and `occlusion` regions in points, inactive ones included. UIKit has no change notification, so the hook re-queries when the window resizes. Builds against older SDKs and returns no regions there. |
| Web | Viewport Segments API plus Device Posture API | CSS px. No `window.viewport` means hinge-blind: no regions. |

Coordinates are window-relative layout units. Never apply `PixelRatio` to them.

```tsx
import { useReservedRegions } from "@nyc-tron/reserved-regions";
import { foldLayoutsFromRegions, foldFeaturesFromRegions } from "@nyc-tron/core/folds";
import { AdaptivePaneHost } from "@nyc-tron/panes/AdaptivePaneHost";

const regions = useReservedRegions();
const folds = foldLayoutsFromRegions(regions, rowWindowX); // row-local x
<AdaptivePaneHost {...panes} container={paneWindowRect} regions={regions} />
```

`ReservedRegionsOverride` (also at `@nyc-tron/reserved-regions/ReservedRegionsOverride`)
makes the hook answer fixed regions below it, for Storybook and tests:

```tsx
<ReservedRegionsOverride regions={[{ kind: "division", x: 540, y: 0, width: 24,
  height: 720, margins: { top: 0, left: 0, bottom: 0, right: 0 }, active: true,
  orientation: "vertical", state: "flat", occlusionType: "full", separating: true }]}>
  <Screen />
</ReservedRegionsOverride>
```

The geometry planners (fold layouts, single and multi-hinge pane plans, the
trailing inspector, usable regions) live in `@nyc-tron/core/folds`, which is
pure TypeScript. This package only reports what the device says.

## Native module

One Expo Modules 2 module, `NYCTronReservedRegions`, on both platforms:
`@ExpoModule` / `@JS` / `@Record` Swift macros, and a Kotlin `@ExpoModule` with
an `@Event("changed")` built by the `v2 true` Gradle plugin. Requires
`expo-modules-core` 58 (Expo SDK 58), which ships both. The Android class is
deliberately absent from `android.modules` in `expo-module.config.json`; v2
modules link through `ExpoModulesV2ModuleList`.

Peers: `@nyc-tron/core`, `expo` 58, `react`, `react-native`, `zustand`.

## Provenance

Ported from NYC-MON `packages/ui/reserved-regions*` and
`apps/mobile/modules/reserved-regions`, by way of Nitro Forge
`apps/example/modules/reserved-regions` (same author). Changes from those:
the JS and native names are `NYCTronReservedRegions` so an app can link this
next to a not-yet-removed app-local module; payloads are validated before they
reach the planners; the web snapshot is cached by value.

## Validation status

Unit and source-contract tests, TypeScript, and CI compile lanes (Android
`assembleDebug`, iOS simulator `xcodebuild`) in `examples/native-instruments`.
Not yet validated on a Surface Duo, Pixel Fold, iPhone with iOS 27.1, or a
browser with viewport segments.
