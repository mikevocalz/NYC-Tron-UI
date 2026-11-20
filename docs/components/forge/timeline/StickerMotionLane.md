---
name: "StickerMotionLane"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/StickerMotionLane"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber", "@nyc-tron/forge/motion/MotionKeyframeTimeline", "@nyc-tron/forge/timeline/InOutRangeHandles", "@nyc-tron/shell/MenuButton"]
a11yStatus: "unverified"
---

# StickerMotionLane

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/StickerMotionLane.tsx -->
Sticker objects retain their own ranges, transforms and shared editable motion keys.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/StickerMotionLane.tsx -->
- Package: @nyc-tron/ui
- Import: `import { StickerMotionLane } from "@nyc-tron/ui/components/forge/timeline/StickerMotionLane";`
- Peers: @nyc-tron/core, react, react-native, react-native-gesture-handler
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber, @nyc-tron/forge/motion/MotionKeyframeTimeline, @nyc-tron/forge/timeline/InOutRangeHandles, @nyc-tron/shell/MenuButton

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/StickerMotionLane
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/StickerMotionLane.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `stickers` | `readonly TimelineSticker[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `catalog` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `durationFrames` | `number` | not recorded | yes |  |
| `frame` | `number` | not recorded | yes |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `viewport` | `TimelineViewport` | not recorded | yes |  |
| `surface` | `ReactNode` | not recorded | yes |  |
| `keyframes` | `Omit<MotionKeyframeTimelineProps, 'scope' \| 'revision' \| 'disabled' \| 'unstyled' \| 'frameRate'>` | not recorded | yes |  |
| `onInsert` | `(assetId: string, frame: number, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onRangeChange` | `(id: string, range: { startFrame: number; endFrame: number; }, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onTransform` | `(id: string, transform: StickerTransform, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onRemove` | `(id: string, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/StickerMotionLane.tsx -->
- `accessibilityLabel`: "Sticker motion lane"
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
