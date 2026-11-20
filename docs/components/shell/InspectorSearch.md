---
name: "InspectorSearch"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/InspectorSearch"
tier: 1
docs: "handwritten"
platforms: []
category: "input"
tokens: ["color.border", "color.focus", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "reviewed-fail"
---

# InspectorSearch

## Purpose

Search field with clear button and live-region match summary for inspector panels, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { InspectorSearch } from "@nyc-tron/ui/components/shell/InspectorSearch";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/InspectorSearch
```

### Dependencies

- `./shell-keys` (`shellKey`), `../styles` (`joinClasses`), `./inspector-model` (`matchesQuery`).
- External: `react`, `react-native` (`Pressable`, `Text`, `TextInput`, `View`).

## Props

Tier-1 reason: R3 shell core. Import count: 3 (other packages: 0).
Also exported: type `InspectorSearchProps`; function `matchesQuery(query, label, keywords?)` (true when every query word starts a label word or keyword or appears inside the label; case and accents ignored; empty query matches all).

`InspectorSearchProps extends Omit<ViewProps,"children">`. `style` goes to the root `View`; the rest spread onto it.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | `"inspector-search"` | no | A change in scope drops stale `onQueryChange` calls from the previous commit. |
| `disabled` | `boolean` | `false` | no | Field not editable; clear button disabled. |
| `query` | `string` | none | yes |  |
| `maxLength` | `number` | `2048` | no | Integer 1 to 100000, else `RangeError`. Input is sliced to it. |
| `onQueryChange` | `(query: string) => void` | none | yes |  |
| `label` | `string` | `"Search properties"` | no | Accessible name and placeholder. |
| `summary` | `string` | none | no | Text of the polite live region under the field. |
| `className` | `string` | none | no | Joined after `gap-1`. |
| `unstyled` | `boolean` | `false` | no |  |

### Tokens

| Token | Replaces | Count |
|---|---|---|
| space.2.5 | `paddingHorizontal: 10` | 1 |
| space.2 | `paddingHorizontal: 8` | 1 |
| radius.5 | `borderRadius: 5` | 1 |
| border.1_5 | `borderTopWidth: 1.5`, `borderWidth: 1.5` | 4 |
| size.touch | `minHeight: 44` | 2 |
| color.border | `border-border` | 1 |
| color.surfaceSunken | `bg-surface-sunken` | 1 |
| color.focus | `focus-within:border-focus`, `ring-focus` | 2 |
| color.text | `text-text` | 1 |
| color.textMuted | `text-text-muted`, `placeholder:text-text-muted`, `border-text-muted` | 6 |
| radius.control | `rounded-control` | 2 |

Tailwind default classes (no token): `gap-1` 1, `border` 8, `min-h-11` 1, `min-w-11` 1, `text-xs` 1.

### Unverified

- UNVERIFIED: that Escape reaches `onKeyPress` on native; the handler reads `shellKey(event)` and only web key events were assumed.
- UNVERIFIED: `normalizeSearchText` (from `overlays/command-filter.ts`), used by `matchesQuery`; not read.

## Variants

none. `unstyled` removes classes.

## States

| State | How it is set | What the code does |
|---|---|---|
| `disabled` | `disabled` prop | `editable={false}`, `accessibilityState.disabled`, clear button `disabled`. |
| `has query` | derived in code | shows a "Clear search" button (44 by 44 minimum); Escape in the field clears it when a query exists. |
| `focus` | class `focus-within:border-focus` | container `focus-within:border-focus`; clear button `focus-visible:ring-2 focus-visible:ring-focus`. |
| `summary` | `summary` prop | live region `accessibilityLiveRegion="polite"`; its `minHeight` is 0 when `summary` is empty. |
| `hover, loading, error` | derived in code | no code. |

### Motion

none in source.

### Platform notes

none in source. `role="searchbox"` is passed on the `TextInput`. Export conditions: `types`, `react-native`, `default`, same file.

## A11y

- Contrast: Field bg-surface-sunken with border-border 1.42/1.75:1 (F03); focus border-focus 5.22/7.67:1; placeholder text-text-muted 5.54/7.9:1; clear glyph border-text-muted 5.54/7.9:1.
- Keyboard and focus: Native input; clear button `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:53). `focus-visible:outline-none` on the input (:50) is replaced by border-focus. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Input minHeight 44 (:42, :51, size.touch), clear min-h-11 min-w-11 (:53). Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: role=searchbox, label, disabled state; clear button labelled; summary is a polite live region (:44-61).
- Motion: None.
- Review status: **FAIL**. Input boundary 1.42/1.75:1 (1.4.11).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=InspectorSearch
import {useState} from "react";
import {InspectorSearch, matchesQuery} from "@nyc-tron/ui/components/shell/InspectorSearch";

const names = ["Opacity", "Blend mode", "Position"];

export function Example() {
  const [query, setQuery] = useState("");
  const count = names.filter(n => matchesQuery(query, n)).length;
  return <InspectorSearch query={query} onQueryChange={setQuery} label="Search controls" summary={`${count} controls match`}/>;
}
```

## Do/Don't

### Do

- Pass `summary` so the polite live region reports how many properties match.
- Use `matchesQuery` with `keywords` for filtering so every query word can match a label word.

### Don't

- Don't treat the field boundary as accessible; `border-border` on `bg-surface-sunken` is 1.42/1.75:1 (F03, FAIL).
- Don't set `maxLength` outside 1 to 100000 or non-integer; it throws `RangeError`.
- Don't assume Escape clears the field on native; `onKeyPress` reaching Escape there is `UNVERIFIED`.
