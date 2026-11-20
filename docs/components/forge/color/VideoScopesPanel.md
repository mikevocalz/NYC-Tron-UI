---
name: "VideoScopesPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/VideoScopesPanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.primary", "color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/SegmentedControl", "@nyc-tron/forge/color/LiveHistogram"]
a11yStatus: "unverified"
---

# VideoScopesPanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/VideoScopesPanel.tsx -->
Renders actual decoded measurements with bounded density pooling; no synthetic scope signal.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/VideoScopesPanel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { VideoScopesPanel } from "@nyc-tron/ui/components/forge/color/VideoScopesPanel";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/SegmentedControl, @nyc-tron/forge/color/LiveHistogram

```sh
npx shadcn@latest add @nyc-tron/forge/color/VideoScopesPanel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/VideoScopesPanel.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `frameTimeUs` | `number \| null` | not recorded | yes |  |
| `mode` | `'histogram' \| 'waveform' \| 'vectorscope' \| 'rgb-parade'` | not recorded | yes |  |
| `onModeChange` | `(mode: VideoScopesPanelProps['mode']) => void` | not recorded | yes |  |
| `histogram` | `LiveHistogramProps['channels']` | not recorded | yes |  |
| `domain` | `readonly [ number, number ]` | not recorded | yes |  |
| `waveform` | `readonly ScopeSample[]` | not recorded | yes |  |
| `vectorscope` | `readonly ScopeSample[]` | not recorded | yes |  |
| `parade` | `readonly { readonly id: 'red' \| 'green' \| 'blue'; readonly samples: readonly ScopeSample[]; }[]` | not recorded | no | Three engine-provided RGB channel scopes on the same decoded frame. |
| `height` | `number` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/VideoScopesPanel.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `aria-label`: "Video scope"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
