# Third-party notices

`src/overlay-placement.ts` adapts Floating UI's `packages/core/src/computeCoordsFromPlacement.ts`, Git blob `43f6767bdcce4f791057e7a8bcb28f3207cd442c` at commit `e1e9f88993c19426563decfcc991feb706f1ac66`, fetched 2026-11-05. Copyright (c) 2021 Floating UI contributors. MIT text: `licenses/floating-ui-MIT.txt`. Modifications: inlined the `@floating-ui/utils` axis helpers, use standalone types and reject invalid/overflow geometry. Other source candidates in the docs have not been copied.

The inlined axis/alignment helpers were rechecked in `packages/utils/src/index.ts`, blob `c6c7bd7b0d5a9a41e5e2d45606ac468bcfb1f615`, at the same pinned commit; the root MIT license blob is `5665118418c729036a5252c88ba99d3d33cf22d6`. No runtime dependency on Floating UI or DOM utilities is introduced.

## Existing corner-cut port lineage

`src/corner-cut.ts` is adapted from NYC-MON (`mikevocalz/nyc-mon`) `packages/ui/neon/corner-cut.ts`, using the NeonBlade UI vocabulary. NYC-MON's original MIT notice is retained verbatim in `licenses/NYC-MON-MIT.txt`. NeonBlade UI (https://github.com/vprix21/neonblade-ui), MIT License, Copyright (c) 2026 NeuronRush; its full original text is retained in `licenses/NEONBLADE-MIT.txt`. The Floating UI addition does not replace either existing attribution.
