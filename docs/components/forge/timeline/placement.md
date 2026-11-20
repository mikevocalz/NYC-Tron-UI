---
name: "PlacementModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/timeline/placement"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# PlacementModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/placement.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/placement.ts -->
- Package: @nyc-tron/ui
- Import: `import { placementEdit, placementPreview, trackAtOffset } from "@nyc-tron/ui/forge/timeline/placement";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/placement
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/placement.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `Placement` | interface | `interface Placement { readonly trackId: string; readonly startFrame: number; readonly valid: boolean; readonly problem?: "overlap" \| "locked" \| "kind"; }` |
| `placementEdit` | function | `function placementEdit(clip: TimelineClip, from: TimelineTrack, p: Placement, rate: FrameRate, mode?: MoveMode, scope?: RippleScope): TimelineEdit \| undefined;` |
| `placementPreview` | function | `function placementPreview(from: TimelineTrack, target: TimelineTrack, clip: TimelineClip, startFrame: number, mode?: MoveMode): Placement;` |
| `trackAtOffset` | function | `function trackAtOffset(tracks: readonly TimelineTrack[], fromTrackId: string, laneOffset: number): TimelineTrack \| undefined;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/placement.ts -->
_Not documented._
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
