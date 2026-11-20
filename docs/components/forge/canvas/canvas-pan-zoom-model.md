---
name: "CanvasPanZoomModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/canvas/canvas-pan-zoom-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# CanvasPanZoomModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas/canvas-pan-zoom-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas/canvas-pan-zoom-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { DEFAULT_CANVAS_ZOOM_LIMITS, canvasFromTouches, canvasFromWheel, fitCanvas, panCanvasBy, sameCanvasView, validateZoomLimits, zoomCanvasAt } from "@nyc-tron/ui/forge/canvas/canvas-pan-zoom-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/canvas/canvas-pan-zoom-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas/canvas-pan-zoom-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `CanvasWheelDelta` | interface | `interface CanvasWheelDelta { readonly deltaX: number; readonly deltaY: number; readonly deltaMode: 0 \| 1 \| 2; readonly zoom: boolean; readonly anchor: DocPoi...` |
| `CanvasZoomLimits` | interface | `interface CanvasZoomLimits { readonly minZoom: number; readonly maxZoom: number; }` |
| `DEFAULT_CANVAS_ZOOM_LIMITS` | const | `const DEFAULT_CANVAS_ZOOM_LIMITS: CanvasZoomLimits;` |
| `canvasFromTouches` | function | `function canvasFromTouches(viewport: CanvasViewport, before: readonly DocPoint[], after: readonly DocPoint[], limits?: CanvasZoomLimits): CanvasViewport;` |
| `canvasFromWheel` | function | `function canvasFromWheel(viewport: CanvasViewport, input: CanvasWheelDelta, limits?: CanvasZoomLimits): CanvasViewport;` |
| `fitCanvas` | function | `function fitCanvas(viewport: CanvasViewport, bounds: DocRect, padding?: number, limits?: CanvasZoomLimits): CanvasViewport;` |
| `panCanvasBy` | function | `function panCanvasBy(viewport: CanvasViewport, dx: number, dy: number): CanvasViewport;` |
| `sameCanvasView` | function | `function sameCanvasView(a: CanvasViewport, b: CanvasViewport): boolean;` |
| `validateZoomLimits` | function | `function validateZoomLimits(limits: CanvasZoomLimits): void;` |
| `zoomCanvasAt` | function | `function zoomCanvasAt(viewport: CanvasViewport, zoom: number, anchor: DocPoint, limits?: CanvasZoomLimits): CanvasViewport;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas/canvas-pan-zoom-model.ts -->
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
