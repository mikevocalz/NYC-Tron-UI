# AppKit document-inspector presentation timeout

Run [43007235899, attempt 1](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43007235899)
completed with native job `130477798290` failing at 2026-11-11 11:14:26 UTC.
Standalone compilation passed. The first runtime failure was the existing
`shownPopover('document-1')` wait at verifier line 1440, before minimization.

The helper is `bd3ba9af7bba06ab2653806a3acf2525e28927a7`. Both original completed
job logs print actual checkout `2c20b0ea6a2670a744b4199202bbb902de2270a8`.
Its inspected Git metadata gives tree `21b26dbe190f534212be5f546c9f5ac0ebb1a2c6`
and ordered parents
`ac5d69585a52a6e945dc996ea08030e190574699` and this helper.
The [source checkpoint](../v1-appkit-bd3ba9a-active-owner-source/) remains a separate
historical record. This completed outcome does not turn it into a full acceptance pass.

## Exact failed gate

The original stack points to `waitFor` line 1088, `shownPopover` line 1148,
and its caller at line 1440 in executed verifier blob
`8c3176f220c5b038b2f1c7d1bbbc41dc693606f2`.
The existing 20-second predicate is:

```js
current.shown && current.contentVisible
```

The conjunction did not become truthy within the deadline. The retained console
projection does not expose those two values for this attempt. It does not
establish that the popover was never shown, which term prevented success, or
why. The subsequent native-type and frame/usable-region assertions inside
`shownPopover` were not reached for this attempt. No geometry failure is inferred.

## Observed progress before that failure

The exact sequential control flow establishes that both document-window shows
returned, along with their unchanged process/policy/capability and
visible/key/active/frontmost checks. The later main-popover close witness also
returned, followed by the exact assertions that document-1 was key and main was
not key. No window-show failure envelope was emitted.

Shared title/selection, native resize with retained identity, layout restoration,
and native drag-protocol cancellation, rejected transfer and bidirectional
accepted transfer checks returned. That protocol proof uses native source and
destination methods and a real NSPasteboard; the later posted-pointer/
NSDraggingSession gate was not reached. Document close veto, two-window count,
save status and the document inspector's press also returned before the failed wait.

The typed tooltip summary reports passed: native AXHelpTag window 41 matched the
exact expected text predicate and later disappeared. The public-current collector
retained zero strings; one unique string came from the bounded private draw-view
read, with before/after selected-window, subtree and visibility/geometry binding.
Original tooltip-file bytes and screenshot pixels remain uninspected.

All 28 activation records fit the retained projection. Initial operation 1
includes Workspace phases; operations 2–4 each contain six phases ending in
visible/key/active reply-prepared records, consistent with the reviewed direct
owner-selection path. The earlier c4 reopen-cause hypothesis remains unproved.

The 13 preceding check labels listed in provenance are **derived from executed
source control flow**, not a read of the original `failure.json` check array.
Minimize/restore, later close/reopen, posted-pointer/NSDraggingSession transfer,
the final interaction gate and passed-only archive retention remain unexecuted.

## Evidence and limits

This folder retains six original inputs and three derived receipt files:

- Complete [core](source-job.log) and [native](native-job.log) job logs.
- Exact timestamp-stripped [build](build-summary.json),
  [startup](startup-summary.json) and [tooltip](tooltip-summary.json) JSON lines.
- The [original startup marker block](startup-envelope.log), preserving all
  **ten interleaved stderr lines**, including the original failure stack.
- [Normalized completed metadata](completed-metadata.json) and
  [provenance](provenance.json).

Each source/native log and extracted line/block was independently hashed and
read back from its immutable Git blob. Markers must be standalone lines after
timestamp removal; echoed workflow source is excluded. Startup, tooltip and
build each have exactly one such begin/end pair and one JSON line. Build and
tooltip blocks have no stderr interleaving. There is no window-show failure
envelope or predeadline observer envelope in this completed log.

The startup projection reads 262,145 of 630,040 command-file bytes, selects
32 of 495 matched prefix records, and ends at request 246. The live-log transport
projection records later successful dictionary replies through request 604,
but does not expose popover payload fields. Its 32 selected records omit 2,988
others. Raw commands, late original values and the current presentation geometry
remain uninspected. The fixed live-app-log snapshot hash is not a final app.log hash.

Core checks passed 13/13; consumer tests 16/16; public API matched 15 subpaths
and 33 reachable declarations; the separate native Foundation/socketpair probe
passed seven cases. Standalone compilation succeeded, native exercise failed,
and tested distribution retention was skipped.

Artifact `13850116951` was reported as 54 files, 1,731,629 ZIP bytes, SHA-256
`99f366a9723c7c80e66235520dcbc4c68bad0ee97fa47c9c920d9ed4684f48a6`.
That archive was not extracted. Compiler, snapshot, original tooltip/process
and sample-file hashes remain producer-reported until their bytes are inspected.
The before/after-sample zero exit codes belong to `ps` diagnostic commands,
not the application. Uninspected postfailure sample stacks do not prove a cause.

No retry, source alteration, host/security change or acceptance relaxation was
performed while retaining this outcome.
