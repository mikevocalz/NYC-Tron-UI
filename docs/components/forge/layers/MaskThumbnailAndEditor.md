---
name: "MaskThumbnailAndEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/layers/MaskThumbnailAndEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.danger", "color.surfaceRaised", "color.text", "color.textMuted", "radius.card"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber", "@nyc-tron/forge/layers/LayerThumbnail"]
a11yStatus: "unverified"
---

# MaskThumbnailAndEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/layers/MaskThumbnailAndEditor.tsx -->
Mask panel for one layer (B-12).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/layers/MaskThumbnailAndEditor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { MaskThumbnailAndEditor } from "@nyc-tron/ui/components/forge/layers/MaskThumbnailAndEditor";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber, @nyc-tron/forge/layers/LayerThumbnail

```sh
npx shadcn@latest add @nyc-tron/forge/layers/MaskThumbnailAndEditor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/layers/MaskThumbnailAndEditor.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | no |  |
| `revision` | `string \| number` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
| `layerId` | `string` | not recorded | yes | The layer whose mask this edits. |
| `layerName` | `string` | not recorded | yes |  |
| `locked` | `boolean` | `false` | no | Locked layers reject mask edits; every control then shows why. |
| `mask` | `MaskInfo \| null` | not recorded | yes | The layer's mask, or `null` when it has none. |
| `hasSelection` | `boolean` | not recorded | yes | Whether a pixel selection exists, for "From selection". |
| `loadMaskThumbnail` | `(layerId: string, max: number, signal?: AbortSignal) => Promise<RasterPixels>` | not recorded | yes | Loads the mask preview (`maskThumbnail {id: layerId, max}`, decoded). |
| `refineDraft` | `RefineDraft` | not recorded | yes | Feather and grow being dialled in; the host owns it so it survives re-renders and panel swaps. |
| `onRefineDraftChange` | `(draft: RefineDraft) => void` | not recorded | yes |  |
| `onAddMask` | `(op: AddMaskOp, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | `addMask`. |
| `onRemoveMask` | `(op: RemoveMaskOp, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | `removeMask`; `apply: true` for "Apply mask", `false` for "Delete mask". |
| `onSetMaskEnabled` | `(op: SetMaskEnabledOp, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | `setMaskEnabled`. |
| `onInvertMask` | `(op: InvertMaskOp, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | `invertMask` (toggles). |
| `onRefineMask` | `(op: RefineMaskOp, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | `refineMask`, once per press of "Refine". The host resets the draft after it lands. |
| `cache` | `ThumbnailCache` | not recorded | no |  |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/layers/MaskThumbnailAndEditor.tsx -->
- `accessibilityLabel`: "Mask for "
- `accessibilityRole`: "header"
- `role`: "switch"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
