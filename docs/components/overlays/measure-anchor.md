---
name: "MeasureAnchorModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/overlays/measure-anchor"
tier: 2
docs: "generated"
platforms: []
category: "overlay"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# MeasureAnchorModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/overlays/measure-anchor.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/overlays/measure-anchor.ts -->
- Package: @nyc-tron/ui
- Import: `import { measureAnchor, windowRegions } from "@nyc-tron/ui/overlays/measure-anchor";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/overlays/measure-anchor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/overlays/measure-anchor.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `MeasurableView` | type | `type MeasurableView = { measureInWindow?: (callback: (x: number, y: number, width: number, height: number) => void) => void; };` |
| `measureAnchor` | function | `function measureAnchor(node: unknown): Promise<Rect2D \| undefined>;` |
| `windowRegions` | function | `function windowRegions(width: number, height: number): readonly Rect2D[];` |
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

<!-- generated:begin a11y source=packages/ui/src/components/overlays/measure-anchor.ts -->
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
