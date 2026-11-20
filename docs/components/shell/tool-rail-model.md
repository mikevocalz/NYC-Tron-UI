---
name: "ToolRailModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/tool-rail-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ToolRailModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/tool-rail-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/tool-rail-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/tool-rail-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { shownVariantId, toolIsActive, validateRailTools } from "@/components/nyc-tron/ui/components/shell/tool-rail-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { shownVariantId, toolIsActive, validateRailTools } from "@nyc-tron/ui/components/shell/tool-rail-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/tool-rail-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `RailTool` | interface | `interface RailTool { readonly id: string; readonly label: string; readonly icon: ToolIcon; readonly shortcut?: string; readonly disabled?: boolean; readonly ...` |
| `RailToolVariant` | interface | `interface RailToolVariant { readonly id: string; readonly label: string; readonly icon: ToolIcon; readonly shortcut?: string; }` |
| `ToolIcon` | type | `type ToolIcon = ReactNode \| ((state: { active: boolean; }) => ReactNode);` |
| `shownVariantId` | function | `function shownVariantId(tool: RailTool, groupSelection?: Readonly<Record<string, string>>): string;` |
| `toolIsActive` | function | `function toolIsActive(tool: RailTool, activeToolId: string \| undefined): boolean;` |
| `validateRailTools` | function | `function validateRailTools(tools: readonly RailTool[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/tool-rail-model.ts -->
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
