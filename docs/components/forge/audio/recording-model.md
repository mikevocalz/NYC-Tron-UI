---
name: "RecordingModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/recording-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# RecordingModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/recording-model.ts -->
Presentational recording states.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/recording-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/recording-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { formatElapsed, presentRecording, spokenElapsed } from "@/components/nyc-tron/ui/components/forge/audio/recording-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { formatElapsed, presentRecording, spokenElapsed } from "@nyc-tron/ui/components/forge/audio/recording-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/recording-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `RecordingAction` | type | `type RecordingAction = "start" \| "stop" \| "save-interrupted" \| "retry" \| "open-settings";` |
| `RecordingPresentation` | interface | `interface RecordingPresentation { readonly status: string; readonly action?: { readonly kind: RecordingAction; readonly label: string; }; readonly isBusy: bo...` |
| `RecordingViewState` | type | `type RecordingViewState = { readonly kind: "idle"; } \| { readonly kind: "requesting-permission"; } \| { readonly kind: "permission-denied"; } \| { readonly kin...` |
| `formatElapsed` | function | `function formatElapsed(durationMs: number): string;` |
| `presentRecording` | function | `function presentRecording(state: RecordingViewState, canOpenSettings: boolean): RecordingPresentation;` |
| `spokenElapsed` | function | `function spokenElapsed(durationMs: number): string;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/recording-model.ts -->
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
