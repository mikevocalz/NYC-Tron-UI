---
name: "RulerModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/ruler"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# RulerModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/ruler.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/ruler.ts -->
- Package: @nyc-tron/ui
- Import: `import { clockLabel, defaultPxPerFrame, rulerStep, rulerTicks, speedLabel, zoomLimits } from "@nyc-tron/ui/components/forge/timeline/ruler";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/ruler
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/ruler.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `RulerStep` | type | `type RulerStep = { readonly unit: "frames"; readonly frames: number; } \| { readonly unit: "seconds"; readonly seconds: number; };` |
| `RulerTick` | interface | `interface RulerTick { readonly frame: number; readonly label?: string; }` |
| `ZoomLimits` | interface | `interface ZoomLimits { readonly min: number; readonly max: number; }` |
| `clockLabel` | function | `function clockLabel(seconds: number): string;` |
| `defaultPxPerFrame` | function | `function defaultPxPerFrame(viewportPx: number, rate: FrameRate): number;` |
| `rulerStep` | function | `function rulerStep(pxPerFrame: number, minLabelPx: number, rate: FrameRate): RulerStep;` |
| `rulerTicks` | function | `function rulerTicks(startFrame: number, endFrame: number, pxPerFrame: number, rate: FrameRate, minLabelPx?: number, maxTicks?: number): RulerTick[];` |
| `speedLabel` | function | `function speedLabel(speed: number): string;` |
| `zoomLimits` | function | `function zoomLimits(viewportPx: number, durationFrames: number, rate: FrameRate): ZoomLimits;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/ruler.ts -->
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
