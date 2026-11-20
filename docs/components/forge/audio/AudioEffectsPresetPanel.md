---
name: "AudioEffectsPresetPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/AudioEffectsPresetPanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/motion/EffectStackAndInspector"]
a11yStatus: "unverified"
---

# AudioEffectsPresetPanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/AudioEffectsPresetPanel.tsx -->
Audio-specific lifecycle around the shared parameter/preset/effect-stack owner.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/AudioEffectsPresetPanel.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/motion/EffectStackAndInspector

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/AudioEffectsPresetPanel
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { AudioEffectsPresetPanel } from "@/components/nyc-tron/ui/components/forge/audio/AudioEffectsPresetPanel";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { AudioEffectsPresetPanel } from "@nyc-tron/ui/components/forge/audio/AudioEffectsPresetPanel";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/AudioEffectsPresetPanel.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `stack` | `Omit<EffectStackAndInspectorProps, 'scope' \| 'revision' \| 'disabled' \| 'unstyled'>` | not recorded | yes |  |
| `bypassed` | `boolean` | not recorded | yes |  |
| `previewStatus` | `'idle' \| 'rendering' \| 'ready' \| 'error'` | not recorded | yes |  |
| `previewError` | `string` | not recorded | no |  |
| `onRenderPreview` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCancelPreview` | `() => void` | not recorded | yes |  |
| `onAuditionPreview` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onBypassCommit` | `(bypassed: boolean, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/AudioEffectsPresetPanel.tsx -->
- `accessibilityLabel`: "Audio effects and presets"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
