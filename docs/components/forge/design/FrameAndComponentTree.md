---
name: "FrameAndComponentTree"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/design/FrameAndComponentTree"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/forge/inputs/OutlineTree"]
a11yStatus: "unverified"
---

# FrameAndComponentTree

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/design/FrameAndComponentTree.tsx -->
One hierarchy owner with native focus, expansion and virtualization.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/design/FrameAndComponentTree.tsx -->
- Package: @nyc-tron/ui
- Import: `import { FrameAndComponentTree } from "@nyc-tron/ui/forge/design/FrameAndComponentTree";`
- Peers: react, react-native
- Requires: @nyc-tron/forge/inputs/OutlineTree

```sh
npx shadcn@latest add @nyc-tron/forge/design/FrameAndComponentTree
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/design/FrameAndComponentTree.tsx -->
Extends: `Omit<OutlineTreeProps, 'nodes' | 'label'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `nodes` | `readonly DesignTreeNode[]` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/design/FrameAndComponentTree.tsx -->
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
