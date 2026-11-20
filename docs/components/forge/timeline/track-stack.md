---
name: "TrackStackModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/timeline/track-stack"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# TrackStackModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/track-stack.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/track-stack.ts -->
- Package: @nyc-tron/ui
- Import: `import { stackMoveTarget, stackOrder } from "@nyc-tron/ui/forge/timeline/track-stack";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/track-stack
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/track-stack.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `stackMoveTarget` | function | `function stackMoveTarget(tracks: readonly TimelineTrack[], trackId: string, direction: -1 \| 1): number \| undefined;` |
| `stackOrder` | function | `function stackOrder(tracks: readonly TimelineTrack[]): TimelineTrack[];` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/track-stack.ts -->
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
