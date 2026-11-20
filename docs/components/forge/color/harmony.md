---
name: "HarmonyModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/color/harmony"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# HarmonyModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/harmony.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/harmony.ts -->
- Package: @nyc-tron/ui
- Import: `import { HARMONY_KINDS, harmonyColors } from "@nyc-tron/ui/forge/color/harmony";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/color/harmony
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/harmony.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `HARMONY_KINDS` | const | `const HARMONY_KINDS: readonly [ { readonly kind: "complementary"; readonly label: "Complementary"; readonly turns: readonly [ 180 ]; }, { readonly kind: "ana...` |
| `HarmonyKind` | type | `type HarmonyKind = "complementary" \| "analogous" \| "triadic" \| "split-complementary" \| "square";` |
| `harmonyColors` | function | `function harmonyColors(base: HsvColor, kind: HarmonyKind): HsvColor[];` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/harmony.ts -->
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
