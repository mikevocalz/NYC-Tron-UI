---
name: "WorkspacePresetModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/workspace-preset-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# WorkspacePresetModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/workspace-preset-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/workspace-preset-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/workspace-preset-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { BUILT_IN_PRESET_IDS, MAX_WORKSPACE_PRESETS, PRESET_NAME_MAX, copyName, layoutsEqual, presetActions, presetNameMessage, presetNameProblem } from "@/components/nyc-tron/ui/components/shell/workspace-preset-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { BUILT_IN_PRESET_IDS, MAX_WORKSPACE_PRESETS, PRESET_NAME_MAX, copyName, layoutsEqual, presetActions, presetNameMessage, presetNameProblem } from "@nyc-tron/ui/components/shell/workspace-preset-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/workspace-preset-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `BUILT_IN_PRESET_IDS` | const | `const BUILT_IN_PRESET_IDS: readonly [ "edit", "color", "audio", "review", "presentation" ];` |
| `BuiltInPresetId` | type | `type BuiltInPresetId = typeof BUILT_IN_PRESET_IDS[number];` |
| `MAX_WORKSPACE_PRESETS` | const | `const MAX_WORKSPACE_PRESETS = 1000;` |
| `PRESET_NAME_MAX` | const | `const PRESET_NAME_MAX = 40;` |
| `PresetActions` | interface | `interface PresetActions { readonly canRename: boolean; readonly canDelete: boolean; readonly canReset: boolean; }` |
| `PresetNameProblem` | type | `type PresetNameProblem = "empty" \| "too-long" \| "duplicate";` |
| `WorkspacePreset` | interface | `interface WorkspacePreset { readonly id: string; readonly name: string; readonly builtIn: boolean; readonly modified: boolean; }` |
| `copyName` | function | `function copyName(name: string, presets: readonly WorkspacePreset[]): string;` |
| `layoutsEqual` | function | `function layoutsEqual(a: DockLayout, b: DockLayout): boolean;` |
| `presetActions` | function | `function presetActions(preset: WorkspacePreset \| undefined): PresetActions;` |
| `presetNameMessage` | function | `function presetNameMessage(problem: PresetNameProblem \| undefined, name: string): string \| undefined;` |
| `presetNameProblem` | function | `function presetNameProblem(name: string, presets: readonly WorkspacePreset[], exceptId?: string): PresetNameProblem \| undefined;` |
| `validatePresetList` | function | `function validatePresetList(presets: readonly WorkspacePreset[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/workspace-preset-model.ts -->
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
