---
name: "TrackHeaders"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/TrackHeaders"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/IconButton", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# TrackHeaders

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/TrackHeaders.tsx -->
Track headers (D-18): one row per track, the height of its lane.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/TrackHeaders.tsx -->
- Package: @nyc-tron/ui
- Import: `import { TrackHeaders } from "@nyc-tron/ui/components/forge/timeline/TrackHeaders";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/IconButton, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/TrackHeaders
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/TrackHeaders.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `tracks` | `readonly TimelineTrack[]` | not recorded | yes | The same tracks, in the same order, as the lanes beside it. |
| `laneHeight` | `number` | `56` | no | Match `TimelineClipLane` `laneHeight`. |
| `onSetFlag` | `(trackId: string, flag: TrackFlag, value: boolean) => void` | not recorded | yes | One call per toggle press. |
| `onRename` | `(trackId: string, name: string) => void` | not recorded | yes | On Enter or blur with a changed, nonblank name. Escape restores the old one. |
| `onMove` | `(trackId: string, toIndex: number) => void` | not recorded | no | Move to `toIndex` in the host's track list (Splice `moveTrack`). |
| `moveTarget` | `(trackId: string, direction: -1 \| 1) => number \| undefined` | not recorded | no | Where a track goes when moved up (`-1`) or down (`1`). Defaults to its neighbour in `tracks`; `OverlayAndEffectsTrackStack` keeps moves inside a kind's group. |
| `reorder` | `boolean` | not recorded | no | Shows up/down buttons in place of the switches. |
| `width` | `DimensionValue` | `232, or 56 when `compact`` | no | Header width. |
| `compact` | `boolean` | not recorded | no | Phone layout: each row is one 44pt button with the track's code (V1, O1, A2) and its state, which calls `onOpenTrack`. The host shows that track's full row elsewhere, as `OverlayAndEffectsTrackStack` does under the lanes. |
| `openTrackId` | `string` | not recorded | no |  |
| `allTracks` | `readonly TimelineTrack[]` | `tracks` | no | Every track, when `tracks` is a subset: solo on a track not shown still silences these. |
| `onOpenTrack` | `(trackId: string \| undefined) => void` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/TrackHeaders.tsx -->
- `accessibilityLabel`: "Track headers"
- `accessibilityRole`: "button", "list"
- `accessibilityState`: set from an expression
- `aria-expanded`: set from an expression
- `aria-label`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
