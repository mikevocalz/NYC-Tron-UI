---
name: "InstrumentXYPad"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/inputs/InstrumentXYPad"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.surfaceRaised", "color.surfaceSunken", "color.text", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# InstrumentXYPad

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/inputs/InstrumentXYPad.tsx -->
Multi-input pad with bounded normalized coordinates; no duplicate document state.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/inputs/InstrumentXYPad.tsx -->
- Package: @nyc-tron/ui
- Import: `import { InstrumentXYPad } from "@nyc-tron/ui/components/forge/inputs/InstrumentXYPad";`
- Peers: @nyc-tron/core, react, react-native, zustand
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/inputs/InstrumentXYPad
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/inputs/InstrumentXYPad.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `x` | `number` | not recorded | yes |  |
| `y` | `number` | not recorded | yes |  |
| `label` | `string` | not recorded | yes |  |
| `disabled` | `boolean` | not recorded | no |  |
| `size` | `number` | not recorded | no |  |
| `step` | `number` | not recorded | no |  |
| `onPreview` | `(point: Point2D) => void` | not recorded | no |  |
| `onCommit` | `(point: Point2D) => void \| Promise<unknown>` | not recorded | yes |  |
| `accentColor` | `string` | not recorded | no | Optional override; defaults to the theme's accent token. |
| `unstyled` | `boolean` | not recorded | no |  |
| `className` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/inputs/InstrumentXYPad.tsx -->
- `accessibilityHint`: "Swipe up or down to change X; use the actions menu to change Y"
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
