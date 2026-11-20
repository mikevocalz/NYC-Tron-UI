---
name: "DynamicsGraphModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/dynamics-graph"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# DynamicsGraphModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/dynamics-graph.ts -->
Plot math for {@linkcode DynamicsTransferGraph}: a square input/output plot over -60..0 dBFS, the engine's transfer curve as polyline pieces, threshold drag and steps, ratio steps and readout text.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/dynamics-graph.ts -->
- Package: @nyc-tron/ui
- Import: `import { DYN_GRID_DB, DYN_MAX_DB, DYN_MAX_RATIO, DYN_MIN_DB, DYN_MIN_RATIO, RATIO_STEPS, clampThreshold, curveOutputAt } from "@nyc-tron/ui/components/forge/audio/dynamics-graph";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/audio/dynamics-graph
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/dynamics-graph.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `DYN_GRID_DB` | const | `const DYN_GRID_DB = 12;` |
| `DYN_MAX_DB` | const | `const DYN_MAX_DB = 0;` |
| `DYN_MAX_RATIO` | const | `const DYN_MAX_RATIO = 20;` |
| `DYN_MIN_DB` | const | `const DYN_MIN_DB = -60;` |
| `DYN_MIN_RATIO` | const | `const DYN_MIN_RATIO = 1;` |
| `DynamicsCurvePoint` | interface | `interface DynamicsCurvePoint { readonly inDb: number; readonly outDb: number; }` |
| `DynamicsParams` | interface | `interface DynamicsParams { readonly thresholdDb: number; readonly ratio: number; readonly kneeDb: number; readonly makeupDb: number; }` |
| `RATIO_STEPS` | const | `const RATIO_STEPS: readonly number[];` |
| `clampThreshold` | function | `function clampThreshold(db: number): number;` |
| `curveOutputAt` | function | `function curveOutputAt(curve: readonly DynamicsCurvePoint[], inDb: number): number \| undefined;` |
| `describeDynamics` | function | `function describeDynamics(p: DynamicsParams, inputLevelDb?: number): string;` |
| `describeLevel` | function | `function describeLevel(db: number): string;` |
| `dragThreshold` | function | `function dragThreshold(startDb: number, dx: number, size: number): number;` |
| `dynamicsCurveSegments` | function | `function dynamicsCurveSegments(curve: readonly DynamicsCurvePoint[], size: number): PlotSegment[];` |
| `dynamicsGridlines` | function | `function dynamicsGridlines(size: number): { db: number; at: number; label: string; }[];` |
| `dynamicsPoint` | function | `function dynamicsPoint(inDb: number, outDb: number, size: number): { x: number; y: number; };` |
| `formatKnee` | function | `function formatKnee(db: number): string;` |
| `formatMakeup` | function | `function formatMakeup(db: number): string;` |
| `formatRatio` | function | `function formatRatio(ratio: number): string;` |
| `formatThreshold` | function | `function formatThreshold(db: number): string;` |
| `levelToOffset` | function | `function levelToOffset(db: number, size: number): number;` |
| `stepRatio` | function | `function stepRatio(ratio: number, direction: -1 \| 1): number;` |
| `unitySegment` | function | `function unitySegment(size: number): PlotSegment;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/dynamics-graph.ts -->
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
