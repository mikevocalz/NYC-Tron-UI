---
name: "ThemeAndTemplateGallery"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/slides/ThemeAndTemplateGallery"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/forge/inputs/AssetPresetGallery", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# ThemeAndTemplateGallery

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/ThemeAndTemplateGallery.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/ThemeAndTemplateGallery.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ThemeAndTemplateGallery } from "@nyc-tron/ui/components/forge/slides/ThemeAndTemplateGallery";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/forge/inputs/AssetPresetGallery, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/slides/ThemeAndTemplateGallery
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/ThemeAndTemplateGallery.tsx -->
Extends: `Omit<AssetPresetGalleryProps, 'label' | 'items'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `presets` | `readonly PresentationPreset[]` | not recorded | yes |  |
| `themeFields` | `readonly InspectorProperty[]` | not recorded | yes | Actual theme roles, font options and document color IDs; unavailable resources must be admitted by the host. |
| `onThemeFieldCommit` | `(id: string, value: string \| number \| boolean, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/ThemeAndTemplateGallery.tsx -->
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
