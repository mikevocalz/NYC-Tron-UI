---
name: "NavigationOutline"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/document/NavigationOutline"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceRaised", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/office/office-controls"]
a11yStatus: "unverified"
---

# NavigationOutline

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/NavigationOutline.tsx -->
Navigation pane for text documents (H-15): the heading outline with collapse and the current section marked, a page list, and bookmarks.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/NavigationOutline.tsx -->
- Package: @nyc-tron/ui
- Import: `import { NavigationOutline } from "@nyc-tron/ui/components/forge/document/NavigationOutline";`
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/office/office-controls

```sh
npx shadcn@latest add @nyc-tron/forge/document/NavigationOutline
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/NavigationOutline.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `headings` | `readonly OutlineHeading[]` | not recorded | yes |  |
| `caretBlock` | `number` | not recorded | no | Block the caret is in; the heading above it is marked current. |
| `onJumpToHeading` | `(heading: OutlineHeading) => void` | not recorded | yes | Moves the editor to a heading. |
| `pageCount` | `number` | not recorded | no | Laid-out page count. The Pages view renders only with this and `onJumpToPage`. |
| `onJumpToPage` | `(page: number) => void` | not recorded | no |  |
| `renderPageThumbnail` | `(page: number) => ReactNode` | not recorded | no | Thumbnail for a page (the host's renderer). Without it the Pages view lists pages by their first heading. |
| `bookmarks` | `readonly OutlineBookmark[]` | not recorded | no | The Bookmarks view renders only with `onJumpToBookmark`. |
| `onJumpToBookmark` | `(bookmark: OutlineBookmark) => void` | not recorded | no |  |
| `showLevel` | `number` | `0` | no | Show headings down to this level (1–9); 0 shows every level. |
| `disabled` | `boolean` | not recorded | no |  |
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
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/NavigationOutline.tsx -->
- `accessibilityLabel`: "Bookmark ", "Heading ", "Navigation", "Page "
- `accessibilityRole`: "button", "link", "tab", "tablist"
- `accessibilityState`: set from an expression
- `role`: "navigation"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
