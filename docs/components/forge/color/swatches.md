---
name: "SwatchesModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/color/swatches"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# SwatchesModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/swatches.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/swatches.ts -->
- Package: @nyc-tron/ui
- Import: `import { filterSwatchGroups, pushRecentSwatch, swatchColumns, swatchGridMove, swatchKey } from "@nyc-tron/ui/forge/color/swatches";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/color/swatches
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/swatches.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `Swatch` | interface | `interface Swatch { readonly id: string; readonly color: RgbaColor; readonly name?: string; }` |
| `SwatchGroup` | interface | `interface SwatchGroup { readonly id: string; readonly label: string; readonly kind: SwatchGroupKind; readonly swatches: readonly Swatch[]; }` |
| `SwatchGroupKind` | type | `type SwatchGroupKind = "recent" \| "document" \| "saved" \| "named";` |
| `filterSwatchGroups` | function | `function filterSwatchGroups(groups: readonly SwatchGroup[], query: string): SwatchGroup[];` |
| `pushRecentSwatch` | function | `function pushRecentSwatch(recent: readonly Swatch[], color: RgbaColor, limit?: number): Swatch[];` |
| `swatchColumns` | function | `function swatchColumns(width: number, cell?: number, gap?: number): number;` |
| `swatchGridMove` | function | `function swatchGridMove(index: number, key: string \| undefined, columns: number, count: number, rtl?: boolean): number \| undefined;` |
| `swatchKey` | const | `const swatchKey: (s: Swatch) => string;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/swatches.ts -->
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
