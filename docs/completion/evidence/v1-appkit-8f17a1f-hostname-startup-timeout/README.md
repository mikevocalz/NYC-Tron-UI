# AppKit 8f17a1f: hostname preflight passed; startup timed out

[Run 42973159971](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42973159971)
compiled the native reference and passed its hostname preflight. Native job
[130366229307](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42973159971/job/130366229307)
then failed with:

> Native driver response timed out awaiting tron.window (request 2)

The first-request watchdog had fired. **This run is diagnostic-only and
establishes no native acceptance.** Tested-distribution upload was skipped.

## Exact source and chronology

This was an externally dispatched `workflow_dispatch` run, attempt 1,
created at 06:32:35 UTC on November 11, 2026. Completed run metadata was
updated at 06:51:50 UTC. The complete source and native logs both confirm
direct checkout of `8f17a1fd7530d2907e28401063cd7b49841e8ebd`.

Its tree is `b868c3bf7f45b7d668c629b6629c33f19c48bb28`, with sole parent
`8a2466835e14b579002a7fbaa3a240aaaf16e059`. All 2,048 leaves and 284 tree
objects were independently verified. The only change from that parent is
`.github/workflows/macos-appkit.yml`, from `ed8c5a2c` to
`70061e6a9fb2b0752ccca2825669d169e7a11064`.

This is a historical direct-head result, not a PR-merge or reconciled-helper
result. Subsequent helper work, including revision
`79a51bb7663bffe130568f81e276ded0e0b065b9`, is outside this run's source and
evidence. Later source changes cannot retrospectively change the checkout,
setup commands or outcome recorded here.

## Completed gates

| Gate | Actual result |
|---|---|
| Source job 130366073441 | 11 passed; zero failed, cancelled or skipped |
| Installed consumer controller tests | 16 passed; zero failed, cancelled or skipped |
| Installed API comparison | 15 subpaths and 33 reachable declarations matched |
| Foundation/socketpair transport probe | Seven original/patched cases, privacy and closed-peer checks passed |
| Native compilation | Exit code 0; build-result outcome success |
| Hostname preflight, native step 10 | Completed successfully |
| Native interaction verification | Initial show request 2 timed out; diagnostic-only |
| Tested native distribution | Upload skipped |

These source-test, API-inventory, transport and build results have different
scopes. They are not a combined count of product requirements or native
interaction checks.

## Displayed and checked hostname calls

The [complete hostname step](hostname-preflight-step.log) preserves native-log
lines 512–542, including the displayed commands, environment and actual
stdout. The step runs the compiled Foundation probe three times.

| Invocation | Recorded evidence |
|---|---|
| Before hostname setup | Printed `ProcessInfo.hostName` elapsed time: **0.03 s**, rounded to two decimals |
| After setup, used by the threshold check | A separate invocation whose final output line is captured into `seconds`; its exact value is not printed |
| After setup, displayed for the log | Another invocation printed **0.01 s**, rounded to two decimals |

The completed step passed its `Number(seconds) < 5` check. The displayed
0.01-second result must not be substituted for the separate threshold-tested
value. The retained log does not contain a readback of the final hosts file.

The step's setup and probe result are observations from this run. They do
not establish the cause of an earlier app wait, nor a hostname fix for native
startup: this run still failed the original request deadline. Commit prose
naming NSHost, ProcessInfo or Expo functions is not independently verified
stack evidence in this receipt.

## Pending-request sample and timing

The app PID was **40640**, with parent PID **40620**. Preflight matched the
retained child's PID, parent and expected `ps comm` argv[0]. That observation
does not independently identify a mapped executable.

| Observation | Recorded UTC time |
|---|---|
| Request 2 started; observer armed | 06:50:54.396 |
| Watchdog fired | 06:51:04.402 |
| Sampler process spawned | 06:51:04.430 |
| Sampler process closed | 06:51:09.271 |
| Original request rejected | 06:51:29.407 |
| Observer recorded request settlement | 06:51:29.410 |
| Native main-continuation trace | Approximately 06:51:29.989 |

Sampler process lifetime was **4.841 seconds**. The requested collection
duration was **2 seconds** at a requested **10 ms** interval; process lifetime
does not measure actual collection duration. Confirmed close occurred
**20.136 seconds before rejection**. Command rejection occurred after
**35.011 seconds**; observer settlement after **35.014 seconds**. These
differences derive from recorded wall-clock timestamps.

The native monotonic observations separately report
`0.00028833333317379584` seconds for the completion trace and
`35.45841429166671` seconds from submission start to main entry. These broad
elapsed intervals do not isolate queue residence or establish cause.
The late continuation matched the same process and bundle, with the owner
visible, the application inactive and the window not key.

The [typed sample](startup-sample.json) retains one explicit matching
main-thread group and **30 parsed frame rows**, with no omitted or malformed
frame rows. Each row has count **161**. The counts belong to the same sampled
branch and must not be added or described as separate tests.

The branch reaches `semaphore_wait_trap`, through unknown intermediate
frames and owned image-relative offset **355132**. The labels, depths and
relative offsets match the earlier 8a typed projection when counts are
excluded. That comparison does not identify the owned function or wait owner.

The projection establishes a sampled main-thread wait during the pending
request. It does not establish a continuous 35-second wait, historical
causality, a named NSHost/Expo stack or unperturbed startup. Sampling may
affect scheduling. The verifier had not reached its `root-main` mount
check or menu, tooltip and drag checks; actual React mounting remains unknown.

## Verified records and uninspected originals

The complete source/native logs, normalized metadata and exact console
payloads/blocks are retained. The JSON payload files are exact substrings,
without timestamp prefixes or terminating line endings, and were not
reserialized. Envelope files preserve original timestamped lines.
The startup-evidence envelope includes **10 interleaved stderr lines**.
The [provenance](provenance.json) binds every retained file and extraction.

Root independently retrieved the complete original job logs and completed
API metadata, reproduced all six JSON/envelope identities and the hostname
step slice, and checked the timing derivations. These verified bytes remain
separate from the following producer-reported original files:

- Predeadline sample: **233,224 bytes**, SHA-256
  `397ed758a7f148bd0979d4cceefe8845b15018d938dd1b9403da9b921ba80847`.
- Compiler transcript: **12,329,228 bytes**, SHA-256
  `6085e0fef8c23afa2c344a1032b061b7d8e98b010b6532c5489f3ab7d38a63f6`.
- Native artifact **13835092536**: **1,482,523 bytes**, **47 uploaded files**,
  reported SHA-256
  `c55678622445247576403f64e201c82828a705439a879e65a4a857ffad50f244`.

The original sample/compiler files and ZIP remain unextracted and
uninspected here. Their hashes were not independently recomputed from those
original bytes. No earlier receipt, source, ledger, distribution approval or
platform-acceptance status is changed by this outcome record.
