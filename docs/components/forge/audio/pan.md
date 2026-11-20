---
name: "PanModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/pan"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# PanModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/pan.ts -->
Pan math for {@linkcode PanControl}.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/pan.ts -->
- Package: @nyc-tron/ui
- Import: `import { PAN_CENTRE_DETENT, PAN_QUANTUM, assertPan, describeBalance, describePan, dragToPan, formatPan, panToPosition } from "@nyc-tron/ui/forge/audio/pan";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/audio/pan
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/pan.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `PAN_CENTRE_DETENT` | const | `const PAN_CENTRE_DETENT = 0.04;` |
| `PAN_QUANTUM` | const | `const PAN_QUANTUM = 0.01;` |
| `assertPan` | function | `function assertPan(pan: number): void;` |
| `describeBalance` | function | `function describeBalance(pan: number): string;` |
| `describePan` | function | `function describePan(pan: number): string;` |
| `dragToPan` | function | `function dragToPan(startPan: number, deltaPx: number, trackPx: number): number;` |
| `formatPan` | function | `function formatPan(pan: number): string;` |
| `panToPosition` | function | `function panToPosition(pan: number): number;` |
| `quantizePan` | function | `function quantizePan(pan: number): number;` |
| `stepPan` | function | `function stepPan(pan: number, direction: -1 \| 1, step: number): number;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/pan.ts -->
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
