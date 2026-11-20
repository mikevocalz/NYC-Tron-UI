---
name: "TimelapsePlaybackExporter"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/ink/TimelapsePlaybackExporter"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "unverified"
---

# TimelapsePlaybackExporter

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/ink/TimelapsePlaybackExporter.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/ink/TimelapsePlaybackExporter.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/ink/TimelapsePlaybackExporter
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { TimelapsePlaybackExporter } from "@/components/nyc-tron/ui/components/forge/ink/TimelapsePlaybackExporter";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { TimelapsePlaybackExporter } from "@nyc-tron/ui/components/forge/ink/TimelapsePlaybackExporter";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/ink/TimelapsePlaybackExporter.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `recording` | `boolean` | not recorded | yes |  |
| `eventCount` | `number` | not recorded | yes |  |
| `durationMs` | `number` | not recorded | yes |  |
| `onRecordingChange` | `(recording: boolean, signal: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `playback` | `{ playing: boolean; positionMs: number; rate: number; }` | not recorded | yes |  |
| `onPlaybackChange` | `(state: { playing: boolean; positionMs: number; rate: number; }) => void` | not recorded | yes |  |
| `renderPreview` | `(positionMs: number) => ReactNode` | not recorded | yes |  |
| `value` | `TimelapseExportSettings` | not recorded | yes |  |
| `onSettingsChange` | `(value: TimelapseExportSettings) => void` | not recorded | yes |  |
| `formats` | `readonly { id: 'mp4' \| 'webm'; label: string; unavailableReason?: string; }[]` | not recorded | yes |  |
| `onExport` | `(settings: TimelapseExportSettings, signal: AbortSignal, onProgress: (progress: TimelapseProgress) => void) => Promise<TimelapseArtifact>` | not recorded | yes | Encode the real, non-destructive history into a file. Honour abort and remove partial outputs. |
| `onOpenExport` | `(artifact: TimelapseArtifact) => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/ink/TimelapsePlaybackExporter.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Drawing timelapse"
- `accessibilityLiveRegion`: "polite"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
