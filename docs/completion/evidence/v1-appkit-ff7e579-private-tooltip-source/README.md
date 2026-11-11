# Private tooltip provenance correction — prepared source checkpoint

As of **2026-11-11 08:04:31 UTC**, commit `ff7e579c8a6a0863fe9e294458f0a125ec3e64eb` is prepared and **unpublished**. Its tree is `d7ba1cd7f23a68a75fa6c78657909347e5541185`, with sole parent `8e5ee2e3c153d04f67f5d53983b308554a4f969c`. Publication is held while that existing helper's native run remains active. No actual merge, native compilation, or runtime result is claimed for this correction.

The change covers two private acceptance files and their README. It separates public and private text accounting, requires the private source to belong to the selected visible help-tag panel, and retains the saved shown observation in the bounded console report. The private acceptance path was introduced by external a957; this correction adds eligibility and provenance checks to that path. It does not establish public AX/VoiceOver text availability or independently verify rendered pixels.

## Exact source

| Path | a957 preimage | Prepared blob | UTF-8 bytes | SHA-256 |
|---|---|---|---:|---|
| `examples/macos-appkit/spark/acceptance-driver/NYCTronAcceptanceDriver.mm` | `b87bf12633490c1e0f4c17ee081fcd8fcc165919` | `7dc176162c59c879a90fb12d9ebdf070eae62125` | 66,766 | `79cea13e4598c8571888275c92fe69772ecb60f68193a9de69935db222eafcf7` |
| `examples/macos-appkit/spark/verify-native.mjs` | `f21e9349b35922ad689a2f6320ed651b5557de64` | `94a5582ed63893b00b165d9ae93e580fb9e52bc9` | 112,019 | `7e490e8c57774261924c07b825548e846670799564dcb8a2619eb6cdc0d588ba` |
| `packages/macos-appkit/spark/README.md` | `5978122a5d665c27ffeffe865e0fbae61b64a7ab` | `ce95b08424288985ed6cb1e1b2169f67056941cc` | 19,469 | `75beb83db383c90dea906e43c7b5a0618c6504453e472c10f15fb51335145094` |

All three preimages are unchanged in the later 8e5 parent. The external shipping-popover change, blob `ed832b570fff105114885e22dae134e1ac8597d4`, is preserved and is not authored by this correction. Its separately reviewed source moves the dismissal notification to `willClose` while keeping focus handling in `didClose`; no runtime result for that change is inferred here. The private tooltip correction is not an inspector fix or proof of the earlier timeout's cause. Root and desktop independently verified the prepared commit's ordered parent, all **2,050 leaves / 284 directory hashes**, and exactly these three changed paths.

## Evidence that motivates the correction

The retained direct-79a console projection, blob `b1ca1c763ae3fec21653cd97caf3c688fc05f8e2`, shows an observed visible `AXHelpTag` with **zero collected strings**. Across three traversed nodes, nine public value/label/title calls returned nil, three text-field slots were unavailable, and three diagnostic legacy AXValue reads returned nil without exceptions. This proves neither a nonmatching rendered string nor the absence of every public accessibility text attribute. The separately reported standalone attribute-enumeration test was not independently inspected here.

The later a957 verifier, with its private reader, reported the tooltip sequence passed and then timed out waiting for **Native inspector dismissed**. Its console projection retained the outside-after-hover state but omitted the earlier shown observation. The original 32,230-byte tooltip JSON remained uninspected. That outcome therefore did not independently reconstruct the private shown-text provenance. The following native dismissal assertion was not reached; the status timeout alone does not establish that the native popover remained open.

The complete retained source identities and both original log hashes are in [source-review.json](source-review.json). These earlier outcomes are context, not results for the prepared correction.

## Native collector changes

The existing semantic/view traversal, original public getter calls, exception propagation, normalization, length checks, and ordered-set operations remain unchanged. The old interleaved private block is replaced by a separate private pass after the public count is captured.

Three counts now have distinct meanings:

- `current.retainedStrings` is the public ordered-set count before the private pass.
- `private.uniqueStringsAdded` is the count increase across the private pass; a duplicate contributes zero.
- `combinedRetainedStrings` is the final combined count. Private accepted-value count is separate from unique additions.

