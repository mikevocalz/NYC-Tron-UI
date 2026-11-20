---
name: "DataImportWizard"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/DataImportWizard"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.danger", "color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# DataImportWizard

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/DataImportWizard.tsx -->
Host file picker/parser/conversion transactions; preview rows and failures are actual supplied results.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/DataImportWizard.tsx -->
- Package: @nyc-tron/ui
- Import: `import { DataImportWizard } from "@nyc-tron/ui/components/forge/spreadsheet/DataImportWizard";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/DataImportWizard
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/DataImportWizard.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `sourceLabel` | `string \| null` | not recorded | yes |  |
| `settings` | `ImportSettings` | not recorded | yes |  |
| `worksheets` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `columns` | `readonly ImportColumn[]` | not recorded | yes |  |
| `targets` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `preview` | `readonly { id: string; values: readonly string[]; errors: readonly string[]; }[]` | not recorded | yes |  |
| `status` | `'empty' \| 'loading' \| 'preview' \| 'importing' \| 'complete' \| 'error'` | not recorded | yes |  |
| `progress` | `number` | not recorded | no |  |
| `error` | `string` | not recorded | no |  |
| `canImport` | `boolean` | not recorded | yes |  |
| `onChooseSource` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onSettingsCommit` | `(settings: ImportSettings, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onColumnCommit` | `(column: ImportColumn, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onPreview` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onImport` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCancel` | `() => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/DataImportWizard.tsx -->
- `accessibilityLabel`: "Spreadsheet data import"
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
