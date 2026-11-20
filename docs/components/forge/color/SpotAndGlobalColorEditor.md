---
name: "SpotAndGlobalColorEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/SpotAndGlobalColorEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/SegmentedControl", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/color/ColorChannelFields", "@nyc-tron/shell/UnitInput"]
a11yStatus: "unverified"
---

# SpotAndGlobalColorEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/SpotAndGlobalColorEditor.tsx -->
Edits named spot/global identity, tint and an explicit sRGB alternate preview.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/SpotAndGlobalColorEditor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SpotAndGlobalColorEditor } from "@nyc-tron/ui/components/forge/color/SpotAndGlobalColorEditor";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/SegmentedControl, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/color/ColorChannelFields, @nyc-tron/shell/UnitInput

```sh
npx shadcn@latest add @nyc-tron/forge/color/SpotAndGlobalColorEditor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/SpotAndGlobalColorEditor.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `NamedColor` | not recorded | yes |  |
| `onChange` | `(draft: NamedColor) => void` | not recorded | yes | Draft changes; retain in a host-owned per-document store. |
| `onSave` | `(definition: NamedColor, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/SpotAndGlobalColorEditor.tsx -->
- `accessibilityLabel`: "Color name"
- `aria-label`: "Named color kind"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
