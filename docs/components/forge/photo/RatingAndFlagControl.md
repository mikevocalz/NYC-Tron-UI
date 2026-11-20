---
name: "RatingAndFlagControl"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/photo/RatingAndFlagControl"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/SegmentedControl", "@nyc-tron/Select"]
a11yStatus: "unverified"
---

# RatingAndFlagControl

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/RatingAndFlagControl.tsx -->
Independent star, named color-label and mutually exclusive pick/reject fields.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/RatingAndFlagControl.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/SegmentedControl, @nyc-tron/Select

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/photo/RatingAndFlagControl
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { RatingAndFlagControl } from "@/components/nyc-tron/ui/components/forge/photo/RatingAndFlagControl";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { RatingAndFlagControl } from "@nyc-tron/ui/components/forge/photo/RatingAndFlagControl";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/RatingAndFlagControl.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `PhotoRating` | not recorded | yes |  |
| `onCommit` | `(value: PhotoRating) => void` | not recorded | yes |  |
| `disabled` | `boolean` | not recorded | no |  |
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
| `disabled` | `disabled` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/RatingAndFlagControl.tsx -->
- `accessibilityLabel`: "Photo star rating"
- `accessibilityRole`: "radio", "radiogroup"
- `accessibilityState`: set from an expression
- `aria-checked`: set from an expression
- `aria-label`: "Photo flag"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
