---
name: "TransitionPresetsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/timeline/transition-presets"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# TransitionPresetsModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/transition-presets.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/transition-presets.ts -->
- Package: @nyc-tron/ui
- Import: `import { TRANSITION_KINDS, filterTransitionKinds, transitionDiagram } from "@nyc-tron/ui/forge/timeline/transition-presets";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/transition-presets
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/transition-presets.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `TRANSITION_KINDS` | const | `const TRANSITION_KINDS: readonly TransitionKindInfo[];` |
| `TransitionDiagram` | type | `type TransitionDiagram = { readonly shape: "overlap"; } \| { readonly shape: "dip"; readonly through: "black" \| "white"; } \| { readonly shape: "wipe" \| "push"...` |
| `TransitionKindInfo` | interface | `interface TransitionKindInfo { readonly kind: string; readonly label: string; readonly description: string; readonly tracks: TransitionTarget; }` |
| `filterTransitionKinds` | function | `function filterTransitionKinds(kinds: readonly TransitionKindInfo[], query: string, target?: TransitionTarget): TransitionKindInfo[];` |
| `transitionDiagram` | function | `function transitionDiagram(kind: string): TransitionDiagram;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/transition-presets.ts -->
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
