---
name: "DragReorderAndRipple"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/timeline/DragReorderAndRipple"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.textMuted", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/SegmentedControl", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# DragReorderAndRipple

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/DragReorderAndRipple.tsx -->
Move and ripple settings (D-22): how a dragged clip lands on others (refuse, overwrite, insert), which tracks a ripple shifts (this track or every unlocked track), and Ripple delete for the selected clip, which removes it and closes the gap as one edit.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/DragReorderAndRipple.tsx -->
- Package: @nyc-tron/ui
- Import: `import { DragReorderAndRipple } from "@nyc-tron/ui/forge/timeline/DragReorderAndRipple";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/SegmentedControl, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/DragReorderAndRipple
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/DragReorderAndRipple.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `moveMode` | `MoveMode \| undefined` | not recorded | yes | Pass the same value to `TimelineClipLane` `moveMode`. `undefined` is a strict move. |
| `onMoveModeChange` | `(mode: MoveMode \| undefined) => void` | not recorded | yes |  |
| `rippleScope` | `RippleScope` | not recorded | yes | Pass the same value to `TimelineClipLane` `rippleScope`. |
| `onRippleScopeChange` | `(scope: RippleScope) => void` | not recorded | yes |  |
| `tracks` | `readonly TimelineTrack[]` | not recorded | yes |  |
| `selectedClipId` | `string` | not recorded | no |  |
| `onEdit` | `(edit: TimelineEdit) => void` | not recorded | yes | The ripple delete, once per press. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/DragReorderAndRipple.tsx -->
- `accessibilityHint`: set from an expression
- `aria-label`: "Ripple affects", "When a moved clip meets another"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
