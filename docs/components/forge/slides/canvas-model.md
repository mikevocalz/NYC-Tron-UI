---
name: "CanvasModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/slides/canvas-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# CanvasModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/canvas-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/canvas-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { SLIDE_MIN_OBJECT, SLIDE_SNAP_POINTS, fitScale, hitTest, nudge, objectLabel, resizeFromCorner, snapRect } from "@nyc-tron/ui/components/forge/slides/canvas-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/slides/canvas-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/canvas-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `SLIDE_MIN_OBJECT` | const | `const SLIDE_MIN_OBJECT = 8;` |
| `SLIDE_SNAP_POINTS` | const | `const SLIDE_SNAP_POINTS = 6;` |
| `SlideRect` | interface | `interface SlideRect { readonly x: number; readonly y: number; readonly w: number; readonly h: number; }` |
| `SnapGuide` | interface | `interface SnapGuide { readonly axis: "x" \| "y"; readonly at: number; }` |
| `fitScale` | function | `function fitScale(size: SlideSize, width: number, height?: number): number;` |
| `hitTest` | function | `function hitTest(objects: readonly SlideObject[], x: number, y: number): SlideObject \| undefined;` |
| `nudge` | function | `function nudge(key: string, shift: boolean, rtl?: boolean): { dx: number; dy: number; } \| undefined;` |
| `objectLabel` | function | `function objectLabel(o: SlideObject): string;` |
| `resizeFromCorner` | function | `function resizeFromCorner(rect: SlideRect, dx: number, dy: number, keepRatio?: boolean): { w: number; h: number; };` |
| `snapRect` | function | `function snapRect(rect: SlideRect, others: readonly SlideRect[], size: SlideSize, threshold: number): { x: number; y: number; guides: SnapGuide[]; };` |
| `stepRotation` | function | `function stepRotation(degrees: number, direction: 1 \| -1, step?: number): number;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/canvas-model.ts -->
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
