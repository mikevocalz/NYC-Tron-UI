---
name: "ComponentVariantPicker"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/design/ComponentVariantPicker"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# ComponentVariantPicker

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/design/ComponentVariantPicker.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/design/ComponentVariantPicker.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ComponentVariantPicker } from "@nyc-tron/ui/forge/design/ComponentVariantPicker";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/design/ComponentVariantPicker
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/design/ComponentVariantPicker.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `componentId` | `string` | not recorded | yes |  |
| `properties` | `readonly Extract<InspectorProperty, { kind: 'choice'; }>[]` | not recorded | yes |  |
| `overrides` | `readonly InspectorProperty[]` | not recorded | yes |  |
| `onPropertyChange` | `(id: string, value: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onOverride` | `(id: string, value: string \| number \| boolean, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onReset` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `unstyled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/design/ComponentVariantPicker.tsx -->
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
