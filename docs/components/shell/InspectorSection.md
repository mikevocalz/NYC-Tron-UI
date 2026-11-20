---
name: "InspectorSection"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/InspectorSection"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "shell"
tokens: ["border.1_5", "color.border", "color.focus", "color.surfaceSunken", "color.text", "color.textMuted", "opacity.0_55", "radius.control", "space.1"]
registryDependencies: []
a11yStatus: "reviewed-pass"
---

# InspectorSection

## Purpose

Collapsible inspector group with optional enable switch and reset button, indented by nesting depth, for React Native; web switch colors.

## Install

- Package: @nyc-tron/ui
- Import: `import { InspectorSection } from "@nyc-tron/ui/shell/InspectorSection";`
- Peers: react, react-native, zustand
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/InspectorSection
```

### Dependencies

- `./inspector-context` (`InspectorPanelContext`, `InspectorSectionContext`), `./inspector-model` (`matchingRowCount`), `../styles` (`joinClasses`).
- External: `react`, `react-native` (`Platform`, `Pressable`, `Switch`, `Text`, `View`), `zustand` and `zustand/vanilla` (optional peer).
- Outside an `InspectorPanel` it uses an empty registry, so nothing filters.

## Props

Tier-1 reason: R3 shell core. Import count: 0 (other packages: 0).
Also exported: type `InspectorSectionProps`.

`InspectorSectionProps extends Omit<ViewProps,"children">`. `style` is merged after an optional `{display:"none"}`; the rest spread onto the root `View`, which has `role="group"` and `accessibilityLabel={title}`.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `title` | `string` | none | yes | Nonblank, at most 512 chars, else `RangeError`. |
| `expanded` | `boolean` | none | yes | Controlled. A search with matches inside shows it open without changing it. |
| `onExpandedChange` | `(expanded: boolean) => void` | none | yes |  |
| `enabled` | `boolean` | none | no | Shown as switch value `enabled !== false`. `false` disables every row inside. |
| `onEnabledChange` | `(enabled: boolean) => void` | none | no | Its presence shows the header switch. |
| `onReset` | `() => void` | none | no | Shows the Reset button while `modified` is true. |
| `modified` | `boolean` | `true` when `onReset` is given | no |  |
| `children` | `ReactNode` | none | yes |  |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

### Tokens

| Token | Replaces | Count |
|---|---|---|
| space.1 | `paddingHorizontal: 4`, `gap: 4`, `marginHorizontal: 4` | 3 |
| border.1_5 | `borderRightWidth: 1.5`, `borderBottomWidth: 1.5` | 2 |
| size.touch | `minHeight: 44` (2), `minWidth: 44` (1) | 3 |
| opacity.0_55 | `opacity 0.55` | 1 |
| color.border | `border-border` | 1 |
| color.focus | `ring-focus` | 2 |
| color.textMuted | `text-text-muted`, `border-text-muted` | 3 |
| color.text | `text-text` | 1 |
| color.surfaceSunken | `hover:bg-surface-sunken` | 1 |
| radius.control | `rounded-control` | 2 |

No token: 7 by 7 chevron, 12 per indent level, `paddingBottom: 6`.
Tailwind default classes (no token): `border` 5, `min-h-11` 2, `gap-2` 1, `text-sm` 1, `font-semibold` 1, `min-w-11` 1, `px-2` 1, `text-xs` 1.

### Unverified

- UNVERIFIED: how `PropertyRow` consumes `InspectorSectionContext.disabled` and registers rows; `PropertyRow.tsx` was not read.
- UNVERIFIED: the header switch on iOS and Android, where `Switch` renders natively and its 44 point wrapper is a separate `Pressable` with `accessible={false}`; screen reader focus order was not run.

## Variants

- Nesting depth: from `InspectorSectionContext`; indent is `depth*12` points of leading spacer; only depth 0 gets the `border-b border-border` class.
- `unstyled`: removes classes. With `unstyled=false` on web the switch gets theme colours (`var(--color-primary)`, `var(--color-border)`, `var(--color-surface-raised)`).

## States

| State | How it is set | What the code does |
|---|---|---|
| `expanded` | `expanded` prop | `accessibilityState.expanded` and `aria-expanded` on the header button; chevron rotates 45 or -45 degrees; body uses `display:"flex"` or `"none"`. |
| `disabled (own enabled===false or a disabled parent)` | class `opacity:0.55` | body gets `aria-disabled` and `opacity:0.55`; title uses `text-text-muted`; the switch and Reset are disabled when the parent is disabled. |
| `searching` | class `display:"none"` | with a nonblank panel query, the section opens if it has matches and hides (`display:"none"`, still mounted) if it has none. |
| `modified` | `modified` prop | Reset button shown when `onReset` exists and `modified` is not false; label "Reset <title>". |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | classes `focus-visible:ring-2 focus-visible:ring-focus` on the header and Reset buttons; Reset has `hover:bg-surface-sunken`. |
| `loading, error` | derived in code | no code. |

### Motion

none in source. The chevron rotation is a static transform with no animation.

### Platform notes

- `Platform.OS==="web"`: the switch gets the CSS-variable colours and its wrapper `Pressable` gets `direction:"ltr"` because the RN Web switch thumb uses physical offsets. Native switches keep platform colours.
- Indent uses a leading spacer instead of `paddingStart`, for RN Web RTL.
- Export conditions: `types`, `react-native`, `default`, same file.

## A11y

- Contrast: Title text-text 17.79/13.83:1; Reset text-text-muted 6.16/7.14:1; chevron border-text-muted 6.16/7.14:1; disabled opacity 0.55 exempt.
- Keyboard and focus: Header and Reset: `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:77, :84). The Switch is the platform control; its wrapper is accessible={false}, focusable={false} (:90). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Header row minHeight 44 (:72), toggle min-h-11 (:77), Reset min-h-11 min-w-11 (:84), switch wrapper 44 by 44 (:92, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: role=group labelled by title; toggle button with expanded state and aria-expanded; Switch labelled "Enable {title}" (:68-95).
- Motion: None.
- Review status: **PASS**. Disclosure with expanded state, labelled switch, 44pt targets.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=InspectorSection
import {useState} from "react";
import {Text} from "react-native";
import {InspectorSection} from "@nyc-tron/ui/components/shell/InspectorSection";

export function Example() {
  const [expanded, setExpanded] = useState(true);
  const [enabled, setEnabled] = useState(true);
  return (
    <InspectorSection title="Shadow" expanded={expanded} onExpandedChange={setExpanded}
      enabled={enabled} onEnabledChange={setEnabled} onReset={() => {}} modified>
      <Text>Rows</Text>
    </InspectorSection>
  );
}
```

## Do/Don't

### Do

- Provide `onEnabledChange` only when the section has a toggle, since its presence shows the header switch.
- Pass `onReset` and leave `modified` at its default to show the Reset button.

### Don't

- Don't pass a blank `title` or one over 512 chars; it throws `RangeError`.
- Don't expect a section to unmount during a search; with no matches it gets `display:"none"` but stays mounted.
- Don't assume `PropertyRow` honours `enabled`; how it consumes the disabled context is `UNVERIFIED`.
