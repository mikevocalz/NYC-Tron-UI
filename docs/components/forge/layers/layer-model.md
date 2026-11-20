---
name: "LayerModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/layers/layer-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# LayerModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/layers/layer-model.ts -->
Engine-neutral layer list contract.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/layers/layer-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { LAYER_NAME_MIN_WIDTH, LAYER_OPACITY_READOUT_WIDTH, LAYER_OPACITY_SLIDER_WIDTH, LAYER_OPACITY_STEP, LAYER_STACK_MAX_ROWS, LAYER_THUMBNAIL_SIZE, LAYER_TOUCH_TARGET, dragTargetIndex } from "@nyc-tron/ui/forge/layers/layer-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/layers/layer-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/layers/layer-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `LAYER_NAME_MIN_WIDTH` | const | `const LAYER_NAME_MIN_WIDTH = 96;` |
| `LAYER_OPACITY_READOUT_WIDTH` | const | `const LAYER_OPACITY_READOUT_WIDTH = 56;` |
| `LAYER_OPACITY_SLIDER_WIDTH` | const | `const LAYER_OPACITY_SLIDER_WIDTH = 120;` |
| `LAYER_OPACITY_STEP` | const | `const LAYER_OPACITY_STEP = 0.05;` |
| `LAYER_STACK_MAX_ROWS` | const | `const LAYER_STACK_MAX_ROWS = 500;` |
| `LAYER_THUMBNAIL_SIZE` | const | `const LAYER_THUMBNAIL_SIZE = 28;` |
| `LAYER_TOUCH_TARGET` | const | `const LAYER_TOUCH_TARGET = 44;` |
| `LayerKind` | type | `type LayerKind = "raster" \| "vector" \| "text" \| "group" \| "adjustment";` |
| `LayerOpacityMode` | type | `type LayerOpacityMode = "slider" \| "readout";` |
| `LayerRow` | type | `type LayerRow = Readonly<{ id: string; name: string; visible: boolean; opacity: number; locked?: boolean; kind: LayerKind; parentId?: string \| null; kindLabe...` |
| `LayerRowParts` | type | `type LayerRowParts = Readonly<{ thumbnail: boolean; removable: boolean; }>;` |
| `LayerThumbnail` | type | `type LayerThumbnail = Readonly<{ fill: string; label?: string; }> \| Readonly<{ node: ReactNode; label?: string; }>;` |
| `dragTargetIndex` | function | `function dragTargetIndex(fromIndex: number, dy: number, rowHeight: number, count: number): number;` |
| `formatOpacity` | function | `function formatOpacity(value: number): string;` |
| `layerAccessibilityLabel` | function | `function layerAccessibilityLabel(layer: LayerRow, index: number, count: number): string;` |
| `layerDetail` | function | `function layerDetail(layer: Pick<LayerRow, "kind" \| "kindLabel">): string;` |
| `layerKindLabel` | function | `function layerKindLabel(kind: LayerKind): string;` |
| `layerOpacityMode` | function | `function layerOpacityMode(width: number \| undefined, parts: LayerRowParts): LayerOpacityMode;` |
| `layerRowMinWidth` | function | `function layerRowMinWidth(parts: LayerRowParts, mode: LayerOpacityMode): number;` |
| `moveLayer` | function | `function moveLayer<T extends Pick<LayerRow, "id">>(layers: readonly T[], id: string, toIndex: number): T[];` |
| `normalizeOpacity` | function | `function normalizeOpacity(value: number): number;` |
| `opacityFromDrag` | function | `function opacityFromDrag(start: number, dx: number, trackWidth: number): number;` |
| `removeLayer` | function | `function removeLayer<T extends Pick<LayerRow, "id">>(layers: readonly T[], id: string): T[];` |
| `resolveRename` | function | `function resolveRename(current: string, draft: string): string \| undefined;` |
| `stepOpacity` | function | `function stepOpacity(value: number, direction: -1 \| 1, step?: number): number;` |
| `validateLayers` | function | `function validateLayers(layers: readonly LayerRow[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/layers/layer-model.ts -->
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
