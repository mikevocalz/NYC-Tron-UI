---
name: "FileTransferModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/files/file-transfer-model"
tier: 2
docs: "generated"
platforms: []
category: "primitive"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# FileTransferModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/files/file-transfer-model.ts -->
Platform-free rules for {@linkcode FileImportExportSheet}: export formats, quality ranges, metadata fields, destinations, file name checks, the summary line, and matching an imported file to an import format.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/files/file-transfer-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { FILENAME_MAX, applyFormat, buildExportRequest, defaultExportSettings, destinationLabel, exportSummary, filenameProblem, importAccept } from "@nyc-tron/ui/files/file-transfer-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/files/file-transfer-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/files/file-transfer-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ExportDestination` | type | `type ExportDestination = { readonly id: ExportDestinationId; readonly available: true; } \| { readonly id: ExportDestinationId; readonly available: false; rea...` |
| `ExportDestinationId` | type | `type ExportDestinationId = "share" \| "files" \| "download";` |
| `ExportFormat` | interface | `interface ExportFormat { readonly id: string; readonly label: string; readonly extension: string; readonly mimeType: string; readonly quality?: QualityRange;...` |
| `ExportRequest` | interface | `interface ExportRequest { readonly formatId: string; readonly quality?: number; readonly metadata: MetadataValues; readonly destination: ExportDestinationId;...` |
| `ExportSettings` | interface | `interface ExportSettings { readonly formatId: string; readonly quality?: number; readonly metadata: MetadataValues; readonly destination: ExportDestinationId...` |
| `FILENAME_MAX` | const | `const FILENAME_MAX = 255;` |
| `ImportFormat` | interface | `interface ImportFormat { readonly id: string; readonly label: string; readonly extensions: readonly string[]; readonly mimeTypes?: readonly string[]; }` |
| `MetadataField` | type | `type MetadataField = TextMetadataField \| ToggleMetadataField;` |
| `MetadataValues` | type | `type MetadataValues = Readonly<Record<string, string \| boolean>>;` |
| `QualityRange` | interface | `interface QualityRange { readonly min: number; readonly max: number; readonly step: number; readonly default: number; readonly unit: string; readonly label?:...` |
| `TextMetadataField` | interface | `interface TextMetadataField { readonly kind: "text"; readonly id: string; readonly label: string; readonly default?: string; readonly maxLength?: number; }` |
| `ToggleMetadataField` | interface | `interface ToggleMetadataField { readonly kind: "toggle"; readonly id: string; readonly label: string; readonly default?: boolean; }` |
| `TransferStatus` | type | `type TransferStatus = { readonly kind: "idle"; } \| { readonly kind: "working"; readonly progress?: number; } \| { readonly kind: "error"; readonly message: st...` |
| `applyFormat` | function | `function applyFormat(settings: ExportSettings, format: ExportFormat): ExportSettings;` |
| `buildExportRequest` | function | `function buildExportRequest(settings: ExportSettings, formats: readonly ExportFormat[], destinations: readonly ExportDestination[]): ExportRequest;` |
| `defaultExportSettings` | function | `function defaultExportSettings(formats: readonly ExportFormat[], destinations: readonly ExportDestination[], baseName: string): ExportSettings;` |
| `destinationLabel` | function | `function destinationLabel(id: ExportDestinationId): string;` |
| `exportSummary` | function | `function exportSummary(settings: ExportSettings, format: ExportFormat): string;` |
| `filenameProblem` | function | `function filenameProblem(name: string, extension: string): string \| undefined;` |
| `importAccept` | function | `function importAccept(formats: readonly ImportFormat[]): string;` |
| `matchImportFormat` | function | `function matchImportFormat(name: string, mimeType: string \| undefined, formats: readonly ImportFormat[]): string \| undefined;` |
| `snapQuality` | function | `function snapQuality(value: number, range: QualityRange): number;` |
| `statusText` | function | `function statusText(status: TransferStatus, mode: "import" \| "export", filename?: string): string;` |
| `unsupportedFileMessage` | function | `function unsupportedFileMessage(name: string, formats: readonly ImportFormat[]): string;` |
| `validateExportFormats` | function | `function validateExportFormats(formats: readonly ExportFormat[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/files/file-transfer-model.ts -->
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
