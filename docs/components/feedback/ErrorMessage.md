---
name: "ErrorMessage"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/feedback/ErrorMessage"
tier: 1
docs: "handwritten"
platforms: []
category: "feedback"
tokens: ["color.danger"]
registryDependencies: []
a11yStatus: "reviewed-pass"
---

# ErrorMessage

## Purpose

Inline error text with a danger glyph, announced as an alert; renders nothing when the message is empty, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { ErrorMessage } from "@nyc-tron/ui/feedback/ErrorMessage";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/feedback/ErrorMessage
```

### Dependencies

- `StatusGlyph` from `./glyphs.tsx`; `joinClasses`.
- react-native (peer, required): Text, View.
- No optional peers.

## Props

`ErrorMessageProps` extends `Omit<ViewProps,"children">`. Returns `null` when `message` is falsy.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `message` | `string` | none | no | Nothing renders without it. |
| `surface` | `"page" \| "night"` | none | no | Accepted and discarded (`_surface`). |
| `className` | `string` | none | no |  |
| `messageClassName` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

### Tokens

- `color.danger`: `text-danger` x1
- `StatusGlyph` in glyphs.tsx adds `bg-danger border-danger` (separate file, not counted).

Tailwind default classes (no token): `gap-2`, `min-w-0`, `text-sm`, `leading-5`, `pt-px`.

### Unverified

- UNVERIFIED: Whether a live region on a Text mounted with the message is announced on first render: platform behaviour, not shown by code.

## Variants

none.

## States

| State | How it is set | What the code does |
|---|---|---|
| `error` | derived in code | any non-empty `message`; Text `role="alert"`, `accessibilityLiveRegion="polite"`, `text-danger`, leading `StatusGlyph tone="danger"`. |
| `empty` | derived in code | no message returns `null`. |

### Motion

none in source.

### Platform notes

none in source.

## A11y

- Contrast: text-danger on raised 6.57/7.24:1, on sunken 5.91/8.01:1. The "!" mark is not the only signal, the text is.
- Keyboard and focus: Static.
- Touch target: Not interactive.
- Screen reader: Text role=alert with accessibilityLiveRegion polite (:33). Both are set, so assertive (alert) and polite differ by platform; neither drops the message.
- Motion: None.
- Review status: **PASS**. Announced as an alert, contrast above 4.5:1.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=ErrorMessage
import { ErrorMessage } from "@nyc-tron/ui/components/feedback/ErrorMessage";

export function FormError({ message }: { message?: string }) {
  return <ErrorMessage message={message} surface="page" />;
}
```

## Do/Don't

### Do

- Pass `message` only when an error exists, because a falsy value returns `null` and renders nothing.
- Rely on the built-in `role="alert"` with `text-danger` at 6.57:1, since the text carries the signal and the glyph is not the only cue.

### Don't

- Do not pass `surface` expecting a theme change, because it is accepted and discarded.
- Do not claim the `message` is announced on first mount, because the page marks live region behaviour for a Text mounted with it as UNVERIFIED.
