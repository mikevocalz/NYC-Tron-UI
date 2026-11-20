---
name: "EqGraphModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/eq-graph"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# EqGraphModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/eq-graph.ts -->
Plot math for {@linkcode EQFrequencyGraph}: log-frequency and dB mapping, gridlines, response polyline pieces, band handle positions, drag and keyboard edits, and readout text.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/eq-graph.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/eq-graph
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { EQ_DEFAULT_RANGE_DB, EQ_FREQ_FINE_OCT, EQ_FREQ_STEP_OCT, EQ_GAIN_LIMIT_DB, EQ_MAX_BANDS, EQ_MAX_HZ, EQ_MAX_Q, EQ_MIN_HZ } from "@/components/nyc-tron/ui/components/forge/audio/eq-graph";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { EQ_DEFAULT_RANGE_DB, EQ_FREQ_FINE_OCT, EQ_FREQ_STEP_OCT, EQ_GAIN_LIMIT_DB, EQ_MAX_BANDS, EQ_MAX_HZ, EQ_MAX_Q, EQ_MIN_HZ } from "@nyc-tron/ui/components/forge/audio/eq-graph";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/eq-graph.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `EQ_DEFAULT_RANGE_DB` | const | `const EQ_DEFAULT_RANGE_DB = 18;` |
| `EQ_FREQ_FINE_OCT` | const | `const EQ_FREQ_FINE_OCT: number;` |
| `EQ_FREQ_STEP_OCT` | const | `const EQ_FREQ_STEP_OCT: number;` |
| `EQ_GAIN_LIMIT_DB` | const | `const EQ_GAIN_LIMIT_DB = 24;` |
| `EQ_MAX_BANDS` | const | `const EQ_MAX_BANDS = 8;` |
| `EQ_MAX_HZ` | const | `const EQ_MAX_HZ = 20000;` |
| `EQ_MAX_Q` | const | `const EQ_MAX_Q = 18;` |
| `EQ_MIN_HZ` | const | `const EQ_MIN_HZ = 20;` |
| `EQ_MIN_Q` | const | `const EQ_MIN_Q = 0.1;` |
| `EqBand` | interface | `interface EqBand { readonly type: EqBandType; readonly freqHz: number; readonly gainDb: number; readonly q: number; readonly enabled: boolean; }` |
| `EqBandEdit` | interface | `interface EqBandEdit { readonly freqHz: number; readonly gainDb: number; }` |
| `EqBandType` | type | `type EqBandType = "peak" \| "low_shelf" \| "high_shelf" \| "low_pass" \| "high_pass";` |
| `EqKey` | type | `type EqKey = "ArrowLeft" \| "ArrowRight" \| "ArrowUp" \| "ArrowDown" \| "PageUp" \| "PageDown" \| "Home";` |
| `EqPlot` | interface | `interface EqPlot { readonly width: number; readonly height: number; readonly rangeDb: number; }` |
| `EqResponsePoint` | interface | `interface EqResponsePoint { readonly hz: number; readonly db: number; }` |
| `PlotGridline` | interface | `interface PlotGridline { readonly at: number; readonly label: string; readonly major: boolean; }` |
| `PlotSegment` | interface | `interface PlotSegment { readonly centerX: number; readonly centerY: number; readonly length: number; readonly angleDeg: number; }` |
| `bandTypeName` | function | `function bandTypeName(type: EqBandType): string;` |
| `clampFreq` | function | `function clampFreq(hz: number): number;` |
| `dbToY` | function | `function dbToY(db: number, height: number, rangeDb: number): number;` |
| `describeBand` | function | `function describeBand(band: EqBand): string;` |
| `describeGain` | function | `function describeGain(db: number): string;` |
| `dragBand` | function | `function dragBand(start: EqBandEdit, type: EqBandType, dx: number, dy: number, plot: EqPlot): EqBandEdit;` |
| `eqFrequencyGridlines` | function | `function eqFrequencyGridlines(width: number): PlotGridline[];` |
| `eqGainGridlines` | function | `function eqGainGridlines(height: number, rangeDb: number): PlotGridline[];` |
| `eqHandlePosition` | function | `function eqHandlePosition(band: Pick<EqBand, "type" \| "freqHz" \| "gainDb">, plot: EqPlot): { x: number; y: number; };` |
| `eqResponseSegments` | function | `function eqResponseSegments(response: readonly EqResponsePoint[], plot: EqPlot): PlotSegment[];` |
| `formatFreq` | function | `function formatFreq(hz: number): string;` |
| `formatFreqShort` | function | `function formatFreqShort(hz: number): string;` |
| `formatGain` | function | `function formatGain(db: number): string;` |
| `formatQ` | function | `function formatQ(q: number): string;` |
| `freqToX` | function | `function freqToX(hz: number, width: number): number;` |
| `isPassBand` | function | `function isPassBand(type: EqBandType): boolean;` |
| `polylineSegments` | function | `function polylineSegments(points: readonly { readonly x: number; readonly y: number; }[]): PlotSegment[];` |
| `roundFreq` | function | `function roundFreq(hz: number): number;` |
| `roundGain` | function | `function roundGain(db: number): number;` |
| `stepBand` | function | `function stepBand(band: Pick<EqBand, "type" \| "freqHz" \| "gainDb">, key: string, fine?: boolean): EqBandEdit \| undefined;` |
| `xToFreq` | function | `function xToFreq(x: number, width: number): number;` |
| `yToDb` | function | `function yToDb(y: number, height: number, rangeDb: number): number;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/eq-graph.ts -->
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
