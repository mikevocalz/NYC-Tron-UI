---
name: "TextWrapAndFrames"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/document/TextWrapAndFrames"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.2"]
registryDependencies: ["@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# TextWrapAndFrames

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/TextWrapAndFrames.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/TextWrapAndFrames.tsx -->
- Package: @nyc-tron/ui
- Import: `import { TextWrapAndFrames } from "@nyc-tron/ui/forge/document/TextWrapAndFrames";`
- Peers: react, react-native
- Requires: @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/document/TextWrapAndFrames
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/TextWrapAndFrames.tsx -->
Extends: `Omit<PropertyInspectorProps, 'label' | 'fields' | 'onCommit'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `frames` | `readonly TextFrame[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `renderFrame` | `(id: string) => ReactNode` | not recorded | yes |  |
| `onCommit` | `(id: string, value: TextFrame, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/TextWrapAndFrames.tsx -->
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
