---
name: "Banner"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/feedback/Banner"
tier: 1
docs: "handwritten"
platforms: []
category: "feedback"
tokens: ["-space.2.5", "color.border", "color.danger", "color.focus", "color.info", "color.success", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: []
a11yStatus: "reviewed-pass"
---

# Banner

## Purpose

Inline status banner with info, success, danger or neutral tone, title, description, action slot and dismiss button, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { Banner } from "@nyc-tron/ui/feedback/Banner";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/feedback/Banner
```

### Dependencies

- `StatusGlyph`, `CloseGlyph`, `StatusTone` from `./glyphs.tsx`; `joinClasses`.
- react-native (peer, required): Pressable, Text, View.
- No optional peers.

## Props

`BannerProps` extends `Omit<ViewProps,"children"|"role">`. `role` is set to the `live` value.

Extends: `Omit<ViewProps, "children" | "role">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `tone` | `BannerTone` | none | yes | `BannerTone = StatusTone`: `info\|success\|danger\|neutral` (from glyphs.tsx). |
| `title` | `string` | none | yes |  |
| `description` | `string` | none | no |  |
| `action` | `ReactNode` | none | no | Rendered under the copy. |
| `live` | `"status" \| "alert"` | `"status"` | no | `status`: `accessibilityLiveRegion` polite; `alert`: assertive. |
| `onDismiss` | `() => void` | none | no | Renders the close Pressable. |
| `dismissLabel` | `string` | `"Dismiss"` | no |  |
| `icon` | `ReactNode` | none | no | Replaces `StatusGlyph`. |
| `className` | `string` | none | no |  |
| `titleClassName` | `string` | none | no |  |
| `descriptionClassName` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

### Tokens

- `color.info`, `color.success`, `color.danger`: x1 each (`border-*`)
- `color.surfaceRaised` x3, `color.surfaceSunken` x2, `color.border` x1, `color.text` x1, `color.textMuted` x1, `color.focus` x1
- `radius.card` x1, `radius.control` x1
- `-space.2.5`: `marginVertical: -10` x1
- `StatusGlyph` in glyphs.tsx adds `bg-info/success/danger`, `bg-text-muted` classes (separate file, not counted above).

Tailwind default classes (no token): `border` x7, `gap-3`, `rounded-card`, `py-3`, `min-w-0`, `gap-1`, `text-sm` x2, `font-semibold`, `min-h-11`, `min-w-11`, `opacity-70`, `ps-4`, `pe-1`, `pe-4`, `leading-5`, `mt-2`, `pt-0.5`, `py-px`, `self-start`.

### Unverified

- UNVERIFIED: Whether `role="alert"` or `"status"` on a View announces on each native platform: depends on the host, not on this file.
- UNVERIFIED: `ps-4`, `pe-1` and `pe-4` are logical-property utilities; their support depends on the consumer's Tailwind or Uniwind setup, which is out of scope.

## Variants

`tone` class strings: `info` `border-info bg-surface-raised`; `success` `border-success bg-surface-raised`; `danger` `border-danger bg-surface-raised`; `neutral` `border-border bg-surface-sunken`. Styled root also has `gap-3 rounded-card border ps-4 py-3` and `pe-1` with `onDismiss`, else `pe-4`.

## States

| State | How it is set | What the code does |
|---|---|---|
| `default` | derived in code | tone classes. |
| `live region` | derived in code | `role` and `accessibilityLiveRegion` from `live`. |
| `dismissible` | derived in code | `onDismiss` set; close control `accessibilityRole="button"`, `min-h-11 min-w-11`. |
| `close hover/pressed/focus` | class `hover:bg-surface-sunken active:opacity-70 focus-visible:ring-2 focus-visible:ring-focus` | `hover:bg-surface-sunken active:opacity-70 focus-visible:ring-2 focus-visible:ring-focus`. |

### Motion

`active:opacity-70` on the close control. No Animated calls.

### Platform notes

none in source.

## A11y

- Contrast: title text-text and description text-text-muted on surface-raised 17.79/13.83:1 / 6.16/7.14:1; neutral tone on surface-sunken 5.54/7.9:1; tone borders 6.45/8.17:1 5.38/8.72:1 6.57/7.24:1.
- Keyboard and focus: Dismiss button: `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:70). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Dismiss min-h-11 min-w-11 (:69, 44, no token; Tailwind default). Negative marginVertical -10 keeps the 44pt box. Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: role=status or alert via `live` plus accessibilityLiveRegion polite or assertive (:53-54). Dismiss: accessibilityRole=button, label default "Dismiss". Status mark has tone and the title carries the meaning.
- Motion: None.
- Review status: **PASS**. Live region, labelled dismiss, contrast above threshold.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=Banner
import { Banner } from "@nyc-tron/ui/components/feedback/Banner";
import { Button } from "@nyc-tron/ui/components/Button";

export function SaveFailed({ retry, close }: { retry: () => void; close: () => void }) {
  return (
    <Banner
      tone="danger"
      live="alert"
      title="Could not save"
      description="Check your connection and try again."
      action={<Button title="Try again" variant="secondary" onPress={retry} />}
      onDismiss={close}
      dismissLabel="Dismiss message"
    />
  );
}
```

## Do/Don't

### Do

- Set `live` to `alert` only for urgent failures, because it maps to an assertive live region while the default `status` is polite.
- Pass `onDismiss` to render the close button, and set `dismissLabel` when "Dismiss" is not specific enough.
- Always supply `tone` and `title`, since both are required and the title carries the meaning.

### Don't

- Do not assume the announcement is verified on every platform, because the page marks `role="alert"` and `status` behaviour on native as UNVERIFIED.
- Do not omit `tone`, because it is required and has no default.
- Do not rely on `ps-4`, `pe-1` and `pe-4` spacing without checking your Tailwind setup, because the page marks logical-property support UNVERIFIED.
