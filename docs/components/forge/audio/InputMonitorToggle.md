---
name: "InputMonitorToggle"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/InputMonitorToggle"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/SegmentedControl", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# InputMonitorToggle

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/InputMonitorToggle.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/InputMonitorToggle.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/SegmentedControl, @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/InputMonitorToggle
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { InputMonitorToggle } from "@/components/nyc-tron/ui/components/forge/audio/InputMonitorToggle";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { InputMonitorToggle } from "@nyc-tron/ui/components/forge/audio/InputMonitorToggle";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/InputMonitorToggle.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `InputMonitorMode` | not recorded | yes |  |
| `hardwareSupported` | `boolean` | not recorded | yes |  |
| `softwareSupported` | `boolean` | not recorded | yes |  |
| `feedbackRisk` | `boolean` | not recorded | yes |  |
| `feedbackAcknowledged` | `boolean` | not recorded | yes |  |
| `onAcknowledgeFeedback` | `(signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onChange` | `(mode: InputMonitorMode, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/InputMonitorToggle.tsx -->
- `accessibilityLabel`: "Input monitoring"
- `aria-label`: "Monitor input"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
