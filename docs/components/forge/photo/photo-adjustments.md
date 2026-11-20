---
name: "PhotoAdjustmentsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/photo/photo-adjustments"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# PhotoAdjustmentsModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/photo-adjustments.ts -->
Non-destructive, versioned settings.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/photo-adjustments.ts -->
- Package: @nyc-tron/ui
- Import: `import { EXPOSURE_FIELDS, PHOTO_BANDS, TONE_FIELDS, defaultPhotoDevelop, parsePhotoDevelop, serializePhotoDevelop, validateEightBand, validateExposure } from "@nyc-tron/ui/forge/photo/photo-adjustments";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/photo/photo-adjustments
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/photo-adjustments.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `BandAdjustment` | interface | `interface BandAdjustment { readonly hue: number; readonly saturation: number; readonly luminance: number; }` |
| `EXPOSURE_FIELDS` | const | `const EXPOSURE_FIELDS: readonly [ readonly [ 'exposure', 'Exposure EV', -10, 10, 0.1 ], readonly [ 'temperature', 'Temperature kelvin', 1000, 50000, 100 ], r...` |
| `EightBandSettings` | type | `type EightBandSettings = Readonly<Record<PhotoBand, BandAdjustment>>;` |
| `ExposureSettings` | interface | `interface ExposureSettings { readonly exposure: number; readonly temperature: number; readonly tint: number; readonly highlights: number; readonly shadows: n...` |
| `LensSettings` | interface | `interface LensSettings { readonly enabled: boolean; readonly profileId: string \| null; readonly distortion: number; readonly chromaticAberration: boolean; }` |
| `PHOTO_BANDS` | const | `const PHOTO_BANDS: readonly [ 'red', 'orange', 'yellow', 'green', 'aqua', 'blue', 'purple', 'magenta' ];` |
| `PhotoBand` | type | `type PhotoBand = typeof PHOTO_BANDS[number];` |
| `PhotoDevelopSettings` | interface | `interface PhotoDevelopSettings { readonly version: 1; readonly exposure: ExposureSettings; readonly tone: ToneSettings; readonly mixer: EightBandSettings; re...` |
| `PhotoRating` | interface | `interface PhotoRating { readonly stars: 0 \| 1 \| 2 \| 3 \| 4 \| 5; readonly label: 'none' \| 'red' \| 'yellow' \| 'green' \| 'blue' \| 'purple'; readonly flag: 'none'...` |
| `TONE_FIELDS` | const | `const TONE_FIELDS: readonly [ readonly [ 'contrast', 'Contrast', -100, 100, 1 ], readonly [ 'texture', 'Texture', -100, 100, 1 ], readonly [ 'clarity', 'Clar...` |
| `ToneSettings` | interface | `interface ToneSettings { readonly contrast: number; readonly texture: number; readonly clarity: number; readonly dehaze: number; readonly vibrance: number; }` |
| `defaultPhotoDevelop` | function | `function defaultPhotoDevelop(): PhotoDevelopSettings;` |
| `parsePhotoDevelop` | function | `function parsePhotoDevelop(text: string): PhotoDevelopSettings;` |
| `serializePhotoDevelop` | function | `function serializePhotoDevelop(value: PhotoDevelopSettings): string;` |
| `validateEightBand` | function | `function validateEightBand(value: EightBandSettings): void;` |
| `validateExposure` | function | `function validateExposure(value: ExposureSettings): void;` |
| `validateLens` | function | `function validateLens(value: LensSettings): void;` |
| `validatePhotoDevelop` | function | `function validatePhotoDevelop(value: PhotoDevelopSettings): void;` |
| `validatePhotoRating` | function | `function validatePhotoRating(value: PhotoRating): void;` |
| `validateTone` | function | `function validateTone(value: ToneSettings): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/photo-adjustments.ts -->
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
