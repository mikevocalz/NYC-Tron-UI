---
name: "TextField"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/TextField"
tier: 1
docs: "handwritten"
platforms: []
category: "input"
tokens: ["color.border", "color.danger", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "reviewed-fail"
---

# TextField

## Purpose

Labeled TextInput with helper text, error text, start adornment and error border state, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { TextField } from "@nyc-tron/ui/components/TextField";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/TextField
```

### Dependencies

- `joinClasses` from `./styles.ts`.
- react-native (peer, required): TextInput, Text, View.
- No optional peers.

## Props

Extends `TextInputProps`. Read or overridden from the inherited set: `editable` (default `true`), `accessibilityState` (merged, `disabled` set from `editable`). All other props are spread onto the TextInput. `accessibilityLabel`, `accessibilityLabelledBy` and `accessibilityHint` are set after the spread and override caller values.

Extends: `TextInputProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `id` | `string` | none | yes | Label nativeID is `id + "-label"`. |
| `label` | `string` | none | yes | Rendered text, and the TextInput accessibilityLabel. |
| `helperText` | `string` | none | no | Shown below when no `errorText`. |
| `errorText` | `string` | none | no | Replaces helperText, border becomes `border-danger`. |
| `startAdornment` | `ReactNode` | none | no | Rendered before the input inside the border box. |
| `className` | `string` | none | no | Outer View. |
| `inputClassName` | `string` | none | no | TextInput. |
| `labelClassName` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |
| `ref` | `Ref<ComponentRef<typeof TextInput>>` | none | no | Forwarded to the TextInput. |

### Tokens

- `color.text`: `text-text` x2
- `color.border` x2, `color.danger` x3, `color.surfaceSunken` x1, `color.textMuted` x1
- `radius.control` x1

Tailwind default classes (no token): `gap-2` x2, `text-sm` x3, `font-semibold`, `border` x8, `min-h-12`, `px-3`, `opacity-50`, `min-h-11`, `text-base`.

### Unverified

- UNVERIFIED: How a screen reader reads `accessibilityLabelledBy` against `nativeID` on each platform: a native primitive behaviour not shown in this file.

## Variants

none.

## States

| State | How it is set | What the code does |
|---|---|---|
| `default` | derived in code | `border-border`. |
| `error` | derived in code | `errorText` set; border `border-danger`, error Text has `accessibilityRole="alert"` and `accessibilityLiveRegion="polite"`, hint becomes `errorText`. |
| `disabled` | derived in code | `editable={false}`; `opacity-50` on the border box, `accessibilityState.disabled`. |
| `helper` | derived in code | `helperText` shown in `text-text-muted`. |
| `focus, hover, pressed` | derived in code | no code. |

### Motion

none in source.

### Platform notes

none in source.

## A11y

- Contrast: Field bg-surface-sunken with border-border 1.42/1.75:1 (F03); error border-danger and text-danger 5.91/8.01:1; label text-text 17.79/13.83:1; helper text-text-muted 6.16/7.14:1.
- Keyboard and focus: Native input; no focus style on the field wrapper in this file (the platform caret or outline applies) (GU1). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Wrapper min-h-12 (:31, 48) passes both; input min-h-11 (:43).
- Screen reader: Label Text with nativeID, input accessibilityLabel, accessibilityLabelledBy, hint = error else helper, disabled state; error role alert with a polite live region (:36-46).
- Motion: None.
- Review status: **FAIL**. Field boundary 1.42/1.75:1 (1.4.11).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=TextField
import { useState } from "react";
import { TextField } from "@nyc-tron/ui/components/TextField";

export function NameField() {
  const [name, setName] = useState("");
  return (
    <TextField
      id="doc-name"
      label="Document name"
      helperText="Shown in the title bar."
      errorText={name.length > 40 ? "Use 40 characters or fewer." : undefined}
      value={name}
      onChangeText={setName}
    />
  );
}
```

## Do/Don't

### Do

- Pass a unique `id` and `label`; the label `nativeID` is `id + "-label"` and `label` is the input's `accessibilityLabel`.
- Use `errorText` for validation; it replaces `helperText`, turns the border `border-danger` and announces as an alert.
- Use `startAdornment` for a leading icon inside the border box.

### Don't

- Do not rely on the field border alone; `border-border` on `bg-surface-sunken` is 1.42/1.75:1 (F03) and the status is FAIL.
- Do not expect a focus style; the file adds none and the platform caret or outline applies (GU1).
- Do not assume `accessibilityLabelledBy` reads the same on every platform; that is UNVERIFIED.
