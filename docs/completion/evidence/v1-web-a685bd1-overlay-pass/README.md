# Rendered web overlays: a685 Chromium pass

[Run 42944976784](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42944976784), job [130275485356](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42944976784/job/130275485356), completed successfully. The complete original log confirms **32 passed (9.3s)**, with 32 individually identified successful cases and no failed or skipped cases.

## Exact tested source

The job checked out PR merge `778ab991afb4dfe48b405800dc4b79e4bca97939`, as shown by the checkout and subsequent `git log -1 --format=%H` output. Its tree is `0b3c93477329d5db0076e0f6a54c6afa2dbcd3b8`, identical to helper `a685bd17d3023307181371a9c042bfbc1530c232`. The merge's ordered parents are `0edd5f302e99877191ba9a412c5c060571a5f6c9` and `a685bd17d3023307181371a9c042bfbc1530c232`. The full 2,048-leaf helper tree and actual merge identity were independently verified.

The existing fixture alias remains in `packages/expo-controls/tests/browser/server.mjs`, blob `2687299e55689f6fca67d7a8904eb85923d2aaa9`, unchanged from f157. This receipt introduces no new alias or browser-source correction.

The checked workflow is `.github/workflows/menu-browser.yml`, blob `2dc4658620b43618b48f284626474ea7eb3fc02c`. It runs the actual isolated browser suite through Playwright and Chromium.

## Observed results

The original log records:

- **20 rendering cases** covering popover, command, palette, tooltip and trigger-popover surfaces in light/dark phone/tablet layouts.
- **12 interaction cases** covering menu keyboard/pointer behavior, disabled actions, focus containment/restoration, command-palette behavior, tooltip focus/dismissal and trigger-popover anchoring.
- The normal PNG artifact upload succeeded. The failure-only artifact step was skipped.

These are rendered-browser test results. They do not establish AppKit startup, native tooltip hover, an NSDraggingSession, physical-device acceptance or distribution approval. The native startup reporter is not exercised by this web workflow. A final frozen combined candidate still needs its own required gates.

## Complete log and artifact boundary

Root and the independent source reviewer separately retrieved the same complete [original browser log](browser-job.log):

- **43,810 UTF-8 bytes**; returned string length **40,976**.
- SHA256 `8b0e231ad28ae62fdf90274a704c8755961d6111b9f23195ce8af57e42ec7cf0`.
- Git blob `33aab8866ed88459b44e98bd0a6829d9b89b4377`.

The log is retained without trimming, newline normalization or ANSI removal. [Provenance](provenance.json) binds its bytes to the exact source and test result; [workflow metadata](workflow-metadata.json) retains the normalized run/job/artifact observations.

The upload log reports **20 files** in artifact **13822033472**, `overlay-renders`, with a final ZIP size of **280,598 bytes** and SHA256 `c36b9d2db7f81b2268742ac6441d947a4c92336531cdbad244edd243f026508e`. GitHub artifact metadata reports the same size and digest.

The ZIP and PNG member bytes remain **unextracted and unviewed** here. The artifact size/digest are producer/API-reported, not an independently computed hash of downloaded ZIP bytes. No manual screenshot review or pixel comparison beyond the actual logged suite is claimed.
