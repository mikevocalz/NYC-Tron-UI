---
name: "KeyboardShortcutHUD"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/KeyboardShortcutHUD"
tier: 1
docs: "handwritten"
platforms: ["ios", "web"]
category: "overlay"
tokens: ["color.border", "color.danger", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/shell/InspectorSearch"]
a11yStatus: "reviewed-fail"
---

# KeyboardShortcutHUD

## Purpose

Searchable keyboard shortcut list grouped by category, with rebinding and Apple keycaps, for React Native; iOS and Android need a recorder.

## Install

- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/shell/InspectorSearch

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/KeyboardShortcutHUD
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { KeyboardShortcutHUD } from "@/components/nyc-tron/ui/components/shell/KeyboardShortcutHUD";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { KeyboardShortcutHUD } from "@nyc-tron/ui/components/shell/KeyboardShortcutHUD";`

### Dependencies

- Internal: `../overlays/popover-position.ts` (`placePopover`, `hasUsableRegion`), `../overlays/focus-restore.ts` (`useRestoreFocus`), `../styles.ts` (`joinClasses`), `./InspectorSearch.tsx`, `./inspector-model.ts` (`matchesQuery`), `./shell-keys.ts` (`shellKey`), `./shortcut-model.ts`.
- External: `react`, `react-native` (Modal, Platform, Pressable, ScrollView, Text, View, useWindowDimensions), `zustand` and `zustand/vanilla`.
- Optional peers: `zustand` (optional in package.json peerDependenciesMeta); `@nyc-tron/core` (optional; the overlay helpers re-export from it).

## Props

The file also exports `isApplePlatform()` (a function, not a component), re-exports `bindingFromChord` and `commandForChord`, and re-exports the types `Binding`, `ChordRecorder`, `KeyChord`, `ShortcutCommand`.

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | `"shortcuts"` | no | Part of the reset boundary `[scope, revision, visible]`; a change clears query, recording and errors. |
| `revision` | `string \| number` | `0` | no | Same boundary. |
| `usableRegions` | `readonly Rect2D[]` | window rectangle | no | The sheet is placed with `placePopover` (560 by 560, margin 16) inside the first usable region. If `hasUsableRegion` is false the Modal is not visible. |
| `visible` | `boolean` | none | yes | Modal `visible` is `visible && region exists`. |
| `onDismiss` | `() => void` | none | yes | Called by the backdrop, the Close button and Modal `onRequestClose` when nothing is recording. |
| `commands` | `readonly ShortcutCommand[]` | none | yes | Checked by `validateShortcutCommands` on every render. |
| `onRebind` | `(id: string, binding: Binding \| undefined) => void` | none | no | Without it the list is read-only. A conflict calls it twice: first `(conflictId, undefined)`, then `(id, binding)`. |
| `recorder` | `ChordRecorder` | none | no | Hardware key source for iOS and Android. Ignored on web. |
| `apple` | `boolean` | `isApplePlatform()` | no | Selects Apple keycaps and the wording of the modifier error. |
| `title` | `string` | `"Keyboard shortcuts"` | no | Heading text and the Modal `aria-label`. |
| `className` | `string` | none | no | Joined onto the sheet container. |
| `unstyled` | `boolean` | `false` | no | Drops every class string the component adds. |

`ShortcutCommand` (shortcut-model.ts):
| Field | Type | Required | Notes |
|---|---|---|---|
| id | `string` | yes | |
| label | `string` | yes | |
| group | `string` | no | Section heading. |
| binding | `Binding` (string such as `"Mod+Shift+S"`) | no | Shown as keycaps, or "Not set". |
| defaultBinding | `Binding` | no | "Reset" restores it. |
| keywords | `readonly string[]` | no | Extra search words. |

`ChordRecorder` has one method, `startRecording(onChord): {remove(): void}`. `KeyChord` has `key` and optional `ctrlKey`, `metaKey`, `altKey`, `shiftKey`.

### Tokens

- Colour classes: color.text (9), color.textMuted (5), color.border (3), color.surfaceSunken (3), color.focus (2), color.danger (1), color.primary (1), color.onPrimary (1), color.surfaceRaised (1).
- Radius classes: radius.control (3), radius.card (1).
- Spacing literals: space.0.75 (gap 3, 1), space.0.5 (paddingVertical 2, 1), space.1 (paddingVertical 4 x2, gap 4 x2, paddingTop 4 x1), space.1.5 (gap 6, 1), space.2 (gap 8 x3, paddingTop 8 x2), space.2.5 (paddingHorizontal 10, 1), space.4 (padding 16 x1, paddingHorizontal 16 x3, paddingBottom 16 x1, paddingVertical 16 x1).
- border.1_5 (borderTopWidth 1.5, 2). size.touch (minHeight 44, 2).
- Component-level: HUD.space.1_25 (paddingHorizontal 5, 1).
- no token: minWidth 22 (1), minWidth 140 (1).
- Tailwind default classes (no token): rounded-control, rounded-card, border, border-2, text-xs, text-sm, text-base, min-h-11, min-w-11, px-2, font-semibold, shadow-md.

### Unverified

- UNVERIFIED: screen reader output of the keycap group label and the live-region messages; it depends on the platform accessibility stack.
- UNVERIFIED: behaviour of `InspectorSearch`, `useRestoreFocus` and `placePopover`; read only as call sites.
- UNVERIFIED: whether `@nyc-tron/hardware-keys` (named in a doc comment as a `recorder` source) exists or behaves as described; it was not read.

## Variants

none. `unstyled` is the only styling switch.

## States

| State | How it is set | What the code does |
|---|---|---|
| `default` | derived in code | list of commands grouped by `group`. |
| `empty (search)` | derived in code | text `No command matches "<query>".` when the filter leaves nothing; the search summary reads "No shortcuts match". |
| `rebindable vs read-only` | derived in code | "Change" and "Reset" buttons render only when `onRebind` is set and (`Platform.OS==="web"` or `recorder` is set). "Reset" renders only when `defaultBinding` differs from `binding`. |
| `recording` | derived in code | the row shows a focusable field with `accessibilityLabel` "Recording a shortcut for <label>. Press the keys, or Escape to cancel." and class `border-2 border-focus` when styled. |
| `error` | derived in code | text in `accessibilityLiveRegion="assertive"`, class `text-danger`, when the binding has no Ctrl, Alt or Command (function keys excepted). |
| `conflict` | derived in code | assertive live-region text naming the other command, with "Replace" and "Cancel" buttons. |
| `hidden` | derived in code | `visible` false, or no usable region. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | `focus-visible:ring-2 focus-visible:ring-focus` on the small buttons; focus returns through `useRestoreFocus(visible && region)`. |
| `hover` | class `hover:bg-surface-sunken` | `hover:bg-surface-sunken` on the small buttons. |

### Motion

none in source (`Modal animationType="none"`).

### Platform notes

- `Platform.OS==="web"`: enables rebinding without `recorder`; recording reads the browser `onKeyDown`; prompt text is "Press the new shortcut, or Esc to cancel".
- iOS and Android: rebinding needs `recorder`; prompt text is "Press the new shortcut on the hardware keyboard, or Esc to cancel"; Escape is read from the recorder chord.
- `isApplePlatform()`: true for `Platform.OS` "ios" or "macos", or when `navigator.platform`/`userAgent` matches `/Mac|iPhone|iPad/`.
- The Modal sets `accessibilityViewIsModal` and `aria-label`; a comment says React Native Web makes the Modal the dialog.
- Package export: `react-native` and `default` conditions both point at `dist/components/shell/KeyboardShortcutHUD.js`.

## A11y

- Contrast: Text text-text 16.01/15.31:1; recording field border-2 border-focus 5.22/7.67:1; errors text-danger 5.91/8.01:1. Renders InspectorSearch (F03).
- Keyboard and focus: Modal; Escape cancels recording or closes (:113-119, :177). Record field focusable with onKeyDown (:157-158). Buttons `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1). Apple versus non-Apple key labels at :49. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Buttons min-h-11 min-w-11 (:140), rows minHeight 44 (:146, :159). Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: Modal with aria-label and accessibilityViewIsModal; key combos spoken through bindingSpoken; recording prompt and conflicts are assertive live regions; groups have header role (:135-200).
- Motion: animationType="none" (:177).
- Review status: **FAIL**. Renders InspectorSearch (F03).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=KeyboardShortcutHUD
import {useState} from "react";
import {KeyboardShortcutHUD,type ShortcutCommand} from "@/components/nyc-tron/ui/components/shell/KeyboardShortcutHUD";

