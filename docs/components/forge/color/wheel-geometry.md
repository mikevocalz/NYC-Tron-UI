---
name: "WheelGeometryModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/color/wheel-geometry"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# WheelGeometryModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/wheel-geometry.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/wheel-geometry.ts -->
- Package: @nyc-tron/ui
- Import: `import { FINE_HUE_RATE, HUE_RETAIN_RADIUS, RING_INNER_FRACTION, angleDelta, createRingDrag, discPointToHsv, fromPolar, hsvToDiscPoint } from "@nyc-tron/ui/forge/color/wheel-geometry";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/color/wheel-geometry
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/wheel-geometry.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FINE_HUE_RATE` | const | `const FINE_HUE_RATE = 0.2;` |
| `HUE_RETAIN_RADIUS` | const | `const HUE_RETAIN_RADIUS = 1;` |
| `PolarPoint` | interface | `interface PolarPoint { readonly angle: number; readonly distance: number; readonly radius: number; }` |
| `RING_INNER_FRACTION` | const | `const RING_INNER_FRACTION: number;` |
| `RingDrag` | interface | `interface RingDrag { begin(point: FieldPoint, size: FieldSize, hue: number): RingDragState; move(point: FieldPoint, size: FieldSize): RingDragState; }` |
| `RingDragState` | interface | `interface RingDragState { readonly hue: number; readonly fine: boolean; }` |
| `angleDelta` | function | `function angleDelta(from: number, to: number): number;` |
| `createRingDrag` | function | `function createRingDrag(): RingDrag;` |
| `discPointToHsv` | function | `function discPointToHsv(point: FieldPoint, size: FieldSize, current: HsvColor): HsvColor;` |
| `fromPolar` | function | `function fromPolar(angle: number, distance: number, size: FieldSize): FieldPoint;` |
| `hsvToDiscPoint` | function | `function hsvToDiscPoint(color: HsvColor, size: FieldSize): FieldPoint;` |
| `hueToRingPoint` | function | `function hueToRingPoint(hue: number, size: FieldSize): FieldPoint;` |
| `isOnRing` | function | `function isOnRing(distance: number, radius: number, discFraction: number): boolean;` |
| `toPolar` | function | `function toPolar(point: FieldPoint, size: FieldSize): PolarPoint;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/wheel-geometry.ts -->
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
