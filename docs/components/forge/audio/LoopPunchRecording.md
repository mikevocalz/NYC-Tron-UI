---
name: "LoopPunchRecording"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/LoopPunchRecording"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "unverified"
---

# LoopPunchRecording

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/LoopPunchRecording.tsx -->
Sample-clock recording boundaries; the host owns rolling, looping and take allocation.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/LoopPunchRecording.tsx -->
- Package: @nyc-tron/ui
- Import: `import { LoopPunchRecording } from "@nyc-tron/ui/components/forge/audio/LoopPunchRecording";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber

```sh
npx shadcn@latest add @nyc-tron/forge/audio/LoopPunchRecording
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/LoopPunchRecording.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `durationSamples` | `number` | not recorded | yes |  |
| `sampleRate` | `number` | not recorded | yes |  |
| `value` | `LoopPunchConfiguration` | not recorded | yes |  |
| `recording` | `boolean` | not recorded | yes |  |
| `passCount` | `number` | not recorded | yes |  |
| `onCommit` | `(value: LoopPunchConfiguration, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `unstyled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/LoopPunchRecording.tsx -->
- `accessibilityLabel`: "Loop and punch recording"
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
