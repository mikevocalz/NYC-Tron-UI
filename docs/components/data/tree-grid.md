---
name: "TreeGridModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/data/tree-grid"
tier: 2
docs: "generated"
platforms: []
category: "data"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# TreeGridModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/data/tree-grid.ts -->
Cycle/duplicate-safe projection.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/data/tree-grid.ts -->
- Package: @nyc-tron/ui
- Import: `import { moveColumn, orderTreeColumns, toggleTreeSelection, treeGridKey, treeRangeIds, treeRowAccessibilityLabel, visibleTreeRows } from "@nyc-tron/ui/components/data/tree-grid";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/data/tree-grid
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/data/tree-grid.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `OrderedTreeColumns` | interface | `interface OrderedTreeColumns<C extends TreeColumnLike> { readonly ordered: readonly C[]; readonly pinned: readonly C[]; readonly scrollable: readonly C[]; }` |
| `TreeColumnLike` | interface | `interface TreeColumnLike { readonly id: string; }` |
| `TreeGridKeyInput` | interface | `interface TreeGridKeyInput { readonly key: string; readonly shiftKey?: boolean; }` |
| `TreeGridNavState` | interface | `interface TreeGridNavState { readonly focusId?: string; readonly anchorId?: string; readonly selectedIds: readonly string[]; readonly expandedIds: readonly s...` |
| `TreeGridNode` | interface | `interface TreeGridNode { readonly id: string; readonly label: string; readonly values?: Readonly<Record<string, string \| number \| boolean \| null>>; readonly ...` |
| `VisibleTreeRow` | interface | `interface VisibleTreeRow { readonly node: TreeGridNode; readonly depth: number; readonly hasChildren: boolean; readonly parentId?: string; readonly position:...` |
| `moveColumn` | function | `function moveColumn(order: readonly string[], id: string, toIndex: number): string[];` |
| `orderTreeColumns` | function | `function orderTreeColumns<C extends TreeColumnLike>(columns: readonly C[], columnOrder?: readonly string[], pinnedColumnIds?: readonly string[]): OrderedTree...` |
| `toggleTreeSelection` | function | `function toggleTreeSelection(selected: readonly string[], id: string): string[];` |
| `treeGridKey` | function | `function treeGridKey(rows: readonly VisibleTreeRow[], state: TreeGridNavState, input: TreeGridKeyInput): TreeGridNavState \| undefined;` |
| `treeRangeIds` | function | `function treeRangeIds(rows: readonly VisibleTreeRow[], fromId: string, toId: string): string[];` |
| `treeRowAccessibilityLabel` | function | `function treeRowAccessibilityLabel(row: VisibleTreeRow): string;` |
| `visibleTreeRows` | function | `function visibleTreeRows(nodes: readonly TreeGridNode[], expanded: ReadonlySet<string>, maxDepth?: number): VisibleTreeRow[];` |
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

<!-- generated:begin a11y source=packages/ui/src/components/data/tree-grid.ts -->
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
