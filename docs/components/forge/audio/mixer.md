---
name: "MixerModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/mixer"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# MixerModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/mixer.ts -->
Mixer state helpers for {@linkcode MixingConsole} and {@linkcode SoloMuteButtons}.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/mixer.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/mixer
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { audibility, describeAudibility } from "@/components/nyc-tron/ui/components/forge/audio/mixer";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { audibility, describeAudibility } from "@nyc-tron/ui/components/forge/audio/mixer";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/mixer.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `Audibility` | type | `type Audibility = "audible" \| "muted" \| "silenced-by-solo";` |
| `AudibilityDetails` | interface | `interface AudibilityDetails { readonly kind?: "track" \| "bus"; readonly soloSafe?: boolean; readonly group?: string; }` |
| `AudibilityInput` | type | `type AudibilityInput = Pick<MixerChannel, "muted" \| "solo"> & Partial<Pick<MixerChannel, "id" \| "kind" \| "soloSafe" \| "output" \| "sends">>;` |
| `MixerChannel` | interface | `interface MixerChannel { readonly id: ChannelId; readonly name: string; readonly gain: number; readonly pan: number; readonly muted: boolean; readonly solo: ...` |
| `MixerSend` | interface | `interface MixerSend { readonly bus: ChannelId; readonly level: number; }` |
| `audibility` | function | `function audibility(channels: readonly AudibilityInput[]): Audibility[];` |
| `describeAudibility` | function | `function describeAudibility(name: string, state: Audibility, solo: boolean, details?: AudibilityDetails): string;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/mixer.ts -->
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
