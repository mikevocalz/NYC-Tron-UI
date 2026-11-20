---
name: "SheetTabs"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/spreadsheet/SheetTabs"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["border.0", "border.1_5", "color.accent", "color.border", "color.focus", "color.info", "color.primary", "color.success", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.1", "radius.10", "radius.3", "radius.control", "space.1", "space.1.5", "space.2", "space.3", "space.4"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# SheetTabs

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/SheetTabs.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/SheetTabs.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SheetTabs } from "@nyc-tron/ui/forge/spreadsheet/SheetTabs";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/SheetTabs
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/SheetTabs.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `tabs` | `readonly SheetTab[]` | not recorded | yes |  |
| `activeId` | `string` | not recorded | yes |  |
| `onSelect` | `(id: string) => unknown` | not recorded | yes |  |
| `onAdd` | `() => unknown` | not recorded | no |  |
| `onRename` | `(id: string, name: string) => unknown` | not recorded | no | Called with a name that passed {@linkcode sheetNameError}; reject to show the engine's message. |
| `onDuplicate` | `(id: string) => unknown` | not recorded | no |  |
| `onMove` | `(id: string, toIndex: number) => unknown` | not recorded | no | Move a tab to `toIndex` in the current order. |
| `onRemove` | `(id: string) => unknown` | not recorded | no | Never offered for the last remaining sheet. |
| `onProtectedChange` | `(id: string, isProtected: boolean) => unknown` | not recorded | no |  |
| `onToneChange` | `(id: string, tone: SheetTabTone \| undefined) => unknown` | not recorded | no |  |
| `direction` | `"ltr" \| "rtl"` | `I18nManager.isRTL` | no | Reading direction for arrow keys. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/SheetTabs.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: set from an expression
- `aria-checked`: set from an expression
- `aria-disabled`: set from an expression
- `aria-expanded`: set from an expression
- `aria-label`: "Sheets", "Tab color"
- `aria-selected`: set from an expression
- `role`: "button", "radio", "radiogroup", "tab", "tablist", "toolbar"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
