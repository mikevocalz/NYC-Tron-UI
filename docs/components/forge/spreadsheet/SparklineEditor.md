---
name: "SparklineEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/spreadsheet/SparklineEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.surfaceRaised", "color.surfaceSunken", "color.textMuted", "font.12", "radius.card", "radius.control", "space.1.5", "space.2", "space.3", "space.4"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/spreadsheet/Sparkline"]
a11yStatus: "declared"
---

# SparklineEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/SparklineEditor.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/SparklineEditor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SparklineEditor } from "@nyc-tron/ui/forge/spreadsheet/SparklineEditor";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/spreadsheet/Sparkline

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/SparklineEditor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/SparklineEditor.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `spec` | `SparklineSpec` | not recorded | yes |  |
| `onSpecChange` | `(spec: SparklineSpec) => void` | not recorded | yes |  |
| `cells` | `Readonly<Record<string, { readonly computed: string \| number \| boolean \| null; } \| undefined>>` | not recorded | yes |  |
| `selection` | `SheetRange` | not recorded | no | Adds "Use selection" for the data range. |
| `onApply` | `(spec: SparklineSpec) => unknown` | not recorded | no |  |
| `onRemove` | `(spec: SparklineSpec) => unknown` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
| `className` | `string` | not recorded | no |  |
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
| `disabled` | `disabled` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/SparklineEditor.tsx -->
- `accessibilityLiveRegion`: "polite"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
