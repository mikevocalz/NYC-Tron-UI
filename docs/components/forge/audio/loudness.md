---
name: "LoudnessModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/loudness"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# LoudnessModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/loudness.ts -->
Display math for {@linkcode LoudnessMeter}.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/loudness.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/loudness
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { DEFAULT_LOUDNESS_TARGET, LOUDNESS_CEILING_LUFS, LOUDNESS_FLOOR_LUFS, LOUDNESS_TARGETS, PEAK_WARNINGS, barCountForWidth, describeLoudness, formatDbfs } from "@/components/nyc-tron/ui/components/forge/audio/loudness";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { DEFAULT_LOUDNESS_TARGET, LOUDNESS_CEILING_LUFS, LOUDNESS_FLOOR_LUFS, LOUDNESS_TARGETS, PEAK_WARNINGS, barCountForWidth, describeLoudness, formatDbfs } from "@nyc-tron/ui/components/forge/audio/loudness";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/loudness.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `DEFAULT_LOUDNESS_TARGET` | const | `const DEFAULT_LOUDNESS_TARGET = -14;` |
| `LOUDNESS_CEILING_LUFS` | const | `const LOUDNESS_CEILING_LUFS = 0;` |
| `LOUDNESS_FLOOR_LUFS` | const | `const LOUDNESS_FLOOR_LUFS = -60;` |
| `LOUDNESS_TARGETS` | const | `const LOUDNESS_TARGETS: readonly [ { readonly lufs: -14; readonly label: "Streaming"; }, { readonly lufs: -16; readonly label: "Podcast"; }, { readonly lufs:...` |
| `LoudnessReadings` | interface | `interface LoudnessReadings { readonly integratedLufs: number \| null; readonly shortTermMaxLufs: number \| null; readonly momentaryMaxLufs: number \| null; read...` |
| `LoudnessTarget` | interface | `interface LoudnessTarget { readonly lufs: number; readonly label: string; }` |
| `MomentaryBar` | interface | `interface MomentaryBar { readonly lufs: number \| null; readonly fraction: number; }` |
| `PEAK_WARNINGS` | const | `const PEAK_WARNINGS: { readonly none: ""; readonly ok: ""; readonly near: "Within 1 dB of full scale"; readonly over: "Over 0 dBFS, the mixdown clips"; };` |
| `PeakSeverity` | type | `type PeakSeverity = "none" \| "ok" \| "near" \| "over";` |
| `TargetDelta` | interface | `interface TargetDelta { readonly lu: number; readonly direction: "over" \| "under" \| "on"; readonly text: string; }` |
| `barCountForWidth` | function | `function barCountForWidth(widthPt: number, momentaryLength: number): number;` |
| `describeLoudness` | function | `function describeLoudness(r: LoudnessReadings): string;` |
| `formatDbfs` | function | `function formatDbfs(dbfs: number \| null): string;` |
| `formatLufs` | function | `function formatLufs(lufs: number \| null): string;` |
| `formatSeconds` | function | `function formatSeconds(seconds: number): string;` |
| `formatSigned` | function | `function formatSigned(value: number, digits?: number): string;` |
| `historySeconds` | function | `function historySeconds(momentaryLength: number, stepSeconds: number): number;` |
| `lufsToFraction` | function | `function lufsToFraction(lufs: number): number;` |
| `momentaryBars` | function | `function momentaryBars(momentary: readonly (number \| null)[], maxBars: number): MomentaryBar[];` |
| `peakSeverity` | function | `function peakSeverity(dbfs: number \| null): PeakSeverity;` |
| `targetDelta` | function | `function targetDelta(integratedLufs: number \| null, target: number): TargetDelta \| undefined;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/loudness.ts -->
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
