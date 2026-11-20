---
name: "PDFVoiceNoteAttachment"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/pdf/PDFVoiceNoteAttachment"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/audio/LiveRecordingWaveform", "@nyc-tron/forge/audio/NativeAudioTransport"]
a11yStatus: "unverified"
---

# PDFVoiceNoteAttachment

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/PDFVoiceNoteAttachment.tsx -->
The same native recording session supplies transport, measured waveform and the real attachment artifact.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/PDFVoiceNoteAttachment.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/audio/LiveRecordingWaveform, @nyc-tron/forge/audio/NativeAudioTransport

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/PDFVoiceNoteAttachment
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { PDFVoiceNoteAttachment } from "@/components/nyc-tron/ui/components/forge/pdf/PDFVoiceNoteAttachment";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { PDFVoiceNoteAttachment } from "@nyc-tron/ui/components/forge/pdf/PDFVoiceNoteAttachment";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/PDFVoiceNoteAttachment.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `pageId` | `string` | not recorded | yes |  |
| `anchor` | `{ x: number; y: number; }` | not recorded | yes |  |
| `transport` | `Omit<NativeAudioTransportProps, 'scope' \| 'revision'>` | not recorded | yes |  |
| `waveform` | `LiveRecordingWaveformProps` | not recorded | no |  |
| `artifact` | `PDFVoiceNoteArtifact \| null` | not recorded | yes |  |
| `attachedArtifactId` | `string` | not recorded | no |  |
| `canAttach` | `boolean` | not recorded | yes |  |
| `onAttach` | `(request: { artifactId: string; pageId: string; anchor: { x: number; y: number; }; }, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onDiscard` | `(artifactId: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/PDFVoiceNoteAttachment.tsx -->
- `accessibilityLabel`: "PDF voice note"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
