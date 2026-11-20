---
name: "WindowTitleBar"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/window/WindowTitleBar"
tier: 1
docs: "handwritten"
platforms: []
category: "shell"
tokens: ["color.accent", "color.border", "color.danger", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "reviewed-fail"
---

# WindowTitleBar

## Purpose

Custom window title bar with macOS or Windows close, minimize and zoom controls and an edited marker, for React Native.

## Install

- Package: @nyc-tron/ui
- Peers: @nyc-tron/core, react, react-native, zustand
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/window/WindowTitleBar
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { WindowTitleBar } from "@/components/nyc-tron/ui/components/window/WindowTitleBar";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { WindowTitleBar } from "@nyc-tron/ui/components/window/WindowTitleBar";`

### Dependencies

- `@nyc-tron/core/window-chrome`: `createWindowChromeController`, `describeTitleBar` and types. `@nyc-tron/core` is an optional peer.
- `react-native`: `Pressable`, `Text`, `View`. `zustand`, `zustand/vanilla`: optional peer. `react`: `useEffect`, `useMemo`, `useSyncExternalStore`. `../styles.ts`: `joinClasses`.

## Props

Tier-1 reason: R2 core family (window)
Import count: 0

Module exports: `WindowTitleBar`, `WindowTitleBarProps`, `useWindowChrome(host, windowId)`, and the constants `TITLE_BAR_HEIGHT = 44`, `CONTROL_TARGET = 44`, `CAPTION_TARGET_WIDTH = 48`. `WindowTitleBarProps` is an own interface (no `extends`).

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `chrome` | `WindowChromeController` | none | yes | From `useWindowChrome` or `createWindowChromeController`. |
| `title` | `string` | none | yes | Empty or whitespace shows "Untitled". |
| `controls` | `TitleBarControls` | none | yes | `{kind:"drawn", layout:"macos"\|"windows"}` or `{kind:"native", insets:{leading,trailing,height}}`. |
| `edited` | `boolean` | false | no | Shows a dot and `editedLabel`; accessible title gets ", edited". |
| `labels` | `Partial<WindowControlLabels>` | none | no | Keys: `close`, `minimize`, `restore`, `zoom`, `unzoom`. |
| `editedLabel` | `string` | "Edited" | no |  |
| `closeBlockedLabel` | `string` | "Window not closed." | no | Live-region text after a vetoed close. |
| `onCommandResult` | `(result: WindowCommandResult) => void` | none | no |  |
| `onError` | `(error: unknown) => void` | none | no | Falls back to `console.error`. |
| `children` | `ReactNode` | none | no | After the title. |
| `className` | `string` | none | no | Bar. |
| `titleClassName` | `string` | none | no |  |
| `controlClassName` | `string` | none | no |  |
| `unstyled` | `boolean` | false | no |  |
| `style` | `StyleProp<ViewStyle>` | none | no | After the built-in bar style. |
| `testID` | `string` | none | no | Controls get `<testID>-<command>`. |

`WindowChromeController` (core): `windowId`, `getSnapshot()`, `subscribe(listener)`, `run(command)`, `dispose()`. `WindowCommandResult` has `status` "done", "vetoed" (close only) or "ignored" with reason "busy", "unavailable" or "closed". `useWindowChrome(host: WindowChromeHost, windowId: string)` disposes the controller on unmount or host or window change.

### Tokens

`node tokenuse.mjs` output:
- `space.1.5` from `gap: 6` (x1), `space.2` from `paddingHorizontal: 8` (x1)
- `color.focus` (x1), `color.danger` (x1), `color.surfaceRaised` (x1), `color.textMuted` (x4), `color.surfaceSunken` (x1), `color.border` (x1), `color.accent` (x1), `color.text` (x1)
- `radius.control` (x2)
- `minWidth: 0`: no token

Tailwind default classes (no token): `opacity-80`, `opacity-50`, `rounded-control` (x2), `border` (x6), `rounded-full` (x2), `text-sm` (x2), `font-semibold`, `ring-2`. Unmapped: `TITLE_BAR_HEIGHT`, `CONTROL_TARGET`, `CAPTION_TARGET_WIDTH`, `GLYPH 12`, `STROKE 1.5`, `CHIP 20`, `DOT 8`.

### Unverified

- UNVERIFIED: the exact controls `describeTitleBar` returns per layout and snapshot state; only its call site and the core type definitions were read.
- UNVERIFIED: the on-screen insets a native host reports and how they combine with `insets.height`; they come from the host.

## Variants

- `controls.kind === "drawn"`, `layout: "macos"`: controls on the leading side, each in a 20-size bordered chip (`CHIP`) with a 44 by 44 target and `rounded-control`.
- `layout: "windows"`: controls trailing, 48 wide by 44 high, `hover:bg-danger` on close, else `hover:bg-surface-raised`.
- `kind: "native"`: no controls drawn; bar `paddingStart` and `paddingEnd` come from the insets and `minHeight` is `max(44, insets.height)`.
- Glyphs drawn from borders: close, minimize, restore, zoom (corner ticks inset 1, or 3 when `pressed`).

Which controls appear for a layout comes from core `describeTitleBar`.

## States

| State | How it is set | What the code does |
|---|---|---|
| `control enabled or disabled` | derived in code | `disabled`, `accessibilityState.disabled`, `opacity-50`. |
| `zoomed` | derived in code | `accessibilityState.selected` follows `control.pressed` when defined. |
| `focused window` | derived in code | title colour `text-text`, else `text-text-muted`. |
| `edited` | `edited` prop | dot (8 by 8, `border-accent`) and word. |
| `close vetoed` | derived in code | a polite live region, hidden visually, announces `closeBlockedLabel` until the next command. |
| `control hover, focus, pressed` | class `hover:*` | `hover:*`, `focus-visible:ring-2 focus-visible:ring-focus`, `active:opacity-80` (styled). |
| `pending commands` | derived in code | the controller reports `ignored` / `busy`; the title bar passes `snapshot.pending` into `describeTitleBar`. |

### Motion

none in source. `motion-reduce:transition-none` is on each control but nothing in the file sets a transition. `active:opacity-80` is the only press feedback.

### Platform notes

- Layout names `macos` and `windows` and the `native` insets (doc: AppKit window buttons, Windows caption buttons, iPadOS window controls) are data inputs, not `Platform.OS` checks. The file has none.
- The glyphs use borders so forced-colors mode keeps them (code comment).

## A11y

- Contrast: Title text-text or text-text-muted when unfocused 16.01/15.31:1 / 5.54/7.9:1. Control glyphs use border-text-muted; on the Windows close control hover:bg-danger turns the glyph into 1.07/1.01:1 (F05).
- Keyboard and focus: Controls `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:101). Windows and macOS layouts are chosen by the layout prop (:102-105). QNX: not branched.
- Touch target: CONTROL_TARGET 44, CAPTION_TARGET_WIDTH 48 (windows), TITLE_BAR_HEIGHT 44 (:13-17, size.touch). The window chrome is desktop-only, so the Android guideline does not apply.
- Screen reader: toolbar "{platform} window controls"; controls role=button with label and state disabled and selected; title role=header with edited suffix; blocked close is a polite live region (:96-129).
- Motion: `motion-reduce:transition-none` with no transition (F09).
- Review status: **FAIL**. Close glyph on hover has 1.07/1.01:1 contrast (1.4.11).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=WindowTitleBar
import { createPageWindowHost } from "@/lib/nyc-tron/core/window-chrome";
import { WindowTitleBar, useWindowChrome } from "@/components/nyc-tron/ui/components/window/WindowTitleBar";

const host = createPageWindowHost();
host.open({ id: "doc", displayId: "page", rect: { x: 0, y: 0, width: 640, height: 480 } });

export const Example = () => {
  const chrome = useWindowChrome(host, "doc");
  return (
    <WindowTitleBar chrome={chrome} title="notes.md" edited
      controls={{ kind: "drawn", layout: "windows" }}
      onCommandResult={result => console.log(result.status)} />
  );
};
```

## Do/Don't

### Do

- Pass `controls` with `kind` `drawn` and a `layout` of `macos` or `windows`, or `native` with `insets`.
- Set `closeBlockedLabel` to localized text, since it is announced after a vetoed close.
- Set `edited` to show the dot and ', edited' title suffix.

### Don't

- Do not use the Windows close hover as is; `hover:bg-danger` leaves the glyph at 1.07/1.01:1 (F05), a proven FAIL.
- Do not pass an empty `title`; it shows 'Untitled'.
- Do not assume exact controls per layout; `describeTitleBar` output is UNVERIFIED.
