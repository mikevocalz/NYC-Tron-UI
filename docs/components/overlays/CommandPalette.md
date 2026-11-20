---
name: "CommandPalette"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/overlays/CommandPalette"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "overlay"
tokens: ["CommandPalette.space.1_75", "color.border", "color.danger", "color.primary", "color.surfaceRaised", "color.text", "color.textMuted", "font.12", "opacity.0_4", "radius.control", "space.3", "space.4"]
registryDependencies: ["@nyc-tron/TextField"]
a11yStatus: "reviewed-fail"
---

# CommandPalette

## Purpose

Searchable command list in a modal, with keyboard selection and an empty-results message, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { CommandPalette } from "@nyc-tron/ui/overlays/CommandPalette";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/TextField

```sh
npx shadcn@latest add @nyc-tron/overlays/CommandPalette
```

### Dependencies

- `react-native`: `Modal`, `Platform`, `Pressable`, `ScrollView`, `Text`, `TextInput`, `View`.
- `../TextField.tsx` (`TextField`), `../styles.ts` (`joinClasses`).
- `./popover-position.ts`, `./focus-cycle.ts` (`cycleFocusTarget`), `./focus-restore.ts`, `./command-filter.ts`.
- `zustand`, `zustand/vanilla`: optional peer.

## Props

Tier-1 reason: R2 core family (overlays)
Import count: 0

`CommandPaletteProps` (own interface, no `extends`).

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | "command-palette" | no | Part of the reset boundary. |
| `revision` | `string \| number` | 0 | no | Part of the reset boundary. |
| `open` | `boolean` | none | yes | Controlled. |
| `onOpenChange` | `(open: boolean) => void` | none | yes |  |
| `onSelect` | `(id: string) => void` | none | yes | Called after `onOpenChange(false)`. |
| `commands` | `readonly PaletteCommand[]` | none | yes | Validated each render; throws on bad input. |
| `anchor` | `Rect2D` | none | yes |  |
| `usableRegions` | `readonly Rect2D[]` | none | yes |  |
| `label` | `string` | "Command palette" | no | Dialog name and visible search label. |
| `placeholder` | `string` | "Type a command" | no |  |
| `emptyText` | `string` | "No matching commands" | no |  |
| `width` | `number` | 420 | no |  |
| `maxHeight` | `number` | 440 | no | Capped by `56 x max(1, results) + 96`. |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | false | no |  |
| `testID` | `string` | none | no | Also seeds the result list id (`<testID>-results`; default `command-palette-results`). |

`PaletteCommand` = `CommandMenuItem` (core: `id: string`, `label: string`, `description?: string`, `disabled?: boolean`, `danger?: boolean`) plus `keywords?: readonly string[]` and `group?: string`.

`validateCommands` throws for more than 1000 commands, an id that is not a string, over 256 chars, fails `/^[a-zA-Z0-9][a-zA-Z0-9._:-]*$/` or repeats, an empty or over-512-char label, more than 256 keywords, and a non-boolean `disabled`.

### Tokens

`node tokenuse.mjs` output:
- `space.3` from `paddingHorizontal: 12` (x2), `space.4` from `paddingVertical: 16` (x1)
- `<Component>.space.1_75` from `paddingVertical: 7` (x1; component-scoped)
- `font.12` from `fontSize: 12` (x1), `opacity.0_4` from `opacity: 0.4` (x1)
- `color.text` (x2), `color.border` (x1), `color.surfaceRaised` (x1), `color.textMuted` (x3), `color.primary` (x2), `color.danger` (x1)
- `radius.control` (x2)

Tailwind default classes (no token): `rounded-control` (x2), `border` (x3), `p-2`, `gap-2`. Unmapped: `ROW_HEIGHT = 56`, `bg-text/30` scrim, `fontWeight: "600"`.

### Unverified

- UNVERIFIED: how `filterCommands` ranks and which fields it matches; only the token ranking helper and validation were read.
- UNVERIFIED: focus return to the opener (`useRestoreFocus` not read) and the combobox pattern's screen reader output.

