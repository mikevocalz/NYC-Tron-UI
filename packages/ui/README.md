# @nyc-tron/ui

React Native components for NYC-Tron UI. Import each component by its subpath;
the package root exports only `Button`, `Card`, `NavigationRail`,
`NavigationShell` and `TextField`.

```tsx
import { Button } from "@nyc-tron/ui/components/Button";
import { WaveformLane } from "@nyc-tron/ui/components/forge/WaveformLane";
```

## Peer dependencies

`react` (>=19) and `react-native` (>=0.88) are required. The rest are optional
and only needed by the subpaths that import them:

| Optional peer | Needed by |
| --- | --- |
| `@expo/ui` ^58 | `components/forge/NativeSeekBar`, `components/forge/ColorChannels` |
| `@tanstack/react-table` ^9 | `components/data/DataTable`, `components/forge/SpreadsheetGrid` |
| `zustand` ^5 | `components/data/DataTable`, `components/data/TreeGrid`, `components/forge/SpreadsheetGrid`, `components/forge/inputs/InstrumentKnob`, `components/forge/inputs/InstrumentXYPad`, `components/forge/graph/PatchGraph`, `components/forge/graphics/ImageCropOverlay`, `components/content/KeyValueList`, `components/files/DropZone` |
| `uniwind` >=1.12.2 <2 | `components/theme/NightScope` |
| `expo-drag-drop-content-view` >=0.9.2 <1 | `components/files/DropZone` on iOS and Android (needs a dev or production build) |

`tooling/verify-packages.mjs` regenerates this mapping from the compiled
import graph and fails if the package root reaches an optional peer.
