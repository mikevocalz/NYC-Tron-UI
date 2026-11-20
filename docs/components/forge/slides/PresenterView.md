---
name: "PresenterView"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/slides/PresenterView"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# PresenterView

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/PresenterView.tsx -->
Presenter clock/elapsed values follow the host session.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/PresenterView.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/slides/PresenterView
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { PresenterView } from "@/components/nyc-tron/ui/components/forge/slides/PresenterView";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { PresenterView } from "@nyc-tron/ui/components/forge/slides/PresenterView";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/PresenterView.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `currentSlideLabel` | `string` | not recorded | yes |  |
| `nextSlideLabel` | `string \| null` | not recorded | yes |  |
| `currentSurface` | `ReactNode` | not recorded | yes |  |
| `nextSurface` | `ReactNode` | not recorded | yes |  |
| `notes` | `ReactNode` | not recorded | yes |  |
| `aspectRatio` | `number` | not recorded | yes |  |
| `slideIndex` | `number` | not recorded | yes |  |
| `slideCount` | `number` | not recorded | yes |  |
| `clockLabel` | `string` | not recorded | yes |  |
| `elapsedMs` | `number` | not recorded | yes |  |
| `paused` | `boolean` | not recorded | yes |  |
| `blackout` | `boolean` | not recorded | yes |  |
| `onNavigate` | `(direction: -1 \| 1, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onPauseChange` | `(paused: boolean, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onBlackoutChange` | `(blackout: boolean, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onEnd` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/PresenterView.tsx -->
- `accessibilityLabel`: "Presenter view", "Speaker notes"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
