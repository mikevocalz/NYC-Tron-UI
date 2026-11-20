---
name: "InsertsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/inserts"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# InsertsModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/inserts.ts -->
Insert-chain and preset helpers for {@linkcode InsertEffectRack} and {@linkcode PluginPresetBrowser}.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/inserts.ts -->
- Package: @nyc-tron/ui
- Import: `import { INSERT_KINDS, INSERT_KIND_LABELS, MAX_INSERTS, addBlockedReason, describeInsert, filterPresets, moveTarget } from "@nyc-tron/ui/forge/audio/inserts";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/audio/inserts
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/inserts.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `INSERT_KINDS` | const | `const INSERT_KINDS: readonly InsertKind[];` |
| `INSERT_KIND_LABELS` | const | `const INSERT_KIND_LABELS: { readonly gain: "Gain"; readonly eq: "EQ"; readonly compressor: "Compressor"; };` |
| `InsertKind` | type | `type InsertKind = "gain" \| "eq" \| "compressor";` |
| `InsertPreset` | interface | `interface InsertPreset { readonly id: string; readonly label: string; }` |
| `InsertSlot` | interface | `interface InsertSlot { readonly id: string; readonly kind: InsertKind; readonly bypassed: boolean; readonly summary?: string; }` |
| `MAX_INSERTS` | const | `const MAX_INSERTS = 8;` |
| `addBlockedReason` | function | `function addBlockedReason(count: number, max?: number): string \| undefined;` |
| `describeInsert` | function | `function describeInsert(slot: Pick<InsertSlot, "kind" \| "bypassed" \| "summary">, index: number, count: number): string;` |
| `filterPresets` | function | `function filterPresets<T extends Pick<InsertPreset, "label">>(presets: readonly T[], query: string): T[];` |
| `moveTarget` | function | `function moveTarget(index: number, direction: -1 \| 1, count: number): number \| undefined;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/inserts.ts -->
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
