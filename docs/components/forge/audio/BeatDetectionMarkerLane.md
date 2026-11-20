---
name: "BeatDetectionMarkerLane"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/BeatDetectionMarkerLane"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber", "@nyc-tron/forge/timeline/TimelineMarkers"]
a11yStatus: "unverified"
---

# BeatDetectionMarkerLane

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/BeatDetectionMarkerLane.tsx -->
Actual host beat detection, sharing timeline marker movement, naming, adding and removal.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/BeatDetectionMarkerLane.tsx -->
- Package: @nyc-tron/ui
- Import: `import { BeatDetectionMarkerLane } from "@nyc-tron/ui/components/forge/audio/BeatDetectionMarkerLane";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber, @nyc-tron/forge/timeline/TimelineMarkers

```sh
npx shadcn@latest add @nyc-tron/forge/audio/BeatDetectionMarkerLane
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/BeatDetectionMarkerLane.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `lane` | `Omit<TimelineMarkersProps, 'scope' \| 'revision' \| 'disabled' \| 'disabledReason' \| 'unstyled'>` | not recorded | yes |  |
| `sensitivity` | `number` | not recorded | yes |  |
| `detectedBpm` | `number \| null` | not recorded | yes |  |
| `status` | `'idle' \| 'detecting' \| 'ready' \| 'error'` | not recorded | yes |  |
| `progress` | `number` | not recorded | no |  |
| `error` | `string` | not recorded | no |  |
| `unavailableReason` | `string` | not recorded | no |  |
| `onSensitivityCommit` | `(value: number, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onDetect` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCancel` | `() => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/BeatDetectionMarkerLane.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Beat detection markers"
- `accessibilityLiveRegion`: "polite"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
