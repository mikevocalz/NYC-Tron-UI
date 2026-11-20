---
name: "GradientOptionsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/gradient-options"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# GradientOptionsModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/gradient-options.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/gradient-options.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/color/gradient-options
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { changeGradientType, rotateGradient, sampleGradient, validateGradientOptions } from "@/components/nyc-tron/ui/components/forge/color/gradient-options";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { changeGradientType, rotateGradient, sampleGradient, validateGradientOptions } from "@nyc-tron/ui/components/forge/color/gradient-options";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/gradient-options.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `GradientOptions` | interface | `interface GradientOptions { readonly interpolation: 'srgb' \| 'linear-rgb'; readonly midpoints: readonly number[]; }` |
| `changeGradientType` | function | `function changeGradientType(paint: GradientPaint, type: GradientPaint['type']): GradientPaint;` |
| `rotateGradient` | function | `function rotateGradient(paint: GradientPaint, degrees: number): GradientPaint;` |
| `sampleGradient` | function | `function sampleGradient(paint: GradientPaint, options: GradientOptions, offset: number): Rgba;` |
| `validateGradientOptions` | function | `function validateGradientOptions(paint: GradientPaint, options: GradientOptions): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/gradient-options.ts -->
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
