---
name: "NodeLibrarySearch"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/cad/NodeLibrarySearch"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/AssetPresetGallery"]
a11yStatus: "unverified"
---

# NodeLibrarySearch

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/cad/NodeLibrarySearch.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/cad/NodeLibrarySearch.tsx -->
- Package: @nyc-tron/ui
- Import: `import { NodeLibrarySearch } from "@nyc-tron/ui/components/forge/cad/NodeLibrarySearch";`
- Peers: @nyc-tron/core, react, react-native, react-native-gesture-handler
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/AssetPresetGallery

```sh
npx shadcn@latest add @nyc-tron/forge/cad/NodeLibrarySearch
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/cad/NodeLibrarySearch.tsx -->
Extends: `Omit<AssetPresetGalleryProps, 'label' | 'onApply' | 'renderPreview'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `renderPreview` | `(id: string) => ReactNode` | not recorded | yes |  |
| `graphGeometryRevision` | `string \| number` | not recorded | yes |  |
| `screenToGraph` | `(point: { x: number; y: number; }) => { x: number; y: number; } \| null` | not recorded | yes |  |
| `defaultPoint` | `{ x: number; y: number; }` | not recorded | yes |  |
| `onInsert` | `(typeId: string, point: { x: number; y: number; }, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/cad/NodeLibrarySearch.tsx -->
- `accessibilityLabel`: "Drag "
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
