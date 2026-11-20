---
name: "SliderField"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/SliderField"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "input"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/gestures/PanResponderDrag", "@nyc-tron/shell/UnitInput"]
a11yStatus: "reviewed-fail"
---

# SliderField

## Purpose

Single-thumb slider with number field, step, detents, units and reset to default, for React Native.

## Install

- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/gestures/PanResponderDrag, @nyc-tron/shell/UnitInput

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/SliderField
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { SliderField } from "@/components/nyc-tron/ui/components/shell/SliderField";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { SliderField } from "@nyc-tron/ui/components/shell/SliderField";`

### Dependencies

- Internal: `../forge/inputs/precision.ts`, `../gestures/*`, `../styles.ts`, `./shell-keys.ts`, `./slider-model.ts`, `./UnitInput.tsx`, `./unit-expression.ts`.
- External: `react`, `react-native`, `zustand`, `zustand/vanilla`.
- Optional peers: `zustand`.

## Props

Also exports the type `SliderFieldProps`.

Extends `ViewProps` minus `children`, and `RangeConfig`. `style` is merged after the opacity style; `testID` also yields `<testID>-track` on the track.

Extends: `Omit<ViewProps, "children">, RangeConfig`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | `"SliderField"` | no |  |
| `revision` | `string \| number` | `0` | no |  |
| `label` | `string` | none | yes |  |
| `value` | `number` | none | yes | Must be finite. |
| `onPreview` | `(value: number) => void` | none | no | During drag. |
| `onCommit` | `(value: number) => void` | none | yes |  |
| `defaultValue` | `number` | none | no | Finite, within range. Shows Reset when different from `value`. |
| `unit` | `string` | none | no | Ignored (not drawn) when `context` is given; always appended to `aria-valuetext`. |
| `context` | `UnitContext` | none | no |  |
| `disabled` | `boolean` | `false` | no |  |
| `hideLabel` | `boolean` | `false` | no | An empty flex spacer replaces the label text. |
| `transport` | `DragTransport` | `PanResponderDrag` | no |  |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

### Inherited props this component reads

Documented by hand from the source. They come from the extended type, so they are not in the table above.

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| min | `number` | none | yes | `RangeConfig`. |
| max | `number` | none | yes |  |
| step | `number` | none | yes |  |
| detents | `readonly number[]` | none | no |  |

### Tokens

- Colour classes: color.text (1), color.focus (2), color.surfaceSunken (2), color.textMuted (2), color.border (1), color.accent (2), color.surfaceRaised (1).
- radius.control (3). opacity.0_5. space.2 (gap 8), space.3.5 (paddingHorizontal 14). border.4 (fill), border.2 (thumb). size.touch (minHeight 44, 2 uses).
- Component-level: SliderField.radius.11 (borderRadius 11).
- no token: thumb 22, track height 6, input width 80 or 104.
- Tailwind default classes (no token): gap-1, text-sm, text-xs, min-h-11, min-w-11, px-2, rounded-control, border.

### Unverified

- UNVERIFIED: key step sizes (Shift ten, Alt a tenth, PageUp ten) come from a doc comment; `sliderKeyAction` was not read.
- UNVERIFIED: the "second pointer cancels" claim; it depends on the `touches` count `PanResponderDrag` supplies.
- UNVERIFIED: `UnitInput` parsing and display.

## Variants

none.

## States

| State | How it is set | What the code does |
|---|---|---|
| `dragging` | derived in code | preview value shown on thumb and field. |
| `focused` | derived in code | class `ring-2 ring-focus` on the track. |
| `resettable` | derived in code | Reset button. |

- default; disabled (opacity 0.5, `aria-disabled`, no actions, `focusable` false).
- Track is `adjustable` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`.

### Motion

none in source.

### Platform notes

- `Platform.OS==="web"`: track gets `cursor` and `userSelect: "none"`; `onPointerEnter` re-measures.
- RTL: `I18nManager.isRTL` or `nodeIsRTL(track)` mirrors keys and the offset mapping; the fill starts at the reading-direction start.
- Package export: `react-native` and `default` conditions both point at `dist/components/shell/SliderField.js`.

## A11y

- Contrast: Fill and thumb border-accent 4.65/9.81:1; rail border-border 1.42/1.75:1 (F15); focus ring-2 ring-focus 5.22/7.67:1. Renders UnitInput (F03).
- Keyboard and focus: focusable, onKeyDown; state-driven ring (:160). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Slider minHeight 44 (:161), row minHeight 44 (:130), reset min-h-11 min-w-11. Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: role adjustable, label, aria-valuemin/max/now/text, increment and decrement actions (:149-153).
- Motion: None.
- Review status: **FAIL**. Renders UnitInput (F03).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=SliderField
import {useState} from "react";
import {SliderField} from "@/components/nyc-tron/ui/components/shell/SliderField";

export const Example=()=>{
  const [value,setValue]=useState(50);
  return <SliderField label="Opacity" min={0} max={100} step={1} unit="%" defaultValue={100} value={value}
    onPreview={v=>console.log(v)} onCommit={setValue}/>;
};
```

## Do/Don't

### Do

- Set `min`, `max` and `step` explicitly, and keep `value` finite, since an invalid range or non-finite `value` throws.
- Pass `defaultValue` within range so the Reset button appears when `value` differs from it.
- Use `onPreview` for live feedback while dragging and `onCommit` for the final write.

### Don't

- Do not ship it as accessible yet; it renders `UnitInput` (F03) and the rail `border-border` is 1.42/1.75:1 (F15), so the status is FAIL.
- Do not combine `unit` and `context` expecting a drawn unit; `unit` is not drawn when `context` is given.
- Do not document Shift, Alt or PageUp changes to `step` as fact; they come from a doc comment and are UNVERIFIED.
