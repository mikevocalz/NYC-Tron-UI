---
name: "ContrastModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/color/contrast"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ContrastModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/contrast.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/contrast.ts -->
- Package: @nyc-tron/ui
- Import: `import { compositeOver, contrastRating, contrastRatio, relativeLuminance } from "@nyc-tron/ui/forge/color/contrast";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/color/contrast
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/contrast.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ContrastRating` | interface | `interface ContrastRating { readonly ratio: number; readonly aa: boolean; readonly aaa: boolean; readonly aaLarge: boolean; readonly aaaLarge: boolean; }` |
| `compositeOver` | function | `function compositeOver(top: RgbaColor, bottom: RgbaColor): RgbaColor;` |
| `contrastRating` | function | `function contrastRating(foreground: RgbaColor, background: RgbaColor): ContrastRating;` |
| `contrastRatio` | function | `function contrastRatio(foreground: RgbaColor, background: RgbaColor): number;` |
| `relativeLuminance` | function | `function relativeLuminance(c: RgbaColor): number;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/contrast.ts -->
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
