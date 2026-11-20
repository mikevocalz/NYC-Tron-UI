---
name: "DimensionsAndHatching"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/cad/DimensionsAndHatching"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "declared"
---

# DimensionsAndHatching

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/cad/DimensionsAndHatching.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/cad/DimensionsAndHatching.tsx -->
- Package: @nyc-tron/ui
- Import: `import { DimensionsAndHatching } from "@nyc-tron/ui/forge/cad/DimensionsAndHatching";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/cad/DimensionsAndHatching
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/cad/DimensionsAndHatching.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `items` | `readonly DraftingAnnotation[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `patterns` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `renderPreview` | `() => ReactNode` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onCommit` | `(item: DraftingAnnotation, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCreate` | `(kind: 'dimension' \| 'hatch', signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRelink` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRemove` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `canCreate` | `boolean` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/cad/DimensionsAndHatching.tsx -->
- `accessibilityState`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
