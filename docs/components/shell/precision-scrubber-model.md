---
name: "PrecisionScrubberModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/precision-scrubber-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# PrecisionScrubberModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/precision-scrubber-model.ts -->
Alias of forge/inputs/precision-scrubber-model, kept for the `@nyc-tron/ui/components/shell/precision-scrubber-model` subpath.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/precision-scrubber-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/precision-scrubber-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { SCRUB_PIXELS_PER_STEP, createScrubberModel, initialScrubberState } from "@/components/nyc-tron/ui/components/shell/precision-scrubber-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { SCRUB_PIXELS_PER_STEP, createScrubberModel, initialScrubberState } from "@nyc-tron/ui/components/shell/precision-scrubber-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/precision-scrubber-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `SCRUB_PIXELS_PER_STEP` | const | `const SCRUB_PIXELS_PER_STEP = 8;` |
| `ScrubberInputs` | interface | `interface ScrubberInputs { value: number; min: number; max: number; step: number; detents?: readonly number[]; disabled?: boolean; onPreview?: (value: number...` |
| `ScrubberModel` | type | `type ScrubberModel = ReturnType<typeof createScrubberModel>;` |
| `ScrubberState` | interface | `interface ScrubberState { preview: number; active: boolean; pending: boolean; editing: boolean; draft: string; mode: ScrubMode; error: string \| undefined; }` |
| `ScrubberStore` | interface | `interface ScrubberStore { getState(): ScrubberState; setState(partial: Partial<ScrubberState>): void; }` |
| `createScrubberModel` | function | `function createScrubberModel(store: ScrubberStore, inputs: () => ScrubberInputs): { begin(point: DragPoint): void; move(point: DragPoint, touches: number): v...` |
| `initialScrubberState` | function | `function initialScrubberState(value: number, step: number): ScrubberState;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/precision-scrubber-model.ts -->
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
