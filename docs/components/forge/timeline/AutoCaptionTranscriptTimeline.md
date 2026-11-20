---
name: "AutoCaptionTranscriptTimeline"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/AutoCaptionTranscriptTimeline"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.text", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/shell/MenuButton"]
a11yStatus: "unverified"
---

# AutoCaptionTranscriptTimeline

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/AutoCaptionTranscriptTimeline.tsx -->
Edits actual ASR caption blocks; the host owns recognition and playback clocks.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/AutoCaptionTranscriptTimeline.tsx -->
- Package: @nyc-tron/ui
- Import: `import { AutoCaptionTranscriptTimeline } from "@nyc-tron/ui/components/forge/timeline/AutoCaptionTranscriptTimeline";`
- Peers: @nyc-tron/core, react, react-native, react-native-gesture-handler, zustand
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/shell/MenuButton

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/AutoCaptionTranscriptTimeline
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/AutoCaptionTranscriptTimeline.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `segments` | `readonly CaptionSegment[]` | not recorded | yes |  |
| `speakers` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `frame` | `number` | not recorded | yes |  |
| `durationFrames` | `number` | not recorded | yes |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `language` | `string` | not recorded | yes |  |
| `languages` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `onLanguageChange` | `(language: string) => void` | not recorded | yes |  |
| `generation` | `{ status: 'idle' \| 'running' \| 'ready' \| 'error'; progress?: number; error?: string; unavailableReason?: string; }` | not recorded | yes |  |
| `onGenerate` | `(language: string, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onStop` | `() => void` | not recorded | yes |  |
| `onEdit` | `(id: string, patch: { text?: string; speakerId?: string \| null; }, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onSeek` | `(frame: number, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/AutoCaptionTranscriptTimeline.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Caption text ", "Caption transcript"
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
