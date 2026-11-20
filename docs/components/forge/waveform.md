---
name: "WaveformModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/waveform"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# WaveformModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/waveform.ts -->
Display-only min/max extrema math adapted from the user's Nitro Forge draft media-ui WaveformLane/PR #25.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/waveform.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/waveform
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { FULL_RANGE, assertWaveformRange, normalizePeak, peaksToBars, rangePosition, resamplePeaks, scrollRange, slicePeaks } from "@/components/nyc-tron/ui/components/forge/waveform";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { FULL_RANGE, assertWaveformRange, normalizePeak, peaksToBars, rangePosition, resamplePeaks, scrollRange, slicePeaks } from "@nyc-tron/ui/components/forge/waveform";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/waveform.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FULL_RANGE` | const | `const FULL_RANGE: WaveformRange;` |
| `WaveformBar` | interface | `interface WaveformBar { readonly top: number; readonly height: number; }` |
| `WaveformPeak` | interface | `interface WaveformPeak { readonly min: number; readonly max: number; }` |
| `WaveformRange` | interface | `interface WaveformRange { readonly start: number; readonly end: number; }` |
| `assertWaveformRange` | function | `function assertWaveformRange(r: WaveformRange): void;` |
| `normalizePeak` | function | `function normalizePeak(p: WaveformPeak): WaveformPeak;` |
| `peaksToBars` | function | `function peaksToBars(peaks: readonly WaveformPeak[], height: number): WaveformBar[];` |
| `rangePosition` | function | `function rangePosition(range: WaveformRange, x: number, widthPx: number): number;` |
| `resamplePeaks` | function | `function resamplePeaks(peaks: readonly WaveformPeak[], columns: number): WaveformPeak[];` |
| `scrollRange` | function | `function scrollRange(range: WaveformRange, dxPx: number, widthPx: number): WaveformRange;` |
| `slicePeaks` | function | `function slicePeaks(peaks: readonly WaveformPeak[], range: WaveformRange): readonly WaveformPeak[];` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/waveform.ts -->
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
