---
name: "InspectorModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/inspector-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# InspectorModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/inspector-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/inspector-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/inspector-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { matchSummary, matchesQuery, matchingRowCount, registerRow, selectionHeading } from "@/components/nyc-tron/ui/components/shell/inspector-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { matchSummary, matchesQuery, matchingRowCount, registerRow, selectionHeading } from "@nyc-tron/ui/components/shell/inspector-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/inspector-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `InspectorRegistry` | interface | `interface InspectorRegistry { getState(): InspectorRegistryState; setState(update: (state: InspectorRegistryState) => InspectorRegistryState): void; }` |
| `InspectorRegistryState` | interface | `interface InspectorRegistryState { readonly rows: Readonly<Record<string, InspectorRowEntry>>; }` |
| `InspectorRowEntry` | interface | `interface InspectorRowEntry { readonly sections: readonly string[]; readonly match: boolean; }` |
| `InspectorSelection` | type | `type InspectorSelection = { readonly kind: "none"; } \| { readonly kind: "single"; readonly title: string; readonly detail?: string; } \| { readonly kind: "mul...` |
| `matchSummary` | function | `function matchSummary(count: number, query: string): string;` |
| `matchesQuery` | function | `function matchesQuery(query: string, label: string, keywords?: readonly string[]): boolean;` |
| `matchingRowCount` | function | `function matchingRowCount(state: InspectorRegistryState, section?: string): number;` |
| `registerRow` | function | `function registerRow(registry: InspectorRegistry, id: string, entry: InspectorRowEntry): () => void;` |
| `selectionHeading` | function | `function selectionHeading(selection: InspectorSelection): string;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/inspector-model.ts -->
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
