---
name: "TableLayoutInspector"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/document/TableLayoutInspector"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# TableLayoutInspector

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/TableLayoutInspector.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/TableLayoutInspector.tsx -->
- Package: @nyc-tron/ui
- Import: `import { TableLayoutInspector } from "@nyc-tron/ui/forge/document/TableLayoutInspector";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/document/TableLayoutInspector
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/TableLayoutInspector.tsx -->
Extends: `Omit<PropertyInspectorProps, 'label' | 'fields' | 'onCommit'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `TableCellLayout` | not recorded | yes |  |
| `colors` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `canMerge` | `boolean` | not recorded | yes |  |
| `canSplit` | `boolean` | not recorded | yes |  |
| `onCommit` | `(value: TableCellLayout, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onMerge` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onSplit` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/TableLayoutInspector.tsx -->
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
