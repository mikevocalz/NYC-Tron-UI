---
name: "InkModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/ink/ink-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# InkModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/ink/ink-model.ts -->
Engine-neutral ink toolbar contract.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/ink/ink-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/ink/ink-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { INK_BOARD_TOOLS, INK_ENABLED, INK_OPACITY_STEP, INK_SIZES, INK_SIZE_LABELS, INK_SIZE_POINTS, INK_TOOL_LABELS, INK_TOOL_SHORTCUTS } from "@/components/nyc-tron/ui/components/forge/ink/ink-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { INK_BOARD_TOOLS, INK_ENABLED, INK_OPACITY_STEP, INK_SIZES, INK_SIZE_LABELS, INK_SIZE_POINTS, INK_TOOL_LABELS, INK_TOOL_SHORTCUTS } from "@nyc-tron/ui/components/forge/ink/ink-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/ink/ink-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `INK_BOARD_TOOLS` | const | `const INK_BOARD_TOOLS: readonly [ "pen", "highlighter", "eraser" ];` |
| `INK_ENABLED` | const | `const INK_ENABLED: InkAvailability;` |
| `INK_OPACITY_STEP` | const | `const INK_OPACITY_STEP = 0.1;` |
| `INK_SIZES` | const | `const INK_SIZES: readonly [ "s", "m", "l", "xl" ];` |
| `INK_SIZE_LABELS` | const | `const INK_SIZE_LABELS: { readonly s: "Small"; readonly m: "Medium"; readonly l: "Large"; readonly xl: "Extra large"; };` |
| `INK_SIZE_POINTS` | const | `const INK_SIZE_POINTS: { readonly s: 2.5; readonly m: 4; readonly l: 6.5; readonly xl: 10; };` |
| `INK_TOOL_LABELS` | const | `const INK_TOOL_LABELS: { readonly pen: "Pen"; readonly marker: "Marker"; readonly highlighter: "Highlighter"; readonly eraser: "Eraser"; readonly lasso: "Las...` |
| `INK_TOOL_SHORTCUTS` | const | `const INK_TOOL_SHORTCUTS: { readonly pen: "P"; readonly marker: "M"; readonly highlighter: "H"; readonly eraser: "E"; readonly lasso: "L"; };` |
| `INK_TOUCH_TARGET` | const | `const INK_TOUCH_TARGET = 44;` |
| `InkAvailability` | type | `type InkAvailability = Readonly<{ enabled: true; }> \| Readonly<{ enabled: false; reason: string; }>;` |
| `InkCommand` | type | `type InkCommand = Readonly<{ type: "select-tool"; tool: InkTool; }> \| Readonly<{ type: "size"; direction: -1 \| 1; }> \| Readonly<{ type: "undo"; }> \| Readonly...` |
| `InkCommandOutcome` | type | `type InkCommandOutcome = Readonly<{ kind: "tool"; tool: InkTool; }> \| Readonly<{ kind: "size"; size: InkSize; }> \| Readonly<{ kind: "undo"; }> \| Readonly<{ k...` |
| `InkKeyEvent` | interface | `interface InkKeyEvent extends KeyEventLike { readonly metaKey?: boolean; readonly ctrlKey?: boolean; readonly shiftKey?: boolean; readonly altKey?: boolean; }` |
| `InkPressure` | type | `type InkPressure = Readonly<{ enabled: boolean; disabledReason?: string; }>;` |
| `InkSize` | type | `type InkSize = "s" \| "m" \| "l" \| "xl";` |
| `InkSwatch` | type | `type InkSwatch = Readonly<{ id: string; label: string; value: string; }>;` |
| `InkTool` | type | `type InkTool = "pen" \| "marker" \| "highlighter" \| "eraser" \| "lasso";` |
| `InkToolOption` | type | `type InkToolOption = Readonly<{ tool: InkTool; label?: string; disabledReason?: string; }>;` |
| `InkToolbarState` | interface | `interface InkToolbarState { readonly tools: readonly InkToolOption[]; readonly tool: InkTool; readonly size: InkSize; readonly swatches?: readonly InkSwatch[...` |
| `availabilityReason` | function | `function availabilityReason(state: InkAvailability): string \| undefined;` |
| `formatInkOpacity` | function | `function formatInkOpacity(value: number): string;` |
| `inkSizePreviewDiameter` | function | `function inkSizePreviewDiameter(size: InkSize, tool: InkTool): number;` |
| `normalizeInkOpacity` | function | `function normalizeInkOpacity(value: number): number;` |
| `planInkCommand` | function | `function planInkCommand(command: InkCommand, state: Pick<InkToolbarState, "tools" \| "tool" \| "size" \| "undo" \| "redo">): InkCommandOutcome;` |
| `resolveInkShortcut` | function | `function resolveInkShortcut(event: InkKeyEvent): InkCommand \| undefined;` |
| `stepInkOpacity` | function | `function stepInkOpacity(value: number, direction: -1 \| 1, step?: number): number;` |
| `stepInkSize` | function | `function stepInkSize(size: InkSize, direction: -1 \| 1): InkSize;` |
| `validateInkToolbar` | function | `function validateInkToolbar(state: InkToolbarState): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/ink/ink-model.ts -->
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
