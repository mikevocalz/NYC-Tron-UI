---
name: "PrecisionModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/precision"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# PrecisionModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/precision.ts -->
Shell alias for the forge input module, so `@nyc-tron/ui/components/shell/precision` resolves on this branch as it does on main.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/precision.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/precision
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { SCRUB_DETENT_PIXELS, SCRUB_MODE_THRESHOLD_PX, advancePrecisionGesture, assertRange, beginPrecisionGesture, clamp, formatStepValue, gestureToAngle } from "@/components/nyc-tron/ui/components/shell/precision";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { SCRUB_DETENT_PIXELS, SCRUB_MODE_THRESHOLD_PX, advancePrecisionGesture, assertRange, beginPrecisionGesture, clamp, formatStepValue, gestureToAngle } from "@nyc-tron/ui/components/shell/precision";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/precision.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `Point2D` | type | `type Point2D = Readonly<{ x: number; y: number; }>;` |
| `PrecisionGesture` | type | `type PrecisionGesture = Readonly<{ originY: number; anchorX: number; anchorValue: number; mode: ScrubMode; value: number; }>;` |
| `PrecisionGestureConfig` | type | `type PrecisionGestureConfig = Omit<PrecisionScrubInput, "startValue" \| "deltaPixels" \| "mode">;` |
| `PrecisionGesturePoint` | type | `type PrecisionGesturePoint = Readonly<{ x: number; y: number; }>;` |
| `PrecisionScrubInput` | interface | `interface PrecisionScrubInput extends RangeConfig { startValue: number; deltaPixels: number; pixelsPerStep?: number; mode?: ScrubMode; coarseMultiplier?: num...` |
| `RangeConfig` | type | `type RangeConfig = Readonly<{ min: number; max: number; step: number; detents?: readonly number[]; }>;` |
| `SCRUB_DETENT_PIXELS` | const | `const SCRUB_DETENT_PIXELS = 6;` |
| `SCRUB_MODE_THRESHOLD_PX` | const | `const SCRUB_MODE_THRESHOLD_PX = 28;` |
| `ScaleTick` | interface | `interface ScaleTick { position: number; major: boolean; reached: boolean; }` |
| `ScrubMode` | type | `type ScrubMode = "fine" \| "normal" \| "coarse";` |
| `advancePrecisionGesture` | function | `function advancePrecisionGesture(gesture: PrecisionGesture, point: PrecisionGesturePoint, config: PrecisionGestureConfig): PrecisionGesture;` |
| `assertRange` | function | `function assertRange({ min, max, step }: RangeConfig): void;` |
| `beginPrecisionGesture` | function | `function beginPrecisionGesture(point: PrecisionGesturePoint, value: number): PrecisionGesture;` |
| `clamp` | function | `function clamp(value: number, min: number, max: number): number;` |
| `formatStepValue` | function | `function formatStepValue(value: number, step: number): string;` |
| `gestureToAngle` | function | `function gestureToAngle(value: number, min: number, max: number): number;` |
| `normalize` | function | `function normalize(value: number, min: number, max: number): number;` |
| `pointFromDrag` | function | `function pointFromDrag(start: Point2D, dx: number, dy: number, width: number, height: number): Point2D;` |
| `scaleTicks` | function | `function scaleTicks(value: number, min: number, max: number, count?: number, majorEvery?: number): ScaleTick[];` |
| `scrubModeFromOffset` | function | `function scrubModeFromOffset(dy: number): ScrubMode;` |
| `scrubPrecision` | function | `function scrubPrecision(input: PrecisionScrubInput): number;` |
| `scrubValue` | function | `function scrubValue(start: number, dx: number, dy: number, config: RangeConfig): number;` |
| `snapTypedPrecision` | function | `function snapTypedPrecision(value: number, config: RangeConfig): number;` |
| `snapValue` | function | `function snapValue(value: number, config: RangeConfig): number;` |
| `stepDecimalPlaces` | function | `function stepDecimalPlaces(step: number): number;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/precision.ts -->
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
