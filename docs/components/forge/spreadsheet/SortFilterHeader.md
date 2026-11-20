---
name: "SortFilterHeader"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/SortFilterHeader"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector", "@nyc-tron/shell/MenuButton"]
a11yStatus: "unverified"
---

# SortFilterHeader

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/SortFilterHeader.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/SortFilterHeader.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SortFilterHeader } from "@nyc-tron/ui/components/forge/spreadsheet/SortFilterHeader";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector, @nyc-tron/shell/MenuButton

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/SortFilterHeader
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/SortFilterHeader.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `columns` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `sorts` | `readonly SheetSort[]` | not recorded | yes |  |
| `filters` | `readonly SheetFilter[]` | not recorded | yes |  |
| `activeFilterId` | `string \| null` | not recorded | yes |  |
| `visibleRows` | `number` | not recorded | yes |  |
| `totalRows` | `number` | not recorded | yes |  |
| `usableRegions` | `readonly Rect2D[]` | not recorded | no |  |
| `onSortCommit` | `(sorts: readonly SheetSort[], signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onFilterCommit` | `(filter: SheetFilter, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onOpenFilter` | `(columnId: string) => void` | not recorded | yes |  |
| `unstyled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/SortFilterHeader.tsx -->
- `accessibilityLabel`: "Sheet sort and filters"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
