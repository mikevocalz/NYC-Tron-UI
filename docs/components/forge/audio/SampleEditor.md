---
name: "SampleEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/SampleEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.3"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/audio/AudioClipTrimAndFade", "@nyc-tron/forge/audio/LoopPunchRecording", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "declared"
---

# SampleEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/SampleEditor.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/SampleEditor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SampleEditor } from "@nyc-tron/ui/forge/audio/SampleEditor";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/audio/AudioClipTrimAndFade, @nyc-tron/forge/audio/LoopPunchRecording, @nyc-tron/forge/inputs/PrecisionScrubber

```sh
npx shadcn@latest add @nyc-tron/forge/audio/SampleEditor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/SampleEditor.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `source` | `Omit<AudioClipTrimAndFadeProps, 'onCommit' \| 'scope' \| 'revision' \| 'disabledReason' \| 'style'>` | not recorded | yes |  |
| `loop` | `LoopPunchConfiguration` | not recorded | yes |  |
| `keyboard` | `SampleKeyboardMap` | not recorded | yes |  |
| `onRegionCommit` | `AudioClipTrimAndFadeProps['onCommit']` | not recorded | yes |  |
| `onLoopCommit` | `(value: LoopPunchConfiguration, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onKeyboardCommit` | `(value: SampleKeyboardMap, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onAudition` | `(note: number, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/SampleEditor.tsx -->
- `accessibilityLabel`: "Sample editor"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
