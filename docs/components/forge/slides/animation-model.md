---
name: "AnimationModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/slides/animation-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# AnimationModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/animation-model.ts -->
When in a slide's life an effect plays.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/animation-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/slides/animation-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ANIMATION_MAX_SECONDS, SLIDE_ANIMATION_EFFECTS, effectLabel, formatSeconds, parseSeconds, playOrder, timelineEnd } from "@/components/nyc-tron/ui/components/forge/slides/animation-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ANIMATION_MAX_SECONDS, SLIDE_ANIMATION_EFFECTS, effectLabel, formatSeconds, parseSeconds, playOrder, timelineEnd } from "@nyc-tron/ui/components/forge/slides/animation-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/animation-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ANIMATION_MAX_SECONDS` | const | `const ANIMATION_MAX_SECONDS = 600;` |
| `AnimationCategory` | type | `type AnimationCategory = "entrance" \| "emphasis" \| "exit";` |
| `AnimationEffect` | interface | `interface AnimationEffect { readonly kind: string; readonly category: AnimationCategory; readonly label: string; }` |
| `SLIDE_ANIMATION_EFFECTS` | const | `const SLIDE_ANIMATION_EFFECTS: { readonly fadeIn: { readonly kind: "fadeIn"; readonly category: "entrance"; readonly label: "Fade in"; }; readonly slideInLef...` |
| `SlideAnimation` | interface | `interface SlideAnimation { readonly index: number; readonly objectId: string; readonly kind: string; readonly startS: number; readonly durationS: number; rea...` |
| `effectLabel` | function | `function effectLabel(kind: string, effects: readonly AnimationEffect[]): string;` |
| `formatSeconds` | function | `function formatSeconds(v: number): string;` |
| `parseSeconds` | function | `function parseSeconds(text: string, { allowZero }: { allowZero: boolean; }): { value: number; } \| { error: string; };` |
| `playOrder` | function | `function playOrder(animations: readonly SlideAnimation[]): SlideAnimation[];` |
| `timelineEnd` | function | `function timelineEnd(animations: readonly SlideAnimation[]): number;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/animation-model.ts -->
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
