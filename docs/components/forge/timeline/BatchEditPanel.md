---
name: "BatchEditPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/BatchEditPanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/TextField", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# BatchEditPanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/BatchEditPanel.tsx -->
Edits for several clips at once (D-41): shift by a number of frames, set speed (the clip speed control the timeline core left out), remove, and ripple delete.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/BatchEditPanel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { BatchEditPanel } from "@nyc-tron/ui/components/forge/timeline/BatchEditPanel";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/TextField, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/BatchEditPanel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/BatchEditPanel.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `tracks` | `readonly TimelineTrack[]` | not recorded | yes |  |
| `selectedClipIds` | `readonly string[]` | not recorded | yes | The host's multi-selection (`TimelineClipLane` `selectedClipIds`). |
| `rate` | `FrameRate` | not recorded | yes |  |
| `rippleScope` | `RippleScope` | `"track"` | no | Scope for Ripple delete. |
| `onApply` | `(edits: readonly BatchEdit[]) => void` | not recorded | yes | The whole batch, once per action. Send it to the engine as one transaction (Splice `batch {ops}`): it applies all or nothing and undoes as one step. |
| `onClearSelection` | `() => void` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/BatchEditPanel.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLiveRegion`: "polite"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
