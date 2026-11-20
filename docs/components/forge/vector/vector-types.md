---
name: "VectorTypesModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/vector/vector-types"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# VectorTypesModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/vector/vector-types.ts -->
Engine-neutral vector contract shared by the vector-tools cluster ({@linkcode PathNode}, {@linkcode Subpath}, {@linkcode Paint}, {@linkcode Stroke}).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/vector/vector-types.ts -->
- Package: @nyc-tron/ui
- Import: `import { AVAILABLE, IDENTITY_TRANSFORM, MAX_DASH_ENTRIES, MAX_GRADIENT_STOPS, MIN_GRADIENT_STOPS, MITER_LIMIT_RANGE, availabilityReason, deltaToContent } from "@nyc-tron/ui/components/forge/vector/vector-types";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/vector/vector-types
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/vector/vector-types.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `AVAILABLE` | const | `const AVAILABLE: Availability;` |
| `Availability` | type | `type Availability = Readonly<{ enabled: true; }> \| Readonly<{ enabled: false; reason: string; }>;` |
| `BooleanOp` | type | `type BooleanOp = "union" \| "subtract" \| "intersect" \| "exclude";` |
| `FillRule` | type | `type FillRule = "nonzero" \| "evenodd";` |
| `GradientPaint` | type | `type GradientPaint = LinearPaint \| RadialPaint;` |
| `GradientStop` | interface | `interface GradientStop { readonly offset: number; readonly color: Rgba; }` |
| `HandleOffset` | type | `type HandleOffset = readonly [ dx: number, dy: number ];` |
| `IDENTITY_TRANSFORM` | const | `const IDENTITY_TRANSFORM: ViewTransform;` |
| `LineCap` | type | `type LineCap = "butt" \| "round" \| "square";` |
| `LineJoin` | type | `type LineJoin = "miter" \| "round" \| "bevel";` |
| `LinearPaint` | interface | `interface LinearPaint { readonly type: "linear"; readonly x0: number; readonly y0: number; readonly x1: number; readonly y1: number; readonly stops: readonly...` |
| `MAX_DASH_ENTRIES` | const | `const MAX_DASH_ENTRIES = 64;` |
| `MAX_GRADIENT_STOPS` | const | `const MAX_GRADIENT_STOPS = 256;` |
| `MIN_GRADIENT_STOPS` | const | `const MIN_GRADIENT_STOPS = 2;` |
| `MITER_LIMIT_RANGE` | const | `const MITER_LIMIT_RANGE: { readonly min: 1; readonly max: 1000; };` |
| `NodeKind` | type | `type NodeKind = "corner" \| "smooth" \| "symmetric";` |
| `NodeRef` | interface | `interface NodeRef { readonly subpath: number; readonly index: number; }` |
| `Paint` | type | `type Paint = SolidPaint \| LinearPaint \| RadialPaint;` |
| `PaintOrder` | type | `type PaintOrder = "fill-stroke" \| "stroke-fill";` |
| `PathNode` | interface | `interface PathNode { readonly x: number; readonly y: number; readonly in?: HandleOffset; readonly out?: HandleOffset; readonly kind: NodeKind; }` |
| `Point` | interface | `interface Point { readonly x: number; readonly y: number; }` |
| `RadialPaint` | interface | `interface RadialPaint { readonly type: "radial"; readonly cx: number; readonly cy: number; readonly r: number; readonly fx?: number; readonly fy?: number; re...` |
| `Rgba` | type | `type Rgba = readonly [ r: number, g: number, b: number, a: number ];` |
| `SolidPaint` | interface | `interface SolidPaint { readonly type: "solid"; readonly color: Rgba; }` |
| `Stroke` | interface | `interface Stroke { readonly paint: Paint; readonly width: number; readonly join: LineJoin; readonly cap: LineCap; readonly miter_limit: number; readonly dash...` |
| `Subpath` | interface | `interface Subpath { readonly closed: boolean; readonly nodes: readonly PathNode[]; }` |
| `ViewTransform` | type | `type ViewTransform = readonly [ a: number, b: number, c: number, d: number, e: number, f: number ];` |
| `availabilityReason` | function | `function availabilityReason(a: Availability): string \| undefined;` |
| `deltaToContent` | function | `function deltaToContent(t: ViewTransform, dx: number, dy: number): Point;` |
| `describeRgba` | function | `function describeRgba(color: Rgba): string;` |
| `nudgeDelta` | function | `function nudgeDelta(key: string \| undefined, shift: boolean): Point \| undefined;` |
| `rgbaToCss` | function | `function rgbaToCss(color: Rgba): string;` |
| `roundCoord` | function | `function roundCoord(value: number): number;` |
| `toContent` | function | `function toContent(t: ViewTransform, p: Point): Point;` |
| `toView` | function | `function toView(t: ViewTransform, p: Point): Point;` |
| `transformScale` | function | `function transformScale(t: ViewTransform): number;` |
| `unavailable` | function | `function unavailable(reason: string): Availability;` |
| `validateDash` | function | `function validateDash(dash: readonly number[]): void;` |
| `validatePaint` | function | `function validatePaint(paint: Paint): void;` |
| `validateRgba` | function | `function validateRgba(color: Rgba): void;` |
| `validateStops` | function | `function validateStops(stops: readonly GradientStop[]): void;` |
| `validateStroke` | function | `function validateStroke(stroke: Stroke): void;` |
| `validateTransform` | function | `function validateTransform(t: ViewTransform): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/vector/vector-types.ts -->
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
