---
name: "VoiceoverCountdownAndTakeBin"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/VoiceoverCountdownAndTakeBin"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/audio/LiveRecordingWaveform"]
a11yStatus: "unverified"
---

# VoiceoverCountdownAndTakeBin

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/VoiceoverCountdownAndTakeBin.tsx -->
Countdown follows native capture telemetry.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/VoiceoverCountdownAndTakeBin.tsx -->
- Package: @nyc-tron/ui
- Import: `import { VoiceoverCountdownAndTakeBin } from "@nyc-tron/ui/components/forge/audio/VoiceoverCountdownAndTakeBin";`
- Peers: @nyc-tron/core, react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/audio/LiveRecordingWaveform

```sh
npx shadcn@latest add @nyc-tron/forge/audio/VoiceoverCountdownAndTakeBin
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/VoiceoverCountdownAndTakeBin.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `status` | `'idle' \| 'countdown' \| 'recording' \| 'saving' \| 'error'` | not recorded | yes |  |
| `countdownRemainingMs` | `number \| null` | not recorded | yes |  |
| `permission` | `'unknown' \| 'granted' \| 'denied'` | not recorded | yes |  |
| `input` | `LiveRecordingWaveformProps` | not recorded | yes |  |
| `takes` | `readonly VoiceoverTake[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `error` | `string` | not recorded | no |  |
| `onRequestPermission` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onBeginCountdown` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCancelCountdown` | `() => void` | not recorded | yes |  |
| `onStopAndSave` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onAudition` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onDiscard` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRetry` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/VoiceoverCountdownAndTakeBin.tsx -->
- `accessibilityLabel`: "Confirm take discard", "Voiceover recording and takes"
- `accessibilityLiveRegion`: "assertive"
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
