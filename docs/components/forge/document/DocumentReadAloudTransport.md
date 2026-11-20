---
name: "DocumentReadAloudTransport"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/document/DocumentReadAloudTransport"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/forge/office/ReadAloudTransport"]
a11yStatus: "unverified"
---

# DocumentReadAloudTransport

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/DocumentReadAloudTransport.tsx -->
Read Aloud for a text document (H-21).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/DocumentReadAloudTransport.tsx -->
- Package: @nyc-tron/ui
- Import: `import { DocumentReadAloudTransport } from "@nyc-tron/ui/components/forge/document/DocumentReadAloudTransport";`
- Peers: react, react-native
- Requires: @nyc-tron/forge/office/ReadAloudTransport

```sh
npx shadcn@latest add @nyc-tron/forge/document/DocumentReadAloudTransport
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/DocumentReadAloudTransport.tsx -->
Extends: `Omit<ReadAloudTransportProps, "context" | "label">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `describeBlock` | `(block: number) => string \| undefined` | not recorded | no | Names the part of the document a block belongs to, usually the nearest heading above it ("Budget › Travel"). Shown above the sentence. |
| `label` | `string` | `"Read document aloud"` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/DocumentReadAloudTransport.tsx -->
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
