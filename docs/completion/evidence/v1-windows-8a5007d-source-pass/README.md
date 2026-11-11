# Windows fixture candidate: completed source gates

All three general-source jobs for PR63 head `8a5007d197539c782e065f1b59daf3fe5ed752ec` completed successfully in workflow **43022193456, attempt 1**. Each complete original log prints actual checkout `e7901ec687e96a240a7b820baef50318fde40ddd`. The generated merge uses tree `9f7d87a249edc25216dcbc11763b009eda825ba2` with ordered parents `25a6af6d020e34d790f6a4f3d9f117738b252f1e`, then the candidate head.

## Actual completed results

| Job | Result |
| --- | --- |
| Linux pure contracts and dependency boundaries, 130527857223 | 1,204 tests passed; zero failed, cancelled or skipped; reported suite duration 28,725.865814 ms |
| Windows tests and pack, 130527857598 | The same 1,204-test suite passed; zero failed, cancelled or skipped; reported suite duration 73,969.1656 ms; 13 workspace packages packed and 17 export subpaths imported |
| Workspace TypeScript and package checks, 130527857738 | Build/type checks passed; public API matched 13 packages, 619 subpaths and 3,306 reachable declarations; 13 workspace packages packed and 17 export subpaths imported |

The two host lanes are separate executions of the same suite. Their counts are not added into a claim of 2,408 distinct designs. The durations above are the test runner's suite durations, not complete job wall-clock time.

The original logs show both the failed-attempt retention checks and the strict release-readiness checks running successfully on both hosts. This includes retaining snapshots while an already-open driver log is written and rejecting pending, incomplete or locally forged distribution review. Exact lines are retained in provenance.json.

The ledger check reports **341 canonical IDs: 332 local implementations, nine pinned external implementations, zero partial and zero pending**. It also explicitly reports **zero rows accepted with all eight platform proofs**. Source implementation coverage is therefore distinct from complete platform acceptance.

## Original evidence and package boundary

This folder retains the three complete fetched job logs, unchanged, including their original BOM or CRLF where present. The companion provenance records Git blob IDs, byte counts, SHA-256 values and exact selected original lines. All log blobs were read back and compared byte for byte. Completed run/job/step metadata and the independently retrieved merge identities are normalized separately.

Both packing jobs report thirteen workspace archives and successfully import seventeen subpaths from core, geometry and windows-fluent. Their producer-printed archive hashes are host-specific and differ between the two logs. This receipt does not assert byte equality across those packs or substitute either pack for the canonical final distribution. The workflow's artifact endpoint returned no artifacts, and original tarball bytes were not inspected here.

The separate Fabric source/native workflow is outside this six-file receipt. Its package compilation, native UIA behavior, actual template-icon geometry, later navigation and drag checks require their own completed originals. Nothing here establishes a supported Windows host, physical-device acceptance, the final thirteen-plus-two tested-archive inventory or owner approval. No source/native run was dispatched or rerun to create this receipt.
