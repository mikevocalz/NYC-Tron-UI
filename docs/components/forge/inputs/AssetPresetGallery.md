---
name: "AssetPresetGallery"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/inputs/AssetPresetGallery"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.text", "color.textMuted", "radius.control", "space.1.5", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# AssetPresetGallery

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/inputs/AssetPresetGallery.tsx -->
One virtual gallery owner for source-backed presets; all previews and saved metadata are host supplied.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/inputs/AssetPresetGallery.tsx -->
- Package: @nyc-tron/ui
- Import: `import { AssetPresetGallery } from "@nyc-tron/ui/forge/inputs/AssetPresetGallery";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/inputs/AssetPresetGallery
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/inputs/AssetPresetGallery.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | not recorded | yes |  |
| `items` | `readonly AssetPreset[]` | not recorded | yes |  |
| `selectedIds` | `readonly string[]` | not recorded | yes |  |
| `renderPreview` | `(id: string) => ReactNode` | not recorded | yes |  |
| `onApply` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onFavorite` | `(id: string, favorite: boolean, signal?: AbortSignal) => unknown` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/inputs/AssetPresetGallery.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Search "
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
