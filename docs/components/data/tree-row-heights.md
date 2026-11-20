---
name: "TreeRowHeightsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/data/tree-row-heights"
tier: 2
docs: "generated"
platforms: []
category: "data"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# TreeRowHeightsModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/data/tree-row-heights.ts -->
Rows overlapping a viewport; `end` is exclusive.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/data/tree-row-heights.ts -->
- Package: @nyc-tron/ui
- Import: `import { createRowHeightIndex } from "@nyc-tron/ui/components/data/tree-row-heights";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/data/tree-row-heights
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/data/tree-row-heights.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `RowHeightIndex` | interface | `interface RowHeightIndex { readonly count: number; setHeight(index: number, height: number): boolean; heightOf(index: number): number; isMeasured(index: numb...` |
| `RowHeightWindow` | interface | `interface RowHeightWindow { readonly start: number; readonly end: number; }` |
| `createRowHeightIndex` | function | `function createRowHeightIndex(count: number, estimate: number): RowHeightIndex;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/data/tree-row-heights.ts -->
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
