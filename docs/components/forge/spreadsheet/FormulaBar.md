---
name: "FormulaBar"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/FormulaBar"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.surfaceSunken", "color.text", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# FormulaBar

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/FormulaBar.tsx -->
Controlled formula text; the workbook owns the draft and evaluates only committed input.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/FormulaBar.tsx -->
- Package: @nyc-tron/ui
- Import: `import { FormulaBar } from "@nyc-tron/ui/components/forge/spreadsheet/FormulaBar";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/FormulaBar
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/FormulaBar.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `address` | `string` | not recorded | yes |  |
| `value` | `string` | not recorded | yes |  |
| `originalValue` | `string` | not recorded | yes |  |
| `onChange` | `(raw: string) => void` | not recorded | yes |  |
| `onCommit` | `(raw: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCancel` | `() => void` | not recorded | yes |  |
| `pending` | `boolean` | not recorded | no |  |
| `readOnly` | `boolean` | not recorded | no |  |
| `hideActions` | `boolean` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
| State | How it is set |
|---|---|
| `readOnly` | `readOnly` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/FormulaBar.tsx -->
- `accessibilityLabel`: "Formula bar", "Formula for "
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
```tsx example=FormulaBar
import { FormulaBar } from "@nyc-tron/ui/components/forge/spreadsheet/FormulaBar";

export function Example() {
  return <FormulaBar address="" value="" originalValue="" onChange={() => {}} onCommit={() => {}} onCancel={() => {}} />;
}
```
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
