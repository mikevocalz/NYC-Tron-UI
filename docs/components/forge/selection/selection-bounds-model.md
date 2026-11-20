---
name: "SelectionBoundsModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/selection/selection-bounds-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# SelectionBoundsModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/selection/selection-bounds-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/selection/selection-bounds-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/selection/selection-bounds-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { RESIZE_HANDLES, editSelectionFrame, hitTestSelection, selectionFrameCorners, selectionHandlePoint, selectionResizeDirection, stepSelectionFrame, validateSelectionFrame } from "@/components/nyc-tron/ui/components/forge/selection/selection-bounds-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { RESIZE_HANDLES, editSelectionFrame, hitTestSelection, selectionFrameCorners, selectionHandlePoint, selectionResizeDirection, stepSelectionFrame, validateSelectionFrame } from "@nyc-tron/ui/components/forge/selection/selection-bounds-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/selection/selection-bounds-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `RESIZE_HANDLES` | const | `const RESIZE_HANDLES: readonly [ 'top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left' ];` |
| `ResizeHandle` | type | `type ResizeHandle = typeof RESIZE_HANDLES[number];` |
| `SelectionEditLimits` | interface | `interface SelectionEditLimits { minWidth?: number; minHeight?: number; maxWidth?: number; maxHeight?: number; lockAspect?: boolean; snapAngle?: boolean; }` |
| `SelectionFrame` | interface | `interface SelectionFrame { centerX: number; centerY: number; width: number; height: number; rotation: number; }` |
| `SelectionHandle` | type | `type SelectionHandle = ResizeHandle \| 'move' \| 'rotate';` |
| `editSelectionFrame` | function | `function editSelectionFrame(frame: SelectionFrame, handle: SelectionHandle, from: DocPoint, to: DocPoint, { minWidth, minHeight, maxWidth, maxHeight, lockAsp...` |
| `hitTestSelection` | function | `function hitTestSelection(frame: SelectionFrame, point: DocPoint, radius: number, rotationGap?: number): SelectionHandle \| undefined;` |
| `selectionFrameCorners` | function | `function selectionFrameCorners(frame: SelectionFrame): BoundsCorners;` |
| `selectionHandlePoint` | function | `function selectionHandlePoint(frame: SelectionFrame, handle: SelectionHandle, rotationGap?: number): DocPoint;` |
| `selectionResizeDirection` | function | `function selectionResizeDirection(frame: SelectionFrame, handle: ResizeHandle): DocPoint;` |
| `stepSelectionFrame` | function | `function stepSelectionFrame(frame: SelectionFrame, handle: SelectionHandle, dx: number, dy: number, limits?: SelectionEditLimits): SelectionFrame;` |
| `validateSelectionFrame` | function | `function validateSelectionFrame(frame: SelectionFrame): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/selection/selection-bounds-model.ts -->
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
