---
name: "NoiseReductionMonitor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/NoiseReductionMonitor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/forge/audio/AudioProcessingPanel"]
a11yStatus: "unverified"
---

# NoiseReductionMonitor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/NoiseReductionMonitor.tsx -->
Original/cleaned audition with actual host measurements and reversible processing.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/NoiseReductionMonitor.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/forge/audio/AudioProcessingPanel

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/NoiseReductionMonitor
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { NoiseReductionMonitor } from "@/components/nyc-tron/ui/components/forge/audio/NoiseReductionMonitor";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { NoiseReductionMonitor } from "@nyc-tron/ui/components/forge/audio/NoiseReductionMonitor";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/NoiseReductionMonitor.tsx -->
Extends: `Omit<AudioProcessingPanelProps, 'label' | 'parameters' | 'onParameter'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `reductionDb` | `number` | not recorded | yes |  |
| `sensitivity` | `number` | not recorded | yes |  |
| `onSettingsCommit` | `(value: { reductionDb: number; sensitivity: number; }, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/NoiseReductionMonitor.tsx -->
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
