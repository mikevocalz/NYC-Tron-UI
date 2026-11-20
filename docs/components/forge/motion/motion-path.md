---
name: "MotionPathModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/motion/motion-path"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# MotionPathModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/motion-path.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/motion-path.ts -->
- Package: @nyc-tron/ui
- Import: `import { snapMotionPoint, snapMotionTangent, validateMotionPathSnapping } from "@nyc-tron/ui/components/forge/motion/motion-path";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/motion/motion-path
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/motion-path.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `MotionPathSnapping` | interface | `interface MotionPathSnapping { readonly grid: number; readonly tolerance: number; readonly targets: readonly Point[]; readonly tangentAngleDegrees: number; }` |
| `snapMotionPoint` | function | `function snapMotionPoint(point: Point, s: MotionPathSnapping): Point;` |
| `snapMotionTangent` | function | `function snapMotionTangent(offset: HandleOffset, degrees: number): HandleOffset;` |
| `validateMotionPathSnapping` | function | `function validateMotionPathSnapping(s: MotionPathSnapping): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/motion-path.ts -->
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
