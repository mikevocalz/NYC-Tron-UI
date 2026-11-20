---
name: "MultiExportSlices"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/design/MultiExportSlices"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# MultiExportSlices

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/design/MultiExportSlices.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/design/MultiExportSlices.tsx -->
- Package: @nyc-tron/ui
- Import: `import { MultiExportSlices } from "@nyc-tron/ui/components/forge/design/MultiExportSlices";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/design/MultiExportSlices
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/design/MultiExportSlices.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `slices` | `readonly DesignExportSlice[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `formats` | `readonly { id: string; label: string; alpha: boolean; }[]` | not recorded | yes |  |
| `presets` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `presetId` | `string` | not recorded | yes |  |
| `status` | `'idle' \| 'running' \| 'complete' \| 'error'` | not recorded | yes |  |
| `progress` | `number` | not recorded | yes |  |
| `results` | `readonly { id: string; sliceId: string; label: string; bytes: number; }[]` | not recorded | yes |  |
| `renderPreview` | `(id: string) => ReactNode` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onCommit` | `(slice: DesignExportSlice, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onPreset` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onExport` | `(slices: readonly DesignExportSlice[], signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCancel` | `() => unknown` | not recorded | yes |  |
| `onRevealResult` | `(id: string) => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/design/MultiExportSlices.tsx -->
- `accessibilityLiveRegion`: "polite"
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
