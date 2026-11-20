---
name: "MotionEffectsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/motion/motion-effects"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# MotionEffectsModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/motion-effects.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/motion-effects.ts -->
- Package: @nyc-tron/ui
- Import: `import { moveMotionEffect, validateEffectChoices, validateEffectParameterValue, validateMotionEffects } from "@nyc-tron/ui/forge/motion/motion-effects";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/motion/motion-effects
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/motion-effects.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `EffectParameter` | type | `type EffectParameter = Readonly<{ id: string; label: string; }> & (Readonly<{ kind: 'number'; value: number; minimum: number; maximum: number; step: number; ...` |
| `EffectParameterValue` | type | `type EffectParameterValue = number \| boolean \| string;` |
| `MotionEffect` | interface | `interface MotionEffect { readonly id: string; readonly typeId: string; readonly label: string; readonly bypassed: boolean; readonly favorite: boolean; readon...` |
| `MotionEffectMutation` | type | `type MotionEffectMutation = { readonly type: 'add'; readonly typeId: string; } \| { readonly type: 'remove' \| 'reset'; readonly effectId: string; } \| { readon...` |
| `moveMotionEffect` | function | `function moveMotionEffect(effects: readonly MotionEffect[], effectId: string, direction: -1 \| 1): readonly string[];` |
| `validateEffectChoices` | function | `function validateEffectChoices(choices: readonly { readonly id: string; readonly label: string; }[]): void;` |
| `validateEffectParameterValue` | function | `function validateEffectParameterValue(parameter: EffectParameter, value: EffectParameterValue): void;` |
| `validateMotionEffects` | function | `function validateMotionEffects(effects: readonly MotionEffect[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/motion-effects.ts -->
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
