---
name: "WorkspaceHost"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/WorkspaceHost"
tier: 1
docs: "handwritten"
platforms: ["ios", "web", "macos"]
category: "shell"
tokens: ["border.4", "color.accent", "color.border", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "radius.4", "radius.control", "space.0.5", "space.1", "space.2"]
registryDependencies: ["@nyc-tron/shell/AdaptiveDock"]
a11yStatus: "unverified"
---

# WorkspaceHost

## Purpose

Workspace shell with mode tabs, per-mode dock layouts and Ctrl or Cmd+1..9 shortcuts, for React Native; web shortcuts.

## Install

- Package: @nyc-tron/ui
- Import: `import { WorkspaceHost } from "@nyc-tron/ui/shell/WorkspaceHost";`
- Peers: @nyc-tron/core, react, react-native, zustand
- Requires: @nyc-tron/shell/AdaptiveDock

```sh
npx shadcn@latest add @nyc-tron/shell/WorkspaceHost
```

### Dependencies

- `./AdaptiveDock.tsx`, `./dock-model.ts`, `./shell-keys.ts`, `./workspace-model.ts`, `../forge/announce.ts`, `../overlays/popover-position.ts` (type), `../styles.ts`, type `FoldFeature` from `@nyc-tron/core/folds`.
- External: `react`, `react-native` (`ScrollView`, `Pressable`, `Platform`), `zustand`, `zustand/vanilla`. `zustand` and `@nyc-tron/core` are optional peers.

## Props

Exports: `WorkspaceHost`, `WorkspaceHostProps`, `WorkspaceHostMode`, and the re-exported types `WorkspaceDocument`, `WorkspaceMode`, `DockLayout`, `DockPanel`.

