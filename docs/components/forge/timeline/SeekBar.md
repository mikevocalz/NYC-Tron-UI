---
name: "SeekBar"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/timeline/SeekBar"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "opacity.0_45", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# SeekBar

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/SeekBar.tsx -->
Seek track with played and buffered ranges (D-04).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/SeekBar.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SeekBar } from "@nyc-tron/ui/forge/timeline/SeekBar";`
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/SeekBar
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/SeekBar.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `frame` | `number` | not recorded | yes | The player's reported frame. |
| `durationFrames` | `number` | not recorded | yes |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `buffered` | `readonly FrameRange[]` | not recorded | no | Decoded or downloaded ranges, drawn behind the played range. |
| `onScrub` | `(frame: number) => void` | not recorded | no | Drag preview: show this frame, request a fast seek if the player can. |
| `onSeek` | `(frame: number) => void` | not recorded | yes | Once per release, key press or screen-reader step: the exact seek. |
| `dropFrame` | `boolean` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
| `label` | `string` | `"Playback position"` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/SeekBar.tsx -->
- `accessibilityHint`: "Drag to scrub. Arrow keys step one frame, Page Up and Page Down one second."
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "adjustable"
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
