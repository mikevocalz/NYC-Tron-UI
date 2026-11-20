---
name: "WideGamutChannels"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/color/WideGamutChannels"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["space.2"]
registryDependencies: ["@nyc-tron/shell/UnitInput"]
a11yStatus: "unverified"
---

# WideGamutChannels

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/WideGamutChannels.tsx -->
Edits floating RGB without quantizing to bytes, clipping to sRGB or guessing a transfer function.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/WideGamutChannels.tsx -->
- Package: @nyc-tron/ui
- Import: `import { WideGamutChannels } from "@nyc-tron/ui/forge/color/WideGamutChannels";`
- Peers: react, react-native
- Requires: @nyc-tron/shell/UnitInput

```sh
npx shadcn@latest add @nyc-tron/forge/color/WideGamutChannels
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/WideGamutChannels.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `WideGamutColor` | not recorded | yes |  |
| `onCommit` | `(value: WideGamutColor) => void` | not recorded | yes |  |
| `min` | `number` | `-16` | no | Host profile's editable channel range, including negative/HDR values where applicable. |
| `max` | `number` | `16` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/WideGamutChannels.tsx -->
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
