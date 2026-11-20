---
name: "RibbonModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/document/ribbon-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# RibbonModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/ribbon-model.ts -->
Character toggles on the ribbon's font group.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/ribbon-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { FONT_SIZE_MAX, FONT_SIZE_MIN, FONT_SIZE_STEPS, INLINE_TOGGLES, TEXT_CASE_LABELS, applyTextCase, nextToggle, ribbonShortcut } from "@nyc-tron/ui/forge/document/ribbon-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/document/ribbon-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/ribbon-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FONT_SIZE_MAX` | const | `const FONT_SIZE_MAX = 1638;` |
| `FONT_SIZE_MIN` | const | `const FONT_SIZE_MIN = 1;` |
| `FONT_SIZE_STEPS` | const | `const FONT_SIZE_STEPS: readonly [ 8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 54, 60, 66, 72, 80, 88, 96 ];` |
| `INLINE_TOGGLES` | const | `const INLINE_TOGGLES: readonly InlineToggle[];` |
| `InlineToggle` | type | `type InlineToggle = "bold" \| "italic" \| "underline" \| "strike";` |
| `RibbonShortcut` | type | `type RibbonShortcut = { toggle: InlineToggle; };` |
| `RibbonState` | interface | `interface RibbonState { readonly bold: ToggleState; readonly italic: ToggleState; readonly underline: ToggleState; readonly strike: ToggleState; readonly col...` |
| `RunStyle` | interface | `interface RunStyle { readonly bold?: boolean; readonly italic?: boolean; readonly underline?: boolean; readonly strike?: boolean; readonly color?: string; }` |
| `SharedValue` | type | `type SharedValue<T> = T \| "mixed" \| undefined;` |
| `TEXT_CASE_LABELS` | const | `const TEXT_CASE_LABELS: Record<TextCase, string>;` |
| `TextCase` | type | `type TextCase = "sentence" \| "lower" \| "upper" \| "capitalize";` |
| `ToggleState` | type | `type ToggleState = boolean \| "mixed";` |
| `applyTextCase` | function | `function applyTextCase(text: string, mode: TextCase): string;` |
| `nextToggle` | function | `function nextToggle(state: ToggleState): boolean;` |
| `ribbonShortcut` | function | `function ribbonShortcut(key: string, mod: boolean, shift: boolean): RibbonShortcut \| undefined;` |
| `ribbonStateFor` | function | `function ribbonStateFor(runs: readonly RunStyle[]): RibbonState;` |
| `sharedValue` | function | `function sharedValue<T>(values: readonly (T \| undefined)[]): SharedValue<T>;` |
| `stepFontSize` | function | `function stepFontSize(size: number, direction: 1 \| -1): number;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/ribbon-model.ts -->
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
