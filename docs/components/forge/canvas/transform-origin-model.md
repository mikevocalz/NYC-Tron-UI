---
name: "TransformOriginModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/canvas/transform-origin-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# TransformOriginModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas/transform-origin-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas/transform-origin-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { ANCHOR_SNAP_RADIUS, ORIGIN_ANCHORS, ORIGIN_ANCHOR_LABELS, ORIGIN_PAGE_STEP, ORIGIN_STEP, ROTATION_SNAP_STEP, anchorPoint, contentToDoc } from "@nyc-tron/ui/forge/canvas/transform-origin-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/canvas/transform-origin-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas/transform-origin-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ANCHOR_SNAP_RADIUS` | const | `const ANCHOR_SNAP_RADIUS = 12;` |
| `BoundsCorners` | type | `type BoundsCorners = readonly [ readonly [ number, number ], readonly [ number, number ], readonly [ number, number ], readonly [ number, number ] ];` |
| `LayerTransform` | interface | `interface LayerTransform { readonly tx: number; readonly ty: number; readonly sx: number; readonly sy: number; readonly rotation: number; readonly ox: number...` |
| `ORIGIN_ANCHORS` | const | `const ORIGIN_ANCHORS: readonly [ "top-left", "top", "top-right", "left", "center", "right", "bottom-left", "bottom", "bottom-right" ];` |
| `ORIGIN_ANCHOR_LABELS` | const | `const ORIGIN_ANCHOR_LABELS: Record<OriginAnchor, string>;` |
| `ORIGIN_PAGE_STEP` | const | `const ORIGIN_PAGE_STEP = 10;` |
| `ORIGIN_STEP` | const | `const ORIGIN_STEP = 1;` |
| `OriginAnchor` | type | `type OriginAnchor = "top-left" \| "top" \| "top-right" \| "left" \| "center" \| "right" \| "bottom-left" \| "bottom" \| "bottom-right";` |
| `OriginKeyCommand` | type | `type OriginKeyCommand = { readonly kind: "move"; readonly dx: number; readonly dy: number; } \| { readonly kind: "anchor"; readonly anchor: OriginAnchor; };` |
| `ROTATION_SNAP_STEP` | const | `const ROTATION_SNAP_STEP = 15;` |
| `anchorPoint` | function | `function anchorPoint(corners: BoundsCorners, anchor: OriginAnchor): DocPoint;` |
| `contentToDoc` | function | `function contentToDoc(t: LayerTransform, p: DocPoint): DocPoint;` |
| `currentAnchor` | const | `const currentAnchor: (corners: BoundsCorners, t: LayerTransform) => OriginAnchor \| undefined;` |
| `cycleAnchor` | function | `function cycleAnchor(current: OriginAnchor \| undefined, direction: 1 \| -1): OriginAnchor;` |
| `docToContent` | function | `function docToContent(t: LayerTransform, q: DocPoint): DocPoint;` |
| `nearestAnchor` | function | `function nearestAnchor(corners: BoundsCorners, point: DocPoint, radius: number): OriginAnchor \| undefined;` |
| `originAccessibilityValue` | function | `function originAccessibilityValue(corners: BoundsCorners, t: LayerTransform): string;` |
| `originKeyCommand` | function | `function originKeyCommand(key: string \| undefined, shift?: boolean): OriginKeyCommand \| undefined;` |
| `originPayload` | function | `function originPayload(t: LayerTransform, docPoint: DocPoint): { ox: number; oy: number; };` |
| `pivotInDoc` | const | `const pivotInDoc: (t: LayerTransform) => DocPoint;` |
| `rectCorners` | function | `function rectCorners(r: { readonly x: number; readonly y: number; readonly w: number; readonly h: number; }): BoundsCorners;` |
| `rotationFromDrag` | function | `function rotationFromDrag(pivot: DocPoint, from: DocPoint, to: DocPoint, startRotation: number, snap?: boolean): number;` |
| `snapRotation` | function | `function snapRotation(degrees: number, snap?: boolean, step?: number): number;` |
| `validateTransform` | function | `function validateTransform(t: LayerTransform): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas/transform-origin-model.ts -->
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
