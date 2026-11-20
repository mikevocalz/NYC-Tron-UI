---
name: "SwatchGrid"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/SwatchGrid"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button"]
a11yStatus: "unverified"
---

# SwatchGrid

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/SwatchGrid.tsx -->
Searchable swatch groups (C-13).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/SwatchGrid.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SwatchGrid } from "@nyc-tron/ui/components/forge/color/SwatchGrid";`
- Peers: react, react-native
- Requires: @nyc-tron/Button

```sh
npx shadcn@latest add @nyc-tron/forge/color/SwatchGrid
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/SwatchGrid.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `groups` | `readonly SwatchGroup[]` | not recorded | yes | Recent, document, saved and named groups, in display order. The host persists them. |
| `onSelect` | `(swatch: Swatch, group: SwatchGroup) => void` | not recorded | yes | Applies a swatch. One commit per press. |
| `selectedKey` | `string` | not recorded | no | `swatchKey` of the color in use, to mark matching swatches. |
| `query` | `string` | not recorded | yes | The search text. Keep it in the host if it should survive a remount. |
| `onQueryChange` | `(query: string) => void` | not recorded | yes |  |
| `disabled` | `boolean` | not recorded | no |  |
| `rtl` | `boolean` | `I18nManager.isRTL` | no | Layout is right to left, which flips Left/Right arrow keys. Rows follow the platform's own RTL mirroring. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/SwatchGrid.tsx -->
- `accessibilityLabel`: "Search swatches"
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "button", "header"
- `accessibilityState`: set from an expression
- `aria-selected`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
