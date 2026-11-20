---
name: "ParticleEmitterControls"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/motion/ParticleEmitterControls"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/Select", "@nyc-tron/shell/UnitInput"]
a11yStatus: "unverified"
---

# ParticleEmitterControls

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/ParticleEmitterControls.tsx -->
Deterministic emitter settings; the compositor owns particle simulation and texture resources.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/ParticleEmitterControls.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ParticleEmitterControls } from "@nyc-tron/ui/components/forge/motion/ParticleEmitterControls";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Select, @nyc-tron/shell/UnitInput

```sh
npx shadcn@latest add @nyc-tron/forge/motion/ParticleEmitterControls
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/ParticleEmitterControls.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `MotionParticleEmitter` | not recorded | yes |  |
| `textures` | `readonly { readonly id: string; readonly label: string; }[]` | not recorded | yes |  |
| `onCommit` | `(value: MotionParticleEmitter) => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/ParticleEmitterControls.tsx -->
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
