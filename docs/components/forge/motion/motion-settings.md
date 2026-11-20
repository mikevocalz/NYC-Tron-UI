---
name: "MotionSettingsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/motion/motion-settings"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# MotionSettingsModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/motion-settings.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/motion-settings.ts -->
- Package: @nyc-tron/ui
- Import: `import { defaultMotionTransform, validateMotionCamera, validateMotionLight, validateMotionMatte, validateMotionParticles, validateMotionTransform, validateMotionVector } from "@nyc-tron/ui/components/forge/motion/motion-settings";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/motion/motion-settings
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/motion-settings.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `MotionCamera` | interface | `interface MotionCamera { readonly position: MotionVector3; readonly target: MotionVector3; readonly projection: 'perspective' \| 'orthographic'; readonly foca...` |
| `MotionLight` | interface | `interface MotionLight { readonly type: 'point' \| 'spot' \| 'directional' \| 'ambient'; readonly position: MotionVector3; readonly rotation: MotionVector3; read...` |
| `MotionMatte` | interface | `interface MotionMatte { readonly sourceId: string \| null; readonly mode: 'alpha' \| 'alpha-inverted' \| 'luma' \| 'luma-inverted'; readonly enabled: boolean; re...` |
| `MotionParticleEmitter` | interface | `interface MotionParticleEmitter { readonly enabled: boolean; readonly rate: number; readonly lifetime: number; readonly speed: number; readonly spreadDegrees...` |
| `MotionTransform3D` | interface | `interface MotionTransform3D { readonly anchor: MotionVector3; readonly position: MotionVector3; readonly scale: MotionVector3; readonly rotation: MotionVecto...` |
| `MotionVector3` | interface | `interface MotionVector3 { readonly x: number; readonly y: number; readonly z: number; }` |
| `defaultMotionTransform` | function | `function defaultMotionTransform(): MotionTransform3D;` |
| `validateMotionCamera` | function | `function validateMotionCamera(value: MotionCamera): void;` |
| `validateMotionLight` | function | `function validateMotionLight(value: MotionLight): void;` |
| `validateMotionMatte` | function | `function validateMotionMatte(value: MotionMatte): void;` |
| `validateMotionParticles` | function | `function validateMotionParticles(value: MotionParticleEmitter): void;` |
| `validateMotionTransform` | function | `function validateMotionTransform(value: MotionTransform3D): void;` |
| `validateMotionVector` | function | `function validateMotionVector(value: MotionVector3, min?: number, max?: number): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/motion-settings.ts -->
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
