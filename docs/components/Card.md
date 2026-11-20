---
name: "Card"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/Card"
tier: 1
docs: "handwritten"
platforms: []
category: "layout"
tokens: ["color.border", "color.surfaceRaised", "color.surfaceSunken", "radius.card"]
registryDependencies: []
a11yStatus: "reviewed-pass"
---

# Card

## Purpose

Static container View with raised, sunken or transparent surface and optional padding, for React Native.

## Install

- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/Card
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { Card } from "@/components/nyc-tron/ui/components/Card";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { Card } from "@nyc-tron/ui/components/Card";`

### Dependencies

- `joinClasses` from `./styles.ts`.
- react-native (peer, required): View.
- No optional peers.

## Props

Extends `Omit<ViewProps,"children">`. `style` is passed through unchanged.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | none | no |  |
| `surface` | `CardSurface` | `"raised"` | no |  |
| `padded` | `boolean` | `true` | no | Adds `p-4` when styled. |
| `className` | `string` | none | no | Appended last. |
| `unstyled` | `boolean` | `false` | no | Removes all default classes. |

### Tokens

- `color.surfaceRaised` x1, `color.border` x2, `color.surfaceSunken` x1 (surface classes)
- `radius.card`: `rounded-card` x1

Tailwind default classes (no token): `border` x6, `p-4`.

### Unverified

none

## Variants

### surface

| Value | Effect |
|---|---|
| `raised` | `bg-surface-raised border-border`. |
| `sunken` | `bg-surface-sunken border-border`. |
| `transparent` | `bg-transparent border-transparent`. |

Styled cards also get `rounded-card border`.

## States

Static container. No interactive or conditional states in code.

### Motion

none in source.

### Platform notes

none in source.

## A11y

- Contrast: Non-interactive surface. Border border-border on raised/sunken is 1.58/1.58:1 / 1.42/1.75:1; decorative, no 1.4.11 requirement. Text inside is the caller's.
- Keyboard and focus: Not focusable, no handlers.
- Touch target: Not interactive.
- Screen reader: Plain View, no role, no label. Correct for a presentation container.
- Motion: None.
- Review status: **PASS**. Static container with no interactive or text content of its own.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=Card
import { Text } from "react-native";
import { Card } from "@/components/nyc-tron/ui/components/Card";

export function Summary() {
  return (
    <Card surface="sunken" padded>
      <Text>Last sync 09:41</Text>
    </Card>
  );
}
```

## Do/Don't

### Do

- Pick `surface` of `sunken` to set a card apart from a `raised` page area, since both keep the `border-border` outline.
- Leave `padded` at its default `true` for content cards, which adds `p-4`, and set it to false only when a child supplies its own padding.

### Don't

- Do not set `unstyled` and expect the radius or border, because it removes all default classes including `rounded-card`.
- Do not put tap handlers on `Card` and expect a button, because it is a plain View with no role and the a11y review marks it a static container.
