---
name: "ColorChannelFields"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/color/ColorChannelFields"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.danger", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control", "space.1", "space.1.5", "space.2"]
registryDependencies: []
a11yStatus: "declared"
---

# ColorChannelFields

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/ColorChannelFields.tsx -->
Typed color entry (C-06): RGB, HSL or HSV channels, hex and opacity.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/ColorChannelFields.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ColorChannelFields } from "@nyc-tron/ui/forge/color/ColorChannelFields";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/color/ColorChannelFields
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/ColorChannelFields.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `HsvColor` | not recorded | yes | The committed color, as HSV so hue survives gray. |
| `onCommit` | `(next: HsvColor) => void` | not recorded | yes | One commit per accepted field entry (Enter, blur or an arrow key). |
| `model` | `ChannelModel` | not recorded | yes | The channel set shown. Keep it in the host's preferences. |
| `onModelChange` | `(model: ChannelModel) => void` | not recorded | yes |  |
| `showAlpha` | `boolean` | `true` | no | Shows the opacity field. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/ColorChannelFields.tsx -->
- `accessibilityLabel`: "Color model"
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "radio", "radiogroup"
- `accessibilityState`: set from an expression
- `aria-checked`: set from an expression
- `aria-invalid`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
