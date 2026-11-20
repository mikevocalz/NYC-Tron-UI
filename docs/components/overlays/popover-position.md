---
name: "PopoverPositionModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/overlays/popover-position"
tier: 2
docs: "generated"
platforms: []
category: "overlay"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# PopoverPositionModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/overlays/popover-position.ts -->
Compatibility entry; pure placement is shared with isolated native hosts.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/overlays/popover-position.ts -->
- Package: @nyc-tron/ui
- Import: `import { hasUsableRegion, placePopover, placementSide } from "@nyc-tron/ui/overlays/popover-position";`
- Peers: @nyc-tron/core, react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/overlays/popover-position
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/overlays/popover-position.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `PopupPosition` | type | `type PopupPosition = Readonly<{ x: number; y: number; width: number; height: number; region: Rect2D; }>;` |
| `Rect2D` | type | `type Rect2D = Readonly<{ x: number; y: number; width: number; height: number; }>;` |
| `hasUsableRegion` | function | `function hasUsableRegion(regions: readonly Rect2D[]): boolean;` |
| `placePopover` | function | `function placePopover(anchor: Rect2D, regions: readonly Rect2D[], desiredWidth: number, desiredHeight: number, padding?: number): PopupPosition;` |
| `placementSide` | function | `function placementSide(anchor: Rect2D, position: PopupPosition): "below" \| "above" \| "overlap";` |
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

<!-- generated:begin a11y source=packages/ui/src/components/overlays/popover-position.ts -->
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
