---
name: "TableOfContentsEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/document/TableOfContentsEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# TableOfContentsEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/TableOfContentsEditor.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/TableOfContentsEditor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { TableOfContentsEditor } from "@nyc-tron/ui/components/forge/document/TableOfContentsEditor";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/document/TableOfContentsEditor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/TableOfContentsEditor.tsx -->
Extends: `Omit<PropertyInspectorProps, 'label' | 'fields' | 'onCommit'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `ContentsSettings` | not recorded | yes |  |
| `entries` | `readonly { id: string; label: string; level: number; pageLabel: string; }[]` | not recorded | yes |  |
| `stale` | `boolean` | not recorded | yes |  |
| `onCommit` | `(value: ContentsSettings, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onUpdate` | `(mode: 'page-numbers' \| 'entire-table', signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onJump` | `(id: string) => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/TableOfContentsEditor.tsx -->
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
