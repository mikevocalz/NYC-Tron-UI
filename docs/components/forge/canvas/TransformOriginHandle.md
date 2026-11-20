---
name: "TransformOriginHandle"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/canvas/TransformOriginHandle"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.primary", "color.surfaceRaised", "color.text", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# TransformOriginHandle

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas/TransformOriginHandle.tsx -->
Pivot editor for one layer (B-08).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas/TransformOriginHandle.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/canvas/TransformOriginHandle
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { TransformOriginHandle } from "@/components/nyc-tron/ui/components/forge/canvas/TransformOriginHandle";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { TransformOriginHandle } from "@nyc-tron/ui/components/forge/canvas/TransformOriginHandle";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas/TransformOriginHandle.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `showBounds` | `boolean` | not recorded | no | Hide the shared outline/anchor ink when composing with SelectionBounds. |
| `scope` | `string` | not recorded | no |  |
| `revision` | `string \| number` | not recorded | no |  |
| `viewport` | `CanvasViewport` | not recorded | yes |  |
| `corners` | `BoundsCorners` | not recorded | yes | Document corners of the selection's transformed bounds (`layerBounds` `corners`, or `rectCorners` of its box). |
| `transform` | `LayerTransform` | not recorded | no | The one selected layer's transform. Omit, with `unavailableReason`, when the pivot cannot be edited. |
| `unavailableReason` | `string` | not recorded | no | Shown at the selection's centre instead of a handle, e.g. "Select one layer to move its pivot" for a multi-selection or "Unlock the layer to move its pivot". Required when `transform` is omitted. |
| `onSetOrigin` | `(ox: number, oy: number) => void` | not recorded | yes | The pivot was dropped or stepped to a new spot. `ox`/`oy` are content coordinates, ready for `setTransformOrigin {id, ox, oy}`. One call per release or key press. |
| `onPreview` | `(point: DocPoint \| undefined) => void` | not recorded | no | Document point under the dragged pivot on each move, then `undefined` when the drag ends or is cancelled. |
| `disabled` | `boolean` | not recorded | no |  |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
| State | How it is set |
|---|---|
| `disabled` | `disabled` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas/TransformOriginHandle.tsx -->
- `accessibilityHint`: "Drag to move the point the layer rotates and scales around. Arrow keys nudge it; keys 1 to 9 jump to the anchors."
- `accessibilityLabel`: "Pivot"
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "adjustable"
- `aria-disabled`: set from an expression
- `aria-valuetext`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
