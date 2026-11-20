---
name: "TimelinePlayhead"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/TimelinePlayhead"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.focus", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# TimelinePlayhead

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/TimelinePlayhead.tsx -->
The playhead (D-11): a line across the ruler and every lane at `frame`, with a 44pt head that drags to scrub.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/TimelinePlayhead.tsx -->
- Package: @nyc-tron/ui
- Import: `import { TimelinePlayhead } from "@nyc-tron/ui/components/forge/timeline/TimelinePlayhead";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/TimelinePlayhead
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/TimelinePlayhead.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `viewport` | `TimelineViewport` | not recorded | yes |  |
| `frame` | `number` | not recorded | yes | The player's reported frame; the line follows it during playback. |
| `durationFrames` | `number` | not recorded | yes |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `height` | `number` | not recorded | yes | Height of the line: the ruler plus every lane it crosses. |
| `onScrub` | `(frame: number) => void` | not recorded | no |  |
| `onSeek` | `(frame: number) => void` | not recorded | yes | Once per drag release, key press or screen-reader step. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/TimelinePlayhead.tsx -->
- `accessibilityHint`: "Drag to scrub. Arrow keys step one frame, Page Up and Page Down one second."
- `accessibilityLabel`: "Playhead"
- `accessibilityRole`: "adjustable"
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
