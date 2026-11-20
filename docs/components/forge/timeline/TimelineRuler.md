---
name: "TimelineRuler"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/TimelineRuler"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.surfaceSunken", "color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# TimelineRuler

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/TimelineRuler.tsx -->
Time ruler (D-10): labeled ticks that switch between frames, seconds and minutes as you zoom, plus named marks.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/TimelineRuler.tsx -->
- Package: @nyc-tron/ui
- Import: `import { TimelineRuler } from "@nyc-tron/ui/components/forge/timeline/TimelineRuler";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/TimelineRuler
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/TimelineRuler.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `viewport` | `TimelineViewport` | not recorded | yes |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `durationFrames` | `number` | not recorded | yes |  |
| `marks` | `readonly TimelineMark[]` | not recorded | no | Named marks drawn as flags. |
| `frame` | `number` | not recorded | yes | The committed playhead frame, the start of a ruler drag. |
| `onScrub` | `(frame: number) => void` | not recorded | no |  |
| `onSeek` | `(frame: number) => void` | not recorded | yes | Once per press-and-release on the ruler. |
| `minLabelPx` | `number` | `72` | no | Minimum space between labels in layout units. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/TimelineRuler.tsx -->
_Not documented._
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
