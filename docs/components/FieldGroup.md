---
name: "FieldGroup"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/FieldGroup"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "layout"
tokens: ["color.border", "color.surfaceRaised", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "reviewed-pass"
---

# FieldGroup

## Purpose

Form layout wrapper with titled sections and footer text, exposed as FieldGroup.Section, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { FieldGroup } from "@nyc-tron/ui/FieldGroup";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/FieldGroup
```

### Dependencies

- `joinClasses` from `./styles.ts`.
- react-native (peer, required): Platform, Text, View.
- No optional peers.

## Props

`FieldGroup` extends `Omit<ViewProps,"children">`. It is `Object.assign(FieldGroupRoot,{Section:FieldSection})`, and `FieldSection` is also a named export.

`FieldGroupProps`:

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | none | no |  |
| `className` | `string` | none | no | Root classes `w-full min-w-0 gap-4` come first. |

`FieldSectionProps` extends `Omit<ViewProps,"children"|"role">`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| title | `string` | none | no | Header Text (accessibilityRole header; web `aria-level` 3) and the group's `aria-label`. |
| footer | `string` | none | no | Text under the body. |
| children | `ReactNode` | none | no |  |
| titleUppercase | `boolean` | `false` | no | Adds `uppercase tracking-wide`. |
| className | `string` | none | no |  |
| titleClassName | `string` | none | no |  |
| bodyClassName | `string` | none | no |  |
| unstyled | `boolean` | `false` | no |  |

### Tokens

- `color.border` x2, `color.surfaceRaised` x1, `color.text` x1, `color.textMuted` x1
- `radius.control` x1

Tailwind default classes (no token): `min-w-0` x2, `gap-4`, `border` x6, `px-3` x2, `py-2`, `text-sm` x2, `font-semibold`, `gap-3`, `p-3`.

### Unverified

- UNVERIFIED: Screen reader announcement of `role="group"` with `aria-label` on native: the doc comment states it, the file does not prove it.

## Variants

none.

## States

Static layout. No interactive states in code.

### Motion

none in source.

### Platform notes

- `Platform.OS==="web"` adds `aria-level: 3` to the section title.

## A11y

- Contrast: Title text-text and helper text-text-muted on raised 17.79/13.83:1 / 6.16/7.14:1; group border 1.58/1.58:1, decorative.
- Keyboard and focus: Static.
- Touch target: Not interactive.
- Screen reader: FieldSection role=group with aria-label=title (:36); title accessibilityRole=header with aria-level 3 on web (:40).
- Motion: None.
- Review status: **PASS**. Grouping and heading semantics present.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=FieldGroup
import { useState } from "react";
import { FieldGroup } from "@nyc-tron/ui/components/FieldGroup";
import { TextField } from "@nyc-tron/ui/components/TextField";

export function DocumentDetails() {
  const [title, setTitle] = useState("");
  return (
    <FieldGroup>
      <FieldGroup.Section title="Document details" footer="Visible to collaborators." titleUppercase>
        <TextField id="title" label="Title" value={title} onChangeText={setTitle} />
      </FieldGroup.Section>
    </FieldGroup>
  );
}
```

## Do/Don't

### Do

- Use `FieldGroup.Section` with a `title`, since it sets both the header text and the group `aria-label`.
- Pass `footer` for helper text under the body, which keeps it in the same labelled group.
- Set `titleUppercase` for compact section headers, which adds `uppercase tracking-wide`.

### Don't

- Do not put interactive state expectations on `FieldGroup`, because it is static layout with no focus or pressed code.
- Do not claim native screen readers announce the group name, because the page marks `role="group"` with `aria-label` UNVERIFIED.
