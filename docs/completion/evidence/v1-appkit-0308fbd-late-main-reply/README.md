# AppKit: native probe passed, initial reply arrived after timeout

[Run 42898902137](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42898902137)
passed eleven source checks, installed-consumer preparation/API validation,
the actual ARM64 Foundation/socketpair probe and native app compilation. The
application gate again failed on initial `waitFor(root-main)` request 2 before
activation or any interaction check. No passed-only AppKit package was produced.

Head `0308fbdba914904141e84289e4453b6c17040ce0` and actual checkout
`1afc900939903a5f1abb8b7144f5ad8543e9939d` independently match tree
`4c214574e504dfccc6b223778b59cdc996aa4ea0`.

## What the native trace establishes

| Event | UTC time |
|---|---|
| Request received | 21:07:00.993462 |
| Main dispatch | 21:07:00.993858 |
| Unchanged client deadline expired | 21:07:35.998 |
| Live process sample began | 21:07:36.190 |
| Main reply | 21:07:36.275315 |
| Serialized 90 bytes successfully | 21:07:36.275663 |
| Sent 91 bytes including newline | 21:07:36.275730 |

The reply arrived about 35.281 seconds after main dispatch. No serialization
failure occurred and no failure replacement was used. This localizes the delay
before reply in this attempt; it does not explain why the native 20-second wait
failed to finish before the 35-second client deadline. The late response payload
was discarded by the terminal client and is not retained. Its length cannot
establish whether it reported timeout or success.

The owned process remained present before and after sampling; the sample has
27 thread groups. Capture began after the client timeout, so it cannot establish
the main thread's complete preceding state. Activation, tooltip hover, actual
NSDraggingSession and gesture permission were not reached.

## Actual Foundation/socketpair findings

The harness called the exact extracted original and patched send functions on
the real Mac runner. Both preserved the finite reply and its framing, producing
94 bytes. All six invalid cases—NaN, positive/negative infinity, an unsupported
object, nil and the deliberately throwing container—threw from the original
sender without sending bytes. Every patched case sent an explicit
`E_SERIALIZATION` failure. Fixture construction, trace privacy and closed-peer
failure checks passed. None of these controlled cases demonstrated the possible
silent nil-return path, and none diagnoses c0's earlier unanswered request.

Before/after sources, the original function renamed only for linking, the exact
patched function, probe source and trace independently match their receipts.
All four patch inputs match the actual checkout. The complete native compiler
log names the patched installed SparkTestDriver.mm input and records
`BUILD SUCCEEDED`. The wrapper recorded the probe executable's hash; that
executable is not included in the original artifact, so it was not independently
compared here.

## Original retention

All 42 original members were compared byte for byte. The original ZIP remains
unrepacked: 837,416 bytes, SHA-256
`d767b238933e0a2445672a24abab21ff776a77c2465ee53bbbe61579a9e580c5`.
The 41 smaller members are also retained under `originals/`, including both
SDK source versions and Spark's license. The complete 12,299,645-byte native
compiler log remains inside that ZIP, SHA-256
`f1f0950a6c7961899632a1cb5f68391f50f270978ae87e29519f1f35a69ad6f2`.
The complete original source-job log and completed workflow metadata are retained
alongside the file, checkout and provenance receipts.

The next verifier revision moves its existing strict native show/activation
operation before the unchanged React-root wait. The pinned host creates the
owned main window and placeholder before React, and the command does not depend
on Fabric mount. This is a supported interactive-test ordering correction, not
a claim that the preceding delay's cause or a new native pass is established.
