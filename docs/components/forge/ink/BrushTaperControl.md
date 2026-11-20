---
name: "BrushTaperControl"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/ink/BrushTaperControl"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/SegmentedControl", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "unverified"
---

# BrushTaperControl

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/ink/BrushTaperControl.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/ink/BrushTaperControl.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/SegmentedControl, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/ink/BrushTaperControl
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { BrushTaperControl } from "@/components/nyc-tron/ui/components/forge/ink/BrushTaperControl";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { BrushTaperControl } from "@nyc-tron/ui/components/forge/ink/BrushTaperControl";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/ink/BrushTaperControl.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `BrushTaperSettings` | not recorded | yes |  |
| `input` | `'pen' \| 'touch'` | not recorded | yes |  |
| `onInputChange` | `(input: 'pen' \| 'touch') => void` | not recorded | yes |  |
| `onCommit` | `(settings: BrushTaperSettings, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `pressureAvailable` | `boolean` | not recorded | yes | Whether the active pen/touch adapter supplies pressure, rather than simulated force. |
| `renderTestStroke` | `(settings: BrushTaper, input: 'pen' \| 'touch') => ReactNode` | not recorded | yes | Host brush renderer's live test pad, using the requested input settings. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/ink/BrushTaperControl.tsx -->
- `accessibilityLabel`: "Brush taper"
- `accessibilityLiveRegion`: "polite"
- `aria-label`: "Taper input", "Tip shape"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
