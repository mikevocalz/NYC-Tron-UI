---
name: "ListModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/document/list-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ListModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/list-model.ts -->
How one list level numbers its items.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/list-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { BULLETS_NUMBERING_CAPABILITIES, LIST_FORMATS, LIST_MAX_LEVEL, LIST_PREVIEW_MARKER_MAX, canIndent, canOutdent, defaultLevelFormats, formatLabel } from "@nyc-tron/ui/forge/document/list-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/document/list-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/list-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `BULLETS_NUMBERING_CAPABILITIES` | const | `const BULLETS_NUMBERING_CAPABILITIES: Readonly<{ version: 1; authoritativeMarkers: true; }>;` |
| `LIST_FORMATS` | const | `const LIST_FORMATS: readonly ListFormat[];` |
| `LIST_MAX_LEVEL` | const | `const LIST_MAX_LEVEL = 8;` |
| `LIST_PREVIEW_MARKER_MAX` | const | `const LIST_PREVIEW_MARKER_MAX = 4096;` |
| `ListFormat` | type | `type ListFormat = "bullet" \| "decimal" \| "lowerLetter" \| "upperLetter" \| "lowerRoman" \| "upperRoman";` |
| `ListItemLevel` | interface | `interface ListItemLevel { readonly level: number; }` |
| `ListKind` | type | `type ListKind = "none" \| "bullet" \| "numbered" \| "multilevel";` |
| `ListMarkerItem` | interface | `interface ListMarkerItem extends ListItemLevel { readonly marker?: string; }` |
| `canIndent` | function | `function canIndent(items: readonly ListItemLevel[], from: number, to?: number): boolean;` |
| `canOutdent` | function | `function canOutdent(items: readonly ListItemLevel[], from: number, to?: number): boolean;` |
| `defaultLevelFormats` | function | `function defaultLevelFormats(kind: Exclude<ListKind, "none">): ListFormat[];` |
| `formatLabel` | function | `function formatLabel(format: ListFormat): string;` |
| `listMarker` | function | `function listMarker(format: ListFormat, n: number, level?: number): string;` |
| `listMarkers` | function | `function listMarkers(items: readonly ListItemLevel[], formats: readonly ListFormat[]): string[];` |
| `listPreviewMarkers` | function | `function listPreviewMarkers(items: readonly ListMarkerItem[], formats: readonly ListFormat[], kind: ListKind \| "mixed"): string[];` |
| `shiftLevels` | function | `function shiftLevels<T extends ListItemLevel>(items: readonly T[], from: number, to: number, direction: 1 \| -1): T[];` |
| `validateLevels` | function | `function validateLevels(items: readonly ListItemLevel[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/list-model.ts -->
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
