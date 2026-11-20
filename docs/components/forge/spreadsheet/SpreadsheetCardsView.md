---
name: "SpreadsheetCardsView"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/SpreadsheetCardsView"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.surfaceRaised", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# SpreadsheetCardsView

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/SpreadsheetCardsView.tsx -->
Explicit record mode.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/SpreadsheetCardsView.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SpreadsheetCardsView } from "@nyc-tron/ui/components/forge/spreadsheet/SpreadsheetCardsView";`
- Peers: @nyc-tron/core, react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/SpreadsheetCardsView
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/SpreadsheetCardsView.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `name` | `string` | not recorded | yes |  |
| `table` | `SheetRange` | not recorded | yes |  |
| `cells` | `CardCellValues` | not recorded | yes |  |
| `openCard` | `number \| undefined` | not recorded | yes |  |
| `onOpenCardChange` | `(index: number \| undefined) => void` | not recorded | yes |  |
| `onCommitField` | `(address: string, raw: string) => unknown` | not recorded | no |  |
| `onClose` | `() => void` | not recorded | no |  |
| `hasMore` | `boolean` | not recorded | no |  |
| `onLoadMore` | `(signal?: AbortSignal) => unknown` | not recorded | no |  |
| `pageSize` | `number` | not recorded | no |  |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/SpreadsheetCardsView.tsx -->
- `accessibilityLabel`: "Edit ", "Record cards: "
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
