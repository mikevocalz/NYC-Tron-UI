---
name: "Badge"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/feedback/Badge"
tier: 1
docs: "handwritten"
platforms: []
category: "feedback"
tokens: ["color.accent", "color.border", "color.danger", "color.info", "color.success", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "reviewed-pass"
---

# Badge

## Purpose

Small status badge with neutral, info, success, danger or accent tone, a status dot and size steps, for React Native.

## Install

- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/feedback/Badge
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { Badge } from "@/components/nyc-tron/ui/components/feedback/Badge";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { Badge } from "@nyc-tron/ui/components/feedback/Badge";`

### Dependencies

- `joinClasses` from `../styles.ts`.
- react-native (peer, required): Text, View.
- No optional peers.

## Props

Extends `Omit<ViewProps,"children">`. `accessibilityLabel` defaults to `label`; the View has `accessible`.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | none | yes | Text and accessibilityLabel. |
| `tone` | `BadgeTone` | `"neutral"` | no |  |
| `size` | `BadgeSize` | `"sm"` | no |  |
| `className` | `string` | none | no |  |
| `labelClassName` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

### Tokens

- `color.info`, `color.success`, `color.danger`, `color.accent`: dot border x1 each
- `color.border` x1, `color.surfaceSunken` x1, `color.surfaceRaised` x1, `color.textMuted` x1, `color.text` x1
- `radius.control` x1
- `border.3`: `borderWidth: 3` x1

Tailwind default classes (no token): `border` x8, `gap-1` x2 (incl. `gap-1.5`), `px-1` (`px-1.5`), `py-0` (`py-0.5`), `text-xs` x2, `px-2`, `py-1`, `font-medium`, `h-1`, `w-1`, `rounded-full`, `leading-4`.

### Unverified

none

## Variants

`tone`:
- `neutral`: `bg-surface-sunken`, label `text-text-muted`, no dot.
- `info`, `success`, `danger`, `accent`: `bg-surface-raised`, label `text-text`, plus a dot View with `border-info`/`border-success`/`border-danger`/`border-accent`, `style={{borderWidth:3}}`, `h-1.5 w-1.5 rounded-full`.

`size`:
- `xs`: root `gap-1 px-1.5 py-0.5`, label `text-xs leading-4`.
- `sm`: root `gap-1.5 px-2 py-1`, label `text-xs leading-4 font-medium`.

## States

Static. No interactive states in code.

### Motion

none in source.

### Platform notes

none in source.

## A11y

- Contrast: neutral label text-text-muted on surface-sunken 5.54/7.9:1; toned label text-text on surface-raised 17.79/13.83:1; tone dot border-info 6.45/8.17:1, border-success 5.38/8.72:1, border-danger 6.57/7.24:1, border-accent 5.17/8.86:1. Label is 12pt (text-xs), text threshold 4.5:1 applies and passes.
- Keyboard and focus: Static, not focusable.
- Touch target: Not interactive.
- Screen reader: accessible with accessibilityLabel = label (:40). Tone is carried by the dot and by the label text, never by colour alone. The dot is aria-hidden.
- Motion: None.
- Review status: **PASS**. Static chip, all pairs above threshold, tone not colour-only.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=Badge
import { Badge } from "@/components/nyc-tron/ui/components/feedback/Badge";

export function DraftBadge() {
  return <Badge label="Draft" tone="info" size="xs" />;
}
```

## Do/Don't

### Do

- Choose `tone` of `info`, `success`, `danger` or `accent` when status matters, since each adds a dot and `text-text` label rather than relying on color alone.
- Use `size` of `xs` for dense rows, which tightens padding to `px-1.5 py-0.5`.
- Write a short, self-describing `label`, since it is both the visible text and the `accessibilityLabel`.

### Don't

- Do not add `onPress` behaviour to a `Badge`, because it is static and not focusable per the a11y review.
- Do not set `unstyled` and expect the tone dot, because the dot and `tone` classes come with the built-in styling.
