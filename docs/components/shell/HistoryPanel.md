---
name: "HistoryPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/HistoryPanel"
tier: 1
docs: "handwritten"
platforms: []
category: "data"
tokens: ["color.border", "color.focus", "color.text", "color.textMuted", "space.1", "space.2", "space.2.5"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "reviewed-pass"
---

# HistoryPanel

## Purpose

Undo and redo list with a cursor and jump to any entry; async jump with cancel, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { HistoryPanel } from "@nyc-tron/ui/shell/HistoryPanel";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/shell/HistoryPanel
```

### Dependencies

- `../Button` (`Button`), `../feedback/ErrorMessage` (`ErrorMessage`), `./useOwnedAction`, `./history-model`, `../styles` (`joinClasses`).
- External: `react-native` (`FlatList`, `Pressable`, `Text`, `View`); `useOwnedAction` uses `zustand` (optional peer).

## Props

Tier-1 reason: R3 shell core. Import count: 0 (other packages: 0).
Also exported: types `HistoryEntry`, `HistoryJump`, `HistoryPanelProps`.

`HistoryPanelProps extends Omit<ViewProps,"children">`. `style` is merged after `{gap:8}`; the rest spread onto the root `View`.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `documentId` | `string` | none | yes | With `revision`, the owned-action scope. |
| `revision` | `string` | none | yes | Sent as `expectedRevision`. |
| `entries` | `readonly HistoryEntry[]` | none | yes | Distinct ids and nonblank labels, finite timestamps. |
| `cursor` | `number` | none | yes | Integer from 0 to `entries.length`; 0 is the initial state. Else `RangeError`. |
| `onJump` | `(request: HistoryJump, signal: AbortSignal) => void \| Promise<void>` | none | yes |  |
| `label` | `string` | `"History"` | no | Heading text and list `accessibilityLabel`. |
| `height` | `number` | `320` | no | Must be finite and at least 44, else `RangeError`. |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

| Type | Fields |
|---|---|
| HistoryEntry | `id: string`, `label: string`, `detail?: string`, `timestampMs?: number` |
| HistoryJump | `documentId: string`, `expectedRevision: string`, `cursor: number` |

### Tokens

| Token | Replaces | Count |
|---|---|---|
| space.2 | `gap: 8` | 2 |
| space.2.5 | `padding: 10` | 1 |
| space.1 | `gap: 4` | 1 |
| color.text | `text-text` | 2 |
| color.textMuted | `text-text-muted` | 5 |
| color.border | `border-b border-border` | 1 |
| color.focus | `ring-focus` | 1 |

No token: `minHeight: 56`.
Tailwind default classes (no token): `font-semibold` 1, `border` 3, `text-sm` 2.

### Unverified

- UNVERIFIED: cancel and error behaviour of `createActionOwner` (`action-owner.ts` not read).
- UNVERIFIED: the timestamp text; it uses `toLocaleString()`, so output depends on the device locale.
- UNVERIFIED: screen reader output of the `aria-current="step"` attribute on a native `Pressable`.

## Variants

none. `unstyled` removes classes.

## States

| State | How it is set | What the code does |
|---|---|---|
| `pending` | derived in code | while a jump runs, text reads "Restoring history…", all buttons and rows are disabled, and "Cancel history request" shows. |
| `boundary` | derived in code | Undo disabled at cursor 0; Redo disabled at `entries.length`; "Initial state" disabled at cursor 0. |
| `current` | derived in code | row `aria-current="step"` and label prefix "Current state" when `cursor === index+1`; other rows are "Restore state N: <label>". |
| `applied vs undone rows` | derived in code | text `text-text` when `index < cursor`, else `text-text-muted`. |
| `empty` | derived in code | "No document edits". |
| `error` | derived in code | `ErrorMessage` with the action error. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | row class `focus-visible:ring-2 focus-visible:ring-focus`. |
| `hover` | derived in code | no code. |

### Motion

none in source.

### Platform notes

none in source. Export conditions: `types`, `react-native`, `default`, same file.

## A11y

- Contrast: text-text 17.79/13.83:1, text-text-muted 6.16/7.14:1; row separator 1.58/1.58:1.
- Keyboard and focus: Rows `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:46). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Rows minHeight 56 (:47, no token). Passes both.
- Screen reader: Header role header; count is a polite live region; rows are buttons with composed labels and aria-current=step on the current one (:33-47). FlatList has a label but no role (not changed here).
- Motion: None.
- Review status: **PASS**. Labelled rows, live count, 56pt targets.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=HistoryPanel
import {useState} from "react";
import {HistoryPanel, type HistoryEntry} from "@nyc-tron/ui/components/shell/HistoryPanel";

const entries: readonly HistoryEntry[] = [
  {id: "e1", label: "Move layer", detail: "Harbor photo", timestampMs: 1700000000000},
  {id: "e2", label: "Change opacity"},
];

export function Example() {
  const [cursor, setCursor] = useState(2);
  return <HistoryPanel documentId="doc-1" revision="r1" entries={entries} cursor={cursor}
    onJump={async (request) => { setCursor(request.cursor); }} height={240}/>;
}
```

## Do/Don't

### Do

- Keep `cursor` an integer from 0 to `entries.length`, where 0 is the initial state, because anything else throws `RangeError`.
- Update `revision` after each edit so `onJump` receives the correct `expectedRevision`.

### Don't

- Don't pass `height` below 44; it throws `RangeError`.
- Don't reuse an `id` or leave a `label` blank in `entries`; entries are validated.
- Don't assume `aria-current` is read on native; the screen reader output of `aria-current="step"` is `UNVERIFIED`.
