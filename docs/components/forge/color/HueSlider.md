---
name: "HueSlider"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/color/HueSlider"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["space.2"]
registryDependencies: ["@nyc-tron/shell/UnitInput"]
a11yStatus: "unverified"
---

# HueSlider

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/HueSlider.tsx -->
Hue gradient, keyboard/screen-reader adjustment and exact degree entry.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/HueSlider.tsx -->
- Package: @nyc-tron/ui
- Import: `import { HueSlider } from "@nyc-tron/ui/forge/color/HueSlider";`
- Peers: react, react-native
- Requires: @nyc-tron/shell/UnitInput

```sh
npx shadcn@latest add @nyc-tron/forge/color/HueSlider
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/HueSlider.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `HsvColor` | not recorded | yes |  |
| `onPreview` | `(value: HsvColor) => void` | not recorded | no |  |
| `onCommit` | `(value: HsvColor) => void` | not recorded | yes |  |
| `disabled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/HueSlider.tsx -->
_Not documented._
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
