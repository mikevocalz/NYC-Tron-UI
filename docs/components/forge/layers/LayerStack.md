---
name: "LayerStack"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/layers/LayerStack"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber", "@nyc-tron/forge/layers/ClippingMaskControls", "@nyc-tron/overlays/AnchoredPopover", "@nyc-tron/shell/MenuButton"]
a11yStatus: "unverified"
---

# LayerStack

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/layers/LayerStack.tsx -->
Controlled layer list for editors.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/layers/LayerStack.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber, @nyc-tron/forge/layers/ClippingMaskControls, @nyc-tron/overlays/AnchoredPopover, @nyc-tron/shell/MenuButton

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/layers/LayerStack
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { LayerStack } from "@/components/nyc-tron/ui/components/forge/layers/LayerStack";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { LayerStack } from "@nyc-tron/ui/components/forge/layers/LayerStack";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/layers/LayerStack.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | no | Document boundary. Reusing layer IDs across documents must change this scope. |
| `revision` | `string \| number` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
| `expandedIds` | `readonly string[]` | not recorded | no |  |
| `onExpandedChange` | `(ids: readonly string[]) => void` | not recorded | no |  |
| `onToggleLocked` | `(id: string) => void \| Promise<unknown>` | not recorded | no |  |
| `onReparent` | `(id: string, parentId: string \| null, toIndex: number) => void \| Promise<unknown>` | not recorded | no | Sibling insertion index after removing the moved layer. Nested stacks use this callback. |
| `layers` | `readonly LayerRow[]` | not recorded | yes | Layers top to bottom: index 0 is the topmost layer and the first row. |
| `selectedId` | `string` | not recorded | no | Id of the selected layer, or `undefined` for no selection. |
| `onSelect` | `(id: string) => void` | not recorded | yes | Called when a row is tapped or activated by a screen reader. |
| `onToggleVisible` | `(id: string) => void` | not recorded | yes | Called when the visibility control is toggled. |
| `onOpacityPreview` | `(id: string, value: number) => void` | not recorded | no | Called on every opacity change during a drag so the compositor can draw a live preview. A cancelled drag calls it once more with the original value. |
| `onOpacityCommit` | `(id: string, value: number) => void \| Promise<unknown>` | not recorded | yes | Called once per completed opacity drag or screen-reader step, never per frame. |
| `onMove` | `(id: string, toIndex: number) => void \| Promise<unknown>` | not recorded | yes | Called once when a drag or move action lands a layer on a new index (0 = top). |
| `onRename` | `(id: string, name: string) => void \| Promise<unknown>` | not recorded | yes | Called with the trimmed name when a rename is submitted. Blank or unchanged names are dropped. |
| `onRemove` | `(id: string) => void \| Promise<unknown>` | not recorded | no | Called when a row's remove button, its "Remove" screen-reader action, or Delete/Backspace on the focused row asks to delete an unlocked layer. There is no confirmation step: the host applies removal as an engine operation that its undo restores (`removeLayer` in `layer-model` applies it). The remove control renders only when this is passed. |
| `rowHeight` | `number` | `56` | no | Fixed row height in points. Values below 44 are raised to 44. |
| `label` | `string` | `"Layers"` | no | Screen-reader label for the list. |
| `emptyLabel` | `string` | `"No layers"` | no |  |
| `accentColor` | `string` | not recorded | no | Optional override; defaults to the theme's accent token. |
| `opacityControl` | `"auto" \| LayerOpacityMode` | `"auto"` | no | How rows show opacity. `auto` measures the stack and keeps the inline slider only while a whole row fits beside it (`layerRowMinWidth` in `layer-model`); narrower stacks get a percentage readout that opens a {@linkcode PrecisionScrubber} popover, so the name and the remove button never clip. `slider` and `readout` force one presentation. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/layers/LayerStack.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Name for ", "Remove ", "Show "
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "adjustable", "button", "switch"
- `accessibilityState`: set from an expression
- `accessibilityValue`: set from an expression
- `aria-disabled`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
