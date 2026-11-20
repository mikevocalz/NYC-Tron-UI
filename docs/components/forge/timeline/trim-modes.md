---
name: "TrimModesModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/trim-modes"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# TrimModesModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/trim-modes.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/trim-modes.ts -->
- Package: @nyc-tron/ui
- Import: `import { TRIM_MODE_PROBLEM_TEXT, nextTouching, previousTouching, rippleDeletePreview, rippleTracks, rippleTrimEdit, rippleTrimPreview, rollEdit } from "@nyc-tron/ui/components/forge/timeline/trim-modes";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/trim-modes
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/trim-modes.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ClipGeometry` | interface | `interface ClipGeometry { readonly startFrame: number; readonly sourceIn: number; readonly sourceOut: number; }` |
| `TRIM_MODE_PROBLEM_TEXT` | const | `const TRIM_MODE_PROBLEM_TEXT: Readonly<Record<TrimModeProblem, string>>;` |
| `TrimModePreview` | interface | `interface TrimModePreview { readonly delta: number; readonly clips: Readonly<Record<string, ClipGeometry>>; readonly valid: boolean; readonly problem?: TrimM...` |
| `TrimModeProblem` | type | `type TrimModeProblem = "overlap" \| "media" \| "length" \| "locked" \| "adjacent";` |
| `nextTouching` | const | `const nextTouching: (track: TimelineTrack, clip: TimelineClip) => TimelineClip \| undefined;` |
| `previousTouching` | const | `const previousTouching: (track: TimelineTrack, clip: TimelineClip) => TimelineClip \| undefined;` |
| `rippleDeletePreview` | function | `function rippleDeletePreview(tracks: readonly TimelineTrack[], track: TimelineTrack, clip: TimelineClip, scope: RippleScope): TrimModePreview;` |
| `rippleTracks` | const | `const rippleTracks: (tracks: readonly TimelineTrack[], track: TimelineTrack, scope: RippleScope) => TimelineTrack[];` |
| `rippleTrimEdit` | const | `const rippleTrimEdit: (clip: TimelineClip, trackId: string, edge: "head" \| "tail", scope: RippleScope, p: TrimModePreview, rate: FrameRate) => TimelineEdit \|...` |
| `rippleTrimPreview` | function | `function rippleTrimPreview(tracks: readonly TimelineTrack[], track: TimelineTrack, clip: TimelineClip, edge: "head" \| "tail", delta: number, scope: RippleSco...` |
| `rollEdit` | const | `const rollEdit: (left: TimelineClip, right: TimelineClip, trackId: string, p: TrimModePreview, rate: FrameRate) => TimelineEdit \| undefined;` |
| `rollPair` | function | `function rollPair(track: TimelineTrack, clip: TimelineClip, edge: "head" \| "tail"): { left: TimelineClip; right: TimelineClip; } \| undefined;` |
| `rollPreview` | function | `function rollPreview(track: TimelineTrack, left: TimelineClip, right: TimelineClip, delta: number): TrimModePreview;` |
| `slideEdit` | const | `const slideEdit: (clip: TimelineClip, trackId: string, p: TrimModePreview, rate: FrameRate) => TimelineEdit \| undefined;` |
| `slidePreview` | function | `function slidePreview(track: TimelineTrack, clip: TimelineClip, delta: number): TrimModePreview;` |
| `slipEdit` | const | `const slipEdit: (clip: TimelineClip, trackId: string, p: TrimModePreview, rate: FrameRate) => TimelineEdit \| undefined;` |
| `slipLimits` | function | `function slipLimits(clip: TimelineClip): { min: number; max: number; };` |
| `slipPreview` | function | `function slipPreview(track: TimelineTrack, clip: TimelineClip, delta: number): TrimModePreview;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/trim-modes.ts -->
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
