# Rendered web overlays: 5340 Chromium pass

[Run 42951265312](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42951265312), job [130295860429](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42951265312/job/130295860429), completed successfully. The complete original log reports **32 passed (10.3s)**, with 32 individually identified successful cases and no failed or skipped cases.

## Exact tested source

The job checked out PR merge `32e6234e6f00ff873132f81498d3f78f2488ad8f`, confirmed by checkout and `git log -1 --format=%H`. Its tree is `bc0c0f2d8c96965ed54b429bd5269c4c7081bc64`, matching helper `5340d2d96412d0fcc5dc7cce21ced037d2de5c7b`. The merge's ordered parents are `0edd5f302e99877191ba9a412c5c060571a5f6c9` and that helper. The complete, untruncated 2,048-leaf tree and all 284 directory object hashes, including its root, were independently verified.

The browser fixture remains `packages/expo-controls/tests/browser/server.mjs`, blob `2687299e55689f6fca67d7a8904eb85923d2aaa9`. The workflow remains `.github/workflows/menu-browser.yml`, blob `2dc4658620b43618b48f284626474ea7eb3fc02c`. Both match the prior a685 helper; this receipt introduces no browser-source or alias correction.

## Observed results

The original log records:

- **20 rendering cases** covering popover, command, palette, tooltip and trigger-popover surfaces in light/dark phone/tablet layouts.
- **12 interaction cases** covering menu keyboard/pointer behavior, disabled actions, focus containment/restoration, command-palette behavior, tooltip focus/dismissal and trigger-popover anchoring.
- Successful normal PNG artifact upload. The separate failure-only artifact step was skipped.

These are rendered-browser results for the exact source above. The new native help-tag collector and verifier diagnostics are not exercised by this workflow. This receipt establishes no native AppKit tooltip, startup, NSDraggingSession, physical-device or distribution acceptance. The native run and final frozen combined candidate require their own results.

## Complete log and artifact boundary

The [complete original browser log](browser-job.log) was independently retrieved and hashed without trimming, newline normalization or ANSI removal:

- **43,808 UTF-8 bytes**; returned string length **40,974**.
- SHA-256 `668cd0d6d7a0a6269ffdc689ca3ef821acb0f60e71faa5d7c47d2a168942adf2`.
- Git blob `3429c6d95fa4efbe49ffc7ff96c7c90edc02f624`.

[Provenance](provenance.json) binds the exact log, checkout, test counts and artifact observations. [Workflow metadata](workflow-metadata.json) is an explicitly normalized completed run/job/artifact record.

The upload log reports **20 files** in artifact **13824009318**, `overlay-renders`, with final ZIP size **280,598 bytes** and SHA-256:

`b35096aeebc5f18aebdc1806345c208ccc4e474c4cc5d6309525ea88cf48b938`

GitHub artifact metadata reports the same size and digest. The original ZIP and PNG bytes remain **unextracted and unviewed** here. The artifact size/digest are producer/API-reported, not an independently recomputed ZIP hash. No manual screenshot inspection or pixel comparison beyond the actual logged suite is claimed.
