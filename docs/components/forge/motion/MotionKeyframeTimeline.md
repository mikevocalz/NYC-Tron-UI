---
name: "MotionKeyframeTimeline"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/motion/MotionKeyframeTimeline"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.danger", "color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/SegmentedControl", "@nyc-tron/shell/UnitInput"]
a11yStatus: "unverified"
---

# MotionKeyframeTimeline

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/MotionKeyframeTimeline.tsx -->
Virtualized property lanes and full key list share one controlled selection.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/MotionKeyframeTimeline.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/SegmentedControl, @nyc-tron/shell/UnitInput

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/motion/MotionKeyframeTimeline
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { MotionKeyframeTimeline } from "@/components/nyc-tron/ui/components/forge/motion/MotionKeyframeTimeline";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { MotionKeyframeTimeline } from "@nyc-tron/ui/components/forge/motion/MotionKeyframeTimeline";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/MotionKeyframeTimeline.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes |  |
| `revision` | `string` | not recorded | yes |  |
| `curves` | `readonly MotionPropertyCurve[]` | not recorded | yes |  |
| `duration` | `number` | not recorded | yes |  |
| `selection` | `readonly MotionKeySelection[]` | not recorded | yes |  |
| `onSelectionChange` | `(selection: readonly MotionKeySelection[]) => void` | not recorded | yes |  |
| `onCommit` | `(curves: readonly MotionPropertyCurve[], selection: readonly MotionKeySelection[]) => void` | not recorded | yes |  |
| `onPreview` | `(curves: readonly MotionPropertyCurve[] \| undefined) => void` | not recorded | no |  |
| `viewRange` | `readonly [ number, number ]` | not recorded | yes |  |
| `onViewRangeChange` | `(range: readonly [ number, number ]) => void` | not recorded | yes |  |
| `playhead` | `number` | not recorded | yes |  |
| `onPlayheadChange` | `(time: number) => void` | not recorded | yes |  |
| `frameRate` | `FrameRate` | not recorded | yes |  |
| `snapToFrames` | `boolean` | not recorded | yes |  |
| `onSnapChange` | `(enabled: boolean) => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/MotionKeyframeTimeline.tsx -->
- `accessibilityLabel`: "All property keyframes", "Motion property lanes"
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "checkbox"
- `accessibilityState`: set from an expression
- `aria-checked`: set from an expression
- `aria-label`: "Keyframe timeline view"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
