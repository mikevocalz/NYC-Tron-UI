---
name: "OverlayAndEffectsTrackStack"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/timeline/OverlayAndEffectsTrackStack"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "opacity.0_4", "radius.control", "space.2", "space.3"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/timeline/TimelineClipLane", "@nyc-tron/forge/timeline/TrackHeaders"]
a11yStatus: "declared"
---

# OverlayAndEffectsTrackStack

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/OverlayAndEffectsTrackStack.tsx -->
The track stack (D-31): `TrackHeaders` beside `TimelineClipLane`, with overlay tracks above video tracks above audio tracks, Add video, Add overlay and Add audio track, and a Reorder switch that turns the header switches into move up and move down within each group.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/OverlayAndEffectsTrackStack.tsx -->
- Package: @nyc-tron/ui
- Import: `import { OverlayAndEffectsTrackStack } from "@nyc-tron/ui/forge/timeline/OverlayAndEffectsTrackStack";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/timeline/TimelineClipLane, @nyc-tron/forge/timeline/TrackHeaders

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/OverlayAndEffectsTrackStack
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/OverlayAndEffectsTrackStack.tsx -->
Extends: `Omit<TimelineClipLaneProps, "tracks">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `tracks` | `TimelineClipLaneProps["tracks"]` | not recorded | yes | The host's tracks in engine order; the stack groups them overlay, video, audio. |
| `onSetFlag` | `(trackId: string, flag: TrackFlag, value: boolean) => void` | not recorded | yes |  |
| `onRename` | `(trackId: string, name: string) => void` | not recorded | yes |  |
| `onMoveTrack` | `(trackId: string, toIndex: number) => void` | not recorded | yes | Splice `moveTrack`: `toIndex` is a position in the host's list. |
| `onAddTrack` | `(kind: TrackKind) => void` | not recorded | yes | Splice `addTrack`. |
| `headerWidth` | `number` | `232, or 56 when `compactHeaders`` | no | Header column width; the lanes take `viewport.widthPx`. |
| `compactHeaders` | `boolean` | not recorded | no | Phone layout: headers shrink to track codes, and the opened track's full row (name, switches, reorder) shows under the lanes. |
| `laneOverlay` | `ReactNode` | not recorded | no | Drawn over the lanes, in their coordinates, with the tracks in stack order: `TransitionHandles`, `TimelinePlayhead`. Pass the same stack order to them (`stackOrder(tracks)`). |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/OverlayAndEffectsTrackStack.tsx -->
- `accessibilityLabel`: "Reorder tracks"
- `accessibilityRole`: "switch"
- `accessibilityState`: set from an expression
- `aria-checked`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
