# Bounded popover response observation: source checkpoint

This receipt records the verifier-only child
`f8c180be8af630886274f71313fa229ea6074001`, tree
`d6e3e01f3cc6dd3ea913f1135654bb08491211fb`, with sole parent
`bd3ba9af7bba06ab2653806a3acf2525e28927a7`.
At the 2026-11-11 11:39:18 UTC checkpoint it is prepared and unreferenced.
Root plans to integrate this source into the combined candidate for ordinary
native CI, rather than publish a duplicate PR62 native build. No new-source
Node filesystem or native result is claimed here.

## Why this observation is needed

The [completed bd3 outcome](../v1-appkit-bd3ba9a-document-popover-timeout/) passed
the preceding owner-selection and newer-window focus checks, then failed at the
document inspector's existing presentation wait. In executed preimage
`8c3176f220c5b038b2f1c7d1bbbc41dc693606f2`, caller line 1440 awaited
the line-1148 predicate `current.shown && current.contentVisible`.

The retained console output does not expose those two values for the failed
attempt. Its command projection covers only an original-file prefix, while late
transport records show dictionary responses without their payload fields.
The error alone cannot identify the failed term, current geometry or a cause.
It does not justify a shipping popover correction.

The existing `tron.popover` reply already provides the required observations.
This source records a bounded typed subset of those same returned values.

## Exact change and preserved behavior

Only `examples/macos-appkit/spark/verify-native.mjs` changes:

| Identity | Value |
|---|---|
| Preimage | `8c3176f220c5b038b2f1c7d1bbbc41dc693606f2` |
| Candidate | `f79ff69823912de0efb4b6664ede1f14627b9bda` |
| Candidate bytes | 128,984 |
| Candidate SHA-256 | `06da9207bda3fec1b8b599d1de1517c64e124683ba2718800078ef5b2b24b298` |

The [edit manifest](edit-manifest.json) contains exactly two reversible edits:
insert five private projection/retention helpers, then capture responses within
the original presentation wait and rethrow its original error on failure.
The independent full-tree review verified one changed leaf, 2,049 unchanged
leaves and all 284 directory hashes.

The actual predicate, existing 20-second deadline and 50-ms pause, request helper,
post-wait assertion order, successful popover retention, later runtime gates and
cleanup remain intact. No additional driver, owner-selection, focus or UI request
is introduced. No shipping component, native driver, workflow or host/security
setting changes. The new catch reports only wait rejection; later geometry and
native-type assertions retain their existing scope.

## Bounded diagnostic

The projection emits typed booleans or explicit unknowns for native-popover
identity, `shown` and `contentVisible`. It retains finite-or-null frame/region
coordinates and guarded nonempty/containment facts. It exposes only string-shape
presence and equality for the first bounded content-identity string. The actual
string remains private and bounded to 128 code units; those booleans do not prove
native-object presence or liveness. Raw pointer strings and arbitrary
class/token/status/error text are excluded from this projection.

At most eight records retain the first and last responses plus recent projected
state changes, with explicit response/change omissions and safe-counter overflow.
If needed, byte trimming removes intermediate records and recalculates omissions.
The complete console envelope, including markers and newlines, is limited to
8,192 UTF-8 bytes.

On failure the fixed `popover-show-failure.json` is written exclusively with
`wx`; it cannot replace the first file. Write outcomes use fixed status/error
codes. Projection, file and console failures remain secondary to the original
request, process, predicate or timeout error. There is no postfailure witness RPC.

The existing helper workflow `c46871c2` assigns `APPKIT_EVIDENCE` at line 158
and uploads the entire evidence directory under `always()` at lines 162/169.
The aggregate workflow `73a526c3` does the same at lines 177/181/188. The new fixed
JSON file is therefore covered by the existing collector. Actual future file
retention is not established by this source review.

## Focused review

The [reproducible harness](review-checks.js) executes exact extracted JavaScript
functions in V8 with mocked driver, clock, assertions and IO. Its eight designs
cover source identities/inverses, typed unknowns and finite geometry, identity
privacy and safe counts, unchanged successful polling/assertions, original
timeout identity/request sequence, rejection/getter errors, exclusive-file and
console-error isolation, and the eight-record output bound.

Author, root and independent reviewer reproduced the **same eight designs**;
they are not twenty-four independent designs. Source, exact inverse, complete
tree and same-harness review are approved.

The mock timeout retains 400 requests over 20,000 mock milliseconds. Delayed
success uses three polls and 100 mock milliseconds. Complete normal and
eight-record numeric-stress envelopes measure 1,631 and 4,951 bytes.
These are mock observations, not real native timings or response counts.
Whole-verifier syntax checking is parse-only, with no Node filesystem or AppKit
execution claim. [Source review](source-review.json) records the exact scope.
