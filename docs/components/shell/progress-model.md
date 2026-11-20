---
name: "ProgressModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/progress-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ProgressModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/progress-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/progress-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { jobActionLabel, validateFeedback } from "@nyc-tron/ui/components/shell/progress-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/progress-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/progress-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `JobAction` | type | `type JobAction = "cancel" \| "pause" \| "resume" \| "retry";` |
| `ProgressJob` | type | `type ProgressJob = JobBase & ({ readonly status: "queued" \| "running" \| "paused" \| "cancelling" \| "completed" \| "cancelled"; readonly error?: never; } \| { re...` |
| `ToastMessage` | interface | `interface ToastMessage { readonly id: string; readonly title: string; readonly detail?: string; readonly tone: "info" \| "success" \| "error"; readonly action?...` |
| `jobActionLabel` | const | `const jobActionLabel: Record<JobAction, string>;` |
| `validateFeedback` | function | `function validateFeedback(toasts: readonly ToastMessage[], jobs: readonly ProgressJob[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/progress-model.ts -->
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
