---
name: "SnapGridSettings"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/canvas/SnapGridSettings"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "unverified"
---

# SnapGridSettings

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas/SnapGridSettings.tsx -->
Small settings control for the grid and snapping (B-04): show grid, grid spacing and subdivisions, the snapping switch, what to snap to, snap distance in screen units and magnetism strength.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas/SnapGridSettings.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SnapGridSettings } from "@nyc-tron/ui/components/forge/canvas/SnapGridSettings";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/forge/inputs/PrecisionScrubber

```sh
npx shadcn@latest add @nyc-tron/forge/canvas/SnapGridSettings
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas/SnapGridSettings.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | no |  |
| `revision` | `string \| number` | not recorded | no |  |
| `grid` | `GridSettings` | not recorded | yes |  |
| `snap` | `SnapSettings` | not recorded | yes |  |
| `onGridChange` | `(grid: GridSettings) => void` | not recorded | yes | Once per toggle, scrubber release, nudge or typed value, with the whole new grid. |
| `onSnapChange` | `(snap: SnapSettings) => void` | not recorded | yes | Once per toggle, scrubber release, nudge or typed value, with the whole new snap settings. |
| `disabled` | `boolean` | not recorded | no |  |
| `className` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas/SnapGridSettings.tsx -->
- `accessibilityLabel`: "Grid and snapping", "Snap to"
- `aria-level`: set from an expression
- `role`: "group", "heading"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
