---
name: "LevelsEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/LevelsEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/shell/UnitInput"]
a11yStatus: "unverified"
---

# LevelsEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/LevelsEditor.tsx -->
Edits input/output bounds and gamma with noncrossing constraints.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/LevelsEditor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { LevelsEditor } from "@nyc-tron/ui/components/forge/color/LevelsEditor";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/shell/UnitInput

```sh
npx shadcn@latest add @nyc-tron/forge/color/LevelsEditor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/LevelsEditor.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `ColorLevels` | not recorded | yes |  |
| `onCommit` | `(value: ColorLevels) => void` | not recorded | yes |  |
| `label` | `string` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
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
| `disabled` | `disabled` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/LevelsEditor.tsx -->
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
