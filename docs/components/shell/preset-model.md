---
name: "PresetModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/preset-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# PresetModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/preset-model.ts -->
Which presets a {@linkcode PresetGallery} shows.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/preset-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { filterPresets, galleryColumns, gridFocusTarget, validatePresets } from "@nyc-tron/ui/shell/preset-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/preset-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/preset-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `PresetFilter` | type | `type PresetFilter = "all" \| "favorites";` |
| `PresetLike` | interface | `interface PresetLike { readonly id: string; readonly name: string; readonly favorite?: boolean; }` |
| `filterPresets` | function | `function filterPresets<T extends PresetLike>(presets: readonly T[], filter: PresetFilter): T[];` |
| `galleryColumns` | function | `function galleryColumns(width: number, minTile: number, gap: number): number;` |
| `gridFocusTarget` | function | `function gridFocusTarget(index: number, key: string, count: number, columns: number, rtl?: boolean): number \| null;` |
| `validatePresets` | function | `function validatePresets(presets: readonly PresetLike[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/preset-model.ts -->
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
