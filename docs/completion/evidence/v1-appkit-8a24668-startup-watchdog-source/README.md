# AppKit initial-request watchdog source review

This checkpoint contains one private acceptance-verifier change and its reproducible source review. The published helper is `8a2466835e14b579002a7fbaa3a240aaaf16e059`, tree `e2ea092f9d21a0a1e4a87cd9413ed39b0beb314a`, with sole parent `12e35b48f75408ac4da4f8130853148ef00a5881`. Root published the helper at 2026-11-11 05:14:39 UTC using a fresh expected-parent lease, a nonforced update and a matching ref readback. Native execution was unknown at publication. This receipt establishes no native acceptance.

The latest completed 12e run compiled successfully, then its initial `tron.window` request 2 timed out before the verifier reached its `root-main` mount check or allocated tooltip evidence. Its observed pre-submission-to-main-entry interval was about 35.407 seconds. That interval does not identify a cause or prove a blocked main queue, and its original post-timeout sample remains uninspected. The new observation is intended to retain a sample while that first request is still pending.

After publication, root verified actual PR merge `e72dcda68234a6506dfef07dc18ffd3b8de9f916`, the same reviewed tree, and ordered parents `0edd5f302e99877191ba9a412c5c060571a5f6c9` then the helper. AppKit run `42964459265` and browser-overlay run `42964459201` are in progress with outcomes unknown at this receipt checkpoint. This separate source/merge verification implies no native compile or runtime success.

## Exact source boundary

Only [the private verifier](https://github.com/mikevocalz/NYC-Tron-UI/blob/8a2466835e14b579002a7fbaa3a240aaaf16e059/examples/macos-appkit/spark/verify-native.mjs) changes: blob `2d9efdb7834b3ee461bf00e3fecbcc5c11b43964` becomes `4507f860155746bb6f1a3a9528dd0e74de5d6492` (90,995 UTF-8 bytes; SHA256 `7e4f8421b447a3ecef3623e9a6ee1b1269a571b6d6f96019bcd1d7126be27736`). Reversing five exact edits restores every original byte.

The explicit initial-only call observes the original request promise once. The 35-second client timeout, activation arguments, owner/foreground checks, later `show()` calls, native source, tooltip and dragging assertions, original startup/tooltip reporters, and app-owned cleanup remain unchanged. The only new import is the built-in asynchronous filesystem `mkdir`.

## Diagnostic-only lifecycle

The watcher is scheduled for 10 seconds and fires only if that first request remains pending. It latches diagnostic-only status before reserving output or starting preflight. It checks the retained app child/PID/liveness, then uses one query restricted to that PID to compare the observed PID, parent PID and expected `ps comm`. This is an argv[0] comparison, not an independent mapped-executable-path measurement. The same child and pending request are rechecked before sampling.

The sample command requests two seconds at a ten-millisecond interval. It runs asynchronously, has an eight-second timer, and uses bounded SIGTERM/SIGKILL cleanup. Signal delivery never substitutes for observed exit or close. If close remains unconfirmed after the cleanup grace, the original postfailure sampler is suppressed to prevent overlap. The original app cleanup still runs. Task `status` is explicitly labeled `observer-task-outcome`; later `closeObserved`/`closedAt` observations and the historical `cleanupLimitReached` flag remain separate.

This observation performs no file read, hash or console report, and its task is not awaited, until the original request settles. The sampler itself writes its fixed original file during sampling. Rejection rethrows the exact original error after bounded observation cleanup. A request that resolves after the watcher fired raises the fixed diagnostic-only error before the remaining show assertions and any passed report or tested-package receipt. Sampling can perturb scheduling, so even successful activation in a triggered run cannot establish native acceptance.

## Retained bytes and bounded projection

The original sample is a fixed new `startup-predeadline/sample.txt` in an exclusively reserved evidence directory. The separate observation JSON uses `wx`, preserving a prior file if the path already exists. All collection and reporting failures remain secondary.

The console envelope is limited to 16 KiB including its markers and newlines. Sample processing reads at most 1 MiB plus one overflow byte. A whole-file SHA256 requires observed spawn and close, a complete bounded read, successful file close, and stable file identity/stat checks. Otherwise the report keeps a clearly labeled prefix digest or explicit unknown fields, with no implied whole-file hash or parsed frames.

Projection requires one matching `Process:` PID and exactly one explicit serial main-thread group. An optional `Analysis of sampling` PID declaration must also be unique, valid and matching. At most 32 frame records are retained from a bounded scan. Those records contain fixed platform/function labels or `unknown`, counts, depth and relative offsets. They omit absolute addresses, paths, raw symbols, ps output, stderr and application content. Requested sampling parameters are labeled as requests, not measured duration. These records alone do not establish a causal diagnosis.

## Review and reproduction

[review-checks.js](review-checks.js) is a standalone V8 harness. Evaluate it and call `await reviewStartupWatchdog({source, preimage, historicalSample})` with the exact UTF-8 contents identified in its header. Its fourteen authored groups pass, covering promise settlement during directory/preflight/sample work, original-error identity, triggered-success refusal, ownership mismatch, denied subprocesses, kill-error/no-close cleanup, exit before close, late close, original-file retention, PID/parser/privacy bounds, stable versus prefix hashes, and console failure.

The normal complete envelope is 3,176 bytes. The maximum-width allowed 32-frame fixture emits 10,536 bytes. The historical sample fixture retains 32 of 480 main-frame lines and records 448 omitted lines. That fixture is format evidence only; it is not a stack from this candidate or the preceding 12e failure.

Forge independently reviewed the lifecycle, API contracts, exact source inverse and prepared tree, and reproduced the same fourteen groups. Root independently verified source identity, inverse, syntax, prepared tree and eight parser cases, and also reproduced the same fourteen groups. Desktop independently ran seventeen parser/readback/report groups plus the final metadata check. Reproductions of the fourteen authored groups are not additional distinct test designs.

All executed checks here are V8 source assertions or deterministic mocks of timers, subprocesses, filesystem and console. No real Node OS IO, Apple sampler, AppKit compilation or native interaction ran for this candidate during this review. [source-review.json](source-review.json) retains the exact identities, detailed scopes, primary references and limits. Native execution, release acceptance and final canonical assembly remain separate gates.
