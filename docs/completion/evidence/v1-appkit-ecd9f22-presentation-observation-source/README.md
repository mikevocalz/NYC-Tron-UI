# Popover presentation observations — prepared source checkpoint

**This is a source-only diagnostic change.** It records the native popover's
current control state separately from its last executed presentation branch and
last actual show/containment result. It does not change how the popover is shown,
closed, positioned or focused.

The prepared helper is
`4b75661bdcfbc6159cc87a5b6bec8ecba6f2a586`, tree
`82cf32fbc8ca952d8aa714330f642c9dd8e65896`, with sole parent
`f8c180be8af630886274f71313fa229ea6074001`.
At this **2026-11-11 12:49:09 UTC** checkpoint it was not published or referenced,
and no native run had started for these changes. Root intends to place the four
files directly in the next combined candidate. There is no separate PR62
publication or native build in this checkpoint.

## Why the observation is needed

The completed [9a43033 outcome](../v1-appkit-9a43033-document-popover-not-shown/)
compiled successfully but timed out opening the document inspector before the
minimize test. Its existing failure projection accounted for 369 responses,
one state change and three selected records. All selected records reported
`shown: false`; content visibility changed from true to false. The attempted
frame, controlled React state and native branch reason were unavailable.

That evidence supports further observation. It does not establish placement
rejection, a close-path defect or a behavior correction. The completed failure
and this unexecuted diagnostic are separate records.

## Exact scope

| File | Candidate blob |
| --- | --- |
| Internal native header | `ac9c7077d62cb52650ee5ee36bba1f6b383a4a5f` |
| Native popover implementation | `ecd9f2235d17c4d3bf6a20143c385d72d0dfea63` |
| Private acceptance driver | `6eaeab02acb6af6635a368101bce514bc0c89549` |
| Verifier | `f4e630f147d8bb7f5370531e778ed60acf03a802` |

The [edit manifest](edit-manifest.json) supplies all exact paths, preimages,
sizes, SHA-256 values and nine reversible source transformations.
The native component stores two fixed diagnostic slots. The existing
`tron.popover` call reads them; the existing failed-poll capture projects them.
There is no additional RPC, forced layout, synchronization, input or focus
action.

Historical validity requires the same weak native owner/content/popover
identities, expected command owner and recycle lifetime. Generation, scope-token,
presentation-token and parameter equality are reported separately. A later
controlled-state change therefore does not erase an actual prior rejection
result, but that result remains explicitly historical. Missing captures and
actual native-object/lifetime mismatches produce unknown values.

Only fixed enums, booleans and finite geometry are exposed. Raw tokens,
pointers, arbitrary strings and exception messages stay out of the projection.
The show anchor is labeled as positioning-view coordinates; frame and region
use owner-content top-left coordinates. Sequential observations are not an
atomic current-state or causal proof.

The original show/layout/close/rejection calls, scheduling, event order and
focus behavior are preserved. The original post-show short-circuit property
reads and coordinate-readiness result are cached only as scalars. The
`shown && contentVisible` predicate, 20-second wait, 50-millisecond poll,
request sequence, later assertions and original Error identity remain intact.
The existing eight-record limit, complete 8 KiB envelope limit, exclusive
failure file and secondary reporting-error handling are unchanged. No workflow,
dependency, host setting, permission or public JavaScript API changes.

## Source review and reproducible checks

The author and root both ran the same **eight designs** in
[review-checks.js](review-checks.js). These repetitions do not constitute
sixteen designs or native execution. Root's source review passed; Final's
independent pass was still pending at this historical prepared checkpoint.

The checks cover exact source identities and inverse transforms, preserved
native action/read order, typed unknowns and privacy, historical-versus-stale
binding, getter-free projections, original request/timeout behavior, immutable
first-file retention and complete output limits. The extracted production
JavaScript functions run with mock responses, time and file IO.

Results were **400 requests / 20,000 mock milliseconds**. The ordinary failure
envelope was **6,753 bytes**. The stressed envelope was **7,990 bytes**, retaining
three useful records and recording four removals caused by the byte limit.
The timeout object and request sequence matched the preimage. Native scalar
comparisons are source-form/JavaScript-model checks, not Objective-C execution.

Root and the independent tree review verified the complete **2,050-leaf map**
and recomputed all **284 directory hashes** in both parent and candidate.
Exactly four leaves changed; all other 2,046 IDs, types and modes are identical,
and the sole-parent relationship is verified.

There has been no Node filesystem execution, Objective-C compilation or AppKit
runtime validation of this candidate at this checkpoint. The required next
native compile and acceptance result remain unverified. Full review accounting,
tree proof and reproduction instructions are in
[source-review.json](source-review.json).
