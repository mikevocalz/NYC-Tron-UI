---
name: "SafeAreaOverlay"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/SafeAreaOverlay"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.textMuted"]
registryDependencies: []
a11yStatus: "unverified"
---

# SafeAreaOverlay

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/SafeAreaOverlay.tsx -->
Guides over a video monitor (D-25): action- and title-safe boxes, an aspect-ratio framing mask, a center cross and thirds.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/SafeAreaOverlay.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/SafeAreaOverlay
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { SafeAreaOverlay } from "@/components/nyc-tron/ui/components/forge/timeline/SafeAreaOverlay";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { SafeAreaOverlay } from "@nyc-tron/ui/components/forge/timeline/SafeAreaOverlay";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/SafeAreaOverlay.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `aspect` | `number` | not recorded | yes | The picture's aspect ratio (width / height), e.g. 16 / 9. |
| `safeArea` | `SafeAreaSpec` | `"smpte" (action 93%, title 90%)` | no |  |
| `showSafeAreas` | `boolean` | `true` | no | Draws action- and title-safe boxes. |
| `guide` | `number` | not recorded | no | Framing guides to mask to, as width / height (e.g. FRAME_GUIDES.scope). The area outside is dimmed. |
| `showCenter` | `boolean` | `false` | no | Center cross. |
| `showThirds` | `boolean` | `false` | no | Rule-of-thirds lines. |
| `className` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/SafeAreaOverlay.tsx -->
_Not documented._
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
```tsx example=SafeAreaOverlay
import { SafeAreaOverlay } from "@/components/nyc-tron/ui/components/forge/timeline/SafeAreaOverlay";

export function Example() {
  return <SafeAreaOverlay aspect={0} />;
}
```
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
