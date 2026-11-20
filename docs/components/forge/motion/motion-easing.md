---
name: "MotionEasingModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/motion/motion-easing"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# MotionEasingModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/motion-easing.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/motion-easing.ts -->
- Package: @nyc-tron/ui
- Import: `import { MOTION_EASING_PRESETS, validateMotionEasing, validateMotionEasingPresets } from "@nyc-tron/ui/forge/motion/motion-easing";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/motion/motion-easing
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/motion-easing.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `MOTION_EASING_PRESETS` | const | `const MOTION_EASING_PRESETS: readonly MotionEasingPreset[];` |
| `MotionEasing` | type | `type MotionEasing = { readonly kind: 'hold'; } \| { readonly kind: 'linear'; } \| { readonly kind: 'bezier'; readonly x1: number; readonly y1: number; readonly...` |
| `MotionEasingKind` | type | `type MotionEasingKind = 'hold' \| 'linear' \| 'bezier' \| 'spring';` |
| `MotionEasingPreset` | interface | `interface MotionEasingPreset { readonly id: string; readonly label: string; readonly value: MotionEasing; }` |
| `validateMotionEasing` | function | `function validateMotionEasing(value: MotionEasing): void;` |
| `validateMotionEasingPresets` | function | `function validateMotionEasingPresets(presets: readonly MotionEasingPreset[]): void;` |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/motion-easing.ts -->
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
