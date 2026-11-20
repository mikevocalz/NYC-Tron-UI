---
name: "EasingPresetGallery"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/motion/EasingPresetGallery"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.text", "color.textMuted", "opacity.0_5", "radius.control", "space.1", "space.2", "space.2.5"]
registryDependencies: []
a11yStatus: "declared"
---

# EasingPresetGallery

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/EasingPresetGallery.tsx -->
Complete typed easing intents.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/EasingPresetGallery.tsx -->
- Package: @nyc-tron/ui
- Import: `import { EasingPresetGallery } from "@nyc-tron/ui/forge/motion/EasingPresetGallery";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/motion/EasingPresetGallery
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/EasingPresetGallery.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `supported` | `readonly MotionEasingKind[]` | not recorded | yes |  |
| `onSelect` | `(preset: MotionEasingPreset) => void` | not recorded | yes |  |
| `onPreview` | `(preset: MotionEasingPreset \| undefined) => void` | not recorded | no |  |
| `presets` | `readonly MotionEasingPreset[]` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/EasingPresetGallery.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Motion easing presets"
- `accessibilityRole`: "radio", "radiogroup"
- `accessibilityState`: set from an expression
- `aria-checked`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
