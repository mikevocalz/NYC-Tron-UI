---
name: "WorkspaceModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/workspace-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# WorkspaceModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/workspace-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/workspace-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { MODE_SHORTCUT_COUNT, documentLabel, layoutForMode, modeAnnouncement, modeShortcutIndex, modeShortcutLabel, validateWorkspace, validateWorkspaceDocument } from "@nyc-tron/ui/shell/workspace-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/workspace-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/workspace-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `MODE_SHORTCUT_COUNT` | const | `const MODE_SHORTCUT_COUNT = 9;` |
| `ShortcutKey` | interface | `interface ShortcutKey { readonly key: string; readonly code?: string; readonly ctrlKey: boolean; readonly metaKey: boolean; readonly altKey: boolean; readonl...` |
| `WorkspaceDocument` | interface | `interface WorkspaceDocument { readonly id: string; readonly title: string; readonly dirty?: boolean; }` |
| `WorkspaceMode` | interface | `interface WorkspaceMode { readonly id: string; readonly label: string; readonly panels: readonly string[]; readonly defaultLayout: DockLayout; }` |
| `documentLabel` | function | `function documentLabel(document: WorkspaceDocument): string;` |
| `layoutForMode` | function | `function layoutForMode(mode: WorkspaceMode, layouts: Readonly<Record<string, DockLayout>>): DockLayout;` |
| `modeAnnouncement` | function | `function modeAnnouncement(modes: readonly WorkspaceMode[], id: string): string;` |
| `modeShortcutIndex` | function | `function modeShortcutIndex(k: ShortcutKey): number \| null;` |
| `modeShortcutLabel` | function | `function modeShortcutLabel(index: number, apple: boolean): string \| undefined;` |
| `validateWorkspace` | function | `function validateWorkspace(modes: readonly WorkspaceMode[], layouts: Readonly<Record<string, DockLayout>>, panelIds: readonly string[]): void;` |
| `validateWorkspaceDocument` | function | `function validateWorkspaceDocument(document: WorkspaceDocument): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/workspace-model.ts -->
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
