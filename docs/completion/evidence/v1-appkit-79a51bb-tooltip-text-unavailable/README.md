# AppKit direct-head 79a51bb: startup succeeded; help-tag text remained unavailable

This receipt records the completed [AppKit workflow 42975767901](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42975767901) at direct checkout `79a51bb7663bffe130568f81e276ded0e0b065b9`. Compilation succeeded. The initial native window activation succeeded in this run, and the verifier reached the real posted-pointer tooltip check. That check failed because no observed help tag satisfied the strict expected-text predicate.

The typed last observation contains a new visible native `AXHelpTag` with a nonempty frame, but the collector retained **zero strings**. The existing modern accessibility reads and the separate diagnostic legacy value reads all returned nil on the three inspected nodes. This establishes unavailable text through those reads; it does not establish that a wrong string was displayed, that no native help tag appeared, or that the expected tooltip text was visually verified.

## Exact source and run

- Event: `workflow_dispatch`; this is the direct head, not a generated pull-request merge.
- Head: `79a51bb7663bffe130568f81e276ded0e0b065b9`.
- Tree: `f5603b91fec3b9c9466fa0776ce0fff1f6be565e`; sole parent `8f1cf564afc9e178246eaa1825f392ebb68cf485`.
- All 2,050 leaves and 284 tree objects were independently verified.
- Source job: [130374370504](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42975767901/job/130374370504); checkout is recorded at source-log line 107.
- Native job: [130374533751](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42975767901/job/130374533751); checkout is recorded at native-log line 114.
- The native log identifies the ARM64 runner image, Node 24.19.0, Xcode 26.2 and build 17C52.
- The later reviewed helper `1283fd6dea6cead03be7d0eb22863e02dbe648fd`, its corrected private-consumer source, and run 42977406794 are separate. This receipt does not certify that candidate.

The direct head includes the externally authored private Expo device-name patch. The preceding hosts-setup experiment was reverted in its parent. This run's successful startup does not establish the cause of earlier startup delays, validate an uninspected historical stack claim, or prove that the private patch fixed those delays. The earlier 8f result remains a separate historical receipt.

## Completed gates and first failure

| Evidence | Actual result |
| --- | --- |
| Source checks | 13 passed, 0 failed, 0 cancelled, 0 skipped; reported duration 486.712535 ms |
| Installed-consumer tests | 16 passed, 0 failed; reported duration 108.243958 ms |
| Installed public API snapshot | Matched 15 typed subpaths and 33 reachable declarations |
| Native Foundation/socketpair probe | Seven original/patched cases, trace privacy and explicit closed-peer failure passed |
| Standalone AppKit compilation | Success; build result exit code 0 |
| Native interaction acceptance | Failure at the strict tooltip shown-tag text wait |
| Tested distribution upload | Skipped |

These are separate checks and declaration counts, not an additive total of native acceptance tests.

The first runtime error is native-log line 538:

> Timed out waiting for new visible native help-tag text after the posted pointer reaches the trigger

The stack points to `waitFor` at verifier line 743 and its tooltip call at line 890. The runtime step exited with code 1. No passed native acceptance or tested package receipt is established.

## What the typed tooltip observation establishes

Both `postEventsAllowed` and `accessibilityTrusted` are true. The owner is visible, key and active. The cursor is at (329, 384), inside the trigger rectangle (249, 366, 160, 36), and the pointer-sequence flag is cleared.

The baseline has no help tags. The last hover observation has one visible, onscreen `AXHelpTag`, window 41, with tag and window frames (329, 347, 213, 18). The traversal is not marked truncated. Its expected-text predicate is false.

The string array is empty. The existing collector visited three nodes and recorded 12 field slots: nine value/label/title calls returned nil, while three text-field-specific slots were unavailable. No value was captured or normalized into text. The separately guarded diagnostic legacy value probe considered those same three nodes, attempted three supported reads and returned nil three times, with zero throws, selector exceptions or metadata exceptions. No legacy value was added to acceptance strings.

These counts describe the retained last observation, not every earlier poll. The original text-bearing artifact was not extracted; the typed summary intentionally omits arbitrary strings. No fallback value, simulated tooltip or relaxed predicate was substituted. Expected-text presentation, subsequent dismissal, and later drag acceptance remain unproved by this run.

## Startup and diagnostic boundaries

The retained command projection records request 2, `tron.window`, beginning at 07:16:22.776 UTC and returning successfully at 07:16:23.524 UTC: 0.748 seconds between recorded timestamps. Native identity checks report the same process and bundle; the final activation record reports visible, active and key true.

The monotonic timing fields report 0.00009441666679776972 seconds around the completion trace and 0.5545028750000256 seconds from immediately before dispatch submission to first main-block entry. These elapsed intervals exclude system sleep and do not isolate queue residence or establish causality.

There is no `NYCTRON_STARTUP_SAMPLE` envelope. The startup reporter ran later in the tooltip failure path. Its live app-log snapshot was complete at that read but permits later appends. Its command-file read is truncated: 262,145 bytes were read from a 1,426,827-byte file, leaving 1,164,682 bytes uninspected by that projection. It is not a complete command history.

The post-failure process projection reports a sample file and seven thread groups. That raw sample was not retrieved or inspected here. The two-second sampling argument is a requested duration; neither the typed count nor the file hash establishes thread health, an exact collection duration or a startup cause.

## Original console bytes and producer-reported files

The complete source and native job logs are retained unchanged. Their identities are:

- Source log: 18,752 bytes; SHA-256 `201afd48295f99c8143113a7f123439cda64db531f429375c2b58925fc485d81`.
- Native log: 82,804 bytes; SHA-256 `dc2ec799319cb873783a1f81b4abd9fdb4c5666a9cc6485ea4698c5fc0ad319e`.

Each of the three JSON files is the exact JSON substring from its original log line, without the GitHub timestamp or terminating line ending. Each companion envelope preserves the original timestamped BEGIN-through-END bytes. The build and tooltip envelopes contain no interleaved lines; the startup envelope contains nine interleaved stderr lines. JSON was not reserialized.

The build producer reports a complete 12,329,235-byte compiler transcript with SHA-256 `9c25225f1d874e04a5b6dd9a099f8dfdad39904a25492e06831b899a2661a925`. The tooltip producer reports a 12,452-byte `tooltip-hover.json` with SHA-256 `b84ab768f7d7ed96a11f0bc395c6c0e6356e35092ab6a03398840f89b96229aa`. Those are producer-recorded original-file identities, distinct from the independently verified console payloads.

Native artifact [13836268098](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42975767901/artifacts/13836268098) is reported as 1,481,905 bytes, SHA-256 `c92cd3a986ac175c6cec6e0335c8dca9195e9651863e59cf16ade6cd4e2eb9da`. The upload reports 47 files. The ZIP, compiler transcript, raw tooltip file, process sample, screenshots and other members were not extracted or inspected for this receipt. Archive and original-file hashes remain producer/API-reported.

See [provenance.json](provenance.json) for every retained file identity and [workflow-metadata.json](workflow-metadata.json) for normalized completed job/artifact metadata. This evidence records one failed native run. It does not close full AppKit interaction, release, physical-device or eight-platform acceptance.
