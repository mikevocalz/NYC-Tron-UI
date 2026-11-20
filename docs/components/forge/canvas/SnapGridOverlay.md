---
name: "SnapGridOverlay"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/canvas/SnapGridOverlay"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.surfaceRaised"]
registryDependencies: []
a11yStatus: "unverified"
---

# SnapGridOverlay

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas/SnapGridOverlay.tsx -->
Grid and snap feedback layer (B-04).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas/SnapGridOverlay.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SnapGridOverlay } from "@nyc-tron/ui/components/forge/canvas/SnapGridOverlay";`
- Peers: @nyc-tron/core, react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/canvas/SnapGridOverlay
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas/SnapGridOverlay.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `viewport` | `CanvasViewport` | not recorded | yes |  |
| `grid` | `GridSettings` | not recorded | yes |  |
| `snapped` | `{ readonly x?: SnapHit; readonly y?: SnapHit; }` | not recorded | no | The lines the current drag has snapped onto, straight from `snapPoint` or `snapRect` in `snap-grid-model`. They are drawn in the accent color across the whole view while the drag lasts. |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas/SnapGridOverlay.tsx -->
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
