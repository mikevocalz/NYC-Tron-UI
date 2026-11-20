---
name: "TimelineZoomAndScroll"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/TimelineZoomAndScroll"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceSunken", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# TimelineZoomAndScroll

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/TimelineZoomAndScroll.tsx -->
Zoom and scroll controls (D-14): zoom out/in around the playhead (or the view's center when the playhead is off screen), fit selection, fit all, and a mini-map of the whole timeline whose window drags to scroll; pressing elsewhere on it centers the view there.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/TimelineZoomAndScroll.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/TimelineZoomAndScroll
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { TimelineZoomAndScroll } from "@/components/nyc-tron/ui/components/forge/timeline/TimelineZoomAndScroll";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { TimelineZoomAndScroll } from "@nyc-tron/ui/components/forge/timeline/TimelineZoomAndScroll";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/TimelineZoomAndScroll.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `viewport` | `TimelineViewport` | not recorded | yes |  |
| `onViewportChange` | `(viewport: TimelineViewport) => void` | not recorded | yes | View state, not an edit: called on every zoom step and mini-map move. |
| `durationFrames` | `number` | not recorded | yes |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `playheadFrame` | `number` | not recorded | yes | Zoom buttons keep this frame fixed when it is on screen. |
| `selection` | `FrameRange` | not recorded | no | Fit selection zooms to it; the button is disabled without one. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/TimelineZoomAndScroll.tsx -->
- `accessibilityHint`: "Drag the window or use the arrow keys to scroll"
- `accessibilityLabel`: "Timeline scroll position"
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
