---
name: "GuidedCropAndStraighten"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/canvas/GuidedCropAndStraighten"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/SegmentedControl", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/graphics/ImageCropOverlay", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "unverified"
---

# GuidedCropAndStraighten

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas/GuidedCropAndStraighten.tsx -->
Controlled crop geometry and straightening.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas/GuidedCropAndStraighten.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/SegmentedControl, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/graphics/ImageCropOverlay, @nyc-tron/forge/inputs/PrecisionScrubber

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/canvas/GuidedCropAndStraighten
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { GuidedCropAndStraighten } from "@/components/nyc-tron/ui/components/forge/canvas/GuidedCropAndStraighten";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { GuidedCropAndStraighten } from "@nyc-tron/ui/components/forge/canvas/GuidedCropAndStraighten";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas/GuidedCropAndStraighten.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `GuidedCropValue` | not recorded | yes |  |
| `imageWidth` | `number` | not recorded | yes |  |
| `imageHeight` | `number` | not recorded | yes |  |
| `width` | `number` | not recorded | yes |  |
| `height` | `number` | not recorded | yes |  |
| `onPreview` | `(value: GuidedCropValue \| undefined) => void` | not recorded | no |  |
| `onCommit` | `(value: GuidedCropValue, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `children` | `ReactNode` | not recorded | yes | Render the image in the host's existing renderer using the requested angle. |
| `grid` | `'thirds' \| 'center' \| 'none'` | not recorded | no |  |
| `onGridChange` | `(grid: 'thirds' \| 'center' \| 'none') => void` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas/GuidedCropAndStraighten.tsx -->
- `accessibilityLabel`: "Crop and straighten"
- `accessibilityLiveRegion`: "polite"
- `aria-label`: "Crop guides", "Crop ratio"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