The private pass uses one actual dynamic `Class` from `object_getClass` for both the exact `NSCustomToolTipDrawView` check and ivar lookup. Before the read, it requires the observed view's window to be the selected help-tag window, the view to belong to its content subtree, and the window/view to satisfy the explicit onscreen and hidden-state checks. Bounds, the visible intersection, and the clipped rectangle converted to selected-window coordinates must be finite and nonempty. The same window, subtree, visibility, and geometry conditions are checked again before nonempty text is admitted.

Missing or mismatched `view.window` is not replaced with another window identity. The ivar must have object type encoding. The added private read/metadata path has its own exception guard; original public failures retain their existing behavior. Private inspection considers at most **eight nodes**, with at most **four detail rows**, shared across help tags in one observation. Unavailable, ineligible, nil, exception, and omitted states remain distinct.

These checks bracket a read; they do not prove continuous visibility or pixel content. Read-count caps are not a duration guarantee. The private class and ivar remain a host/version dependency.

## Verifier and documentation changes

The typed report includes the private counters and bounded details without printing raw text, class names, arbitrary descriptions, paths, or exception strings. Missing or malformed values remain null instead of becoming false or zero.

It now projects the already-retained `shown.observation` alongside the existing last/final observation. Both share the same **16 KiB complete console-envelope limit**. If needed, the reporter removes current, legacy, and private detail rows from both snapshots while retaining counts and omission labels. If that remains too large, the existing explicit `omitted-over-log-limit` fallback applies. The original JSON is unchanged; its complete bounded read is hashed before projection. The existing 1 MiB input budget plus one overflow-detection byte is unchanged.

The exact expected-text, role, nonempty-frame, pointer/owner, and disappearance assertions, native commands, timeouts, startup/watchdog reporters, and primary-error cleanup path remain unchanged. A diagnostic exact-match field cannot replace the original acceptance string predicate. The pointer-sequence flag remains distinct from actual cursor readback or OS delivery acknowledgment.

The README and verifier boundary now qualify the limited 79a getter observations and private-layout dependence rather than asserting that no public attribute can carry tooltip text.

## Review and reproducibility

[review-checks.js](review-checks.js) is immutable blob `519bf417c95b9eec4b7ff32b897924aeed72da0b` (**46,316 bytes**, SHA-256 `a225b896f0d4e4a9b8047a14587f9e4646b199f5099b133344046ffd8268b9c6`). Evaluate the complete file in a fresh V8 isolate and invoke its returned function with `{native, verifier, readme, nativePreimage, verifierPreimage, readmePreimage}`, using the exact six blob strings in the table.

The author ran **eight** focused source, typed-projection, and mocked-report designs. They verify exact source identities/inverses, unchanged public collection/traversal, native source placement and eligibility invariants, public/private accounting, shown/final separation, unknowns/privacy, row limits, exact original-byte hashing, full-envelope trimming/fallback, and secondary-error isolation. The complete envelope measurements are **8,143 bytes** normally, **15,946 bytes** after useful detail trimming, and **643 bytes** for the explicit fallback.

Root and desktop independently fetched the final source and check artifact and reproduced those **same eight designs**, with identical measurements. Root also authored six separate pure projection/source review groups. Desktop authored seven selector and four mocked-IO groups, with independently constructed envelope measurements of 6,859 / 12,095 / 643 bytes. Forge independently approved the final native source, runtime-class/ivar consistency, selected-window checks, public/private accounting, bounded metadata, and exact inverse.

Reproductions are not additional designs. Independent review groups overlap behaviors and are not additive native acceptance counts. These results are **V8/source/mock checks only**: no actual Node filesystem operation, Objective-C++ or Swift compilation, AppKit execution, or new native tooltip observation is claimed. Native compilation and runtime validation remain outstanding at this historical prepared checkpoint.

Public runtime documentation for [object_getIvar](https://developer.apple.com/documentation/objectivec/object_getivar(_:_:).md), [ivar_getTypeEncoding](https://developer.apple.com/documentation/objectivec/ivar_gettypeencoding(_:).md), and [class_getInstanceVariable](https://developer.apple.com/documentation/objectivec/class_getinstancevariable(_:_:).md) supports those runtime operations, not the private AppKit storage layout. The existing [accessibilityChildren](https://developer.apple.com/documentation/appkit/nsaccessibility-c.protocol/accessibilitychildren.md) contract does not guarantee a presented help-tag text value.
