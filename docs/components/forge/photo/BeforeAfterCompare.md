---
name: "BeforeAfterCompareModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/photo/BeforeAfterCompare"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/forge/layers/CanvasCompareView"]
a11yStatus: "unverified"
---

# BeforeAfterCompareModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/BeforeAfterCompare.tsx -->
Canonical photo name for the existing shared comparison owner: side-by-side, draggable wipe, overlay and pinned reference, from real host pixels or URIs.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/BeforeAfterCompare.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/forge/layers/CanvasCompareView

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/photo/BeforeAfterCompare
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { BeforeAfterCompare } from "@/components/nyc-tron/ui/components/forge/photo/BeforeAfterCompare";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { BeforeAfterCompare } from "@nyc-tron/ui/components/forge/photo/BeforeAfterCompare";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/BeforeAfterCompare.tsx -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `BeforeAfterCompare` | function | `function CanvasCompareView({ scope, revision, ...props }: CanvasCompareViewProps): import("react").JSX.Element;` |
| `BeforeAfterCompareProps` | interface | `interface CanvasCompareViewProps extends Omit<ViewProps, "children">, ScopedControlProps { before: CompareSource \| null; after: CompareSource \| null; beforeL...` |
| `CompareMode` | type | `type CompareMode = "side-by-side" \| "split" \| "overlay" \| "reference";` |
| `CompareSource` | type | `type CompareSource = { readonly kind: "pixels"; readonly raster: RasterPixels; } \| { readonly kind: "uri"; readonly uri: string; readonly width: number; read...` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/BeforeAfterCompare.tsx -->
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
