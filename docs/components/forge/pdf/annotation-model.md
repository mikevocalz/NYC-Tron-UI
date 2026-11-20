---
name: "AnnotationModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/pdf/annotation-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# AnnotationModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/annotation-model.ts -->
Markup tools a PDF annotation toolbar can offer.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/annotation-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { ANNOTATION_TOOL_INFO, ANNOTATION_TOOL_ORDER, orderTools, toolForKey, toolForSubtype } from "@nyc-tron/ui/components/forge/pdf/annotation-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/annotation-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/annotation-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ANNOTATION_TOOL_INFO` | const | `const ANNOTATION_TOOL_INFO: { readonly select: { readonly label: "Select"; readonly subtype: undefined; readonly key: "v"; }; readonly note: { readonly label...` |
| `ANNOTATION_TOOL_ORDER` | const | `const ANNOTATION_TOOL_ORDER: readonly AnnotationTool[];` |
| `AnnotationTool` | type | `type AnnotationTool = "select" \| "note" \| "highlight" \| "underline" \| "strike" \| "ink" \| "rectangle" \| "ellipse";` |
| `orderTools` | function | `function orderTools(tools: readonly AnnotationTool[]): AnnotationTool[];` |
| `toolForKey` | function | `function toolForKey(key: string, tools: readonly AnnotationTool[]): AnnotationTool \| undefined;` |
| `toolForSubtype` | function | `function toolForSubtype(subtype: string): AnnotationTool \| undefined;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/annotation-model.ts -->
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
