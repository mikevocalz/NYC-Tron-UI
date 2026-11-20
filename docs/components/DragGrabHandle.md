---
name: "DragGrabHandle"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/DragGrabHandle"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "primitive"
tokens: ["color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/gestures/PanResponderDrag"]
a11yStatus: "unverified"
---

# DragGrabHandle

## Purpose

Three-bar drag handle, 44 by 44 minimum, reporting start, move, commit and cancel through a pluggable transport, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { DragGrabHandle } from "@nyc-tron/ui/components/DragGrabHandle";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/gestures/PanResponderDrag

```sh
npx shadcn@latest add @nyc-tron/DragGrabHandle
```

### Dependencies

- `createDragController` and `DragController` from `./gestures/drag-controller.ts`; `keyboardKey`, `DragPoint`, `DragTransport`, `KeyEventLike` from `./gestures/drag-transport.ts`; `PanResponderDrag` from `./gestures/PanResponderDrag.tsx`.
- `joinClasses`.
- react-native (peer, required): Platform, View, PanResponder (inside PanResponderDrag).
- `GestureHandlerDrag` (react-native-gesture-handler, optional peer) is not imported here; it is only a value a caller may pass as `transport`.

## Props

`DragGrabHandleProps` extends `Omit<ViewProps,"children"|"accessibilityLabel">`. `style` is merged after the built-in min size, opacity and `userSelect`.

Extends: `Omit<ViewProps, "children" | "accessibilityLabel">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | none | yes | Sets `accessibilityLabel`. |
| `disabled` | `boolean` | `false` | no | Opacity 0.4, `aria-disabled`. Read on every drag transition. |
| `onStart` | `() => void` | none | yes | A drag began. |
| `onMove` | `(point: DragPoint) => void` | none | yes | Preview only; single pointer. |
| `onCommit` | `() => void` | none | yes | Once per completed drag. |
| `onCancel` | `() => void` | none | yes | Escape, termination, a second pointer or becoming disabled. |
| `transport` | `DragTransport` | `PanResponderDrag` | no | Pointer recogniser component. |
| `color` | `string` | none | no | Sets `borderColor` of the grip bars. |
| `children` | `ReactNode` | none | no | Replaces the three-bar grip. |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no | Removes `rounded-control` and the `border-text-muted` bar class. |

`DragPoint` (re-exported from gestures/drag-transport.ts):

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| x | `number` | none | yes | Page (web) or absolute window (native) coordinates. |
| y | `number` | none | yes |  |

### Tokens

- `color.textMuted`: `border-text-muted` x1
- `radius.control` x1
- `size.touch`: `minWidth: 44`, `minHeight: 44`
- `space.0.75`: `gap: 3` x1
- `border.2`: `borderTopWidth: 2` x1
- `opacity.0_4`: `opacity 0.4` x1
- Inline bar width 16 and height 0: no token.

Tailwind default classes (no token): `border` x1, `rounded-control` x1.

### Unverified

- UNVERIFIED: Whether Escape reaches `onKeyDown` while the pointer is down depends on web focus behaviour described in a source comment, not shown by code.
- UNVERIFIED: Gesture recognition itself (touch slop, multi-touch counting) lives in gestures/pan-responder-config.ts, which was not read.

## Variants

none.

## States

| State | How it is set | What the code does |
|---|---|---|
| `default` | derived in code | 44x44 minimum, three-bar grip. |
| `disabled` | `disabled` prop | `disabled` prop; opacity 0.4, `aria-disabled`, the controller ignores input. |
| `dragging` | derived in code | handled by the controller (start, move preview, one commit, cancel); no visual change in this file. |
| `cancelled` | derived in code | Escape key (`onKeyDown`), second pointer, unmount, or disabled. |

### Motion

none in source.

### Platform notes

- `Platform.OS==="web"` adds `userSelect:"none"` to the style.
- `focusable={false}`: not a tab stop, per the source comment.

## A11y

- Contrast: Grip dots border-text-muted 6.16/7.14:1 / 5.54/7.9:1 as graphic. Disabled opacity 0.4, exempt.
- Keyboard and focus: focusable={false} (:77), so the handle is not in the tab order. Escape handled by onKeyDown while a web pointer drag is active (:57). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: minWidth and minHeight 44 (:78, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: accessible, accessibilityLabel from label, accessibilityHint "Drag to move. Press Escape to cancel.", aria-disabled. No accessibilityRole and no activation action, so a screen reader user hears a label and hint for something they cannot operate (F14).
- Motion: None.
- Review status: **UNVERIFIED**. Pointer-only control; whether a keyboard or screen-reader alternative exists depends on the host (AdaptiveDock supplies a menu).
  - UNVERIFIED: Keyboard and screen-reader alternative to dragging (F14). Test: With AdaptiveDock, move a floating panel using only keyboard, then only VoiceOver or NVDA, and confirm every dock target is reachable.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=DragGrabHandle
import { DragGrabHandle } from "@nyc-tron/ui/components/DragGrabHandle";

export function LayerHandle() {
  return (
    <DragGrabHandle
      label="Reorder Layer 2"
      onStart={() => {}}
      onMove={(point) => void (point.x + point.y)}
      onCommit={() => {}}
      onCancel={() => {}}
    />
  );
}
```

## Do/Don't

### Do

- Pass a descriptive `label`, since it becomes the `accessibilityLabel` for the only element a screen reader user reaches.
- Handle `onCancel` by discarding the preview, because it fires on Escape, termination, a second pointer or when the handle becomes `disabled`.
- Use `onMove` for preview only and apply the change in `onCommit`, which runs once per completed drag.

### Don't

- Do not ship `DragGrabHandle` as the only way to move something, because it has no activation action and screen reader users hear a hint for a control they cannot operate (F14).
- Do not assume Escape cancels a web drag reliably, because the page marks Escape reaching `onKeyDown` as UNVERIFIED.
- Do not expect it in the tab order, because `focusable` is false in the source.
