---
name: "FillStrokeModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/vector/fill-stroke-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# FillStrokeModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/vector/fill-stroke-model.ts -->
Paint and stroke editing rules for {@linkcode FillStrokeInspector} (B-23).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/vector/fill-stroke-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { DASH_OFFSET_RANGE, DASH_PRESETS, FILL_TYPES, MITER_RANGE, STROKE_WIDTH_RANGE, convertPaint, dashForPreset, defaultStroke } from "@nyc-tron/ui/forge/vector/fill-stroke-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/vector/fill-stroke-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/vector/fill-stroke-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ContentBounds` | interface | `interface ContentBounds { readonly x: number; readonly y: number; readonly width: number; readonly height: number; }` |
| `DASH_OFFSET_RANGE` | const | `const DASH_OFFSET_RANGE: { readonly min: -1000; readonly max: 1000; readonly step: 0.5; };` |
| `DASH_PRESETS` | const | `const DASH_PRESETS: readonly [ { readonly value: "solid"; readonly label: "Solid"; }, { readonly value: "dash"; readonly label: "Dash"; }, { readonly value: ...` |
| `DashParse` | type | `type DashParse = Readonly<{ ok: true; dash: number[]; }> \| Readonly<{ ok: false; error: string; }>;` |
| `DashPreset` | type | `type DashPreset = "solid" \| "dash" \| "dot" \| "dash-dot" \| "custom";` |
| `FILL_TYPES` | const | `const FILL_TYPES: readonly [ { readonly value: "none"; readonly label: "None"; }, { readonly value: "solid"; readonly label: "Solid"; }, { readonly value: "l...` |
| `FillType` | type | `type FillType = "none" \| Paint["type"];` |
| `MITER_RANGE` | const | `const MITER_RANGE: { readonly min: 1; readonly max: 1000; readonly step: 0.5; };` |
| `PaintSupport` | interface | `interface PaintSupport { readonly gradientFill: Availability; readonly stroke: Availability; readonly fillRule: Availability; readonly paintOrder: Availabili...` |
| `PaintableKind` | type | `type PaintableKind = "shape" \| "path" \| "boolean";` |
| `STROKE_WIDTH_RANGE` | const | `const STROKE_WIDTH_RANGE: { readonly min: 0.1; readonly max: 500; readonly step: 0.1; };` |
| `convertPaint` | function | `function convertPaint(paint: Paint \| null, type: FillType, bounds: ContentBounds, fallback: Rgba): Paint \| null;` |
| `dashForPreset` | function | `function dashForPreset(preset: Exclude<DashPreset, "custom">, width: number): number[];` |
| `defaultStroke` | function | `function defaultStroke(color: Rgba): Stroke;` |
| `fillTypeOf` | function | `function fillTypeOf(paint: Paint \| null): FillType;` |
| `formatDash` | function | `function formatDash(dash: readonly number[]): string;` |
| `miterAvailability` | function | `function miterAvailability(stroke: Stroke): Availability;` |
| `paintSupport` | function | `function paintSupport(kind: PaintableKind): PaintSupport;` |
| `parseDash` | function | `function parseDash(text: string): DashParse;` |
| `presetForDash` | function | `function presetForDash(dash: readonly number[], width: number): DashPreset;` |
| `primaryColor` | function | `function primaryColor(paint: Paint): Rgba;` |
| `withPaintColor` | function | `function withPaintColor(paint: Paint, color: Rgba, stopIndex?: number): Paint;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/vector/fill-stroke-model.ts -->
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
