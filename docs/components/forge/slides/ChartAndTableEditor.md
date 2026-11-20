---
name: "ChartAndTableEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/slides/ChartAndTableEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Select", "@nyc-tron/forge/document/TableLayoutInspector", "@nyc-tron/forge/spreadsheet/ChartBuilder", "@nyc-tron/forge/spreadsheet/VirtualSpreadsheetGrid"]
a11yStatus: "unverified"
---

# ChartAndTableEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/ChartAndTableEditor.tsx -->
One owner for data, chart series/formatting and table cell layout across office documents.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/ChartAndTableEditor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ChartAndTableEditor } from "@nyc-tron/ui/components/forge/slides/ChartAndTableEditor";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Select, @nyc-tron/forge/document/TableLayoutInspector, @nyc-tron/forge/spreadsheet/ChartBuilder, @nyc-tron/forge/spreadsheet/VirtualSpreadsheetGrid

```sh
npx shadcn@latest add @nyc-tron/forge/slides/ChartAndTableEditor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/ChartAndTableEditor.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `chart` | `ChartBuilderProps` | not recorded | no |  |
| `table` | `{ grid: VirtualSpreadsheetGridProps; layout: TableLayoutInspectorProps; }` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/ChartAndTableEditor.tsx -->
- `accessibilityLabel`: "Slide chart and table editor"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
```tsx example=ChartAndTableEditor
import { ChartAndTableEditor } from "@nyc-tron/ui/components/forge/slides/ChartAndTableEditor";

export function Example() {
  return <ChartAndTableEditor />;
}
```
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
