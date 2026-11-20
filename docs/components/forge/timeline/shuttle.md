---
name: "ShuttleModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/shuttle"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ShuttleModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/shuttle.ts -->
J/K/L shuttle (D-09).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/shuttle.ts -->
- Package: @nyc-tron/ui
- Import: `import { DEFAULT_SHUTTLE_LADDER, assertLadder, shuttleLabel, shuttleRate } from "@nyc-tron/ui/components/forge/timeline/shuttle";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/shuttle
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/shuttle.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `DEFAULT_SHUTTLE_LADDER` | const | `const DEFAULT_SHUTTLE_LADDER: readonly [ 1, 2, 4, 8 ];` |
| `assertLadder` | function | `function assertLadder(ladder: readonly number[]): void;` |
| `shuttleLabel` | function | `function shuttleLabel(rate: number): string;` |
| `shuttleRate` | function | `function shuttleRate(rate: number, key: "j" \| "k" \| "l", ladder?: readonly number[], supportsReverse?: boolean): number;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/shuttle.ts -->
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
