---
name: "PrototypePreviewPlayer"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/design/PrototypePreviewPlayer"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# PrototypePreviewPlayer

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/design/PrototypePreviewPlayer.tsx -->
Surface and transition clock come from the actual prototype runtime; no UI timer simulates execution.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/design/PrototypePreviewPlayer.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PrototypePreviewPlayer } from "@nyc-tron/ui/components/forge/design/PrototypePreviewPlayer";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/design/PrototypePreviewPlayer
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/design/PrototypePreviewPlayer.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `surface` | `ReactNode` | not recorded | yes |  |
| `screens` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `currentScreenId` | `string` | not recorded | yes |  |
| `entryId` | `string` | not recorded | yes |  |
| `status` | `'stopped' \| 'playing' \| 'paused' \| 'transitioning' \| 'error'` | not recorded | yes |  |
| `transitionProgress` | `number` | not recorded | yes |  |
| `canBack` | `boolean` | not recorded | yes |  |
| `onAction` | `(action: 'play' \| 'pause' \| 'restart' \| 'back' \| 'stop', signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onNavigate` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `error` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/design/PrototypePreviewPlayer.tsx -->
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
