---
name: "CommandFilterModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/overlays/command-filter"
tier: 2
docs: "generated"
platforms: []
category: "overlay"
tokens: []
registryDependencies: ["@nyc-tron/overlays/CommandPopover"]
a11yStatus: "unverified"
---

# CommandFilterModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/overlays/command-filter.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/overlays/command-filter.ts -->
- Package: @nyc-tron/ui
- Import: `import { filterCommands, nextActiveCommand, normalizeSearchText, reconcileActiveCommand, validateCommands } from "@nyc-tron/ui/overlays/command-filter";`
- Peers: react, react-native
- Requires: @nyc-tron/overlays/CommandPopover

```sh
npx shadcn@latest add @nyc-tron/overlays/command-filter
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/overlays/command-filter.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `PaletteCommand` | type | `type PaletteCommand = CommandMenuItem & Readonly<{ keywords?: readonly string[]; group?: string; }>;` |
| `filterCommands` | function | `function filterCommands(commands: readonly PaletteCommand[], query: string): PaletteCommand[];` |
| `nextActiveCommand` | function | `function nextActiveCommand(results: readonly PaletteCommand[], currentId: string \| undefined, key: string): string \| undefined;` |
| `normalizeSearchText` | function | `function normalizeSearchText(text: string): string;` |
| `reconcileActiveCommand` | function | `function reconcileActiveCommand(results: readonly PaletteCommand[], currentId: string \| undefined): string \| undefined;` |
| `validateCommands` | function | `function validateCommands(commands: readonly PaletteCommand[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/overlays/command-filter.ts -->
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
