---
name: "DragControllerModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/gestures/drag-controller"
tier: 2
docs: "generated"
platforms: []
category: "primitive"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# DragControllerModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/gestures/drag-controller.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/gestures/drag-controller.ts -->
- Package: @nyc-tron/ui
- Import: `import { createDragController } from "@nyc-tron/ui/gestures/drag-controller";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/gestures/drag-controller
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/gestures/drag-controller.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `DragController` | interface | `interface DragController { begin(): void; move(point: DragPoint): void; release(): void; cancel(): void; }` |
| `DragControllerCallbacks` | interface | `interface DragControllerCallbacks { disabled: () => boolean; start: () => void; move: (point: DragPoint) => void; commit: () => void; cancel: () => void; }` |
| `createDragController` | function | `function createDragController(callbacks: DragControllerCallbacks): DragController;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/gestures/drag-controller.ts -->
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
