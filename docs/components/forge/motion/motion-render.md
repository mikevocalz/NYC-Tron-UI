---
name: "MotionRenderModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/motion/motion-render"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# MotionRenderModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/motion-render.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/motion-render.ts -->
- Package: @nyc-tron/ui
- Import: `import { moveQueuedRenderJob, validateMotionRenderJobs, validateMotionRenderSettings, validateRenderChoices } from "@nyc-tron/ui/forge/motion/motion-render";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/motion/motion-render
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/motion-render.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `MotionRenderFormat` | interface | `interface MotionRenderFormat { readonly id: string; readonly label: string; readonly kind: 'video' \| 'image-sequence'; readonly supportsAlpha: boolean; }` |
| `MotionRenderJob` | interface | `interface MotionRenderJob { readonly id: string; readonly label: string; readonly settings: MotionRenderSettings; readonly status: 'queued' \| 'running' \| 'co...` |
| `MotionRenderProfile` | interface | `interface MotionRenderProfile { readonly id: string; readonly label: string; }` |
| `MotionRenderSettings` | interface | `interface MotionRenderSettings { readonly compositionId: string; readonly formatId: string; readonly profileId: string; readonly destinationId: string; reado...` |
| `moveQueuedRenderJob` | function | `function moveQueuedRenderJob(jobs: readonly MotionRenderJob[], id: string, direction: -1 \| 1): readonly string[];` |
| `validateMotionRenderJobs` | function | `function validateMotionRenderJobs(jobs: readonly MotionRenderJob[]): void;` |
| `validateMotionRenderSettings` | function | `function validateMotionRenderSettings(value: MotionRenderSettings, allowDraftName?: boolean): void;` |
| `validateRenderChoices` | function | `function validateRenderChoices(choices: readonly { readonly id: string; readonly label: string; }[], name: string): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/motion-render.ts -->
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
