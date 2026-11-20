---
name: "Sparkline"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/Sparkline"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.primary", "color.success", "color.textMuted"]
registryDependencies: []
a11yStatus: "unverified"
---

# Sparkline

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/Sparkline.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/Sparkline.tsx -->
- Package: @nyc-tron/ui
- Import: `import { Sparkline } from "@nyc-tron/ui/components/forge/spreadsheet/Sparkline";`
- Peers: @nyc-tron/core, react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/Sparkline
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/Sparkline.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `values` | `readonly (number \| undefined)[]` | not recorded | yes |  |
| `kind` | `SparklineKind` | not recorded | yes |  |
| `width` | `number` | not recorded | yes |  |
| `height` | `number` | not recorded | yes |  |
| `axisMin` | `SparklineAxisMin` | not recorded | no |  |
| `showHigh` | `boolean` | not recorded | no |  |
| `showLow` | `boolean` | not recorded | no |  |
| `showNegative` | `boolean` | not recorded | no |  |
| `accessibilityLabel` | `string` | not recorded | no | Screen-reader summary. Defaults to a count with the low and high values. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/Sparkline.tsx -->
- `accessibilityLabel`: set from an expression
- `role`: "img"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
