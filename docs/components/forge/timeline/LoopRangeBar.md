---
name: "LoopRangeBar"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/timeline/LoopRangeBar"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["border.3", "color.border", "color.focus", "color.info", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "opacity.0_4", "radius.control", "space.2", "space.2.5"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# LoopRangeBar

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/LoopRangeBar.tsx -->
The playback loop (D-13): a Loop switch for the player, "Loop marked range" to take the in/out marks, Clear, and a 44pt band (place it over the ruler) with the loop filled and a draggable, keyboard-adjustable bracket at each end.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/LoopRangeBar.tsx -->
- Package: @nyc-tron/ui
- Import: `import { LoopRangeBar } from "@nyc-tron/ui/forge/timeline/LoopRangeBar";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/LoopRangeBar
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/LoopRangeBar.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `viewport` | `TimelineViewport` | not recorded | yes |  |
| `range` | `LoopRange \| undefined` | not recorded | yes | The stored loop (Splice `setLoopRange`), or none. |
| `durationFrames` | `number` | not recorded | yes |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `looping` | `boolean` | not recorded | yes | Whether the player loops: player state, separate from the stored range. |
| `onLoopingChange` | `(looping: boolean) => void` | not recorded | yes |  |
| `marks` | `InOutRange` | not recorded | no | The in/out marks, for "Loop marked range". |
| `onPreview` | `(range: LoopRange) => void` | not recorded | no | Drag preview of the range. |
| `onCommit` | `(range: LoopCommit \| undefined) => void` | not recorded | yes | One commit per handle release, key press or button; `undefined` clears the loop (`clearLoopRange`). |
| `dropFrame` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/LoopRangeBar.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Loop playback", "Loop range"
- `accessibilityRole`: "adjustable", "switch"
- `accessibilityState`: set from an expression
- `aria-checked`: set from an expression
- `aria-disabled`: set from an expression
- `aria-valuemax`: set from an expression
- `aria-valuemin`: set from an expression
- `aria-valuenow`: set from an expression
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
