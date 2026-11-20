---
name: "MotionCurvesModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/motion/motion-curves"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["space.0"]
registryDependencies: []
a11yStatus: "unverified"
---

# MotionCurvesModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/motion-curves.ts -->
Original bounded scalar animation math.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/motion-curves.ts -->
- Package: @nyc-tron/ui
- Import: `import { MOTION_MAX_TIME, MOTION_TIME_EPSILON, evaluateMotionCurve, evaluateMotionVelocity, insertMotionKey, motionSegmentControls, moveMotionKeys, removeMotionKeys } from "@nyc-tron/ui/forge/motion/motion-curves";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/motion/motion-curves
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/motion-curves.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `MOTION_MAX_TIME` | const | `const MOTION_MAX_TIME = 604800;` |
| `MOTION_TIME_EPSILON` | const | `const MOTION_TIME_EPSILON = 0.000001;` |
| `MotionCurvePoint` | interface | `interface MotionCurvePoint { readonly time: number; readonly value: number; }` |
| `MotionKeySelection` | interface | `interface MotionKeySelection { readonly propertyId: string; readonly keyId: string; }` |
| `MotionKeyframe` | interface | `interface MotionKeyframe extends MotionCurvePoint { readonly id: string; readonly interpolation: 'hold' \| 'linear' \| 'bezier'; readonly inHandle: MotionCurve...` |
| `MotionPropertyCurve` | interface | `interface MotionPropertyCurve { readonly id: string; readonly label: string; readonly minimum: number; readonly maximum: number; readonly baseValue: number; ...` |
| `evaluateMotionCurve` | function | `function evaluateMotionCurve(curve: MotionPropertyCurve, time: number): number;` |
| `evaluateMotionVelocity` | function | `function evaluateMotionVelocity(curve: MotionPropertyCurve, time: number): number \| null;` |
| `insertMotionKey` | function | `function insertMotionKey(curve: MotionPropertyCurve, time: number, id: string): MotionPropertyCurve;` |
| `motionSegmentControls` | function | `function motionSegmentControls(left: MotionKeyframe, right: MotionKeyframe): readonly [ MotionCurvePoint, MotionCurvePoint, MotionCurvePoint, MotionCurvePoin...` |
| `moveMotionKeys` | function | `function moveMotionKeys(curve: MotionPropertyCurve, ids: readonly string[], deltaTime: number, deltaValue?: number, duration?: number, snapStep?: number): Mo...` |
| `removeMotionKeys` | function | `function removeMotionKeys(curve: MotionPropertyCurve, ids: readonly string[]): MotionPropertyCurve;` |
| `sampleMotionCurve` | function | `function sampleMotionCurve(curve: MotionPropertyCurve, range: readonly [ number, number ], count?: number, speed?: boolean): readonly { time: number; value: ...` |
| `setMotionHandle` | function | `function setMotionHandle(curve: MotionPropertyCurve, id: string, side: 'in' \| 'out', point: MotionCurvePoint): MotionPropertyCurve;` |
| `setMotionInterpolation` | function | `function setMotionInterpolation(curve: MotionPropertyCurve, id: string, interpolation: MotionKeyframe['interpolation']): MotionPropertyCurve;` |
| `validateMotionCurve` | function | `function validateMotionCurve(curve: MotionPropertyCurve): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/motion-curves.ts -->
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
