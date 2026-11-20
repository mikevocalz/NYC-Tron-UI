---
name: "PageReorderOrganizer"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/pdf/PageReorderOrganizer"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/pdf/PDFThumbnailSidebar"]
a11yStatus: "unverified"
---

# PageReorderOrganizer

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/PageReorderOrganizer.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/PageReorderOrganizer.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PageReorderOrganizer } from "@nyc-tron/ui/components/forge/pdf/PageReorderOrganizer";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/pdf/PDFThumbnailSidebar

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/PageReorderOrganizer
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/PageReorderOrganizer.tsx -->
Extends: `PDFThumbnailSidebarProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `onDuplicate` | `(ids: readonly string[], signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onDelete` | `(ids: readonly string[], signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRotate` | `(ids: readonly string[], degrees: 90 \| -90, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/PageReorderOrganizer.tsx -->
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
