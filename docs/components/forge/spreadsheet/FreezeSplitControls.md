---
name: "FreezeSplitControls"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/FreezeSplitControls"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.surfaceRaised", "color.textMuted", "radius.card"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# FreezeSplitControls

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/FreezeSplitControls.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/FreezeSplitControls.tsx -->
- Package: @nyc-tron/ui
- Import: `import { FreezeSplitControls } from "@nyc-tron/ui/components/forge/spreadsheet/FreezeSplitControls";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/FreezeSplitControls
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/FreezeSplitControls.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `freeze` | `FreezeState` | not recorded | yes |  |
| `onFreezeChange` | `(next: FreezeState) => void` | not recorded | yes |  |
| `focus` | `string` | not recorded | no | Focus cell of the grid selection; enables "Freeze at selection". |
| `split` | `SplitState` | not recorded | no | Current split, `undefined` when the sheet shows one pane. |
| `onSplitChange` | `(next: SplitState \| undefined) => void` | not recorded | no | Supplying this shows the split commands. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/FreezeSplitControls.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `aria-pressed`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
