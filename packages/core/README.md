# @nyc-tron/core

Pure layout and theme policies for NYC-Tron UI. No React, React Native or
renderer imports, so every subpath runs in Node, Metro and the browser.

```ts
import { resolveNavigationShell } from "@nyc-tron/core/navigation";
import { resolveUsableRegions } from "@nyc-tron/core/folds";
import { validateSpatialPanelSet } from "@nyc-tron/core/spatial";
```

Subpaths: `navigation`, `folds`, `spatial`, `spatial-interactions`, `theme`,
`advanced-catalog`, `presets/infrax`, `pane-plan`. No peer dependencies.

Installation from a GitHub Release tarball and licensing status are covered in
the repository README.
