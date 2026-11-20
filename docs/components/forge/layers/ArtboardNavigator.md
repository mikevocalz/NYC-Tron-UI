---
name: "ArtboardNavigator"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/layers/ArtboardNavigator"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/DragGrabHandle", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/layers/LayerThumbnail", "@nyc-tron/gestures/PanResponderDrag"]
a11yStatus: "unverified"
---

# ArtboardNavigator

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/layers/ArtboardNavigator.tsx -->
Artboard list or grid with previews (B-14).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/layers/ArtboardNavigator.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ArtboardNavigator } from "@nyc-tron/ui/components/forge/layers/ArtboardNavigator";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/DragGrabHandle, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/layers/LayerThumbnail, @nyc-tron/gestures/PanResponderDrag

```sh
npx shadcn@latest add @nyc-tron/forge/layers/ArtboardNavigator
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/layers/ArtboardNavigator.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | no |  |
| `revision` | `string \| number` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
| `artboards` | `readonly ArtboardItem[]` | not recorded | yes | Artboards in document order, as `describe.artboards` lists them. |
| `selectedId` | `string` | not recorded | no |  |
| `onSelect` | `(id: string) => void` | not recorded | yes | Tap, Enter or Space on an artboard: the host selects it and brings it into view. |
| `onAddArtboard` | `(op: AddArtboardOp, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | `addArtboard`; the navigator proposes a name, size and a spot right of the others. |
| `onUpdateArtboard` | `(op: UpdateArtboardOp, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | `updateArtboard`; the navigator only renames. |
| `onRemoveArtboard` | `(op: RemoveArtboardOp, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | `removeArtboard`. No confirmation: the host's undo restores it. |
| `onMoveArtboard` | `(op: MoveArtboardOp, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | `moveArtboard`, once per drag release or Alt+arrow press. |
| `loadThumbnail` | `(id: string, max: number, signal?: AbortSignal) => Promise<RasterPixels>` | not recorded | yes | Loads a preview (`artboardThumbnail {id, max}`, decoded). |
| `layout` | `ArtboardLayout` | `"list"` | no |  |
| `label` | `string` | `"Artboards"` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/layers/ArtboardNavigator.tsx -->
- `accessibilityHint`: "Double tap to go to this artboard. Long press to rename."
- `accessibilityLabel`: "Name for ", "Remove "
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "button", "header"
- `accessibilityState`: set from an expression
- `aria-selected`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
