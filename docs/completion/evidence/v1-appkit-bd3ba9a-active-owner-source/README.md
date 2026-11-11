# AppKit verified active-owner selection: source checkpoint

This receipt records the three-file correction at `bd3ba9af7bba06ab2653806a3acf2525e28927a7`, tree
`21b26dbe190f534212be5f546c9f5ac0ebb1a2c6`, with sole parent
`c4d4148c6135b9e3054255d9e35a950bef959b71`. This immutable commit was
published by root at 2026-11-11 10:52:22 UTC, with exact ref/PR62 postreads
at 10:52:35. The generated merge `2c20b0ea6a2670a744b4199202bbb902de2270a8`
was independently fetched at 10:53:23: the tree matches, and its ordered parents
are `ac5d69585a52a6e945dc996ea08030e190574699` followed by this helper.
Native run 43007235899 attempt 1 is still preparing its consumer; compilation and
acceptance results remain pending. This records a source change and bounded
review, not a completed native gate.

## Observed failure and source rationale

The completed [c4 outcome](../v1-appkit-c4d4148-document-key-timeout/) failed during
the **first** `document-1` show, activation operation 2. Its earlier native
reply-prepared record reported the document key. The existing polling diagnostic
then recorded 354 returned inspections with no projected state change:
`key=false`, while process identity, Regular policy, key capability, visibility,
application activity and frontmost-process identity were all true. The receipt
retains first/last observations and explicitly accounts for 352 omitted responses.
It does not identify a replacement key window or the callback that changed focus.

The original fixture requested `NSWorkspace.openApplication` for every owner
show. In the [retained Spark 0.0.2 source](https://github.com/LegendApp/legend-spark/blob/d3a7eead32459f8f6baf29ef868ea732c5081e47/packages/desktop-host/AppDelegate.mm),
`applicationShouldHandleReopen:hasVisibleWindows:` defaults to the main
`self.window` and can call `makeKeyAndOrderFront:`. Apple documents
[application-specific reopen handling](https://developer.apple.com/documentation/appkit/nsapplicationdelegate/applicationshouldhandlereopen(_:hasvisiblewindows:).md)
and a [default Apple event as needed for an already-running instance](https://developer.apple.com/documentation/appkit/nsworkspace/openconfiguration/appleevent.md).
That is a reachable reason to distinguish app activation from selecting one owned
window. It does **not** prove that this callback ran or caused c4's failure.

The retained upstream revision is `d3a7eead32459f8f6baf29ef868ea732c5081e47`;
AppDelegate blob `a6734d1a57b3d9759606d54c7dfef564ec08efda` is 11,910 bytes,
SHA-256 `24fca513cc8188f98dbf0b3cdd1cc3d2a819c331790e9bad9eea46fda66dbb46`.
The repository pins Spark 0.0.2, its installer verifies published package hashes
and records the release revision, and the fixture has no reopen-policy override.
The current run's original `spark-sdk-inputs.json`, installed AppDelegate bytes
and compiler transcript remain uninspected. This is pinned-source analysis,
not proof of current compiled-source equality.

## Correction and preserved gates

The initial and inactive paths retain the original
[Workspace activation](https://developer.apple.com/documentation/appkit/nsworkspace/openapplication(at:configuration:completionhandler:).md),
including actual returned-PID and resolved-bundle checks. Only after those checks
succeed does the private fixture retain that identity. A subsequent owner request
uses public [window selection](https://developer.apple.com/documentation/appkit/nswindow/makekeyandorderfront(_:).md)
only when that verified identity still matches and the exact current process is
Regular, active and frontmost. Otherwise it follows the complete original
Workspace path. The response reports the actual path.

The verifier still requires Workspace for initial startup. A subsequent direct
path requires literal Boolean identity attestation and the same process ID.
Process, policy, key capability, visible/key/active/frontmost state, the existing
20-second poll, request sequence and original error identity remain strict.
The current foreground snapshot is not a guarantee of subsequent success; the
unchanged actual-state conjunction remains the acceptance gate.

Only the private driver, verifier and their README change. There is no shipping
component, workflow, host, permission, launcher, security, retry or deadline change.

## Exact source scope

| File | Preimage blob | Candidate blob |
|---|---|---|
| `examples/macos-appkit/spark/acceptance-driver/NYCTronAcceptanceDriver.mm` | `bdd64d6becb859622bd024fce036482fc668a91f` | `7df9831d697b7815cd7662ea3317a331cf9570e7` |
| `examples/macos-appkit/spark/verify-native.mjs` | `ae88774e652cab55d556b5cd94da0a85d2505a45` | `8c3176f220c5b038b2f1c7d1bbbc41dc693606f2` |
| `packages/macos-appkit/spark/README.md` | `ce95b08424288985ed6cb1e1b2169f67056941cc` | `97a554f649de9663913895e416c45cd51e24a873` |

The [unchanged edit manifest](edit-manifest.json) contains all five unique
forward/inverse transforms: three native insertions, one verifier replacement
and one README paragraph. [Source review](source-review.json) records exact
sizes/hashes and the failure/source boundaries.

## Focused review

The author, root and final reviewer passed the **same six** designs in the
[reproducible harness](review-checks.js), not eighteen separate designs. They cover
exact identities/inverses, initial Workspace enforcement, subsequent path and
identity checks, the unchanged actual-state conjunction, timeout/error/command
preservation, and request/inspection rejection.

The timeout case performs 400 polls and 401 commands over 20,000 mock milliseconds;
the delayed success case takes three polls and 100 mock milliseconds. The mock
timeout console envelope is 1,160 bytes. These use exact JavaScript functions in
V8 with mocked driver, clock, assertions and IO. Whole-verifier syntax checking is
parse-only. Objective-C++ ownership/API behavior received static review.
**No Node filesystem, Objective-C++ compilation or AppKit execution is claimed.**

The actual changed-source native run remains the next validation gate.
