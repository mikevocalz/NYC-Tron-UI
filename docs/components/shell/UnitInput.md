---
name: "UnitInput"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/UnitInput"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "input"
tokens: ["color.border", "color.danger", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/shell/MenuButton"]
a11yStatus: "reviewed-fail"
---

# UnitInput

## Purpose

Number field that parses and formats typed units from a UnitContext, with unit menu, min, max and arrow stepping, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { UnitInput } from "@nyc-tron/ui/components/shell/UnitInput";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/shell/MenuButton

```sh
npx shadcn@latest add @nyc-tron/shell/UnitInput
```

### Dependencies

- `./MenuButton.tsx`, `./shell-keys.ts`, `./unit-expression.ts`, `../styles.ts`.
- External: `react`, `react-native`, `zustand`, `zustand/vanilla` (optional peer).

## Props

Exports: `UnitInput`, `UnitInputProps`, and the re-exported types `UnitContext`, `UnitDimension`, `UnitName`.

`UnitInputProps` extends `Omit<ViewProps,"children">`. Rest spread goes to the root `View`; `style` is appended after `{opacity:disabled?0.5:1}`.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | none | yes | Visible label and accessible name. |
| `scope` | `string` | none | no | A change abandons an uncommitted draft. |
| `value` | `number` | none | yes | Committed value in the dimension's base unit. |
| `onCommit` | `(value: number) => void` | none | yes | Called once per accepted entry or arrow step, with the clamped value. Not called when the clamped value equals `value`. |
| `context` | `UnitContext` | none | no | Without it the field is a plain number field that still accepts arithmetic. |
| `units` | `readonly UnitName[]` | none | no | Menu shows only with `context`, 2 or more units and `onUnitChange`. |
| `onUnitChange` | `(unit: UnitName) => void` | none | no |  |
| `min` | `number` | none | no | Base units. |
| `max` | `number` | none | no | Base units. |
| `step` | `number` | `1` | no | Arrow step in display units; Shift x10, Alt /10. |
| `precision` | `number` | `2` | no | Decimals for a plain number field. |
| `disabled` | `boolean` | `false` | no |  |
| `hideLabel` | `boolean` | `false` | no |  |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

`UnitContext` (shell/unit-expression.ts): `dimension:UnitDimension` (required), `unit:UnitName` (required), `pixelsPerInch?` (doc: default 96), `frameRate?` (required to use `f`), `sampleRate?` (required to use `smp`), `percentOf?` (required to use `%` for length).
`UnitDimension`: `"length"|"time"|"level"|"ratio"`. `UnitName` is one of length `px pt mm cm in %`, time `s ms f smp`, level `dB`, ratio `% x`.

### Tokens

- Colour classes: `color.text` 2, `color.danger` 2, `color.border` 2, `color.textMuted` 1, `color.surfaceSunken` 1, `color.focus` 1, `color.surfaceRaised` 1. Radius class: `radius.control` 1.
- Literals: `gap: 4` to `space.1` (1), `minHeight: 44` to `size.touch` (1), `opacity 0.5` to `opacity.0_5` (1).
- no token: `minWidth: 64` (1).
- Tailwind default classes (no token): `gap-1` 1, `text-xs` 2, `rounded-control` 1, `border` 8, `px-2` 2, `text-sm` 1.

### Unverified

- UNVERIFIED: the accepted expression grammar and error strings; `parseUnitExpression` was not read beyond its signature use.
- UNVERIFIED: unit conversion factors (`unitScale`, `formatUnitValue`) in `unit-expression.ts`.
- UNVERIFIED: how `Escape`, Shift and Alt arrive on native keyboards; `shellKey` was not read.
- UNVERIFIED: the unit menu's behaviour; it lives in `MenuButton.tsx`.

## Variants

none. `context.dimension` selects the unit set, which is data, not a style variant.

## States

| State | How it is set | What the code does |
|---|---|---|
| `default` | derived in code | shows `formatUnitValue(value, context)` or the plain number to `precision` decimals. |
| `editing` | derived in code | on focus; shows the draft text; border class `border-focus`. |
| `error` | derived in code | parse failure keeps editing and shows an `assertive` live-region message with `aria-invalid` and `aria-describedby`; border `border-danger`. On blur with an unparsable draft the value is restored and the message reads "Not applied. ..." |
| `disabled` | `disabled` prop | `editable={false}`, `aria-disabled`, `accessibilityState.disabled`, wrapper opacity 0.5, and an open edit is discarded. |
| `hover and pressed` | derived in code | no code. |

- Escape restores the committed text; ArrowUp and ArrowDown step by `step` times the unit scale.

### Motion

none in source.

### Platform notes

- `Platform.OS==="web"` adds `blurOnSubmit:false` to the `TextInput`.
- Escape handling and arrow stepping read keys through `shellKey` from `shell-keys.ts`.
- package.json export conditions: `types`, `react-native`, `default`, all to the same dist file. No `.native`/`.web` siblings.

## A11y

- Contrast: Field boundary 1.42/1.75:1 (F03); focus border-focus 5.22/7.67:1; error text-danger 5.91/8.01:1 and border-danger 6.57/7.24:1.
- Keyboard and focus: Native input; onFocus enters editing (:108). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Input minHeight 44 (:127, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: accessibilityLabel, aria-invalid, aria-describedby for the error, error is an assertive live region, disabled state (:102-135).
- Motion: None.
- Review status: **FAIL**. Input boundary 1.42/1.75:1 (1.4.11).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=UnitInput
import {UnitInput} from "@nyc-tron/ui/components/shell/UnitInput";
export const Example = () => <UnitInput label="Width" scope="layer-1.width" value={192}
  context={{dimension:"length",unit:"mm",pixelsPerInch:96}} units={["px","mm","in"]}
  onUnitChange={()=>{}} onCommit={()=>{}} min={0} max={4096} step={1}/>;
```

## Do/Don't

### Do

- Pass `context` to parse typed units, and set `frameRate`, `sampleRate` or `percentOf` when users type `f`, `smp` or `%`.
- Pass `units` with `onUnitChange` and a `context` to get the unit menu; it needs 2 or more units.
- Set `min` and `max` in base units, since `onCommit` receives the clamped value.

### Don't

- Do not rely on the field border as the only cue; `border-border` is 1.42/1.75:1 (F03) and the status is FAIL.
- Do not expect `onCommit` when the clamped value equals `value`; it is not called.
- Do not assume the expression grammar or conversion factors; `parseUnitExpression` and `unitScale` are UNVERIFIED.
