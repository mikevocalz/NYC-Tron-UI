---
name: "BusAndRoutingMatrix"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/BusAndRoutingMatrix"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.danger", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "opacity.0_45", "radius.1", "radius.4", "radius.card", "radius.control", "space.1.5", "space.2", "space.2.5", "space.3"]
registryDependencies: ["@nyc-tron/Select", "@nyc-tron/feedback/EmptyState", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# BusAndRoutingMatrix

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/BusAndRoutingMatrix.tsx -->
Controlled routing matrix for track outputs and post-fader sends.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/BusAndRoutingMatrix.tsx -->
- Package: @nyc-tron/ui
- Import: `import { BusAndRoutingMatrix } from "@nyc-tron/ui/forge/audio/BusAndRoutingMatrix";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Select, @nyc-tron/feedback/EmptyState, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/audio/BusAndRoutingMatrix
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/BusAndRoutingMatrix.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `sources` | `readonly RoutingSource[]` | not recorded | yes | Committed routing of each source track, in display order. |
| `ioBindings` | `readonly { sourceId: RouteId; inputId: string \| null; sidechainId: string \| null; inputs: readonly { id: string; label: string; }[]; sidechains: readonly { id: string; label: string; }[]; }[]` | not recorded | no |  |
| `onInputCommit` | `(sourceId: RouteId, inputId: string \| null) => void \| Promise<unknown>` | not recorded | no |  |
| `onSidechainCommit` | `(sourceId: RouteId, source: string \| null) => void \| Promise<unknown>` | not recorded | no |  |
| `buses` | `readonly RoutingBus[]` | not recorded | yes | Buses that sources can output or send to. Buses feed the master only. |
| `onOutputCommit` | `(sourceId: RouteId, busId: RouteId \| null) => void \| Promise<unknown>` | not recorded | yes | Once per press or arrow key with the requested main output, `null` for the master. The matrix keeps showing `sources` until the app passes new ones, so a rejected promise leaves the old routing on screen. |
| `onSendCommit` | `(sourceId: RouteId, busId: RouteId, level: number) => void \| Promise<unknown>` | not recorded | yes | Once per finished drag, key press or screen-reader step with the new send level (0..1), and once with {@linkcode DEFAULT_SEND_LEVEL} when a send is added. Not called when the level is unchanged. |
| `onSendRemove` | `(sourceId: RouteId, busId: RouteId) => void \| Promise<unknown>` | not recorded | yes | Once per press of a send's remove button or Delete on its slider. |
| `onSendChange` | `(sourceId: RouteId, busId: RouteId, level: number) => void` | not recorded | no | Live send level while a drag is in progress; never persist it. |
| `emptyAction` | `EmptyStateExit` | not recorded | no | The way out when there are no buses, e.g. "Add bus". |
| `disabled` | `boolean` | `false` | no |  |
| `label` | `string` | `"Routing"` | no | Accessible name of the matrix region. |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no | Drop the default token recipe; supply a full app recipe via `className`. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/BusAndRoutingMatrix.tsx -->
- `accessibilityLabel`: "Add ", "Remove "
- `accessibilityRole`: "adjustable"
- `accessibilityState`: set from an expression
- `aria-checked`: set from an expression
- `role`: "button", "group", "heading", "radio", "radiogroup"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
