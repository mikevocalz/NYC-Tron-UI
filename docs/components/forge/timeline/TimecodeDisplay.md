---
name: "TimecodeDisplay"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/TimecodeDisplay"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.danger", "color.focus", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# TimecodeDisplay

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/TimecodeDisplay.tsx -->
Time readout (D-08) in timecode (with drop-frame at 29.97/59.94), frames, seconds or sample clock.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/TimecodeDisplay.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/TimecodeDisplay
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { TimecodeDisplay } from "@/components/nyc-tron/ui/components/forge/timeline/TimecodeDisplay";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { TimecodeDisplay } from "@nyc-tron/ui/components/forge/timeline/TimecodeDisplay";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/TimecodeDisplay.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `frame` | `number` | not recorded | yes |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `format` | `TimeFormat` | not recorded | yes |  |
| `onFormatChange` | `(format: TimeFormat) => void` | not recorded | no | Shows the format switch. Keep the format in the host's preferences. |
| `dropFrame` | `boolean` | `false` | no | SMPTE drop-frame labels; NTSC rates only. |
| `sampleRate` | `number` | not recorded | no | Enables the samples format. |
| `onCommit` | `(frame: number) => void` | not recorded | no | Makes the time editable: one commit per accepted entry (Enter or blur). |
| `durationFrames` | `number` | not recorded | no | Highest frame a typed entry may reach. |
| `label` | `string` | `"Current time"` | no |  |
| `className` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/TimecodeDisplay.tsx -->
- `accessibilityHint`: "Switches to the next time format"
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "button"
- `aria-invalid`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
