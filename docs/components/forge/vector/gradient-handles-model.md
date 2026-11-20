---
name: "GradientHandlesModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/vector/gradient-handles-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# GradientHandlesModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/vector/gradient-handles-model.ts -->
Geometry for {@linkcode GradientOnCanvasHandles} (B-24): where each handle and stop sits, and the gradient that results from moving one.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/vector/gradient-handles-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/vector/gradient-handles-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { FOCAL_LIMIT, MIN_RADIUS, STOP_KEY_STEP, addStop, addStopAvailability, clampFocal, colorAt, gradientAxis } from "@/components/nyc-tron/ui/components/forge/vector/gradient-handles-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { FOCAL_LIMIT, MIN_RADIUS, STOP_KEY_STEP, addStop, addStopAvailability, clampFocal, colorAt, gradientAxis } from "@nyc-tron/ui/components/forge/vector/gradient-handles-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/vector/gradient-handles-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FOCAL_LIMIT` | const | `const FOCAL_LIMIT = 0.98;` |
| `GradientHandle` | type | `type GradientHandle = "start" \| "end" \| "center" \| "radius" \| "focal";` |
| `MIN_RADIUS` | const | `const MIN_RADIUS = 0.5;` |
| `STOP_KEY_STEP` | const | `const STOP_KEY_STEP = 0.01;` |
| `addStop` | function | `function addStop(paint: GradientPaint, offset: number): { paint: GradientPaint; index: number; };` |
| `addStopAvailability` | function | `function addStopAvailability(paint: GradientPaint): Availability;` |
| `clampFocal` | function | `function clampFocal(paint: Extract<GradientPaint, { type: "radial"; }>, p: Point): { fx: number; fy: number; };` |
| `colorAt` | function | `function colorAt(stops: readonly GradientStop[], offset: number): Rgba;` |
| `gradientAxis` | function | `function gradientAxis(paint: GradientPaint): { from: Point; to: Point; };` |
| `gradientHandles` | function | `function gradientHandles(paint: GradientPaint): { handle: GradientHandle; point: Point; }[];` |
| `handleLabel` | function | `function handleLabel(handle: GradientHandle): string;` |
| `handleValueText` | function | `function handleValueText(paint: GradientPaint, handle: GradientHandle): string;` |
| `moveGradientHandle` | function | `function moveGradientHandle(paint: GradientPaint, handle: GradientHandle, p: Point, snap?: boolean): GradientPaint;` |
| `moveStop` | function | `function moveStop(paint: GradientPaint, index: number, offset: number): GradientPaint;` |
| `projectOnAxis` | function | `function projectOnAxis(paint: GradientPaint, p: Point): { offset: number; distance: number; };` |
| `removeStop` | function | `function removeStop(paint: GradientPaint, index: number): GradientPaint;` |
| `removeStopAvailability` | function | `function removeStopAvailability(paint: GradientPaint, index: number \| undefined): Availability;` |
| `snapAngle` | function | `function snapAngle(origin: Point, p: Point): Point;` |
| `stopPoint` | function | `function stopPoint(paint: GradientPaint, offset: number): Point;` |
| `toggleFocal` | function | `function toggleFocal(paint: Extract<GradientPaint, { type: "radial"; }>): GradientPaint;` |
| `validateGradient` | function | `function validateGradient(paint: GradientPaint): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/vector/gradient-handles-model.ts -->
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
