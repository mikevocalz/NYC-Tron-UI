---
name: "TimelineClipLane"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/TimelineClipLane"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.border", "color.danger", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/timeline/ClipTrimHandles", "@nyc-tron/forge/timeline/ModeEdgeHandles"]
a11yStatus: "unverified"
---

# TimelineClipLane

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/TimelineClipLane.tsx -->
Clip lanes (D-15): one lane per track, clips positioned by frame, only the visible ones mounted.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/TimelineClipLane.tsx -->
- Package: @nyc-tron/ui
- Import: `import { TimelineClipLane } from "@nyc-tron/ui/components/forge/timeline/TimelineClipLane";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/timeline/ClipTrimHandles, @nyc-tron/forge/timeline/ModeEdgeHandles

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/TimelineClipLane
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/TimelineClipLane.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `tracks` | `readonly TimelineTrack[]` | not recorded | yes | Tracks top to bottom. Map the engine's timeline read (Splice `timeline`) to this shape. |
| `viewport` | `TimelineViewport` | not recorded | yes |  |
| `onViewportChange` | `(viewport: TimelineViewport) => void` | not recorded | yes | Pan, pinch and Ctrl/Cmd-wheel zoom. View state, not an edit. |
| `rate` | `FrameRate` | not recorded | yes |  |
| `durationFrames` | `number` | not recorded | yes |  |
| `playheadFrame` | `number` | not recorded | yes |  |
| `selectedClipId` | `string` | not recorded | no |  |
| `onSelect` | `(clipId: string \| undefined) => void` | not recorded | yes |  |
| `selectedClipIds` | `readonly string[]` | not recorded | no | A multi-selection the host owns (D-41), drawn with the selection border. Shift, Ctrl or Cmd with a press, or Shift with Enter, calls `onToggleSelect`; without that callback those presses select as usual. |
| `onToggleSelect` | `(clipId: string) => void` | not recorded | no |  |
| `onEdit` | `(edit: TimelineEdit) => void` | not recorded | yes | One edit per finished gesture. |
| `tool` | `TimelineTool` | `"select"` | no |  |
| `moveMode` | `MoveMode` | not recorded | no | How a dragged clip lands on others (D-22). Without it a move that would overlap is refused. With it, dragging up or down onto another compatible unlocked track moves the clip there. |
| `rippleScope` | `RippleScope` | `"track"` | no | Ripple scope for insert moves and the ripple tool. |
| `snapping` | `boolean` | `true` | no | Snap moves and trims to clip edges and the playhead within 8 layout units. |
| `laneHeight` | `number` | `56` | no | Lane height, at least 44. |
| `renderClipContent` | `(clip: TimelineClip, track: TimelineTrack, size: { width: number; height: number; }) => ReactNode` | not recorded | no | Thumbnails, waveforms or other region content for a clip, drawn under its label. |
| `dropFrame` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/TimelineClipLane.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Timeline tracks"
- `accessibilityRole`: "button", "list"
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
