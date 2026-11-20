---
name: "PhotoMasksModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/photo/photo-masks"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# PhotoMasksModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/photo-masks.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/photo-masks.ts -->
- Package: @nyc-tron/ui
- Import: `import { MAX_PHOTO_BRUSH_POINTS, photoBrushPoint, photoGradientCoverage, validatePhotoBrush, validatePhotoBrushPoints, validatePhotoGradient, validatePhotoImageSize, validatePhotoRange } from "@nyc-tron/ui/forge/photo/photo-masks";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/photo/photo-masks
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/photo-masks.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `MAX_PHOTO_BRUSH_POINTS` | const | `const MAX_PHOTO_BRUSH_POINTS = 4096;` |
| `PhotoBrushPoint` | interface | `interface PhotoBrushPoint { readonly x: number; readonly y: number; readonly pressure: number \| null; }` |
| `PhotoBrushSettings` | interface | `interface PhotoBrushSettings { readonly radius: number; readonly feather: number; readonly flow: number; }` |
| `PhotoGradientGeometry` | type | `type PhotoGradientGeometry = { readonly type: 'linear'; readonly x0: number; readonly y0: number; readonly x1: number; readonly y1: number; } \| { readonly ty...` |
| `PhotoGradientMask` | interface | `interface PhotoGradientMask { readonly geometry: PhotoGradientGeometry; readonly feather: number; readonly invert: boolean; readonly combine: PhotoMaskCombin...` |
| `PhotoImageSize` | interface | `interface PhotoImageSize { readonly width: number; readonly height: number; }` |
| `PhotoMaskBrushSettings` | interface | `interface PhotoMaskBrushSettings extends PhotoBrushSettings { readonly operation: 'add' \| 'subtract'; }` |
| `PhotoMaskCombine` | type | `type PhotoMaskCombine = 'replace' \| 'add' \| 'subtract' \| 'intersect';` |
| `PhotoRangeMask` | interface | `interface PhotoRangeMask { readonly mode: 'luminance' \| 'color'; readonly minimum: number; readonly maximum: number; readonly color: ProfileColor \| null; rea...` |
| `PhotoRetouchSettings` | interface | `interface PhotoRetouchSettings extends PhotoBrushSettings { readonly method: 'heal' \| 'remove'; }` |
| `photoBrushPoint` | function | `function photoBrushPoint(x: number, y: number, width: number, height: number, pressure?: number): PhotoBrushPoint;` |
| `photoGradientCoverage` | function | `function photoGradientCoverage(value: PhotoGradientMask, x: number, y: number): number;` |
| `validatePhotoBrush` | function | `function validatePhotoBrush(value: PhotoBrushSettings): void;` |
| `validatePhotoBrushPoints` | function | `function validatePhotoBrushPoints(points: readonly PhotoBrushPoint[]): void;` |
| `validatePhotoGradient` | function | `function validatePhotoGradient(value: PhotoGradientMask, size: PhotoImageSize): void;` |
| `validatePhotoImageSize` | function | `function validatePhotoImageSize(size: PhotoImageSize): void;` |
| `validatePhotoRange` | function | `function validatePhotoRange(value: PhotoRangeMask): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/photo-masks.ts -->
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
