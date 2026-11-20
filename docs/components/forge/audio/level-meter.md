---
name: "LevelMeterModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/level-meter"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# LevelMeterModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/level-meter.ts -->
Display math for an input level meter.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/level-meter.ts -->
- Package: @nyc-tron/ui
- Import: `import { METER_BANDS, METER_BAND_LABELS, METER_FLOOR_DB, createMeterAnnouncer, levelToDb, meterBand, meterFill } from "@nyc-tron/ui/components/forge/audio/level-meter";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/audio/level-meter
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/level-meter.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `METER_BANDS` | const | `const METER_BANDS: { readonly clipping: -0.5; readonly hot: -6; readonly good: -24; readonly low: -48; };` |
| `METER_BAND_LABELS` | const | `const METER_BAND_LABELS: { readonly silent: "No input"; readonly low: "Input low"; readonly good: "Input level good"; readonly hot: "Input hot"; readonly cli...` |
| `METER_FLOOR_DB` | const | `const METER_FLOOR_DB = -60;` |
| `MeterAnnouncerOptions` | interface | `interface MeterAnnouncerOptions { readonly minIntervalMs?: number; readonly labels?: Readonly<Record<MeterBand, string>>; }` |
| `MeterBand` | type | `type MeterBand = "silent" \| "low" \| "good" \| "hot" \| "clipping";` |
| `createMeterAnnouncer` | function | `function createMeterAnnouncer({ minIntervalMs, labels }?: MeterAnnouncerOptions): (level: number, nowMs: number) => string \| undefined;` |
| `levelToDb` | function | `function levelToDb(level: number): number;` |
| `meterBand` | function | `function meterBand(level: number): MeterBand;` |
| `meterFill` | function | `function meterFill(level: number): number;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/level-meter.ts -->
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
