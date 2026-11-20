---
name: "DrawerModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/navigation/drawer-model"
tier: 2
docs: "generated"
platforms: []
category: "navigation"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# DrawerModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/navigation/drawer-model.ts -->
A strictly controlled React Native Windows-compatible navigation fallback.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/navigation/drawer-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { drawerGeometry } from "@nyc-tron/ui/components/navigation/drawer-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/navigation/drawer-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/navigation/drawer-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `DrawerGeometry` | interface | `interface DrawerGeometry { readonly contentInsetLeft: number; readonly paneWidth: number; readonly showPane: boolean; readonly showLabels: boolean; readonly ...` |
| `DrawerGeometryInput` | interface | `interface DrawerGeometryInput { readonly mode: DrawerMode; readonly open: boolean; readonly expandedWidth?: number; readonly compactWidth?: number; }` |
| `DrawerMode` | type | `type DrawerMode = "expanded" \| "compact" \| "minimal";` |
| `drawerGeometry` | function | `function drawerGeometry({ mode, open, expandedWidth, compactWidth, }: DrawerGeometryInput): DrawerGeometry;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/navigation/drawer-model.ts -->
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
