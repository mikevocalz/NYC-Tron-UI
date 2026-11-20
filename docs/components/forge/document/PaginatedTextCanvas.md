---
name: "PaginatedTextCanvas"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/document/PaginatedTextCanvas"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.surfaceRaised", "color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/document/TextSelectionAndCaret"]
a11yStatus: "unverified"
---

# PaginatedTextCanvas

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/PaginatedTextCanvas.tsx -->
Host-layout pages with actual native plain text inputs or an explicit native rich-text adapter.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/PaginatedTextCanvas.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/document/TextSelectionAndCaret

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/document/PaginatedTextCanvas
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { PaginatedTextCanvas } from "@/components/nyc-tron/ui/components/forge/document/PaginatedTextCanvas";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { PaginatedTextCanvas } from "@nyc-tron/ui/components/forge/document/PaginatedTextCanvas";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/PaginatedTextCanvas.tsx -->
Extends: `Omit<ViewProps, 'children'> & ScopedControlProps & PageEditorBackend`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `pages` | `readonly TextCanvasPage[]` | not recorded | yes |  |
| `activePageId` | `string \| null` | not recorded | yes |  |
| `selection` | `DocumentTextSelection` | not recorded | yes |  |
| `zoom` | `number` | not recorded | yes |  |
| `readOnly` | `boolean` | not recorded | no |  |
| `onActivatePage` | `(id: string) => void` | not recorded | yes |  |
| `onPageTextChange` | `(id: string, text: string) => void` | not recorded | yes |  |
| `onSelectionChange` | `(id: string, selection: DocumentTextSelection) => void` | not recorded | yes |  |
| `onMeasuredContent` | `(pageId: string, size: { width: number; height: number; availableHeight: number; }) => void` | not recorded | yes |  |
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
| `readOnly` | `readOnly` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/PaginatedTextCanvas.tsx -->
- `accessibilityLabel`: "Paginated document"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
