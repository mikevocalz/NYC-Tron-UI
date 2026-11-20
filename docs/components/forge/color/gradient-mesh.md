---
name: "GradientMeshModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/gradient-mesh"
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
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/color/gradient-mesh
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { editMeshPoint, rasterizeMesh, validateMesh } from "@/components/nyc-tron/ui/components/forge/color/gradient-mesh";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { editMeshPoint, rasterizeMesh, validateMesh } from "@nyc-tron/ui/components/forge/color/gradient-mesh";`
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
