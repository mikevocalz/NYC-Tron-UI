---
name: "RotaryKnob"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/RotaryKnob"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "input"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/gestures/PanResponderDrag", "@nyc-tron/shell/UnitInput"]
a11yStatus: "reviewed-fail"
---

# RotaryKnob

## Purpose

Dial control with relative or circular drag, fine adjustment, detents and reset to default, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { RotaryKnob } from "@nyc-tron/ui/components/shell/RotaryKnob";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/gestures/PanResponderDrag, @nyc-tron/shell/UnitInput

```sh
npx shadcn@latest add @nyc-tron/shell/RotaryKnob
```

### Dependencies

- Internal: `../forge/inputs/precision.ts`, `../gestures/*`, `../styles.ts`, `./shell-keys.ts`, `./slider-model.ts`, `./UnitInput.tsx`, `./unit-expression.ts`.
- External: `react`, `react-native`, `zustand`, `zustand/vanilla`.
- Optional peers: `zustand`.

## Props

Also exports types `KnobInput` (`"relative" | "circular"`) and `RotaryKnobProps`.

Extends `ViewProps` minus `children`, and `RangeConfig`. `style` is merged after the opacity style.

Extends: `Omit<ViewProps, "children">, RangeConfig`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | `"RotaryKnob"` | no |  |
| `revision` | `string \| number` | `0` | no |  |
| `label` | `string` | none | yes | Blank throws. |
| `value` | `number` | none | yes | Must be finite. |
| `onPreview` | `(value: number) => void` | none | no |  |
| `onCommit` | `(value: number) => void` | none | yes |  |
| `input` | `KnobInput` | `"relative"` | no | Any other value throws. |
| `defaultValue` | `number` | none | no | Must be finite and within min and max. Reset button shows when it differs from `value`. |
| `unit` | `string` | none | no |  |
| `context` | `UnitContext` | none | no |  |
| `size` | `number` | `72` | no | Must be finite, above 0 and at most 4096. Dial is `max(44, size)`. |
| `disabled` | `boolean` | `false` | no |  |
| `hideLabel` | `boolean` | `false` | no |  |
| `transport` | `DragTransport` | `PanResponderDrag` | no |  |
| `className` | `string` | none | no | Joined after `items-center gap-1`. |
| `unstyled` | `boolean` | `false` | no |  |

### Inherited props this component reads

Documented by hand from the source. They come from the extended type, so they are not in the table above.

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| min | `number` | none | yes | `RangeConfig`; invalid range throws `RangeError`. |
| max | `number` | none | yes |  |
| step | `number` | none | yes |  |
| detents | `readonly number[]` | none | no |  |

### Tokens

- Colour classes: color.textMuted (3), color.surfaceSunken (2), color.accent (2), color.focus (2), color.text (1), color.border (1).
- radius.control (1). opacity.0_5. space.1.5 (marginTop 6), space.1 (gap 4). border.3 (indicator borderLeftWidth).
- no token: `FINE_HOLD_PX` 28, default size 72, indicator height `dialSize * 0.28`, input width 72 or 104.
- Tailwind default classes (no token): gap-1, text-sm, text-xs, border, border-2, min-h-11, min-w-11, px-2, rounded-control.

### Unverified

- UNVERIFIED: the angle sweep and the bottom-gap hold; they live in `knobAngle`, `valueFromAngle` and `angleAround`, not read.
- UNVERIFIED: the doc comment says apps that detect a stylus pass `circular`; nothing in this file detects a stylus.
- UNVERIFIED: screen reader output for the adjustable role and hint.

## Variants

- `input="relative"`: vertical travel sets the value; sideways travel beyond 28 points from the start switches to fine adjustment and shows "Fine adjustment". Hint: "Drag up to raise the value. Move sideways while dragging for fine control."
- `input="circular"`: value follows the pointer angle around the dial centre. Hint: "Turn around the knob to set the value."

## States

| State | How it is set | What the code does |
|---|---|---|
| `dragging` | derived in code | dial border `border-accent`. |
| `focused` | derived in code | dial border `border-focus`; otherwise `border-border`. |
| `fine` | derived in code | caption text while fine adjustment is active. |
| `resettable` | derived in code | "Reset" button with label "Reset <label>". |

- default; disabled (root opacity 0.5, `aria-disabled`, no accessibility actions).
- Dial is `adjustable` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`.

### Motion

none in source. The indicator is rotated by `knobAngle` through a `transform` with no animation.

### Platform notes

- `Platform.OS==="web"`: dial gets `cursor` (`grab`), `userSelect: "none"`, `touchAction: "none"`.
- Arrow keys do not flip in RTL (code comment: a knob turns clockwise for Right and Up).
- Package export: `react-native` and `default` conditions both point at `dist/components/shell/RotaryKnob.js`.

## A11y

- Contrast: Dial border-2 border-border 1.42/1.75:1 idle, border-focus on focus, border-accent while previewing; needle border-accent 4.65/9.81:1. Renders UnitInput (F03).
- Keyboard and focus: focusable, onKeyDown, state-driven border-focus (:158-161). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: dialSize = max(44, size) with default size 72 (:60, :140, size.touch); reset min-h-11 min-w-11. Android: 44 floor (F08). Android 48dp: below (F08).
- Screen reader: Dial accessible, role adjustable, label, hint by input mode, aria-valuemin/max/now/text, actions increment and decrement (:149-153).
- Motion: None.
- Review status: **FAIL**. Renders UnitInput (F03).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=RotaryKnob
import {useState} from "react";
import {RotaryKnob} from "@nyc-tron/ui/components/shell/RotaryKnob";

export const Example=()=>{
  const [gain,setGain]=useState(0);
  return <RotaryKnob label="Gain" min={-24} max={24} step={0.5} unit="dB" defaultValue={0} value={gain} onCommit={setGain}/>;
};
```

## Do/Don't

### Do

- Pass a finite `defaultValue` inside `min` and `max`; the Reset button then shows whenever it differs from `value`.
- Pick `input="circular"` for angle-following drags and keep the default `relative` for vertical drags with fine adjustment past 28 points sideways.
- Leave `size` at 72 or set a finite value above 0 and at most 4096; the dial is never smaller than 44.

### Don't

- Do not ship it as accessible yet; the dial renders `UnitInput` (F03) and the idle `border-border` ring is 1.42/1.75:1, so the status is FAIL.
- Do not pass an `input` value other than `relative` or `circular`, or a non-finite `value`; both throw.
- Do not expect stylus detection; the doc comment says apps that detect a stylus pass `circular`, but nothing in the file detects one (UNVERIFIED).
