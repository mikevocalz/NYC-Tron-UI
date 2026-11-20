---
name: "StatusModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/status-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# StatusModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/status-model.ts -->
What the document is doing right now, as shown by {@linkcode StatusBar}.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/status-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/status-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { activityAnnouncement, formatElapsed, formatZoom, progressPercent, selectionSummary, stepZoom } from "@/components/nyc-tron/ui/components/shell/status-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { activityAnnouncement, formatElapsed, formatZoom, progressPercent, selectionSummary, stepZoom } from "@nyc-tron/ui/components/shell/status-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/status-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `SelectionNoun` | interface | `interface SelectionNoun { readonly one: string; readonly other: string; }` |
| `StatusActivity` | type | `type StatusActivity = { readonly kind: "idle"; } \| { readonly kind: "saving"; } \| { readonly kind: "rendering"; readonly progress?: number; readonly label?: ...` |
| `activityAnnouncement` | function | `function activityAnnouncement(activity: StatusActivity): string;` |
| `formatElapsed` | function | `function formatElapsed(ms: number): string;` |
| `formatZoom` | function | `function formatZoom(percent: number): string;` |
| `progressPercent` | function | `function progressPercent(progress: number \| undefined): number \| undefined;` |
| `selectionSummary` | function | `function selectionSummary(count: number, noun?: SelectionNoun): string;` |
| `stepZoom` | function | `function stepZoom(value: number, presets: readonly number[], direction: 1 \| -1): number;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/status-model.ts -->
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
