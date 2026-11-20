---
name: "RehearsalTimers"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/slides/RehearsalTimers"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "color.textMuted", "space.1.5", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# RehearsalTimers

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/RehearsalTimers.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/RehearsalTimers.tsx -->
- Package: @nyc-tron/ui
- Import: `import { RehearsalTimers } from "@nyc-tron/ui/forge/slides/RehearsalTimers";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/slides/RehearsalTimers
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/RehearsalTimers.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `status` | `'idle' \| 'running' \| 'paused' \| 'finished'` | not recorded | yes |  |
| `elapsedMs` | `number` | not recorded | yes |  |
| `activeSlideElapsedMs` | `number` | not recorded | yes |  |
| `activeSlideLabel` | `string` | not recorded | yes |  |
| `timings` | `readonly { slideId: string; label: string; durationMs: number; }[]` | not recorded | yes |  |
| `onAction` | `(action: 'start' \| 'pause' \| 'resume' \| 'finish' \| 'reset' \| 'save', signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/RehearsalTimers.tsx -->
- `accessibilityLabel`: "Rehearsal timings"
- `accessibilityLiveRegion`: "polite"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
