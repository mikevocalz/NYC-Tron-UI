---
name: "PivotFieldList"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/PivotFieldList"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.text", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# PivotFieldList

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/PivotFieldList.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/PivotFieldList.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PivotFieldList } from "@nyc-tron/ui/components/forge/spreadsheet/PivotFieldList";`
- Peers: react, react-native, react-native-gesture-handler, zustand
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/PivotFieldList
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/PivotFieldList.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `fields` | `readonly { id: string; label: string; numeric: boolean; }[]` | not recorded | yes |  |
| `assignments` | `readonly PivotAssignment[]` | not recorded | yes |  |
| `onAssign` | `(fieldId: string, zone: PivotZone, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRemove` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onAggregate` | `(id: string, aggregate: PivotAssignment['aggregate'], signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onOrder` | `(zone: PivotZone, ids: readonly string[], signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/PivotFieldList.tsx -->
- `accessibilityLabel`: "Pivot field list"
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "header"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
