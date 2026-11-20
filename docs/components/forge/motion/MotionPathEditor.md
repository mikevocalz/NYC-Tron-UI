---
name: "MotionPathEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/motion/MotionPathEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/forge/vector/PenNodeEditor"]
a11yStatus: "unverified"
---

# MotionPathEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/MotionPathEditor.tsx -->
Spatial trajectory editing reuses the vector editor's native gesture, tangent and keyboard owner.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/MotionPathEditor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { MotionPathEditor } from "@nyc-tron/ui/forge/motion/MotionPathEditor";`
- Peers: react, react-native
- Requires: @nyc-tron/forge/vector/PenNodeEditor

```sh
npx shadcn@latest add @nyc-tron/forge/motion/MotionPathEditor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/MotionPathEditor.tsx -->
Extends: `Omit<PenNodeEditorProps, 'subpaths' | 'selection' | 'onSelectionChange' | 'onSetPathNode' | 'onInsertNode' | 'onRemoveNode' | 'onSetNodeKind' | 'onSetClosed' | 'snapPoint' | 'snapHandle' | 'editScope' | 'editRevision'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes |  |
| `revision` | `string \| number` | not recorded | yes |  |
| `subpaths` | `readonly Subpath[]` | not recorded | yes |  |
| `selection` | `NodeRef \| undefined` | not recorded | yes |  |
| `onSelectionChange` | `(selection: NodeRef \| undefined) => void` | not recorded | yes |  |
| `snapping` | `MotionPathSnapping` | not recorded | yes |  |
| `onCommit` | `(subpaths: readonly Subpath[]) => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/MotionPathEditor.tsx -->
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