## Variants

none. `unstyled` is the only switch (drops the `rounded-control border border-border bg-surface-raised p-2 gap-2` surface, the scrim colour and row highlight classes).

## States

| State | How it is set | What the code does |
|---|---|---|
| `empty search results` | derived in code | a `Text` with `role="status"` and `accessibilityLiveRegion="polite"` shows `emptyText`. |
| `active result` | derived in code | `aria-selected` and `accessibilityState.selected`; `bg-primary/10` (styled). Arrow keys (via `nextActiveCommand`) and pointer hover set it. |
| `disabled command` | class `opacity: 0.4` | `disabled`, `aria-disabled`, `accessibilityState.disabled`, `opacity: 0.4`, skipped by Tab. |
| `danger command` | derived in code | `text-danger` (styled). |
| `focus` | class `focus-visible:bg-primary/10` | rows get `focus-visible:bg-primary/10` when not active (styled). |
| `closed or no usable region` | derived in code | no position gives `null`. |

- Every opening resets the query and active id (reset boundary is `[scope, revision, open]`).
The search field has `role="combobox"`, `aria-expanded`, `aria-controls` and `aria-activedescendant`; results are `role="listbox"` with `role="option"` rows.

### Motion

`Modal` fade on non-web platforms; none on web. No Animated or Reanimated.

### Platform notes

- `Modal animationType`: `"none"` when `Platform.OS === "web"`, else `"fade"`.
- `blurOnSubmit: false` is set because, per the comment, RN web reads only that prop.
- The `listbox` role comment says core RN's `Role` union omits it and Android maps it to nothing.

## A11y

- Contrast: Rows text-text 17.79/13.83:1. Active option is bg-primary/10 only (:142): 1.15/1.2:1, and the option is never focused (aria-activedescendant), so that tint is the focus indicator (F02). Search field is a TextField: boundary 1.42/1.75:1 (F03).
- Keyboard and focus: Search has autoFocus (:110); arrows move aria-activedescendant (:116). Escape via Modal. Scrim Pressable focusable={false}. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: ROW_HEIGHT 56 (:40, no token). Passes both.
- Screen reader: dialog aria-modal, combobox with aria-expanded, aria-controls, aria-activedescendant, aria-autocomplete=list; listbox with option rows carrying selected and disabled state; empty state role=status (:106-135).
- Motion: animationType fade on native, none on web (:101). Not tied to reduce motion (F09).
- Review status: **FAIL**. Keyboard-active option is marked only by a 1.15/1.2:1 tint (2.4.7, 1.4.11); its TextField inherits F03.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=CommandPalette
import { useState } from "react";
import { CommandPalette, type PaletteCommand } from "@nyc-tron/ui/components/overlays/CommandPalette";

const commands: PaletteCommand[] = [
  { id: "file.save", label: "Save file", group: "File", keywords: ["write"] },
  { id: "file.delete", label: "Delete file", group: "File", danger: true },
];

export const Example = () => {
  const [open, setOpen] = useState(true);
  return (
    <CommandPalette open={open} onOpenChange={setOpen} commands={commands}
      onSelect={id => console.log(id)}
      anchor={{ x: 100, y: 80, width: 200, height: 40 }}
      usableRegions={[{ x: 0, y: 0, width: 1024, height: 768 }]} />
  );
};
```

## Do/Don't

### Do

- Give each `commands` entry a unique `id` matching `/^[a-zA-Z0-9][a-zA-Z0-9._:-]*$/`, because `validateCommands` throws on bad or repeated ids.
- Bump `revision` or change `scope` when the command set changes, since both belong to the reset boundary that clears query and active id.

### Don't

- Don't rely on the active option tint as the keyboard focus cue: `bg-primary/10` measures 1.15/1.2:1 and the review status is FAIL (F02).
- Don't pass more than 1000 `commands` or a blank `label`; `validateCommands` throws on every render.
- Don't put the search field forward as accessible by default; the `TextField` boundary is 1.42/1.75:1 (F03).
