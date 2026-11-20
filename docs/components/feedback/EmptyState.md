---
name: "EmptyState"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/feedback/EmptyState"
tier: 1
docs: "handwritten"
platforms: []
category: "feedback"
tokens: ["color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/Button"]
a11yStatus: "reviewed-pass"
---

# EmptyState

## Purpose

Empty-list placeholder with heading title, description, icon or illustration, and an action or secondary exit button, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { EmptyState } from "@nyc-tron/ui/components/feedback/EmptyState";`
- Peers: react, react-native
- Requires: @nyc-tron/Button

```sh
npx shadcn@latest add @nyc-tron/feedback/EmptyState
```

### Dependencies

- `Button` from `../Button.tsx` (subpath `./components/Button`); `joinClasses`.
- react-native (peer, required): Text, View.
- No optional peers.

## Props

`EmptyStateProps` extends `Omit<ViewProps,"children">`.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `title` | `string` | none | yes | Rendered with `role="heading"` and `aria-level`. |
| `description` | `string` | none | no |  |
| `action` | `ReactNode` | none | no | Takes precedence over `exitAction`. |
| `exitAction` | `EmptyStateExit` | none | no | Rendered as `Button variant="secondary"`. |
| `icon` | `ReactNode` | none | no | Ignored when `illustration` is given. |
| `illustration` | `ReactNode` | none | no |  |
| `titleLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `2` | no | Passed as `aria-level`. |
| `tone` | `string` | none | no | Accepted and discarded (`_tone`). |
| `className` | `string` | none | no |  |
| `titleClassName` | `string` | none | no |  |
| `descriptionClassName` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

`EmptyStateExit`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| title | `string` | none | yes | Button title. |
| onPress | `()=>void` | none | yes |  |
| accessibilityHint | `string` | none | no |  |

### Tokens

- `color.text` x1, `color.textMuted` x1

Tailwind default classes (no token): `gap-2`, `px-6`, `py-8`, `text-base`, `font-semibold`, `text-sm`, `max-w-sm`, `mb-2`, `mt-3`, `leading-6`, `leading-5`, `text-center`.

### Unverified

- UNVERIFIED: How `role="heading"` with `aria-level` is exposed on iOS and Android: the file's own comment says native announces a heading without a level.

## Variants

none.

## States

Static. The exit control is a `Button` with its own states.

### Motion

none in source.

### Platform notes

none in source.

## A11y

- Contrast: text-text and text-text-muted on the page surface 17.79/13.83:1 / 6.16/7.14:1.
- Keyboard and focus: Action is a Button (see Button).
- Touch target: Action Button: see Button. Android 48dp: below (F08).
- Screen reader: Title role=heading with aria-level on web (:61). The art slot is caller-owned (comment :28). accessibilityHint is forwarded to the action.
- Motion: None.
- Review status: **PASS**. Heading semantics and passing text contrast.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=EmptyState
import { EmptyState } from "@nyc-tron/ui/components/feedback/EmptyState";

export function NoLayers({ add }: { add: () => void }) {
  return (
    <EmptyState
      title="No layers yet"
      description="Add a layer from the toolbar."
      titleLevel={3}
      exitAction={{ title: "Add layer", onPress: add, accessibilityHint: "Creates an empty layer" }}
    />
  );
}
```

## Do/Don't

### Do

- Set `titleLevel` to match the page outline, since it is passed as `aria-level` and defaults to 2.
- Use `exitAction` for a single secondary escape, because it renders a `Button variant="secondary"` with an optional `accessibilityHint`.
- Pass `illustration` when you have art, since `icon` is ignored when it is given.

### Don't

- Do not pass both `action` and `exitAction` expecting two buttons, because `action` takes precedence.
- Do not pass `tone` expecting a visual change, because it is accepted and discarded.
- Do not treat the heading level as verified on native, because the page marks `role="heading"` with `aria-level` exposure UNVERIFIED.
