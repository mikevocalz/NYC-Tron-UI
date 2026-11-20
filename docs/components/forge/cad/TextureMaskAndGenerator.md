---
name: "TextureMaskAndGenerator"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/cad/TextureMaskAndGenerator"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# TextureMaskAndGenerator

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/cad/TextureMaskAndGenerator.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/cad/TextureMaskAndGenerator.tsx -->
- Package: @nyc-tron/ui
- Import: `import { TextureMaskAndGenerator } from "@nyc-tron/ui/components/forge/cad/TextureMaskAndGenerator";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/cad/TextureMaskAndGenerator
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/cad/TextureMaskAndGenerator.tsx -->
Extends: `Omit<PropertyInspectorProps, 'label' | 'fields' | 'onCommit'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `layerId` | `string` | not recorded | yes |  |
| `kind` | `'mask' \| 'generator' \| 'fill'` | not recorded | yes |  |
| `generatorId` | `string` | not recorded | yes |  |
| `generators` | `readonly { id: string; label: string; unavailableReason?: string; }[]` | not recorded | yes |  |
| `parameters` | `readonly InspectorProperty[]` | not recorded | yes |  |
| `enabled` | `boolean` | not recorded | yes |  |
| `inverted` | `boolean` | not recorded | yes |  |
| `opacity` | `number` | not recorded | yes |  |
| `status` | `'idle' \| 'computing' \| 'ready' \| 'error'` | not recorded | yes |  |
| `renderPreview` | `() => ReactNode` | not recorded | yes |  |
| `onCommit` | `(change: { id: string; value: string \| number \| boolean; }, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRecompute` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/cad/TextureMaskAndGenerator.tsx -->
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
