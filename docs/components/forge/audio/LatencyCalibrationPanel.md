---
name: "LatencyCalibrationPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/LatencyCalibrationPanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.1.5", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "declared"
---

# LatencyCalibrationPanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/LatencyCalibrationPanel.tsx -->
Displays host loopback measurements; calibration tones and device buffers stay native-owned.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/LatencyCalibrationPanel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { LatencyCalibrationPanel } from "@nyc-tron/ui/forge/audio/LatencyCalibrationPanel";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber

```sh
npx shadcn@latest add @nyc-tron/forge/audio/LatencyCalibrationPanel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/LatencyCalibrationPanel.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `deviceLabel` | `string` | not recorded | yes |  |
| `sampleRate` | `number` | not recorded | yes |  |
| `bufferSizes` | `readonly number[]` | not recorded | yes |  |
| `bufferSamples` | `number` | not recorded | yes |  |
| `offsetSamples` | `number` | not recorded | yes |  |
| `measurement` | `{ roundTripSamples: number; driftPpm: number; confidence: number; measuredAt: string; } \| null` | not recorded | yes |  |
| `status` | `'idle' \| 'measuring' \| 'error'` | not recorded | yes |  |
| `error` | `string` | not recorded | no |  |
| `unavailableReason` | `string` | not recorded | no |  |
| `onMeasure` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCancel` | `() => void` | not recorded | yes |  |
| `onBufferCommit` | `(samples: number, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onOffsetCommit` | `(samples: number, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `unstyled` | `boolean` | not recorded | no |  |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
| State | How it is set |
|---|---|
| `error` | `error` prop, type `string` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/LatencyCalibrationPanel.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Latency calibration"
- `accessibilityLiveRegion`: "polite"
- `accessibilityState`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
