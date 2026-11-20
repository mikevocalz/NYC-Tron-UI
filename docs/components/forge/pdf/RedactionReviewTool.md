---
name: "RedactionReviewTool"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/pdf/RedactionReviewTool"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# RedactionReviewTool

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/RedactionReviewTool.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/RedactionReviewTool.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/RedactionReviewTool
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { RedactionReviewTool } from "@/components/nyc-tron/ui/components/forge/pdf/RedactionReviewTool";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { RedactionReviewTool } from "@nyc-tron/ui/components/forge/pdf/RedactionReviewTool";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/RedactionReviewTool.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `marks` | `readonly PDFRedactionMark[]` | not recorded | yes |  |
| `planRevision` | `string \| number` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `preview` | `ReactNode` | not recorded | yes |  |
| `review` | `{ status: 'unreviewed' \| 'checking' \| 'ready' \| 'error'; planRevision: string \| number \| null; message?: string; }` | not recorded | yes |  |
| `status` | `'idle' \| 'applying' \| 'applied' \| 'error'` | not recorded | yes |  |
| `appliedCount` | `number` | not recorded | yes |  |
| `canApply` | `boolean` | not recorded | yes |  |
| `error` | `string` | not recorded | no |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onAddFromSelection` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRemoveMark` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onReview` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onApply` | `(ids: readonly string[], expectedPlanRevision: string \| number, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `unstyled` | `boolean` | not recorded | no |  |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
| State | How it is set |
|---|---|
| `error` | `error` prop, type `string` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/RedactionReviewTool.tsx -->
- `accessibilityLabel`: "PDF redaction review"
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "header"
- `accessibilityState`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
