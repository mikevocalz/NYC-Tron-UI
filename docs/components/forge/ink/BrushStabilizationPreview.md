---
name: "BrushStabilizationPreview"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/ink/BrushStabilizationPreview"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/ink/InkStrokePreview", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "unverified"
---

# BrushStabilizationPreview

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/ink/BrushStabilizationPreview.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/ink/BrushStabilizationPreview.tsx -->
- Package: @nyc-tron/ui
- Import: `import { BrushStabilizationPreview } from "@nyc-tron/ui/components/forge/ink/BrushStabilizationPreview";`
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/ink/InkStrokePreview, @nyc-tron/forge/inputs/PrecisionScrubber

```sh
npx shadcn@latest add @nyc-tron/forge/ink/BrushStabilizationPreview
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/ink/BrushStabilizationPreview.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `BrushStabilization` | not recorded | yes |  |
| `onCommit` | `(value: BrushStabilization, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `pad` | `Omit<InkStrokePreviewProps, 'scope' \| 'revision' \| 'filterSamples'>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/ink/BrushStabilizationPreview.tsx -->
- `accessibilityLabel`: "Brush stabilization"
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
