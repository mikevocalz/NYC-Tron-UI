---
name: "ShortcutModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/shortcut-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ShortcutModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/shortcut-model.ts -->
Key bindings as portable strings: modifiers in a fixed order, then the key, joined by "+", e.g.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/shortcut-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { bindingFromChord, bindingKeycaps, bindingSpoken, commandForChord, findConflict, isAssignableBinding, normalizeBinding, validateShortcutCommands } from "@nyc-tron/ui/shell/shortcut-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/shortcut-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/shortcut-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `Binding` | type | `type Binding = string;` |
| `ChordRecorder` | interface | `interface ChordRecorder { startRecording(onChord: (chord: KeyChord) => void): { remove(): void; }; }` |
| `KeyChord` | interface | `interface KeyChord { readonly key: string; readonly ctrlKey?: boolean; readonly metaKey?: boolean; readonly altKey?: boolean; readonly shiftKey?: boolean; }` |
| `ShortcutCommand` | interface | `interface ShortcutCommand { readonly id: string; readonly label: string; readonly group?: string; readonly binding?: Binding; readonly defaultBinding?: Bindi...` |
| `bindingFromChord` | function | `function bindingFromChord(chord: KeyChord, apple: boolean): Binding \| undefined;` |
| `bindingKeycaps` | function | `function bindingKeycaps(binding: Binding, apple: boolean): string[];` |
| `bindingSpoken` | function | `function bindingSpoken(binding: Binding, apple: boolean): string;` |
| `commandForChord` | function | `function commandForChord(commands: readonly ShortcutCommand[], chord: KeyChord, apple: boolean): ShortcutCommand \| undefined;` |
| `findConflict` | function | `function findConflict(commands: readonly ShortcutCommand[], id: string, binding: Binding): ShortcutCommand \| undefined;` |
| `isAssignableBinding` | function | `function isAssignableBinding(binding: Binding): boolean;` |
| `normalizeBinding` | function | `function normalizeBinding(binding: string): Binding \| undefined;` |
| `validateShortcutCommands` | function | `function validateShortcutCommands(commands: readonly ShortcutCommand[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/shortcut-model.ts -->
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
