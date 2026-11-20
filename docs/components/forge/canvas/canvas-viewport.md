---
name: "CanvasViewportModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/canvas/canvas-viewport"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# CanvasViewportModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas/canvas-viewport.ts -->
Document-to-screen mapping shared by the canvas guide controls ({@linkcode CanvasViewport}).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas/canvas-viewport.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/canvas/canvas-viewport
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { docPointToScreen, docToScreen, screenPointToDoc, screenToDoc, tidy, validateDocRect, validateViewport, visibleDocRect } from "@/components/nyc-tron/ui/components/forge/canvas/canvas-viewport";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { docPointToScreen, docToScreen, screenPointToDoc, screenToDoc, tidy, validateDocRect, validateViewport, visibleDocRect } from "@nyc-tron/ui/components/forge/canvas/canvas-viewport";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas/canvas-viewport.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `CanvasAxis` | type | `type CanvasAxis = "x" \| "y";` |
| `CanvasViewport` | interface | `interface CanvasViewport { readonly zoom: number; readonly panX: number; readonly panY: number; readonly width: number; readonly height: number; }` |
| `DocPoint` | interface | `interface DocPoint { readonly x: number; readonly y: number; }` |
| `DocRect` | interface | `interface DocRect { readonly x: number; readonly y: number; readonly w: number; readonly h: number; }` |
| `docPointToScreen` | function | `function docPointToScreen(viewport: CanvasViewport, p: DocPoint): DocPoint;` |
| `docToScreen` | function | `function docToScreen(viewport: CanvasViewport, axis: CanvasAxis, value: number): number;` |
| `screenPointToDoc` | function | `function screenPointToDoc(viewport: CanvasViewport, p: DocPoint): DocPoint;` |
| `screenToDoc` | function | `function screenToDoc(viewport: CanvasViewport, axis: CanvasAxis, value: number): number;` |
| `tidy` | function | `function tidy(value: number, digits?: number): number;` |
| `validateDocRect` | function | `function validateDocRect(rect: DocRect, what?: string): void;` |
| `validateViewport` | function | `function validateViewport(viewport: CanvasViewport): void;` |
| `visibleDocRect` | function | `function visibleDocRect(viewport: CanvasViewport): DocRect;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas/canvas-viewport.ts -->
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
