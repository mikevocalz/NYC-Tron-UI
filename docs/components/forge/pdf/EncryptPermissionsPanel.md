---
name: "EncryptPermissionsPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/pdf/EncryptPermissionsPanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.danger", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select"]
a11yStatus: "unverified"
---

# EncryptPermissionsPanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/EncryptPermissionsPanel.tsx -->
Passwords live only in this ephemeral, nonpersisted store and the host operation; never in identity, logs or presets.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/EncryptPermissionsPanel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { EncryptPermissionsPanel } from "@nyc-tron/ui/components/forge/pdf/EncryptPermissionsPanel";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/Select

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/EncryptPermissionsPanel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/EncryptPermissionsPanel.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `algorithms` | `readonly { id: string; label: string; readerCompatibility: string; unavailableReason?: string; }[]` | not recorded | yes |  |
| `algorithmId` | `string` | not recorded | yes |  |
| `permissions` | `readonly { id: string; label: string; enabled: boolean; supported: boolean; }[]` | not recorded | yes |  |
| `requireOwnerPassword` | `boolean` | not recorded | yes |  |
| `passwordMaxLength` | `number` | not recorded | yes |  |
| `status` | `'idle' \| 'applying' \| 'complete' \| 'error'` | not recorded | yes |  |
| `onAlgorithmChange` | `(id: string) => void` | not recorded | yes |  |
| `onPermissionChange` | `(id: string, enabled: boolean) => void` | not recorded | yes |  |
| `onApply` | `(request: PDFEncryptionRequest, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onClose` | `() => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/EncryptPermissionsPanel.tsx -->
- `accessibilityLabel`: "PDF encryption and permissions"
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "alert"
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
