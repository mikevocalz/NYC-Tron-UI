# Native UI evidence retention portability correction

This is a source-only correction for an actual failure in the Windows workspace test job at PR63 head `7a160c536b845d71487ba2997262daf3cf07cb9b`, tested through merge `de54b75c752e57fbfd12cbf01e458bfd41788c45`. It records four immutable candidate files, their exact 13 text replacements and source checks. The later CI result for these candidates is not part of this receipt.

## Observed failure and ownership

Source workflow [42994633542](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42994633542), job [130435532706](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42994633542/job/130435532706), failed the existing test **retained snapshots survive writes through an already-open driver log and include hidden debug evidence**. The exact complete job log is Git blob `058feca66e4a22a222bc2f6ca722154be9e8fa91`, 159,544 UTF-8 bytes, SHA-256 `2a63568340e93933954ebe5ee651a0177ffbd29fe409e438703643b774de3b31`; its CRLF bytes are unchanged. The diagnostic is `EPERM` from `renameSync` at `ui-transport.mjs:113`, trying to move `settings` to `settings-initial-transport-live` while the test deliberately holds a nested driver log open.

The exact runner invokes Maestro with `spawnSync` and writes its captured stdout/stderr to `settings-maestro.log` after the command returns. That does not give it ownership of arbitrary nested driver log handles that survive the command. The retention helper was deliberately written to preserve snapshots against subsequent appends, rewrites and truncation through those handles. Closing a descriptor owned by the test would remove the exercised condition; a production helper cannot close a handle it does not own.

## Correction

The original failed `settings` directory and `settings-maestro.log` remain at their existing paths. The helper copies their bytes into exclusive independent files under `settings-initial-transport-failure`, hashes those retained bytes, and writes the existing recovery receipt only after successful retention. It no longer renames either live path. Missing, conflicting or unreadable evidence still fails retention and prevents recovery; there is no catch-and-ignore or incomplete-success path.

Only attempt 1 uses the new `settings-retry` evidence prefix. The directory, Maestro command log, hierarchy and report receipt all follow that prefix. The logical stage remains `settings`, the same Settings YAML executes, and every JUnit, geometry, semantic and screenshot requirement remains. Other flows retain their previous output paths. The eligibility classifier and exactly-one-retry implementation are byte-identical.

The existing regression still keeps a real file descriptor open through retention and then appends, rewrites and truncates its live file, requiring the snapshot and receipt bytes/hashes to stay unchanged. Its owned descriptor is now closed before test-directory removal. A separate retry report/log is written in the first retention test, which checks that all original live fixture bytes remain unchanged. The documentation now names the actual live and retry paths.

These are per-file read-time snapshots taken before recovery. They are not an atomic multi-file snapshot or a claim that every surviving driver process has finished writing. Original live artifacts remain available alongside the snapshots, and the native workflow continues uploading the entire runtime UI evidence directory, including hidden driver evidence.

## Exact files and source checks

| File | Preimage | Candidate |
| --- | --- | --- |
| `tooling/native/ui-transport.mjs` | `9a362c4b7af481c01beeb7bd0f7b03a9a692080b` | `fbf804293b94406b65a36d273f4c2528825b4bc4` |
| `tooling/native/run-ui-acceptance.mjs` | `50d0a3435fb52f4ad1b73df224fc01436f5d443b` | `3cac0f88b939d1ed1619396bd1fc2aa58f6061af` |
| `tooling/tests/native-ui-transport.test.mjs` | `9e62b8505328cc9e76cf6a361571565eb0fc11a3` | `750bcf5cd84d5b00b50b0e2820bd0012a3893619` |
| `tooling/native/UI_ACCEPTANCE.md` | `a3a51e499711f026463b9ff6b571422f730c0cf8` | `d4fa0c0fad6829965108e0a6da78b77678e9cc91` |

[edits.json](edits.json) retains all 13 unique forward replacements and exact inverses, file byte counts, SHA-256 hashes, Git blob IDs and ownership reasoning. [flow-check.mjs](flow-check.mjs) reproduces the source transformation/inverse checks and V8 parsing, then executes the actual extracted `flow` function with mocked I/O under slash and backslash path conventions. It verifies distinct evidence paths and unchanged logical/YAML identity. [source-review.json](source-review.json) records those exact check scopes.

The author and root coordinator independently reproduced the exact transformations and mocked flow checks. This is not Node filesystem, Windows, Maestro, simulator or native execution of the correction. The existing real filesystem regression must execute in CI. No workflow, native binary, platform deadline, host/security setting or native acceptance assertion changed. The separate release-readiness test failure and native `IslandConnection::Site` compiler failure are outside these four files and retain separate fixes/outcome evidence.
