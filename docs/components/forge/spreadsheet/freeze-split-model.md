---
name: "FreezeSplitModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/freeze-split-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# FreezeSplitModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/freeze-split-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/freeze-split-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { SPLIT_KEY_STEP, dragSplitRatio, freezeFor, splitGeometry } from "@nyc-tron/ui/components/forge/spreadsheet/freeze-split-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/freeze-split-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/freeze-split-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FreezeCommand` | type | `type FreezeCommand = "top-row" \| "first-column" \| "at-selection" \| "none";` |
| `FreezeState` | interface | `interface FreezeState { readonly frozenRows: number; readonly frozenColumns: number; }` |
| `SPLIT_KEY_STEP` | const | `const SPLIT_KEY_STEP = 0.05;` |
| `SplitAxis` | type | `type SplitAxis = "horizontal" \| "vertical";` |
| `SplitGeometry` | interface | `interface SplitGeometry { readonly first: number; readonly divider: number; readonly second: number; readonly ratio: number; }` |
| `SplitState` | interface | `interface SplitState { readonly axis: SplitAxis; readonly ratio: number; }` |
| `dragSplitRatio` | function | `function dragSplitRatio(total: number, ratio: number, delta: number, divider?: number, minPane?: number): number;` |
| `freezeFor` | function | `function freezeFor(command: FreezeCommand, focus: string \| undefined): FreezeState;` |
| `splitGeometry` | function | `function splitGeometry(total: number, ratio: number, divider?: number, minPane?: number): SplitGeometry;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/freeze-split-model.ts -->
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
