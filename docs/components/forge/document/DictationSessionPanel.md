---
name: "DictationSessionPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/document/DictationSessionPanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# DictationSessionPanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/DictationSessionPanel.tsx -->
Actual recognition events drive interim/final text; insertion is one host undo transaction.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/DictationSessionPanel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { DictationSessionPanel } from "@nyc-tron/ui/components/forge/document/DictationSessionPanel";`
- Peers: @nyc-tron/core, react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/document/DictationSessionPanel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/DictationSessionPanel.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `status` | `'idle' \| 'listening' \| 'processing' \| 'review' \| 'error'` | not recorded | yes |  |
| `permission` | `'unknown' \| 'granted' \| 'denied'` | not recorded | yes |  |
| `offline` | `boolean` | not recorded | yes |  |
| `supportsOffline` | `boolean` | not recorded | yes |  |
| `transcript` | `string` | not recorded | yes |  |
| `interimText` | `string` | not recorded | yes |  |
| `error` | `string` | not recorded | no |  |
| `canUndo` | `boolean` | not recorded | yes |  |
| `onRequestPermission` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onStart` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onStop` | `() => void` | not recorded | yes |  |
| `onInsert` | `(text: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onDiscard` | `() => void` | not recorded | yes |  |
| `onUndo` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/DictationSessionPanel.tsx -->
- `accessibilityLabel`: "Dictation session", "Review dictated text"
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
