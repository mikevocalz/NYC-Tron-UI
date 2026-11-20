---
name: "OverlaysModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/core/overlays"
tier: 2
docs: "generated"
platforms: []
category: "primitive"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# OverlaysModule

## Purpose

<!-- generated:begin purpose source=packages/core/src/overlays.ts -->
Popup placement in caller-provided, nonoccluded host/window coordinates.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/core/package.json,packages/core/src/overlays.ts -->
- Package: @nyc-tron/core
- Peers: none
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/core/overlays
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { hasUsableRegion, placePopover, placementSide } from "@/lib/nyc-tron/core/overlays";`

### Tarball install

Install @nyc-tron/core from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { hasUsableRegion, placePopover, placementSide } from "@nyc-tron/core/overlays";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/core/src/overlays.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `CommandMenuItem` | type | `type CommandMenuItem = Readonly<{ id: string; label: string; description?: string; disabled?: boolean; danger?: boolean; }>;` |
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

<!-- generated:begin a11y source=packages/core/src/overlays.ts -->
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
