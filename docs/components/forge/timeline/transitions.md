---
name: "TransitionsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/timeline/transitions"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# TransitionsModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/transitions.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/transitions.ts -->
- Package: @nyc-tron/ui
- Import: `import { AUDIO_CROSSFADE, clampTransitionFrames, clipsOfCut, cutsOf, maxTransitionFrames, transitionAt, transitionRequest, transitionTarget } from "@nyc-tron/ui/forge/timeline/transitions";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/transitions
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/transitions.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `AUDIO_CROSSFADE` | const | `const AUDIO_CROSSFADE = "cross_fade";` |
| `TimelineCut` | interface | `interface TimelineCut { readonly trackId: string; readonly leftClipId: string; readonly rightClipId: string; readonly frame: number; }` |
| `TimelineTransition` | interface | `interface TimelineTransition { readonly id: string; readonly trackId: string; readonly leftClipId: string; readonly rightClipId: string; readonly kind: strin...` |
| `TransitionRequest` | interface | `interface TransitionRequest { readonly trackId: string; readonly leftClipId: string; readonly rightClipId: string; readonly kind: string; readonly durationFr...` |
| `TransitionTarget` | type | `type TransitionTarget = "visual" \| "audio";` |
| `clampTransitionFrames` | function | `function clampTransitionFrames(durationFrames: number, max: number): number \| undefined;` |
| `clipsOfCut` | function | `function clipsOfCut(tracks: readonly TimelineTrack[], cut: TimelineCut): { track: TimelineTrack; left: TimelineClip; right: TimelineClip; } \| undefined;` |
| `cutsOf` | function | `function cutsOf(track: TimelineTrack): TimelineCut[];` |
| `maxTransitionFrames` | function | `function maxTransitionFrames(left: TimelineClip, right: TimelineClip): number;` |
| `transitionAt` | const | `const transitionAt: (transitions: readonly TimelineTransition[], cut: TimelineCut) => TimelineTransition \| undefined;` |
| `transitionRequest` | function | `function transitionRequest(cut: TimelineCut, tracks: readonly TimelineTrack[], kind: string, durationFrames: number, rate: FrameRate): TransitionRequest \| un...` |
| `transitionTarget` | const | `const transitionTarget: (track: TimelineTrack) => TransitionTarget;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/transitions.ts -->
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
