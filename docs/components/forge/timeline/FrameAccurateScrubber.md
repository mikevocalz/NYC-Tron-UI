---
name: "FrameAccurateScrubber"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/FrameAccurateScrubber"
tier: 2
docs: "generated"
platforms: ["ios", "android"]
category: "forge"
tokens: ["color.textMuted"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/NativeSeekBar"]
a11yStatus: "unverified"
---

# FrameAccurateScrubber

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/FrameAccurateScrubber.native.tsx,packages/ui/src/components/forge/timeline/FrameAccurateScrubber.shared.tsx,packages/ui/src/components/forge/timeline/FrameAccurateScrubber.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/FrameAccurateScrubber.native.tsx,packages/ui/src/components/forge/timeline/FrameAccurateScrubber.shared.tsx,packages/ui/src/components/forge/timeline/FrameAccurateScrubber.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/NativeSeekBar

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/FrameAccurateScrubber
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { FrameAccurateScrubber } from "@/components/nyc-tron/ui/components/forge/timeline/FrameAccurateScrubber";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { FrameAccurateScrubber } from "@nyc-tron/ui/components/forge/timeline/FrameAccurateScrubber";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/FrameAccurateScrubber.native.tsx,packages/ui/src/components/forge/timeline/FrameAccurateScrubber.shared.tsx,packages/ui/src/components/forge/timeline/FrameAccurateScrubber.tsx -->
Extends: `Omit<NativeSeekBarProps, 'onCommit' | 'onSeek' | 'onPreview'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `durationFrames` | `number` | not recorded | yes | Number of source frames; the last seekable frame is durationFrames - 1. |
| `onSeekFrame` | `(request: FrameSeekRequest, signal: AbortSignal) => Promise<FrameSeekResult>` | not recorded | yes |  |
| `onPresented` | `(result: FrameSeekResult) => void` | not recorded | yes |  |
| `disabledReason` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/FrameAccurateScrubber.native.tsx,packages/ui/src/components/forge/timeline/FrameAccurateScrubber.shared.tsx,packages/ui/src/components/forge/timeline/FrameAccurateScrubber.tsx -->
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
