---
name: "ForegroundBackgroundChips"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/ForegroundBackgroundChips"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button"]
a11yStatus: "unverified"
---

# ForegroundBackgroundChips

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/ForegroundBackgroundChips.tsx -->
Foreground and background chips with Swap and Reset (C-12).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/ForegroundBackgroundChips.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ForegroundBackgroundChips } from "@nyc-tron/ui/components/forge/color/ForegroundBackgroundChips";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Button

```sh
npx shadcn@latest add @nyc-tron/forge/color/ForegroundBackgroundChips
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/ForegroundBackgroundChips.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `ColorPair` | not recorded | yes |  |
| `onCommit` | `(next: ColorPair) => void` | not recorded | yes | One commit per Swap or Reset. |
| `active` | `ColorPairSlot` | not recorded | yes | The chip the pickers edit. |
| `onActiveChange` | `(slot: ColorPairSlot) => void` | not recorded | yes |  |
| `defaults` | `ColorPair` | `DEFAULT_COLOR_PAIR (black on white)` | no | What Reset restores. |
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
| `active` | `active` prop, type `ColorPairSlot` |
| `disabled` | `disabled` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/ForegroundBackgroundChips.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Color being edited", "Swap foreground and background"
- `accessibilityRole`: "radio", "radiogroup"
- `accessibilityState`: set from an expression
- `aria-checked`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
