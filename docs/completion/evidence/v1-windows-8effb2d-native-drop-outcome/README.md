# Windows OS drag starts; rejected-drop result is missing

[Run 42906047583](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42906047583)
passed source/codegen/API/package gates, installed native library and consumer
compilation, and deployment. The prior native overlay, rapid-edit and strict
inspector-remount assertions passed. The corrected composable peer owner is now
verified by the actual native compiler.

The first OS-injected gesture passed the strict `Native drag phase: dragging`
assertion. All 24 checked pointer moves reached the owned document target, the
button-up insertion succeeded, and `Completed native drags: 1` appeared. The
next assertion failed: the required `Native drag result: none/rejected` never
appeared. The original final tree and screenshot instead show `none/cancelled`,
zero authorized transfers and the document still owned by main. Accepted move
and explicit cancellation cases were not reached.

## Original pointer and process evidence

`drag-input-01.json` retains three stable endpoint observations, before/after
button down, threshold crossing and arrival over the target. The source is a
native `Custom` / `NYCTronDragRegion`, enabled and keyboard-focusable, at
`72,311,260,56`. The target has the same native class at `596,212,260,56`. The
observed cursor starts at `202,339`, crosses the start threshold at `226,339`,
and reaches `726,240` with the button still held. The native hit root there is
the owned document HWND `131602` in PID `6600`. Main HWND `458890` and the process
remain alive after failure, with 51 final descendants and zero matched crash
events.

The unavailable UIA DragPattern is retained as unavailable, not interpreted as
CanDrag=false. The original receipt contains no native target-event, extracted
nonce or broker-offer trace. It therefore does not establish why a rejected drop
was not reported. No acceptance assertion or transfer policy is weakened.

## Retention and identity

The PR head is `8effb2dbe2573c96032b20a835a517ce0d52df9c`; the actual checkout is
`34729eaa4989ccd6385c0da2ba4a36f08d31794c`. Their exact tree
`881b48d08c90ad42921953169a639c7af782c962` and merge parents were independently
verified. `checkout.json` records those identities.

Artifact `13805133393` retains all 317,911 original ZIP bytes at SHA-256
`643ac530442e18498e30fae0ce221a5c8e62f531d6fbdbb71dbeca3d612f4122`.
All 22 unique members were independently checked against the ZIP and original
extraction and are also retained directly, without CRLF/BOM/image changes.
`artifact-files.json` records every member's size and SHA-256.

The complete native job log is 315,152 bytes with SHA-256
`afe35185ccb7b8e0e7f243fb8526292b53b4fbc3af5e6400ba8eb233b42c854c`
and was independently compared to a separate connector retrieval. Complete
workflow job/artifact snapshots are retained. The full native gate failed and
produced no tested Windows distribution. OS-injected pointer evidence does not
establish physical-device or assistive-technology speech acceptance.
