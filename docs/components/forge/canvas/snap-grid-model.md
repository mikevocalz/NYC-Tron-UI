---
name: "SnapGridModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/canvas/snap-grid-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# SnapGridModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas/snap-grid-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas/snap-grid-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { DEFAULT_GRID, DEFAULT_SNAP, GRID_MAX_LINES, GRID_MAX_SPACING, GRID_MAX_SUBDIVISIONS, GRID_MIN_SCREEN_SPACING, GRID_MIN_SPACING, SNAP_MAX_THRESHOLD } from "@nyc-tron/ui/components/forge/canvas/snap-grid-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/canvas/snap-grid-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas/snap-grid-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ArtboardBounds` | interface | `interface ArtboardBounds extends DocRect { readonly id: string; readonly name?: string; }` |
| `DEFAULT_GRID` | const | `const DEFAULT_GRID: { readonly spacing: 32; readonly subdivisions: 4; readonly visible: true; };` |
| `DEFAULT_SNAP` | const | `const DEFAULT_SNAP: { readonly enabled: true; readonly toGrid: true; readonly toGuides: true; readonly toArtboards: true; readonly thresholdPx: 8; readonly s...` |
| `GRID_MAX_LINES` | const | `const GRID_MAX_LINES = 400;` |
| `GRID_MAX_SPACING` | const | `const GRID_MAX_SPACING = 4096;` |
| `GRID_MAX_SUBDIVISIONS` | const | `const GRID_MAX_SUBDIVISIONS = 16;` |
| `GRID_MIN_SCREEN_SPACING` | const | `const GRID_MIN_SCREEN_SPACING = 6;` |
| `GRID_MIN_SPACING` | const | `const GRID_MIN_SPACING = 1;` |
| `GridLine` | interface | `interface GridLine { readonly offset: number; readonly major: boolean; }` |
| `GridSettings` | interface | `interface GridSettings { readonly spacing: number; readonly subdivisions: number; readonly visible: boolean; readonly origin?: DocPoint; }` |
| `PointSnap` | interface | `interface PointSnap { readonly point: DocPoint; readonly x?: SnapHit; readonly y?: SnapHit; }` |
| `RectSnap` | interface | `interface RectSnap { readonly rect: DocRect; readonly dx: number; readonly dy: number; readonly x?: SnapHit; readonly y?: SnapHit; }` |
| `SNAP_MAX_THRESHOLD` | const | `const SNAP_MAX_THRESHOLD = 64;` |
| `SNAP_MIN_THRESHOLD` | const | `const SNAP_MIN_THRESHOLD = 1;` |
| `SnapContext` | interface | `interface SnapContext { readonly zoom: number; readonly snap: SnapSettings; readonly grid?: GridSettings; readonly guides?: readonly CanvasGuide[]; readonly ...` |
| `SnapHit` | interface | `interface SnapHit { readonly line: SnapLine; readonly feature: "start" \| "center" \| "end"; }` |
| `SnapLine` | interface | `interface SnapLine { readonly axis: CanvasAxis; readonly value: number; readonly source: SnapSource; }` |
| `SnapSettings` | interface | `interface SnapSettings { readonly enabled: boolean; readonly toGrid: boolean; readonly toGuides: boolean; readonly toArtboards: boolean; readonly thresholdPx...` |
| `SnapSource` | type | `type SnapSource = { readonly kind: "grid"; } \| { readonly kind: "guide"; readonly id: string; } \| { readonly kind: "artboard"; readonly id: string; readonly ...` |
| `gridLines` | function | `function gridLines(grid: GridSettings, viewport: CanvasViewport): { vertical: GridLine[]; horizontal: GridLine[]; };` |
| `gridStep` | function | `function gridStep(grid: GridSettings, zoom: number): number \| undefined;` |
| `magneticPull` | function | `function magneticPull(d: number, reach: number, strength: number): number;` |
| `snapLines` | function | `function snapLines(ctx: SnapContext, axis: CanvasAxis): SnapLine[];` |
| `snapPoint` | function | `function snapPoint(point: DocPoint, ctx: SnapContext): PointSnap;` |
| `snapReach` | const | `const snapReach: (ctx: SnapContext) => number;` |
| `snapRect` | function | `function snapRect(rect: DocRect, ctx: SnapContext): RectSnap;` |
| `snapSummary` | function | `function snapSummary(snap: { readonly x?: SnapHit; readonly y?: SnapHit; }): string \| undefined;` |
| `validateGrid` | function | `function validateGrid(grid: GridSettings): void;` |
| `validateSnap` | function | `function validateSnap(snap: SnapSettings): void;` |
| `validateSnapHit` | function | `function validateSnapHit(hit: SnapHit, axis: CanvasAxis): void;` |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas/snap-grid-model.ts -->
_Not documented._
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
