---
name: "FindReplaceContent"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/FindReplaceContent"
tier: 1
docs: "handwritten"
platforms: []
category: "input"
tokens: ["color.border", "color.focus", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control", "space.2", "space.3"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "reviewed-fail"
---

# FindReplaceContent

## Purpose

Find and replace form with match navigation, replace one or all, and async search with abort, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { FindReplaceContent } from "@nyc-tron/ui/shell/FindReplaceContent";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/shell/FindReplaceContent
```

### Dependencies

- `../Button` (`Button`), `../feedback/ErrorMessage` (`ErrorMessage`), `../forge/canvas/SettingSwitch` (`SettingSwitch`), `./useOwnedAction`, `./find-replace-model`, `../styles` (`joinClasses`).
- External: `react`, `react-native` (`ScrollView`, `Text`, `TextInput`, `View`), `zustand` (optional peer).

## Props

Tier-1 reason: R3 shell core. Import count: 2 (other packages: 1).
Also exported: types `FindDocument`, `FindMatch`, `FindQuery`, `FindResponse`, `ReplaceRequest`, `FindReplaceContentProps`.

Plain interface, no `extends`. It renders a `ScrollView` and forwards no view props.

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `document` | `FindDocument` | none | yes | `{id, revision}`; both feed the search and replace scopes. |
| `active` | `boolean` | `true` | no | When `false`, no search runs, inputs are not editable and buttons are disabled. |
| `onFind` | `(query: FindQuery, signal: AbortSignal) => FindResponse \| Promise<FindResponse>` | none | yes | Result passes `validateFindResponse` (token, total, at most 1000 matches, ordered nonoverlapping UTF-16 ranges, preview limits) or the action errors. |
| `onReplace` | `(request: ReplaceRequest, signal: AbortSignal) => void \| Promise<void>` | none | yes |  |
| `onNavigate` | `(document: FindDocument, match: FindMatch) => void` | none | yes |  |
| `initialQuery` | `string` | `""` | no | Read once, when the store is created. |
| `onClose` | `() => void` | none | no | Shows a "Close find and replace" button. |
| `unstyled` | `boolean` | `false` | no |  |

| Type | Fields |
|---|---|
| FindDocument | `id: string`, `revision: string` |
| FindQuery | `document`, `text: string`, `caseSensitive: boolean`, `wholeWord: boolean` |
| FindMatch | `id`, `start`, `end` (UTF-16 offsets), `before`, `text`, `after` |
| FindResponse | `token: string`, `total: number`, `matches: readonly FindMatch[]` |
| ReplaceRequest | `query`, `searchToken`, `replacement`, and either `kind:"one"` with `matchId` or `kind:"all"` |

### Tokens

| Token | Replaces | Count |
|---|---|---|
| space.3 | `padding: 12` | 1 |
| space.2 | `gap: 8`, `padding: 8` | 4 |
| size.touch | `minHeight: 44` | 2 |
| color.border | `border-border` | 1 |
| color.surfaceSunken | `bg-surface-sunken` | 1 |
| color.text | `text-text` | 3 |
| color.focus | `focus-visible:border-focus` | 1 |
| color.textMuted | `text-text-muted` | 1 |
| radius.control | `rounded-control` | 1 |

Tailwind default classes (no token): `border` 4, `font-semibold` 1, `font-bold` 1 (plus `underline` on the match text, not listed by the script).

### Unverified

- UNVERIFIED: `SettingSwitch`, `Button` and `ErrorMessage` rendering; only the props passed were read.
- UNVERIFIED: whether the polite live region announces each state change on VoiceOver, TalkBack and browsers.
- UNVERIFIED: `useOwnedAction` / `createActionOwner` cancel semantics when `scope` changes mid-search (`action-owner.ts` not read).

## Variants

none. `unstyled` only removes classes. `ReplaceRequest.kind` is `"one"` (current match) or `"all"`.

## States

| State | How it is set | What the code does |
|---|---|---|
| `searching` | derived in code | shown as "Finding…" while a find is pending or the result scope is stale and there is no error. |
| `error` | derived in code | "Search failed" in the live region, plus the message in `ErrorMessage`. |
| `empty` | derived in code | "Enter text to find" with no query, "No search results" with a query and no result. |
| `results` | derived in code | "<total> matches", with "; showing first N" when `total` exceeds the shown matches. |
| `pending replacement or active=false` | derived in code | inputs `editable={false}`, switches and buttons disabled; a pending replacement shows "Cancel replacement". |
| `disabled buttons` | derived in code | Previous/Next need a current match; Replace match and Replace all also wait for `searching` to end. |
| `focus` | class `focus-visible:border-focus` | field class includes `focus-visible:border-focus`. |
| `hover, pressed` | derived in code | no code. |

### Motion

none in source.

### Platform notes

none in source. Export conditions: `types`, `react-native`, `default`, same file.

## A11y

- Contrast: Inputs on bg-surface-sunken with border-border: 1.42/1.75:1 (F03); focus swaps to border-focus 5.22/7.67:1. Count text-text-muted 6.16/7.14:1; error via ErrorMessage.
- Keyboard and focus: Native inputs; Buttons carry `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Inputs minHeight 44 (:59, :61, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: Inputs have accessibilityLabel ("Find text", "Replacement text"); result count is a polite live region; match text carries a composed label (:57-73).
- Motion: None.
- Review status: **FAIL**. Input boundary 1.42/1.75:1 (1.4.11).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=FindReplaceContent
import {FindReplaceContent, type FindDocument, type FindQuery, type FindResponse} from "@nyc-tron/ui/components/shell/FindReplaceContent";

const document: FindDocument = {id: "doc-1", revision: "r1"};
const onFind = (query: FindQuery): FindResponse => ({
  token: query.text,
  total: 1,
  matches: [{id: "0:5", start: 0, end: 5, before: "", text: query.text, after: " world"}],
});

export function Example() {
  return <FindReplaceContent document={document} onFind={onFind} onReplace={async () => {}} onNavigate={() => {}} initialQuery="hello"/>;
}
```

## Do/Don't

### Do

- Return a `FindResponse` with a `token` and ordered non-overlapping ranges from `onFind`, because `validateFindResponse` fails the action otherwise.
- Set `active` to `false` when the surface is hidden so no search runs and the inputs stop being editable.

### Don't

- Don't ship the `Find text` and `Replacement text` inputs as meeting contrast; the boundary is 1.42/1.75:1 (1.4.11, F03) and the review status is FAIL.
- Don't expect `initialQuery` to update later; it is read once when the store is created.
- Don't claim the live region announces every state change; the page marks that `UNVERIFIED`.
