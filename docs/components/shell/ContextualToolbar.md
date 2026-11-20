---
name: "ContextualToolbar"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/ContextualToolbar"
tier: 1
docs: "handwritten"
platforms: []
category: "navigation"
tokens: ["color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.text", "color.textMuted", "radius.control", "space.1"]
registryDependencies: ["@nyc-tron/Toolbar", "@nyc-tron/shell/MenuButton"]
a11yStatus: "unverified"
---

# ContextualToolbar

## Purpose

Toolbar whose items filter by selection kind and overflow into a More menu by priority, for React Native.

## Install

- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Toolbar, @nyc-tron/shell/MenuButton

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/ContextualToolbar
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ContextualToolbar } from "@/components/nyc-tron/ui/components/shell/ContextualToolbar";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ContextualToolbar } from "@nyc-tron/ui/components/shell/ContextualToolbar";`

### Dependencies

- `../Toolbar` (`Toolbar`, `density="compact"`), `./MenuButton` (`MenuButton`), `../forge/toggle-a11y` (`webToggleProps`), `../styles` (`joinClasses`), `./contextual-toolbar-model`.
- External: `react`, `react-native`, `zustand` (optional peer).

A hidden, zero-height, `opacity:0` copy of every applicable item is rendered to measure widths (`accessibilityElementsHidden`, `importantForAccessibility="no-hide-descendants"`, `aria-hidden`).

## Props

Tier-1 reason: R3 shell core. Import count: 0 (other packages: 0).
Also exported: types `ContextualToolbarItem`, `ContextualToolbarProps`.

`ContextualToolbarProps extends Omit<ViewProps,"children">`. `style` is merged after `{minWidth:0,direction}`; `onLayout` is not forwarded (the component sets its own `onLayout` after the spread, so a passed `onLayout` is overridden).

Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | `"toolbar"` | no | Part of the boundary with `revision`, `selectionKind`, `disabled`. A stale boundary makes `invoke` a no-op. |
| `revision` | `string \| number` | `0` | no |  |
| `disabled` | `boolean` | `false` | no |  |
| `items` | `readonly ContextualToolbarItem[]` | none | yes | At most 1000; unique nonblank ids; labels nonblank. `validateToolbarItems` throws otherwise. |
| `selectionKind` | `string` | none | yes | Items with `appliesTo` not containing it are hidden. |
| `label` | `string` | none | yes | `actionsLabel` of the shared `Toolbar`. |
| `onAction` | `(id: string) => void` | none | yes | Not called for disabled items. |
| `isRTL` | `boolean` | `false` | no | Sets `direction`. |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

`ContextualToolbarItem extends ToolbarItemSpec` with `icon?: ReactNode`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| id | `string` | none | yes | |
| label | `string` | none | yes | Accessible name, menu text, visible text. |
| priority | `number` | `0` | no | Higher stays visible longer; ties overflow in reverse declared order. |
| appliesTo | `readonly string[]` | none | no | Omit to apply to every kind. |
| pressed | `boolean` | none | no | Present means a toggle: sets `selected` state and web toggle props. |
| disabledReason | `string` | none | no | Disables the item, becomes `accessibilityHint`, menu description, and a visible line under the toolbar. |
| icon | `ReactNode` | none | no | |

### Tokens

| Token | Replaces | Count |
|---|---|---|
| space.1 | `gap: 4` | 1 |
| size.touch | `minWidth: 44`, `minHeight: 44` | 1 each |
| color.focus | `ring-focus` | 1 |
| color.primary | `bg-primary` | 1 |
| color.surfaceRaised | `bg-surface-raised` | 1 |
| color.onPrimary | `text-on-primary` | 1 |
| color.text | `text-text` | 2 |
| color.textMuted | `text-text-muted` | 1 |
| radius.control | `rounded-control` | 1 |

No token: `minWidth: 0` 1.
Tailwind default classes (no token): `px-3` 1, `gap-2` 1, `opacity-50` 1, `text-sm` 1.

### Unverified

- UNVERIFIED: `Toolbar` layout and its own a11y role; only the props passed (`density`, `actionsLabel`, `actions`, `unstyled`) were read here.
- UNVERIFIED: `MenuButton` open and focus-return behaviour for the "More" menu.
- UNVERIFIED: `webToggleProps` output; the file `forge/toggle-a11y.ts` was not read.
- UNVERIFIED: first-render overflow result. Widths come from `onLayout` of the hidden measuring copies, so the first frame uses the 96 fallback width per item.

## Variants

- Item `pressed`: `true` uses `bg-primary` and `text-on-primary`; otherwise `bg-surface-raised` and `text-text`.
- Overflow: items that do not fit move into a "More" `MenuButton`. Geometry: available width is `max(0,width-16)`, gap 4, "More" width 64, fallback item width 96.
- `unstyled`: removes the token classes.

## States

| State | How it is set | What the code does |
|---|---|---|
| `disabled (whole toolbar or item)` | derived in code | `disabled` on the `Pressable`, `accessibilityState.disabled`; item with `disabledReason` also gets `opacity-50` and the reason as hint. |
| `pressed toggle` | derived in code | `accessibilityState.selected` plus `webToggleProps(item.pressed)`. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | class `focus-visible:ring-2 focus-visible:ring-focus`. |
| `overflow` | derived in code | items listed in the "More" menu with `disabled` mirrored and a description (reason, or "On"/"Off" for toggles). |
| `hover, loading, error` | derived in code | no code. |

### Motion

none in source.

### Platform notes

none in source. Export conditions: `types`, `react-native`, `default`, same file.

## A11y

- Contrast: Pressed item bg-primary with text-on-primary 5.81/7.46:1; others text-text on raised 17.79/13.83:1; disabled reason text-text-muted 6.16/7.14:1. Selected item is bg-primary and the ring is ring-focus, the same colour (1/1:1); the ring's outer edge still meets the page at 5.81/6.93:1 (F07).
- Keyboard and focus: Items `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:37). A hidden measuring row is focusable={false}, tabIndex -1 and aria-hidden (:34, :46). Overflow uses MenuButton. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Items minWidth and minHeight 44 inline (:37, size.touch); Toolbar density compact. Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: Items role button with label, hint from disabledReason, state disabled and selected plus web toggle props (:34-35). Overflow button label "More actions".
- Motion: None.
- Review status: **UNVERIFIED**. Pressed fill and ring share one colour (F07); overflow menu is MenuButton (F12).
  - UNVERIFIED: Focus visibility on a pressed item (F07). Test: Tab to a pressed item and compare screenshots.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=ContextualToolbar
import {Text} from "react-native";
import {ContextualToolbar, type ContextualToolbarItem} from "@/components/nyc-tron/ui/components/shell/ContextualToolbar";

const items: readonly ContextualToolbarItem[] = [
  {id: "bold", label: "Bold", priority: 2, appliesTo: ["text"], pressed: true, icon: <Text>B</Text>},
  {id: "crop", label: "Crop", priority: 1, appliesTo: ["image"], disabledReason: "Select one image to crop"},
  {id: "delete", label: "Delete"},
];

export function Example() {
  return <ContextualToolbar label="Selection actions" selectionKind="text" items={items} onAction={(id) => { console.log(id); }}/>;
}
```

## Do/Don't

### Do

- Set `selectionKind` and `appliesTo` together so only items for the current selection show.
- Set `disabledReason` on a blocked item so users get a hint and a visible line instead of an unexplained dead button.

### Don't

- Don't pass `onLayout` and expect it to run; the component sets its own `onLayout` after the spread and overrides it.
- Don't use duplicate or blank item `id` values or more than 1000 `items`; `validateToolbarItems` throws.
- Don't trust the focus ring on a `pressed` item: `ring-focus` and `bg-primary` share one colour (F07), `UNVERIFIED`.
