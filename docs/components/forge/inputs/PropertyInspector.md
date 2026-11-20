---
name: "PropertyInspector"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/inputs/PropertyInspector"
tier: 1
docs: "handwritten"
platforms: []
category: "forge"
tokens: ["color.border", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/shell/UnitInput"]
a11yStatus: "reviewed-fail"
---

# PropertyInspector

## Purpose

Form built from a field list of number, choice, boolean and text properties, committing one change at a time, for React Native.

## Install

- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/shell/UnitInput

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/inputs/PropertyInspector
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { PropertyInspector } from "@/components/nyc-tron/ui/components/forge/inputs/PropertyInspector";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { PropertyInspector } from "@nyc-tron/ui/components/forge/inputs/PropertyInspector";`

### Dependencies

- `../../shell/UnitInput.tsx`, `../../Select.tsx`, `../../Button.tsx`, `../../feedback/ErrorMessage.tsx`, `../../gestures/editor-interaction-scope.ts`, `./useScopedControl.ts` (which uses `../../shell/useOwnedAction.ts`).
- External: `react`, `react-native`, `zustand`, `zustand/vanilla` (optional peer).

## Props

Exports: `PropertyInspector`, `PropertyInspectorProps`, `InspectorProperty`, `PropertyValue`, `validateInspectorFields`.

`PropertyInspectorProps` extends `Omit<ViewProps,"children">` and `ScopedControlProps` (`scope?`, `revision?`, `disabledReason?`). `style` is appended after `{gap:10,minWidth:0}`; `accessibilityLabel` is set to `label` after the spread.

Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | none | yes | Non-blank, at most 1024 characters. Header text and accessible name. |
| `fields` | `readonly InspectorProperty[]` | none | yes | Up to 128, unique ids. |
| `onCommit` | `(id: string, value: PropertyValue, signal?: AbortSignal) => unknown` | none | yes |  |
| `unstyled` | `boolean` | `false` | no |  |

### Inherited props this component reads

Documented by hand from the source. They come from the extended type, so they are not in the table above.

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| scope | `string` | `'property-inspector'` | no | Non-blank, at most 512. |
| revision | `string \| number` | `0` | no |  |
| disabledReason | `string` | none | no | Disables every field and shows the text as an error. |

`PropertyValue`: `number | string | boolean`.
`InspectorProperty` always has `id`, `label`, `disabledReason?`, plus one of:
| kind | extra fields |
|---|---|
| `'number'` | `value`, `min`, `max`, `step` (required), `unit?`, `integer?` |
| `'choice'` | `value:string`, `choices:readonly {id;label;disabled?}[]` |
| `'boolean'` | `value:boolean` |
| `'text'` | `value:string`, `maxLength:number`, `multiline?:boolean` |

`validateInspectorFields(fields)` throws `RangeError` for more than 128 fields or duplicate ids; blank or over-long ids (256) or labels (1024); a number with non-finite value, min, max or step, `min>=max`, `step<=0`, a value outside the range, or a non-integer when `integer`; a text `maxLength` that is not an integer from 1 to 65536, or a value longer than it; a choice list over 512 entries, duplicate choice ids, or blank or over-long choice ids (512) or labels (1024). The component also rejects a commit value of the wrong type, out of range or not in the enabled choices with `RangeError('Property value is unavailable')`.

### Tokens

- Colour classes: `color.text` 3, `color.textMuted` 1, `color.border` 1. Radius class: `radius.control` 1.
- Literals: `gap: 10` to `space.2.5` (1), `gap: 4` to `space.1` (1), `gap: 6` to `space.1.5` (1), `padding: 8` to `space.2` (1), `minHeight: 44` to `size.touch` (1).
- no token: `minWidth: 0` (1).
- Tailwind default classes (no token): `border` 3, `rounded-control` 1.

### Unverified

- UNVERIFIED: how `Select` renders its options and disabled option; `Select.tsx` was not read.
- UNVERIFIED: abort-signal and pending semantics of `useOwnedAction` and `useScopedControl` beyond what the call sites show.
- UNVERIFIED: that `Button`'s `accessibilityState={{checked}}` is announced as a toggle.

## Variants

Field `kind` picks the control: `number` renders `UnitInput` (label gets ` (unit)` appended, `min`, `max`, `step` forwarded); `choice` renders `Select` (a missing current value is appended as a disabled "Unavailable: <value>" option); `boolean` renders a secondary `Button` titled "<label>: on|off" with `accessibilityState={{checked}}`; `text` renders a `TextInput` and an "Apply <label>" `Button`.

## States

| State | How it is set | What the code does |
|---|---|---|
| `disabled` | derived in code | a pending commit, `disabledReason`, or a field's own `disabledReason` disables that control. A field `disabledReason` also shows under the field in `text-text-muted`. |
| `empty choice list` | derived in code | the `Select` is disabled. |
| `text dirty` | derived in code | the Apply button is disabled until the draft differs from `field.value`. |
| `error` | derived in code | `ErrorMessage` at the bottom shows the commit error or `disabledReason`. |
| `pending` | derived in code | `guard.pending` disables all controls. |
| `hover, focus, pressed` | derived in code | no code here (inherited from children). |

### Motion

none in source.

### Platform notes

none in source. package.json export conditions: `types`, `react-native`, `default`. No `.native`/`.web` siblings.

## A11y

- Contrast: Renders UnitInput, Select, Button, TextInput. Number fields inherit UnitInput's boundary 1.42/1.75:1 (F03).
- Keyboard and focus: Fields are native controls. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Inherits UnitInput 44 and Select 48; multiline TextInput has no minHeight (:43). Android: see parts. Android 48dp: below (F08).
- Screen reader: Root View has accessibilityLabel but no role (:32), so the label is dropped by most screen readers. Header uses accessibilityRole=header; each TextInput has accessibilityLabel (:43).
- Motion: None.
- Review status: **FAIL**. Inherits UnitInput and Select field-boundary failures (F03).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=PropertyInspector
import {PropertyInspector,type InspectorProperty} from "@/components/nyc-tron/ui/components/forge/inputs/PropertyInspector";
const fields:readonly InspectorProperty[]=[
  {id:"w",label:"Width",kind:"number",value:100,min:0,max:1000,step:1,unit:"px"},
  {id:"blend",label:"Blend",kind:"choice",value:"normal",choices:[{id:"normal",label:"Normal"},{id:"multiply",label:"Multiply"}]},
  {id:"vis",label:"Visible",kind:"boolean",value:true},
  {id:"name",label:"Name",kind:"text",value:"Layer 1",maxLength:64},
];
export const Example = () => <PropertyInspector label="Layer properties" scope="layer-1" fields={fields} onCommit={async(_id,_value,_signal)=>{}}/>;
```

## Do/Don't

### Do

- Give every entry in `fields` a unique `id`, since duplicate ids throw and the maximum is 128 fields.
- Set `disabledReason` to explain why editing is locked, because it disables every field and shows the text as an error.
- Set `min`, `max` and `step` on number fields with `min` below `max`, since `validateInspectorFields` rejects anything else.

### Don't

- Do not rely on the root `accessibilityLabel` as the group name, because the root has no role and the review is FAIL (F03).
- Do not pass a number `value` outside `min` and `max`, or a non-integer when `integer` is set, because validation throws a RangeError.
- Do not claim `Button` `accessibilityState` announces as a toggle for boolean fields, because the page marks it UNVERIFIED.
