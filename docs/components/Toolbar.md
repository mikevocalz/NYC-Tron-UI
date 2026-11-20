---
name: "Toolbar"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/Toolbar"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "navigation"
tokens: ["color.border", "color.surfaceRaised", "color.text"]
registryDependencies: []
a11yStatus: "reviewed-pass"
---

# Toolbar

## Purpose

Header bar with title, leading slot and actions group in default or compact density; arrow-key focus on web, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { Toolbar } from "@nyc-tron/ui/Toolbar";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/Toolbar
```

### Dependencies

- `joinClasses`; `arrowStep`, `domIsRTL`, `isModified`, `webKey` (same package).
- react-native (peer, required): I18nManager, Platform, Text, View.
- No optional peers.

## Props

`ToolbarProps` extends `Omit<ViewProps,"children"|"role">`.

Extends: `Omit<ViewProps, "children" | "role">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `title` | `string` | none | no | Header Text, one line. Without it a flex spacer View fills the gap. |
| `leading` | `ReactNode` | none | no |  |
| `actions` | `ReactNode` | none | no | Wrapped in `role="toolbar"`. |
| `density` | `"default" \| "compact"` | `"default"` | no |  |
| `actionsLabel` | `string` | none | no | Falls back to `<title> actions`, or `Actions` without a title. |
| `className` | `string` | none | no |  |
| `titleClassName` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

### Tokens

- `color.border` x1, `color.surfaceRaised` x1, `color.text` x2 (`border-b border-border bg-surface-raised` when styled)
- No radius token.

Tailwind default classes (no token): `min-w-0` x2, `gap-2`, `min-h-13`, `px-2`, `min-h-14`, `px-4`, `border` x3, `gap-1` x2, `text-sm`, `font-semibold` x2, `text-lg`.

### Unverified

- UNVERIFIED: `min-h-13` is used in the source but defined nowhere in the files read; whether it resolves depends on the consumer's Tailwind config.

## Variants

`density`:
- `default`: `min-h-14 px-4`; title `text-lg font-semibold text-text`; web `aria-level` 2.
- `compact`: `min-h-13 px-2`; title `text-sm font-semibold text-text`; web `aria-level` 3.

## States

Static bar. No interactive state on the bar itself.

### Motion

none in source.

### Platform notes

- Web only: title `aria-level`, and an `onKeyDown` on the actions group moving focus among focusable descendants (`button:not([disabled]),a[href],[role="button"]:not([aria-disabled="true"]),[tabindex="0"]`) with arrows (RTL-aware), Home and End, with wrap.

## A11y

- Contrast: Title text-text 17.79/13.83:1 on bg-surface-raised; border 1.58/1.58:1 decorative.
- Keyboard and focus: Web: arrow keys move focus between actions (:21-29, :65). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Bar min-h-13 or min-h-14 (:54); actions are the caller's.
- Screen reader: Title accessibilityRole=header with aria-level on web; actions role=toolbar labelled (:58-65).
- Motion: None.
- Review status: **PASS**. Toolbar and heading semantics with arrow-key movement.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=Toolbar
import { Text } from "react-native";
import { IconButton } from "@nyc-tron/ui/components/IconButton";
import { Toolbar } from "@nyc-tron/ui/components/Toolbar";

export function PaneHeader() {
  return (
    <Toolbar
      title="Layers"
      density="compact"
      actionsLabel="Layer actions"
      leading={<IconButton aria-label="Back" icon={<Text>{"<"}</Text>} onPress={() => {}} />}
      actions={<IconButton aria-label="Add layer" icon={<Text>+</Text>} onPress={() => {}} />}
    />
  );
}
```

## Do/Don't

### Do

- Set `actionsLabel` when `title` is absent or several toolbars exist; the fallback is `<title> actions` or `Actions`.
- Use `density="compact"` for tight headers; it uses `min-h-13` and a smaller title.
- Pass `actions` focusable children, since arrow keys move among them on web.

### Don't

- Do not assume `min-h-13` resolves; it is defined nowhere in the files read and depends on your Tailwind config (UNVERIFIED).
- Do not put `role` on the root; `ToolbarProps` omits it.
- Do not omit `title` expecting a heading; without it only a spacer renders.
