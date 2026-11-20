---
name: "SlideModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/slides/slide-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# SlideModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/slide-model.ts -->
RGBA channels 0–255, as presentation engines store document colors.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/slide-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { SLIDE_DEFAULT_SIZE, gridColumns, gridMove, moveBlock, moveId, nextSelection, planMoves, rgbaCss } from "@nyc-tron/ui/forge/slides/slide-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/slides/slide-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/slide-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `SLIDE_DEFAULT_SIZE` | const | `const SLIDE_DEFAULT_SIZE: { readonly width: 960; readonly height: 540; };` |
| `SlideObject` | interface | `interface SlideObject { readonly id: string; readonly kind: SlideObjectKind; readonly x: number; readonly y: number; readonly w: number; readonly h: number; ...` |
| `SlideObjectKind` | type | `type SlideObjectKind = "text" \| "rect" \| "image";` |
| `SlideRgba` | type | `type SlideRgba = readonly [ number, number, number, number ];` |
| `SlideSize` | interface | `interface SlideSize { readonly width: number; readonly height: number; }` |
| `SlideSummary` | interface | `interface SlideSummary { readonly id: string; readonly objects: readonly SlideObject[]; readonly background?: SlideRgba; }` |
| `gridColumns` | function | `function gridColumns(width: number, minCell: number, gap: number): number;` |
| `gridMove` | function | `function gridMove(index: number, key: string, columns: number, count: number, rtl?: boolean): number \| undefined;` |
| `moveBlock` | function | `function moveBlock(ids: readonly string[], moving: readonly string[], toIndex: number): string[];` |
| `moveId` | function | `function moveId(ids: readonly string[], id: string, toIndex: number): string[];` |
| `nextSelection` | function | `function nextSelection(order: readonly string[], selected: readonly string[], anchor: string \| undefined, id: string, mode: "replace" \| "toggle" \| "range"): ...` |
| `planMoves` | function | `function planMoves(before: readonly string[], after: readonly string[]): Array<{ from: number; to: number; }>;` |
| `rgbaCss` | function | `function rgbaCss(c: SlideRgba): string;` |
| `slideLabel` | function | `function slideLabel(slide: SlideSummary, index: number, count: number): string;` |
| `slideTitle` | function | `function slideTitle(slide: SlideSummary, index: number): string;` |
| `validateSlideSummary` | function | `function validateSlideSummary(slide: SlideSummary): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/slide-model.ts -->
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
