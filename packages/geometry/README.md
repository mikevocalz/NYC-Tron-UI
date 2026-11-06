# @nyc-tron/geometry

Corner-cut path geometry adapted from NYC-MON `packages/ui/neon/corner-cut.ts`
(NeonBlade UI vocabulary, MIT). Pure functions with no palette, Skia, Expo or
renderer dependency.

```ts
import { cornerCutClipPath, cornerCutPolygon, insetCut } from "@nyc-tron/geometry/corner-cut";
```

`@nyc-tron/geometry/overlay-placement` computes an overlay's x/y from an anchor rect, size,
one of 12 placements and an RTL flag. It is a port of Floating UI's
`computeCoordsFromPlacement` (MIT). It does not flip, shift, clip or manage focus; the
overlay host owns those.

```ts
import { computeOverlayPlacement } from "@nyc-tron/geometry/overlay-placement";
```

Upstream MIT notices ship in this tarball under `THIRD_PARTY_NOTICES.md` and
`licenses/`. No peer dependencies.
