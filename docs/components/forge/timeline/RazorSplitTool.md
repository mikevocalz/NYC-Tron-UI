---
name: "RazorSplitTool"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/RazorSplitTool"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/timeline/TimelineClipLane"]
a11yStatus: "unverified"
---

# RazorSplitTool

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/RazorSplitTool.tsx -->
Razor controls (D-20): a toggle that turns clip presses in `TimelineClipLane` into splits at the pressed frame, and Split at playhead for the selected clip.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/RazorSplitTool.tsx -->
- Package: @nyc-tron/ui
- Import: `import { RazorSplitTool } from "@nyc-tron/ui/components/forge/timeline/RazorSplitTool";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/timeline/TimelineClipLane

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/RazorSplitTool
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/RazorSplitTool.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `tool` | `TimelineTool` | not recorded | yes |  |
| `onToolChange` | `(tool: TimelineTool) => void` | not recorded | yes |  |
| `tracks` | `readonly TimelineTrack[]` | not recorded | yes |  |
| `selectedClipId` | `string` | not recorded | no |  |
| `playheadFrame` | `number` | not recorded | yes |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `onEdit` | `(edit: TimelineEdit) => void` | not recorded | yes | The split, once per press. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/RazorSplitTool.tsx -->
- `accessibilityHint`: "When on, pressing a clip splits it at that point"
- `accessibilityLabel`: "Razor"
- `accessibilityRole`: "switch"
- `accessibilityState`: set from an expression
- `aria-checked`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
