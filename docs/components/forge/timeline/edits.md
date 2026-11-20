---
name: "EditsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/edits"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# EditsModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/edits.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/edits.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/edits
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { assertClip, clipEnd, clipLength, clipsAt, compatibleKinds, deltaSeconds, fitsOnTrack, markedRange } from "@/components/nyc-tron/ui/components/forge/timeline/edits";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { assertClip, clipEnd, clipLength, clipsAt, compatibleKinds, deltaSeconds, fitsOnTrack, markedRange } from "@nyc-tron/ui/components/forge/timeline/edits";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/edits.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `EditPreview` | interface | `interface EditPreview { readonly startFrame: number; readonly sourceIn: number; readonly sourceOut: number; readonly valid: boolean; readonly snappedTo?: num...` |
| `InOutRange` | interface | `interface InOutRange { readonly inFrame?: number; readonly outFrame?: number; }` |
| `MoveMode` | type | `type MoveMode = "insert" \| "overwrite";` |
| `RippleScope` | type | `type RippleScope = "track" \| "all";` |
| `Snap` | interface | `interface Snap { readonly frame: number; readonly target?: number; }` |
| `SnapOptions` | interface | `interface SnapOptions { readonly targets?: readonly number[]; readonly threshold?: number; }` |
| `TimelineClip` | interface | `interface TimelineClip { readonly id: string; readonly startFrame: number; readonly sourceIn: number; readonly sourceOut: number; readonly speed: number; rea...` |
| `TimelineEdit` | type | `type TimelineEdit = { readonly kind: "move"; readonly clipId: string; readonly trackId: string; readonly startFrame: number; readonly startSeconds: number; r...` |
| `TimelineTrack` | interface | `interface TimelineTrack { readonly id: string; readonly kind: TrackKind; readonly label: string; readonly clips: readonly TimelineClip[]; readonly locked?: b...` |
| `TrackKind` | type | `type TrackKind = "video" \| "overlay" \| "audio";` |
| `assertClip` | function | `function assertClip(c: TimelineClip): void;` |
| `clipEnd` | const | `const clipEnd: (c: TimelineClip) => number;` |
| `clipLength` | function | `function clipLength(c: TimelineClip): number;` |
| `clipsAt` | function | `function clipsAt(tracks: readonly TimelineTrack[], frame: number): { track: TimelineTrack; clip: TimelineClip; }[];` |
| `compatibleKinds` | const | `const compatibleKinds: (a: TrackKind, b: TrackKind) => boolean;` |
| `deltaSeconds` | function | `function deltaSeconds(deltaFrames: number, rate: FrameRate): number;` |
| `fitsOnTrack` | function | `function fitsOnTrack(track: TimelineTrack, start: number, length: number, exceptId?: string): boolean;` |
| `markedRange` | function | `function markedRange(range: InOutRange, durationFrames: number): FrameRange;` |
| `moveEdit` | function | `function moveEdit(clip: TimelineClip, trackId: string, p: EditPreview, rate: FrameRate): TimelineEdit \| undefined;` |
| `movePreview` | function | `function movePreview(track: TimelineTrack, clip: TimelineClip, rawStart: number, opts?: SnapOptions): EditPreview;` |
| `rippleDeleteEdit` | const | `const rippleDeleteEdit: (clipId: string, trackId: string, scope: RippleScope) => TimelineEdit;` |
| `setMark` | function | `function setMark(range: InOutRange, mark: "in" \| "out", frame: number, durationFrames: number): InOutRange;` |
| `snapFrame` | function | `function snapFrame(frame: number, targets: readonly number[], threshold: number): Snap;` |
| `snapTargets` | function | `function snapTargets(tracks: readonly TimelineTrack[], exceptId: string \| undefined, extra?: readonly number[]): number[];` |
| `splitEdit` | function | `function splitEdit(clip: TimelineClip, trackId: string, frame: number, rate: FrameRate): TimelineEdit \| undefined;` |
| `timelineDuration` | function | `function timelineDuration(tracks: readonly TimelineTrack[]): number;` |
| `trackSilenced` | function | `function trackSilenced(track: TimelineTrack, tracks: readonly TimelineTrack[]): boolean;` |
| `trimEdit` | function | `function trimEdit(clip: TimelineClip, trackId: string, edge: "head" \| "tail", p: EditPreview, rate: FrameRate): TimelineEdit \| undefined;` |
| `trimPreview` | function | `function trimPreview(track: TimelineTrack, clip: TimelineClip, edge: "head" \| "tail", rawEdge: number, opts?: SnapOptions): EditPreview;` |
| `visibleClips` | function | `function visibleClips(track: TimelineTrack, range: FrameRange): TimelineClip[];` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/edits.ts -->
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
