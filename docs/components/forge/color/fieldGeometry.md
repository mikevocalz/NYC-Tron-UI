---
name: "FieldGeometryModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/fieldGeometry"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# FieldGeometryModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/fieldGeometry.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/fieldGeometry.ts -->
- Package: @nyc-tron/ui
- Import: `import { hsvToPoint, pointToHsv } from "@nyc-tron/ui/components/forge/color/fieldGeometry";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/color/fieldGeometry
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/fieldGeometry.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FieldPoint` | interface | `interface FieldPoint { readonly x: number; readonly y: number; }` |
| `FieldSize` | interface | `interface FieldSize { readonly width: number; readonly height: number; }` |
| `hsvToPoint` | function | `function hsvToPoint(color: HsvColor, size: FieldSize): FieldPoint;` |
| `pointToHsv` | function | `function pointToHsv(point: FieldPoint, size: FieldSize, current: HsvColor): HsvColor;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/fieldGeometry.ts -->
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
