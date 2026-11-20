---
name: "WorkspacePresetSwitcher"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/WorkspacePresetSwitcher"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "shell"
tokens: ["color.accent", "color.border", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/TextField", "@nyc-tron/shell/MenuButton"]
a11yStatus: "reviewed-fail"
---

# WorkspacePresetSwitcher

## Purpose

Menu to switch, save, rename, duplicate, reset and delete workspace layout presets, with undo delete, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { WorkspacePresetSwitcher } from "@nyc-tron/ui/components/shell/WorkspacePresetSwitcher";`
- Peers: @nyc-tron/core, react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/TextField, @nyc-tron/shell/MenuButton

```sh
npx shadcn@latest add @nyc-tron/shell/WorkspacePresetSwitcher
```

### Dependencies

- `./MenuButton.tsx` (also `CommandMenuItem`), `./workspace-preset-model.ts`, `../Button.tsx`, `../TextField.tsx`, `../forge/announce.ts`, `../overlays/popover-position.ts` (`placePopover`, `Rect2D`), `../styles.ts`.
- External: `react`, `react-native` (`Modal`, `ScrollView`, `Pressable`), `zustand`, `zustand/vanilla` (optional peer).

## Props

Exports: `WorkspacePresetSwitcher`, `WorkspacePresetSwitcherProps`, and the re-exported type `WorkspacePreset`.

`WorkspacePresetSwitcherProps` extends `Omit<ViewProps,"children">`. Rest spread goes to the root `View`; `style` passes through unchanged.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | `"workspace"` | no | Non-empty after trim, at most 256 characters. |
| `disabled` | `boolean` | `false` | no |  |
| `revision` | `string \| number` | `0` | no | Finite number or string up to 512 characters. |
| `presets` | `readonly WorkspacePreset[]` | none | yes | Validated by `validatePresetList`. |
| `activeId` | `string` | none | no | Without a match the trigger reads "Custom layout". |
| `onSelect` | `(id: string) => void` | none | yes |  |
| `onSaveAs` | `(name: string) => void` | none | yes | Name is trimmed. |
| `onRename` | `(id: string, name: string) => void` | none | yes |  |
| `onDuplicate` | `(id: string) => void` | none | yes |  |
| `onDelete` | `(id: string) => void` | none | yes | Called after the confirm dialog. |
| `onReset` | `(id: string) => void` | none | yes |  |
| `recentlyDeleted` | `{ readonly id: string; readonly name: string; }` | none | no | With `onUndoDelete`, shows "Undo delete". |
| `onUndoDelete` | `(id: string) => void` | none | no |  |
| `usableRegions` | `readonly Rect2D[]` | none | no | Falls back to window size for the dialog. |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

`WorkspacePreset`: `id:string`, `name:string`, `builtIn:boolean`, `modified:boolean`, all required. Name rules (`PRESET_NAME_MAX`, duplicate, empty, too-long) are in `workspace-preset-model.ts`; the doc comment says trimmed, unique ignoring case, at most 40 characters.

Throws `RangeError("Invalid workspace preset scope")` for a bad scope or revision.

### Tokens

- Colour classes: `color.text` 4, `color.border` 2, `color.surfaceRaised` 2, `color.textMuted` 2, `color.surfaceSunken` 1, `color.accent` 1. Radius class: `radius.card` 1. The overlay `bg-text/50` string is also in code.
- Literals: `padding: 16` to `space.4` (1), `gap: 8` to `space.2` (2), `marginTop: -4` to `-space.1` (1), `borderRadius: 4` to `radius.4` (1), `borderWidth: 4` to `border.4` (1), `borderRightWidth: 2` and `borderBottomWidth: 2` to `border.2` (1 each).
- no token: dialog max width 420, trigger text max width 160, dot size 8, chevron size 8, menu width 280.
- Tailwind default classes (no token): `gap-1` 1, `gap-2` 1, `px-3` 1, `border` 8, `text-sm` 2, `font-semibold` 3, `gap-4` 1, `p-5` 1, `rounded-card` 1, `text-lg` 2.

### Unverified

- UNVERIFIED: exact name validation messages and limits in `workspace-preset-model.ts` (only the doc comment was relied on).
- UNVERIFIED: `TextField` and `Button` rendering for error and disabled states (other files).
- UNVERIFIED: modal focus trapping and screen reader behaviour of the dialog on each platform.
- UNVERIFIED: whether `bg-text/50` paints; it depends on the consumer's Tailwind configuration for an opacity modifier on a token colour.

## Variants

- Dialog kinds from local state: `"save"`, `"rename"` (name field plus Cancel and Save/Rename buttons) and `"delete"` (confirm text plus Cancel and a `danger` Delete button).
- Menu items per preset: description "Built-in" or "Custom", with ", current" and ", modified".

## States

| State | How it is set | What the code does |
|---|---|---|
| `active preset modified` | derived in code | an 8pt `border-accent` dot after the name; the trigger label adds ", modified". |
| `menu actions` | derived in code | Duplicate disabled when no saved active preset; Rename, Reset, Delete disabled by `presetActions`, each with a description ("Built-in presets keep their names", "Layout already matches the default", "Built-in presets can't be deleted"). Delete is `danger`. |
| `dialog open` | derived in code | a `Modal` with `role="dialog"`, `aria-modal`, `accessibilityViewIsModal`; delete text depends on `onUndoDelete` being given. |
| `name error` | derived in code | after a submit with a problem, `TextField` shows `errorText`; otherwise `helperText` "Up to 40 characters." (from `PRESET_NAME_MAX`). |
| `undo` | derived in code | when `recentlyDeleted` and `onUndoDelete` are both set, a ghost "Undo delete" button shows and `announce()` speaks the deletion once per id. |
| `disabled` | `disabled` prop | `disabled` on the menu trigger and the undo button; all handlers check the committed boundary. |
| `hover on the trigger` | class `hover:bg-surface-sunken` | `hover:bg-surface-sunken`. |

### Motion

`Modal` fade on non-web platforms. No Animated or Reanimated calls. The chevron is a static 45 degree rotation.

### Platform notes

- `Platform.OS==="web"`: `Modal` `animationType` is `"none"` (otherwise `"fade"`); focus returns to the trigger via a zero-delay timeout after a dialog closes or a preset is picked.
- Imported `announce.ts` branches on `qnx` and `marathon`; `MenuButton.tsx` focus-return branches on `qnx` and `marathon`.
- package.json export conditions: `types`, `react-native`, `default`. No `.native`/`.web` siblings.

## A11y

- Contrast: text-text 17.79/13.83:1. Dialog name field is a TextField: boundary 1.42/1.75:1 (F03).
- Keyboard and focus: Dialog: autoFocus on the name field; Modal Escape; MenuButton trigger. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Trigger MenuButton 44; dialog buttons are Buttons. Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: Dialog role=dialog aria-modal with aria-label by kind; headers; deletion announced with an undo button (:104, :177-196).
- Motion: Modal fade on non-web (:178), not tied to reduce motion (F09).
- Review status: **FAIL**. Renders TextField (F03).
  - UNVERIFIED: Initial focus in the delete dialog and focus return after close. Test: Open the delete dialog by keyboard, confirm focus lands inside, close it, confirm focus returns to the trigger.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=WorkspacePresetSwitcher
import {WorkspacePresetSwitcher} from "@nyc-tron/ui/components/shell/WorkspacePresetSwitcher";
export const Example = () => <WorkspacePresetSwitcher scope="doc-1" activeId="edit"
  presets={[{id:"edit",name:"Edit",builtIn:true,modified:true},{id:"mine",name:"My layout",builtIn:false,modified:false}]}
  onSelect={()=>{}} onSaveAs={()=>{}} onRename={()=>{}} onDuplicate={()=>{}} onDelete={()=>{}} onReset={()=>{}}/>;
```

## Do/Don't

### Do

- Pass `activeId` matching a preset so the trigger names it; without a match it reads 'Custom layout'.
- Pass both `recentlyDeleted` and `onUndoDelete` to show the 'Undo delete' button and announce the deletion.
- Keep `scope` non-empty after trim and at most 256 characters.

### Don't

- Do not ship it as accessible yet; the dialog name field is a `TextField` with a 1.42/1.75:1 boundary (F03), so the status is FAIL.
- Do not assume dialog focus handling for the `TextField` name field; initial focus and return after close are UNVERIFIED.
- Do not pass a non-finite `revision`; it throws a `RangeError`.
