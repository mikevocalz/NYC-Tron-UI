---
name: "HyperlinkInspector"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/pdf/HyperlinkInspector"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# HyperlinkInspector

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/HyperlinkInspector.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/HyperlinkInspector.tsx -->
- Package: @nyc-tron/ui
- Import: `import { HyperlinkInspector } from "@nyc-tron/ui/forge/pdf/HyperlinkInspector";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/HyperlinkInspector
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/HyperlinkInspector.tsx -->
Extends: `Omit<PropertyInspectorProps, 'label' | 'fields' | 'onCommit'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `PDFHyperlink` | not recorded | yes |  |
| `pages` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `onCommit` | `(value: PDFHyperlink, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onOpen` | `(value: PDFHyperlink, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRemove` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/HyperlinkInspector.tsx -->
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
