---
name: "ColorPairModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/color/color-pair"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ColorPairModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/color-pair.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/color-pair.ts -->
- Package: @nyc-tron/ui
- Import: `import { DEFAULT_COLOR_PAIR, sameColorPair, swapColorPair } from "@nyc-tron/ui/forge/color/color-pair";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/color/color-pair
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/color-pair.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ColorPair` | interface | `interface ColorPair { readonly foreground: RgbaColor; readonly background: RgbaColor; }` |
| `ColorPairSlot` | type | `type ColorPairSlot = "foreground" \| "background";` |
| `DEFAULT_COLOR_PAIR` | const | `const DEFAULT_COLOR_PAIR: { readonly foreground: { readonly r: 0; readonly g: 0; readonly b: 0; readonly alpha: 1; }; readonly background: { readonly r: 255;...` |
| `sameColorPair` | function | `function sameColorPair(a: ColorPair, b: ColorPair): boolean;` |
| `swapColorPair` | function | `function swapColorPair(pair: ColorPair): ColorPair;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/color-pair.ts -->
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
