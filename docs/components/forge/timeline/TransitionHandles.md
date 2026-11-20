---
name: "TransitionHandles"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/TransitionHandles"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.focus", "color.surfaceRaised", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# TransitionHandles

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/TransitionHandles.tsx -->
Transitions on the timeline (D-23), placed over the lanes like `TimelinePlayhead`.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/TransitionHandles.tsx -->
- Package: @nyc-tron/ui
- Import: `import { TransitionHandles } from "@nyc-tron/ui/components/forge/timeline/TransitionHandles";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/TransitionHandles
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/TransitionHandles.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `tracks` | `readonly TimelineTrack[]` | not recorded | yes | The lanes' tracks, in lane order. |
| `transitions` | `readonly TimelineTransition[]` | not recorded | yes |  |
| `viewport` | `TimelineViewport` | not recorded | yes |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `laneHeight` | `number` | `56` | no | Match `TimelineClipLane` `laneHeight`. |
| `defaultKind` | `string` | `"cross_dissolve"` | no | Kind a quick add uses on video and overlay cuts; audio cuts always get a crossfade. |
| `defaultFrames` | `number` | `24` | no | Length a quick add asks for, clamped to what the cut allows. |
| `onAdd` | `(request: TransitionRequest) => void` | not recorded | yes |  |
| `onChange` | `(id: string, change: { durationFrames: number; durationSeconds: number; }) => void` | not recorded | yes | Once per edge release, key press or screen-reader step. |
| `onRemove` | `(id: string) => void` | not recorded | yes |  |
| `selectedCut` | `TimelineCut` | not recorded | no | The selected cut, for `TransitionPresetBrowser`. Pressing a cut calls `onSelectCut`; without it, a press adds. |
| `onSelectCut` | `(cut: TimelineCut \| undefined) => void` | not recorded | no |  |
| `selectedTransitionId` | `string` | not recorded | no |  |
| `onSelectTransition` | `(id: string \| undefined) => void` | not recorded | no |  |
| `showCutTargets` | `boolean` | `true` | no | Draws the cut targets. Hide them while trimming: they sit on the same edges as the trim handles. |
| `dropFrame` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/TransitionHandles.tsx -->
- `accessibilityHint`: "Arrow keys change the length. Delete removes it."
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "adjustable", "button"
- `accessibilityState`: set from an expression
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
