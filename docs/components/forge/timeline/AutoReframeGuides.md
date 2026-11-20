---
name: "AutoReframeGuides"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/AutoReframeGuides"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/canvas/GuidedCropAndStraighten"]
a11yStatus: "unverified"
---

# AutoReframeGuides

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/AutoReframeGuides.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/AutoReframeGuides.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/canvas/GuidedCropAndStraighten

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/AutoReframeGuides
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { AutoReframeGuides } from "@/components/nyc-tron/ui/components/forge/timeline/AutoReframeGuides";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { AutoReframeGuides } from "@nyc-tron/ui/components/forge/timeline/AutoReframeGuides";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/AutoReframeGuides.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `frame` | `number` | not recorded | yes |  |
| `manual` | `boolean` | not recorded | yes |  |
| `onManualChange` | `(manual: boolean) => void` | not recorded | yes |  |
| `crop` | `Omit<GuidedCropAndStraightenProps, 'scope' \| 'revision' \| 'disabledReason'>` | not recorded | yes |  |
| `tracking` | `{ status: 'idle' \| 'running' \| 'ready' \| 'lost' \| 'error'; subjectLabel?: string; progress?: number; error?: string; }` | not recorded | yes |  |
| `onTrack` | `(frame: number, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onStop` | `() => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/AutoReframeGuides.tsx -->
- `accessibilityLabel`: "Automatic reframing"
- `accessibilityLiveRegion`: "polite"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
