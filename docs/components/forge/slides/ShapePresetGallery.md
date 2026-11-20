---
name: "ShapePresetGallery"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/slides/ShapePresetGallery"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent"]
registryDependencies: ["@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/AssetPresetGallery", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# ShapePresetGallery

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/ShapePresetGallery.tsx -->
Source-backed vector previews and a selected native drag handle, plus numeric/keyboard alternatives.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/ShapePresetGallery.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, react-native-gesture-handler, zustand
- Requires: @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/AssetPresetGallery, @nyc-tron/forge/inputs/PropertyInspector

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/slides/ShapePresetGallery
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ShapePresetGallery } from "@/components/nyc-tron/ui/components/forge/slides/ShapePresetGallery";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ShapePresetGallery } from "@nyc-tron/ui/components/forge/slides/ShapePresetGallery";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/ShapePresetGallery.tsx -->
Extends: `Omit<AssetPresetGalleryProps, 'label' | 'selectedIds'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `selectedId` | `string \| null` | not recorded | yes |  |
| `adjustments` | `readonly InspectorProperty[]` | not recorded | yes |  |
| `handles` | `readonly ShapeAdjustmentHandle[]` | not recorded | yes |  |
| `canvasAspectRatio` | `number` | not recorded | yes |  |
| `renderAdjustmentPreview` | `(id: string, values: Readonly<Record<string, number>>) => ReactNode` | not recorded | yes |  |
| `onAdjustmentCommit` | `(id: string, value: number \| string \| boolean, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/ShapePresetGallery.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "adjustable"
- `accessibilityState`: set from an expression
- `accessibilityValue`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
