---
name: "OutlineTree"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/inputs/OutlineTree"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# OutlineTree

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/inputs/OutlineTree.tsx -->
Shared virtual tree owner for bookmarks, component/frame trees and hierarchical navigation.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/inputs/OutlineTree.tsx -->
- Package: @nyc-tron/ui
- Import: `import { OutlineTree } from "@nyc-tron/ui/components/forge/inputs/OutlineTree";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/inputs/OutlineTree
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/inputs/OutlineTree.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | not recorded | yes |  |
| `nodes` | `readonly OutlineNode[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `expandedIds` | `readonly string[]` | not recorded | no |  |
| `onSelect` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onExpandedChange` | `(ids: readonly string[]) => void` | not recorded | no |  |
| `viewportHeight` | `number` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/inputs/OutlineTree.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: set from an expression
- `accessibilityState`: set from an expression
- `role`: "tree"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
