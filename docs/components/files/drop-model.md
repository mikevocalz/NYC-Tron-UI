---
name: "DropModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/files/drop-model"
tier: 2
docs: "generated"
platforms: []
category: "primitive"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# DropModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/files/drop-model.ts -->
Platform-free rules shared by the web and native DropZone and FilePicker: `accept` strings in the HTML input syntax, MIME allowlists, and the enter/leave depth counter that keeps nested drag targets from flickering.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/files/drop-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/files/drop-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { acceptsFile, dragDepth, matchesAccept, matchesMime, parseAccept } from "@/components/nyc-tron/ui/components/files/drop-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { acceptsFile, dragDepth, matchesAccept, matchesMime, parseAccept } from "@nyc-tron/ui/components/files/drop-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/files/drop-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `AcceptRule` | type | `type AcceptRule = { readonly kind: "extension"; readonly value: string; } \| { readonly kind: "mime"; readonly value: string; } \| { readonly kind: "mimeGroup"...` |
| `FileLike` | interface | `interface FileLike { readonly fileName?: string; readonly type?: string; }` |
| `acceptsFile` | function | `function acceptsFile(file: FileLike, accept: string \| undefined, allowed?: readonly (string \| RegExp)[]): boolean;` |
| `dragDepth` | function | `function dragDepth(depth: number, event: "enter" \| "leave" \| "drop"): { depth: number; edge: "enter" \| "exit" \| null; };` |
| `matchesAccept` | function | `function matchesAccept(file: FileLike, accept: string \| undefined): boolean;` |
| `matchesMime` | function | `function matchesMime(type: string, allowed: readonly (string \| RegExp)[] \| undefined): boolean;` |
| `parseAccept` | function | `function parseAccept(accept: string \| undefined): AcceptRule[];` |
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

<!-- generated:begin a11y source=packages/ui/src/components/files/drop-model.ts -->
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
