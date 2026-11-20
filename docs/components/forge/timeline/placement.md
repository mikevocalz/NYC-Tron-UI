---
name: "PlacementModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/placement"
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
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/placement
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { placementEdit, placementPreview, trackAtOffset } from "@/components/nyc-tron/ui/components/forge/timeline/placement";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { placementEdit, placementPreview, trackAtOffset } from "@nyc-tron/ui/components/forge/timeline/placement";`
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
