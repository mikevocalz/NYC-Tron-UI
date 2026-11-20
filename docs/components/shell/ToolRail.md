---
name: "ToolRail"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/ToolRail"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "shell"
tokens: ["color.border", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "radius.control"]
registryDependencies: ["@nyc-tron/overlays/CommandPopover"]
a11yStatus: "unverified"
---

# ToolRail

## Purpose

Toolbar rail of tool buttons, vertical on the left or right edge or a row at the bottom, with group flyouts, for React Native.

## Install

- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/overlays/CommandPopover

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/ToolRail
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ToolRail } from "@/components/nyc-tron/ui/components/shell/ToolRail";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ToolRail } from "@nyc-tron/ui/components/shell/ToolRail";`

### Dependencies

- `../overlays/CommandPopover.tsx`, `../overlays/popover-position.ts` (type), `./shell-keys.ts`, `./tool-rail-model.ts`, `../styles.ts`.
- External: `react`, `react-native` (`I18nManager`, `Platform`, `Pressable`, `useWindowDimensions`), `zustand`, `zustand/vanilla`. `zustand` is an optional peer.

## Props

Exports: `ToolRail`, `ToolRailProps`, `RailTool`, `RailToolVariant`, `ToolIcon`, `shownVariantId`, `toolIsActive`.

`ToolRailProps` extends `Omit<ViewProps,"children">`. Rest spread goes to the root `View`; `accessibilityRole="toolbar"`, `accessibilityLabel` and `aria-orientation` are set after the spread.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | `"tools"` | no | In the boundary string; a change closes the flyout. |
| `revision` | `string \| number` | `0` | no | Same. |
| `disabled` | `boolean` | `false` | no | Disables every button and ignores selection. |
| `tools` | `readonly RailTool[]` | none | yes | Validated by `validateRailTools`. |
| `activeToolId` | `string \| undefined` | none | yes | Tool or variant id; the prop key is required but may be `undefined`. |
| `onSelectTool` | `(id: string) => void` | none | yes |  |
| `groupSelection` | `Readonly<Record<string, string>>` | none | no | Variant each group button shows; falls back to the first variant. |
| `label` | `string` | `"Tools"` | no | Toolbar accessible name. |
| `edge` | `"left" \| "right" \| "bottom"` | `"left"` | no |  |
| `expanded` | `boolean` | `false` | no | Shows text labels beside icons. |
| `usableRegions` | `readonly Rect2D[]` | none | no | Falls back to a region of the window size. |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

`RailTool`: `id`, `label`, `icon:ToolIcon` (required), `shortcut?`, `disabled?`, `variants?:readonly RailToolVariant[]`.
`RailToolVariant`: `id`, `label`, `icon:ToolIcon` (required), `shortcut?`.
`ToolIcon`: `ReactNode | ((state:{active:boolean})=>ReactNode)`.

`shownVariantId(tool, groupSelection?)` returns the chosen variant id if it exists, else the first variant id, else the tool id. `toolIsActive(tool, activeToolId)` is true when the id equals the tool or any variant id. `validateRailTools` throws for more than 256 tools, more than 64 variants on a tool, empty, duplicate or over-long ids (256), labels over 512 characters, shortcuts over 256 characters, or a non-boolean `disabled`.

### Tokens

- Colour classes: `color.border` 3, `color.surfaceRaised` 1, `color.focus` 1, `color.primary` 1, `color.surfaceSunken` 1, `color.onPrimary` 1, `color.text` 1. Radius class: `radius.control` 1. The tool also matches `border-b-on-primary` and `border-b-text-muted` strings in code; the tool output does not list them separately.
- Literals: `borderLeftWidth: 5` and `borderBottomWidth: 5` map to a component-scoped `<Comp>.border.5` (1 each; not a global token).
- no token: icon box 28, corner offsets 3, flyout width 232, flyout offsets 4, 8 and 236.
- Tailwind default classes (no token): `gap-1` 1, `p-1` 1, `border` 12, `min-h-11` 1, `min-w-11` 1, `gap-2` 1, `rounded-control` 1, `border-2` 1, `px-2` 1, `opacity-40` 1, `text-sm` 1.

### Unverified

- UNVERIFIED: flyout placement and dismissal; `CommandPopover` was not read.
- UNVERIFIED: roving-focus results of `rovingTarget` and the key shapes from `shellKey` (`shell-keys.ts` not read).
- UNVERIFIED: that long press and the `showVariants` screen-reader action open the flyout on a device; only the handlers are in source.
- UNVERIFIED: whether `measureInWindow` exists on every host's Pressable ref; the code skips the flyout when it is missing.

## Variants

- `edge`: `"left"` adds `border-r border-border`; `"right"` adds `border-l border-border`; `"bottom"` adds `border-t border-border` and lays tools in a wrapping row (otherwise a column). Left and right rails use the `vertical` roving axis, bottom uses `horizontal`. The flyout opens to the right of the tool for `left`, to the left for `right`, above for `bottom`.
- `expanded`: `true` adds `px-2` and a label `Text`; `false` adds `justify-center`.

## States

| State | How it is set | What the code does |
|---|---|---|
| `active` | derived in code | `toolIsActive`; sets `accessibilityState.selected`, `aria-pressed`, class `bg-primary forced-colors:border-2 forced-colors:border-[Highlight]`, label `text-on-primary`. |
| `resting` | derived in code | `bg-transparent hover:bg-surface-sunken`. |
| `disabled` | `disabled` prop | rail `disabled` or `tool.disabled`; `disabled` on the Pressable, `accessibilityState.disabled`; per-tool disabled adds `opacity-40`. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | `focus-visible:ring-2 focus-visible:ring-focus`; web keeps a roving `tabIndex` (0 on one stop, -1 elsewhere). |
| `group` | derived in code | a corner triangle drawn with borders, `aria-haspopup="menu"`, accessibilityHint "Long press for more tools.", actions `activate` and `showVariants`. |
| `flyout open` | derived in code | `CommandPopover` listing variants, with description "Current tool" and shortcut text. |
| `pressed` | derived in code | no code. |

### Motion

none in source.

### Platform notes

- `Platform.OS==="web"`: adds `onKeyDown` and the roving `tabIndex` to each button.
- `I18nManager.isRTL` or the node direction flips the roving arrow direction; `edge` picks the arrow that opens the flyout (`ArrowRight` for left, `ArrowLeft` for right, `ArrowUp` for bottom).
- Flyout anchoring calls `measureInWindow` on the node when present.
- package.json export conditions: `types`, `react-native`, `default`, all to the same dist file. No `.native`/`.web` siblings.

## A11y

- Contrast: Active tool bg-primary with text-on-primary 5.81/7.46:1; others text-text 17.79/13.83:1. Selected item is bg-primary and the ring is ring-focus, the same colour (1/1:1); the ring's outer edge still meets the page at 5.81/6.93:1 (F07).
- Keyboard and focus: Web: roving tabIndex and arrows (:81-125); `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:127). Flyout is CommandPopover. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: min-h-11 min-w-11 (:126). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- Screen reader: role=toolbar with orientation; tools role=button with label, hint (shortcut and long-press), state selected, aria-pressed, aria-haspopup, actions activate and showVariants (:97-116).
- Motion: None.
- Review status: **UNVERIFIED**. Active fill and ring share one colour (F07); flyout is CommandPopover (F12).
  - UNVERIFIED: Focus visibility on the active tool (F07). Test: Tab to the active tool and compare screenshots.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=ToolRail
