---
name: "GestureCustomizationPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/canvas-tools/GestureCustomizationPanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.danger", "color.surfaceRaised", "color.text", "color.textMuted", "radius.card"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "unverified"
---

# GestureCustomizationPanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas-tools/GestureCustomizationPanel.tsx -->
Gesture customisation (B-34): one row per quick action with a gesture menu, a hold delay for held gestures, Reset to defaults, Cancel and Save.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas-tools/GestureCustomizationPanel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { GestureCustomizationPanel } from "@nyc-tron/ui/components/forge/canvas-tools/GestureCustomizationPanel";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber

```sh
npx shadcn@latest add @nyc-tron/forge/canvas-tools/GestureCustomizationPanel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas-tools/GestureCustomizationPanel.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `gestures` | `readonly GestureDefinition[]` | not recorded | yes | Gestures this device can recognise, in menu order. |
| `actions` | `readonly QuickActionDefinition[]` | not recorded | yes | Quick actions, one row each. |
| `value` | `GestureMap` | not recorded | yes | The saved mapping. Edits stay in a draft until Save. |
| `defaults` | `GestureMap` | not recorded | yes | What "Reset to defaults" restores into the draft. |
| `onSave` | `(map: GestureMap, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Save with no conflicts and at least one change. One call per press. |
| `onCancel` | `() => void` | not recorded | yes | Cancel: the draft is dropped. The host closes the panel. |
| `label` | `string` | `"Gesture controls"` | no |  |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas-tools/GestureCustomizationPanel.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `aria-label`: set from an expression
- `aria-level`: set from an expression
- `aria-live`: "polite"
- `role`: "group", "heading"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
