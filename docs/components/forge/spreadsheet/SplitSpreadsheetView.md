---
name: "SplitSpreadsheetView"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/spreadsheet/SplitSpreadsheetView"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceSunken", "color.textMuted", "radius.2"]
registryDependencies: ["@nyc-tron/gestures/PanResponderDrag"]
a11yStatus: "declared"
---

# SplitSpreadsheetView

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/SplitSpreadsheetView.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/SplitSpreadsheetView.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SplitSpreadsheetView } from "@nyc-tron/ui/forge/spreadsheet/SplitSpreadsheetView";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/gestures/PanResponderDrag

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/SplitSpreadsheetView
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/SplitSpreadsheetView.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `split` | `SplitState` | not recorded | yes |  |
| `onSplitChange` | `(next: SplitState) => void` | not recorded | yes |  |
| `renderPane` | `(pane: 0 \| 1, size: { readonly width: number; readonly height: number; }) => ReactNode` | not recorded | yes |  |
| `width` | `number` | not recorded | no | Width and height may come from the host or from onLayout. |
| `height` | `number` | not recorded | no |  |
| `minPane` | `number` | `136` | no | Smallest pane, in points. |
| `transport` | `DragTransport` | `PanResponderDrag` | no |  |
| `className` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/SplitSpreadsheetView.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "adjustable"
- `accessibilityState`: set from an expression
- `accessibilityValue`: set from an expression
- `aria-valuemax`: set from an expression
- `aria-valuemin`: set from an expression
- `aria-valuenow`: set from an expression
- `aria-valuetext`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