const initial:ShortcutCommand[]=[
  {id:"save",label:"Save",group:"File",binding:"Mod+S",defaultBinding:"Mod+S"},
  {id:"export",label:"Export",group:"File",binding:"Mod+Shift+E",defaultBinding:"Mod+Shift+E",keywords:["render"]},
];
export const Example=()=>{
  const [visible,setVisible]=useState(true);
  const [commands,setCommands]=useState(initial);
  return <KeyboardShortcutHUD visible={visible} onDismiss={()=>setVisible(false)} commands={commands}
    onRebind={(id,binding)=>setCommands(cs=>cs.map(c=>c.id===id?{...c,binding}:c))}/>;
};
```

## Do/Don't

### Do

- Pass `onRebind` to allow changes and a `recorder` on iOS and Android, since rebinding there needs a hardware key source.
- Set `defaultBinding` on each `ShortcutCommand` so Reset appears when `binding` differs.

### Don't

- Don't ship the search as accessible by default; the HUD renders `InspectorSearch` with a 1.42/1.75:1 boundary (F03, FAIL).
- Don't expect `onRebind` to run once on a conflict; it is called twice, first `(conflictId, undefined)`.
- Don't rely on `@nyc-tron/hardware-keys` as a `recorder` source; its existence is `UNVERIFIED`.
