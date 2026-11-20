---
name: "ExpressionEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/motion/ExpressionEditor"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.border", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/SegmentedControl", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# ExpressionEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/ExpressionEditor.tsx -->
Native code text input with explicit, cancellable host language services.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/ExpressionEditor.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/SegmentedControl, @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/motion/ExpressionEditor
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ExpressionEditor } from "@/components/nyc-tron/ui/components/forge/motion/ExpressionEditor";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ExpressionEditor } from "@nyc-tron/ui/components/forge/motion/ExpressionEditor";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/ExpressionEditor.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes |  |
| `revision` | `string \| number` | not recorded | yes |  |
| `value` | `string` | not recorded | yes |  |
| `onChange` | `(text: string) => void` | not recorded | yes |  |
| `references` | `readonly ExpressionReference[]` | not recorded | yes |  |
| `onComplete` | `(query: ExpressionQuery, signal: AbortSignal) => readonly ExpressionCompletion[] \| Promise<readonly ExpressionCompletion[]>` | not recorded | yes |  |
| `onValidate` | `(text: string, signal: AbortSignal) => readonly ExpressionDiagnostic[] \| Promise<readonly ExpressionDiagnostic[]>` | not recorded | yes |  |
| `onApply` | `(text: string, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
| `inputClassName` | `string` | not recorded | no | Host-authored text, font, border and density overrides for the native source input. |
| `inputStyle` | `StyleProp<TextStyle>` | not recorded | no |  |
| `height` | `number` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/ExpressionEditor.tsx -->
- `accessibilityLabel`: "Apply expression", "Complete expression", "Done editing expression", "Expression completions", "Expression diagnostics", "Expression references", "Expression source", "Validate expression"
- `accessibilityLiveRegion`: "polite"
- `aria-label`: "Expression panel section"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
