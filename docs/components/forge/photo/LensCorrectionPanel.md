---
name: "LensCorrectionPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/photo/LensCorrectionPanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/Select", "@nyc-tron/shell/UnitInput"]
a11yStatus: "unverified"
---

# LensCorrectionPanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/LensCorrectionPanel.tsx -->
Host-supplied calibrated profile identity and manual distortion/CA intent.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/LensCorrectionPanel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { LensCorrectionPanel } from "@nyc-tron/ui/components/forge/photo/LensCorrectionPanel";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Select, @nyc-tron/shell/UnitInput

```sh
npx shadcn@latest add @nyc-tron/forge/photo/LensCorrectionPanel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/LensCorrectionPanel.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `LensSettings` | not recorded | yes |  |
| `profiles` | `readonly LensProfile[]` | not recorded | yes |  |
| `onCommit` | `(value: LensSettings) => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/LensCorrectionPanel.tsx -->
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
