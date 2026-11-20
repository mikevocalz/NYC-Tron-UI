---
name: "RAWDevelopPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/photo/RAWDevelopPanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/photo/EightBandColorMixer", "@nyc-tron/forge/photo/ExposureAndWhiteBalance", "@nyc-tron/forge/photo/LensCorrectionPanel", "@nyc-tron/forge/photo/ToneAndPresence"]
a11yStatus: "unverified"
---

# RAWDevelopPanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/RAWDevelopPanel.tsx -->
Composes non-destructive RAW settings; does not decode RAW or simulate an image transform.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/RAWDevelopPanel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { RAWDevelopPanel } from "@nyc-tron/ui/components/forge/photo/RAWDevelopPanel";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/photo/EightBandColorMixer, @nyc-tron/forge/photo/ExposureAndWhiteBalance, @nyc-tron/forge/photo/LensCorrectionPanel, @nyc-tron/forge/photo/ToneAndPresence

```sh
npx shadcn@latest add @nyc-tron/forge/photo/RAWDevelopPanel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/RAWDevelopPanel.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `photoId` | `string` | not recorded | yes |  |
| `revision` | `string \| number` | not recorded | yes |  |
| `value` | `PhotoDevelopSettings` | not recorded | yes |  |
| `defaults` | `PhotoDevelopSettings` | not recorded | yes | Camera/engine-specific defaults, not assumed to be a universal RAW white balance. |
| `baseline` | `PhotoDevelopSettings` | not recorded | yes | Settings at the beginning of the host's edit session. Original pixels never change. |
| `profiles` | `readonly LensProfile[]` | not recorded | yes |  |
| `onCommit` | `(settings: PhotoDevelopSettings) => void` | not recorded | yes |  |
| `onCopy` | `(payload: string, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
| `onPaste` | `(signal: AbortSignal) => string \| Promise<string>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/RAWDevelopPanel.tsx -->
_Not documented._
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
