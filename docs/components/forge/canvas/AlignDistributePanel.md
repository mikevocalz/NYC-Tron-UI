---
name: "AlignDistributePanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/canvas/AlignDistributePanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/SegmentedControl", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "unverified"
---

# AlignDistributePanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas/AlignDistributePanel.tsx -->
Align, distribute and arrange panel (B-25).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas/AlignDistributePanel.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/SegmentedControl, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/canvas/AlignDistributePanel
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { AlignDistributePanel } from "@/components/nyc-tron/ui/components/forge/canvas/AlignDistributePanel";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { AlignDistributePanel } from "@nyc-tron/ui/components/forge/canvas/AlignDistributePanel";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas/AlignDistributePanel.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `items` | `readonly AlignItem[]` | not recorded | yes | Selected layers, in selection order. |
| `reference` | `AlignReferenceKind` | not recorded | yes | What align buttons align against. |
| `onReferenceChange` | `(reference: AlignReferenceKind) => void` | not recorded | yes |  |
| `artboard` | `{ readonly id: string; readonly name: string; }` | not recorded | no | The artboard "Artboard" aligns to, usually the one holding the selection. Omit when there is none. |
| `onAlign` | `(command: AlignCommand, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | One `alignLayers` payload per press. |
| `distributeMode` | `DistributeMode` | not recorded | yes |  |
| `onDistributeModeChange` | `(mode: DistributeMode) => void` | not recorded | yes |  |
| `spacing` | `number \| undefined` | not recorded | yes | Fixed gap in document pixels for spacing mode; `undefined` spreads layers evenly between the outer two. |
| `onSpacingChange` | `(spacing: number \| undefined) => void` | not recorded | yes |  |
| `onDistribute` | `(command: DistributeCommand, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | One `distributeLayers` payload per press. |
| `stack` | `StackPosition` | not recorded | no | Where the single selected layer sits among its siblings (0 = bottom). Omit to leave arrange unavailable. |
| `onMoveLayer` | `(command: MoveLayerCommand, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | One `moveLayer` payload per press. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas/AlignDistributePanel.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Align", "Align and arrange", "Arrange", "Distribute"
- `accessibilityLiveRegion`: "polite"
- `accessibilityState`: set from an expression
- `aria-label`: "Align relative to", "Distribute by"
- `aria-level`: set from an expression
- `role`: "button", "group", "heading", "toolbar"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
