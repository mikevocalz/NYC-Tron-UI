---
name: "MenuButton"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/MenuButton"
tier: 1
docs: "handwritten"
platforms: []
category: "overlay"
tokens: ["color.focus", "radius.control"]
registryDependencies: ["@nyc-tron/overlays/CommandPopover"]
a11yStatus: "unverified"
---

# MenuButton

## Purpose

Button that opens a command popover menu; ArrowDown opens it on web, for React Native; QNX focus return.

## Install

- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/overlays/CommandPopover

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/MenuButton
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { MenuButton } from "@/components/nyc-tron/ui/components/shell/MenuButton";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { MenuButton } from "@nyc-tron/ui/components/shell/MenuButton";`

### Dependencies

- Internal: `../overlays/CommandPopover.tsx` (`CommandPopover`, type `CommandMenuItem`), `../overlays/popover-position.ts`, `../styles.ts`, `./shell-keys.ts`.
- External: `react`, `react-native` (Platform, Pressable, useWindowDimensions), `zustand`, `zustand/vanilla`.
- Optional peers: `zustand`, `@nyc-tron/core`.

## Props

Extends `PressableProps` minus `children`, `onPress`, `accessibilityLabel`, `aria-label`. Other PressableProps are spread onto the Pressable (`{...rest}`) before the component's own props, so `accessibilityRole`, `accessibilityState`, `aria-haspopup`, `aria-expanded`, `disabled`, `onPress` and `className` set by the component win. `style` and `testID` are read: `style` is forwarded, `testID` yields `<testID>-popover` on the popover.

Extends: `Omit<PressableProps, "children" | "onPress" | "accessibilityLabel" | "aria-label">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | none | yes | Becomes `accessibilityLabel` and the popover label. |
| `editScope` | `string` | `"menu"` | no | Throws `RangeError` if blank or over 32768 characters. A change closes the menu. |
| `items` | `readonly CommandMenuItem[]` | none | yes |  |
| `onSelect` | `(id: string) => void` | none | yes | Called only for an enabled item while the menu is still owned. |
| `children` | `ReactNode` | none | yes | Button content. |
| `usableRegions` | `readonly Rect2D[]` | window rectangle | no |  |
| `menuWidth` | `number` | `240` | no | Passed as `width` to `CommandPopover`. |
| `disabled` | `boolean` | `false` | no | Also disabled when no item is enabled or no usable region exists. |
| `className` | `string` | none | no | Appended last to the class list. |
| `unstyled` | `boolean` | `false` | no | Drops `rounded-control` and the focus ring. |
| `ref` | `Ref<ComponentRef<typeof Pressable>>` | none | no | Function or object ref is filled with the Pressable node. |

`CommandMenuItem` (core/overlays.ts): `{id: string; label: string; description?: string; disabled?: boolean; danger?: boolean}`.

### Tokens

- color.focus (1), radius.control (1).
- Tailwind default classes (no token): min-h-11, min-w-11, rounded-control, opacity-40.

### Unverified

- UNVERIFIED: popover placement, dismissal and focus handling outside qnx/marathon; they live in `CommandPopover`, which was not read.
- UNVERIFIED: whether `measureInWindow` exists on every target; the code skips opening if it is missing.

## Variants

none.

## States

| State | How it is set | What the code does |
|---|---|---|
| `default` | derived in code | closed button. |
| `disabled` | `disabled` prop | `accessibilityState.disabled` is true and `disabled` is passed to Pressable when `disabled`, no enabled item, or no usable region; class `opacity-40`. |
| `expanded` | derived in code | `aria-expanded` and `accessibilityState.expanded` are true while the popover is open. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | `focus-visible:ring-2 focus-visible:ring-focus` when styled. |
| `opening` | derived in code | `onPress` and ArrowDown (without Alt, Ctrl, Meta) measure the button with `measureInWindow` and open the popover only if width and height are positive. |

### Motion

none in source.

### Platform notes

- When the popover closes, focus returns to the button explicitly only if `String(Platform.OS)` is `"qnx"` or `"marathon"`. Other platforms rely on whatever `CommandPopover` does.
- ArrowDown opening is attached through `onKeyDown`, which React Native delivers on web.
- Package export: `react-native` and `default` conditions both point at `dist/components/shell/MenuButton.js`.

## A11y

- Contrast: Opens CommandPopover (F12). Disabled opacity 0.4 exempt.
- Keyboard and focus: `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:89). ArrowDown opens the menu (:84-86); on QNX and marathon focus returns to the button on close (:73). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: min-h-11 min-w-11 (:88, 44). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- Screen reader: role=button, label, aria-haspopup=menu, aria-expanded, state expanded and disabled (:80-82).
- Motion: Via CommandPopover (F09).
- Review status: **UNVERIFIED**. Menu is CommandPopover (F12).
  - UNVERIFIED: Focus visibility inside the opened menu (F12). Test: See CommandPopover.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=MenuButton
import {Text} from "react-native";
import {MenuButton} from "@/components/nyc-tron/ui/components/shell/MenuButton";

export const Example=()=><MenuButton label="Panel options" items={[
  {id:"rename",label:"Rename"},
  {id:"delete",label:"Delete",danger:true},
]} onSelect={id=>console.log(id)}><Text>Options</Text></MenuButton>;
```

## Do/Don't

### Do

- Set `label` on every `MenuButton`, because it becomes the `accessibilityLabel` and the popover label.
- Give at least one enabled entry in `items`, since the button disables itself when none is enabled.

### Don't

- Don't pass a blank `editScope` or one over 32768 characters; it throws `RangeError`.
- Don't count on a visible focus cue inside the menu; `CommandPopover` uses a 1.15/1.2:1 tint (F12), and a host outline is `UNVERIFIED`.
- Don't expect focus to return to the button on every platform; the page says it is explicit only when `Platform.OS` is `qnx` or `marathon`.
