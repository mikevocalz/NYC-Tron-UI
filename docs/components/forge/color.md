---
name: "ColorModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ColorModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color.ts -->
Document-independent sRGB display color math from Nitro Forge color-ui PRs #26 and #34.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color.ts -->
- Package: @nyc-tron/ui
- Import: `import { alphaPercent, assertHsv, assertRgba, hsvToRgb, parseHexColor, rgbToHsv, rgbaEditToHsv, rgbaToHex } from "@nyc-tron/ui/components/forge/color";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/color
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `HsvColor` | interface | `interface HsvColor { readonly h: number; readonly s: number; readonly v: number; readonly alpha: number; }` |
| `RgbaColor` | interface | `interface RgbaColor { readonly r: number; readonly g: number; readonly b: number; readonly alpha: number; }` |
| `alphaPercent` | function | `function alphaPercent(alpha: number): number;` |
| `assertHsv` | function | `function assertHsv(c: HsvColor): void;` |
| `assertRgba` | function | `function assertRgba(c: RgbaColor): void;` |
| `hsvToRgb` | function | `function hsvToRgb(c: HsvColor): RgbaColor;` |
| `parseHexColor` | function | `function parseHexColor(value: string): RgbaColor;` |
| `rgbToHsv` | function | `function rgbToHsv(c: RgbaColor, retainedHue?: number): HsvColor;` |
| `rgbaEditToHsv` | function | `function rgbaEditToHsv(next: RgbaColor, current: HsvColor): HsvColor;` |
| `rgbaToHex` | function | `function rgbaToHex(c: RgbaColor, includeAlpha?: boolean): string;` |
| `wrapHue` | function | `function wrapHue(h: number): number;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color.ts -->
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
