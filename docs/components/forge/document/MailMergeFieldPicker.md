---
name: "MailMergeFieldPicker"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/document/MailMergeFieldPicker"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# MailMergeFieldPicker

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/MailMergeFieldPicker.tsx -->
Preview values are supplied by the selected recipient's admitted data source.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/MailMergeFieldPicker.tsx -->
- Package: @nyc-tron/ui
- Import: `import { MailMergeFieldPicker } from "@nyc-tron/ui/components/forge/document/MailMergeFieldPicker";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/document/MailMergeFieldPicker
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/MailMergeFieldPicker.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `fields` | `readonly MergeField[]` | not recorded | yes |  |
| `recipientIndex` | `number` | not recorded | yes |  |
| `recipientCount` | `number` | not recorded | yes |  |
| `recipientLabel` | `string` | not recorded | yes |  |
| `status` | `'loading' \| 'ready' \| 'error'` | not recorded | yes |  |
| `error` | `string` | not recorded | no |  |
| `onRecipientChange` | `(index: number, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onInsert` | `(fieldId: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRetry` | `() => void` | not recorded | yes |  |
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
| `error` | `error` prop, type `string` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/MailMergeFieldPicker.tsx -->
- `accessibilityLabel`: "Mail merge fields"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
