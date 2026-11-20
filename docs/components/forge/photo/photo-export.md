---
name: "PhotoExportModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/photo/photo-export"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["PhotoExportModule.font.24", "opacity.0_7"]
registryDependencies: []
a11yStatus: "unverified"
---

# PhotoExportModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/photo-export.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/photo-export.ts -->
- Package: @nyc-tron/ui
- Import: `import { defaultPhotoBatchExport, validatePhotoExport, validatePhotoExportProgress } from "@nyc-tron/ui/forge/photo/photo-export";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/photo/photo-export
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/photo-export.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `PhotoBatchExportSettings` | interface | `interface PhotoBatchExportSettings { readonly formatId: string; readonly sizing: 'original' \| 'fit-long-edge'; readonly longEdge: number; readonly quality: n...` |
| `PhotoExportFormat` | interface | `interface PhotoExportFormat { readonly id: string; readonly label: string; readonly supportsQuality: boolean; }` |
| `PhotoExportProgress` | interface | `interface PhotoExportProgress { readonly completed: number; readonly failed: number; readonly total: number; }` |
| `defaultPhotoBatchExport` | function | `function defaultPhotoBatchExport(formatId: string): PhotoBatchExportSettings;` |
| `validatePhotoExport` | function | `function validatePhotoExport(value: PhotoBatchExportSettings, formats: readonly PhotoExportFormat[]): void;` |
| `validatePhotoExportProgress` | function | `function validatePhotoExportProgress(progress: PhotoExportProgress): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/photo-export.ts -->
_Not documented._
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
