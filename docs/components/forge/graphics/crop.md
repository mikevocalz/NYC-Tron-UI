---
name: "CropModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/graphics/crop"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# CropModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/graphics/crop.ts -->
Normalized, bounded and reversible crop manipulations; pixels remain engine-owned.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/graphics/crop.ts -->
- Package: @nyc-tron/ui
- Import: `import { cropToPixels, fitCropAspect, moveCrop, resizeCrop, resizeCropWithAspect, validateCrop } from "@nyc-tron/ui/components/forge/graphics/crop";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/graphics/crop
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/graphics/crop.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `CropCorner` | type | `type CropCorner = "nw" \| "ne" \| "sw" \| "se";` |
| `CropRect` | type | `type CropRect = Readonly<{ x: number; y: number; width: number; height: number; }>;` |
| `cropToPixels` | function | `function cropToPixels(rect: CropRect, imageWidth: number, imageHeight: number): { x: number; y: number; width: number; height: number; };` |
| `fitCropAspect` | function | `function fitCropAspect(rect: CropRect, ratio: number): CropRect;` |
| `moveCrop` | function | `function moveCrop(rect: CropRect, dx: number, dy: number): CropRect;` |
| `resizeCrop` | function | `function resizeCrop(rect: CropRect, corner: CropCorner, dx: number, dy: number): CropRect;` |
| `resizeCropWithAspect` | function | `function resizeCropWithAspect(rect: CropRect, corner: CropCorner, dx: number, dy: number, ratio?: number): CropRect;` |
| `validateCrop` | function | `function validateCrop(rect: CropRect): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/graphics/crop.ts -->
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
