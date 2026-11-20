---
name: "ChoiceKeysModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forms/choice-keys"
tier: 2
docs: "generated"
platforms: []
category: "primitive"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ChoiceKeysModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forms/choice-keys.ts -->
Keyboard models shared by SegmentedControl, TabBar, Toolbar and Select.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forms/choice-keys.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forms/choice-keys
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { arrowStep, domIsRTL, isModified, nextChoiceIndex, rovingStop, typeaheadIndex, webKey } from "@/components/nyc-tron/ui/components/forms/choice-keys";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { arrowStep, domIsRTL, isModified, nextChoiceIndex, rovingStop, typeaheadIndex, webKey } from "@nyc-tron/ui/components/forms/choice-keys";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forms/choice-keys.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ChoiceAxis` | type | `type ChoiceAxis = "horizontal" \| "vertical" \| "both";` |
| `WebKey` | type | `type WebKey = { key: string; altKey?: boolean; ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean; preventDefault: () => void; currentTarget: unknown; };` |
| `arrowStep` | function | `function arrowStep(key: string, axis: ChoiceAxis, rtl: boolean): 1 \| -1 \| null;` |
| `domIsRTL` | function | `function domIsRTL(node: unknown): boolean;` |
| `isModified` | const | `const isModified: (k: WebKey) => boolean;` |
| `nextChoiceIndex` | function | `function nextChoiceIndex(current: number, key: string, disabled: readonly boolean[], { axis, rtl, wrap }?: { axis?: ChoiceAxis; rtl?: boolean; wrap?: boolean...` |
| `rovingStop` | function | `function rovingStop(selected: number, disabled: readonly boolean[]): number;` |
| `typeaheadIndex` | function | `function typeaheadIndex(labels: readonly string[], disabled: readonly boolean[], from: number, char: string): number;` |
| `webKey` | function | `function webKey(event: unknown): WebKey;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forms/choice-keys.ts -->
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
