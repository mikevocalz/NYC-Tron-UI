---
name: "UnitExpressionModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/unit-expression"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# UnitExpressionModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/unit-expression.ts -->
Bounded unit arithmetic for {@linkcode UnitInput}.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/unit-expression.ts -->
- Package: @nyc-tron/ui
- Import: `import { UNITS, UNIT_EXPRESSION_LIMITS, convertFromBase, formatUnitValue, parseUnitExpression, unitPrecision, unitScale } from "@nyc-tron/ui/shell/unit-expression";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/unit-expression
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/unit-expression.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `UNITS` | const | `const UNITS: { readonly length: readonly [ "px", "pt", "mm", "cm", "in", "%" ]; readonly time: readonly [ "s", "ms", "f", "smp" ]; readonly level: readonly [...` |
| `UNIT_EXPRESSION_LIMITS` | const | `const UNIT_EXPRESSION_LIMITS: { readonly maxLength: 128; readonly maxTokens: 64; readonly maxDepth: 8; };` |
| `UnitContext` | interface | `interface UnitContext { readonly dimension: UnitDimension; readonly unit: UnitName; readonly pixelsPerInch?: number; readonly frameRate?: number; readonly sa...` |
| `UnitDimension` | type | `type UnitDimension = "length" \| "time" \| "level" \| "ratio";` |
| `UnitName` | type | `type UnitName = (typeof UNITS)[UnitDimension][number];` |
| `UnitParseResult` | type | `type UnitParseResult = { readonly ok: true; readonly value: number; } \| { readonly ok: false; readonly error: string; readonly at: number; };` |
| `convertFromBase` | function | `function convertFromBase(value: number, unit: UnitName, ctx: UnitContext): number;` |
| `formatUnitValue` | function | `function formatUnitValue(value: number, ctx: UnitContext, unit?: UnitName): string;` |
| `parseUnitExpression` | function | `function parseUnitExpression(text: string, ctx: UnitContext): UnitParseResult;` |
| `unitPrecision` | function | `function unitPrecision(unit: UnitName): number;` |
| `unitScale` | function | `function unitScale(unit: string, ctx: UnitContext): number;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/unit-expression.ts -->
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
