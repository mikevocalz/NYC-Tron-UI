---
name: "NativeAudioTransport"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/NativeAudioTransport"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "unverified"
---

# NativeAudioTransport

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/NativeAudioTransport.tsx -->
Requests the host's existing native audio session; no second audio graph or UI clock.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/NativeAudioTransport.tsx -->
- Package: @nyc-tron/ui
- Import: `import { NativeAudioTransport } from "@nyc-tron/ui/components/forge/audio/NativeAudioTransport";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber

```sh
npx shadcn@latest add @nyc-tron/forge/audio/NativeAudioTransport
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/NativeAudioTransport.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `playing` | `boolean` | not recorded | yes |  |
| `recording` | `boolean` | not recorded | yes |  |
| `punching` | `boolean` | not recorded | yes |  |
| `supportsPunch` | `boolean` | not recorded | yes |  |
| `canRecord` | `boolean` | not recorded | yes |  |
| `permission` | `'unknown' \| 'granted' \| 'denied'` | not recorded | yes |  |
| `positionSamples` | `number` | not recorded | yes |  |
| `durationSamples` | `number` | not recorded | yes |  |
| `sampleRate` | `number` | not recorded | yes |  |
| `latencyMs` | `number` | not recorded | no |  |
| `onAction` | `(action: AudioTransportAction, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onSeek` | `(sample: number, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/NativeAudioTransport.tsx -->
- `accessibilityLabel`: "Native audio transport"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
