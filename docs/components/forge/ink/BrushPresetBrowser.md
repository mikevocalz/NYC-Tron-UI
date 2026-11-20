---
name: "BrushPresetBrowser"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/ink/BrushPresetBrowser"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.text", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# BrushPresetBrowser

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/ink/BrushPresetBrowser.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/ink/BrushPresetBrowser.tsx -->
- Package: @nyc-tron/ui
- Import: `import { BrushPresetBrowser } from "@nyc-tron/ui/components/forge/ink/BrushPresetBrowser";`
- Peers: @nyc-tron/core, react, react-native, react-native-gesture-handler, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/ink/BrushPresetBrowser
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/ink/BrushPresetBrowser.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `presets` | `readonly BrushPreset[]` | not recorded | yes |  |
| `selectedId` | `string` | not recorded | no |  |
| `onSelect` | `(id: string, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onFavorite` | `(id: string, favorite: boolean, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `renderPreview` | `(preset: BrushPreset) => ReactNode` | not recorded | yes | The host renders the preset's actual stroke thumbnail. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/ink/BrushPresetBrowser.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Brush presets", "Search brushes"
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "image"
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
