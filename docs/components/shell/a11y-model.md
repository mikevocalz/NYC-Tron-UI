---
name: "A11yModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/a11y-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# A11yModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/a11y-model.ts -->
How the person last moved focus: by keyboard or by pointer (mouse, touch, pen).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/a11y-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { initialA11yState, modalityAfterKey, motionDuration, queueAnnouncement } from "@nyc-tron/ui/shell/a11y-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/a11y-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/a11y-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `A11yPreferences` | interface | `interface A11yPreferences { readonly reduceMotion: boolean; readonly screenReader: boolean; readonly highContrast: boolean; readonly inputModality: InputModa...` |
| `A11yState` | interface | `interface A11yState extends A11yPreferences { readonly announcement: Announcement \| undefined; }` |
| `A11yStore` | interface | `interface A11yStore { getState(): A11yState; setState(patch: Partial<A11yState>): void; }` |
| `Announcement` | interface | `interface Announcement { readonly text: string; readonly politeness: Politeness; readonly seq: number; }` |
| `InputModality` | type | `type InputModality = "keyboard" \| "pointer" \| "unknown";` |
| `Politeness` | type | `type Politeness = "polite" \| "assertive";` |
| `initialA11yState` | function | `function initialA11yState(initial?: Partial<A11yPreferences>): A11yState;` |
| `modalityAfterKey` | function | `function modalityAfterKey(current: InputModality, key: string, modified: boolean): InputModality;` |
| `motionDuration` | function | `function motionDuration(ms: number, preferences: Pick<A11yPreferences, "reduceMotion">): number;` |
| `queueAnnouncement` | function | `function queueAnnouncement(store: A11yStore, text: string, politeness?: Politeness): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/a11y-model.ts -->
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
