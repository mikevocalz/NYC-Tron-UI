---
name: "InputMonitorToggle"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/InputMonitorToggle"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/SegmentedControl", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# InputMonitorToggle

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/InputMonitorToggle.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/InputMonitorToggle.tsx -->
- Package: @nyc-tron/ui
- Import: `import { InputMonitorToggle } from "@nyc-tron/ui/forge/audio/InputMonitorToggle";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/SegmentedControl, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/audio/InputMonitorToggle
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/InputMonitorToggle.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `InputMonitorMode` | not recorded | yes |  |
| `hardwareSupported` | `boolean` | not recorded | yes |  |
| `softwareSupported` | `boolean` | not recorded | yes |  |
| `feedbackRisk` | `boolean` | not recorded | yes |  |
| `feedbackAcknowledged` | `boolean` | not recorded | yes |  |
| `onAcknowledgeFeedback` | `(signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onChange` | `(mode: InputMonitorMode, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/InputMonitorToggle.tsx -->
- `accessibilityLabel`: "Input monitoring"
- `aria-label`: "Monitor input"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
