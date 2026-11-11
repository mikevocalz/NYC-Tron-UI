# @nyc-tron/core

Pure layout and theme policies for NYC-Tron UI. No React, React Native or
renderer imports, so every subpath runs in Node, Metro and the browser.

```ts
import { resolveNavigationShell } from "@nyc-tron/core/navigation";
import { resolveUsableRegions } from "@nyc-tron/core/folds";
import { validateSpatialPanelSet } from "@nyc-tron/core/spatial";
```

Subpaths: `navigation`, `folds`, `spatial`, `spatial-interactions`, `theme`,
`advanced-catalog`, `presets/infrax`, `pane-plan`, `window-lifecycle`. No peer dependencies.

`window-lifecycle` owns the pure window registry, drag ownership and layout
restoration model. Native host adapters supply observed display/window events
and perform OS operations; the model does not create windows or own documents.
The existing `@nyc-tron/panes/window-lifecycle` entry re-exports this same model.
An isolated desktop host can import core directly without installing React,
React Native or the pane renderer.

`resolveUsableRegions` takes the measured container and obstructions in window
coordinates, then returns rectangles **relative to that container**. For a safe
content container at `{ x: 0, y: 62, width: 402, height: 778 }` with no obstruction,
the result starts at `{ x: 0, y: 0 }`. Use the returned `x` and `y` directly as
`left` and `top` inside the container; subtracting the window origin again moves
content outside its safe area.

Installation from a GitHub Release tarball and licensing status are covered in
the repository README.
