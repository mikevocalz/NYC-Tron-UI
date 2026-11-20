---
name: "FloatingPaletteModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/floating-palette"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# FloatingPaletteModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/floating-palette.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/floating-palette.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/color/floating-palette
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { FLOATING_PALETTE_WIDTH, PALETTE_MODES, UNDOCK_DISTANCE, nudgePalette, placeFloatingPalette, positionFromGrab, shouldUndock } from "@/components/nyc-tron/ui/components/forge/color/floating-palette";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { FLOATING_PALETTE_WIDTH, PALETTE_MODES, UNDOCK_DISTANCE, nudgePalette, placeFloatingPalette, positionFromGrab, shouldUndock } from "@nyc-tron/ui/components/forge/color/floating-palette";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/floating-palette.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FLOATING_PALETTE_WIDTH` | const | `const FLOATING_PALETTE_WIDTH = 260;` |
| `PALETTE_MODES` | const | `const PALETTE_MODES: readonly [ { readonly mode: "compact"; readonly label: "Compact"; }, { readonly mode: "classic"; readonly label: "Classic"; }, { readonl...` |
| `PaletteMode` | type | `type PaletteMode = "compact" \| "classic" \| "palettes";` |
| `PalettePlacement` | interface | `interface PalettePlacement { readonly position: PalettePosition; readonly overlapsObstacle: boolean; }` |
| `PalettePosition` | interface | `interface PalettePosition { readonly x: number; readonly y: number; }` |
| `PaletteRect` | interface | `interface PaletteRect { readonly x: number; readonly y: number; readonly width: number; readonly height: number; }` |
| `UNDOCK_DISTANCE` | const | `const UNDOCK_DISTANCE = 30;` |
| `nudgePalette` | function | `function nudgePalette(position: PalettePosition, key: string \| undefined): PalettePosition \| undefined;` |
| `placeFloatingPalette` | function | `function placeFloatingPalette(desired: PalettePosition, size: { readonly width: number; readonly height: number; }, bounds: PaletteRect, obstacles?: readonly...` |
| `positionFromGrab` | function | `function positionFromGrab(pointer: PalettePosition, grab: PalettePosition): PalettePosition;` |
| `shouldUndock` | function | `function shouldUndock(dx: number, dy: number): boolean;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/floating-palette.ts -->
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
