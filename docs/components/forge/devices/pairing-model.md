---
name: "PairingModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/devices/pairing-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# PairingModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/devices/pairing-model.ts -->
Transport-agnostic pairing states for `DevicePairingDialog`.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/devices/pairing-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/devices/pairing-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { presentPairing, signalLabel } from "@/components/nyc-tron/ui/components/forge/devices/pairing-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { presentPairing, signalLabel } from "@nyc-tron/ui/components/forge/devices/pairing-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/devices/pairing-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `PairingAction` | type | `type PairingAction = "scan" \| "rescan" \| "cancel" \| "retry" \| "open-settings" \| "done";` |
| `PairingDevice` | interface | `interface PairingDevice { readonly id: string; readonly name: string; readonly detail?: string; readonly signalDbm?: number; }` |
| `PairingErrorCode` | type | `type PairingErrorCode = "permission-denied" \| "radio-off" \| "connection-failed" \| "unknown";` |
| `PairingPresentation` | interface | `interface PairingPresentation { readonly body: string; readonly primary?: { readonly kind: PairingAction; readonly label: string; }; readonly secondary?: { r...` |
| `PairingState` | type | `type PairingState = { readonly kind: "idle"; } \| { readonly kind: "scanning"; readonly devices?: readonly PairingDevice[]; } \| { readonly kind: "found"; read...` |
| `presentPairing` | function | `function presentPairing(state: PairingState, deviceNoun: string, canOpenSettings: boolean): PairingPresentation;` |
| `signalLabel` | function | `function signalLabel(signalDbm: number): string;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/devices/pairing-model.ts -->
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
