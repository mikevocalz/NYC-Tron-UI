---
name: "ImageCropOverlay"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/graphics/ImageCropOverlay"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.surfaceRaised", "color.text"]
registryDependencies: []
a11yStatus: "unverified"
---

# ImageCropOverlay

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/graphics/ImageCropOverlay.tsx -->
Native interactive crop overlay only.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/graphics/ImageCropOverlay.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, react-native-gesture-handler, zustand
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/graphics/ImageCropOverlay
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ImageCropOverlay } from "@/components/nyc-tron/ui/components/forge/graphics/ImageCropOverlay";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ImageCropOverlay } from "@nyc-tron/ui/components/forge/graphics/ImageCropOverlay";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/graphics/ImageCropOverlay.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | no |  |
| `revision` | `string \| number` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
| `aspectRatio` | `number` | not recorded | no | Ratio in normalized image coordinates, supplied by the host. |
| `grid` | `"thirds" \| "center" \| "none"` | not recorded | no |  |
| `rect` | `CropRect` | not recorded | yes |  |
| `width` | `number` | not recorded | yes |  |
| `height` | `number` | not recorded | yes |  |
| `onPreview` | `(rect: CropRect) => void` | not recorded | no |  |
| `onCommit` | `(rect: CropRect) => void \| Promise<unknown>` | not recorded | yes |  |
| `accentColor` | `string` | not recorded | no | Optional override; defaults to the theme's accent token. |
| `accessibilityStep` | `number` | not recorded | no | Normalized distance per screen-reader move/resize action. |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
| `children` | `ReactNode` | not recorded | no |  |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
| State | How it is set |
|---|---|
| `disabled` | `disabled` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/graphics/ImageCropOverlay.tsx -->
- `accessibilityHint`: "Drag to move, or use the actions menu to move or resize"
- `accessibilityLabel`: "Crop canvas", "Crop rectangle"
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
