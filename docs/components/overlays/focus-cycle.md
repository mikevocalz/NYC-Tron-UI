---
name: "FocusCycleModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/overlays/focus-cycle"
tier: 2
docs: "generated"
platforms: []
category: "overlay"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# FocusCycleModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/overlays/focus-cycle.ts -->
Tab and Shift+Tab inside an open overlay.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/overlays/focus-cycle.ts -->
- Package: @nyc-tron/ui
- Import: `import { cycleFocusIndex, cycleFocusTarget } from "@nyc-tron/ui/overlays/focus-cycle";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/overlays/focus-cycle
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/overlays/focus-cycle.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `cycleFocusIndex` | function | `function cycleFocusIndex(count: number, current: number, backwards: boolean): number;` |
| `cycleFocusTarget` | function | `function cycleFocusTarget(ids: readonly string[], currentId: string \| undefined, backwards: boolean): string \| undefined;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/overlays/focus-cycle.ts -->
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
