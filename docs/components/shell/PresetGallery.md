---
name: "PresetGallery"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/PresetGallery"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "input"
tokens: ["PresetGallery.border.13", "border.0", "border.1_5", "color.accent", "color.border", "color.focus", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.2", "radius.card", "radius.control", "space.0.5", "space.1", "space.4"]
registryDependencies: []
a11yStatus: "unverified"
---

# PresetGallery

## Purpose

Grid of selectable preset tiles with hover preview, favorites toggle and All or Favorites filter, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { PresetGallery } from "@nyc-tron/ui/shell/PresetGallery";`
- Peers: react, react-native, zustand
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/PresetGallery
```

### Dependencies

- Internal: `../styles.ts`, `./shell-keys.ts`, `./preset-model.ts`.
- External: `react`, `react-native` (I18nManager, Platform, Pressable, Text, View), `zustand`, `zustand/vanilla`.
- Optional peers: `zustand`.

## Props

Also exports types `Preset`, `PresetFilter` (`"all" | "favorites"`, re-exported from `preset-model.ts`) and `PresetGalleryProps`. `Bookmark` is internal and not exported.

Extends `ViewProps` minus `children`. `style` is forwarded to the root; `onLayout` is called after the grid width is stored.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | `"preset-gallery"` | no | Part of the boundary `[scope, revision, disabled, filter]`. |
| `revision` | `string \| number` | `0` | no |  |
| `disabled` | `boolean` | `false` | no |  |
| `label` | `string` | none | yes | Name of the radiogroup; the filter group is named `<label> filter`. |
| `presets` | `readonly Preset[]` | none | yes | Checked by `validatePresets`. |
| `selectedId` | `string \| undefined` | none | yes |  |
| `onSelect` | `(id: string) => void` | none | yes |  |
| `onPreview` | `(id: string \| undefined) => void` | none | no | Hover or focus gives an id; leaving gives `undefined`. |
| `onFavoriteChange` | `(id: string, favorite: boolean) => void` | none | no | Its presence adds a favorite toggle to each tile. |
| `filter` | `PresetFilter` | `"all"` | no |  |
| `onFilterChange` | `(filter: PresetFilter) => void` | none | no | The All / Favorites buttons render only when both this and `onFavoriteChange` are set. |
| `minTileWidth` | `number` | `112` | no |  |
| `className` | `string` | none | no | Joined after `gap-2`. |
| `unstyled` | `boolean` | `false` | no |  |

`Preset`: `id: string`, `name: string`, `preview: ReactNode`, `favorite?: boolean` (all readonly).

### Tokens

- Colour classes: color.text (6), color.focus (4), color.surfaceRaised (3), color.surfaceSunken (3), color.textMuted (2), color.border (1), color.primary (1), color.accent (1).
- Radius classes: radius.control (3), radius.card (1).
- Spacing: space.1 (gap 4, paddingHorizontal 4), space.0.5 (paddingBottom 2), space.4 (paddingVertical 16).
- radius.2 (borderTopLeftRadius, borderTopRightRadius 2). border.1_5 (borderWidth, borderLeftWidth, borderTopWidth 1.5; 3 uses), border.0 (borderBottomWidth 0).
- Component-level: PresetGallery.border.13 (borderTopWidth 13).
- no token: `GAP` 8 for grid gap, tile `aspectRatio` 4/3, bookmark sizes 14, 18, 22, 8.
- Tailwind default classes (no token): min-h-11, min-w-11, px-3, rounded-control, rounded-card, border, border-2, text-sm, text-xs, font-semibold, gap-1, gap-2.

### Unverified

- UNVERIFIED: column count and keyboard target math; they come from `galleryColumns` and `gridFocusTarget` in `preset-model.ts`, which was not read.
- UNVERIFIED: whether `onHoverIn` and `onHoverOut` fire on touch platforms.

## Variants

- `filter`: `all` shows every preset; `favorites` passes the list through `filterPresets`. The empty favorites view shows "No favorite presets yet." and "Use the bookmark on a preset to keep it here."; the empty all view shows "No presets.".

## States

| State | How it is set | What the code does |
|---|---|---|
| `default tile` | class `hover:bg-surface-sunken` | padding 4, `hover:bg-surface-sunken`. |
| `selected tile` | derived in code | `role="radio"` with `aria-checked`, padding 2, classes `border-2 border-focus bg-primary/10`, name in `font-semibold`. |
| `disabled` | `disabled` prop | `disabled` and `accessibilityState.disabled` on every Pressable; tab stops removed. |
| `favorite` | derived in code | label gets ", favorite"; bookmark glyph fills; toggle has `aria-pressed`. |
| `filter button on` | derived in code | `aria-pressed` and `accessibilityState.selected`, classes `bg-surface-raised border border-border`. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | `focus-visible:ring-2 focus-visible:ring-focus`; roving focus index kept in local state. |
| `empty` | derived in code | see Variants. |

### Motion

none in source.

### Platform notes

- `Platform.OS==="web"`: tiles get `onKeyDown` and `tabIndex` (0 for one tile, -1 for others), so the grid is one Tab stop with arrow, Home and End movement.
- RTL: arrow direction flips when `nodeIsRTL(target)` or `I18nManager.isRTL`.
- Pointer hover uses `onHoverIn` and `onHoverOut`; focus and blur also drive `onPreview` on all platforms.
- Package export: `react-native` and `default` conditions both point at `dist/components/shell/PresetGallery.js`.

## A11y

- Contrast: Selected tile border-2 border-focus with bg-primary/10 5.81/6.93:1; text-text 17.79/13.83:1; favourite glyph border-accent 5.17/8.86:1.
- Keyboard and focus: Web: roving tabIndex and arrows (:83, :119); `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1). Focusing a tile previews the preset in the host (:118) (F18). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Tiles min-h-11, filter and favourite buttons min-h-11 min-w-11 (:97, :120, :133). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- Screen reader: radiogroup of role=radio tiles with checked state; filter buttons with aria-pressed; favourite toggles with composed labels (:95-131).
- Motion: None.
- Review status: **UNVERIFIED**. Focus triggers a preview (3.2.1) (F18).
  - UNVERIFIED: Whether focus-triggered preview counts as a change of context (F18). Test: Tab through the gallery with a screen reader and confirm the preview does not move focus, navigate, or announce unprompted.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=PresetGallery
import {useState} from "react";
import {View} from "react-native";
import {PresetGallery,type Preset,type PresetFilter} from "@nyc-tron/ui/components/shell/PresetGallery";

const swatch=(c:string)=><View style={{flex:1,backgroundColor:c}}/>;
const presets:Preset[]=[
  {id:"warm",name:"Warm",preview:swatch("#c96")},
  {id:"cool",name:"Cool",preview:swatch("#69c"),favorite:true},
];
export const Example=()=>{
  const [selected,setSelected]=useState<string|undefined>("warm");
  const [filter,setFilter]=useState<PresetFilter>("all");
  return <PresetGallery label="Color grade presets" presets={presets} selectedId={selected} onSelect={setSelected}
    onFavoriteChange={(id,fav)=>console.log(id,fav)} filter={filter} onFilterChange={setFilter}/>;
};
```

## Do/Don't

### Do

- Pass both `onFavoriteChange` and `onFilterChange` when you want the All and Favorites buttons, since they render only when both are set.
- Treat `onPreview` as hover and focus feedback and make it side-effect light, because it also fires on focus (F18).
- Set `label` to a descriptive name; it names the radiogroup and the filter group is named `<label> filter`.

### Don't

- Do not claim focus-driven `onPreview` is accessible without a screen reader test; whether it counts as a change of context is UNVERIFIED (F18).
- Do not assume the column count or arrow-key target math; `galleryColumns` and `gridFocusTarget` were not read and are UNVERIFIED.
- Do not omit `selectedId`, `onSelect` or `presets`; they are required props, and `presets` is checked by `validatePresets`.
