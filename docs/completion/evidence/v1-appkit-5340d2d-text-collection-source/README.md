# AppKit help-tag text collection: source checkpoint

This checkpoint adds diagnostic metadata to the private AppKit acceptance
collector and its existing failure summary. It preserves the collected strings,
their order and deduplication, and the exact tooltip shown/capture/dismissal
requirements.

Published source helper (2026-11-11 03:13:06 UTC):
[5340d2d96412d0fcc5dc7cce21ced037d2de5c7b](https://github.com/mikevocalz/NYC-Tron-UI/commit/5340d2d96412d0fcc5dc7cce21ced037d2de5c7b).
Its tree is `bc0c0f2d8c96965ed54b429bd5269c4c7081bc64`, with sole parent
`a685bd17d3023307181371a9c042bfbc1530c232`. This source checkpoint does not claim
native compilation or execution for the new helper.
Root verified the leased, nonforced helper ref update. A fresh PR head/actual
merge and a new runtime result were still unverified at this receipt.

## Why this observation is needed

The completed a685 native job
[130275751812](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42944976627/job/130275751812)
reached the tooltip shown wait. Its bounded original summary reports both
permission booleans true, the owner visible/key/active, the cursor inside the
trigger, and a cleared pointer-sequence flag. That last flag is not an OS input
delivery acknowledgment.

The same summary reports an `AXHelpTag` in window 41 with frame
`{x:329,y:347,width:213,height:18}`, while the collected strings do not contain
the required literal, **“Save this document's local checkpoint”**. The summary
omitted those strings, and the runtime ZIP remains unextracted. An empty strings
array and an array containing different strings both satisfy that false
comparison. No production binding or extraction defect is established.

The prior full native job log is independently retained as blob
`9744b2175dca3cb995b82977c4e4afef21b8dfd4`, 79,188 UTF-8 bytes, SHA256
`b14b587431abafe08331cc8c323c925e36376de5fa2c33f01f15714750ec2248`.
This folder contains source review material, not a replacement runtime archive.

## Exact source changes

| File under `examples/macos-appkit/spark/` | Original blob | New blob |
| --- | --- | --- |
| `acceptance-driver/NYCTronAcceptanceDriver.mm` | `b01dccc74827a61ce5b2cfe3ededeca5c001b045` | `5a7c3b5c293dced56ad7dc4d28cfee75015288a4` |
| `verify-native.mjs` | `e773cfb2661e80f01daa400f14cd09b903e6b087` | `0b0555a2cb0c37867418600bf9c9fbfbd77e6566` |

The source manifest in [source-review.json](source-review.json) records full
byte lengths, SHA256 hashes and inverse checks. The reviewed tree has 2,048
leaves and 284 tree objects; independent reconstruction confirms exactly these
two changed paths.

The native collector keeps its original traversal invocation and modern getter
order. Supported nonnil accessibility properties still receive the original
presence probe and captured read; nil properties receive one read, and
unsupported properties receive none. The text-field read remains single.
`NSAttributedString.string`, type normalization, the length check and ordered-set
insertion retain their original failure behavior. Diagnostic metadata reuses the
already normalized text and length. There are no added role reads.

After the original result array has been obtained, guarded metadata describes
the existing reads. At most 16 detailed modern records are retained across all
help tags in one observation. Aggregate type/read/empty/nonempty counts continue
over the original bounded collection, with detailed omissions explicit.

A separate diagnostic probes the public legacy
`accessibilityAttributeValue:NSAccessibilityValueAttribute` selector on at most
eight of those already traversed nodes across the observation. It records nodes
considered, supported reads attempted, returns, getter exceptions, selector
exceptions, metadata exceptions and omitted nodes separately. Returns include
nil; nil and exceptions have distinct states. These values never enter the
acceptance strings. The count limit does not guarantee completion time; existing
deadlines remain in force.

Apple documents [coexistence of the older and current accessibility APIs](https://developer.apple.com/documentation/accessibility/integrating-accessibility-into-your-app.md)
and the [public legacy attribute-value getter](https://developer.apple.com/documentation/objectivec/nsobject-swift.class/accessibilityattributevalue(_:).md).
Those contracts permit this observation; they do not promise that a help tag's
legacy value contains its rendered text. No accessibility-help fallback, new
traversal, setter or permission call is added.

## Failure reporting

The verifier reports fixed, typed fields: strings-array type, bounded counts,
read availability/state, value kind, length, nonempty status and exact-literal
classification. Missing or malformed aggregate fields remain explicit null.
Legacy-positive metadata cannot satisfy the original exact text predicate.

The existing full envelope limit remains 16 KiB. If new detail rows push it over
the limit, the reporter drops those rows first and updates their omission
counts, retaining aggregate counts and the latest original tooltip predicates.
The existing explicit generic over-limit fallback remains available. The
reporter still hashes the exact original `tooltip-hover.json` bytes, does not
rewrite that file, excludes raw strings/classes/arbitrary errors, and keeps
reporting failures secondary.

## Checks and limits

[review-checks.js](review-checks.js) contains 14 author-designed review groups.
They execute the actual JavaScript selectors and reporter with in-memory IO and
console adapters, and inspect the native source as text. They cover unknown
versus empty data, exact matching, type/count validation, global caps, privacy,
legacy-positive non-acceptance, original-file hashing, trimming, fallback and
secondary failures. The normal envelope measures 4,240 bytes; the eight-tag
fixture retains its latest observation after detail trimming at 13,674 bytes.

Root, Forge and the desktop reviewer each reproduced those same 14 groups.
These reproductions confirm the same checks; they are not additional test
designs. The desktop reviewer separately authored and passed ten V8/mock-IO
groups. Independent source review approved both exact inverses, the public API
boundary and preservation of original getters/errors.

These checks do not compile Objective-C++, execute AppKit, use Node's real
filesystem, post OS input or establish native tooltip/drag acceptance. Actual
native compilation and runtime remain required. No timeout, command ordering,
native assertion, shipping SDK/API, ledger acceptance or release gate changes.