`WorkspaceHostProps` extends `Omit<ViewProps,"children">`. `onLayout` is read (it also stores the measured width, then calls the caller's handler); `style` is appended after `{flex:1, direction}`; the rest spread goes to the root `View`.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `document` | `WorkspaceDocument` | none | yes | Canvas is keyed by `document.id`. |
| `disabled` | `boolean` | `false` | no | Blocks mode switches and layout changes. |
| `revision` | `string \| number` | `0` | no | Must be finite (number) or at most 512 characters (string). |
| `modes` | `readonly WorkspaceHostMode[]` | none | yes |  |
| `activeModeId` | `string` | none | yes | Throws `TypeError` if not one of `modes`. |
| `onModeChange` | `(modeId: string) => void` | none | yes |  |
| `panels` | `readonly DockPanel[]` | none | yes |  |
| `layouts` | `Readonly<Record<string, DockLayout>>` | none | yes | A mode without one uses its `defaultLayout`. |
| `onLayoutChange` | `(modeId: string, layout: DockLayout) => void` | none | yes |  |
| `canvas` | `ReactNode` | none | yes |  |
| `leading` | `ReactNode` | none | no | Before the title. |
| `trailing` | `ReactNode` | none | no | After the tabs. |
| `enableModeShortcuts` | `boolean` | `true` | no | Ctrl/Cmd+1..9 on web. |
| `applePlatform` | `boolean` | none (computed) | no | Computed by `appleByDefault()` when omitted. |
| `compactBelow` | `number` | `600` | no | Width under which tabs move to a second row. |
| `features` | `readonly FoldFeature[]` | none | no | Forwarded to `AdaptiveDock`. |
| `usableRegions` | `readonly Rect2D[]` | none | no | Forwarded. |
| `dockDefaults` | `Partial<DockDefaults>` | none | no | Forwarded as `defaults`. |
| `dockCompactBelow` | `number` | none | no | Forwarded as `compactBelow` when defined. |
| `isRTL` | `boolean` | `false` | no | Sets `direction:"rtl"` and the tab roving direction. |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

`WorkspaceDocument`: `id:string` (required), `title:string` (required), `dirty?:boolean`.
`WorkspaceMode`: `id`, `label`, `panels:readonly string[]`, `defaultLayout:DockLayout`, all required. `WorkspaceHostMode` adds `icon?:(state:{selected:boolean})=>ReactNode`.
`DockPanel` (shell/AdaptiveDock.tsx): `id`, `title`, `content:ReactNode`.
`DockLayout` (shell/dock-model.ts): `left?`, `right?`, `bottom?` (each a `DockStack` of `panels`, `active`, `size`), `floating:readonly FloatingPanel[]` (required; each `{id, rect}`), `compactSize?`.

Throws from `validateWorkspaceDocument` (id and title non-empty, id at most 256, title at most 512, `dirty` boolean) and `validateWorkspace` (mode and layout rules; the message list is in `workspace-model.ts` and was not enumerated here).

### Tokens

- Colour classes: `color.text` 2, `color.accent` 1, `color.border` 1, `color.surfaceRaised` 1, `color.focus` 1, `color.primary` 1, `color.surfaceSunken` 1, `color.onPrimary` 1. Radius class: `radius.control` 1.
- Literals: `gap: 8` to `space.2` (2), `paddingHorizontal: 8` to `space.2` (1), `paddingVertical: 4` to `space.1` (1), `gap: 4` to `space.1` (3), `gap: 2` to `space.0.5` (1), `borderRadius: 4` to `radius.4` (1), `borderWidth: 4` to `border.4` (1), `minHeight: 44` to `size.touch` (1).
- no token: `minWidth: 0` (2), the 8pt dot size.
- Tailwind default classes (no token): `border` 5, `text-base` 1, `font-semibold` 2, `min-h-0` 1, `min-w-0` 1, `min-h-11` 1, `min-w-11` 1, `gap-2` 1, `px-3` 1, `rounded-control` 1, `border-2` 1, `text-sm` 1.

### Unverified

- UNVERIFIED: that the canvas keeps its state when modes switch; this depends on `AdaptiveDock` rendering, which was not read.
- UNVERIFIED: the exact `validateWorkspace` rules and `modeAnnouncement` text in `workspace-model.ts`.
- UNVERIFIED: the key fields `modeShortcutIndex` reads (`shellKey` and `code`) on each platform.
- UNVERIFIED: screen reader output of the tablist, the document header and the announcements.

## Variants

none as a union prop. `compactBelow` switches layout: when the measured width is above 0 and below it, the tab strip moves from beside the title to its own row.

## States

| State | How it is set | What the code does |
|---|---|---|
| `mode tabs` | derived in code | `selected` sets `accessibilityState.selected`, `aria-selected`, and class `bg-primary forced-colors:border-2 forced-colors:border-[Highlight]` with `text-on-primary font-semibold`; unselected `bg-transparent hover:bg-surface-sunken`, `text-text`. |
| `disabled` | `disabled` prop | tabs get `disabled` and `accessibilityState.disabled`; `pick` does nothing. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | `focus-visible:ring-2 focus-visible:ring-focus`; roving `tabIndex` (selected 0, others -1). |
| `dirty` | derived in code | an 8pt dot with `border-accent` before the title. |
| `narrow` | derived in code | width under `compactBelow`. |
| `mode announcement` | derived in code | on a mode change a polite live region (web) or `announce()` (native) speaks `modeAnnouncement`. |

- hover on tabs is the only pointer state; pressed has no code.

### Motion

none in source.

### Platform notes

- `appleByDefault()`: true on `ios` and `macos`; on `web` true when `navigator.platform` or `userAgent` matches `/Mac|iPhone|iPad/`. It picks the shortcut hint and `aria-keyshortcuts` prefix (`Meta+` or `Control+`).
- `Platform.OS==="web"`: title gets `aria-level:1`; a visually hidden polite live region renders; mode switches announce through it. On other platforms `announce()` from `../forge/announce.ts` is used instead.
- `enableModeShortcuts` keys work through a `View` `onKeyDown`; the doc comment states native hosts must route hardware keys themselves.
- Imported `announce.ts` branches on `qnx` and `marathon`.
- package.json export conditions: `types`, `react-native`, `default`. No `.native`/`.web` siblings.

## A11y

- Contrast: Selected mode tab bg-primary with text-on-primary 5.81/7.46:1; others text-text 17.79/13.83:1. Selected item is bg-primary and the ring is ring-focus, the same colour (1/1:1); the ring's outer edge still meets the page at 5.81/6.93:1 (F07).
- Keyboard and focus: Web: roving tabIndex and arrows (:195, :214); `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:217). Mode switches by shortcut (aria-keyshortcuts). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Tabs min-h-11 min-w-11 (:216), bar minHeight 44 (:159). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- Screen reader: tablist "Modes", tab with selected and disabled state, aria-keyshortcuts, hint; document title is a level 1 header on web; mode changes announced politely (web hidden live region, native announce) (:125-178, :206-215).
- Motion: None.
- Review status: **UNVERIFIED**. Selected tab fill and ring share one colour (F07).
  - UNVERIFIED: Focus visibility on the selected mode tab (F07). Test: Tab to the selected tab and compare screenshots.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=WorkspaceHost
import {Text} from "react-native";
import {WorkspaceHost,type DockLayout,type DockPanel} from "@nyc-tron/ui/components/shell/WorkspaceHost";
const edit:DockLayout={left:{panels:["layers"],active:"layers",size:240},floating:[]};
const panels:readonly DockPanel[]=[{id:"layers",title:"Layers",content:<Text>Layers</Text>}];
export const Example = () => <WorkspaceHost document={{id:"doc-1",title:"Poster",dirty:true}}
  modes={[{id:"edit",label:"Edit",panels:["layers"],defaultLayout:edit}]}
  activeModeId="edit" onModeChange={()=>{}} panels={panels} layouts={{edit}} onLayoutChange={()=>{}}
  canvas={<Text>Canvas</Text>}/>;
```

## Do/Don't

### Do

- Set `activeModeId` to an id present in `modes`; anything else throws a `TypeError`.
- Provide `layouts` per mode, or rely on each mode's `defaultLayout` when one is missing.
- Set `isRTL` for right-to-left UIs so `direction` and the tab roving direction flip.

### Don't

- Do not assume the selected tab shows focus; its `bg-primary` fill and `ring-focus` are one colour (F07), unverified.
- Do not pass a non-finite `revision`, or a string over 512 characters.
- Do not assume canvas state survives mode switches; that depends on `AdaptiveDock` and is UNVERIFIED.
