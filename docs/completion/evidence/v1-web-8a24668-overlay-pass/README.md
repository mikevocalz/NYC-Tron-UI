# Rendered web overlays: 8a24668 Chromium pass

[Run 42964459201](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42964459201), job [130338331501](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42964459201/job/130338331501), completed successfully. The complete original log reports **32 passed (11.9s)**, with 32 individually identified successful cases and no failed or skipped cases.

## Exact tested source

The job checked out PR merge `e72dcda68234a6506dfef07dc18ffd3b8de9f916`, confirmed by checkout and `git log -1 --format=%H`. Its tree is `e2ea092f9d21a0a1e4a87cd9413ed39b0beb314a`, matching helper `8a2466835e14b579002a7fbaa3a240aaaf16e059`. The merge's ordered parents are `0edd5f302e99877191ba9a412c5c060571a5f6c9` and that helper. The complete, untruncated 2,048-leaf helper tree and all 284 directory object hashes, including its root, were independently verified during source review; the fresh merge record points to that same tree.

The browser fixture remains `packages/expo-controls/tests/browser/server.mjs`, blob `2687299e55689f6fca67d7a8904eb85923d2aaa9`. The workflow remains `.github/workflows/menu-browser.yml`, blob `2dc4658620b43618b48f284626474ea7eb3fc02c`. Both match the prior 12e helper; this receipt introduces no browser-source or alias correction.

## Observed results

The original log records:

- **20 rendering cases** covering popover, command, palette, tooltip and trigger-popover surfaces in light/dark phone/tablet layouts.
- **12 interaction cases** covering menu keyboard/pointer behavior, disabled actions, focus containment/restoration, command-palette behavior, tooltip focus/dismissal and trigger-popover anchoring.
- Successful normal PNG artifact upload. The separate failure-only artifact step was skipped.

These are rendered-browser results for the exact source above. The new initial-request startup watchdog and native sampler observation are not exercised by this workflow. This receipt establishes no native AppKit tooltip, startup, NSDraggingSession, physical-device or distribution acceptance. The native run and final frozen combined candidate require their own results.

## Complete log and artifact boundary

The [complete original browser log](browser-job.log) was independently retrieved and hashed without trimming, newline normalization or ANSI removal:

- **43,813 UTF-8 bytes**; returned string length **40,979**.
- SHA-256 `d3c3b3ed1613a1a433999ce0388184d27b5739ad374a3f15ef26e38039d3e2dd`.
- Git blob `585cc66a54fa15565d03a195e9311f55333f8e3a`.

[Provenance](provenance.json) binds the exact log, checkout, test counts and artifact observations. [Workflow metadata](workflow-metadata.json) is an explicitly normalized completed run/job/artifact record.

The upload log reports **20 files** in artifact **13830178996**, `overlay-renders`, with final ZIP size **280,598 bytes** and SHA-256:

`6ce7fd6fe3584bbbca21a88a347d7f0ddfae8ff05ec83d06c1d0c2bc5d0a62e3`

GitHub artifact metadata reports the same size and digest. The original ZIP and PNG bytes remain **unextracted and unviewed** here. The artifact size/digest are producer/API-reported, not an independently recomputed ZIP hash. No manual screenshot inspection or pixel comparison beyond the actual logged suite is claimed.
