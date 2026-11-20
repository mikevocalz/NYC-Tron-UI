---
name: "MotionExpressionModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/motion/motion-expression"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# MotionExpressionModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/motion-expression.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/motion-expression.ts -->
- Package: @nyc-tron/ui
- Import: `import { EXPRESSION_MAX_LENGTH, isExpressionBoundary, replaceExpressionRange, validateExpressionCompletions, validateExpressionDiagnostics, validateExpressionRange, validateExpressionReferences, validateExpressionText } from "@nyc-tron/ui/components/forge/motion/motion-expression";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/motion/motion-expression
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/motion-expression.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `EXPRESSION_MAX_LENGTH` | const | `const EXPRESSION_MAX_LENGTH = 65536;` |
| `ExpressionCompletion` | interface | `interface ExpressionCompletion { readonly id: string; readonly label: string; readonly detail?: string; readonly range: ExpressionRange; readonly insertText:...` |
| `ExpressionDiagnostic` | interface | `interface ExpressionDiagnostic { readonly id: string; readonly severity: 'error' \| 'warning' \| 'information'; readonly message: string; readonly range: Expre...` |
| `ExpressionQuery` | interface | `interface ExpressionQuery { readonly text: string; readonly selection: ExpressionRange; readonly references: readonly ExpressionReference[]; }` |
| `ExpressionRange` | interface | `interface ExpressionRange { readonly start: number; readonly end: number; }` |
| `ExpressionReference` | interface | `interface ExpressionReference { readonly id: string; readonly label: string; readonly insertText: string; readonly detail?: string; }` |
| `isExpressionBoundary` | function | `function isExpressionBoundary(text: string, offset: number): boolean;` |
| `replaceExpressionRange` | function | `function replaceExpressionRange(text: string, range: ExpressionRange, insertText: string): { text: string; selection: ExpressionRange; };` |
| `validateExpressionCompletions` | function | `function validateExpressionCompletions(text: string, items: readonly ExpressionCompletion[]): void;` |
| `validateExpressionDiagnostics` | function | `function validateExpressionDiagnostics(text: string, items: readonly ExpressionDiagnostic[]): void;` |
| `validateExpressionRange` | function | `function validateExpressionRange(text: string, range: ExpressionRange): void;` |
| `validateExpressionReferences` | function | `function validateExpressionReferences(references: readonly ExpressionReference[]): void;` |
| `validateExpressionText` | function | `function validateExpressionText(text: string): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/motion-expression.ts -->
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
