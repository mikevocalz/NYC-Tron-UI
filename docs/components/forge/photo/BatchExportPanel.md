---
name: "BatchExportPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/photo/BatchExportPanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/shell/UnitInput"]
a11yStatus: "unverified"
---

# BatchExportPanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/BatchExportPanel.tsx -->
Configures a host's real batch encoder and reports only provider-supplied progress.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/BatchExportPanel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { BatchExportPanel } from "@nyc-tron/ui/components/forge/photo/BatchExportPanel";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/shell/UnitInput

```sh
npx shadcn@latest add @nyc-tron/forge/photo/BatchExportPanel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/BatchExportPanel.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes |  |
| `photoIds` | `readonly string[]` | not recorded | yes |  |
| `value` | `PhotoBatchExportSettings` | not recorded | yes |  |
| `formats` | `readonly PhotoExportFormat[]` | not recorded | yes |  |
| `onChange` | `(settings: PhotoBatchExportSettings) => void` | not recorded | yes |  |
| `onExport` | `(photoIds: readonly string[], settings: PhotoBatchExportSettings, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
| `progress` | `PhotoExportProgress \| null` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
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
| `disabled` | `disabled` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/BatchExportPanel.tsx -->
- `accessibilityLabel`: "Photo watermark text"
- `accessibilityLiveRegion`: "polite"
- `aria-disabled`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
