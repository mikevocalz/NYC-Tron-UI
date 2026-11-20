---
name: "RangeSlider"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/RangeSlider"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "input"
tokens: ["RangeSlider.radius.11", "RangeSlider.space.5_5", "RangeSlider.space.n5_5", "border.2", "border.4", "color.accent", "color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "opacity.0_5", "radius.control", "space.2", "space.3"]
registryDependencies: ["@nyc-tron/gestures/PanResponderDrag", "@nyc-tron/shell/UnitInput"]
a11yStatus: "reviewed-fail"
---

# RangeSlider

## Purpose

Two-thumb slider that selects a min and max value, with step, detents, minimum gap, units and typed endpoints, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { RangeSlider } from "@nyc-tron/ui/shell/RangeSlider";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/gestures/PanResponderDrag, @nyc-tron/shell/UnitInput

```sh
npx shadcn@latest add @nyc-tron/shell/RangeSlider
```

### Dependencies

- Internal: `../forge/inputs/precision.ts`, `../gestures/drag-controller.ts`, `../gestures/drag-transport.ts`, `../gestures/PanResponderDrag.tsx`, `../styles.ts`, `./shell-keys.ts`, `./slider-model.ts`, `./UnitInput.tsx`, `./unit-expression.ts` (type `UnitContext`).
- External: `react`, `react-native`, `zustand`, `zustand/vanilla`.
- Optional peers: `zustand`.

## Props

Also exports types `RangeSliderProps`, `RangeThumb` (`"low" | "high"`), `RangeValue` (`[number, number]`, re-exported from `slider-model.ts`).

Extends `ViewProps` minus `children`, and `RangeConfig`. `style` is merged after the opacity style; other ViewProps spread onto the root.

Extends: `Omit<ViewProps, "children">, RangeConfig`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | `"RangeSlider"` | no | Blank or over 512 characters throws `RangeError`. |
| `revision` | `string \| number` | `0` | no |  |
| `label` | `string` | none | yes | Blank throws. |
| `value` | `RangeValue` | none | yes | Normalised with `normalizeRange` and `minGap`. |
| `onPreview` | `(value: RangeValue) => void` | none | no |  |
| `onCommit` | `(value: RangeValue) => void` | none | yes | Once per drag, key press, typed endpoint or accessibility action. |
| `minGap` | `number` | `0` | no |  |
| `thumbLabels` | `readonly [ string, string ]` | `["Minimum", "Maximum"]` | no | Thumb names are `<label> <thumbLabel>`. |
| `unit` | `string` | none | no | Appended to `aria-valuetext`; drawn as text only when `context` is absent. |
| `context` | `UnitContext` | none | no | Enables typed unit arithmetic in the endpoint fields. |
| `disabled` | `boolean` | `false` | no |  |
| `hideLabel` | `boolean` | `false` | no | Hides the visible label; the group keeps `accessibilityLabel`. |
| `transport` | `DragTransport` | `PanResponderDrag` | no |  |
| `className` | `string` | none | no | Joined after `gap-1`. |
| `unstyled` | `boolean` | `false` | no |  |

### Inherited props this component reads

Documented by hand from the source. They come from the extended type, so they are not in the table above.

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| min | `number` | none | yes | From `RangeConfig`. `assertRange` throws unless finite, `max > min`, `step > 0`. |
| max | `number` | none | yes |  |
| step | `number` | none | yes |  |
| detents | `readonly number[]` | none | no |  |

### Tokens

- Colour classes: color.accent (2), color.surfaceRaised (1), color.focus (1), color.text (1), color.border (1), color.surfaceSunken (1), color.textMuted (1).
- radius.control (1). opacity.0_5 (disabled). border.2 (thumb borderWidth), border.4 (fill borderTopWidth). space.2 (gap 8), space.3 (paddingBottom 12). size.touch (minHeight 44).
- Component-level: RangeSlider.space.n5_5 (marginHorizontal -22), RangeSlider.space.5_5 (paddingHorizontal 22), RangeSlider.radius.11 (borderRadius 11).
- no token: minWidth 96, minHeight 24, thumb size 22, track height 6 and `top: 19`.
- Tailwind default classes (no token): border, gap-1, text-sm, text-xs, rounded-control.

### Unverified

- UNVERIFIED: key-to-action mapping (step sizes for Shift, Alt, PageUp); it lives in `sliderKeyAction` in `slider-model.ts`, not read.
- UNVERIFIED: behaviour of `UnitInput`, including how a typed value is parsed.
- UNVERIFIED: pointer handling in `PanResponderDrag`.

## Variants

none.

## States

| State | How it is set | What the code does |
|---|---|---|
| `dragging` | derived in code | preview value shown; the nearer thumb moves. |
| `focused thumb` | derived in code | classes `ring-2 ring-focus` on that thumb. |

- default; disabled (root opacity 0.5, `aria-disabled`, `accessibilityState.disabled`, no accessibility actions, `focusable` false).
- Each thumb is `adjustable` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`, and increment and decrement actions.

### Motion

none in source.

### Platform notes

- `Platform.OS==="web"`: track wrapper gets `cursor` and `userSelect: "none"`.
- RTL: `I18nManager.isRTL` or `nodeIsRTL(track)` reverses arrow keys and the offset-to-value mapping.
- Keyboard events come from `onKeyDown` (web); Escape cancels a drag; Ctrl and Meta combinations are ignored.
- Package export: `react-native` and `default` conditions both point at `dist/components/shell/RangeSlider.js`.

## A11y

- Contrast: Thumb border-accent on raised 5.17/8.86:1; unfilled track border-border 1.42/1.75:1 (F15); text-text 17.79/13.83:1. Renders UnitInput (F03).
- Keyboard and focus: Thumbs focusable with onKeyDown; state-driven ring-2 ring-focus on the thumb (:153-155, 5.81/6.93:1). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Thumb hit 44 by 44 (:154), track 44 high (:174-180, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: Each thumb accessible, role adjustable, label, aria-valuemin/max/now/text, increment and decrement actions (:143-146); group labelled.
- Motion: None.
- Review status: **FAIL**. Renders UnitInput (F03).
  - UNVERIFIED: Unfilled track contrast (F15). Test: Measure the rendered track against the surface.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=RangeSlider
import {useState} from "react";
import {RangeSlider,type RangeValue} from "@nyc-tron/ui/components/shell/RangeSlider";

export const Example=()=>{
  const [value,setValue]=useState<RangeValue>([20,80]);
  return <RangeSlider label="Opacity range" min={0} max={100} step={1} minGap={5} unit="%" value={value} onCommit={setValue}/>;
};
```

## Do/Don't

### Do

- Set `min`, `max` and `step` with `max > min` and `step > 0`; `assertRange` throws otherwise.
- Use `thumbLabels` to give each thumb a distinct name, since thumb names are `<label> <thumbLabel>` and default to Minimum and Maximum.
- Pass `context` when users should type endpoints with units; `unit` alone is only appended to `aria-valuetext`.

### Don't

- Do not ship it as accessible yet; it renders `UnitInput`, whose field boundary is 1.42/1.75:1 (F03), and the page status is FAIL.
- Do not rely on the unfilled track as a visible cue; its `color.border` contrast is 1.42/1.75:1 and still unverified by measurement (F15).
- Do not pass a blank `label` or `scope`, or a non-finite range, because each throws a `RangeError`.
