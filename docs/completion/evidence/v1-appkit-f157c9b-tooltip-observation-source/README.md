# AppKit tooltip failure summary: reviewed source checkpoint

Helper `f157c9bf207f8ceae890e299f9667b56ab78360d`, tree `ac12abeb27d91dcb978492d9aad187c4f198e3b5`, carries the reviewed failure reporter and the existing browser source-alias correction. The actual PR merge is `6d6b913c771e49385e5a57c9737b66fbeb07a9a7`, with ordered parents `0edd5f302e99877191ba9a412c5c060571a5f6c9` and `f157c9bf207f8ceae890e299f9667b56ab78360d`. All 2,048 leaves and the commit/tree identities were independently verified.

This is a **source-review checkpoint**. [Native run 42938338972](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42938338972) and [rendered-overlay run 42938339031](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42938339031) were newly started at publication; their actual outcomes are recorded separately. Source approval and V8 checks do not establish native hover or Node filesystem execution.

## Why this change is needed

The [3891 native result](../v1-appkit-3891ee1-tooltip-hover-failure/README.md) reached the strict tooltip wait and timed out. Its console message could not distinguish actual cursor arrival, a cleared pointer-sequence flag and a matching visible AXHelpTag. The existing original `tooltip-hover.json` retains those observations, but its artifact bytes could not be extracted in the unavailable local workspace.

The new failure-only reporter reads that already-retained JSON after the existing failure write. A fixed console envelope identifies the actual source revision and app PID, and the original file's exact byte count and SHA256. It emits selected observations with explicit limits and omission counts. It never rewrites the original file.

## Reviewed limits and behavior

- Read at most 1 MiB plus one overflow-detection byte. An over-limit file has no partial-file hash presented as a complete-file hash.
- Keep the complete console envelope, including markers and newlines, within 16 KiB.
- Preserve unknown Boolean/number observations as null; keep observed false and observed empty arrays distinct from unavailable values.
- Retain pointer-request geometry, cursor readback, the pointer-sequence flag, owner/permission fields, matching-tag predicates and bounded window-role observations.
- Inspect at most 128 tags; retain at most eight tag records, twelve windows and twelve role values per window. Full counts remain unknown if the inspected subset cannot establish them.
- Exclude arbitrary tooltip strings, native class strings, paths and original error/reason strings.
- Keep read, parse, close and console-reporting errors secondary to the original failed assertion.

The pointer-sequence flag is not an OS-delivery acknowledgment. No derived field declares native hover passed. The existing original evidence writes, actual native commands, permission handling, twenty-second hover deadline, strict assertions, cleanup and passed-only distribution gates remain unchanged.

## Exact source and review

The verifier is `examples/macos-appkit/spark/verify-native.mjs`, blob `deeedf41711c84dbcca0029104e5ea03e6b55a2c`, 51,641 UTF-8 bytes, SHA256 `c040f762b84d36a16a95359353ddc6b87a2b8386fc42a5406a9280a48cfb5e75`. Removing only the added import, two reporting functions and failure-catch call restores preimage `35414d7cd7e91e907698ea68538c7ec9de1913c2` byte-for-byte.

The author, root and independent reviewer checked the exact complete blob and inverse change. In-memory V8 selector and IO-adapter checks cover privacy, unknown/false semantics, empty/missing observations, caps, original-byte hashing, oversized/malformed reads and secondary reporting failures. These are source/adapter checks; no local Node filesystem or AppKit execution is claimed. Root also inspected the pinned Node v24.19.0 console implementation's synchronous and asynchronous error handling.

The helper's second change is the exact already-reviewed alias blob `2687299e55689f6fca67d7a8904eb85923d2aaa9` in `packages/expo-controls/tests/browser/server.mjs`. It adds only the core overlay source alias and reverses to the complete old helper bytes. The aggregate already has that alias. The [original browser failure](../v1-web-3891ee1-overlay-alias-failure/README.md) remains separately retained; a new rendered result is required for this helper.

No native tooltip production correction is claimed from these diagnostics. The missing condition and any next source correction must follow the actual new run's evidence.
