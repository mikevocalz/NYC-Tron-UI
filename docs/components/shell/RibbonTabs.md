---
name: "RibbonTabs"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/RibbonTabs"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "navigation"
tokens: ["color.accent", "color.border", "color.focus", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/shell/MenuButton", "@nyc-tron/shell/SplitButton"]
a11yStatus: "unverified"
---

# RibbonTabs

## Purpose

Office-style ribbon of tabs and a command panel of buttons, split buttons and galleries; collapsible, for React Native.

## Install

- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/shell/MenuButton, @nyc-tron/shell/SplitButton

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/RibbonTabs
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { RibbonTabs } from "@/components/nyc-tron/ui/components/shell/RibbonTabs";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { RibbonTabs } from "@nyc-tron/ui/components/shell/RibbonTabs";`

### Dependencies

- Internal: `../overlays/popover-position.ts` (type), `../styles.ts`, `./MenuButton.tsx`, `./SplitButton.tsx`, `./shell-keys.ts`, `./ribbon-model.ts`.
- External: `react`, `react-native` (I18nManager, Platform, Pressable, ScrollView, Text, View).
- Optional peers: none for this file directly; `MenuButton` pulls in `zustand` (optional peer).

## Props

Exports one component, `RibbonTabs`, plus the type `RibbonTabsProps` and type re-exports `RibbonButton`, `RibbonCommand`, `RibbonGallery`, `RibbonGalleryItem`, `RibbonGroup`, `RibbonSplit`, `RibbonTab`. The inner `Gallery` component is not exported.

Extends `ViewProps` minus `children`. `style` is forwarded to the root; others spread onto it.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | `"ribbon"` | no | Boundary is `[scope, revision, disabled, active tab id, collapsed]`. |
| `revision` | `string \| number` | `0` | no |  |
| `disabled` | `boolean` | `false` | no |  |
| `tabs` | `readonly RibbonTab[]` | none | yes | `validateRibbon` throws on over 64 tabs, duplicate ids, empty labels or an invalid gallery selection. |
| `activeTabId` | `string` | none | yes | Falls back to the first tab if it matches none. |
| `onTabChange` | `(id: string) => void` | none | yes |  |
| `onCommand` | `(commandId: string, itemId?: string) => void` | none | yes | `itemId` is set for split flyout and gallery picks. |
| `collapsed` | `boolean` | `false` | no | Hides the command panel. |
| `onCollapsedChange` | `(collapsed: boolean) => void` | none | no | The collapse chevron renders only when set. |
| `label` | `string` | `"Ribbon"` | no | Name of the tab list. |
| `usableRegions` | `readonly Rect2D[]` | none | no | Passed to split flyouts and the gallery "More" menu. |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

Model types, one level: `RibbonTab {id, label, contextualGroup?, groups: RibbonGroup[]}`; `RibbonGroup {id, label, commands: RibbonCommand[]}`; `RibbonButton {kind:"button", id, label, icon?, pressed?, disabled?}`; `RibbonSplit {kind:"split", id, label, icon?, items: CommandMenuItem[], disabled?}`; `RibbonGallery {kind:"gallery", id, label, items: RibbonGalleryItem[], selectedId?, inline? (default 4 per doc comment)}`; `RibbonGalleryItem {id, label, preview: ReactNode}`.

### Tokens

- Colour classes: color.focus (6), color.textMuted (4), color.primary (3), color.border (3), color.surfaceSunken (2), color.text (2), color.accent (2), color.surfaceRaised (1).
- radius.control (3).
- Spacing: space.0.5 (gap 2 x3, paddingTop 2 x1), space.1 (paddingHorizontal 4, padding 4, gap 4 x3, marginVertical 4), space.3 (paddingHorizontal 12), space.1.5 (paddingHorizontal 6).
- border.1_5 (borderRightWidth, borderBottomWidth), border.1 (borderLeftWidth).
- no token: tab rule height 3, chevron size 8.
- Tailwind default classes (no token): min-h-11, min-w-11, gap-2, px-2, px-3, rounded-control, border, opacity-40, text-sm, text-xs, font-semibold.

### Unverified

- UNVERIFIED: `rovingTarget` return values for each key; `shell-keys.ts` was not read.
- UNVERIFIED: screen reader output for `tablist`, `tab` and `tabpanel` roles on native.
- UNVERIFIED: how many inline gallery items show (`inlineGalleryItems` was not read; the default 4 is from a doc comment).

## Variants

- Command `kind`: `button` renders a Pressable, a toggle when `pressed` is defined; `split` renders a `SplitButton`; `gallery` renders inline radio items plus a "More" `MenuButton` when `items.length` exceeds the inline count.
- `contextualGroup` on a tab: shows the group name above the tab in `text-accent` and gives the tab `border-t-2 border-accent`.

## States

| State | How it is set | What the code does |
|---|---|---|
| `tab selected` | derived in code | `accessibilityState.selected` and `aria-selected` true only when the tab is active and the panel is not collapsed; label `text-text font-semibold`, 3-wide `border-primary` rule. |
| `tab roving focus` | derived in code | web `tabIndex` 0 on the selected tab, -1 on the rest. |
| `disabled` | `disabled` prop | `disabled` on tabs and commands; per-command `disabled` adds `opacity-40`. |
| `toggle pressed` | derived in code | `aria-pressed`, `accessibilityState.selected`, classes `bg-primary/10 border border-focus`. |
| `collapsed` | `collapsed` prop | panel not rendered; collapse button has `aria-expanded`, label "Show ribbon commands" or "Hide ribbon commands". Picking a tab while collapsed calls `onCollapsedChange(false)`. |
| `gallery item` | derived in code | `role="radio"`, `aria-checked`, classes `border border-focus bg-primary/10` when selected. |
| `focus and hover` | class `focus-visible:ring-2 focus-visible:ring-focus` | `focus-visible:ring-2 focus-visible:ring-focus`, `hover:bg-surface-sunken`. |

### Motion

none in source.

### Platform notes

- `Platform.OS==="web"`: tabs and gallery items get `onKeyDown` and `tabIndex`; arrow keys move focus and also select the tab (or gallery item) through `rovingTarget`.
- RTL: `nodeIsRTL(target)` or `I18nManager.isRTL` passed to `rovingTarget`.
- Tab list and panel scroll horizontally with `ScrollView` on all platforms.
- Package export: `react-native` and `default` conditions both point at `dist/components/shell/RibbonTabs.js`.

## A11y

- Contrast: Selected tab text-text semibold with a 3px border-primary top bar 5.81/6.93:1; pressed commands bg-primary/10 plus border-focus 5.81/6.93:1; text-accent 5.17/8.86:1; inactive text-text-muted 6.16/7.14:1.
- Keyboard and focus: Web: roving tabIndex and arrows (:58, :97); `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1). Commands inside use MenuButton and SplitButton. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Tabs min-h-11, commands min-h-11 min-w-11 (:78, :98, :112). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- Screen reader: tablist, tab with selected state, tabpanel with label, groups, toggles with aria-pressed, gallery as radiogroup with radio items (:75-143).
- Motion: None.
- Review status: **UNVERIFIED**. Embeds MenuButton and SplitButton menus (F12).
  - UNVERIFIED: Focus visibility inside ribbon menus (F12). Test: See CommandPopover.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=RibbonTabs
