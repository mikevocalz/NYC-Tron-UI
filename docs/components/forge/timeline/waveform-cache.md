---
name: "WaveformCacheModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/waveform-cache"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# WaveformCacheModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/waveform-cache.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/waveform-cache.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/waveform-cache
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { createWaveformCache, mediaProviderId, sharedWaveformCache } from "@/components/nyc-tron/ui/components/forge/timeline/waveform-cache";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { createWaveformCache, mediaProviderId, sharedWaveformCache } from "@nyc-tron/ui/components/forge/timeline/waveform-cache";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/waveform-cache.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `WaveformResource` | type | `type WaveformResource = { kind: 'idle'; } \| { kind: 'loading'; } \| { kind: 'ready'; peaks: readonly WaveformPeak[]; } \| { kind: 'error'; message: string; };` |
| `createWaveformCache` | function | `function createWaveformCache(): { store: import("zustand").StoreApi<{ version: number; }>; get: (key: string) => WaveformResource; retain(key: string): () =>...` |
| `mediaProviderId` | function | `function mediaProviderId(loader: Function): number;` |
| `sharedWaveformCache` | const | `const sharedWaveformCache: { store: import("zustand").StoreApi<{ version: number; }>; get: (key: string) => WaveformResource; retain(key: string): () => void...` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/waveform-cache.ts -->
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
