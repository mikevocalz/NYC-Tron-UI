---
name: "SignatureStampTool"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/pdf/SignatureStampTool"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PointEditor2D", "@nyc-tron/forge/inputs/PropertyInspector", "@nyc-tron/forge/slides/InkAndLaserPointer"]
a11yStatus: "unverified"
---

# SignatureStampTool

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/SignatureStampTool.tsx -->
Visible signature stamp authoring.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/SignatureStampTool.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PointEditor2D, @nyc-tron/forge/inputs/PropertyInspector, @nyc-tron/forge/slides/InkAndLaserPointer

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/SignatureStampTool
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { SignatureStampTool } from "@/components/nyc-tron/ui/components/forge/pdf/SignatureStampTool";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { SignatureStampTool } from "@nyc-tron/ui/components/forge/pdf/SignatureStampTool";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/SignatureStampTool.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `mode` | `'ink' \| 'image'` | not recorded | yes |  |
| `ink` | `Omit<InkAndLaserPointerProps, 'capture' \| 'onCaptureStroke'>` | not recorded | yes |  |
| `artifact` | `PDFSignatureArtifact \| null` | not recorded | yes |  |
| `placement` | `{ pageId: string; x: number; y: number; width: number; rotation: number; }` | not recorded | yes |  |
| `canPlace` | `boolean` | not recorded | yes |  |
| `placedArtifactId` | `string` | not recorded | no |  |
| `onModeChange` | `(mode: 'ink' \| 'image') => void` | not recorded | yes |  |
| `onChooseImage` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCreateInkArtifact` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onPlacementChange` | `(placement: SignatureStampToolProps['placement'], signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onPlace` | `(artifactId: string, placement: SignatureStampToolProps['placement'], signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `renderPlacement` | `(artifact: PDFSignatureArtifact \| null, placement: SignatureStampToolProps['placement']) => ReactNode` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/SignatureStampTool.tsx -->
- `accessibilityLabel`: "PDF signature stamp"
- `accessibilityState`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
