---
name: "PDFInlineTextEdit"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/pdf/PDFInlineTextEdit"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.text", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# PDFInlineTextEdit

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/PDFInlineTextEdit.tsx -->
Actual native PDF hit tests/font admission and save acknowledgement; edits never claim an unacknowledged save.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/PDFInlineTextEdit.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PDFInlineTextEdit } from "@nyc-tron/ui/components/forge/pdf/PDFInlineTextEdit";`
- Peers: @nyc-tron/core, react, react-native, react-native-gesture-handler, zustand
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/PDFInlineTextEdit
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/PDFInlineTextEdit.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `pageId` | `string` | not recorded | yes |  |
| `surface` | `ReactNode` | not recorded | yes |  |
| `activeRun` | `PDFTextRun \| null` | not recorded | yes |  |
| `layoutMode` | `'preserve-bounds' \| 'reflow-box'` | not recorded | yes |  |
| `availableLayoutModes` | `readonly ('preserve-bounds' \| 'reflow-box')[]` | not recorded | yes |  |
| `viewportToPage` | `(point: { x: number; y: number; }) => { x: number; y: number; }` | not recorded | yes |  |
| `onHitTest` | `(point: { x: number; y: number; }, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `validation` | `{ text: string; valid: boolean; message?: string; }` | not recorded | yes |  |
| `status` | `'idle' \| 'saving' \| 'saved' \| 'error'` | not recorded | yes |  |
| `lastSavedText` | `string \| null` | not recorded | yes |  |
| `error` | `string` | not recorded | no |  |
| `onDraftChange` | `(runId: string, text: string) => void` | not recorded | yes |  |
| `onLayoutModeChange` | `(mode: PDFInlineTextEditProps['layoutMode']) => void` | not recorded | yes |  |
| `onSave` | `(runId: string, text: string, layoutMode: PDFInlineTextEditProps['layoutMode'], signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCancel` | `() => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/PDFInlineTextEdit.tsx -->
- `accessibilityLabel`: "PDF inline text editing", "Replacement PDF text"
- `accessibilityLiveRegion`: "polite"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
