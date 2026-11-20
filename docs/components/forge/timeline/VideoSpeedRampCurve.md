---
name: "VideoSpeedRampCurve"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/VideoSpeedRampCurve"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# VideoSpeedRampCurve

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/VideoSpeedRampCurve.tsx -->
Edit speed itself, not its derivative.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/VideoSpeedRampCurve.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/VideoSpeedRampCurve
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { VideoSpeedRampCurve } from "@/components/nyc-tron/ui/components/forge/timeline/VideoSpeedRampCurve";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { VideoSpeedRampCurve } from "@nyc-tron/ui/components/forge/timeline/VideoSpeedRampCurve";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/VideoSpeedRampCurve.tsx -->
Extends: `Omit<MotionCurveEditorProps, 'mode' | 'valueLabel' | 'onCommit'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `clipId` | `string` | not recorded | yes |  |
| `allowReverse` | `boolean` | not recorded | no |  |
| `allowFreeze` | `boolean` | not recorded | no |  |
| `estimatedSourceDurationSeconds` | `number` | not recorded | no |  |
| `onCommit` | `(...args: [ ...Parameters<MotionCurveEditorProps['onCommit']>, signal?: AbortSignal ]) => void \| Promise<unknown>` | not recorded | yes |  |
| `canUndo` | `boolean` | not recorded | yes |  |
| `onUndo` | `(signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/VideoSpeedRampCurve.tsx -->
- `accessibilityLabel`: "Video speed ramp"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
