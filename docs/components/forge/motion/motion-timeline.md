---
name: "MotionTimelineModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/motion/motion-timeline"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# MotionTimelineModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/motion-timeline.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/motion-timeline.ts -->
- Package: @nyc-tron/ui
- Import: `import { motionSelectionBounds, motionSelectionKey, moveMotionSelection, validateMotionTimeline } from "@nyc-tron/ui/forge/motion/motion-timeline";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/motion/motion-timeline
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/motion-timeline.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `motionSelectionBounds` | function | `function motionSelectionBounds(curves: readonly MotionPropertyCurve[], selection: readonly MotionKeySelection[], duration: number, gap?: number): readonly [ ...` |
| `motionSelectionKey` | function | `function motionSelectionKey(value: MotionKeySelection): string;` |
| `moveMotionSelection` | function | `function moveMotionSelection(curves: readonly MotionPropertyCurve[], selection: readonly MotionKeySelection[], anchor: MotionKeySelection, delta: number, dur...` |
| `validateMotionTimeline` | function | `function validateMotionTimeline(curves: readonly MotionPropertyCurve[], selection: readonly MotionKeySelection[], duration: number): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/motion-timeline.ts -->
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
