---
name: "VerticalFader"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/VerticalFader"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/forge/audio/LevelFader"]
a11yStatus: "unverified"
---

# VerticalFader

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/VerticalFader.tsx -->
Canonical vertical name for the shared fader owner, including fine/numeric/reset controls.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/VerticalFader.tsx -->
- Package: @nyc-tron/ui
- Import: `import { VerticalFader } from "@nyc-tron/ui/components/forge/audio/VerticalFader";`
- Peers: react, react-native
- Requires: @nyc-tron/forge/audio/LevelFader

```sh
npx shadcn@latest add @nyc-tron/forge/audio/VerticalFader
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/VerticalFader.tsx -->
Extends: `Omit<LevelFaderProps, 'orientation' | 'onChange'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `onPreview` | `(gain: number) => void` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/VerticalFader.tsx -->
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
