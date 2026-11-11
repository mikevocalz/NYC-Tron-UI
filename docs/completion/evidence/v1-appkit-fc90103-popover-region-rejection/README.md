# AppKit fc90103: actual popover placement rejected by the allowed region

[Run 43026784631, attempt 1](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43026784631/attempts/1) compiled the native application, then failed the document inspector's shown-popover wait. The new diagnostic retained an actual show that returned `shown=true` with a content window, but whose full native frame extended **65 points left of the allowed owner-content region**.

This is a concrete observation from this execution. It does not retrospectively establish the cause of earlier runs or validate an alternate placement.

## Exact execution and first failure

The published combined head was `fc901030ba1e0eed1b399ad0a3100529bf97e52f`, sole child of `9a430338d8336283b230203a8555257798fcd62c`. Both complete originals print actual checkout `255b63f5800cfbd2cbc7fa27ed6e1cad477c14c6`, tree `5acadef01a5fcafa3600949e7c50e730aa3663e9`. Its ordered parents are the isolated comparison base `25a6af6d020e34d790f6a4f3d9f117738b252f1e`, then the published head.

Core job **130543378154** passed 13 tests with zero failures, cancellations or skips. Native job **130543725501** passed the 16 consumer tests, the installed API snapshot (one package, fifteen subpaths, thirty-three declarations), the seven original/patched native transport-probe cases, and application compilation. The native exercise failed; the tested-distribution retention step was skipped.

The first error is `Timed out waiting for shown native NSPopover`. The executed verifier is `f4e630f147d8bb7f5370531e778ed60acf03a802`: waitFor line 1088, shownPopover line 1347, caller line 1647:

```js
const beforeMinimizePopover = await shownPopover('document-1');
```

The existing `current.shown && current.contentVisible` predicate, twenty-second deadline and fifty-millisecond polling remained unchanged.

## What the presentation observation establishes

The failure capture saw **375 returned responses and one projected state change**. It retained responses 1, 2 and 375; 372 responses were omitted, with no omitted state changes or byte-budget removals. Capture and overflow flags were false.

| Observation | Recorded value |
|---|---|
| First response | shown=false, contentVisible=true, controlledVisible=true; no prior actual-show record available |
| Second and last responses | shown=false, contentVisible=false, controlledVisible=false |
| Historical actual show | returned; shownAfterCall=true; contentWindowPresent=true; contained=false |
| Actual full native frame | x=-65, y=33, width=346, height=326 |
| Allowed owner-content region | x=0, y=0, width=680, height=592 |
| Show anchor, positioning-view coordinates | x=28, y=359, width=160, height=36 |
| Current requested content size / preferred edge | 320 by 300 / above |
| Coordinate readiness for the rejected show | unknown; that check was not reached after failed containment |

The frame's right edge is 281 and bottom edge 359, so its vertical extent fits; the observed failure is its left edge. Both observed horizontal centers equal 108. That arithmetic does not identify a unique internal AppKit placement algorithm.

The retained show is explicitly **historical**. Weak native owner/content/popover identity and recycle lifetime still match, while generation, scope-token, presentation-token and parameter equality are false. Those false comparisons are preserved; the observation is not relabeled as current state. The later current branch is `content-prerequisites`, after controlledVisible became false.

In executed native source `ecd9f2235d17c4d3bf6a20143c385d72d0dfea63`, showRelativeToRect is at line 262, the actual full-frame containment check at 281, and its failed branch at 293–305 closes silently and conditionally emits presentation rejection. The captured actual frame and contained=false support this rejection path in this execution. Delivery of a particular React callback is not separately traced.

## Earlier progress and gates not reached

Sequential control flow proves that the preceding main-popover close witness, document.key=true/main.key=false checks, document close veto, two-window count, save/status and document inspector press returned before line 1647. This is partial progress for this exact execution, not a complete application pass.

The before-minimize identity capture, document minimization/restoration and retained-content assertions, remaining close/reopen checks, later physical NSDraggingSession acceptance and final required-checks result were not reached.

The actual hover tooltip check passed. Its selected AXHelpTag window 41 had an exact matching string supplied by the bounded private draw-view collector with before/after window, subtree and visible-geometry binding. Public current getters retained zero strings, and all three legacy diagnostic reads were nil. This does not assert a successful public AX text getter or independent pixel inspection.

## Retained originals and limits

The receipt preserves eight byte-exact inputs:

- Complete [core original](source-job.log) and [native original](native-job.log).
- Exact timestamp-stripped [build](build-summary.json), [startup](startup-summary.json), [tooltip](tooltip-summary.json) and [popover](popover-show-summary.json) JSON lines.
- Original timestamped [startup block](startup-envelope.log), including ten interleaved stderr lines, and [popover block](popover-show-envelope.log), with no interleaving.

Their Git IDs, byte counts, SHA256 values, exact original locations and derived fields are in [provenance.json](provenance.json). [Completed metadata](completed-metadata.json) separately records the attempt-specific jobs, steps and artifacts. All eight original blobs were fetched back and compared byte for byte.

The startup projection retained all 28 activation records, but only 32 of 3045 transport records. Its command-file read covered 262145 of 1132599 bytes, retaining 32 of 463 matched records within that prefix; 870454 bytes remained unread. The fixed live app-log snapshot is not a hash of the eventual app.log. Process-sample stacks remain uninspected; the before/after zero exit statuses are ps observations, not an application exit result.

Native artifact **13859432889** is reported as 1,739,858 bytes with SHA256 `5b56b33495a5584e8547ae6aa8648aa119d7b6cc5c5614d5b9057424ec7b664b`; the uploader reports 56 files. Original ZIP/member bytes, screenshots, compiler transcript, app snapshot, complete commands, process/sample files, tooltip file and installed SDK input payloads were not extracted or inspected. Their reported hashes remain producer evidence. The popover failure file was reported retained, but its original member bytes were not read independently.

No source change, ref/PR update, retry, dispatch, host/security/TCC/launcher change or alternate executor was used to retain this outcome. Any later placement correction needs its own exact source review and native result.
