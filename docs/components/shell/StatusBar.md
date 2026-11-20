---
name: "StatusBar"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/StatusBar"
tier: 1
docs: "handwritten"
platforms: []
category: "shell"
tokens: ["color.accent", "color.border", "color.danger", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/shell/MenuButton"]
a11yStatus: "unverified"
---

# StatusBar

## Purpose

Application status bar with zoom steps and menu, units menu, selection summary and activity text, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { StatusBar } from "@nyc-tron/ui/components/shell/StatusBar";`
- Peers: react, react-native
- Requires: @nyc-tron/shell/MenuButton

```sh
npx shadcn@latest add @nyc-tron/shell/StatusBar
```

### Dependencies

- `./MenuButton.tsx` (`@nyc-tron/ui/components/shell/MenuButton`), `./status-model.ts`, `../styles.ts` (`joinClasses`), type `Rect2D` from `../overlays/popover-position.ts`.
- External: `react`, `react-native`. No optional peer is imported by this file directly.

## Props

Exports: `StatusBar`, `StatusBarProps`, `StatusZoom`, `StatusUnits`, and the re-exported types `SelectionNoun`, `StatusActivity`.

`StatusBarProps` extends `Omit<ViewProps,"children">`. The rest spread goes to the root `View`; `style` is appended after the component's own style. `accessibilityLabel="Status"` is set after the spread, so a caller value does not apply.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | `"status"` | no | Part of the edit boundary string. |
| `revision` | `string \| number` | `0` | no | Part of the edit boundary string. |
| `disabled` | `boolean` | `false` | no | Disables both menus and both step buttons; handlers also ignore calls. |
| `zoom` | `StatusZoom` | none | no | Renders zoom step buttons plus zoom menu. |
| `units` | `StatusUnits` | none | no | Renders the units menu. |
| `selection` | `{ readonly count: number; readonly noun?: SelectionNoun; }` | none | no | Renders the selection summary text. |
| `activity` | `StatusActivity` | `{kind:"idle"}` | no | Idle, saving, rendering, recording, error. |
| `children` | `ReactNode` | none | no | Rendered first, before built-in items. |
| `usableRegions` | `readonly Rect2D[]` | none (doc comment: whole window) | no | Passed to both `MenuButton`s. |
| `className` | `string` | none | no | Joined onto the root class string. |
| `unstyled` | `boolean` | `false` | no | Drops all token class strings. |

`StatusZoom` (in StatusBar.tsx): `value:number` (required), `presets?:readonly number[]` (default `[25,50,100,200,400]`), `onChange:(percent:number)=>void` (required), `onFit?:()=>void` (adds a "Fit to window" menu choice).

`StatusUnits`: `value:string`, `options:readonly {value:string;label:string}[]`, `onChange:(value:string)=>void`, all required.

`SelectionNoun` (shell/status-model.ts): `one:string`, `other:string`. `StatusActivity`: `{kind:"idle"}`, `{kind:"saving"}`, `{kind:"rendering";progress?:number;label?:string}`, `{kind:"recording";elapsedMs:number}`, `{kind:"error";message:string}`.

Throws `RangeError("Invalid zoom presets")` for more than 1000 presets, a non-finite or non-positive preset, or duplicates. Throws `RangeError("Invalid status units")` for more than 256 options, an empty or over-long value (256) or label (512), or duplicate values.

### Tokens

`node tokenuse.mjs` output for this file:
- Colour classes: `color.text` 3, `color.surfaceRaised` 3, `color.border` 2, `color.danger` 2, `color.textMuted` 1, `color.focus` 1, `color.surfaceSunken` 1, `color.accent` 1. Radius class: `radius.control` 2.
- Literals: `columnGap: 12` to `space.3` (1), `gap: 6` to `space.1.5` (1), `borderRadius: 4` to `radius.4` (1), `borderTopWidth: 1.5` and `borderLeftWidth: 1.5` to `border.1_5` (1 each), `borderWidth: 4` and `borderTopWidth: 4` to `border.4` (1 each), `minHeight: 44` and `minWidth: 44` to `size.touch` (1 each).
- no token: `minWidth: 0` (1); other literals not in the tool output: widths 12, 8 and 96, heights 6, 8 and 12.
- Tailwind default classes (no token): `text-xs` 3, `min-h-11` 1, `min-w-11` 1, `opacity-40` 1, `border` 11, `px-2` 2, `px-1` 1.

### Unverified

- UNVERIFIED: how a screen reader reads the status strip, the progress bar and the live regions; only the props are in source.
- UNVERIFIED: menu open and select behaviour; it lives in `MenuButton.tsx`, which this item does not cover.
- UNVERIFIED: the "every control is at least 44pt" claim in the doc comment for the two `MenuButton` triggers; their sizing is in `MenuButton.tsx`.

## Variants

none. `unstyled` is a boolean that removes the class strings; it is not a variant union.

## States

| State | How it is set | What the code does |
|---|---|---|
| `default` | derived in code | idle activity renders no activity text (`activityAnnouncement` returns an empty string, so nothing is drawn). |
| `disabled` | `disabled` prop | `disabled` prop. Step buttons get `disabled` and `accessibilityState={{disabled}}`; menus get `disabled`. |
| `blocked step button` | derived in code | a step button is also disabled when no zoom is given or when `stepZoom` returns the current value (end of presets). It adds `opacity-40`. |
| `hover` | class `hover:bg-surface-raised` | `hover:bg-surface-raised` on step buttons and on both menu triggers. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | `focus-visible:ring-2 focus-visible:ring-focus` on step buttons. |
| `saving` | derived in code | activity text "Saving". |
| `rendering` | derived in code | label text (default "Rendering"), a progressbar `View` (`accessibilityRole="progressbar"`, `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow=percent`), a percent text when progress is given. Without progress the fill is 35% wide. |
| `recording` | derived in code | 8pt dot with `border-danger`, text "Recording", and an elapsed clock with `accessibilityLabel="Elapsed m:ss"`. |
| `error` | derived in code | `text-danger` text, `numberOfLines={2}`. |
| `pressed` | derived in code | no code (no `active:` class and no pressed style). |

- Text nodes for selection and activity set `accessibilityLiveRegion="polite"`.

### Motion

none in source.

### Platform notes

none in source for StatusBar.tsx (no `Platform` use, no `.native`/`.web` siblings). package.json export conditions for the subpath: `types`, `react-native`, `default`, all resolving to `dist/components/shell/StatusBar.js`. The imported `MenuButton.tsx` returns focus to its trigger on close when `Platform.OS` is `qnx` or `marathon` (MenuButton.tsx line 73).

## A11y

- Contrast: text-text 16.01/15.31:1, text-text-muted 5.54/7.9:1, errors text-danger 5.91/8.01:1; progress fill border-accent 4.65/9.81:1; recording dot border-danger 5.91/8.01:1.
- Keyboard and focus: Zoom buttons `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:82). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Zoom buttons min-h-11 min-w-11 (:82), bar minHeight 44 (:91). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- Screen reader: Selection, activity and zoom changes are polite live regions; progressbar with aria-valuemin/max/now (:103-105). The root View has label "Status" but no role (S3). The file's comment says recording clock and percent are not re-announced per tick.
- Motion: Indeterminate progress is a static 35% bar, no animation.
- Review status: **UNVERIFIED**. Zoom menu uses MenuButton (F12).
  - UNVERIFIED: Focus visibility inside the zoom menu (F12). Test: See CommandPopover.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=StatusBar
import {StatusBar} from "@nyc-tron/ui/components/shell/StatusBar";
export const Example = () => <StatusBar
  zoom={{value:100,onChange:()=>{},onFit:()=>{}}}
  units={{value:"px",options:[{value:"px",label:"Pixels"},{value:"mm",label:"Millimetres"}],onChange:()=>{}}}
  selection={{count:3,noun:{one:"layer",other:"layers"}}}
  activity={{kind:"rendering",progress:0.4,label:"Rendering"}}/>;
```

## Do/Don't

### Do

- Pass `zoom` and `units` only when you need them; each renders its own control, and `onFit` adds a 'Fit to window' choice.
- Keep the `presets` list inside `zoom` unique, finite and positive; the default is 25, 50, 100, 200, 400.
- Drive `activity` with the `rendering` kind and a `progress` value to get a progressbar with `aria-valuenow`.

### Don't

- Do not pass over 1000 presets or duplicates in `zoom`, or over 256 `units` options, since both throw a `RangeError`.
- Do not pass your own `accessibilityLabel`; the component sets 'Status' after the spread and ignores yours.
- Do not assume screen reader output or the 44pt claim for the menu triggers; both are UNVERIFIED (`F12`).
