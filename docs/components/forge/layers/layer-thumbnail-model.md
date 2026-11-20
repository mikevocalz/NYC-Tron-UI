---
name: "LayerThumbnailModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/layers/layer-thumbnail-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# LayerThumbnailModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/layers/layer-thumbnail-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/layers/layer-thumbnail-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { CHECKER_CELL, CHECKER_MAX_CELLS, THUMBNAIL_MAX_EDGE, checkerCells, createThumbnailCache, decodeBase64, encodeBase64, encodePng } from "@nyc-tron/ui/components/forge/layers/layer-thumbnail-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/layers/layer-thumbnail-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/layers/layer-thumbnail-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `CHECKER_CELL` | const | `const CHECKER_CELL = 6;` |
| `CHECKER_MAX_CELLS` | const | `const CHECKER_MAX_CELLS = 16;` |
| `RasterPixels` | interface | `interface RasterPixels { readonly width: number; readonly height: number; readonly pixels: Uint8Array; }` |
| `THUMBNAIL_MAX_EDGE` | const | `const THUMBNAIL_MAX_EDGE = 1024;` |
| `ThumbnailCache` | interface | `interface ThumbnailCache { get(id: string, revision: number, max: number): ThumbnailState; request(id: string, revision: number, max: number, load: Thumbnail...` |
| `ThumbnailImage` | interface | `interface ThumbnailImage { readonly uri: string; readonly width: number; readonly height: number; readonly empty: boolean; }` |
| `ThumbnailLoader` | type | `type ThumbnailLoader = (id: string, max: number, signal?: AbortSignal) => Promise<RasterPixels>;` |
| `ThumbnailSource` | type | `type ThumbnailSource = { readonly kind: "pixels"; readonly raster: RasterPixels; } \| { readonly kind: "loader"; readonly scope?: string; readonly id: string;...` |
| `ThumbnailState` | type | `type ThumbnailState = { readonly status: "loading"; readonly stale?: ThumbnailImage; } \| { readonly status: "ready"; readonly image: ThumbnailImage; } \| { re...` |
| `checkerCells` | function | `function checkerCells(width: number, height: number): { cell: number; cells: { x: number; y: number; }[]; };` |
| `createThumbnailCache` | function | `function createThumbnailCache({ capacity, maxBytes, maxPending }?: { capacity?: number; maxBytes?: number; maxPending?: number; }): ThumbnailCache;` |
| `decodeBase64` | function | `function decodeBase64(text: string): Uint8Array;` |
| `encodeBase64` | function | `function encodeBase64(bytes: Uint8Array): string;` |
| `encodePng` | function | `function encodePng(raster: RasterPixels): Uint8Array;` |
| `fitContain` | function | `function fitContain(srcWidth: number, srcHeight: number, boxWidth: number, boxHeight: number): { x: number; y: number; width: number; height: number; };` |
| `isRasterEmpty` | function | `function isRasterEmpty(raster: RasterPixels): boolean;` |
| `rasterFromBase64` | function | `function rasterFromBase64(result: { readonly width: number; readonly height: number; readonly pixels_b64: string; }): RasterPixels;` |
| `rasterToImage` | function | `function rasterToImage(raster: RasterPixels, targetEdge?: number): ThumbnailImage;` |
| `sharedThumbnailCache` | const | `const sharedThumbnailCache: ThumbnailCache;` |
| `thumbnailAccessibilityLabel` | function | `function thumbnailAccessibilityLabel(label: string, state: ThumbnailState): string;` |
| `thumbnailCacheId` | function | `function thumbnailCacheId(id: string, scope?: string): string;` |
| `thumbnailRequestMax` | function | `function thumbnailRequestMax(width: number, height: number, pixelRatio: number): number;` |
| `upscaleNearest` | function | `function upscaleNearest(raster: RasterPixels, targetEdge: number): RasterPixels;` |
| `validateRaster` | function | `function validateRaster(raster: RasterPixels): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/layers/layer-thumbnail-model.ts -->
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
