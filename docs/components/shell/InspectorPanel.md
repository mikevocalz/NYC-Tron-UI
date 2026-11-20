---
name: "InspectorPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/InspectorPanel"
tier: 1
docs: "handwritten"
platforms: []
category: "shell"
tokens: ["color.border", "color.surfaceRaised", "color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/shell/InspectorSearch"]
a11yStatus: "reviewed-fail"
---

# InspectorPanel

## Purpose

Inspector panel for the current selection: header, search filter and InspectorSection and PropertyRow children, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { InspectorPanel } from "@nyc-tron/ui/components/shell/InspectorPanel";`
- Peers: @nyc-tron/core, react, react-native, zustand
- Requires: @nyc-tron/shell/InspectorSearch

```sh
npx shadcn@latest add @nyc-tron/shell/InspectorPanel
```

### Dependencies

- `./InspectorSearch` (`InspectorSearch`), `./inspector-context` (`InspectorPanelContext`), `./inspector-model`, `../styles` (`joinClasses`).
- External: `react`, `react-native` (`ScrollView`, `Text`, `View`), `zustand` (optional peer).

## Props

Tier-1 reason: R3 shell core. Import count: 0 (other packages: 0).
Also exported: types `InspectorSelection`, `InspectorPanelProps`.

`InspectorPanelProps extends Omit<ViewProps,"children">`. `style` is merged after `{flex:1,minHeight:0}`; the rest spread onto the root. The root also receives `role="region"` and `accessibilityLabel="Properties of <heading>"`.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | `JSON.stringify(selection)` | no | Keys the rows provider, so changing it remounts rows and drops editor drafts. Blank or over 4096 chars throws `RangeError`. |
| `selection` | `InspectorSelection` | none | yes |  |
| `children` | `ReactNode` | none | no | `InspectorSection`s and `PropertyRow`s. |
| `query` | `string` | `""` | no | Filter text. |
| `onQueryChange` | `(query: string) => void` | none | no | With a selection other than `none`, shows an `InspectorSearch`. |
| `actions` | `ReactNode` | none | no | Header buttons. |
| `emptyMessage` | `string` | `"Select an object to see its properties."` | no | Shown when nothing is selected. |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

`InspectorSelection` (inspector-model.ts, union):

| kind | Fields |
|---|---|
| `"none"` | none |
| `"single"` | `title: string` (nonblank, at most 512), `detail?: string` (at most 2048) |
| `"multiple"` | `count: number` (integer, at least 2), `noun: {one: string, other: string}` |

Heading: `"No selection"`, the single title, or `"<count> <noun.other>"`. Sub-line: the single `detail`, or "Changes apply to every selected object." for a multiple selection.

### Tokens

| Token | Replaces | Count |
|---|---|---|
| space.2 | `gap: 8` | 2 |
| space.4 | `padding: 16`, `paddingBottom: 16` | 3 |
| space.1 | `gap: 4` | 1 |
| size.touch | `minHeight: 44` | 1 |
| color.surfaceRaised | `bg-surface-raised` | 1 |
| color.border | `border-b border-border` | 1 |
| color.text | `text-text` | 2 |
| color.textMuted | `text-text-muted` | 3 |

No token: `minHeight: 0` 1, `minWidth: 0` 1.
Tailwind default classes (no token): `border` 3, `px-3` 1, `py-2` 1, `text-base` 1, `font-semibold` 1, `text-xs` 2, `text-sm` 2.

### Unverified

- UNVERIFIED: how `PropertyRow` registers into the row registry and counts as a match; `PropertyRow.tsx` and `registerRow` were not read in full.
- UNVERIFIED: VoiceOver, TalkBack and browser output for `role="region"` with the "Properties of ..." label.

## Variants

`selection.kind` (`none`, `single`, `multiple`) changes the heading, the sub-line, and whether the body is the empty message or the scroll area. `unstyled` removes classes.

## States

| State | How it is set | What the code does |
|---|---|---|
| `empty` | class `kind:"none"` | `kind:"none"` renders `emptyMessage` instead of children and hides search. |
| `searching` | derived in code | a nonblank `query` filters rows; the live-region summary comes from `matchSummary` ("1 property matches", "N properties match", or `No properties match "<q>"`). |
| `no matches` | derived in code | while searching with zero matching rows, a message `Nothing matches "<q>".` and "Try a shorter word, or clear the search to see every property." |
| `loading, error, disabled, focus` | derived in code | none in this file. |

### Motion

none in source.

### Platform notes

none in source. Export conditions: `types`, `react-native`, `default`, same file.

## A11y

- Contrast: Heading text-text 17.79/13.83:1. Renders InspectorSearch (F03).
- Keyboard and focus: Search and sections are native controls.
- Touch target: Header minHeight 44 (:53, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: role=region labelled "Properties of {selection}", heading, live match count through InspectorSearch (:50-55).
- Motion: None.
- Review status: **FAIL**. Renders InspectorSearch (F03).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=InspectorPanel
import {useState} from "react";
import {Text} from "react-native";
import {InspectorPanel, type InspectorSelection} from "@nyc-tron/ui/components/shell/InspectorPanel";
import {InspectorSection} from "@nyc-tron/ui/components/shell/InspectorSection";

export function Example() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(true);
  const selection: InspectorSelection = {kind: "single", title: "Harbor photo", detail: "Image layer"};
  return (
    <InspectorPanel selection={selection} query={query} onQueryChange={setQuery} scope="layer-7">
      <InspectorSection title="Transform" expanded={open} onExpandedChange={setOpen}><Text>Rows</Text></InspectorSection>
    </InspectorPanel>
  );
}
```

## Do/Don't

### Do

- Set `scope` explicitly when the selection object is rebuilt each render, since the default is `JSON.stringify(selection)` and a change drops editor drafts.
- Pass `onQueryChange` together with `query` so a selection other than `none` shows `InspectorSearch`.

### Don't

- Don't ship the panel's search as accessible by default; it renders `InspectorSearch` with a 1.42/1.75:1 boundary (F03, FAIL).
- Don't use a blank or over 512 char `title` in a `single` selection, or a `multiple` `count` under 2; both are rejected.
- Don't claim the `region` label is announced; that output is `UNVERIFIED`.
