---
name: "AlphaSlider"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/AlphaSlider"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.danger", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# AlphaSlider

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/AlphaSlider.tsx -->
Controlled opacity slider (C-05): a checkerboard under a transparent-to-opaque gradient of the current color, a 44pt drag track and a percent field for direct entry.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/AlphaSlider.tsx -->
- Package: @nyc-tron/ui
- Import: `import { AlphaSlider } from "@nyc-tron/ui/components/forge/color/AlphaSlider";`
- Peers: @nyc-tron/core, react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/color/AlphaSlider
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/AlphaSlider.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `RgbaColor` | not recorded | yes | The committed color. Only its alpha changes. |
| `onPreview` | `(next: RgbaColor) => void` | not recorded | no | Every drag move. Show it on the canvas; never write it to the document. |
| `onCommit` | `(next: RgbaColor) => void` | not recorded | yes | Once per drag release, key press or typed entry that changes the alpha. |
| `label` | `string` | `"Opacity"` | no |  |
| `disabled` | `boolean` | not recorded | no |  |
| `rtl` | `boolean` | `I18nManager.isRTL` | no | Track runs right to left. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/AlphaSlider.tsx -->
- `accessibilityLabel`: set from an expression
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
