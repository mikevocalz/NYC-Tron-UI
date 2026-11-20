---
name: "AssetBrowser"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/AssetBrowser"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "data"
tokens: ["color.border", "color.focus", "color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/shell/InspectorSearch"]
a11yStatus: "reviewed-fail"
---

# AssetBrowser

## Purpose

Asset list with breadcrumb path, search, sort, single or multiple selection and async open, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { AssetBrowser } from "@nyc-tron/ui/components/shell/AssetBrowser";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/shell/InspectorSearch

```sh
npx shadcn@latest add @nyc-tron/shell/AssetBrowser
```

### Dependencies

- `../Button` (`Button`), `../Select` (`Select`), `../feedback/ErrorMessage` (`ErrorMessage`), `./InspectorSearch` (`InspectorSearch`).
- `./shell-keys`, `./useOwnedAction`, `../styles` (`joinClasses`), `./asset-browser-model`.
- External: `react`, `react-native` (`FlatList`, `Image`, `Platform`, `Pressable`), `zustand` (optional peer).

## Props

Tier-1 reason: R3 shell core. Import count: 0 (other packages: 0).
Also exported: types `AssetBrowserProps`, `AssetEntry`, `AssetLocation`, `AssetRequest`, `AssetSort`.

`AssetBrowserProps extends Omit<ViewProps,"children">`. `style` is applied to the root (merged after the fill style when `height="fill"`); the rest spread onto the root `View`.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `locationId` | `string` | none | yes | Current location. Resets anchor and scroll when it changes; part of the owned-action scope with `revision`. |
| `revision` | `string` | none | yes | Sent back as `expectedRevision` in `AssetRequest`. |
| `entries` | `readonly AssetEntry[]` | none | yes | At most 20000; distinct ids, nonempty names. |
| `path` | `readonly AssetLocation[]` | none | yes | Breadcrumb buttons. Distinct ids, nonblank labels, else `TypeError`. |
| `selectedIds` | `readonly string[]` | none | yes | Distinct and nonempty. At most one in single mode, else `TypeError`. |
| `selectionMode` | `"single" \| "multiple"` | `"single"` | no |  |
| `onSelectionChange` | `(ids: readonly string[]) => void` | none | yes |  |
| `onOpen` | `(request: AssetRequest, signal: AbortSignal) => void \| Promise<void>` | none | yes |  |
| `onNavigate` | `(locationId: string, signal: AbortSignal) => void \| Promise<void>` | none | yes |  |
| `loading` | `boolean` | `false` | no | Disables rows and controls. |
| `error` | `string` | none | no | Shown in `ErrorMessage` (falls back to the action error). |
| `height` | `number \| "fill"` | `360` | no | Number must be finite and at least 44, else `RangeError`. `"fill"` uses `flex:1`. |
| `header` | `ReactNode` | none | no | Scrolls before the location, search and sort controls. |
| `footer` | `ReactNode` | none | no | Scrolls after the actions and error message. |
| `emptyState` | `ReactNode` | none | no | Replaces the built-in empty text. |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

`AssetEntry` (asset-browser-model.ts): `id: string`, `name: string`, `kind: "file" | "folder"`, `mediaType?: string`, `byteLength?: number`, `modifiedMs?: number`, `thumbnailUri?: string`.

| Type | Fields |
|---|---|
| AssetLocation | `id: string`, `label: string` |
| AssetRequest | `locationId: string`, `expectedRevision: string`, `entry: AssetEntry` |
| AssetSort | `"name" \| "modified" \| "size"` |

### Tokens

| Token | Replaces | Count |
|---|---|---|
| space.2 | `gap: 8` | 3 |
| space.1 | `gap: 4` | 1 |
| space.2.5 | `padding: 10`, `gap: 10` | 2 |
| color.textMuted | `text-text-muted` | 2 |
| color.border | `border-b border-border` | 1 |
| color.focus | `ring-focus` | 1 |
| color.text | `text-text` | 2 |

No token: `minHeight: 0` 2, `minWidth: 0` 2, `minHeight: 64` 1, thumbnail 40 by 40.
Tailwind default classes (no token): `border` 3, `text-sm` 1.

### Unverified

- UNVERIFIED: `useOwnedAction` / `createActionOwner` cancel and error semantics; only `useOwnedAction.ts` was read, not `action-owner.ts`.
- UNVERIFIED: `Select`, `Button`, `ErrorMessage` and `InspectorSearch` rendering and a11y beyond the props passed; `Select` and `ErrorMessage` were not read.
- UNVERIFIED: screen reader output for the `radio`/`checkbox` rows with `accessibilityActions` ("Select asset", "Open <name>") on VoiceOver and TalkBack.
- UNVERIFIED: whether `onPress` carries `shiftKey`, `ctrlKey` or `metaKey` on `event.nativeEvent` on web; the code casts it and reads those fields.

