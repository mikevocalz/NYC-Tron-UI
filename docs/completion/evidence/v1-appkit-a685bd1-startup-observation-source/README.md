# AppKit startup failure projection: reviewed source checkpoint

Helper `a685bd17d3023307181371a9c042bfbc1530c232`, tree `0b3c93477329d5db0076e0f6a54c6afa2dbcd3b8`, has sole parent `f157c9bf207f8ceae890e299f9667b56ab78360d`. All 2,048 leaves were checked; only `examples/macos-appkit/spark/verify-native.mjs` changes. The complete tree identity was independently recomputed. Root published the helper at 02:17:14 UTC on November 11. Actual PR merge `778ab991afb4dfe48b405800dc4b79e4bca97939` has the same tree and ordered parents `0edd5f302e99877191ba9a412c5c060571a5f6c9` and `a685bd17d3023307181371a9c042bfbc1530c232`; root and this source reviewer independently verified those identities. This receipt establishes reviewed source and bounded JavaScript checks. Actual workflow, Node filesystem and native interaction outcomes are separate.

At this source checkpoint, [run 42944976627](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42944976627) reports source job 130275485575 completed successfully in workflow metadata; independent retrieval of its complete original log is still pending. Native job 130275751812 is queued, with no actual native runtime outcome established by this receipt. Later results belong in a separate outcome receipt.

## Why this change is needed

The completed f157 native run 42938338972 compiled successfully and then failed with `Native driver response timed out awaiting tron.window (request 2)`. The verifier had not reached its `mounted('root-main')` check or allocated tooltip evidence. This does **not** establish that React content never mounted. The tooltip-only reporter therefore correctly emitted no tooltip envelope.

Root and the AppKit owner independently matched the complete original native log: 53,466 UTF-8 bytes, SHA256 `0a2057205499734cab358f8b9f5b07f4026a9825022cea7f9daecbe35eedef6c`, Git blob `8e2ae20a9d10d3cdbf2d1f087c3dcf61aa6594a2`. The original runtime ZIP remains unextracted. No activation behavior correction or timeout cause is established by this source change.

## Failure-only reporting

After the existing process sampling and `failure.json` write, and immediately before the original error is rethrown, the verifier reads exactly three existing files: `app.log`, `commands.jsonl` and `native-process-failure.json`. The socket and app remain owned until the unchanged final cleanup.

The live app log is handled as a read-time prefix. At most one MiB, bounded by its observed open size, is retained once as `startup-app-log-snapshot.log` using `wx`. The reported SHA256 identifies these retained snapshot bytes. It is **not the eventual app.log artifact hash**. Before/after size and identity observations, growth, truncation and possible later appends remain explicit. A snapshot collision never overwrites prior bytes and cannot be presented as a fresh retained snapshot.

The completed command/process files are read with a 256 KiB limit plus one overflow-detection byte. A full-file SHA256 is reported only after a complete stable read. Changing, unavailable or oversized inputs remain explicitly incomplete. The process JSON is projected only after that complete read. Its sample-file digest is a validated producer-recorded value; the sample text is not reread or emitted.

One `NYCTRON_STARTUP_EVIDENCE_BEGIN/END` envelope includes the actual source revision, owned PID, capture time, byte identities and typed observations. Its complete UTF-8 output, including markers and newlines, is capped at **32 KiB**.

## Observation and privacy limits

Only the fixed activation/transport prefixes with the owned PID in the native log header are accepted. The projection keeps fixed phase and command labels, safe numeric IDs/times, actual Booleans, selected window/activation fields, numeric transport outcomes and bounded process/sampler metadata. It excludes credentials, request arguments, response payload values, arbitrary error text, stdout/stderr, application names and paths.

Each stream scans at most 4,096 complete lines, each limited to 8 KiB. It retains the first sixteen and last sixteen matching records **within that scanned prefix**, without duplicate indexes. Truncated bytes, partial trailing lines, unscanned lines and record omissions remain explicit. If needed, older selected records are removed to fit the output budget while retaining the latest selected stages. Missing/invalid fields remain unknown; observed false and empty input are preserved. ISO timestamps must round-trip exactly, so impossible calendar dates are not silently normalized.

An absent trace is not proof that native code did not execute. A captured thread stack does not establish app health. Reporting, snapshot and console failures stay secondary to the original error. No diagnostic field creates a native acceptance pass.

## Exact source and checks

The final verifier blob is `e773cfb2661e80f01daa400f14cd09b903e6b087`: **65,792 UTF-8 bytes**, SHA256 `a90bd7925658a053391a6f6b9cbcf1979f8d90f306a670fb93f271c74bab5aa0`. Removing the added fs import, five reporting functions and catch call restores `deeedf41711c84dbcca0029104e5ea03e6b55a2c` byte-for-byte.

[Source review](source-review.json) records the exact source, limits, historical fixtures and verification scopes. The [reproducible JavaScript review checks](review-checks.js) run through in-memory filesystem/console adapters in V8. All **19 author groups passed**. Root reproduced those same 19 groups from independently retrieved source/fixture bytes; that reproduction is not nineteen additional test designs. Root also ran nine independently designed selector groups and reviewed the final ISO correction.

The independent desktop reviewer approved the complete source after twelve separately authored V8/mock-IO groups, followed by nine focused canonical-date cases for the two-line correction. Whole-verifier syntax was checked in V8 with imports excluded and import.meta substituted for parsing only; the body was not invoked. The output-limit fixture emitted **32,766 bytes** including its markers/newlines.

These checks do not claim actual Node filesystem, AppKit, socket, OS-input or new native runtime execution. Original evidence writes, native commands, activation order and policy, the 35-second client response timeout, gesture deadlines, permissions, strict assertions, process-sampling order, original error rethrow, cleanup and passed-only distribution gates are unchanged.
