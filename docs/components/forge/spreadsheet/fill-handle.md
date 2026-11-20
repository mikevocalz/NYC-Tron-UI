---
name: "FillHandleModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/spreadsheet/fill-handle"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# FillHandleModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/fill-handle.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/fill-handle.ts -->
- Package: @nyc-tron/ui
- Import: `import { fillFromEdge, fillTarget } from "@nyc-tron/ui/forge/spreadsheet/fill-handle";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/fill-handle
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/fill-handle.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FillBounds` | interface | `interface FillBounds { readonly rowCount: number; readonly columnCount: number; }` |
| `FillDirection` | type | `type FillDirection = "down" \| "up" \| "right" \| "left";` |
| `FillPlan` | interface | `interface FillPlan { readonly source: SheetRange; readonly target: SheetRange; readonly direction: FillDirection; }` |
| `fillFromEdge` | function | `function fillFromEdge(range: SheetRange, direction: "down" \| "right"): FillPlan \| undefined;` |
| `fillTarget` | function | `function fillTarget(source: SheetRange, delta: { readonly rows: number; readonly columns: number; }, bounds: FillBounds): FillPlan \| undefined;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/fill-handle.ts -->
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
