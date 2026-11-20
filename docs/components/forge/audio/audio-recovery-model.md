---
name: "AudioRecoveryModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/audio-recovery-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# AudioRecoveryModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/audio-recovery-model.ts -->
Why the host paused or recovered audio.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/audio-recovery-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/audio-recovery-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { recoveryMessage, recoveryTitle } from "@/components/nyc-tron/ui/components/forge/audio/audio-recovery-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { recoveryMessage, recoveryTitle } from "@nyc-tron/ui/components/forge/audio/audio-recovery-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/audio-recovery-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `AudioRecoveryNotice` | type | `type AudioRecoveryNotice = { readonly kind: 'paused'; readonly reason: 'interruption' \| 'output-lost'; readonly ready: boolean; } \| { readonly kind: 'reset';...` |
| `recoveryMessage` | function | `function recoveryMessage(notice: AudioRecoveryNotice): string;` |
| `recoveryTitle` | function | `function recoveryTitle(notice: AudioRecoveryNotice): string;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/audio-recovery-model.ts -->
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
