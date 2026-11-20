---
name: "HSLSecondaryEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/HSLSecondaryEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.textMuted"]
registryDependencies: ["@nyc-tron/shell/UnitInput"]
a11yStatus: "unverified"
---

# HSLSecondaryEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/HSLSecondaryEditor.tsx -->
Edits wrapping hue selection, saturation/luma bounds, mask refinement and corrections.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/HSLSecondaryEditor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { HSLSecondaryEditor } from "@nyc-tron/ui/components/forge/color/HSLSecondaryEditor";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/shell/UnitInput

```sh
npx shadcn@latest add @nyc-tron/forge/color/HSLSecondaryEditor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/HSLSecondaryEditor.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `HSLSecondary` | not recorded | yes |  |
| `onCommit` | `(value: HSLSecondary) => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/HSLSecondaryEditor.tsx -->
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
