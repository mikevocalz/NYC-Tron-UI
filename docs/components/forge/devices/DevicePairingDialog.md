---
name: "DevicePairingDialog"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/devices/DevicePairingDialog"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.danger", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control", "space.2", "space.4"]
registryDependencies: ["@nyc-tron/Button"]
a11yStatus: "declared"
---

# DevicePairingDialog

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/devices/DevicePairingDialog.tsx -->
Transport-agnostic pairing dialog over a controlled {@linkcode PairingState}.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/devices/DevicePairingDialog.tsx -->
- Package: @nyc-tron/ui
- Import: `import { DevicePairingDialog } from "@nyc-tron/ui/forge/devices/DevicePairingDialog";`
- Peers: react, react-native
- Requires: @nyc-tron/Button

```sh
npx shadcn@latest add @nyc-tron/forge/devices/DevicePairingDialog
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/devices/DevicePairingDialog.tsx -->
| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `visible` | `boolean` | not recorded | yes |  |
| `state` | `PairingState` | not recorded | yes | Pairing phase, mapped by the app from its own transport controller. |
| `onScan` | `() => void` | not recorded | yes | Start (or restart) discovery. |
| `onSelect` | `(deviceId: string) => void` | not recorded | yes | The user picked a device. Rows are tappable while a scan is still running, so stop discovery before connecting. |
| `onStopSearch` | `() => void` | not recorded | no | Stop the running search or connection attempt. The dialog stays open; move the state back to `idle`, `found` or `error`. Called by "Stop searching" and by "Cancel" while connecting. Falls back to `onCancel`; with neither, those buttons are disabled. |
| `onClose` | `() => void` | not recorded | no | Close the dialog. Called by the close button and the system back gesture in every state except `connected`, which calls `onDone`. While `awaiting-input` the device is linked: treat this as closing the window, not disconnecting. Falls back to `onCancel` for unlinked states and to `onDone` for linked ones. |
| `onCancel` | `() => void` | not recorded | no |  |
| `onRetry` | `() => void` | not recorded | yes | Retry after an error. |
| `onDone` | `() => void` | not recorded | yes | Close after a successful connection. Closing a connected dialog is not a disconnect, so it never calls `onCancel`. |
| `onOpenSettings` | `() => void` | not recorded | no | Open system settings for permission or radio errors and `system-pairing`. |
| `intro` | `string` | not recorded | no | Shown above the guidance while `idle`, before the user starts a search. Say what the button will do, e.g. that the app will ask for Bluetooth access, or that this platform pairs in system Settings. |
| `title` | `string` | `"Connect a device"` | no |  |
| `deviceNoun` | `string` | `"device"` | no | Lowercase noun used in copy, e.g. "pen" or "controller". |
| `renderStatusArt` | `(phase: PairingArtPhase, state: PairingState) => ReactNode` | not recorded | no | Status illustration, e.g. a Rive state machine. Show `connected` only for a verified link: the app decides what verified means. |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
| `testID` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/devices/DevicePairingDialog.tsx -->
- `accessibilityLabel`: "Connect to ", "Found ", "Step "
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "button", "header", "list"
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
