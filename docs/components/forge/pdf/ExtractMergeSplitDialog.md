---
name: "ExtractMergeSplitDialog"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/pdf/ExtractMergeSplitDialog"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.surfaceRaised", "color.text", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# ExtractMergeSplitDialog

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/ExtractMergeSplitDialog.tsx -->
Native modal review of source order and page selection; host retains file/security scopes and PDF transactions.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/ExtractMergeSplitDialog.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ExtractMergeSplitDialog } from "@nyc-tron/ui/components/forge/pdf/ExtractMergeSplitDialog";`
- Peers: @nyc-tron/core, react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/ExtractMergeSplitDialog
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/ExtractMergeSplitDialog.tsx -->
Extends: `ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `open` | `boolean` | not recorded | yes |  |
| `mode` | `'extract' \| 'merge' \| 'split'` | not recorded | yes |  |
| `sources` | `readonly PDFSourceDocument[]` | not recorded | yes |  |
| `selectedSourceId` | `string \| null` | not recorded | yes |  |
| `onChooseSources` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onSelectSource` | `(id: string) => void` | not recorded | yes |  |
| `onApply` | `(request: { mode: 'extract' \| 'merge' \| 'split'; sources: readonly string[]; selectedSourceId: string; pages: readonly number[]; }, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onClose` | `() => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/ExtractMergeSplitDialog.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "PDF page ranges"
- `accessibilityRole`: "header"
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
