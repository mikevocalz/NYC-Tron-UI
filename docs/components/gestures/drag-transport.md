---
name: "DragTransportModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/gestures/drag-transport"
tier: 2
docs: "generated"
platforms: []
category: "primitive"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# DragTransportModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/gestures/drag-transport.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/gestures/drag-transport.ts -->
- Package: @nyc-tron/ui
- Import: `import { keyboardKey } from "@nyc-tron/ui/components/gestures/drag-transport";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/gestures/drag-transport
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/gestures/drag-transport.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `DragPoint` | interface | `interface DragPoint { x: number; y: number; }` |
| `DragTransport` | type | `type DragTransport = ComponentType<DragTransportProps>;` |
| `DragTransportProps` | interface | `interface DragTransportProps { children: ReactElement; disabled?: boolean; onBegin: (point: DragPoint) => void; onMove: (point: DragPoint, touches: number) =...` |
| `KeyEventLike` | interface | `interface KeyEventLike { readonly key?: string; readonly nativeEvent?: { readonly key?: string; }; }` |
| `keyboardKey` | function | `function keyboardKey(event: KeyEventLike): string \| undefined;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/gestures/drag-transport.ts -->
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
