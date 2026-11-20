---
name: "LayerTreeModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/layers/layer-tree-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# LayerTreeModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/layers/layer-tree-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/layers/layer-tree-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { flattenLayerTree, moveLayerTree, validateLayerTree, validateLayerTreeMove } from "@nyc-tron/ui/forge/layers/layer-tree-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/layers/layer-tree-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/layers/layer-tree-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `LayerTreeRow` | interface | `interface LayerTreeRow { layer: LayerRow; depth: number; inheritedLock: boolean; hasChildren: boolean; }` |
| `flattenLayerTree` | function | `function flattenLayerTree(layers: readonly LayerRow[], expandedIds: readonly string[]): LayerTreeRow[];` |
| `moveLayerTree` | function | `function moveLayerTree<T extends LayerRow>(layers: readonly T[], id: string, parentId: string \| null, toIndex: number): T[];` |
| `validateLayerTree` | function | `function validateLayerTree(layers: readonly LayerRow[]): void;` |
| `validateLayerTreeMove` | function | `function validateLayerTreeMove(layers: readonly LayerRow[], id: string, parentId: string \| null, toIndex: number): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/layers/layer-tree-model.ts -->
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
