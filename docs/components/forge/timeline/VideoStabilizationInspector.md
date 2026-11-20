---
name: "VideoStabilizationInspector"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/VideoStabilizationInspector"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/SegmentedControl", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "unverified"
---

# VideoStabilizationInspector

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/VideoStabilizationInspector.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/VideoStabilizationInspector.tsx -->
- Package: @nyc-tron/ui
- Import: `import { VideoStabilizationInspector } from "@nyc-tron/ui/components/forge/timeline/VideoStabilizationInspector";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/SegmentedControl, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/VideoStabilizationInspector
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/VideoStabilizationInspector.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `VideoStabilizationSettings` | not recorded | yes |  |
| `qualities` | `readonly VideoStabilizationSettings['quality'][]` | not recorded | yes |  |
| `onChange` | `(value: VideoStabilizationSettings, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `analysis` | `{ status: 'idle' \| 'running' \| 'ready' \| 'error'; progress?: number; error?: string; cropFraction?: number; }` | not recorded | yes |  |
| `onAnalyze` | `(signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onCancel` | `() => void` | not recorded | yes |  |
| `preview` | `ReactNode` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/VideoStabilizationInspector.tsx -->
- `accessibilityLabel`: "Video stabilization"
- `accessibilityLiveRegion`: "polite"
- `aria-label`: "Stabilization quality"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
