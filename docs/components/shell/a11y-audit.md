---
name: "A11yAuditModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/a11y-audit"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# A11yAuditModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/a11y-audit.ts -->
A static screen-reader audit over a rendered element tree: the plain `{type, props}` objects a test renderer or a mocked `jsx` produces.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/a11y-audit.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/a11y-audit
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { auditAccessibility } from "@/components/nyc-tron/ui/components/shell/a11y-audit";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { auditAccessibility } from "@nyc-tron/ui/components/shell/a11y-audit";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/a11y-audit.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `A11yAuditOptions` | interface | `interface A11yAuditOptions { minTarget?: number; ignore?: readonly A11yRule[]; }` |
| `A11yIssue` | interface | `interface A11yIssue { readonly rule: A11yRule; readonly path: string; readonly label?: string; readonly message: string; }` |
| `A11yRule` | type | `type A11yRule = "missing-name" \| "adjustable-without-value" \| "adjustable-without-actions" \| "actions-without-handler" \| "custom-action-without-label" \| "sma...` |
| `auditAccessibility` | function | `function auditAccessibility(tree: unknown, options?: A11yAuditOptions): A11yIssue[];` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/a11y-audit.ts -->
- `role`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
