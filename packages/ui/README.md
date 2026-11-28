# @nyc-tron/ui

React Native components for NYC-Tron UI. Import each component by its subpath;
the package root exports only `Button`, `Card`, `NavigationRail`,
`NavigationShell` and `TextField`.

```tsx
import { Button } from "@nyc-tron/ui/components/Button";
import { InspectorPanel } from "@nyc-tron/ui/components/shell/InspectorPanel";
```

This package ships general app UI only. The editor controls that used to live
under `components/forge/*` moved to `@nitro-forge/editor-controls` in
[Nitro Forge](https://github.com/mikevocalz/nitro-forge) (decision
[D10](../../docs/V1_DECISIONS.md#d10-editor-controls-move-to-nitro-forge)).
Replace `@nyc-tron/ui/components/forge/<path>` with
`@nitro-forge/editor-controls/<path>`. The three precision helpers stayed here:
`components/forge/inputs/precision`, `precision-scrubber-model` and
`PrecisionScrubber` are now `components/shell/precision`,
`components/shell/precision-scrubber-model` and `components/shell/PrecisionScrubber`.
This applies from the first release after v1.0.0-rc.2, the last one that
contains the editor controls.

## Peer dependencies

`react` (>=19) and `react-native` (>=0.88) are required. The rest are optional
and only needed by the subpaths that import them:

| Optional peer | Needed by |
| --- | --- |
| `@nyc-tron/core` | 22 shell, overlay, file and window subpaths, for example `components/shell/AdaptiveDock`, `components/overlays/CommandPalette` and `components/window/WindowTitleBar` |
| `zustand` ^5 | 41 stateful subpaths, for example `components/shell/InspectorPanel`, `components/shell/PrecisionScrubber`, `components/data/DataTable`, `components/data/TreeGrid`, `components/Select`, `components/local-store` and `components/useLocalStore` |
| `@expo/ui` ^58 | `components/forms/Switch`, `components/forms/Checkbox`, `components/forms/Textarea`, `components/overlays/Sheet` |
| `@tanstack/react-table` ^9 | `components/data/DataTable` |
| `react-native-gesture-handler` >=3.3.0 <4 | `components/gestures/GestureHandlerDrag`, `components/gestures/useEditorPan` |
| `uniwind` >=1.12.2 <2 | `components/theme/NightScope` |
| `expo-drag-drop-content-view` >=0.9.2 <1 | `components/files/DropZone` on iOS and Android (needs a dev or production build) |

`tooling/verify-packages.mjs` prints this mapping from the compiled
import graph and fails if the package root reaches an optional peer.
