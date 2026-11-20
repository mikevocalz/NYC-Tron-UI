---
name: "PanResponderDrag"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/gestures/PanResponderDrag"
tier: 1
docs: "handwritten"
platforms: []
category: "primitive"
tokens: []
registryDependencies: []
a11yStatus: "reviewed-pass"
---

# PanResponderDrag

## Purpose

Single-touch drag transport on React Native PanResponder, no gesture-handler dependency, for React Native and web.

## Install

- Package: @nyc-tron/ui
- Import: `import { PanResponderDrag } from "@nyc-tron/ui/components/gestures/PanResponderDrag";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/gestures/PanResponderDrag
```

### Dependencies

- `react`: `cloneElement`, `useMemo`, `useRef`.
- `react-native`: `PanResponder`.
- `./drag-transport.ts` (types), `./pan-responder-config.ts` (`panResponderDragConfig`).
- Alternative transport named in the comment: `GestureHandlerDrag` (uses `react-native-gesture-handler`, an optional peer); not imported here.

## Props

Tier-1 reason: R4 imported by 13 files
Import count: 13

`PanResponderDrag(props: DragTransportProps)`. `DragTransportProps` is defined in `gestures/drag-transport.ts`.

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| children | ReactElement | none | yes | One host view; the responder's `panHandlers` are merged into it with `cloneElement`. |
| disabled | boolean | none | no | When truthy, `onStartShouldSetPanResponder` returns false. |
| onBegin | (point: DragPoint) => void | none | yes | On grant. |
| onMove | (point: DragPoint, touches: number) => void | none | yes | `touches` is `numberActiveTouches`. |
| onRelease | (point: DragPoint) => void | none | yes |  |
| onCancel | () => void | none | yes | On termination, or when a start event has other than one touch. |

`DragPoint`: `x: number`, `y: number`, taken from `nativeEvent.pageX` and `pageY`.

### Tokens

`node tokenuse.mjs` output: none.

### Unverified

- UNVERIFIED: how React Native Web and each native platform deliver `pageX` and `pageY` and `numberActiveTouches`; no runtime was run.
- UNVERIFIED: whether `cloneElement` with `panHandlers` replaces responder handlers already set on the child; React's merge rule is not source in this repo.

## Variants

none

## States

| State | How it is set | What the code does |
|---|---|---|
| `disabled` | derived in code | `disabled` stops a drag from starting (it is read at event time through a `latest` ref). |
| `single touch required` | derived in code | a drag starts only when `touches.length === 1`; a start event with a different count calls `onCancel`. |
| `granted drag` | derived in code | `onPanResponderTerminationRequest` always returns false, so a parent responder cannot take it. |

No visual states; the component renders only its child.

### Motion

none in source

### Platform notes

none in source. The doc comment says it works on web and native without an extra dependency and that apps already mounting `GestureHandlerRootView` should prefer `GestureHandlerDrag`.

## A11y

- Contrast: Renders no visuals.
- Keyboard and focus: Adds responder handlers to its child; not focusable.
- Touch target: Not a control.
- Screen reader: None needed; clones the child with pan handlers.
- Motion: None.
- Review status: **PASS**. Transport with no UI; the child owns accessibility (see DragGrabHandle, PaneSplitter).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=PanResponderDrag
import { View } from "react-native";
import { PanResponderDrag } from "@nyc-tron/ui/components/gestures/PanResponderDrag";

export const Example = () => (
  <PanResponderDrag
    onBegin={point => console.log("begin", point.x, point.y)}
    onMove={(point, touches) => console.log(point.x, point.y, touches)}
    onRelease={point => console.log("release", point.x, point.y)}
    onCancel={() => console.log("cancel")}>
    <View style={{ width: 48, height: 48 }} />
  </PanResponderDrag>
);
```

## Do/Don't

### Do

- Pass exactly one host view as `children`, since the pan handlers are merged into it with `cloneElement`.
- Handle `onCancel` to clear state, because it fires on termination or when a start event has other than one touch.
- Set `disabled` to block drags, since it is read at event time and makes `onStartShouldSetPanResponder` return false.

### Don't

- Do not expect a parent responder to take over a drag, because `onPanResponderTerminationRequest` always returns false once granted.
- Do not assume `cloneElement` replaces responder handlers already set on the child, because the page marks that UNVERIFIED.
- Do not rely on `pageX` and `pageY` values matching across platforms, because delivery is UNVERIFIED.
