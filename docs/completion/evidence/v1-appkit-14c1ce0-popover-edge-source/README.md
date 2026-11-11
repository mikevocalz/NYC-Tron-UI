# Bounded native popover edge selection — source review

This is a **source-only checkpoint** recorded at 2026-11-11 14:07:07 UTC.
It contains two reviewed source candidates, an exact reversible edit manifest,
and reproducible V8 review checks. No helper ref was moved or CI run dispatched
by the author. Publication and native execution for this candidate are not
established by this receipt.

## Why this change is justified

The separate [completed fc901 outcome](../v1-appkit-fc90103-popover-region-rejection/README.md)
captured an actual returned native show whose full popover frame was
`(-65, 33, 346, 326)` against an allowed owner-content region
`(0, 0, 680, 592)`. The frame extended 65 native points beyond the region's
left edge. The same native owner, content, popover and recycle lifetime were
still bound to that historical observation: `shownAfterCall=true`,
`contentWindowPresent=true`, and `contained=false`. Coordinate readiness was
unknown because the failed-containment branch did not read it.

Later controlled state, generation and tokens differed; the diagnostic preserved
those differences rather than presenting the earlier show as current.
The existing production path rejects an observed frame outside its allowed
region. This establishes the specific failed containment in this run. It does
not identify a unique AppKit placement algorithm, prove delivery of a particular
React callback, or explain an earlier run's failure.

## Source behavior

The candidate tries at most four unique public native edges on the same
`NSPopover`: the configured preferred vertical edge, its opposite, then both
horizontal edges. A cached successful edge may move first only when its exact
owner, positioning view, content, popover, recycle lifetime, scope/presentation,
anchor, region, content size and preferred policy still match. Every use
remeasures actual geometry; the cache does not bypass containment.

Each shown candidate is laid out and measured using its actual full
`NSWindow.frame`, converted into the owner's top-left content coordinates.
The existing full-frame region check and matching-layout coordinate readiness
remain required before initial reveal. Only the initial presentation is hidden;
a retained field and its responder/composition are not recreated between edge
candidates. There is no intermediate close/reopen or additional activation call.

Invocation, lifetime, generation, owner/content/popover, token and parameter
guards abandon stale reentrant work. Diagnostic sequence ownership prevents an
older call from replacing a newer observation. The last-show record describes
the actual final call, adding only a bounded attempt number and a fixed edge
label. A final measured out-of-region result closes and conditionally rejects
the exact owned presentation once. An unavailable shown state or content window
retains its original non-rejection path.

Animation is temporarily disabled as a hint while measuring candidates and
restored in `@finally`. Newer props/recycle animation policy keeps ownership.
Normal restoration errors remain observable. Secondary cleanup handling
preserves an exception already unwinding within the enabled language modes.
The C++ catch is guarded by `__has_feature(cxx_exceptions)`; the Objective-C
handling remains unconditional. The actual generated target exception flags
remain uninspected. This is compile hygiene supporting either mode, not a fix
for an observed compilation failure.

Apple documents updating the anchor and preferred edge of an already shown
popover without requiring a close/reopen. Its animation property is a hint,
so the candidate continues to rely on actual post-layout geometry.
See [showRelativeToRect](https://developer.apple.com/documentation/appkit/nspopover/show(relativeto:of:preferrededge:).md),
[animates](https://developer.apple.com/documentation/appkit/nspopover/animates.md),
[isShown](https://developer.apple.com/documentation/appkit/nspopover/isshown.md),
and [Clang's exception feature query](https://clang.llvm.org/docs/LanguageExtensions.html#c-exceptions).

## Exact scope

| Source path | Preimage blob | Reviewed candidate blob |
| --- | --- | --- |
| `packages/macos-appkit/spark/macos/NYCTronPopover.mm` | `ecd9f2235d17c4d3bf6a20143c385d72d0dfea63` | `14c1ce085e65b7b7f638559f7a7ea159e404173c` |
| `examples/macos-appkit/spark/verify-native.mjs` | `f4e630f147d8bb7f5370531e778ed60acf03a802` | `9bb6dab3c9e378c00050ca3a2472c61eafab7b2b` |

[edit-manifest.json](edit-manifest.json) contains all ten unique forward/inverse
transforms, full byte/SHA-256 identities, invariants and primary-source links.
The native file has nine transforms; the verifier has one small typed
projection insertion. The final native's sole difference from the earlier
reviewed `205fac9` candidate is 82 bytes of compiler-feature guards.

Existing observer, dismissal, focus and recycle behavior outside the stated
cache/identity invalidation edits remains. The acceptance driver, workflows,
host/security configuration and public interfaces are unchanged. The complete
verifier `shownPopover` function and subsequent runtime/assertion suffix are
byte-identical to the preimage: the same `shown && contentVisible` predicate,
20-second deadline, 50-ms polling, command sequence and original error identity
remain.

## Review evidence and its limits

[review-checks.js](review-checks.js) binds the complete source and manifest
identities. Its eight designs contain 157 assertions and pass after immutable
readback. The actual extracted JavaScript uses mocked IO/time: the failed wait
makes 400 requests in 20,000 mock milliseconds; the ordinary and stressed
complete envelopes are 6,892 and 6,032 bytes. The stressed report retains two
records and explicitly counts five byte-budget removals.

The placement, cache, reentrancy and exception scenarios are **non-native policy
models**. In particular, the alternative rectangles are synthetic; they do not
prove a real horizontal or opposite edge will fit this region. V8 does not
compile or run Objective-C, exercise AppKit animation/run-loop behavior, or
perform Node filesystem IO.

Root reproduced the same eight designs on the initial `205fac9` candidate
and authorized the narrow compiler guard. Final independently reviewed the
guarded `14c1ce0/9bb6` source and reproduced the same eight designs against the
final harness. These are repeated designs, not sixteen or twenty-four
independent runtime tests. [source-review.json](source-review.json) records
the separate review checkpoints and exact invocation.

A changed-source native compile and acceptance run are still required.
No alternative native placement, later minimization/restore, physical native
drag session, complete acceptance result or release archive is passed by this
receipt. The completed fc901 failure stays separate and unchanged.
