---
name: "NightScope"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/theme/NightScope"
tier: 1
docs: "handwritten"
platforms: []
category: "primitive"
tokens: []
registryDependencies: []
a11yStatus: "reviewed-pass"
---

# NightScope

## Purpose

Wrapper that applies a named Uniwind theme scheme to its subtree, for React Native and web.

## Install

- Package: @nyc-tron/ui
- Import: `import { NightScope } from "@nyc-tron/ui/theme/NightScope";`
- Peers: react, react-native, uniwind
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/theme/NightScope
```

### Dependencies

- `uniwind`: `ScopedTheme`. Optional peer, `>=1.12.2 <2`.
- `react`: `ReactNode` (type).

## Props

Tier-1 reason: R2 core family (theme)
Import count: 0

`NightScopeProps` (own interface).

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | none | yes |  |
| `scheme` | `string` | "dark" | no | Uniwind theme name; cast with `as never` because `ThemeName` comes from the app's generated types. |

### Tokens

`node tokenuse.mjs` output: none. The file has no literals or token classes.

### Unverified

- UNVERIFIED: what `ScopedTheme` renders and how it resolves variables on each platform; it lives in `uniwind`, which was not read, so the doc-comment description is unconfirmed.
- UNVERIFIED: whether the app's theme CSS scopes the class on web; that depends on the consumer.

## Variants

none. `scheme` is a free string.

## States

none. A pure wrapper around `ScopedTheme`.

### Motion

none in source

### Platform notes

Only the doc comment: on native, `ScopedTheme` resolves the theme variables for the subtree; on web it wraps the subtree in a `display: contents` element carrying the theme's class, which the app's theme CSS must scope (for example `.dark { --color-...: ... }`). The file has no `Platform.OS` check or sibling file.

## A11y

- Contrast: Wraps children in a ScopedTheme so tokens resolve at the dark values; the dark pairs in the contrast table apply.
- Keyboard and focus: Not interactive.
- Touch target: Not interactive.
- Screen reader: Adds no elements on native; a display: contents wrapper on web.
- Motion: None.
- Review status: **PASS**. Scope provider; dark pairs pass for text.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=NightScope
import { Text } from "react-native";
import { NightScope } from "@nyc-tron/ui/components/theme/NightScope";

export const Example = () => (
  <NightScope scheme="dark">
    <Text>Resolved with the dark theme variables.</Text>
  </NightScope>
);
```

## Do/Don't

### Do

- Pass a theme name your app defines as `scheme`; it defaults to `dark`.
- Wrap only the subtree that needs the scheme, passing it as `children`.
- Scope the theme class in your web CSS, since the `display: contents` wrapper depends on it.

### Don't

- Do not assume `ScopedTheme` resolves variables identically on every platform; that is UNVERIFIED.
- Do not expect `scheme` type checking; it is a free string cast with `as never`.
- Do not treat it as UI; it takes `children` and `scheme` only, has no states and adds no elements on native.
