# Browser pointer CI follow-up

CI for `e2ab084c6a32ae5e96f4199be6c85bc3beb28c94` exposed one browser pointer
regression in the new narrow-screen acceptance case. The
[native-feel run](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42837676547)
and [web instrument run](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42837676524)
both failed at `pointer-input.spec.mjs:75`: a real touchscreen tap committed
one stroke with no cancellation, but its visible terminal receipt changed from
`touch/up` to `touch/hover-exit`. The instrument run reported 686 passing cases
and this single failing case.

The native-feel artifact `13774638042` was downloaded and verified against its
GitHub SHA-256 digest
`f4fdd3573cc83599f4f31c5eea6c08efcbdfa1ea9f31eb807a6ff0df818602d1`.
Its Playwright trace records the failing receipt. This is a browser result;
it is separate from the iOS, Android and Qt/Fabric lanes.

## Cause and correction

The browser adapter treated every inactive `pointerleave` as a hover exit.
The [Pointer Events 3 recommendation](https://www.w3.org/TR/pointerevents3/#the-pointerup-event)
requires boundary events after release for pointers without hover. A boundary
exit therefore does not establish that this adapter previously observed hover.

`NativePointerInput.web.tsx` now emits `hover-exit` only when its existing
hover map contains that pointer and contact is inactive. A completed touch
keeps its terminal event. Observed mouse or pen hover still exits once, and
captured contact still ignores boundary exits until the contact ends. The
change does not infer hover capability from the pointer type.

The existing browser receipt, viewport and lower-control assertions remain
unchanged. The correction is in the event adapter, with no timeout, retry or
assertion relaxation.

## Focused verification

The new test harness executes the actual web adapter with host refs and event
listeners. Before the correction it reproduced the extra touch hover-exit and
an unobserved mouse/pen leave; both cases failed. After the correction, all
13 pointer adapter/router tests pass. They cover release/cancel boundaries,
observed hover through captured contact, duplicate leave, and blur/unmount
cleanup. These semantic checks do not claim a browser render.

Native-controls typecheck and its package build pass. Its rebuilt archive is
`nyc-tron-native-controls-1.0.0.tgz`, SHA-256
`a18782265e76c3e1cf5a7c8b99820130f46a17914ddd53ae20d2f63462c54ef9`.
All 76 prior archive entries remain. Only the emitted web adapter and its
JavaScript/declaration maps differ; the other twelve reviewed archives remain
byte-identical. The core/UI/Expo-control archives used by the Qt consumer
fixture are unchanged.

A new hosted browser run is required to record the corrected rendered result.
Local browser startup remains blocked by the executor's singleton-socket
restriction, as recorded in the [control validation](control-behavior-2026-11-10.md).
