---
name: "LoopRangeModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/loop-range"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# LoopRangeModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/loop-range.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/loop-range.ts -->
- Package: @nyc-tron/ui
- Import: `import { loopCommit, loopFromMarks, loopNext, setLoopEdge } from "@nyc-tron/ui/components/forge/timeline/loop-range";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/loop-range
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/loop-range.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `LoopCommit` | interface | `interface LoopCommit extends LoopRange { readonly inSeconds: number; readonly outSeconds: number; }` |
| `LoopRange` | interface | `interface LoopRange { readonly inFrame: number; readonly outFrame: number; }` |
| `loopCommit` | function | `function loopCommit(range: LoopRange, rate: FrameRate): LoopCommit;` |
| `loopFromMarks` | function | `function loopFromMarks(marks: InOutRange, durationFrames: number): LoopRange \| undefined;` |
| `loopNext` | function | `function loopNext(frame: number, range: LoopRange \| undefined, looping: boolean): number;` |
| `setLoopEdge` | function | `function setLoopEdge(range: LoopRange, edge: "in" \| "out", frame: number, durationFrames: number): LoopRange;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/loop-range.ts -->
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