import {ToolRail} from "@/components/nyc-tron/ui/components/shell/ToolRail";
import {Text} from "react-native";
export const Example = () => <ToolRail edge="left" activeToolId="move" onSelectTool={()=>{}}
  tools={[
    {id:"move",label:"Move",shortcut:"V",icon:<Text>M</Text>},
    {id:"brush",label:"Brush",icon:<Text>B</Text>,variants:[
      {id:"brush.soft",label:"Soft brush",icon:<Text>S</Text>,shortcut:"B"},
      {id:"brush.hard",label:"Hard brush",icon:({active})=><Text>{active?"H*":"H"}</Text>}]},
  ]}/>;
```

## Do/Don't

### Do

- Pass `activeToolId` explicitly, even as `undefined`; the key is required.
- Choose `edge` to match placement, since `bottom` switches to a wrapping row and a horizontal roving axis.
- Provide `variants` on a tool to make a group; it gets `aria-haspopup="menu"` and a long-press hint.

### Don't

- Do not assume the active tool shows focus; its fill and `ring-focus` share one colour (F07), unverified.
- Do not rely on flyout placement or dismissal; both live in `CommandPopover` and are UNVERIFIED (F12).
- Do not pass over 256 `tools`, over 64 variants or duplicate ids; `validateRailTools` throws.
