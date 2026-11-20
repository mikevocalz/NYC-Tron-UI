---
name: "CellFormatInspector"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/spreadsheet/CellFormatInspector"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.2"]
registryDependencies: ["@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# CellFormatInspector

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/CellFormatInspector.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/CellFormatInspector.tsx -->
- Package: @nyc-tron/ui
- Import: `import { CellFormatInspector } from "@nyc-tron/ui/forge/spreadsheet/CellFormatInspector";`
- Peers: react, react-native
- Requires: @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/CellFormatInspector
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/CellFormatInspector.tsx -->
Extends: `Omit<PropertyInspectorProps, 'label' | 'fields' | 'onCommit'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `CellFormat` | not recorded | yes |  |
| `colors` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `formattedPreview` | `string` | not recorded | yes |  |
| `onCommit` | `(value: CellFormat, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/CellFormatInspector.tsx -->
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
