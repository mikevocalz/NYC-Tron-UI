---
name: "GradientMeshModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/color/gradient-mesh"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# GradientMeshModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/gradient-mesh.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/gradient-mesh.ts -->
- Package: @nyc-tron/ui
- Import: `import { editMeshPoint, rasterizeMesh, validateMesh } from "@nyc-tron/ui/forge/color/gradient-mesh";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/color/gradient-mesh
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/gradient-mesh.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `GradientMesh` | interface | `interface GradientMesh { readonly rows: number; readonly columns: number; readonly points: readonly MeshPoint[]; }` |
| `MeshPoint` | interface | `interface MeshPoint { readonly id: string; readonly x: number; readonly y: number; readonly color: RgbaColor; }` |
| `editMeshPoint` | function | `function editMeshPoint(mesh: GradientMesh, id: string, change: Partial<Pick<MeshPoint, 'x' \| 'y' \| 'color'>>): GradientMesh;` |
| `rasterizeMesh` | function | `function rasterizeMesh(mesh: GradientMesh, edge?: number): { width: number; height: number; pixels: Uint8Array; };` |
| `validateMesh` | function | `function validateMesh(mesh: GradientMesh): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/gradient-mesh.ts -->
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
