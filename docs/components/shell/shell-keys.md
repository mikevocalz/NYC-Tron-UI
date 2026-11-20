---
name: "ShellKeysModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/shell-keys"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ShellKeysModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/shell-keys.ts -->
Keyboard helpers shared by the studio shell controls.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/shell-keys.ts -->
- Package: @nyc-tron/ui
- Import: `import { arrowStep, nodeIsRTL, rovingTarget, shellKey } from "@nyc-tron/ui/shell/shell-keys";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/shell-keys
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/shell-keys.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ShellAxis` | type | `type ShellAxis = "horizontal" \| "vertical";` |
| `ShellKey` | interface | `interface ShellKey { readonly key: string; readonly altKey: boolean; readonly ctrlKey: boolean; readonly metaKey: boolean; readonly shiftKey: boolean; preven...` |
| `arrowStep` | function | `function arrowStep(key: string, axis: ShellAxis, rtl: boolean): 1 \| -1 \| null;` |
| `nodeIsRTL` | function | `function nodeIsRTL(node: unknown): boolean;` |
| `rovingTarget` | function | `function rovingTarget(current: number, key: string, disabled: readonly boolean[], axis: ShellAxis, rtl: boolean): number \| null;` |
| `shellKey` | function | `function shellKey(event: unknown): ShellKey;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/shell-keys.ts -->
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
