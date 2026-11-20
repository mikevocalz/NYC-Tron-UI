---
name: "ParagraphStylesGallery"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/document/ParagraphStylesGallery"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.textMuted"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# ParagraphStylesGallery

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/ParagraphStylesGallery.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/ParagraphStylesGallery.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ParagraphStylesGallery } from "@nyc-tron/ui/components/forge/document/ParagraphStylesGallery";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/document/ParagraphStylesGallery
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/ParagraphStylesGallery.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `styles` | `readonly ParagraphStyle[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `renderPreview` | `(styleId: string) => ReactNode` | not recorded | yes |  |
| `onApply` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onClearOverrides` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onUpdateFromSelection` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/ParagraphStylesGallery.tsx -->
- `accessibilityLabel`: "Paragraph styles"
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
