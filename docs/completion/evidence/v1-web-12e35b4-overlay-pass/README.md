# Rendered web overlays: 12e35b4 Chromium pass

[Run 42958884313](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42958884313), job [130320428962](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42958884313/job/130320428962), completed successfully. The complete original log reports **32 passed (13.9s)**, with 32 individually identified successful cases and no failed or skipped cases.

## Exact tested source

The job checked out PR merge `96e7558fbb859a2430b0f192bb5f11e940229cfa`, confirmed by checkout and `git log -1 --format=%H`. Its tree is `d4352a6aba7cca7a9b898b6c25c9e4a5d729587d`, matching helper `12e35b48f75408ac4da4f8130853148ef00a5881`. The merge's ordered parents are `0edd5f302e99877191ba9a412c5c060571a5f6c9` and that helper. The complete, untruncated 2,048-leaf helper tree and all 284 directory object hashes, including its root, were independently verified during source review; the fresh merge record points to that same tree.

The browser fixture remains `packages/expo-controls/tests/browser/server.mjs`, blob `2687299e55689f6fca67d7a8904eb85923d2aaa9`. The workflow remains `.github/workflows/menu-browser.yml`, blob `2dc4658620b43618b48f284626474ea7eb3fc02c`. Both match the prior 5340 helper; this receipt introduces no browser-source or alias correction.

## Observed results

The original log records:

- **20 rendering cases** covering popover, command, palette, tooltip and trigger-popover surfaces in light/dark phone/tablet layouts.
- **12 interaction cases** covering menu keyboard/pointer behavior, disabled actions, focus containment/restoration, command-palette behavior, tooltip focus/dismissal and trigger-popover anchoring.
- Successful normal PNG artifact upload. The separate failure-only artifact step was skipped.

These are rendered-browser results for the exact source above. The new native activation timing observations and verifier projection are not exercised by this workflow. This receipt establishes no native AppKit tooltip, startup, NSDraggingSession, physical-device or distribution acceptance. The native run and final frozen combined candidate require their own results.

## Complete log and artifact boundary

The [complete original browser log](browser-job.log) was independently retrieved and hashed without trimming, newline normalization or ANSI removal:

- **43,806 UTF-8 bytes**; returned string length **40,972**.
- SHA-256 `410bc696cbf7df387935e13786898ae9ec59789c7c0dd03da62f5cbb1be9d177`.
- Git blob `af5ffa9eb25157c251fd15de5fcb53101256902c`.

[Provenance](provenance.json) binds the exact log, checkout, test counts and artifact observations. [Workflow metadata](workflow-metadata.json) is an explicitly normalized completed run/job/artifact record.

The upload log reports **20 files** in artifact **13828491988**, `overlay-renders`, with final ZIP size **280,598 bytes** and SHA-256:

`9b4f3f7049772daccafd7549a63f3973d44507ae983b617be21533c06fce9ea6`

GitHub artifact metadata reports the same size and digest. The original ZIP and PNG bytes remain **unextracted and unviewed** here. The artifact size/digest are producer/API-reported, not an independently recomputed ZIP hash. No manual screenshot inspection or pixel comparison beyond the actual logged suite is claimed.
