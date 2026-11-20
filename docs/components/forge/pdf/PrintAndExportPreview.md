---
name: "PrintAndExportPreview"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/pdf/PrintAndExportPreview"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "color.textMuted", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "declared"
---

# PrintAndExportPreview

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/PrintAndExportPreview.tsx -->
Actual preview/output/profile-validation telemetry; the native host owns PDF/A checks, printing and output files.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/PrintAndExportPreview.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PrintAndExportPreview } from "@nyc-tron/ui/forge/pdf/PrintAndExportPreview";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/PrintAndExportPreview
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/PrintAndExportPreview.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `settings` | `PDFOutputSettings` | not recorded | yes |  |
| `configurationRevision` | `string \| number` | not recorded | yes |  |
| `papers` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `profiles` | `readonly { id: string; label: string; requiresValidation: boolean; unavailableReason?: string; }[]` | not recorded | yes |  |
| `renderPreview` | `(settings: PDFOutputSettings) => ReactNode` | not recorded | yes |  |
| `validation` | `{ status: 'not-run' \| 'running' \| 'passed' \| 'failed'; configurationRevision: string \| number \| null; profileId: string \| null; message?: string; }` | not recorded | yes |  |
| `status` | `'idle' \| 'rendering' \| 'ready' \| 'exporting' \| 'complete' \| 'error'` | not recorded | yes |  |
| `progress` | `number` | not recorded | no |  |
| `error` | `string` | not recorded | no |  |
| `result` | `{ fileId: string; label: string; bytes: number; } \| null` | not recorded | yes |  |
| `onSettingsCommit` | `(settings: PDFOutputSettings, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onValidate` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onExport` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCancel` | `() => void` | not recorded | yes |  |
| `onPrint` | `(signal?: AbortSignal) => unknown` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/PrintAndExportPreview.tsx -->
- `accessibilityLabel`: "PDF print and export preview"
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
