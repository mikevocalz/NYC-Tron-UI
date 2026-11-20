---
name: "RecordingArmButton"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/RecordingArmButton"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# RecordingArmButton

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/RecordingArmButton.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/RecordingArmButton.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/RecordingArmButton
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { RecordingArmButton } from "@/components/nyc-tron/ui/components/forge/audio/RecordingArmButton";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { RecordingArmButton } from "@nyc-tron/ui/components/forge/audio/RecordingArmButton";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/RecordingArmButton.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `trackId` | `string` | not recorded | yes |  |
| `label` | `string` | not recorded | yes |  |
| `armed` | `boolean` | not recorded | yes |  |
| `recording` | `boolean` | not recorded | yes |  |
| `error` | `string` | not recorded | no |  |
| `onArmChange` | `(trackId: string, armed: boolean, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
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
| `error` | `error` prop, type `string` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/RecordingArmButton.tsx -->
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
