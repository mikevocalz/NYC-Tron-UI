---
name: "CommentsThreadPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/pdf/CommentsThreadPanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["CommentsThreadPanel.leading.21", "color.accent", "color.border", "color.danger", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "opacity.0_7", "radius.card", "radius.control", "space.0.5", "space.1", "space.1.5", "space.2", "space.2.5", "space.3"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/office/office-controls"]
a11yStatus: "declared"
---

# CommentsThreadPanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/CommentsThreadPanel.tsx -->
PDF comment threads (K-07), grouped by page: author, time, body, replies, and reply / resolve / delete when the host can save them.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/CommentsThreadPanel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { CommentsThreadPanel } from "@nyc-tron/ui/forge/pdf/CommentsThreadPanel";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/office/office-controls

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/CommentsThreadPanel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/CommentsThreadPanel.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `threads` | `readonly CommentThread[]` | not recorded | yes |  |
| `groupBy` | `'page' \| 'none'` | not recorded | no |  |
| `describeLocation` | `(thread: CommentThread) => string` | not recorded | no |  |
| `selectedId` | `string` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
| `mentions` | `readonly { id: string; label: string; }[]` | not recorded | no |  |
| `onSelect` | `(id: string) => void` | not recorded | yes | Shows the thread's page and anchor. |
| `onReply` | `(threadId: string, body: string, mentions?: readonly string[]) => void \| Promise<unknown>` | not recorded | no | Adds a reply. Rejecting keeps the draft so nothing typed is lost. |
| `onResolvedChange` | `(threadId: string, resolved: boolean) => void \| Promise<unknown>` | not recorded | no |  |
| `onDelete` | `(threadId: string) => void \| Promise<unknown>` | not recorded | no |  |
| `filter` | `CommentFilter` | not recorded | no | The filter row renders only when `onResolvedChange` is passed (otherwise nothing is ever resolved). |
| `onFilterChange` | `(filter: CommentFilter) => void` | not recorded | no |  |
| `error` | `string` | not recorded | no | Read failed: shown instead of the list. "No comments" is only said after a successful read. |
| `onRetry` | `() => void` | not recorded | no |  |
| `label` | `string` | `"Comments"` | no |  |
| `className` | `string` | not recorded | no |  |
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
| `disabled` | `disabled` prop, type `boolean` |
| `error` | `error` prop, type `string` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/CommentsThreadPanel.tsx -->
- `accessibilityHint`: "Shows this comment on its page"
- `accessibilityLabel`: "Delete comment on page ", "Reply to ", "Show comments"
- `accessibilityLiveRegion`: "assertive", "polite"
- `accessibilityRole`: "button", "header", "radio", "radiogroup"
- `accessibilityState`: set from an expression
- `role`: "region"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