## Variants

- `selectionMode`: `"single"` selects with mode `replace` and rows use `accessibilityRole="radio"`; `"multiple"` uses `checkbox` rows, Shift selects a range, Ctrl/Meta or any non-web platform toggles, plain web press replaces, and Ctrl/Cmd+A selects all visible.
- `height`: number gives the list a fixed `height`; `"fill"` gives the root `flex:1, minHeight:0, minWidth:0` and `keyboardShouldPersistTaps="handled"`.
- Sort (internal, `Select`): Name, Newest, Largest; folders always sort first.

## States

| State | How it is set | What the code does |
|---|---|---|
| `loading` | `loading` prop | `loading` prop; `busy` disables rows, breadcrumb buttons, sort and open button; empty text becomes "Loading assets…". |
| `pending request` | derived in code | `useOwnedAction` pending sets `busy` and shows a "Cancel asset request" button. |
| `error` | `error` prop | `error` prop or the action's error through `ErrorMessage`. |
| `selected` | derived in code | row `aria-checked`, `accessibilityState.checked`, and a "✓" mark; the roving tab stop (`tabIndex` 0) is the first selected visible row, else the first row. |
| `disabled` | derived in code | rows `disabled`, `aria-disabled`, `accessibilityState.disabled` while busy; breadcrumb for the current location is disabled. |
| `empty` | derived in code | "No assets match" when a query is set, else "This location is empty" (or `emptyState`). |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | row class `focus-visible:ring-2 focus-visible:ring-focus`. |
| `hover, pressed` | derived in code | no code. |

### Motion

none in source. `scrollToOffset` and `scrollToIndex` use `animated:false`.

### Platform notes

- `Platform.OS !== "web"` in the `choose` function: outside web, press toggles in multiple mode; on web a plain press replaces unless Ctrl/Meta is held.
- Keyboard handling (`onKeyDown`, `tabIndex`) is passed through a spread and reads web key events through `shellKey`.
- Export conditions: `types`, `react-native`, `default`, same file. No sibling variants.

## A11y

- Contrast: Rows text-text 17.79/13.83:1, secondary text-text-muted 6.16/7.14:1; row separator 1.58/1.58:1. Inherits Select and InspectorSearch field boundary 1.42/1.75:1 (F03).
- Keyboard and focus: Rows: roving tabIndex, onKeyDown (:127), `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) . Selected rows show a check mark glyph, hidden from AT. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Row minHeight 64 (:131, no token). Passes both.
- Screen reader: Each row role radio (single) or checkbox (multiple) with checked and disabled state, a composed label (name, kind, size) and actions activate and open (:124-129). The FlatList has a label but no group role (S2). Toolbar has a label.
- Motion: None.
- Review status: **FAIL**. Renders Select and InspectorSearch, which fail field boundary (F03).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=AssetBrowser
import {useState} from "react";
import {AssetBrowser, type AssetEntry, type AssetLocation} from "@nyc-tron/ui/components/shell/AssetBrowser";

const entries: readonly AssetEntry[] = [
  {id: "f1", name: "Textures", kind: "folder"},
  {id: "a1", name: "harbor.png", kind: "file", mediaType: "image/png", byteLength: 204800, modifiedMs: 1700000000000},
];
const path: readonly AssetLocation[] = [{id: "root", label: "Project"}, {id: "images", label: "Images"}];

export function Example() {
  const [selected, setSelected] = useState<readonly string[]>([]);
  return (
    <AssetBrowser locationId="images" revision="r1" entries={entries} path={path} selectedIds={selected}
      selectionMode="multiple" onSelectionChange={setSelected} height="fill"
      onOpen={async (request, signal) => { if (!signal.aborted) console.log(request.entry.id); }}
      onNavigate={(locationId) => { console.log(locationId); }}/>
  );
}
```

## Do/Don't

### Do

- Update `revision` whenever `entries` change, because it is sent back as `expectedRevision` in `AssetRequest`.
- Keep `selectedIds` to one id in the default `selectionMode` of `single`, and switch to `multiple` for ranges.

### Don't

- Don't pass a `height` below 44 or a non-finite number; it throws `RangeError`.
- Don't ship the sort and search fields as accessible fields: they inherit the 1.42/1.75:1 boundary from `Select` and `InspectorSearch` (F03, FAIL).
- Don't send more than 20000 `entries` or duplicate ids; the list is validated.
