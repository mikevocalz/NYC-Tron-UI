---
name: "InspectorContextModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/inspector-context"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# InspectorContextModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/inspector-context.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/inspector-context.ts -->
- Package: @nyc-tron/ui
- Import: `import { InspectorPanelContext, InspectorSectionContext } from "@nyc-tron/ui/components/shell/inspector-context";`
- Peers: react, react-native, zustand
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/inspector-context
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/inspector-context.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `InspectorPanelContext` | const | `const InspectorPanelContext: import("react").Context<InspectorPanelContextValue \| undefined>;` |
| `InspectorPanelContextValue` | interface | `interface InspectorPanelContextValue { readonly query: string; readonly registry: StoreApi<InspectorRegistryState>; }` |
| `InspectorSectionContext` | const | `const InspectorSectionContext: import("react").Context<InspectorSectionContextValue>;` |
| `InspectorSectionContextValue` | interface | `interface InspectorSectionContextValue { readonly path: readonly string[]; readonly disabled: boolean; readonly depth: number; }` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/inspector-context.ts -->
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
