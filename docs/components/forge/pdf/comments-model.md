---
name: "CommentsModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/pdf/comments-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# CommentsModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/comments-model.ts -->
One comment in a thread.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/comments-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { groupThreads, resolveReply, threadCounts, threadLabel } from "@nyc-tron/ui/components/forge/pdf/comments-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/comments-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/comments-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `CommentEntry` | interface | `interface CommentEntry { readonly id: string; readonly body: string; readonly author?: string; readonly timeLabel?: string; }` |
| `CommentFilter` | type | `type CommentFilter = "open" \| "resolved" \| "all";` |
| `CommentThread` | interface | `interface CommentThread extends CommentEntry { readonly page: number; readonly replies: readonly CommentEntry[]; readonly resolved?: boolean; }` |
| `groupThreads` | function | `function groupThreads(threads: readonly CommentThread[], filter?: CommentFilter): Array<{ page: number; threads: CommentThread[]; }>;` |
| `resolveReply` | function | `function resolveReply(draft: string): string \| undefined;` |
| `threadCounts` | function | `function threadCounts(threads: readonly CommentThread[]): { open: number; resolved: number; all: number; };` |
| `threadLabel` | function | `function threadLabel(t: CommentThread): string;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/comments-model.ts -->
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
