---
name: "ChannelFieldsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/color/channel-fields"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ChannelFieldsModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/channel-fields.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/channel-fields.ts -->
- Package: @nyc-tron/ui
- Import: `import { CHANNEL_MODELS, channelFields, parseChannel, parseOpacityPercent, readChannels, writeChannel } from "@nyc-tron/ui/forge/color/channel-fields";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/color/channel-fields
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/channel-fields.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `CHANNEL_MODELS` | const | `const CHANNEL_MODELS: readonly [ { readonly model: "rgb"; readonly label: "RGB"; }, { readonly model: "hsl"; readonly label: "HSL"; }, { readonly model: "hsv...` |
| `ChannelField` | interface | `interface ChannelField { readonly label: string; readonly max: number; readonly unit: "" \| "°" \| "%"; }` |
| `ChannelModel` | type | `type ChannelModel = "rgb" \| "hsl" \| "hsv";` |
| `channelFields` | const | `const channelFields: (model: ChannelModel) => readonly [ ChannelField, ChannelField, ChannelField ];` |
| `parseChannel` | function | `function parseChannel(text: string, max: number): number \| undefined;` |
| `parseOpacityPercent` | function | `function parseOpacityPercent(text: string): number \| undefined;` |
| `readChannels` | function | `function readChannels(value: HsvColor, model: ChannelModel): [ number, number, number ];` |
| `writeChannel` | function | `function writeChannel(value: HsvColor, model: ChannelModel, index: 0 \| 1 \| 2, n: number): HsvColor;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/channel-fields.ts -->
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
