---
name: "ExportMonitor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/ExportMonitor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Select", "@nyc-tron/forge/inputs/PrecisionScrubber", "@nyc-tron/forge/motion/RenderQueuePanel"]
a11yStatus: "unverified"
---

# ExportMonitor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/ExportMonitor.tsx -->
Encoder-specific geometry wraps the shared preset/frame-rate/progress queue owner.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/ExportMonitor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ExportMonitor } from "@nyc-tron/ui/components/forge/timeline/ExportMonitor";`
- Peers: react, react-native
- Requires: @nyc-tron/Select, @nyc-tron/forge/inputs/PrecisionScrubber, @nyc-tron/forge/motion/RenderQueuePanel

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/ExportMonitor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/ExportMonitor.tsx -->
Extends: `Omit<RenderQueuePanelProps, 'onEnqueue'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `revision` | `string \| number` | not recorded | no |  |
| `output` | `VideoExportOutput` | not recorded | yes |  |
| `codecs` | `readonly VideoExportCodec[]` | not recorded | yes |  |
| `onOutputChange` | `(output: VideoExportOutput) => void` | not recorded | yes |  |
| `onEnqueue` | `(settings: RenderQueuePanelProps['value'], output: VideoExportOutput, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/ExportMonitor.tsx -->
- `accessibilityLabel`: "Video export monitor"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
