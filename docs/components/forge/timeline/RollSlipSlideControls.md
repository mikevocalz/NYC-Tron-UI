---
name: "RollSlipSlideControls"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/RollSlipSlideControls"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.textMuted"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/SegmentedControl", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/timeline/TimelineClipLane"]
a11yStatus: "unverified"
---

# RollSlipSlideControls

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/RollSlipSlideControls.tsx -->
Trim tools (D-21): a picker for select, slip, slide, roll and ripple, which sets `tool` on `TimelineClipLane` for drag editing, and nudge buttons (one and ten frames each way) that apply the chosen tool to the selected clip, which is the keyboard and screen-reader path.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/RollSlipSlideControls.tsx -->
- Package: @nyc-tron/ui
- Import: `import { RollSlipSlideControls } from "@nyc-tron/ui/components/forge/timeline/RollSlipSlideControls";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/SegmentedControl, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/timeline/TimelineClipLane

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/RollSlipSlideControls
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/RollSlipSlideControls.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `tool` | `TimelineTool` | not recorded | yes |  |
| `onToolChange` | `(tool: TimelineTool) => void` | not recorded | yes |  |
| `tracks` | `readonly TimelineTrack[]` | not recorded | yes |  |
| `selectedClipId` | `string` | not recorded | no |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `rippleScope` | `RippleScope` | `"track"` | no | Ripple scope for the ripple tool. |
| `onEdit` | `(edit: TimelineEdit) => void` | not recorded | yes | One edit per nudge press. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/RollSlipSlideControls.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: set from an expression
- `aria-label`: "Edge", "Trim tool"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
