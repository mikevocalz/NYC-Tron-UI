---
name: "VideoEffectsBrowser"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/VideoEffectsBrowser"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber", "@nyc-tron/forge/motion/EffectStackAndInspector"]
a11yStatus: "unverified"
---

# VideoEffectsBrowser

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/VideoEffectsBrowser.tsx -->
Reuses the schema-driven effect owner; actual video/body-effect rendering stays with the host.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/VideoEffectsBrowser.tsx -->
- Package: @nyc-tron/ui
- Import: `import { VideoEffectsBrowser } from "@nyc-tron/ui/components/forge/timeline/VideoEffectsBrowser";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber, @nyc-tron/forge/motion/EffectStackAndInspector

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/VideoEffectsBrowser
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/VideoEffectsBrowser.tsx -->
Extends: `EffectStackAndInspectorProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `clipId` | `string` | not recorded | yes |  |
| `preview` | `ReactNode` | not recorded | yes |  |
| `appearance` | `{ intensity: number; maskId: string \| null; }` | not recorded | yes |  |
| `masks` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `onAppearanceChange` | `(value: { intensity: number; maskId: string \| null; }, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/VideoEffectsBrowser.tsx -->
- `accessibilityLabel`: "Video effects"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
