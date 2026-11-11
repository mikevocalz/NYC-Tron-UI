# Reviewed Windows drag lifecycle source at 7a160c5

This is a **source-review receipt** for draft [PR #63](https://github.com/mikevocalz/NYC-Tron-UI/pull/63), head `7a160c536b845d71487ba2997262daf3cf07cb9b`, tree `24b244e41d6d61e7dfe56a1cd32d56d37bb0f035`. It records exact source composition, review and publication identities. It does not contain a native compilation, concurrency, PowerShell or runtime pass, a tested-package archive, or a supported-host finding. CI outcomes are separate receipts.

The candidate's only parent is aggregate `25a6af6d020e34d790f6a4f3d9f117738b252f1e`. At the recorded November 11 09:24:36 UTC API snapshot, the PR was open, draft and unmerged. Its generated merge `de54b75c752e57fbfd12cbf01e458bfd41788c45` has ordered parents `25a6af6d…`, `7a160c53…` and the same tree. The snapshot is historical; it is not a claim about a later live ref.

## Exact adoption and correction boundaries

The aggregate's `TronDragSurface.cpp` was **d86f3b14**, while the lifecycle correction was authored against the externally introduced parent-island route **d7c28b55**. The candidate adopts that external route with the reviewed corrections, yielding **a2148fdc**. These are distinct source versions. The [26-edit manifest](native-edits.json) starts at **d7c28b55**, not at the aggregate's d86f3b14; it must not be presented as an exact d86-to-a214 patch.

| File | Aggregate preimage | Published candidate |
| --- | --- | --- |
| `TronDragSurface.cpp` | `d86f3b1454d93996606faa11d2f25fa7a9fea7d1` | `a2148fdc939011492f52df1b6899a613a17cddae` |
| `NativeDragBroker.cpp` | `561bd52c4780fb59ece93f5538c2631f912a70e2` | `be0d4e845fda172e69519871f3a014d1ae3620ec` |
| `NativeDragBroker.h` | `2d88c35324b84a65d5e7ef240f2969d7effbf3e7` | `0c3ae907418020400b7baf9f96b054ae2a37a944` |
| `example/scripts/uia-smoke.ps1` | `070424fa54f1645cc6be02187647f84732a6b53c` | `aa54819df02c2decfba2fb19e3b4d2a5aaabd554` |

The native files are under `packages/windows-fluent/rnw-fabric/windows/NYCTronFluentFabric/`; the UIA script is under `packages/windows-fluent/rnw-fabric/`.

The UIA composition is separate from the native manifest. The exact 461-byte net window-selection change between external scripts `bc18f6a74b6237530fd570d5c4c7e3a22a9af5ec` and `a6bfaccc3dcbdafcd398bd0d1c5bde63ba22ab23` was applied once to aggregate script `070424fa…`. It selects a same-process top-level element that supports `WindowPattern`, retaining the aggregate's ownership checks, refresh/popup logic, 10-second focus retry window with the original ErrorRecord, actual foreground/stable-positive-rectangle checks, and existing 90-second poll. Those retry windows do not impose hard cancellation on synchronous calls. The complete inverse restores 070424fa exactly. This is source review, not a new PowerShell execution result.

## Native ownership corrections

The parent drop completion now shares its event and synchronized terminal state across the coroutine and callbacks. Event allocation is checked before an offer is published. Timeout, cancellation, duplicate or late callbacks cannot change an abandoned result into an accepted result or signal a freed event. The cancellation path covers registration after cancellation and cancellation thrown before `resume_on_signal` suspends.

Broker cleanup is bound to the exact **nonce, target, target generation and drop request** and is submitted to the captured original UI dispatcher. A failed enqueue does not fall back to broker work on a worker thread. `Offer` returns the captured request ID even when callbacks reenter; its failure cleanup uses the same four-field lease.

Escape handling is owned by the source thread/request lease. Refused preparation, hook-install failure, unrelated surfaces and teardown cannot release another drag's lease. Both native drop routes use the same source/nonce cancellation check. Parent target registration is invalidated before event removal or potentially reentrant close; stale held targets refuse work.

The broker still uses its original 30-second deadline and the parent completion its original 35-second wait. A timer tick acts only when its sender is the currently owned timer, and `Start` clears that timer reference before stopping it. Nonce copying, moving `sourceReady`, stopping the timer and invoking `ready(true)` share the protected path. A failure attempts `ready(false)` before exact cancellation/rethrow; the existing claim guard prevents duplicate source cancellation, deferral completion and hook cleanup. This closes identified exception/ownership paths without asserting that a late tick or throwing timer stop occurred in a recorded run.

The approved bounded OLE observation block from `c0e90062f6747c6d5dd216691c98de08d2d1eea8` is byte-identical in a2148fdc. Every visited window, including InputSite nodes, consumes the 40-node budget; traversal also has a 16-level limit and explicit truncation. The private window-property observation does not establish public OLE registration or a functioning drop target.

## Reproduction and full-tree checks

- [native-edits.json](native-edits.json) is the unchanged 55,682-byte manifest, Git blob `e1a666db4e7ad8f13dc0059b8bd3bd205e140c09`, SHA-256 `a136c033a97d04ffcec188ae7800d39edd1915e3a7fc5feb063f71158060d7bf`. Every one of its 26 replacements is unique and reverses to its exact immutable preimage.
- [composition-check.mjs](composition-check.mjs) is a pure JavaScript source check. Given the listed immutable source strings and an identity function returning UTF-8 byte count, SHA-256 and Git blob ID, it checks all native forward/inverse edits, the exact approved probe, the explicit external adoption boundary, and the UIA selection composition/inverse. It ran in V8 on those exact strings. It performs no operating-system I/O or native execution.
- [source-review.json](source-review.json) records the source identities, historical API snapshot, complete-tree verification summary and review limits. Both complete untruncated trees were fetched; all 3,152 leaf identities/modes and 513 tree-object hashes were reconstructed. Exactly four paths change, and the other 3,148 leaves/modes are identical. The generated merge's ordered parents and tree were also checked.
- The root coordinator and a separate desktop reviewer independently reviewed the source and exact transforms. Their checks include the final timer/Start exception cleanup. These are independent source reviews, not additional native tests.

All workflows, dependencies, ledgers and prior receipts remain unchanged in this candidate, including Windows workflow `4bfac5a1e0b91ac88a104a08d08ebcdc873be6bc`. No host, launcher, token, integrity, permission or security setting changed. Strict OS results, application-owned scope/approval, transfer assertions, failure cleanup and tested-package gates remain requirements.

No source-level argument here identifies the cause of a previous PowerShell test-driver heap-corruption exit. General affine-transform geometry, competing parent-manager arbitration, all OS event orderings, and supported-host behavior are not proved by this source correction. Historical external drag results do not become passes for 7a160c5. The manifest's execution-status statements describe its source-authoring checkpoint; actual later compilation, native outcomes, source-CI failures and any follow-up repairs must retain their own exact revisions and evidence.
