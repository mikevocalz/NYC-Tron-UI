---
name: "AudioProcessingPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/AudioProcessingPanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.1.5", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "declared"
---

# AudioProcessingPanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/AudioProcessingPanel.tsx -->
Shared controlled processing lifecycle.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/AudioProcessingPanel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { AudioProcessingPanel } from "@nyc-tron/ui/forge/audio/AudioProcessingPanel";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber

```sh
npx shadcn@latest add @nyc-tron/forge/audio/AudioProcessingPanel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/AudioProcessingPanel.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | not recorded | yes |  |
| `parameters` | `readonly AudioProcessParameter[]` | not recorded | yes |  |
| `job` | `{ status: 'idle' \| 'processing' \| 'ready' \| 'error'; progress?: number; error?: string; }` | not recorded | yes |  |
| `capability` | `{ available: boolean; reason?: string; }` | not recorded | yes | Native host admission, including platform, source, rights and model availability. |
| `audition` | `'original' \| 'processed'` | not recorded | yes |  |
| `canApply` | `boolean` | not recorded | yes |  |
| `canRevert` | `boolean` | not recorded | yes |  |
| `onParameter` | `(id: string, value: number, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onProcess` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCancel` | `() => void` | not recorded | yes |  |
| `onAudition` | `(source: 'original' \| 'processed', signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onApply` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRevert` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `measurements` | `readonly { label: string; value: string; }[]` | not recorded | no |  |
| `preview` | `ReactNode` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/AudioProcessingPanel.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "header"
- `accessibilityState`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