import {useState} from "react";
import {RibbonTabs,type RibbonTab} from "@/components/nyc-tron/ui/components/shell/RibbonTabs";

const tabs:RibbonTab[]=[
  {id:"home",label:"Home",groups:[{id:"clip",label:"Clipboard",commands:[
    {kind:"button",id:"paste",label:"Paste"},
    {kind:"button",id:"bold",label:"Bold",pressed:false},
    {kind:"split",id:"export",label:"Export",items:[{id:"pdf",label:"PDF"},{id:"png",label:"PNG"}]},
  ]}]},
  {id:"insert",label:"Insert",groups:[]},
];
export const Example=()=>{
  const [active,setActive]=useState("home");
  const [collapsed,setCollapsed]=useState(false);
  return <RibbonTabs tabs={tabs} activeTabId={active} onTabChange={setActive} onCommand={(id,item)=>console.log(id,item)}
    collapsed={collapsed} onCollapsedChange={setCollapsed}/>;
};
```

## Do/Don't

### Do

- Give every tab in `tabs` a unique `id` and non-empty label; `validateRibbon` throws on duplicates, empty labels or more than 64 tabs.
- Pass `onCollapsedChange` if users should collapse the ribbon, because the chevron renders only when it is set.
- Read `itemId` in `onCommand` to tell split flyout and gallery picks apart from plain button presses.

### Don't

- Do not assume menu focus is visible; focus inside the `SplitButton` and `MenuButton` menus is UNVERIFIED (F12).
- Do not pick a `selectedId` that is not in a gallery's `items`; `validateRibbon` rejects an invalid gallery selection.
- Do not rely on the inline gallery count of 4; it comes from a doc comment and `inlineGalleryItems` is UNVERIFIED.
