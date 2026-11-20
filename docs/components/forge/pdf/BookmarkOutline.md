---
name: "BookmarkOutline"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/pdf/BookmarkOutline"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/forge/inputs/OutlineTree"]
a11yStatus: "unverified"
---

# BookmarkOutline

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/BookmarkOutline.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/BookmarkOutline.tsx -->
- Package: @nyc-tron/ui
- Import: `import { BookmarkOutline } from "@nyc-tron/ui/forge/pdf/BookmarkOutline";`
- Peers: react, react-native
- Requires: @nyc-tron/forge/inputs/OutlineTree

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/BookmarkOutline
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/BookmarkOutline.tsx -->
Extends: `Omit<OutlineTreeProps, 'label' | 'nodes' | 'onSelect'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `bookmarks` | `readonly PDFBookmark[]` | not recorded | yes |  |
| `onJump` | `(destination: PDFBookmark['destination'], signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/BookmarkOutline.tsx -->
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
