---
name: "InOutRangeHandles"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/timeline/InOutRangeHandles"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceSunken", "color.textMuted", "radius.2", "radius.control", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# InOutRangeHandles

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/InOutRangeHandles.tsx -->
In and out marks (D-12): Set in / Set out / Clear buttons that act at the playhead, above a 44pt band (place it right over the ruler) with the marked range filled and a draggable, keyboard-adjustable handle per mark.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/InOutRangeHandles.tsx -->
- Package: @nyc-tron/ui
- Import: `import { InOutRangeHandles } from "@nyc-tron/ui/forge/timeline/InOutRangeHandles";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/InOutRangeHandles
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/InOutRangeHandles.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `showCommands` | `boolean` | not recorded | no |  |
| `viewport` | `TimelineViewport` | not recorded | yes |  |
| `range` | `InOutRange` | not recorded | yes |  |
| `durationFrames` | `number` | not recorded | yes |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `playheadFrame` | `number` | not recorded | yes | Where Set in / Set out place a mark. |
| `onPreview` | `(range: InOutRange) => void` | not recorded | no | Drag preview of the range. |
| `onCommit` | `(range: InOutRange) => void` | not recorded | yes | One commit per handle release, key press or button. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/InOutRangeHandles.tsx -->
- `accessibilityHint`: set from an expression
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
