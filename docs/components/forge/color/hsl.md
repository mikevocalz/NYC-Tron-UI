---
name: "HslModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/hsl"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# HslModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/hsl.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/hsl.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/color/hsl
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { assertHsl, hslToHsv, hslToRgb, hsvToHsl, rgbToHsl } from "@/components/nyc-tron/ui/components/forge/color/hsl";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { assertHsl, hslToHsv, hslToRgb, hsvToHsl, rgbToHsl } from "@nyc-tron/ui/components/forge/color/hsl";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/hsl.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `HslColor` | interface | `interface HslColor { readonly h: number; readonly s: number; readonly l: number; readonly alpha: number; }` |
| `assertHsl` | function | `function assertHsl(c: HslColor): void;` |
| `hslToHsv` | function | `function hslToHsv(c: HslColor): HsvColor;` |
| `hslToRgb` | function | `function hslToRgb(c: HslColor): RgbaColor;` |
| `hsvToHsl` | function | `function hsvToHsl(c: HsvColor): HslColor;` |
| `rgbToHsl` | function | `function rgbToHsl(c: RgbaColor, retainedHue?: number): HslColor;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/hsl.ts -->
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
