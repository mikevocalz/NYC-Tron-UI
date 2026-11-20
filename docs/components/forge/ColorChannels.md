---
name: "ColorChannels"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/ColorChannels"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.surfaceRaised", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# ColorChannels

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/ColorChannels.tsx -->
Controlled native RGBA sliders, SDK 58-only optional `@expo/ui` backend.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/ColorChannels.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ColorChannels } from "@nyc-tron/ui/components/forge/ColorChannels";`
- Peers: @expo/ui, @nyc-tron/core, react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/ColorChannels
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/ColorChannels.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `RgbaColor` | not recorded | yes |  |
| `onValueChange` | `(value: RgbaColor) => void` | not recorded | yes |  |
| `showAlpha` | `boolean` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
| `previewClassName` | `string` | not recorded | no |  |
| `labelClassName` | `string` | `"text-text-muted" unless `unstyled`` | no | Classes for the hex and channel labels. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/ColorChannels.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "image"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
