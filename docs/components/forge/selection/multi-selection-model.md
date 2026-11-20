---
name: "MultiSelectionModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/selection/multi-selection-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# MultiSelectionModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/selection/multi-selection-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/selection/multi-selection-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { combineObjectSelection, pickSelectionObject, selectionGroupState, sharedSelectionProperty, validateSelectableObjects } from "@nyc-tron/ui/forge/selection/multi-selection-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/selection/multi-selection-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/selection/multi-selection-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ObjectSelection` | interface | `interface ObjectSelection { readonly ids: readonly string[]; readonly anchorId: string \| null; }` |
| `ObjectSelectionMode` | type | `type ObjectSelectionMode = 'replace' \| 'add' \| 'subtract' \| 'toggle' \| 'intersect';` |
| `SelectableObject` | interface | `interface SelectableObject { readonly id: string; readonly label: string; readonly parentId?: string \| null; readonly kind?: 'object' \| 'group'; readonly dis...` |
| `SelectionModifiers` | interface | `interface SelectionModifiers { readonly shift?: boolean; readonly toggle?: boolean; }` |
| `SharedPropertyState` | type | `type SharedPropertyState = { kind: 'empty'; } \| { kind: 'missing'; count: number; } \| { kind: 'mixed'; count: number; } \| { kind: 'value'; count: number; val...` |
| `SharedValue` | type | `type SharedValue = string \| number \| boolean \| null;` |
| `combineObjectSelection` | function | `function combineObjectSelection(items: readonly SelectableObject[], selection: ObjectSelection, hits: readonly string[], mode: ObjectSelectionMode, anchorId?...` |
| `pickSelectionObject` | function | `function pickSelectionObject(items: readonly SelectableObject[], selection: ObjectSelection, id: string, modifiers?: SelectionModifiers): ObjectSelection;` |
| `selectionGroupState` | function | `function selectionGroupState(items: readonly SelectableObject[], selection: ObjectSelection): { group: boolean; ungroup: boolean; editable: boolean; };` |
| `sharedSelectionProperty` | function | `function sharedSelectionProperty(items: readonly SelectableObject[], selection: ObjectSelection, key: string): SharedPropertyState;` |
| `validateSelectableObjects` | function | `function validateSelectableObjects(items: readonly SelectableObject[], selection: ObjectSelection): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/selection/multi-selection-model.ts -->
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
