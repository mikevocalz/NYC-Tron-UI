---
name: "AudioInterruptionRecoveryDialog"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/AudioInterruptionRecoveryDialog"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.danger", "color.surfaceRaised", "color.text", "color.textMuted", "radius.card"]
registryDependencies: ["@nyc-tron/Button"]
a11yStatus: "unverified"
---

# AudioInterruptionRecoveryDialog

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/AudioInterruptionRecoveryDialog.tsx -->
Explicit recovery decisions; rejected actions keep the dialog open with the error.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/AudioInterruptionRecoveryDialog.tsx -->
- Package: @nyc-tron/ui
- Import: `import { AudioInterruptionRecoveryDialog } from "@nyc-tron/ui/components/forge/audio/AudioInterruptionRecoveryDialog";`
- Peers: @nyc-tron/core, react, react-native, zustand
- Requires: @nyc-tron/Button

```sh
npx shadcn@latest add @nyc-tron/forge/audio/AudioInterruptionRecoveryDialog
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/AudioInterruptionRecoveryDialog.tsx -->
Extends: `Base & (`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `notice` | `Extract<AudioRecoveryNotice, { kind: 'paused'; }>` | not recorded | yes |  |
| `onResume` | `Action` | not recorded | yes |  |
| `onStop` | `Action` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/AudioInterruptionRecoveryDialog.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "header"
- `role`: "dialog"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
