---
name: "FieldGestureModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/color/fieldGesture"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# FieldGestureModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/fieldGesture.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/fieldGesture.ts -->
- Package: @nyc-tron/ui
- Import: `import { createFieldGesture } from "@nyc-tron/ui/forge/color/fieldGesture";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/color/fieldGesture
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/fieldGesture.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FieldGesture` | interface | `interface FieldGesture { shouldStart(): boolean; grant(point: FieldPoint): void; move(point: FieldPoint): void; release(): void; terminate(): void; terminati...` |
| `FieldGestureOptions` | interface | `interface FieldGestureOptions { readonly getSize: () => FieldSize; readonly getValue: () => HsvColor; readonly getDisabled: () => boolean; readonly onChange:...` |
| `createFieldGesture` | function | `function createFieldGesture(options: FieldGestureOptions): FieldGesture;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/fieldGesture.ts -->
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
