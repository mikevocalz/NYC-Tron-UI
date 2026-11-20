---
name: "AutomationLane"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/AutomationLane"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/audio/AutomationModePicker"]
a11yStatus: "unverified"
---

# AutomationLane

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/AutomationLane.tsx -->
Controlled automation lane for one track parameter.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/AutomationLane.tsx -->
- Package: @nyc-tron/ui
- Import: `import { AutomationLane } from "@nyc-tron/ui/components/forge/audio/AutomationLane";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/audio/AutomationModePicker

```sh
npx shadcn@latest add @nyc-tron/forge/audio/AutomationLane
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/AutomationLane.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `param` | `AutomationParam` | not recorded | yes | Which lane this is: linear gain 0..1 or pan -1..1. Sets the scale and readouts. |
| `points` | `readonly AutomationPoint[]` | not recorded | yes | Committed points from the engine, sorted by `ticks`, at most one per tick. |
| `mode` | `AutomationMode` | not recorded | yes | Committed lane mode. Set it with {@linkcode AutomationModePicker}. |
| `lengthTicks` | `number` | not recorded | yes | Timeline length the lane covers, ticks. |
| `pixelsPerTick` | `number` | `0.1` | no | Horizontal scale; match the arrangement or piano roll above. |
| `scrollX` | `number` | not recorded | no | Follow another view's horizontal scroll (for example a timeline's `onScrollX`). When omitted the lane scrolls on its own. |
| `height` | `number` | `160` | no | Lane drawing height, points (the header and footer add to it). |
| `snapTicks` | `number` | `240` | no | Time grid for adding, dragging and Left/Right steps. |
| `ppq` | `number` | `960` | no |  |
| `beatsPerBar` | `number` | `4` | no | For bar lines and the "Bar 2 beat 1" readout. |
| `selectedIndex` | `number` | not recorded | no |  |
| `onSelect` | `(index: number) => void` | not recorded | no |  |
| `cursorTicks` | `number` | `0` | no | Where the "Add point" button adds, ticks (for example the playhead). |
| `onPointAdd` | `(ticks: number, value: number, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Once per tap on empty lane area or "Add point" press. Never called for a tick that already has a point (the engine rejects duplicates). |
| `onPointMove` | `(index: number, ticks: number, value: number, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Once per finished drag or key step. `ticks` is always strictly between the neighbours, so the index never changes. A rejected promise leaves the committed point on screen. |
| `onPointRemove` | `(index: number, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Delete/Backspace on a focused point, or the screen-reader "Delete point" action. |
| `disabled` | `boolean` | `false` | no |  |
| `label` | `string` | not recorded | yes | Visible title and accessible name, e.g. `"Vocal volume automation"`. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/AutomationLane.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Add point at "
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "adjustable", "button"
- `accessibilityState`: set from an expression
- `role`: "group"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
