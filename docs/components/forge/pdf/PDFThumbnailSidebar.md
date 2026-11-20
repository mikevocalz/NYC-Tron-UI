---
name: "PDFThumbnailSidebar"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/pdf/PDFThumbnailSidebar"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/shell/MenuButton"]
a11yStatus: "unverified"
---

# PDFThumbnailSidebar

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/PDFThumbnailSidebar.tsx -->
Virtual native page list with stable thumbnail bounds, grouping and one scoped reorder per release.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/PDFThumbnailSidebar.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PDFThumbnailSidebar } from "@nyc-tron/ui/components/forge/pdf/PDFThumbnailSidebar";`
- Peers: @nyc-tron/core, react, react-native, react-native-gesture-handler, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/shell/MenuButton

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/PDFThumbnailSidebar
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/PDFThumbnailSidebar.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `pages` | `readonly PDFPageDescriptor[]` | not recorded | yes |  |
| `selectedIds` | `readonly string[]` | not recorded | yes |  |
| `groups` | `readonly { id: string; label: string; }[]` | not recorded | no |  |
| `viewportHeight` | `number` | not recorded | no |  |
| `renderThumbnail` | `(page: PDFPageDescriptor, size: { width: number; height: number; }) => ReactNode` | not recorded | yes |  |
| `onSelectionChange` | `(ids: readonly string[]) => void` | not recorded | yes |  |
| `onMove` | `(id: string, toIndex: number, signal?: AbortSignal) => unknown` | not recorded | no |  |
| `onGroupCommit` | `(id: string, groupId: string \| null, signal?: AbortSignal) => unknown` | not recorded | no |  |
| `onInsert` | `(signal?: AbortSignal) => unknown` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/PDFThumbnailSidebar.tsx -->
- `accessibilityLabel`: "Move ", "PDF page thumbnails"
- `accessibilityRole`: "adjustable", "header"
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
