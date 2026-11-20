---
name: "ColorHarmonyAssistant"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/ColorHarmonyAssistant"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# ColorHarmonyAssistant

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/ColorHarmonyAssistant.tsx -->
Harmony and contrast helper (C-18): pick a rule, see the base color and its companions, and read each one's WCAG 2.2 contrast against `contrastBackground`.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/ColorHarmonyAssistant.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ColorHarmonyAssistant } from "@nyc-tron/ui/components/forge/color/ColorHarmonyAssistant";`
- Peers: @nyc-tron/core, react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/color/ColorHarmonyAssistant
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/ColorHarmonyAssistant.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `HsvColor` | not recorded | yes | The base color. |
| `kind` | `HarmonyKind` | not recorded | yes |  |
| `onKindChange` | `(kind: HarmonyKind) => void` | not recorded | yes |  |
| `onPick` | `(color: HsvColor) => void` | not recorded | yes | Applies a harmony color. One commit per press. |
| `contrastBackground` | `RgbaColor` | not recorded | yes | Opaque surface the colors will sit on, for the contrast check (e.g. the canvas background). |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/ColorHarmonyAssistant.tsx -->
- `accessibilityLabel`: "Harmony rule"
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "button", "radio", "radiogroup"
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
