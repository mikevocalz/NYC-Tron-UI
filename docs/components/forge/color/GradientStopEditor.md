---
name: "GradientStopEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/GradientStopEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/forge/color/ColorChannelFields", "@nyc-tron/shell/UnitInput"]
a11yStatus: "unverified"
---

# GradientStopEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/GradientStopEditor.tsx -->
Edits stop positions and RGBA, inserts interpolated stops and prevents fewer than two stops.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/GradientStopEditor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { GradientStopEditor } from "@nyc-tron/ui/components/forge/color/GradientStopEditor";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/forge/color/ColorChannelFields, @nyc-tron/shell/UnitInput

```sh
npx shadcn@latest add @nyc-tron/forge/color/GradientStopEditor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/GradientStopEditor.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `GradientPaint` | not recorded | yes |  |
| `selectedIndex` | `number` | not recorded | yes |  |
| `options` | `GradientOptions` | not recorded | yes |  |
| `onSelect` | `(index: number) => void` | not recorded | yes |  |
| `onCommit` | `(paint: GradientPaint, selectedIndex: number, options: GradientOptions) => void` | not recorded | yes | One paint transaction; returned selection avoids a stale index after insertion/deletion. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/GradientStopEditor.tsx -->
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
