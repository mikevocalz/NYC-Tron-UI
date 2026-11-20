---
name: "TabBar"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/TabBar"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "navigation"
tokens: ["color.border", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# TabBar

## Purpose

Tab strip with tablist or link-navigation semantics, icons and compact density, for React Native; web roving focus.

## Install

- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/TabBar
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { TabBar } from "@/components/nyc-tron/ui/components/TabBar";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { TabBar } from "@nyc-tron/ui/components/TabBar";`

### Dependencies

- `joinClasses`; `domIsRTL`, `isModified`, `nextChoiceIndex`, `rovingStop`, `webKey` (same package).
- react-native (peer, required): I18nManager, Platform, Pressable, Text, View.
- No optional peers.

## Props

`TabBarProps` extends `Omit<ViewProps,"children"|"role">`.

Extends: `Omit<ViewProps, "children" | "role">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `tabs` | `readonly TabBarTab[]` | none | yes | Expanded below. |
| `semantics` | `"tabs" \| "navigation"` | `"tabs"` | no | Changes roles, see Variants. |
| `density` | `"navigation" \| "compact"` | `"navigation"` | no |  |
| `aria-label` | `string` | `"Navigation"` | no |  |
| `className` | `string` | none | no |  |
| `tabClassName` | `string` | none | no |  |
| `labelClassName` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

`TabBarTab`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| key | `string` | none | yes |  |
| label | `string` | none | yes | Also the tab `aria-label`. |
| icon | `ReactNode | ((state:TabIconState)=>ReactNode)` | none | no | `TabIconState` is `{readonly active:boolean}`. |
| active | `boolean` | none | no |  |
| disabled | `boolean` | none | no |  |
| onPress | `()=>void` | none | no |  |
| href | `string` | none | no | Used as `href` only when `semantics="navigation"` on web. |

### Tokens

- `color.border` x1, `color.surfaceRaised` x1, `color.focus` x1, `color.primary` x1, `color.surfaceSunken` x1, `color.onPrimary` x1, `color.textMuted` x1
- `radius.control` x1

Tailwind default classes (no token): `min-w-0` x4, `gap-0` (from `gap-0.5`), `border` x4, `px-1` x2, `py-1` x2, `min-h-11`, `min-w-11`, `gap-1` x2, `px-2`, `min-h-14`, `border-2`, `opacity-50`, `text-sm`, `font-medium`.

### Unverified

- UNVERIFIED: Whether `href` on a Pressable renders an anchor on web is behaviour of react-native-web, not code in this file.

## Variants

`semantics`:
- `tabs`: container `role="tablist"`, tabs `role="tab"`, `aria-selected`, `accessibilityState.selected`.
- `navigation`: container `role="navigation"`, tabs `role="link"`, web `aria-current="page"` on active, no selected state.

`density`:
- `navigation`: container `w-full min-w-0 flex-row items-stretch`; styled adds `border-t border-border bg-surface-raised px-1 py-1`; tab `flex-1 gap-1 px-1 py-1.5 min-h-14`.
- `compact`: container `min-w-0 shrink flex-row items-stretch`; styled adds `gap-0.5`; tab `min-w-0 shrink grow-0 basis-auto flex-row gap-1.5 px-2`, label `min-w-0 shrink`.

## States

| State | How it is set | What the code does |
|---|---|---|
| `active` | derived in code | `active` on a tab; `bg-primary`, `text-on-primary`. |
| `inactive` | class `hover:bg-surface-sunken` | `bg-transparent`, `text-text-muted`, `hover:bg-surface-sunken`. |
| `disabled` | derived in code | `disabled` on a tab; `opacity-50`, `aria-disabled`. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | `focus-visible:ring-2 focus-visible:ring-focus`. |
| `pressed` | derived in code | no code. |

### Motion

`motion-reduce:transition-none`. No Animated calls.

### Platform notes

- Web only (`Platform.OS==="web"`): `aria-current`; in `tabs` mode `onKeyDown` and roving `tabIndex` (active tab 0, others -1); `href` in `navigation` mode.
- Arrow keys flip in RTL via `I18nManager.isRTL` or DOM direction; Home/End jump; focus moves via ref `.focus()`, then calls the target tab's `onPress`.

## A11y

- Contrast: Active tab bg-primary with text-on-primary 5.81/7.46:1; inactive text-text-muted 6.16/7.14:1. Selected item is bg-primary and the ring is ring-focus, the same colour (1/1:1); the ring's outer edge still meets the page at 5.81/6.93:1 (F07).
- Keyboard and focus: `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:92). Web: roving tabIndex and arrows in tabs mode (:57, :87). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: min-h-11 min-w-11 (:89), non-compact min-h-14 (56, :91). Android compact: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- Screen reader: tabs: tablist and tab with aria-selected; navigation: role=navigation with link items and aria-current=page (:69-87).
- Motion: `motion-reduce:transition-none` with no transition (F09).
- Review status: **UNVERIFIED**. Active fill and ring share one colour (F07).
  - UNVERIFIED: Focus visibility on the active tab (F07). Test: Tab to the active tab and compare screenshots.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=TabBar
import { useState } from "react";
import { Text } from "react-native";
import { TabBar } from "@/components/nyc-tron/ui/components/TabBar";

export function PaneTabs() {
  const [active, setActive] = useState("layers");
  return (
    <TabBar
      aria-label="Inspector"
      density="compact"
      tabs={[
        { key: "layers", label: "Layers", active: active === "layers", onPress: () => setActive("layers"),
          icon: ({ active: on }) => <Text>{on ? "L" : "l"}</Text> },
        { key: "assets", label: "Assets", active: active === "assets", onPress: () => setActive("assets") },
      ]}
    />
  );
}
```

## Do/Don't

### Do

- Use `semantics="navigation"` with `href` for link tabs; it gives `aria-current="page"` instead of `aria-selected`.
- Give every tab a unique `key` and a `label`, which also becomes the tab `aria-label`.
- Set `aria-label` to a meaningful name when several bars exist; the default is 'Navigation'.

### Don't

- Do not assume the active tab shows focus; `bg-primary` and `ring-focus` are one colour (F07), unverified.
- Do not set `href` expecting links in `semantics="tabs"`; it applies only with `navigation` on web, and react-native-web behaviour is UNVERIFIED.
- Do not rely on `density="compact"` for Android touch size; it is 44, 4dp under the 48dp guideline (F08).
