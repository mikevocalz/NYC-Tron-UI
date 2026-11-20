---
name: "ModeEdgeHandles"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/ModeEdgeHandles"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.focus", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# ModeEdgeHandles

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/ModeEdgeHandles.tsx -->
Edge handles for the roll and ripple tools (D-21) on the selected clip.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/ModeEdgeHandles.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/ModeEdgeHandles
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ModeEdgeHandles } from "@/components/nyc-tron/ui/components/forge/timeline/ModeEdgeHandles";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ModeEdgeHandles } from "@nyc-tron/ui/components/forge/timeline/ModeEdgeHandles";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/ModeEdgeHandles.tsx -->
| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `mode` | `"roll" \| "ripple"` | not recorded | yes |  |
| `clip` | `TimelineClip` | not recorded | yes |  |
| `track` | `TimelineTrack` | not recorded | yes |  |
| `tracks` | `readonly TimelineTrack[]` | not recorded | yes |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `pxPerFrame` | `number` | not recorded | yes |  |
| `height` | `number` | not recorded | yes |  |
| `scope` | `RippleScope` | not recorded | yes |  |
| `onPreview` | `(preview: TrimModePreview \| undefined) => void` | not recorded | yes |  |
| `onEdit` | `(edit: TimelineEdit) => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/ModeEdgeHandles.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "adjustable"
- `aria-disabled`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
