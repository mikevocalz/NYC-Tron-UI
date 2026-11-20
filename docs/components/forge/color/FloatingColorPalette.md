---
name: "FloatingColorPalette"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/FloatingColorPalette"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/forge/color/FloatingPaletteUndockHandle"]
a11yStatus: "unverified"
---

# FloatingColorPalette

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/FloatingColorPalette.tsx -->
Dockable color palette (C-26).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/FloatingColorPalette.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/forge/color/FloatingPaletteUndockHandle

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/color/FloatingColorPalette
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { FloatingColorPalette } from "@/components/nyc-tron/ui/components/forge/color/FloatingColorPalette";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { FloatingColorPalette } from "@nyc-tron/ui/components/forge/color/FloatingColorPalette";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/FloatingColorPalette.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `docked` | `boolean` | not recorded | yes |  |
| `position` | `PalettePosition` | not recorded | yes | Floating top-left in the parent's coordinates. Ignored while docked. |
| `bounds` | `PaletteRect` | not recorded | yes | The parent's area the floating palette stays inside, in its own coordinates (usually 0,0,width,height). |
| `obstacles` | `readonly PaletteRect[]` | not recorded | no | Hinges, folds and cutouts in the same coordinates; the palette is never drawn across one. |
| `mode` | `PaletteMode` | not recorded | yes |  |
| `onModeChange` | `(mode: PaletteMode) => void` | not recorded | yes |  |
| `onUndock` | `(position: PalettePosition) => void` | not recorded | yes |  |
| `onMove` | `(position: PalettePosition) => void` | not recorded | yes |  |
| `onDock` | `() => void` | not recorded | yes |  |
| `onClose` | `() => void` | not recorded | no | Shows Close on the floating palette. |
| `children` | `(mode: PaletteMode) => ReactNode` | not recorded | yes | The picker for each mode. The host renders it against its one color store. |
| `title` | `string` | `"Colors"` | no |  |
| `floatingWidth` | `number` | `260` | no | Floating width. |
| `className` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/FloatingColorPalette.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "header", "tab", "tablist"
- `accessibilityState`: set from an expression
- `aria-selected`: set from an expression
- `role`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
