---
name: "PDFFormFieldEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/pdf/PDFFormFieldEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# PDFFormFieldEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/PDFFormFieldEditor.tsx -->
Edits actual AcroForm metadata; native signing, field appearance regeneration and validation stay with the PDF host.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/PDFFormFieldEditor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PDFFormFieldEditor } from "@nyc-tron/ui/components/forge/pdf/PDFFormFieldEditor";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/PDFFormFieldEditor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/PDFFormFieldEditor.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `fields` | `readonly PDFFormField[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `onSelect` | `(id: string, pageId: string) => void` | not recorded | yes |  |
| `onCommit` | `(id: string, value: PropertyValue, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onSign` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onValidate` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `validationStatus` | `'unvalidated' \| 'validating' \| 'valid' \| 'invalid'` | not recorded | yes |  |
| `validationRevision` | `string \| number` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/PDFFormFieldEditor.tsx -->
- `accessibilityLabel`: "PDF form fields"
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
