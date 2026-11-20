---
name: "SpeechTranscriptTakeReview"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/SpeechTranscriptTakeReview"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/timeline/AutoCaptionTranscriptTimeline", "@nyc-tron/forge/timeline/CaptionWordTimingHandles"]
a11yStatus: "unverified"
---

# SpeechTranscriptTakeReview

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/SpeechTranscriptTakeReview.tsx -->
Take selection plus shared ASR speaker/text correction and real word-boundary editing.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/SpeechTranscriptTakeReview.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SpeechTranscriptTakeReview } from "@nyc-tron/ui/components/forge/audio/SpeechTranscriptTakeReview";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/timeline/AutoCaptionTranscriptTimeline, @nyc-tron/forge/timeline/CaptionWordTimingHandles

```sh
npx shadcn@latest add @nyc-tron/forge/audio/SpeechTranscriptTakeReview
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/SpeechTranscriptTakeReview.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `takes` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `takeId` | `string \| null` | not recorded | yes |  |
| `onTakeChange` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `transcript` | `AutoCaptionTranscriptTimelineProps` | not recorded | yes |  |
| `timing` | `CaptionWordTimingHandlesProps` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/SpeechTranscriptTakeReview.tsx -->
- `accessibilityLabel`: "Speech transcript take review"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
