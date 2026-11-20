---
name: "MeterBallisticsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/meter-ballistics"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# MeterBallisticsModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/meter-ballistics.ts -->
Meter ballistics for the mixer's channel meters.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/meter-ballistics.ts -->
- Package: @nyc-tron/ui
- Import: `import { PEAK_HOLD_FLOOR, createPeakHold } from "@nyc-tron/ui/forge/audio/meter-ballistics";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/audio/meter-ballistics
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/meter-ballistics.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `MeterReading` | interface | `interface MeterReading { readonly level: number; readonly hold: number; }` |
| `PEAK_HOLD_FLOOR` | const | `const PEAK_HOLD_FLOOR = 0.001;` |
| `PeakHoldOptions` | interface | `interface PeakHoldOptions { readonly holdMs?: number; readonly fallDbPerSecond?: number; }` |
| `createPeakHold` | function | `function createPeakHold({ holdMs, fallDbPerSecond }?: PeakHoldOptions): (peak: number, nowMs: number) => MeterReading;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/meter-ballistics.ts -->
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
