---
name: "PBRMaterialInspector"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/cad/PBRMaterialInspector"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# PBRMaterialInspector

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/cad/PBRMaterialInspector.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/cad/PBRMaterialInspector.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PBRMaterialInspector } from "@nyc-tron/ui/components/forge/cad/PBRMaterialInspector";`
- Peers: react, react-native
- Requires: @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/cad/PBRMaterialInspector
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/cad/PBRMaterialInspector.tsx -->
Extends: `Omit<PropertyInspectorProps, 'label' | 'fields' | 'onCommit'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `PBRMaterial` | not recorded | yes |  |
| `renderMaterial` | `() => ReactNode` | not recorded | yes |  |
| `onCommit` | `(value: PBRMaterial, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/cad/PBRMaterialInspector.tsx -->
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
