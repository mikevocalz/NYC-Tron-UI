---
name: "MagicSelectionControls"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/selection/MagicSelectionControls"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/SegmentedControl", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "unverified"
---

# MagicSelectionControls

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/selection/MagicSelectionControls.tsx -->
Settings for the magic wand and the selection edge tools (B-20): tolerance, contiguous, sample source, then grow/shrink, feather and refine edge, each with a {@linkcode PrecisionScrubber}.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/selection/MagicSelectionControls.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/SegmentedControl, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/selection/MagicSelectionControls
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { MagicSelectionControls, MagicWandCanvas } from "@/components/nyc-tron/ui/components/forge/selection/MagicSelectionControls";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { MagicSelectionControls, MagicWandCanvas } from "@nyc-tron/ui/components/forge/selection/MagicSelectionControls";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/selection/MagicSelectionControls.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `settings` | `MagicWandSettings` | not recorded | yes |  |
| `onSettingsChange` | `(settings: MagicWandSettings) => void` | not recorded | yes | One call per committed scrubber change, toggle or sample choice. |
| `currentLayerName` | `string \| undefined` | not recorded | no | Name of the layer `sample: "layer"` reads, shown on the choice. `undefined` when no layer is current. |
| `hasSelection` | `boolean` | not recorded | yes | Whether the editor has a pixel selection (from `getSelection`). Edge tools need one. |
| `radii` | `SelectionEdgeRadii` | not recorded | yes |  |
| `onRadiiChange` | `(radii: SelectionEdgeRadii) => void` | not recorded | yes |  |
| `onModifySelection` | `(request: ModifySelectionRequest, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Grow, Shrink and Feather. Maps to `modifySelection`. One call per press. |
| `onRefineEdge` | `(request: RefineEdgeRequest, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | no | Refine edge (smooth, then feather). Optional: the Prism v2 contract has no smoothing op, so without this handler the section explains that and stays off. |
| `label` | `string` | `"Magic selection"` | no |  |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |

### MagicWandCanvas

Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `settings` | `MagicWandSettings` | not recorded | yes |  |
| `mode` | `SelectionMode` | not recorded | yes | Combine mode; Shift, Alt or both override it per click like the marquee. |
| `currentLayerId` | `string \| number \| undefined` | not recorded | no | Id sent as `sample: {layer}` when sampling the current layer. |
| `width` | `number` | not recorded | yes |  |
| `height` | `number` | not recorded | yes |  |
| `documentWidth` | `number` | not recorded | yes |  |
| `documentHeight` | `number` | not recorded | yes |  |
| `selectionBounds` | `DocRect \| undefined` | not recorded | no | Committed selection bounds, drawn as a dashed outline. |
| `onMagicWand` | `(request: MagicWandRequest, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Exactly once per click or keyboard Enter. Maps to `magicWand`. |
| `disabledReason` | `string` | not recorded | no | Why the wand is unavailable; clicks then show this instead. |
| `children` | `ReactNode` | not recorded | no |  |
| `label` | `string` | `"Magic wand canvas"` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/selection/MagicSelectionControls.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `aria-label`: "Sample"
- `aria-level`: set from an expression
- `aria-live`: "polite"
- `role`: "group", "heading"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
