---
name: "VoiceIsolationPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/VoiceIsolationPanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/forge/audio/AudioProcessingPanel"]
a11yStatus: "unverified"
---

# VoiceIsolationPanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/VoiceIsolationPanel.tsx -->
Requests the host's admitted speech separation service and reversible output.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/VoiceIsolationPanel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { VoiceIsolationPanel } from "@nyc-tron/ui/forge/audio/VoiceIsolationPanel";`
- Peers: react, react-native
- Requires: @nyc-tron/forge/audio/AudioProcessingPanel

```sh
npx shadcn@latest add @nyc-tron/forge/audio/VoiceIsolationPanel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/VoiceIsolationPanel.tsx -->
Extends: `Omit<AudioProcessingPanelProps, 'label' | 'parameters' | 'onParameter'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `strength` | `number` | not recorded | yes |  |
| `onStrengthCommit` | `(strength: number, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/VoiceIsolationPanel.tsx -->
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
