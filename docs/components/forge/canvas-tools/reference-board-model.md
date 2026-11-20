---
name: "ReferenceBoardModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/canvas-tools/reference-board-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ReferenceBoardModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas-tools/reference-board-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas-tools/reference-board-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { REFERENCE_BAR_HEIGHT, REFERENCE_FITS, REFERENCE_KEY_STEP, REFERENCE_MIN_HEIGHT, REFERENCE_MIN_OPACITY, REFERENCE_MIN_WIDTH, REFERENCE_OPACITY_STEP, REFERENCE_PLACEMENTS } from "@nyc-tron/ui/forge/canvas-tools/reference-board-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/canvas-tools/reference-board-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas-tools/reference-board-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `BoardRect` | interface | `interface BoardRect { readonly x: number; readonly y: number; readonly width: number; readonly height: number; }` |
| `REFERENCE_BAR_HEIGHT` | const | `const REFERENCE_BAR_HEIGHT = 44;` |
| `REFERENCE_FITS` | const | `const REFERENCE_FITS: readonly [ { readonly value: "fit"; readonly label: "Fit"; }, { readonly value: "crop"; readonly label: "Crop"; } ];` |
| `REFERENCE_KEY_STEP` | const | `const REFERENCE_KEY_STEP = 8;` |
| `REFERENCE_MIN_HEIGHT` | const | `const REFERENCE_MIN_HEIGHT = 100;` |
| `REFERENCE_MIN_OPACITY` | const | `const REFERENCE_MIN_OPACITY = 0.1;` |
| `REFERENCE_MIN_WIDTH` | const | `const REFERENCE_MIN_WIDTH = 140;` |
| `REFERENCE_OPACITY_STEP` | const | `const REFERENCE_OPACITY_STEP = 0.1;` |
| `REFERENCE_PLACEMENTS` | const | `const REFERENCE_PLACEMENTS: readonly [ { readonly value: "float"; readonly label: "Float"; }, { readonly value: "side"; readonly label: "Side"; }, { readonly...` |
| `ReferenceEdit` | type | `type ReferenceEdit = "move" \| "resize" \| "opacity" \| "fit" \| "placement" \| "remove" \| "pin";` |
| `ReferenceFit` | type | `type ReferenceFit = "fit" \| "crop";` |
| `ReferenceImage` | interface | `interface ReferenceImage { readonly id: string; readonly label: string; readonly imageWidth: number; readonly imageHeight: number; readonly x: number; readon...` |
| `ReferenceKeyCommand` | type | `type ReferenceKeyCommand = { readonly type: "move"; readonly dx: number; readonly dy: number; } \| { readonly type: "resize"; readonly dw: number; readonly dh...` |
| `ReferencePatch` | type | `type ReferencePatch = Partial<Pick<ReferenceImage, "x" \| "y" \| "width" \| "height" \| "fit" \| "opacity" \| "locked" \| "pinned" \| "placement">>;` |
| `ReferencePlacement` | type | `type ReferencePlacement = "float" \| "side" \| "overlay";` |
| `clampFrame` | function | `function clampFrame(r: BoardRect, boardW: number, boardH: number): BoardRect;` |
| `formatReferenceOpacity` | function | `function formatReferenceOpacity(opacity: number): string;` |
| `moveFrame` | function | `function moveFrame(r: BoardRect, dx: number, dy: number, boardW: number, boardH: number): BoardRect;` |
| `pictureRect` | function | `function pictureRect(fit: ReferenceFit, frameW: number, frameH: number, imageW: number, imageH: number): BoardRect;` |
| `referenceA11yLabel` | function | `function referenceA11yLabel(r: ReferenceImage): string;` |
| `referenceEditProblem` | function | `function referenceEditProblem(ref: ReferenceImage, edit: ReferenceEdit): string \| undefined;` |
| `resizeFrame` | function | `function resizeFrame(r: BoardRect, dw: number, dh: number, boardW: number, boardH: number): BoardRect;` |
| `resolveReferenceKey` | function | `function resolveReferenceKey(e: { key?: string; shiftKey?: boolean; altKey?: boolean; }): ReferenceKeyCommand \| undefined;` |
| `stepReferenceOpacity` | function | `function stepReferenceOpacity(opacity: number, direction: -1 \| 1): number;` |
| `validateReferences` | function | `function validateReferences(refs: readonly ReferenceImage[], selectedId?: string): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas-tools/reference-board-model.ts -->
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
