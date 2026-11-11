# PR62 reviewed AppKit acceptance source

This is a **published source-only checkpoint** for [draft PR62](https://github.com/mikevocalz/NYC-Tron-UI/pull/62), observed at **2026-11-11 09:09:06 UTC**. It records the reviewed private-tooltip accounting and native popover close-completion witness. It does not record a native compile or acceptance pass for this candidate.

The open draft was created at 09:04:54 UTC. Its head was `e08679769e471aba5403cd864c8a2fa2310b9086` on `codex/v1-appkit-reviewed-acceptance-nov11`, targeting `codex/v1-completion` at `ac5d69585a52a6e945dc996ea08030e190574699`. This separate review branch preserves the external PR59 source history. At this checkpoint, PR metadata reported merge SHA `001763090bc16a9e72143022bf04543c5acd39b6`; that initial metadata read did not verify the merge's tree, parents, checkout, or runtime. Root subsequently verified the generated merge with the exact reviewed b4f tree and ordered parents [ac5d, e086]. Root reported source job 130427396629 completed and native job 130427608864 compiling. This receipt does not assert a source test count/conclusion from that metadata or a verified native checkout/runtime result; the completed original native log was still awaited.

## Exact source and tree

| Identity | Value |
| --- | --- |
| Candidate commit | `e08679769e471aba5403cd864c8a2fa2310b9086` |
| Tree | `b4f409fbf1af7a5de5c4d2eab0c73bd55806d6de` |
| Sole parent | `057b3aa7a28c12594f26dd4bc9baf9bc636610e8` |
| Parent tree | `da0cbf6c7dedd2505a963db67d53d8f2810f23d2` |
| Verified tree scope | 2,050 leaves and 284 directory hashes |
| Changed paths | Three; every other 2,047 leaf and mode is unchanged |

| Changed file | Preimage | Final blob | UTF-8 bytes |
| --- | --- | --- | ---: |
| `examples/macos-appkit/spark/acceptance-driver/NYCTronAcceptanceDriver.mm` | `353fa05f0f2e0e939538c7fbaacdcdb449f44bd8` | `bdd64d6becb859622bd024fce036482fc668a91f` | 75,735 |
| `examples/macos-appkit/spark/verify-native.mjs` | `f21e9349b35922ad689a2f6320ed651b5557de64` | `d21bf8d24520183a61bf6b82879d78bd6a9d322f` | 114,435 |
| `packages/macos-appkit/spark/README.md` | `5978122a5d665c27ffeffe865e0fbae61b64a7ab` | `ce95b08424288985ed6cb1e1b2169f67056941cc` | 19,469 |

Root and the independent final-gate reviewer fetched the remote candidate, parent and complete trees, recomputed all directory hashes, compared every leaf and mode, and read back the exact changed source. Shipping `NYCTronPopover.mm` remains blob `9e00e3d966569b5fc2c03dac2432fdfe67548177`. Workflows and dependencies are unchanged. Full source SHA256 values and the three-file edit manifest are in [source-review.json](./source-review.json) and [source-edits.json](./source-edits.json).

## What the reviewed source changes

### Tooltip source accounting and selected-window binding

The inherited private-tooltip reader now records public retained strings, private unique additions, and the combined total separately. It preserves the original public getter order and call counts, normalization, traversal and ordered-set behavior. The original current-read operations remain outside the additional private diagnostic guards.

Private acceptance text must come from the exact dynamic runtime class `NSCustomToolTipDrawView` and its checked `_attributedString` ivar, using the same captured runtime class for the class test and ivar lookup. The read is bracketed by eligibility checks against the selected help-tag window: exact window identity, content-subtree membership, onscreen/visible state and finite nonempty clipped geometry. Missing, ineligible or exceptional private reads contribute no accepted string.

The shared private budget permits at most eight considered nodes and four detailed rows per observation. The verifier's typed failure summary retains both the earlier shown observation and the last/final observation within the existing **16 KiB** envelope. Detail trimming and the generic fallback remain explicit. The original evidence JSON remains separate.

The exact expected text, new help-tag role/frame, pointer and owner checks, dismissal, permission predicates and deadlines remain required. This is host/version-dependent private-layout evidence. It is not a public AX/VoiceOver text guarantee or independent pixel-content proof. The README and verifier qualify the earlier broad public-attribute claim to match the retained observations.

### Native popover close-completion witness

A private fixture observer is armed while the same popover is shown in two scenarios: before Escape, and before showing the other window can auto-close the main transient popover. It observes object-specific will-close and did-close notifications without changing the shipping delegate or focus behavior.

The observer uses weak owner/component/popover references, exact live-object identity and generation checks, and at most two arms. Notification counters are capped at eight. Tokens are removed after did-close, invalid identity/error, rearm/release, deallocation, or a 60-second cleanup expiry. The expiry neither supplies completion nor extends the verifier deadline.

Completion requires the same nonempty content identity and arm generation, the same native objects, did-close observed on main, a subsequent owned main-queue turn, `shown === false`, and no unavailable/expiry/release/thread/counter condition. Will-close is retained as evidence but is not an additional required completion predicate. Missing, empty or numeric content identities cannot satisfy arm or completion.

Apple documents [did-close after offscreen animation](https://developer.apple.com/documentation/appkit/nspopover/didclosenotification.md), while [isShown can become false when close/performClose is invoked](https://developer.apple.com/documentation/appkit/nspopover/isshown.md). The new witness addresses that source-level ordering gap. It does not assume notification-observer ordering or infer the delegate's focus result from observer entry. The existing exact opener/responder and newer-window focus assertions still determine that result.

The original Escape/close commands, React status wait and original error, **20-second close wait**, polling behavior and strict focus assertions are retained. No arbitrary sleep or timeout extension was added. No completed native run in this receipt demonstrates that the witness repairs a runtime failure. The separately prepared App counter and post-status-failure reporting were deferred and are not included.

## Preservation of the external 057 activation block

The final native file carries the externally published 057 activation block verbatim. It conditionally requests Regular policy and then reads back the resulting policy. Its `policyAccepted` variable and trace field therefore describe observed policy state, not the setter's return Boolean.

This receipt does not adopt the inherited comment's categorical explanation of the previous false return as independently established causality. The entire `tron.window` registration through end of file is byte-identical to 057's native blob `353fa05f`.

The earlier source review targeted `6f119bca→06c9494f`. The single 372-byte external activation transform maps `6f119bca→353fa05f` and, independently, `06c9494f→bdd64d6b`. The same tooltip and close-witness edit stages applied directly to 353 produce bdd. Both directions were checked exactly.

Desktop's separate d83 policy correction, native451 and the old prepared448 commit were superseded before publication. They are not part of e086. The source receipt keeps that distinction instead of treating the old 0bee-based candidate as the published source.

## Review and reproducibility

[review-checks.js](./review-checks.js) is the **unchanged** original harness, Git blob `18b6d60c24d99fcc45a323e1e4a891dd98a0bd0d`. Its eight designs use source invariants and extracted JavaScript with mocked command/time behavior. They cover exact source inverses, native ownership/cleanup source invariants, arm identity, typed completion, Escape ordering, original Error identity, the earlier arm before transient auto-close, and the unchanged timeout/focus failures. Native observer behavior is reviewed statically, not executed by those mocks.

The author passed those eight designs on **06c/d21 with 6f/f21 preimages**. Root reproduced the same eight designs. Forge independently reviewed the native source and exact inherited-tooltip composition. These reproductions do not create additional independent designs or native acceptance results. The earlier harness was not rerun during this packaging step.

[composition-checks.js](./composition-checks.js) adds **one composition-only V8 group**. It verifies all pinned source bytes, exact three-file forward/inverse transforms (10 native, eight verifier, one README), both 057 activation mappings and their inverses, and the unchanged final activation tail. It neither executes the original eight designs nor invokes Node filesystem, process, Objective-C++, or AppKit APIs. Its exact input hashes are embedded in the script. Root subsequently reproduced the same one composition-only group, including all 10/8/1 edit inverses and the 372-byte activation delta; that reproduction is not a separate design.

For reproduction, evaluate each complete harness file in V8 to obtain its function and provide exact decoded UTF-8 blob strings:

| Harness | Input mapping |
| --- | --- |
| Original `review-checks.js` | `native=06c9494f…`, `verifier=d21bf8d2…`, `nativePreimage=6f119bca…`, `verifierPreimage=f21e9349…` |
| New `composition-checks.js` | `native=bdd64d6b…`, `verifier=d21bf8d2…`, `readme=ce95b084…`, `nativePreimage=353fa05f…`, `verifierPreimage=f21e9349…`, `readmePreimage=5978122a…`, `legacyNativePreimage=6f119bca…`, `legacyNative=06c9494f…`, and `manifest` containing exact `source-edits.json` bytes |

The original manifest `2f70151b66e93b4db8bf6ee3f25da6b96edb401d` targets the historical 6f/06c composition. The included updated [source-edits.json](./source-edits.json) preserves those edit stages and explicitly binds the final 353/bdd composition, verifier and README. It records all replacement spans, not reconstructed snippets from memory.

The complete final verifier also passed V8 parsing after only module-import removal and replacing `import.meta.url` with a literal. Its body was not executed by that syntax check.

**No actual Node IO, Objective-C++ compilation, native observer delivery, AppKit activation, tooltip, close, or focus execution is claimed for e086 at this checkpoint.** A later run must establish those results independently. This receipt author created and read back immutable blobs only.
