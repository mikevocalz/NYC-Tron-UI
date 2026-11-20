---
name: "ColorWheel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/ColorWheel"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.text", "color.textMuted"]
registryDependencies: []
a11yStatus: "unverified"
---

# ColorWheel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/ColorWheel.tsx -->
Controlled hue ring (C-03).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/ColorWheel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ColorWheel } from "@nyc-tron/ui/components/forge/color/ColorWheel";`
- Peers: @nyc-tron/core, react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/color/ColorWheel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/ColorWheel.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `HsvColor` | not recorded | yes | The committed color. The wheel changes only its hue. |
| `onPreview` | `(next: HsvColor) => void` | not recorded | no | Every drag move. |
| `onCommit` | `(next: HsvColor) => void` | not recorded | yes | Once per drag release, key press or screen-reader action that changes the hue. |
| `maxSize` | `number` | `240` | no | Largest diameter in layout units; the wheel shrinks to fit its container. |
| `step` | `number` | `1` | no | Degrees per arrow key or screen-reader step. Page Up/Down take 15. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/ColorWheel.tsx -->
- `accessibilityHint`: "Drag around the ring. Slide inward for fine adjustment. Arrow keys change the hue by one degree."
- `accessibilityLabel`: "Hue"
- `accessibilityRole`: "adjustable"
- `aria-disabled`: set from an expression
- `aria-valuemax`: set from an expression
- `aria-valuemin`: set from an expression
- `aria-valuenow`: set from an expression
- `aria-valuetext`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
