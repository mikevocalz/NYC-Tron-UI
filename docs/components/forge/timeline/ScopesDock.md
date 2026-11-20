---
name: "ScopesDock"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/ScopesDock"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/SegmentedControl", "@nyc-tron/forge/color/VideoScopesPanel"]
a11yStatus: "unverified"
---

# ScopesDock

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/ScopesDock.tsx -->
Actual decoder/compositor measurements, with source/program assignment and stale-frame disclosure.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/ScopesDock.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/SegmentedControl, @nyc-tron/forge/color/VideoScopesPanel

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/ScopesDock
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ScopesDock } from "@/components/nyc-tron/ui/components/forge/timeline/ScopesDock";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ScopesDock } from "@nyc-tron/ui/components/forge/timeline/ScopesDock";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/ScopesDock.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `target` | `'source' \| 'program'` | not recorded | yes |  |
| `onTargetChange` | `(target: 'source' \| 'program') => void` | not recorded | yes |  |
| `source` | `VideoScopesPanelProps` | not recorded | yes |  |
| `program` | `VideoScopesPanelProps` | not recorded | yes |  |
| `expectedFrameTimeUs` | `number` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/ScopesDock.tsx -->
- `accessibilityLabel`: "Video scopes dock"
- `accessibilityLiveRegion`: "polite"
- `aria-label`: "Scope source"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
