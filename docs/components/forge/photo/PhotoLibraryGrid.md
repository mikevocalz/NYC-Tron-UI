---
name: "PhotoLibraryGrid"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/photo/PhotoLibraryGrid"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button"]
a11yStatus: "unverified"
---

# PhotoLibraryGrid

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/PhotoLibraryGrid.tsx -->
Virtualized catalog page with host-generated thumbnails; originals are never decoded by the grid.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/PhotoLibraryGrid.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/photo/PhotoLibraryGrid
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { PhotoLibraryGrid } from "@/components/nyc-tron/ui/components/forge/photo/PhotoLibraryGrid";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { PhotoLibraryGrid } from "@nyc-tron/ui/components/forge/photo/PhotoLibraryGrid";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/PhotoLibraryGrid.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `photos` | `readonly PhotoCatalogItem[]` | not recorded | yes |  |
| `selectedIds` | `readonly string[]` | not recorded | yes |  |
| `onSelectionChange` | `(ids: readonly string[]) => void` | not recorded | yes |  |
| `onOpen` | `(id: string) => void` | not recorded | yes |  |
| `height` | `number` | not recorded | no |  |
| `minimumTileWidth` | `number` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
| `loading` | `boolean` | not recorded | no |  |
| `onLoadMore` | `() => void` | not recorded | no |  |
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
| `loading` | `loading` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/PhotoLibraryGrid.tsx -->
- `accessibilityLabel`: "Photo library"
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "checkbox"
- `accessibilityState`: set from an expression
- `aria-checked`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
