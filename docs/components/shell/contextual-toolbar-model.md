---
name: "ContextualToolbarModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/contextual-toolbar-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: ["space.0"]
registryDependencies: []
a11yStatus: "unverified"
---

# ContextualToolbarModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/contextual-toolbar-model.ts -->
One control a {@linkcode ContextualToolbar} may show.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/contextual-toolbar-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { itemsForSelection, overflowDescription, splitOverflow, validateToolbarItems } from "@nyc-tron/ui/shell/contextual-toolbar-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/contextual-toolbar-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/contextual-toolbar-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `OverflowInput` | interface | `interface OverflowInput { readonly widths: Readonly<Record<string, number>>; readonly available: number; readonly gap: number; readonly overflowWidth: number...` |
| `OverflowSplit` | interface | `interface OverflowSplit { readonly visible: string[]; readonly overflow: string[]; }` |
| `ToolbarItemSpec` | interface | `interface ToolbarItemSpec { readonly id: string; readonly label: string; readonly priority?: number; readonly appliesTo?: readonly string[]; readonly pressed...` |
| `itemsForSelection` | function | `function itemsForSelection<T extends ToolbarItemSpec>(items: readonly T[], kind: string): T[];` |
| `overflowDescription` | function | `function overflowDescription(item: ToolbarItemSpec): string \| undefined;` |
| `splitOverflow` | function | `function splitOverflow(items: readonly ToolbarItemSpec[], input: OverflowInput): OverflowSplit;` |
| `validateToolbarItems` | function | `function validateToolbarItems(items: readonly ToolbarItemSpec[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/contextual-toolbar-model.ts -->
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
