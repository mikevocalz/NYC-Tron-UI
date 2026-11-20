---
name: "NameBox"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/NameBox"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.text", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# NameBox

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/NameBox.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/NameBox.tsx -->
- Package: @nyc-tron/ui
- Import: `import { NameBox } from "@nyc-tron/ui/components/forge/spreadsheet/NameBox";`
- Peers: @nyc-tron/core, react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/NameBox
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/NameBox.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `selectionLabel` | `string` | not recorded | yes |  |
| `rowCount` | `number` | not recorded | yes |  |
| `columnCount` | `number` | not recorded | yes |  |
| `names` | `readonly { id: string; label: string; range: SheetRange; }[]` | not recorded | yes |  |
| `onNavigate` | `(range: SheetRange, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/NameBox.tsx -->
- `accessibilityLabel`: "Cell address and named ranges", "Cell address or range name"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
