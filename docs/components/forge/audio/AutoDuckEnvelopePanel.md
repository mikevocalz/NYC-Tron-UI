---
name: "AutoDuckEnvelopePanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/AutoDuckEnvelopePanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/forge/audio/AudioProcessingPanel", "@nyc-tron/forge/audio/ClipGainEnvelope"]
a11yStatus: "unverified"
---

# AutoDuckEnvelopePanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/AutoDuckEnvelopePanel.tsx -->
Host-generated ducking against dialogue, with an editable sample-local gain envelope.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/AutoDuckEnvelopePanel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { AutoDuckEnvelopePanel } from "@nyc-tron/ui/forge/audio/AutoDuckEnvelopePanel";`
- Peers: react, react-native
- Requires: @nyc-tron/forge/audio/AudioProcessingPanel, @nyc-tron/forge/audio/ClipGainEnvelope

```sh
npx shadcn@latest add @nyc-tron/forge/audio/AutoDuckEnvelopePanel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/AutoDuckEnvelopePanel.tsx -->
Extends: `Omit<AudioProcessingPanelProps, 'label' | 'parameters' | 'onParameter' | 'preview'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `settings` | `DuckSettings` | not recorded | yes |  |
| `onSettingsCommit` | `(settings: DuckSettings, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `envelope` | `ClipGainEnvelopeProps` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/AutoDuckEnvelopePanel.tsx -->
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
