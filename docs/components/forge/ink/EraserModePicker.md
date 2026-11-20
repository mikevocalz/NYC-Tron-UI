---
name: "EraserModePicker"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/ink/EraserModePicker"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.2"]
registryDependencies: ["@nyc-tron/SegmentedControl", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# EraserModePicker

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/ink/EraserModePicker.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/ink/EraserModePicker.tsx -->
- Package: @nyc-tron/ui
- Import: `import { EraserModePicker } from "@nyc-tron/ui/forge/ink/EraserModePicker";`
- Peers: react, react-native
- Requires: @nyc-tron/SegmentedControl, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/ink/EraserModePicker
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/ink/EraserModePicker.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `EraserMode` | not recorded | yes |  |
| `capabilities` | `readonly EraserCapability[]` | not recorded | yes |  |
| `onChange` | `(mode: EraserMode, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/ink/EraserModePicker.tsx -->
- `accessibilityLabel`: "Eraser mode"
- `accessibilityLiveRegion`: "polite"
- `aria-label`: "Eraser mode"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
