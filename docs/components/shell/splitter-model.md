---
name: "SplitterModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/splitter-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# SplitterModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/splitter-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/splitter-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { hingeBands, mirrorBands, resolveSplit, sizeForEdge, startSizeFor, stepSplit } from "@nyc-tron/ui/shell/splitter-model";`
- Peers: @nyc-tron/core, react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/splitter-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/splitter-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `HingeBand` | interface | `interface HingeBand { readonly start: number; readonly end: number; }` |
| `SplitAxis` | type | `type SplitAxis = "horizontal" \| "vertical";` |
| `SplitLayout` | interface | `interface SplitLayout { readonly startSize: number; readonly dividerStart: number; readonly dividerSize: number; readonly endStart: number; readonly endSize:...` |
| `SplitLimits` | interface | `interface SplitLimits { readonly total: number; readonly minStart: number; readonly minEnd: number; readonly divider: number; }` |
| `hingeBands` | function | `function hingeBands(container: Rect, features: readonly FoldFeature[], axis: SplitAxis): HingeBand[];` |
| `mirrorBands` | function | `function mirrorBands(bands: readonly HingeBand[], total: number): HingeBand[];` |
| `resolveSplit` | function | `function resolveSplit(requested: number, limits: SplitLimits, bands?: readonly HingeBand[], snap?: number): SplitLayout;` |
| `sizeForEdge` | function | `function sizeForEdge(layout: SplitLayout, edge: "start" \| "end"): number;` |
| `startSizeFor` | function | `function startSizeFor(size: number, edge: "start" \| "end", limits: SplitLimits): number;` |
| `stepSplit` | function | `function stepSplit(current: SplitLayout, direction: 1 \| -1, step: number, limits: SplitLimits, bands?: readonly HingeBand[]): SplitLayout;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/splitter-model.ts -->
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
