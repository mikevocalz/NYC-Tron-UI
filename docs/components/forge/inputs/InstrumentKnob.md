---
name: "InstrumentKnob"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/inputs/InstrumentKnob"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# InstrumentKnob

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/inputs/InstrumentKnob.tsx -->
Native responder-based parametric control.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/inputs/InstrumentKnob.tsx -->
- Package: @nyc-tron/ui
- Import: `import { InstrumentKnob } from "@nyc-tron/ui/components/forge/inputs/InstrumentKnob";`
- Peers: @nyc-tron/core, react, react-native, zustand
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/inputs/InstrumentKnob
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/inputs/InstrumentKnob.tsx -->
Extends: `Omit<ViewProps, "children">, RangeConfig`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `number` | not recorded | yes |  |
| `label` | `string` | not recorded | yes |  |
| `unit` | `string` | not recorded | no |  |
| `size` | `number` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
| `onPreview` | `(value: number) => void` | not recorded | no |  |
| `onCommit` | `(value: number) => void \| Promise<unknown>` | not recorded | yes | Exactly once per completed gesture, never on every frame. |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
| `accentColor` | `string` | not recorded | no | Optional override; defaults to the theme's accent token. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/inputs/InstrumentKnob.tsx -->
- `accessibilityLabel`: "Decrease ", "Increase "
- `accessibilityRole`: "adjustable", "button"
- `accessibilityState`: set from an expression
- `accessibilityValue`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
