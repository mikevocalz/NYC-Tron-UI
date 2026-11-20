---
name: "ColorManagementModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/color-management"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ColorManagementModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/color-management.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/color-management.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/color/color-management
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { validateColorChannels, validateGamutReport, validateNamedColor, validatePrintColor, validateProfiles, validateSoftProof } from "@/components/nyc-tron/ui/components/forge/color/color-management";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { validateColorChannels, validateGamutReport, validateNamedColor, validatePrintColor, validateProfiles, validateSoftProof } from "@nyc-tron/ui/components/forge/color/color-management";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/color-management.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ColorConversionPolicy` | type | `type ColorConversionPolicy = "preserve-numbers" \| "preserve-appearance";` |
| `ColorProfile` | interface | `interface ColorProfile { readonly id: string; readonly label: string; readonly model: "rgb" \| "cmyk" \| "gray" \| "lab"; }` |
| `GamutReport` | interface | `interface GamutReport { readonly sourceProfileId: string; readonly destinationProfileId: string; readonly outside: number; readonly total: number; readonly m...` |
| `NamedColor` | interface | `interface NamedColor { readonly id: string; readonly name: string; readonly kind: "spot" \| "global"; readonly tint: number; readonly overprint?: boolean; rea...` |
| `PrintColor` | interface | `interface PrintColor { readonly profileId: string; readonly model?: "cmyk" \| "lab"; readonly channels: readonly [ number, number, number, number ] \| readonly...` |
| `ProfileColor` | interface | `interface ProfileColor { readonly profileId: string; readonly channels: readonly number[]; readonly alpha: number; readonly preview: RgbaColor; }` |
| `SoftProofSettings` | interface | `interface SoftProofSettings { readonly enabled: boolean; readonly profileId: string \| null; readonly intent: "perceptual" \| "relative-colorimetric" \| "satura...` |
| `ThemeColorReference` | interface | `interface ThemeColorReference { readonly id: string; readonly label: string; readonly source: string; readonly preview: RgbaColor; }` |
| `WideGamutColor` | interface | `interface WideGamutColor { readonly profileId: string; readonly channels: readonly [ number, number, number ]; readonly alpha: number; }` |
| `validateColorChannels` | function | `function validateColorChannels(color: PrintColor \| WideGamutColor, count: number, min: number, max: number): void;` |
| `validateGamutReport` | function | `function validateGamutReport(report: GamutReport): void;` |
| `validateNamedColor` | function | `function validateNamedColor(color: NamedColor): void;` |
| `validatePrintColor` | function | `function validatePrintColor(color: PrintColor, labRange?: readonly [ number, number ]): void;` |
| `validateProfiles` | function | `function validateProfiles(profiles: readonly ColorProfile[]): void;` |
| `validateSoftProof` | function | `function validateSoftProof(settings: SoftProofSettings, profiles: readonly ColorProfile[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/color-management.ts -->
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
