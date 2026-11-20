---
name: "BrushDynamicsInspector"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/ink/BrushDynamicsInspector"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.2"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "declared"
---

# BrushDynamicsInspector

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/ink/BrushDynamicsInspector.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/ink/BrushDynamicsInspector.tsx -->
- Package: @nyc-tron/ui
- Import: `import { BrushDynamicsInspector } from "@nyc-tron/ui/forge/ink/BrushDynamicsInspector";`
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber

```sh
npx shadcn@latest add @nyc-tron/forge/ink/BrushDynamicsInspector
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/ink/BrushDynamicsInspector.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `BrushDynamics` | not recorded | yes |  |
| `onCommit` | `(value: BrushDynamics, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/ink/BrushDynamicsInspector.tsx -->
- `accessibilityLabel`: "Brush dynamics"
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
