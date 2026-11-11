# Combined AppKit run: document popover did not become shown

**The native build passed, and native acceptance failed while opening the document
inspector before the minimize test.** The new captured-response diagnostic records
`shown: false` in the first, only changed, and final projected states. It does not
identify the internal presentation or close branch that produced that state.

This is the completed result for combined draft PR64 head
`9a430338d8336283b230203a8555257798fcd62c`, AppKit
[run 43015170958, attempt 1](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43015170958/attempts/1).
The native job completed with failure at **2026-11-11 12:10:49 UTC**.
No retry, source change or host change is part of this receipt.

## Exact executed source

Both original job logs identify generated merge
`e8f8c19db909a53f3054976449a7571b2a0524e9`. Its tree is
`434f2cfa1a001bcec73788462e42957206819328`, with ordered parents
`ac5d69585a52a6e945dc996ea08030e190574699` and
`9a430338d8336283b230203a8555257798fcd62c`. The immutable merge metadata and
complete, untruncated tree listing agree with those identities. The checkout
record in the logs is separate from the workflow's head metadata.

The executed verifier is
`f79ff69823912de0efb4b6664ede1f14627b9bda`; the private native driver is
`7df9831d697b7815cd7662ea3317a331cf9570e7`. The shipping popover source is
`9e00e3d966569b5fc2c03dac2432fdfe67548177`, and the example App source is
`8826fb256b24b780450ee2634ad78dad457642dd`.
Exact paths, source-control-flow locations and metadata are in
[provenance.json](provenance.json) and
[completed-metadata.json](completed-metadata.json). This is execution of the
combined candidate; no later or external head is implied.

## Passed stages and the held gate

| Stage | Actual result |
| --- | --- |
| Canonical core archive and native-driver contract source suite | 13 passed; 0 failed or skipped |
| Native consumer preparation source tests | 16 passed; 0 failed or skipped |
| Installed public API snapshot | 1 package, 15 subpaths, 33 reachable declarations matched |
| Foundation/socketpair transport probe | Seven original/patched native cases passed; separate from application acceptance |
| Standalone ARM64 application compilation | Passed; build exit code 0 |
| Native controls and window-lifetime exercise | Failed at the document popover presentation wait |
| Evidence upload | Completed; uploader reported 56 files |
| Exact natively tested distribution retention | Skipped |

The exact error is `Timed out waiting for shown native NSPopover`.
The original stack identifies `waitFor` at verifier line 1088,
`shownPopover` at line 1280, and the caller at line 1580:

`const beforeMinimizePopover = await shownPopover('document-1');`

The existing predicate remains `current.shown && current.contentVisible`, with
the existing 20-second wait and 50-millisecond poll delay. The diagnostic uses
only replies already returned by those requests.

## What the new popover observations establish

The projection accounted for **369 returned responses**, **one projected state
change**, and **three selected records**. It omitted 366 unchanged responses,
no state changes and no records for the byte budget. Capture failure and counter
overflow are both false.

| Response | Selected role | nativePopover | shown | contentVisible | Identity matches first |
| --- | --- | --- | --- | --- | --- |
| 1 | First | true | false | true | true |
| 2 | Only projected state change | true | false | false | true |
| 369 | Last | true | false | false | true |

All three records have a finite positive region of 680 by 592, but no frame.
Actual attempted placement and frame containment therefore remain unknown.
The identity field is bounded string equality; it is not a native-liveness
proof. The trace establishes the failed presentation predicate, without
distinguishing controlled React state, an early native return, placement
rejection, a close path, or another cause.

The exact [popover JSON line](popover-show-summary.json) is 1,995 bytes.
Its [original timestamped envelope](popover-show-envelope.log) is 2,153 bytes
and has no interleaved lines. The runner reports that
`popover-show-failure.json` was retained. That original artifact file has not
been extracted here, and the console record does not advertise its file hash.

## Earlier progress and remaining scope

The executed verifier is sequential. Before the failing call, its
object-bound popover close-completion wait and the exact newer-window focus
assertions returned: document key true and main key false. The subsequent
close-veto status, two-window assertion, save status and document-inspector
press also returned. These are source-control-flow deductions tied to the
actual failure location, rather than a successful final acceptance report.

The corrected tooltip check separately passed. Its typed evidence records an
actual visible `AXHelpTag` window 41 with the expected-text predicate true.
The public current getters retained zero strings. One private draw-view
attributed-string value was accepted and added uniquely after the exact
selected window, content subtree and visible geometry were checked both before
and after the read. The final outside-after-hover observation has zero help
tags. This is explicitly private collector evidence, not a public
accessibility-text getter success.

The document content-identity read immediately after line 1580, owner
minimization, deminiaturization/content retention, later close/reopen checks
and the later physical-session exercise were not reached. The current
observations cannot be assigned retroactively to the earlier bd3 failure,
whose corresponding response fields were unavailable.

## Retained originals and inspection limits

This folder retains the complete
[canonical core log](source-job.log) and [native log](native-job.log),
plus exact timestamp-stripped [build](build-summary.json),
[startup](startup-summary.json), [tooltip](tooltip-summary.json) and
popover JSON lines. These lines were not parsed and reserialized.
The [startup envelope](startup-envelope.log) preserves all **ten interleaved
stderr lines**, including the original error stack, blank lines and Node
version. Standalone marker recognition excludes echoed workflow source.

Every retained log and payload was hashed and read back from its immutable
Git blob. The native original is 93,895 UTF-8 bytes, SHA-256
`3fdf9c8c0bff3c056e4596e5c9732046140da898da9efc0343f8902564575d90`.
The core original is 19,626 bytes. Exact sizes, Git identities, digests and
extraction locations are in the provenance file.

The startup projection read 262,145 of 633,266 command-file bytes; 371,121
observed bytes remain unread. Its 32 selected command records come from
491 matched prefix records, with 459 omitted records and a partial trailing
line. The live app-log snapshot is a fixed read-time capture, not a hash of
the eventual complete app log. The selected process record has a null
application-child exit code; the two zero exit codes around sampling belong
to the `ps` commands, not to the app.

Native artifact **13852884202** is reported as 1,739,281 bytes with ZIP SHA-256
`fa2658d38181fc56db48c41e9ae649edf496930275a4d8af2dcb0ac49adc81d7`.
The artifact ZIP and its members, screenshots, full command tail, app-log
snapshot, sample stacks, compiler transcript and installed SDK inputs remain
unextracted and uninspected. Their hashes in the console or artifact API are
**producer-reported**. They must not be confused with the independently
rehashed logs and exact console payloads retained here.

No root cause, shipping correction, current rendered pixels, full native
acceptance pass or releasable tested distribution is established by this
receipt.
