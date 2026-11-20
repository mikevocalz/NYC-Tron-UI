---
name: "HsvPicker"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/color/HsvPicker"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["border.2", "color.border", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "opacity.0_45", "radius.12", "radius.14", "radius.6", "radius.control", "space.1.5", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/forge/ColorChannels"]
a11yStatus: "declared"
---

# HsvPicker

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/HsvPicker.tsx -->
Controlled HSV display-color picker: a saturation/value field, a native `@expo/ui` hue slider, 44pt saturation/brightness steppers and optional RGBA channels.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/HsvPicker.tsx -->
- Package: @nyc-tron/ui
- Import: `import { HsvPicker } from "@nyc-tron/ui/forge/color/HsvPicker";`
- Peers: @expo/ui, expo-linear-gradient, react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/forge/ColorChannels

```sh
npx shadcn@latest add @nyc-tron/forge/color/HsvPicker
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/HsvPicker.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `HsvColor` | not recorded | yes | The one authoritative color. Keep it in the host's store or engine. |
| `onValueChange` | `(next: HsvColor) => void` | not recorded | yes | Called on every preview change: field drag, slider, stepper or channel edit. |
| `onApply` | `(color: HsvColor) => void` | not recorded | no | Shows an Apply button. Commit one engine/undo transaction here; it is never called on drag release. |
| `onCancel` | `() => void` | not recorded | no | Shows a Cancel button. The host restores its own committed color. |
| `fieldHeight` | `number` | `210` | no | Saturation/value field height in dp, 80..1000. |
| `step` | `number` | `0.05` | no | Saturation and brightness change per stepper press or screen-reader action, 0.001..1. |
| `hueStep` | `number` | `5` | no | Hue change in degrees per screen-reader hue action, 1..180. |
| `showChannels` | `boolean` | `true` | no | Shows the RGBA {@linkcode ColorChannels} sliders under the HSV controls. |
| `showAlpha` | `boolean` | `true` | no | Shows the opacity slider inside the channel sliders. |
| `showHexReadout` | `boolean` | `true` | no | With `showChannels` off, shows the hex value under the hue slider. Turn it off when the host already shows the value, as `ColorPickerDialog` does. |
| `disabled` | `boolean` | not recorded | no |  |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no | Drops the default token recipe; the app supplies every class. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/HsvPicker.tsx -->
- `accessibilityHint`: "Swipe up or down to change saturation; use the actions menu for brightness and hue"
- `accessibilityLabel`: "Decrease ", "Hue", "Increase ", "Saturation and brightness"
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
