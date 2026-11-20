---
name: "CompositionTreeModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/motion/composition-tree"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# CompositionTreeModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/composition-tree.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/composition-tree.ts -->
- Package: @nyc-tron/ui
- Import: `import { compositionAncestors, flattenCompositionLayers, validateCompositionLayers } from "@nyc-tron/ui/forge/motion/composition-tree";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/motion/composition-tree
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/composition-tree.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `CompositionLayer` | interface | `interface CompositionLayer { readonly id: string; readonly name: string; readonly parentId: string \| null; readonly kind: CompositionLayerKind; readonly comp...` |
| `CompositionLayerKind` | type | `type CompositionLayerKind = 'composition' \| 'shape' \| 'text' \| 'footage' \| 'adjustment';` |
| `CompositionTreeRow` | interface | `interface CompositionTreeRow { readonly layer: CompositionLayer; readonly depth: number; readonly hasChildren: boolean; }` |
| `compositionAncestors` | function | `function compositionAncestors(layers: readonly CompositionLayer[], id: string): readonly string[];` |
| `flattenCompositionLayers` | function | `function flattenCompositionLayers(layers: readonly CompositionLayer[], expandedIds: readonly string[]): readonly CompositionTreeRow[];` |
| `validateCompositionLayers` | function | `function validateCompositionLayers(layers: readonly CompositionLayer[], compositionId: string): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/composition-tree.ts -->
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
