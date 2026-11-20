---
name: "MixGroupsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/mix-groups"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# MixGroupsModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/mix-groups.ts -->
Mix group summary for {@linkcode MixGroupBar}.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/mix-groups.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/mix-groups
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { mixGroups } from "@/components/nyc-tron/ui/components/forge/audio/mix-groups";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { mixGroups } from "@nyc-tron/ui/components/forge/audio/mix-groups";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/mix-groups.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `MixGroup` | interface | `interface MixGroup { readonly name: string; readonly memberIds: readonly MixerChannel["id"][]; readonly solo: boolean; readonly muted: boolean; readonly mixe...` |
| `mixGroups` | function | `function mixGroups(channels: readonly Pick<MixerChannel, "id" \| "group" \| "solo" \| "muted">[]): MixGroup[];` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/mix-groups.ts -->
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
