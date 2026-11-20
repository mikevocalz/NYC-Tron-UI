---
name: "FileImportExportSheet"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/files/FileImportExportSheet"
tier: 2
docs: "generated"
platforms: ["ios", "android", "web"]
category: "primitive"
tokens: ["color.border", "color.danger", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/TextField", "@nyc-tron/files/FilePicker"]
a11yStatus: "unverified"
---

# FileImportExportSheet

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/files/FileImportExportSheet.native.tsx,packages/ui/src/components/files/FileImportExportSheet.shared.tsx,packages/ui/src/components/files/FileImportExportSheet.web.tsx -->
Controlled file transfer form with the existing native picker transport.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/files/FileImportExportSheet.native.tsx,packages/ui/src/components/files/FileImportExportSheet.shared.tsx,packages/ui/src/components/files/FileImportExportSheet.web.tsx -->
- Package: @nyc-tron/ui
- Import: `import { FileImportExportSheet } from "@nyc-tron/ui/components/files/FileImportExportSheet";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/TextField, @nyc-tron/files/FilePicker

```sh
npx shadcn@latest add @nyc-tron/files/FileImportExportSheet
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/files/FileImportExportSheet.native.tsx,packages/ui/src/components/files/FileImportExportSheet.shared.tsx,packages/ui/src/components/files/FileImportExportSheet.web.tsx -->
| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | no |  |
| `usableRegions` | `readonly Rect2D[]` | not recorded | no |  |
| `visible` | `boolean` | not recorded | yes |  |
| `mode` | `'import' \| 'export'` | not recorded | yes |  |
| `title` | `string` | not recorded | no |  |
| `formats` | `readonly ExportFormat[]` | not recorded | yes |  |
| `importFormats` | `readonly ImportFormat[]` | not recorded | no |  |
| `destinations` | `readonly ExportDestination[]` | not recorded | yes |  |
| `settings` | `ExportSettings` | not recorded | yes |  |
| `onSettingsChange` | `(settings: ExportSettings) => void` | not recorded | yes |  |
| `onExport` | `(request: ExportRequest) => void \| Promise<unknown>` | not recorded | yes |  |
| `status` | `TransferStatus` | not recorded | yes |  |
| `onClose` | `() => void` | not recorded | yes |  |
| `onCancel` | `() => void` | not recorded | no |  |
| `picker` | `Omit<FilePickerProps, 'label' \| 'accept' \| 'disabled'>` | not recorded | no |  |
| `className` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/files/FileImportExportSheet.native.tsx,packages/ui/src/components/files/FileImportExportSheet.shared.tsx,packages/ui/src/components/files/FileImportExportSheet.web.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "alert", "header"
- `accessibilityState`: set from an expression
- `aria-checked`: set from an expression
- `aria-orientation`: set from an expression
- `role`: "dialog", "radiogroup"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
