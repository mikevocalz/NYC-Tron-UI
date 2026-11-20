---
name: "SlideFilmstrip"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/slides/SlideFilmstrip"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/office/office-controls", "@nyc-tron/forge/slides/SlideThumbnail"]
a11yStatus: "unverified"
---

# SlideFilmstrip

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/SlideFilmstrip.tsx -->
Vertical slide filmstrip (J-01): numbered thumbnails drawn from the slide's objects, selection, reorder by the grip, Alt+Up/Down or screen-reader actions, add, and remove (Delete key or action).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/SlideFilmstrip.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/office/office-controls, @nyc-tron/forge/slides/SlideThumbnail

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/slides/SlideFilmstrip
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { SlideFilmstrip } from "@/components/nyc-tron/ui/components/forge/slides/SlideFilmstrip";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { SlideFilmstrip } from "@nyc-tron/ui/components/forge/slides/SlideFilmstrip";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/SlideFilmstrip.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `slides` | `readonly SlideSummary[]` | not recorded | yes |  |
| `sections` | `readonly { id: string; label: string; startSlideId: string; }[]` | not recorded | no |  |
| `viewportHeight` | `number` | not recorded | no |  |
| `selectedId` | `string` | not recorded | no |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onMove` | `(id: string, toIndex: number) => void \| Promise<unknown>` | not recorded | no | Moves a slide to `toIndex` (0-based). Drag, Alt+Up/Down and screen-reader actions call it once per move. |
| `onAdd` | `() => void \| Promise<unknown>` | not recorded | no | Adds a slide. Where it goes is the host engine's call (Pitch appends). |
| `onRemove` | `(id: string) => void \| Promise<unknown>` | not recorded | no | Removes a slide. Not offered when only one slide is left. |
| `size` | `SlideSize` | not recorded | no |  |
| `renderImage` | `(src: string, object: SlideObject) => ReactNode` | not recorded | no |  |
| `thumbnailWidth` | `number` | `136` | no | Thumbnail width in points. |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | no | `horizontal` lays slides out in a row for phones and short panes; drag and Alt+Left/Right then reorder along it. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/SlideFilmstrip.tsx -->
- `accessibilityLabel`: "New slide", "Slides"
- `accessibilityRole`: "button", "header"
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
