---
name: "CommentPins"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/design/CommentPins"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/forge/pdf/CommentsThreadPanel"]
a11yStatus: "unverified"
---

# CommentPins

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/design/CommentPins.tsx -->
Pins and the shared thread panel reference the same authoritative thread IDs.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/design/CommentPins.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/forge/pdf/CommentsThreadPanel

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/design/CommentPins
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { CommentPins } from "@/components/nyc-tron/ui/components/forge/design/CommentPins";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { CommentPins } from "@nyc-tron/ui/components/forge/design/CommentPins";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/design/CommentPins.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `pins` | `readonly { threadId: string; x: number; y: number; label: string; }[]` | not recorded | yes |  |
| `viewport` | `{ width: number; height: number; }` | not recorded | yes |  |
| `comments` | `Omit<CommentsThreadPanelProps, 'scope' \| 'revision' \| 'groupBy'>` | not recorded | yes |  |
| `unstyled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/design/CommentPins.tsx -->
- `accessibilityLabel`: set from an expression
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
