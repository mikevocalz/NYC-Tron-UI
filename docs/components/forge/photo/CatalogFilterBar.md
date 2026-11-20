---
name: "CatalogFilterBar"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/photo/CatalogFilterBar"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.danger", "color.text", "radius.control", "space.1", "space.1.5", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/shell/UnitInput"]
a11yStatus: "declared"
---

# CatalogFilterBar

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/CatalogFilterBar.tsx -->
Explicit host-indexed catalog filters.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/CatalogFilterBar.tsx -->
- Package: @nyc-tron/ui
- Import: `import { CatalogFilterBar } from "@nyc-tron/ui/forge/photo/CatalogFilterBar";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/shell/UnitInput

```sh
npx shadcn@latest add @nyc-tron/forge/photo/CatalogFilterBar
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/CatalogFilterBar.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `catalogId` | `string` | not recorded | yes |  |
| `value` | `PhotoCatalogFilter` | not recorded | yes |  |
| `cameras` | `readonly CatalogChoice[]` | not recorded | yes |  |
| `lenses` | `readonly CatalogChoice[]` | not recorded | yes |  |
| `albums` | `readonly CatalogChoice[]` | not recorded | yes |  |
| `onChange` | `(filter: PhotoCatalogFilter) => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/CatalogFilterBar.tsx -->
- `accessibilityLabel`: "Search photo metadata"
- `accessibilityLiveRegion`: "polite"
- `aria-disabled`: set from an expression
- `aria-invalid`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
