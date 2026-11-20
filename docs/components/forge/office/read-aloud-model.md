---
name: "ReadAloudModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/office/read-aloud-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ReadAloudModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/office/read-aloud-model.ts -->
Slowest reading speed, as a multiple of the voice's normal rate.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/office/read-aloud-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { READ_ALOUD_MAX_RATE, READ_ALOUD_MAX_SENTENCE, READ_ALOUD_MAX_SENTENCES, READ_ALOUD_MIN_RATE, READ_ALOUD_RATES, clampRate, formatRate, readAloudPosition } from "@nyc-tron/ui/forge/office/read-aloud-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/office/read-aloud-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/office/read-aloud-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `READ_ALOUD_MAX_RATE` | const | `const READ_ALOUD_MAX_RATE = 3;` |
| `READ_ALOUD_MAX_SENTENCE` | const | `const READ_ALOUD_MAX_SENTENCE = 600;` |
| `READ_ALOUD_MAX_SENTENCES` | const | `const READ_ALOUD_MAX_SENTENCES = 20000;` |
| `READ_ALOUD_MIN_RATE` | const | `const READ_ALOUD_MIN_RATE = 0.5;` |
| `READ_ALOUD_RATES` | const | `const READ_ALOUD_RATES: readonly [ 0.5, 0.75, 1, 1.25, 1.5, 2, 3 ];` |
| `ReadAloudBlock` | interface | `interface ReadAloudBlock { readonly block: number; readonly text: string; }` |
| `ReadAloudSentence` | interface | `interface ReadAloudSentence { readonly text: string; readonly block: number; readonly start: number; readonly end: number; }` |
| `clampRate` | function | `function clampRate(rate: number): number;` |
| `formatRate` | function | `function formatRate(rate: number): string;` |
| `readAloudPosition` | function | `function readAloudPosition(index: number, count: number): string;` |
| `readAloudSentences` | function | `function readAloudSentences(blocks: readonly ReadAloudBlock[]): ReadAloudSentence[];` |
| `sentenceIndexAtBlock` | function | `function sentenceIndexAtBlock(sentences: readonly ReadAloudSentence[], block: number): number;` |
| `splitSentences` | function | `function splitSentences(text: string): Array<[ number, number ]>;` |
| `stepRate` | function | `function stepRate(rate: number, direction: 1 \| -1): number;` |
| `tidySpoken` | function | `function tidySpoken(s: string): string;` |
| `wordSpans` | function | `function wordSpans(text: string): Array<[ number, number ]>;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/office/read-aloud-model.ts -->
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
