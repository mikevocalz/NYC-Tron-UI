---
name: "VideoFilmstrip"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/timeline/VideoFilmstrip"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.1"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/layers/LayerThumbnail"]
a11yStatus: "declared"
---

# VideoFilmstrip

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/VideoFilmstrip.tsx -->
Only visible frame tiles are mounted; the bounded shared thumbnail cache owns their resources.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/VideoFilmstrip.tsx -->
- Package: @nyc-tron/ui
- Import: `import { VideoFilmstrip } from "@nyc-tron/ui/forge/timeline/VideoFilmstrip";`
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/layers/LayerThumbnail

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/VideoFilmstrip
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/VideoFilmstrip.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `sourceId` | `string` | not recorded | yes |  |
| `sourceRevision` | `number` | not recorded | yes |  |
| `durationFrames` | `number` | not recorded | yes |  |
| `viewport` | `TimelineViewport` | not recorded | yes |  |
| `height` | `number` | not recorded | no |  |
| `tileWidth` | `number` | not recorded | no |  |
| `loadFrame` | `(frame: number, max: number, signal?: AbortSignal) => Promise<RasterPixels>` | not recorded | yes | Decode this source frame; max bounds the returned raster edge. |
| `onSeek` | `(frame: number, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/VideoFilmstrip.tsx -->
- `accessibilityLabel`: "Seek to frame ", "Video filmstrip"
- `accessibilityRole`: "button"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
