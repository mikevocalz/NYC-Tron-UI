---
name: "DocumentTabBar"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/DocumentTabBar"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "navigation"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# DocumentTabBar

## Purpose

Tab strip for open documents with activate, close and reorder; keyboard shortcuts on web, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { DocumentTabBar } from "@nyc-tron/ui/components/shell/DocumentTabBar";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/DocumentTabBar
```

### Dependencies

- `./shell-keys` (`nodeIsRTL`, `rovingTarget`, `shellKey`), `./document-tabs-model`, `../styles` (`joinClasses`).
- External: `react`, `react-native` (`I18nManager`, `Platform`, `Pressable`, `ScrollView`).

## Props

Tier-1 reason: R3 shell core. Import count: 0 (other packages: 0).
Also exported: type `DocumentTab`, `DocumentTabBarProps`; functions `activeAfterClose(ids, closing, active)` and `moveDocument(ids, id, toIndex)` (re-exported from the model; `moveDocument` returns the same array when nothing moves).

`DocumentTabBarProps extends Omit<ViewProps,"children">`. `style` goes to the root `View`; the rest spread onto it.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | `"documents"` | no | Part of the boundary with `revision` and `disabled`. |
| `revision` | `string \| number` | `0` | no |  |
| `disabled` | `boolean` | `false` | no | Blocks activate, close and reorder. |
| `documents` | `readonly DocumentTab[]` | none | yes | At most 1000; unique nonblank ids and titles (title at most 512). |
| `activeId` | `string \| undefined` | none | yes | A value matching no tab selects none; the first tab is then the web tab stop. |
| `onActivate` | `(id: string) => void` | none | yes |  |
| `onClose` | `(id: string) => void` | none | no | Without it no close button shows. |
| `onReorder` | `(id: string, toIndex: number) => void` | none | no | Without it tabs cannot be reordered. |
| `label` | `string` | `"Open documents"` | no | `accessibilityLabel` of the `tablist`. |
| `className` | `string` | none | no |  |
| `tabClassName` | `string` | none | no | Added to each tab wrapper. |
| `unstyled` | `boolean` | `false` | no |  |

`DocumentTab` (document-tabs-model.ts): `id: string`, `title: string`, `dirty?: boolean` (unsaved marker, label becomes "<title>, unsaved changes"), `closable?: boolean` (default true).

### Tokens

| Token | Replaces | Count |
|---|---|---|
| space.1 | `paddingHorizontal: 4`, `marginTop: 4` | 2 |
| space.0.5 | `gap: 2` | 2 |
| radius.4 | `borderRadius: 4` | 1 |
| border.4 | `borderWidth: 4` | 1 |
| border.1_5 | `borderTopWidth: 1.5` | 2 |
| color.border | border classes | 2 |
| color.surfaceSunken | `bg-surface-sunken`, `hover:bg-surface-sunken` | 2 |
| color.surfaceRaised | `bg-surface-raised` | 1 |
| color.focus | `ring-focus` | 1 |
| color.accent | `border-accent` | 1 |
| color.text | `text-text` | 1 |
| color.textMuted | `text-text-muted`, `border-text-muted` | 2 |
| radius.control | `rounded-control`, `rounded-t-control` | 2 |

No token: glyph sizes 8, 12, 14, `maxWidth: 240`.
Tailwind default classes (no token): `min-w-0` 1, `border` 9, `rounded-t` 1, `min-h-11` 2, `gap-2` 1, `px-3` 1, `text-sm` 1, `font-semibold` 1, `min-w-11` 1.

### Unverified

- UNVERIFIED: `nodeIsRTL` and `rovingTarget` behaviour; `shell-keys.ts` was read only to line 30.
- UNVERIFIED: VoiceOver and TalkBack output for the custom actions and the `tab` role on a `Pressable` inside a `tablist` view.
- UNVERIFIED: the visible rendering of the close glyph, drawn from rotated top borders (`CloseGlyph`); no device was run.

## Variants

`unstyled` removes token classes; no other variant props.

## States

| State | How it is set | What the code does |
|---|---|---|
| `selected` | derived in code | `accessibilityState.selected`, `aria-selected`; wrapper `bg-surface-raised border-x border-t border-border`, title `text-text font-semibold` (unselected wrapper `bg-transparent`, title `text-text-muted`). |
| `disabled` | `disabled` prop | `disabled` on the tab and close `Pressable`s, `accessibilityState.disabled`; web `tabIndex` becomes -1. |
| `dirty` | derived in code | an 8 by 8 dot with class `border-accent` (borderWidth 4, radius 4). |
| `closable` | derived in code | close button only when `onClose` is set and `doc.closable !== false`. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | class `focus-visible:ring-2 focus-visible:ring-focus` on the tab; the close button has `hover:bg-surface-sunken` on hover. |
| `loading, error` | derived in code | no code. |

### Motion

none in source. The active tab is centred with `scrollTo({animated:false})`.

### Platform notes

- `Platform.OS==="web"`: tab `Pressable` gets `onKeyDown` (arrows with RTL flip via `nodeIsRTL` or `I18nManager.isRTL`, Home/End, Ctrl/Cmd+Shift+Arrow to reorder, Delete to close) and `tabIndex` (0 on the active tab). The close button gets `tabIndex:-1` on web; elsewhere it gets `accessibilityElementsHidden` and `importantForAccessibility="no-hide-descendants"`.
- Native screen readers get tab `accessibilityActions`: activate, close, moveEarlier, moveLater (the last two only with `onReorder`, and only when a neighbour exists).
- Export conditions: `types`, `react-native`, `default`, same file.

## A11y

- Contrast: Selected tab text-text semibold on bg-surface-raised, others text-text-muted on the sunken bar 5.54/7.9:1. The selected cue is raised vs sunken 1.11/1.11:1 plus weight (F13). Dirty dot border-accent 4.65/9.81:1.
- Keyboard and focus: Web: roving tabIndex and arrow keys (:73, :121); close buttons tabIndex -1 on web (:132). `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:122). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Tabs min-h-11 (:122, 44), close min-h-11 min-w-11 (:133). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- Screen reader: tablist and tab with selected and disabled state, aria-selected, accessibilityActions (:96-121); close button "Close {title}". On native the close button is hidden from AT and reachable through the tab's actions (:132).
- Motion: None.
- Review status: **UNVERIFIED**. Selected-tab cue is weak (F13).
  - UNVERIFIED: Selected tab visible at 3:1 (F13). Test: Measure selected and unselected tab pixels in both schemes.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=DocumentTabBar
