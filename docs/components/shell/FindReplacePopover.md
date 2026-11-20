---
name: "FindReplacePopover"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/FindReplacePopover"
tier: 1
docs: "handwritten"
platforms: []
category: "overlay"
tokens: []
registryDependencies: ["@nyc-tron/overlays/AnchoredPopover", "@nyc-tron/shell/FindReplaceContent"]
a11yStatus: "reviewed-fail"
---

# FindReplacePopover

## Purpose

FindReplaceContent inside an AnchoredPopover, placed by anchor rectangle or trigger, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { FindReplacePopover } from "@nyc-tron/ui/components/shell/FindReplacePopover";`
- Peers: react, react-native
- Requires: @nyc-tron/overlays/AnchoredPopover, @nyc-tron/shell/FindReplaceContent

```sh
npx shadcn@latest add @nyc-tron/shell/FindReplacePopover
```

### Dependencies

- `../overlays/AnchoredPopover` (`AnchoredPopover`, `PopoverAnchorProps`, `PopoverTriggerProps`), `./FindReplaceContent` (`FindReplaceContent`).
- External: `react-native` via the above. No direct external imports.

## Props

Tier-1 reason: R3 shell core. Import count: 2 (other packages: 2).
Also exported: types `FindReplaceContentProps` (re-export), `FindReplacePopoverProps`.

`FindReplacePopoverProps = Omit<FindReplaceContentProps,"onClose"|"active"> & (Omit<PopoverAnchorProps,"children"|"accessibilityLabel"> | Omit<PopoverTriggerProps,"children"|"accessibilityLabel">)`. The component reads `document`, `onFind`, `onReplace`, `onNavigate`, `initialQuery`, `unstyled` itself and passes everything else to `AnchoredPopover`. `accessibilityLabel` is fixed to "Find and replace". `active` is set from `open`, and `onClose` calls `onOpenChange(false)`.

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| document | `FindDocument` | none | yes | See FindReplaceContent. |
| onFind | `(query, signal) => FindResponse \| Promise<FindResponse>` | none | yes |  |
| onReplace | `(request, signal) => void \| Promise<void>` | none | yes |  |
| onNavigate | `(document, match) => void` | none | yes |  |
| initialQuery | `string` | none | no | Forwarded only when defined. |
| unstyled | `boolean` | none | no | Forwarded only when defined. |
| open | `boolean` | none | yes | Controlled visibility. |
| onOpenChange | `(open: boolean) => void` | none | yes |  |
| scope | `string` | none | no | Popover scope. |
| width | `number` | none (popover default 320) | no |  |
| maxHeight | `number` | none (popover default 420) | no |  |
| className | `string` | none | no | Web only per the type doc. |
| testID | `string` | none | no |  |
| anchor | `Rect2D` | none | one of anchor or trigger | Rect form; requires `usableRegions`. |
| usableRegions | `readonly Rect2D[]` | none | yes with `anchor`, optional with `trigger` | Trigger form default: the whole window. |
| trigger | `ReactNode \| ((state: PopoverTriggerState) => ReactNode)` | none | one of anchor or trigger | Trigger form. |

`PopoverTriggerState`: `open: boolean`, `toggle: () => void`, `triggerProps: {accessibilityState:{expanded}, "aria-expanded", "aria-haspopup":"dialog"}`.

### Tokens

none (no literals or classes in this file).

### Unverified

- UNVERIFIED: `AnchoredPopover` placement, dismissal and focus behaviour; only its type file and one line were read.
- UNVERIFIED: the native (SwiftUI/Compose) popover surface in `@nyc-tron/expo-controls`; outside this file.

## Variants

Two forms: rect form (`anchor` plus `usableRegions`) and trigger form (`trigger`). `AnchoredPopover` throws `TypeError` unless exactly one of `anchor` and `trigger` is given (`isTriggerPopover`).

## States

| State | How it is set | What the code does |
|---|---|---|
| `open or closed` | derived in code | `open` prop; the inner `FindReplaceContent` gets `active={open}`, so searching and editing stop while closed. |
| `trigger form` | derived in code | `triggerProps` carry `accessibilityState.expanded`, `aria-expanded`, `aria-haspopup="dialog"` when spread by the caller. |

- All other states come from `FindReplaceContent`.

### Motion

none in source.

### Platform notes

none in the file. The comment says the Expo-controls entry supplies SwiftUI/Compose popover surfaces; that entry was not read. `AnchoredPopover` has a `Platform.OS!=="web"` check for Tab handling (line 65).

## A11y

- Contrast: Wrapper around AnchoredPopover and FindReplaceContent.
- Keyboard and focus: As AnchoredPopover (trap, Escape).
- Touch target: See FindReplaceContent. Android 48dp: below (F08).
- Screen reader: AnchoredPopover labelled "Find and replace".
- Motion: None.
- Review status: **FAIL**. Renders FindReplaceContent (F03).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=FindReplacePopover
import {useState} from "react";
import {Pressable, Text} from "react-native";
import {FindReplacePopover} from "@nyc-tron/ui/components/shell/FindReplacePopover";

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <FindReplacePopover open={open} onOpenChange={setOpen} document={{id: "doc-1", revision: "r1"}}
      onFind={() => ({token: "t", total: 0, matches: []})} onReplace={async () => {}} onNavigate={() => {}}
      trigger={({toggle, triggerProps}) => <Pressable onPress={toggle} {...triggerProps}><Text>Find</Text></Pressable>}/>
  );
}
```

## Do/Don't

### Do

- Pass exactly one of `anchor` or `trigger`, because `AnchoredPopover` throws `TypeError` otherwise.
- Control `open` and `onOpenChange` together, since `active` on the inner content follows `open` and searching stops when closed.

### Don't

- Don't pass `onClose` or `active`; both are omitted from the props type and the popover owns them.
- Don't treat the popover as passing contrast; it renders `FindReplaceContent` and inherits the 1.42/1.75:1 input boundary (F03, FAIL).
- Don't assume the native SwiftUI or Compose surface applies; that entry was not read and is `UNVERIFIED`.
