---
name: "RenderQueuePanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/motion/RenderQueuePanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.danger", "color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/SegmentedControl", "@nyc-tron/Select", "@nyc-tron/TextField", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/shell/UnitInput"]
a11yStatus: "unverified"
---

# RenderQueuePanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/RenderQueuePanel.tsx -->
Encoder-neutral queue controls; no UI timer invents render progress or completion.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/RenderQueuePanel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { RenderQueuePanel } from "@nyc-tron/ui/components/forge/motion/RenderQueuePanel";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/SegmentedControl, @nyc-tron/Select, @nyc-tron/TextField, @nyc-tron/feedback/ErrorMessage, @nyc-tron/shell/UnitInput

```sh
npx shadcn@latest add @nyc-tron/forge/motion/RenderQueuePanel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/RenderQueuePanel.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes | Project identity; progress updates alone should not change this scope. |
| `value` | `MotionRenderSettings` | not recorded | yes |  |
| `jobs` | `readonly MotionRenderJob[]` | not recorded | yes |  |
| `compositions` | `readonly { readonly id: string; readonly label: string; }[]` | not recorded | yes |  |
| `formats` | `readonly MotionRenderFormat[]` | not recorded | yes |  |
| `profiles` | `readonly MotionRenderProfile[]` | not recorded | yes |  |
| `destinations` | `readonly { readonly id: string; readonly label: string; }[]` | not recorded | yes |  |
| `onChange` | `(value: MotionRenderSettings) => void` | not recorded | yes |  |
| `onEnqueue` | `(settings: MotionRenderSettings, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
| `onCancelJob` | `(id: string, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
| `onRemoveJob` | `(id: string, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
| `onReorder` | `(ids: readonly string[], signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
| `height` | `number` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/RenderQueuePanel.tsx -->
- `accessibilityLabel`: "Composition render queue"
- `accessibilityLiveRegion`: "polite"
- `aria-disabled`: set from an expression
- `aria-label`: "Render queue view"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