import {useState} from "react";
import {DocumentTabBar, activeAfterClose, moveDocument, type DocumentTab} from "@nyc-tron/ui/components/shell/DocumentTabBar";

export function Example() {
  const [docs, setDocs] = useState<readonly DocumentTab[]>([
    {id: "a", title: "Harbor.png", dirty: true},
    {id: "b", title: "Notes.md"},
  ]);
  const [active, setActive] = useState<string | undefined>("a");
  return (
    <DocumentTabBar documents={docs} activeId={active} onActivate={setActive}
      onClose={(id) => {
        const ids = docs.map(d => d.id);
        setActive(activeAfterClose(ids, id, active));
        setDocs(docs.filter(d => d.id !== id));
      }}
      onReorder={(id, to) => {
        const order = moveDocument(docs.map(d => d.id), id, to);
        setDocs(order.map(i => docs.find(d => d.id === i)!));
      }}/>
  );
}
```

## Do/Don't

### Do

- Pass `onClose` and `onReorder` only when you support them, since without them no close button shows and tabs cannot be reordered.
- Set `dirty` on unsaved documents so the label reads "unsaved changes" and the `border-accent` dot appears.

### Don't

- Don't rely on the selected tab styling alone; raised against sunken is 1.11/1.11:1 plus weight (F13), `UNVERIFIED`.
- Don't pass an `activeId` that matches no tab and expect a selection; none is selected and the first tab becomes the web tab stop.
- Don't use more than 1000 `documents` or blank titles; they are rejected.
