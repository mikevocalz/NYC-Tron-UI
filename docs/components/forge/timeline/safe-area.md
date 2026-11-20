---
name: "SafeAreaModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/safe-area"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# SafeAreaModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/safe-area.ts -->
A rectangle in the overlay's layout coordinates.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/safe-area.ts -->
- Package: @nyc-tron/ui
- Import: `import { FRAME_GUIDES, SAFE_AREA_PRESETS, fitAspect, guideRect, insetRect, safeAreas } from "@nyc-tron/ui/components/forge/timeline/safe-area";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/safe-area
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/safe-area.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FRAME_GUIDES` | const | `const FRAME_GUIDES: { readonly scope: 2.39; readonly flat: 1.85; readonly square: 1; readonly vertical: number; readonly portrait: number; };` |
| `OverlayRect` | interface | `interface OverlayRect { readonly x: number; readonly y: number; readonly width: number; readonly height: number; }` |
| `SAFE_AREA_PRESETS` | const | `const SAFE_AREA_PRESETS: { readonly smpte: { readonly action: 0.93; readonly title: 0.9; }; readonly legacy: { readonly action: 0.9; readonly title: 0.8; }; };` |
| `SafeAreaSpec` | type | `type SafeAreaSpec = keyof typeof SAFE_AREA_PRESETS \| { readonly action: number; readonly title: number; };` |
| `fitAspect` | function | `function fitAspect(container: { readonly width: number; readonly height: number; }, aspect: number): OverlayRect;` |
| `guideRect` | function | `function guideRect(picture: OverlayRect, guide: number): OverlayRect;` |
| `insetRect` | function | `function insetRect(rect: OverlayRect, fraction: number): OverlayRect;` |
| `safeAreas` | function | `function safeAreas(container: { readonly width: number; readonly height: number; }, aspect: number, spec?: SafeAreaSpec): { picture: OverlayRect; action: Ove...` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/safe-area.ts -->
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
