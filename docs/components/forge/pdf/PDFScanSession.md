---
name: "PDFScanSession"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/pdf/PDFScanSession"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PointEditor2D"]
a11yStatus: "unverified"
---

# PDFScanSession

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/PDFScanSession.tsx -->
Actual native camera surfaces and scan artifacts are supplied by the host; correction never substitutes a CSS transform for a processed image.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/PDFScanSession.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PDFScanSession } from "@nyc-tron/ui/components/forge/pdf/PDFScanSession";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PointEditor2D

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/PDFScanSession
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/PDFScanSession.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `permission` | `'unknown' \| 'granted' \| 'denied'` | not recorded | yes |  |
| `cameraSurface` | `ReactNode` | not recorded | yes |  |
| `pages` | `readonly PDFScanPage[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `selectedCornerId` | `string \| null` | not recorded | yes |  |
| `status` | `'idle' \| 'capturing' \| 'building' \| 'complete' \| 'error'` | not recorded | yes |  |
| `outputDocumentId` | `string` | not recorded | no |  |
| `canAppend` | `boolean` | not recorded | yes |  |
| `canReplace` | `boolean` | not recorded | yes |  |
| `onPermission` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCapture` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onSelectCorner` | `(id: string) => void` | not recorded | yes |  |
| `onCorrect` | `(id: string, corners: readonly EditorPoint2D[], rotation: number, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onMove` | `(id: string, index: number, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRemove` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onBuild` | `(mode: 'append' \| 'replace', pageIds: readonly string[], signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `renderPage` | `(page: PDFScanPage, corners: readonly EditorPoint2D[]) => ReactNode` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/PDFScanSession.tsx -->
- `accessibilityLabel`: "PDF scan session"
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
