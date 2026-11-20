---
name: "LayerThumbnail"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/layers/LayerThumbnail"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.border", "color.danger", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# LayerThumbnail

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/layers/LayerThumbnail.tsx -->
Async, cached preview of a layer, mask or artboard (B-10).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/layers/LayerThumbnail.tsx -->
- Package: @nyc-tron/ui
- Import: `import { LayerThumbnail } from "@nyc-tron/ui/components/forge/layers/LayerThumbnail";`
- Peers: @nyc-tron/core, react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/layers/LayerThumbnail
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/layers/LayerThumbnail.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `source` | `ThumbnailSource` | not recorded | yes | Pixels in hand, or a loader keyed by id and revision. |
| `scope` | `string` | not recorded | no | Document/workspace cache namespace, combined with an optional loader source namespace. |
| `width` | `number` | `28` | no | Box size in points; the preview is fitted inside it. |
| `height` | `number` | `28` | no |  |
| `variant` | `"content" \| "mask"` | `"content"` | no | `content` draws transparency as a checkerboard. `mask` draws on a plain surface, since a mask preview is opaque gray. |
| `label` | `string` | not recorded | no | Spoken description, e.g. "Skyline preview". With a label the thumbnail is its own screen-reader image; without one it is decorative (the row that holds it speaks for it, as in `LayerStack`). |
| `cache` | `ThumbnailCache` | `sharedThumbnailCache` | no |  |
| `pixelRatio` | `number` | `PixelRatio.get()` | no | Device pixels per point used to size the request. |
| `className` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/layers/LayerThumbnail.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Retry preview"
- `accessibilityRole`: "button", "image"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
