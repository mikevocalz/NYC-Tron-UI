---
name: "MarkersModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/markers"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# MarkersModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/markers.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/markers.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/markers
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { adjacentMarker, moveMarker, nextMarkerName, resizeMarker, sortMarkers } from "@/components/nyc-tron/ui/components/forge/timeline/markers";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { adjacentMarker, moveMarker, nextMarkerName, resizeMarker, sortMarkers } from "@nyc-tron/ui/components/forge/timeline/markers";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/markers.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `MarkerUpdate` | interface | `interface MarkerUpdate { readonly frame: number; readonly seconds: number; readonly durationFrames?: number; readonly durationSeconds?: number; readonly name...` |
| `TimelineMarker` | interface | `interface TimelineMarker { readonly id: string; readonly frame: number; readonly durationFrames?: number; readonly name: string; readonly colorId?: string; r...` |
| `adjacentMarker` | function | `function adjacentMarker(markers: readonly TimelineMarker[], frame: number, direction: 1 \| -1): TimelineMarker \| undefined;` |
| `moveMarker` | function | `function moveMarker(marker: TimelineMarker, frame: number, durationFrames: number, rate: FrameRate): MarkerUpdate \| undefined;` |
| `nextMarkerName` | function | `function nextMarkerName(markers: readonly TimelineMarker[]): string;` |
| `resizeMarker` | function | `function resizeMarker(marker: TimelineMarker, durationFrames: number, timelineFrames: number, rate: FrameRate): MarkerUpdate \| undefined;` |
| `sortMarkers` | const | `const sortMarkers: (markers: readonly TimelineMarker[]) => TimelineMarker[];` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/markers.ts -->
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
