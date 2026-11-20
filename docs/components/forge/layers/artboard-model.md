---
name: "ArtboardModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/layers/artboard-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ArtboardModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/layers/artboard-model.ts -->
Engine-neutral artboard list contract for `ArtboardNavigator` (B-14).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/layers/artboard-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { ARTBOARD_GAP, ARTBOARD_MAX, ARTBOARD_TILE_MIN, DEFAULT_ARTBOARD_SIZE, artboardAccessibilityLabel, artboardColumns, artboardDropIndex, artboardKeyAction } from "@nyc-tron/ui/components/forge/layers/artboard-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/layers/artboard-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/layers/artboard-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ARTBOARD_GAP` | const | `const ARTBOARD_GAP = 100;` |
| `ARTBOARD_MAX` | const | `const ARTBOARD_MAX = 300;` |
| `ARTBOARD_TILE_MIN` | const | `const ARTBOARD_TILE_MIN = 148;` |
| `AddArtboardOp` | interface | `interface AddArtboardOp { readonly name?: string; readonly x: number; readonly y: number; readonly w: number; readonly h: number; }` |
| `ArtboardItem` | interface | `interface ArtboardItem { readonly id: string; readonly name: string; readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly...` |
| `ArtboardKeyAction` | type | `type ArtboardKeyAction = { readonly kind: "focus"; readonly index: number; } \| { readonly kind: "move"; readonly to: number; } \| { readonly kind: "select"; }...` |
| `ArtboardLayout` | type | `type ArtboardLayout = "list" \| "grid";` |
| `DEFAULT_ARTBOARD_SIZE` | const | `const DEFAULT_ARTBOARD_SIZE: { readonly w: 1920; readonly h: 1080; };` |
| `MoveArtboardOp` | interface | `interface MoveArtboardOp { readonly id: string; readonly to_index: number; }` |
| `RemoveArtboardOp` | interface | `interface RemoveArtboardOp { readonly id: string; }` |
| `UpdateArtboardOp` | interface | `interface UpdateArtboardOp { readonly id: string; readonly name?: string; readonly x?: number; readonly y?: number; readonly w?: number; readonly h?: number; }` |
| `artboardAccessibilityLabel` | function | `function artboardAccessibilityLabel(a: ArtboardItem, index: number, count: number): string;` |
| `artboardColumns` | function | `function artboardColumns(width: number, gap?: number): number;` |
| `artboardDropIndex` | function | `function artboardDropIndex({ from, dx, dy, count, columns, cellWidth, cellHeight, rtl }: { from: number; dx: number; dy: number; count: number; columns: numb...` |
| `artboardKeyAction` | function | `function artboardKeyAction(key: string \| undefined, { index, count, columns, layout, rtl, alt }: { index: number; count: number; columns: number; layout: Art...` |
| `artboardThumbnailId` | function | `function artboardThumbnailId(id: string): string;` |
| `formatArtboardSize` | function | `function formatArtboardSize(a: Pick<ArtboardItem, "w" \| "h">): string;` |
| `newArtboardOp` | function | `function newArtboardOp(artboards: readonly ArtboardItem[], likeId?: string): AddArtboardOp;` |
| `nextArtboardName` | function | `function nextArtboardName(artboards: readonly Pick<ArtboardItem, "name">[]): string;` |
| `validateArtboards` | function | `function validateArtboards(artboards: readonly ArtboardItem[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/layers/artboard-model.ts -->
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
