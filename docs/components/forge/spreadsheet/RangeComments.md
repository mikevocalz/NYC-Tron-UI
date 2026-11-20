---
name: "RangeComments"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/spreadsheet/RangeComments"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/forge/pdf/CommentsThreadPanel"]
a11yStatus: "unverified"
---

# RangeComments

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/RangeComments.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/RangeComments.tsx -->
- Package: @nyc-tron/ui
- Import: `import { RangeComments } from "@nyc-tron/ui/forge/spreadsheet/RangeComments";`
- Peers: react, react-native
- Requires: @nyc-tron/forge/pdf/CommentsThreadPanel

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/RangeComments
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/RangeComments.tsx -->
Extends: `Omit<CommentsThreadPanelProps, 'groupBy' | 'describeLocation'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `anchors` | `Readonly<Record<string, string>>` | not recorded | yes | Actual workbook/sheet/range label per thread, e.g. Budget!B4:E9. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/RangeComments.tsx -->
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
