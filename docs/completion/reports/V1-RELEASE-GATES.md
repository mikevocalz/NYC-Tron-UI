# v1 release-gate evidence

Recorded 2026-11-10; current desktop/browser results updated 2026-11-11.
This report covers distribution, installed consumers,
public API declarations and provenance. The twelve native/Forge integration
rows and their platform acceptance are tracked separately in
[V1-PLATFORM-CLOSURE.md](V1-PLATFORM-CLOSURE.md). No tag, release, npm publish or
blanket device-acceptance claim is created by this report.

## Current desktop gate boundary

The complete native desktop gates remain open for the reviewed combined candidate.
Original failures, source corrections, cancellations and native outcomes have
separate receipts; source or compiler passes do not establish interaction results.

### November 11 AppKit inspector progress and second-window activation

[Completed attempt 1 of run 42985584907](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42985584907/attempts/1)
tested external helper `0bee669639a5d9ffaa7c456343344ccd42283c04` through
actual merge `3f9d3ad376bd6b4514ca691997c56dfc74888bec`, tree
`9ac7c175174b52dbb0bdc987ea199f30214d4c62`. The complete 2,050-leaf map,
all 284 tree hashes and ordered merge parents were independently verified.
The thirteen source checks, sixteen installed-consumer tests, API declarations
and seven native transport-probe cases passed; standalone compilation succeeded.

The original native log reaches verifier line 1212, `show('document-1')`,
after the earlier inspector assertions returned: application dismissal status,
native hidden state, exact opener responder identity, reopening, retained
content identity and edits, and controlled close. The subsequent sidebar,
appearance and controlled-text checks also returned. This is an inference from
the exact executed source and error stack; the detailed interaction artifacts
and screenshot pixels remain uninspected. The tooltip summary reports a pass
under the existing private-enabled collector, with the same public-accessibility
and shown-text-provenance limitations described below.

The first failure is `tron.window: The native test host refused interactive
activation policy`. The typed startup projection records activation operation 2
with the app's policy already Regular before and after the setter, active true,
and the second document window not visible or key. The setter returned false.
The current fixture rejects that Boolean before requesting NSWorkspace
activation. This establishes the fixture's observed rejection path, not why
AppKit returned false or whether the second window would subsequently activate.
The separate first activation succeeded in 0.216 seconds with matching process
and bundle. Later document-window, newer-window focus and drag acceptance did
not execute. The complete native gate failed and tested-distribution upload
was skipped. Later attempts are separate evidence.

The [eleven-file completed-attempt receipt](../evidence/v1-appkit-0bee669-secondary-policy-refusal/README.md)
retains both complete logs, three exact JSON payloads and timestamped envelopes,
and completed attempt metadata. The tooltip envelope preserves eleven
interleaved stderr lines. The command file was completely read by the producer,
but its typed console selection retains only 32 of 332 records; the original
command file is not independently inspected. Compiler output, tooltip JSON,
sample, captures and original ZIP remain uninspected. Their identities are
producer/API-reported.

The preceding [8e completed-run receipt](../evidence/v1-appkit-8e5ee2e-inspector-status-timeout/README.md)
records a separate actual outcome on merge `d329a921bf3ee6183d94bc83204451bf2bc7cc93`.
Compilation and tooltip checks passed, but the application dismissal-status
wait still timed out before the separate native visibility check. Initial
activation succeeded in 0.801 seconds. The source changed dismissal emission
to will-close; the later 0bee source narrows owner-notification removal and
adds close traces. Neither the earlier failure's cause nor a particular
notification delivery history is established by these console records.

This publication retains outcomes and source-review receipts. It does not
adopt the external shipping popover or private-text implementation into the
reviewed aggregate. The [prepared activation-policy correction](../evidence/v1-appkit-d83bfaa-activation-policy-source/source-review.json)
tests the actual required Regular policy while preserving the setter trace and
all later same-process, same-bundle and interactive-window checks. Its one
reversible source transform and six extracted-comparison cases were reproduced;
the corrected Objective-C++ and native continuation remain unexecuted. A separate
completion observation will place the exact existing focus assertions after
the matching native did-close event. Those changes require their own exact-source
and native validation; no completed result is transferred to them.

### November 11 full source and installed-consumer checkpoint

The [eight-file source and installed-consumer receipt](../evidence/v1-source-8e5ee2e-installed-consumers/README.md)
records completed source run 42982526846 and consumer run 42982526713, both on
actual merge `d329a921bf3ee6183d94bc83204451bf2bc7cc93`.
The inventory check finds all 341 original IDs implemented: 332 local and nine
pinned external, with no pending source rows and no row accepted across all
eight platforms. This includes the twelve requested native/Forge rows.

Linux and Windows each pass the same 1,187-test source suite; these are separate
executions, not 2,374 distinct tests. Workspace verification reports thirteen
packages, 619 conditional exports, 750 ESM modules, 619 API subpaths and
3,306 declarations. Thirteen release archives and seventeen dependency-free
installed imports pass their checks. The basic installed consumer passes its
typecheck/build and one browser test with one skip; Expo web passes its
typecheck/build and two browser tests.

All thirteen producer archive hashes agree across the three Linux jobs.
All thirteen Windows producer hashes differ despite matching archive names,
package names and file counts. No cause or final shared-manifest equality is
inferred. Original tarball and browser-artifact bytes and pixels remain
uninspected. This helper differs from the reviewed aggregate in 86 non-doc,
non-Markdown leaves, so its source results do not certify the combined candidate
or replace its earlier 1,199-test checkpoint.

### November 11 prepared private-tooltip source correction

The [three-file source receipt](../evidence/v1-appkit-ff7e579-private-tooltip-source/README.md)
records prepared, unpublished commit `ff7e579c8a6a0863fe9e294458f0a125ec3e64eb`,
tree `d7ba1cd7f23a68a75fa6c78657909347e5541185`, with sole parent
`8e5ee2e3c153d04f67f5d53983b308554a4f969c`. Its complete 2,050-leaf map
and 284 tree hashes were independently verified. The live helper advanced
before publication, so this receipt remains a historical source-review
checkpoint, not a published helper or actual native result.

The correction preserves the public text traversal, separates public counts
from private additions, binds the exact draw view to its selected visible
help-tag window before and after the read, and bounds private nodes/details.
Typed shown and final observations remain within the existing 16 KiB console
envelope. The exact-text, role, geometry, cursor, disappearance and timeout
requirements remain. Private storage still does not establish public
accessibility, VoiceOver or inspected pixels.

The same eight author-designed source/V8 checks were reproduced independently;
additional selector and mocked-I/O reviews overlap and are not additive native
test counts. No Objective-C++, full native application, screenshot or original
archive execution is claimed for this prepared correction. Reconciliation with
the newer helper and subsequent exact-source acceptance remain separate work.

### November 11 AppKit tooltip progress and inspector status timeout

[Completed run 42979226147](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42979226147)
tested external helper `a957d4059b8a86735f2c152371eb7a2c2bd4e4ae` through
actual merge `b296b206f7bcc7740f46e1e7435f490a138935ce`, tree
`8cf08b5ce3331bad684f2efa33d9570b3e9702ed`. The source job passed 13 tests,
the installed consumer passed 16, API declarations matched 15 subpaths / 33
declarations, and seven native transport-probe cases passed. Standalone
compilation succeeded. Initial native activation returned successfully in
0.626 seconds, with the same process and bundle and a visible, key, active owner.
These counts and observations are separate gates.

This candidate's tooltip summary reports `passed`. Its text collector permits
a private AppKit draw-view ivar read; this is not public-accessibility-only text
proof. The console retains the final outside-after-hover observation: the
cursor is outside, the pointer-sequence flag is cleared, no help tags are present,
and window 41 is invisible and offscreen. It omits the earlier shown tag and
the source of the text that matched. The original tooltip JSON and captured
pixels remain uninspected. The pass belongs to this exact source and does not
certify the pending correction to private-text provenance and window binding.

The first later runtime error is `Timed out waiting for Native inspector
dismissed`. Executed verifier line 1176 awaits the Escape command, then waits
for the application status label to include that text. The separate native
`shown === false` check on line 1177 was not reached. The failure therefore
does not establish the final native popover visibility or the cause of the
missing status. Focus restoration, reopening and later drag checks remain
unexecuted. The preceding responder, editing and resize assertions are
control-flow observations; their detailed original artifacts remain uninspected.

The [eleven-file completed-run receipt](../evidence/v1-appkit-a957d40-inspector-status-timeout/README.md)
retains both complete original job logs, all three exact JSON payloads and
timestamped envelopes, and completed metadata. Root independently rehashed
every retained file and matched the console extractions and metadata to the
completed originals. The command projection covers a bounded prefix, not the
full command history. No predeadline sample envelope was emitted. The original
compiler transcript, tooltip JSON, later process sample, captures and ZIP
remain uninspected; their recorded identities are producer/API-reported.

The complete native gate failed and tested-distribution upload was skipped.
This outcome-only receipt adds no source changes. The external private-text
source remains separate from this reviewed aggregate while its correction
is reviewed. Supported-host Windows, physical-platform, combined-release and
exact-manifest owner gates remain open.

### November 11 AppKit startup progress, tooltip text and cancelled compile

[Direct-head run 42975767901](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42975767901)
checked out `79a51bb7663bffe130568f81e276ded0e0b065b9`, tree
`f5603b91fec3b9c9466fa0776ce0fff1f6be565e`. Source13, consumer16,
API15/33 and native transport-probe7 checks passed, followed by standalone
compilation. The original first `tron.window` request succeeded in a recorded
0.748 seconds. The owner became visible, active and key with matching process
and bundle. This observation does not establish the cause of earlier waits or
prove that the private Expo change caused the startup improvement.

Runtime then failed at `Timed out waiting for new visible native help-tag text
after the posted pointer reaches the trigger`. The retained last observation
has both permissions true, the cursor inside the trigger and a new visible,
onscreen `AXHelpTag` with nonempty tag/window frames. Its string collection is
empty: three nodes, nine modern value/label/title reads returning nil, three
unavailable text-field slots, and three separate legacy value reads returning
nil without exceptions. This is unavailable text through those collector paths,
not an observed wrong displayed string or absent native help tag. Exact-text
presentation, subsequent dismissal and later drag acceptance remain unproved.

The [79a outcome receipt](../evidence/v1-appkit-79a51bb-tooltip-text-unavailable/README.md)
retains eleven files, including complete original logs and all six exact JSON/
envelope records. The startup envelope preserves nine interleaved stderr lines.
There is no predeadline sample envelope. Its command-history projection is a
bounded prefix, not the complete command file. The original tooltip file,
compiler transcript, later process sample, screenshots and ZIP remain
uninspected. The run used external patch `1db73096`; it does not validate
the corrected `1283fd6d` source or an unmodified Expo consumer.

[Reviewed-helper run 42977406794](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42977406794)
checked out exact merge `039390442b53ef8a44ca413246cb56ae29f3e095`.
Its source13, consumer16, API15/33 and native transport-probe7 checks passed,
but compilation was cancelled at 07:24:17.806 UTC. Runtime and tested-distribution
steps were skipped; cancellation actor and cause are unknown. The
[five-file cancellation receipt](../evidence/v1-appkit-1283fd6-compile-cancelled/README.md)
preserves the complete logs and completed metadata. No actual build-result or
runtime diagnostic envelope was emitted; echoed shell marker statements are
not emitted results. The producer-reported 32-file artifact and compiler output
remain uninspected. This run establishes no compilation success or native
runtime outcome for the corrected candidate.

At the earlier 07:37 UTC checkpoint, the external helper had advanced to
`a957d405`, adding private AppKit draw-view storage to accepted tooltip strings.
Its thirteen source checks had passed on actual merge `b296b206`, while native
compilation continued. The completed result is recorded above. This change to
the acceptance text source cannot certify public accessibility text exposure,
VoiceOver or rendered pixels. That external source is not included in this
outcome-only aggregate; its private-text provenance and draw-view association
remain under review. All native, physical-platform and exact-manifest release
conditions remain in force.

### November 11 AppKit hostname-run result and symbol diagnostic

The direct-head `8f17a1fd7530d2907e28401063cd7b49841e8ebd` run
[42973159971](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42973159971)
completed with the same initial `tron.window` request-2 timeout. Source checks
passed 11 tests, the installed consumer passed 16, API declarations matched
15 subpaths / 33 declarations, all seven native transport-probe cases passed,
and standalone compilation and the hostname preflight succeeded. Native
acceptance remained diagnostic-only and tested-distribution upload was skipped.
The verifier did not reach its root-mount, tooltip or later interaction checks;
actual React mounting remains unknown.

The preflight printed a 0.03-second baseline and a 0.01-second post-setup call.
A different invocation supplied the successful `<5` check; its scalar was not
printed. These completed-call observations do not establish that hostname
lookup caused the previous wait or that the host setup fixed app startup.
The newly sampled main-thread projection has 30 retained rows, each with count
161; the labels, depths and offsets equal the earlier 8a projection when counts
are excluded. Its owned image-relative offset 355132 remains unnamed and the
branch reaches `semaphore_wait_trap`. Counts are not additive, and the sampled
projection does not prove an exact caller, a continuous 35-second wait or cause.

The sampler process lived 4.841 seconds and closed 20.136 seconds before the
request's 35.011-second rejection; observer settlement occurred at 35.014 seconds.
The late native completion-trace interval was about 0.288 milliseconds and the
submission-start-to-main-entry interval was 35.458414 seconds. The latter is not
a queue-residence measurement. The late continuation identified the same process
and bundle with a visible, inactive, non-key window. Sampling can perturb timing.

The [completed-run receipt](../evidence/v1-appkit-8f17a1f-hostname-startup-timeout/README.md)
retains both complete original job logs, exact JSON substrings and timestamped
envelopes, the original hostname-step output and normalized completed metadata.
Root independently checked these bytes and the run/job/artifact metadata.
The 47-file native artifact is API-reported as 1,482,523 bytes with digest
`c55678622445247576403f64e201c82828a705439a879e65a4a857ffad50f244`.
Its archive, original sample and compiler transcript remain unextracted and
uninspected; their producer-reported identities do not become local verification.

Concurrent source subsequently reverted that hosts-file setup in `8f1cf564`
and added `79a51bb7`'s pinned change to Expo's macOS device-name getter in the
private native acceptance consumer. The source preimage matches the inspected
version-aligned Expo provider SHA-256
`16d30e5eafc45074426b770c1b8d0330c754e6b424213595c1fd9c5c673a884a`.
The patch uses `gethostname` and records its before/after identities in consumer
preparation. It does not modify the shipped adapter/core archives or the driver
deadline and assertions. Its causal comments are external attribution: the
original 8a and 8f raw samples have not been independently inspected here.
Any resulting native evidence applies to this explicitly patched private
consumer; it does not establish ordinary unpatched Expo startup behavior.

Reviewed helper `1283fd6dea6cead03be7d0eb22863e02dbe648fd` was published
at 07:09:07 UTC with tree `8bafabc7750c8a087a56a9a309fbd04f5ea0d377`
and ordered parents `79a51bb7663bffe130568f81e276ded0e0b065b9`, then
`ac5d69585a52a6e945dc996ea08030e190574699`. Root and independent review
verified its complete 2,050-leaf map and recomputed all 284 tree-object hashes. A fresh,
nonforced expected-head update preserved concurrent source; prepared
`24aca7f`, `b00cf503` and hostname-capture candidate `eebf448e` were never
published.

The [symbol-source receipt](../evidence/v1-appkit-1283fd6-startup-symbol-source/README.md)
binds verifier blob `a82e2fc7df3bde243eb6d053a97e310c39b1293c` and the
reproducible harness. The diagnostic runs only after the original request
settles, retains the original error and diagnostic-only latch, binds one
retained owned frame to the same executable's UUID/load/range and complete
hash, and uses bounded offline Apple symbol tools. One optional dSYM has a
fixed path and must match the executable UUID; an existing unreadable or
mismatched dSYM remains unknown. Raw symbol output remains private while
the console receives only fixed labels and bounded metadata. A matching
source-file label does not establish a unique function, phase or timeout cause.

All ten existing author-designed V8/mock/static diagnostic groups passed and
were reproduced by root and independent review as the same ten designs.
Normal and trimmed envelopes measured 4,383 and 10,359 bytes, within 16 KiB.
The eight-transform inverse restores verifier `4507f860`. These source and
mock checks do not verify real Node filesystem behavior, `dwarfdump`, `atos`,
Swift compilation or native interactions.

The [Expo source review](../evidence/v1-appkit-1283fd6-expo-source/source-review.json)
records the external private-consumer patch and its narrow correction:
blob `2e6ff07ebf22fa8212dfb2028ff740d46720d622` uses `CChar` storage and its
typed buffer pointer, retaining the 255-byte call, 256 zeroed elements, bounded
UTF-8 decoding and fallback. This corrects the prior `UInt8` storage passed
through `assumingMemoryBound(to: CChar.self)`; it is a documented pointer
contract issue, not an observed native failure or explanation for the old wait.
The exact pinned Swift source materializes to 4,297 bytes with SHA-256
`b6406c3a54ba65713d54e3971ffa8a56eef4fe830de558ee84dafc2f130f3bca`.
The two unchanged text-replacement tests were also exercised through V8 shims;
their scope excludes filesystem guards and actual Swift execution.

The aggregate workflow keeps its existing shared-archive inputs and strict
native distribution gates, adding only the external patch test to its source
check and the patch-receipt path to its always-uploaded evidence. Aggregate
Windows readiness blob `070424fa` and its supported-host restriction remain
unchanged. At this source checkpoint, neither the newly published helper nor
the combined aggregate has a completed native acceptance result. Physical
platform gates, the frozen combined distribution and exact-manifest owner
approval remain open; no ledger row is promoted.

### November 11 reviewed helper source and browser checkpoint

After publication, [AppKit source job 130379594331](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42977406794/job/130379594331)
confirmed actual PR merge `039390442b53ef8a44ca413246cb56ae29f3e095`
and passed all 13 source tests with zero failures, cancellations or skips.
That merge has the helper's exact reviewed tree and ordered parents
`ac5d6958` then `1283fd6d`; its native interaction outcome remains separate.

[Web overlay run 42977406729](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42977406729)
also checked out that exact merge and passed all 32 tests in 9.3 seconds:
20 rendering cases and 12 keyboard/focus/interaction cases, with 32 unique
test IDs, two workers, no failures and no skipped cases. Root independently
checked the complete 43,805-byte job log. The
[browser receipt](../evidence/v1-web-1283fd6-overlay-pass/README.md)
retains that result and source/artifact identities. Artifact 13835573308 is
reported as 280,598 bytes, SHA-256
`65957a16752b1020c3ddefbfecffbecdb64bf112be66b1c39466a033c3b4fd68`.
Its ZIP and rendered pixels remain uninspected here. This browser result does
not establish native desktop or physical-platform acceptance.

### November 11 Windows readiness source reconciliation

The [source receipt](../evidence/v1-windows-070424f-readiness-source/README.md)
records reviewed UIA script blob `070424fa54f1645cc6be02187647f84732a6b53c`
against aggregate preimage `54c3dee9cce38f8a7ae143ea2fbfd4c34b43b7bd`.
It reconciles the readiness changes from the separately advanced umbrella
`ac5d69585a52a6e945dc996ea08030e190574699` and its Windows script
`8bd25374b1c3a24911d13b0a2e8e40b0b5d9f0f4`, while retaining the aggregate's
later owned-window, input, drag and failure diagnostics.

Only four exact transformations change the script: a focus-retry helper,
its two focusable-control callers, and the screenshot foreground retry.
The helper keeps the last caught ErrorRecord and rethrows it on exhaustion,
without reading an unavailable element's name or replacing the error with
a new message. Screenshot capture requests foreground again during a
ten-second retry window and still requires actual foreground HWND equality
and the unchanged stable, positive rectangle predicate.
These retry windows do not cancel synchronous UIA or native calls.

Root and independent review reproduced the exact transforms and inverse.
The candidate is 44,307 bytes, 881 bytes / 16 LF larger than the preimage;
all other existing functions and the complete action/catch/finally sequence
remain byte-identical. The typed visible-button selector, InvokePattern path,
popup capture behavior, native interaction assertions and passed-only
distribution boundary remain unchanged.

This candidate has not been parsed or executed by PowerShell or run on a
Windows host. Source review establishes neither a fix for the observed
elevated-host drag failure nor native acceptance. PR60 remains at its tested
`0578582686e483003db64e252e4ea65f0b48c093` head. The eligible-host requirements,
original failed-run evidence and original-archive requirements remain in force.

### November 11 Windows diagnostic follow-up

The corrected read-only observation is integrated from helper
`0578582686e483003db64e252e4ea65f0b48c093`. Its
[completed native receipt](../evidence/v1-windows-0578582-elevated-existing-shell/README.md)
records actual merge `0a44cc99e8d7e1932235a463d4b1f3d82047fe8c`,
tree `99a1e8463fd2f6aab907589aef37e3c59c557962`, all 2,076 helper leaves
and the independently verified actual merge's ordered parents.

[Run 42935377885](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42935377885)
passed the 13-check subset and full 49-check suite including that subset,
with zero failures/skips, plus API 8/44. The real Windows PowerShell Desktop
5.1 x64 parser and production C# compile passed. The complete original log
records the real owned scalar-token check, ten portable environment groups,
seven portable input groups and three real native token-user/session,
borrowed-handle and SID-bounds groups. These 21 actual PASS lines are distinct
from the source-suite counts and the later app observations.

Native code generation, library compilation, the actual consumer compilation
and packaged deployment passed. UI Automation still failed
`UIA element named 'Native drag result: none/rejected' did not appear within 30 s`.
The owned app remained alive with 51 final descendants and zero matched crash
records. Passed-only distribution retention/upload were skipped. The actual
final drag label and target-event trace remain uninspected in the original
runtime ZIP; no older result is assigned to this run.

The new source-bound observation directly records both app PID 5464 and the
exact GetShellWindow shell PID 7940 as elevated (DWORD 1), High integrity
(RID 12288), elevation type 1 and UIAccess 0. Shell window/PID/thread identities
and app/driver process identities remained stable; no query/close error was
reported. Session comparisons observed session 2, and all three input desktops
reported receiving input. The review-only result is `observed-ineligible`:
eight predicates true, two false, two unobserved. The same-user comparisons
were deliberately skipped after the unsupported shell scalar values; they are
unknown, not unequal.

Microsoft's documented elevated-app drag restriction applies to the matching
automatic CanDrag path. The existing shell is also elevated, so it cannot
supply the documented existing-shell route to unelevated activation. This
establishes a supported-host boundary, not the precise timeout mechanism or
execution of an internal null-operation guard. No launcher, security setting,
native drag, pointer timing or required assertion was changed.
The [next-host instructions](../evidence/v1-windows-0578582-elevated-existing-shell/NEXT_HOST.md)
identify the existing unelevated interactive session, prior toolchain/package
provisioning, unchanged native gates and original tested-archive requirements.
No replacement host was provisioned or unchanged workflow retried.

The complete original source/native logs are 31,778/342,310 UTF-8 bytes.
The exact selected 14,447-byte environment JSON line is preserved without
parsing and reserializing its unsafe-in-JavaScript FILETIME numbers.
Derived provenance uses ISO timestamps and the native identity result.
The producer-reported original environment file (81,458 bytes) and runtime
artifact 13817948422 (337,987 bytes, 40 uploaded files) remain unextracted and
unverified independently. All hash/provenance distinctions are in the receipt.

The [preceding 2566 failure](../evidence/v1-windows-2566b2b-shell-fixture-parse-failure/README.md)
passed source checks but stopped at the actual parser before C#/native tests.
Independent source inspection found the missing outer hashtable brace;
the four-byte correction is blob `d3f4492c96f1b805048031ea2a96f607e844c8df`.
The new run confirms that correction passed the actual parser/runtime gate.
Both original failed and corrected-run logs are retained.

The aggregate-specific workflow
`4bfac5a1e0b91ac88a104a08d08ebcdc873be6bc` preserves canonical archive wiring
over `988737b29372fdb4b7eaf69e5f1c8da85654a9e9`. It is distinct from the helper
workflow. The new native shell-identity test and corrected environment fixture
are carried with the reviewed diagnostic; no complete native acceptance follows.

### November 11 AppKit predeadline main-thread sample and browser result

The [completed watchdog outcome](../evidence/v1-appkit-8a24668-predeadline-main-wait/README.md)
binds [run 42964459265](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42964459265)
to actual checkout `e72dcda68234a6506dfef07dc18ffd3b8de9f916`,
tree `e2ea092f9d21a0a1e4a87cd9413ed39b0beb314a`, matching helper
`8a2466835e14b579002a7fbaa3a240aaaf16e059`.
The exact ordered merge parents and complete helper tree were verified.

The source job passed 11 tests, consumer preparation passed 16 tests,
the installed API comparison matched 15 subpaths / 33 declarations,
and the Foundation/socketpair probe passed seven cases. Native compilation
succeeded, then initial show request 2 failed with the original
`Native driver response timed out awaiting tron.window (request 2)`.
The watchdog had fired, so the run is diagnostic-only. Tested-distribution
upload was skipped. These source, inventory, transport and compile results
do not establish native interaction acceptance.

The owned app PID was 45713. The preflight matched the retained child,
parent PID and expected `ps comm` argv[0]; it does not independently
identify the mapped executable. The sampler spawned at 05:36:15.322 UTC
while the request remained pending and closed at 05:36:20.585 with exit 0.
The recorded process lifetime was 5.263 seconds; requested collection
duration was two seconds, not a measured collection interval.
Sampler close preceded command rejection by 19.720 seconds.
Request rejection occurred 35.008 seconds after its recorded start;
observer settlement occurred after 35.010 seconds.

The exact console projection retains all 30 parsed main-thread frame rows
with no malformed, oversized or omitted rows. Each carries count 164;
these counts are not additive. The sampled branch reaches
`semaphore_wait_trap`, through an owned-application image-relative offset
355132 and unidentified intermediate frames. It establishes a sampled
main-thread wait during the pending request, without identifying the owned
function, wait owner or cause, or a continuous 35-second wait.
Sampling may affect scheduling.

The native clock separately reports completion-trace duration
`0.0001279166665426601` seconds and submission-start-to-main-entry duration
`35.33051962500008` seconds. Neither isolates queue residence.
The late continuation matched the same PID and bundle; the owner was visible,
while the application was inactive and the window not key.
The verifier had not reached its mount check or menu, tooltip and drag checks;
actual React mounting remains unknown.

The 11-file outcome preserves complete source/native logs, completed metadata,
three exact console JSON substrings and their timestamped envelopes.
The startup envelope retains ten interleaved stderr lines.
The producer reports a stable 231,664-byte sample, a 12,329,246-byte compiler
transcript and native artifact 13831257705 with 47 uploaded files.
Those original files and the original ZIP remain uninspected here;
their reported hashes are distinct from independently verified log/payload bytes.
The historical source-only checkpoint below remains unchanged.

Separately, the [browser receipt](../evidence/v1-web-8a24668-overlay-pass/README.md)
binds [run 42964459201](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42964459201)
and job 130338331501 to the same actual checkout and tree.
All 32 browser tests passed in 11.9 seconds: 20 rendering and 12 interaction
cases, with 32 unique IDs, two workers and zero failures or skips.
The complete browser log and metadata are retained. The original browser
ZIP and PNG pixels remain uninspected. Browser results do not close the
AppKit native gate, physical-device evidence or final combined-candidate gate.

### November 11 AppKit initial-request watchdog source

The [watchdog source checkpoint](../evidence/v1-appkit-8a24668-startup-watchdog-source/README.md)
records helper `8a2466835e14b579002a7fbaa3a240aaaf16e059`, tree
`e2ea092f9d21a0a1e4a87cd9413ed39b0beb314a` and sole parent
`12e35b48f75408ac4da4f8130853148ef00a5881`.
Exactly one private verifier file changes. Root and independent review checked
all 2,048 leaves / 284 tree objects and the five-transform exact inverse.

The completed 12e timing result below did not identify a blocked stack or
activation cause. The new verifier arms one ten-second watcher around only
the original first `tron.window` request promise. It latches diagnostic-only
status before any observer, then asynchronously checks the retained child,
PID, parent PID and expected command before sampling the owned process.
The command match is explicitly `ps comm` / argv[0], without claiming an
independent mapped-executable measurement.

Sampling requests two seconds at ten-millisecond intervals. The sampler has
an eight-second timer and one-second bounded cleanup; signal acknowledgment
does not establish exit or close. Unconfirmed closure suppresses the existing
postfailure sampler. The original request's 35-second timer stays runnable,
and its rejection preserves the original error object. Observation-task waiting,
file reads, hashes and reporting happen after the original request settles.
A request resolving after the watcher fires receives a fixed diagnostic-only
failure before remaining show checks or passed acceptance/archive output.
Sampling can affect scheduling and does not establish unperturbed startup.

A separate complete console envelope is capped at 16 KiB. The fixed original
sample is processed within a one-MiB cap plus one overflow byte. Whole-file
hashes require complete stable reads after observed sampler closure and
successful descriptor closure. Incomplete/changing reads retain only explicitly
scoped prefix hashes and no frame projection. Matching PID declarations and
one explicit main-thread group are required; at most 32 frames expose fixed
labels, counts, depth and relative offsets. Raw symbols, addresses and paths
remain outside the projection. Task status and later close observations are
separately labeled.

Fourteen author-designed V8/mock lifecycle, parser and IO groups passed, and
root and independent review reproduced those same designs. Ordinary and
maximum-width allowed envelopes measured 3,176 and 10,536 bytes. Separate
root parser and desktop parser/read/report reviews also passed; these are
source/mock checks, not additional native acceptance evidence.

The helper was published at 2026-11-11 05:14:39 UTC with native execution
unknown. Root subsequently verified actual merge
`e72dcda68234a6506dfef07dc18ffd3b8de9f916`, the exact reviewed tree and
ordered parents `0edd5f30` then `8a246683`.
[AppKit run 42964459265](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42964459265)
and browser-overlay run 42964459201 were in progress at the source checkpoint.
That checkpoint establishes no actual Node OS IO, native compilation/runtime,
behavior correction, accepted ledger row or tested distribution.

### November 11 AppKit completed activation-timing result

The [completed 12e native receipt](../evidence/v1-appkit-12e35b4-dispatch-interval-timeout/README.md)
records helper `12e35b48f75408ac4da4f8130853148ef00a5881`, actual merge
`96e7558fbb859a2430b0f192bb5f11e940229cfa`, and matching tree
`d4352a6aba7cca7a9b898b6c25c9e4a5d729587d`.
[Run 42958884494](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42958884494)
passed eleven source checks, sixteen installed-consumer checks, installed API
verification (15 subpaths / 33 reachable declarations), seven actual native
Foundation/socketpair cases and standalone native compilation.
Initial `tron.window` request 2 again exceeded the unchanged 35-second deadline.
The verifier had not reached its root-main mount check or allocated tooltip
evidence; actual React mounting remains unknown and tooltip diagnostics were
not exercised.

This run actually emitted the new monotonic timing fields for owned PID 45188:
`completionTraceElapsedSeconds = 0.0001507500001025619` (about 0.151 ms) and
`submissionStartToMainEntrySeconds = 35.40724549999982` (about 35.407 s).
The clock identifier and all three interpretation flags matched the reviewed
contract. The longer interval began after the callback trace returned.
It includes caller descheduling, dispatch/submission work and elapsed time
until main entry; it does not isolate queue residence, identify a blocked
stack or establish cause. The short callback-trace interval applies to this
run and does not diagnose other logging operations or earlier failures.

The client recorded a 35.003-second wall-clock request interval.
The late reply verified the same process and bundle and observed a visible
window, with `applicationActive: false` and `key: false`.
All ten matching activation records, ten transport records and eight command
records were retained without reported malformed or omitted matches.
Post-timeout sample metadata reports 28 thread groups, but its original
stack text remains uninspected and cannot explain the earlier interval.

Complete source/native logs of 19,235/65,531 UTF-8 bytes were independently
retrieved and rehashed. The exact 318-byte build and 12,142-byte startup JSON
lines retain their original bytes. The original 13,141-byte timestamped
startup block preserves all ten interleaved stderr lines, including blank
lines and the Node version. The app-log hash binds a stable 5,380-byte
read-time prefix, with later appends still possible.

The failed run uploaded 45 evidence files. Native artifact 13828758845
(1,406,086 bytes) and original compiler/snapshot/command/process/sample hashes
remain producer/API-reported until their original bytes are independently
inspected. Passed-only tested-distribution retention was skipped.
The separate 32-case browser pass and historical source checkpoint below
remain distinct from this completed native failure. No native acceptance,
ledger status, permission, deadline or release gate is promoted.

### November 11 AppKit activation-timing source follow-up

The [timing source checkpoint](../evidence/v1-appkit-12e35b4-activation-timing-source/README.md)
records helper `12e35b48f75408ac4da4f8130853148ef00a5881`, tree
`d4352a6aba7cca7a9b898b6c25c9e4a5d729587d` and sole parent
`5340d2d96412d0fcc5dc7cce21ced037d2de5c7b`.
Exactly two private acceptance files change. Root and the independent reviewer
verified every leaf and directory hash, all 2,048 leaves / 284 tree objects,
the sole parent and exact inverses restoring both prior source files.

The preceding startup projection could not distinguish time around callback
logging from time beginning at dispatch submission. The driver now takes
three immutable `CACurrentMediaTime` samples: before the existing completion
trace, immediately before the unchanged dispatch call, and as the first
statement of its main block. No logger or metadata work intervenes between the
submission sample and dispatch. Only the existing guarded continuation trace
gains the two finite, nonnegative elapsed observations and fixed clock metadata.
The original window-state getter still runs once inside that guard.

The clock excludes system sleep. The trace interval includes any descheduling;
submission-start to main-entry includes caller descheduling, block-copy/API
work and elapsed time until entry. Neither interval establishes pure queue
residence, a blocked stack or the timeout cause. Raw monotonic samples are
not emitted. Invalid native durations become `NSNull`; missing, malformed
or unrecognized projected timing values remain explicit `null`.
The verifier changes only its nine-line continuation-phase projection.
Activation operations/options/order, deadlines, owner/foreground checks,
tooltip gates, file/hash/snapshot limits, cleanup and passed-only archive gates
remain unchanged.

Ten author-designed V8/mock-IO/static review groups passed and were reproduced
by root and the independent reviewer as the same ten designs. Separate typed
selector checks also passed. Ordinary and trimmed full envelopes measured
4,311 and 32,614 bytes; the latest timing observation survives under the
unchanged 32 KiB cap. These are source/mock checks, not actual Node filesystem,
Objective-C compilation or native interaction results.

The subsequent actual merge `96e7558fbb859a2430b0f192bb5f11e940229cfa`
has the reviewed tree and verified ordered parents `0edd5f30` then
`12e35b48`. [Run 42958884494](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42958884494)
[source job 130320429814](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42958884494/job/130320429814)
passed eleven tests with zero failures, skips or cancellations, confirmed
from its complete 19,235-byte log. Native compilation and runtime were not
completed at this source-integration checkpoint.

The separate [12e browser receipt](../evidence/v1-web-12e35b4-overlay-pass/README.md)
records [run 42958884313](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42958884313)
at the same actual merge. All 32 Chromium cases passed, comprising twenty
rendering and twelve interaction cases, with no failures or skips.
Its complete 43,806-byte log was independently retrieved and rehashed.
Artifact 13828491988 reports twenty files and 280,598 ZIP bytes; original
ZIP/PNG bytes remain uninspected. The historical source-only receipt
preserves its publication-time boundary; the earlier completed native failure
below remains a separate outcome.

### November 11 AppKit completed startup result and browser pass

The [completed 5340 native receipt](../evidence/v1-appkit-5340d2d-main-continuation-timeout/README.md)
records actual merge `32e6234e6f00ff873132f81498d3f78f2488ad8f`,
matching helper `5340d2d96412d0fcc5dc7cce21ced037d2de5c7b` and tree
`bc0c0f2d8c96965ed54b429bd5269c4c7081bc64`.
[Run 42951265207](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42951265207)
passed eleven source checks, sixteen consumer checks, installed API verification
(15 subpaths / 33 reachable declarations), the seven-case actual native
Foundation/socketpair probe and standalone native compilation.
Runtime acceptance failed on initial `tron.window` request 2 at the unchanged
35-second client deadline. The verifier had not reached its root-main mount
check or allocated tooltip evidence; actual React mounting remains unknown.
The new tooltip diagnostics compiled but were not exercised.

The owned PID 43799 reported a non-main workspace-completion callback marker
with an application and no error. Its main-continuation marker followed about
35.608 seconds later, after the client's recorded 35.004-second request interval.
The callback timestamp is captured before JSON serialization/logging and before
`dispatch_async`; there is no enqueue marker or measured tracing/pre-enqueue
duration. This wall-clock marker interval does not establish main-queue wait,
starvation, blocking, a blocked stack or the precise timeout cause.
The late reply verified the same process and bundle and observed a visible
window, with `applicationActive: false` and `key: false`.
All ten matching activation records, ten transport records and eight command
records were retained without reported malformed or omitted matches.

Complete source/native logs of 19,321/65,275 UTF-8 bytes were independently
retrieved and rehashed. The exact 318-byte build and 11,885-byte startup JSON
lines retain their original bytes. The original 12,140-byte startup marker
block preserves its one interleaved stderr line. The app-log hash describes a
5,113-byte retained read-time prefix, with later appends still possible.
The process sample's original stack text remains uninspected; its producer
metadata cannot establish application health or explain the marker interval.

The failed run uploaded 45 evidence files. Native artifact 13826131506
(1,425,183 bytes) and original compiler/snapshot/command/process/sample hashes
remain producer/API-reported until their original bytes are independently
inspected. Passed-only tested-distribution retention was skipped.

The separate [5340 browser receipt](../evidence/v1-web-5340d2d-overlay-pass/README.md)
records [run 42951265312](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42951265312)
at the same actual merge: all 32 Chromium cases passed, comprising twenty
rendering and twelve interaction cases, with no failures or skips.
Its complete 43,808-byte log was independently retrieved and rehashed.
Artifact 13824009318 reports twenty PNGs and 280,598 ZIP bytes; original
ZIP/PNG bytes remain uninspected. Browser acceptance does not replace the
held native gates. The earlier source checkpoint and a685 tooltip result
below remain separately identified historical records.

### November 11 AppKit text-collection source follow-up

The [source checkpoint](../evidence/v1-appkit-5340d2d-text-collection-source/README.md)
records published helper `5340d2d96412d0fcc5dc7cce21ced037d2de5c7b` and
tree `bc0c0f2d8c96965ed54b429bd5269c4c7081bc64`. Exactly two private
acceptance files changed: `NYCTronAcceptanceDriver.mm` and `verify-native.mjs`.
The collector preserves its original traversal, current getter order and
counts, single normalization, string order/deduplication and original
exceptions. The strict tooltip shown, capture and dismissal gates remain
unchanged.

After obtaining the original strings array, the driver adds guarded read
metadata and a separate diagnostic-only public
`accessibilityAttributeValue:NSAccessibilityValueAttribute` query on already
traversed nodes. Legacy values never enter acceptance strings. The shared
per-observation caps are 16 current detail records and eight legacy nodes
considered. Aggregate counts, nil, unavailable, returned, thrown and omitted
states remain distinct. The read-count cap is not a duration guarantee;
existing deadlines remain unchanged.

Failure reporting adds typed string/read/count/exact-literal classifications,
with missing or malformed values kept explicitly unknown and raw text omitted.
The complete envelope remains capped at 16 KiB. If needed, it drops the new
detail rows first, preserving omission counts, aggregate metadata and the
latest original predicates before the existing generic over-limit fallback.
Original retained JSON bytes and the primary failure remain unchanged.

All 14 author-designed source/mock review groups passed. Root, Forge and the
desktop reviewer reproduced those same 14 designs; those reproductions are not
additional test designs. The desktop reviewer separately passed ten
independently designed V8/mock-IO groups. Native compilation and runtime were
unobserved at the historical source checkpoint.

The subsequent actual merge `32e6234e6f00ff873132f81498d3f78f2488ad8f`
has the same reviewed tree and verified ordered parents `0edd5f30` then
`5340d2d`. In [run 42951265207](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42951265207),
[source job 130295860357](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42951265207/job/130295860357)
passed eleven tests with zero failures, skips or cancellations; its complete
19,321-byte log confirms that checkout. At this follow-up check, native job
130296002996 was compiling, with no completed native compilation or runtime
result recorded. The historical source-only receipt remains unchanged.

### November 11 AppKit help-tag text result and browser pass

The [completed a685 native receipt](../evidence/v1-appkit-a685bd1-help-tag-text-failure/README.md)
records head `a685bd17d3023307181371a9c042bfbc1530c232`, actual merge
`778ab991afb4dfe48b405800dc4b79e4bca97939`, and matching tree
`0b3c93477329d5db0076e0f6a54c6afa2dbcd3b8`.
[Run 42944976627](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42944976627)
passed all eleven source tests and sixteen consumer tests with zero
failures/skips, installed API verification, the seven-case native
Foundation/socketpair probe and standalone native compilation. Application
acceptance then failed the unchanged wait for
`new visible native help-tag text after the posted pointer reaches the trigger`.

Initial activation succeeded in this run: client request 2 received a matching
successful `tron.window` response; the native trace recorded matching process
and bundle identities and an active, key, visible prepared reply. This does
not explain or resolve the earlier f157 startup timeout. The reporting-only
candidate changed neither activation behavior nor its 35-second client deadline.

The selected tooltip observation for PID 30952 reports both permissions true,
an active/key/visible owner, an untruncated traversal, and the actual cursor
inside the trigger with the pointer-sequence flag cleared. The outside baseline had
zero help tags. The last hover observation contained one nonempty
`AXHelpTag`, window 41, whose corresponding window was visible and onscreen.
Its `textMatchesExpected` was false and the matching shown-tag count was zero.
That is an unmet captured-strings predicate, not an absent native tag or proof
that the displayed text was wrong. The original captured strings and pixels
remain uninspected; the collection path and actual displayed text are not
resolved by this selected summary.

The complete source/native logs, 19,151/79,188 UTF-8 bytes, were independently
retrieved and rehashed. Exact build, startup and tooltip JSON lines are retained
without reserialization. The original timestamped tooltip block preserves its
single JSON record and all nine interleaved stderr lines. The startup reporter
correctly marked its command-prefix read incomplete and emitted no whole-file
commands hash. Compiler, fixed live-log snapshot, original process/sample,
original tooltip and ZIP hashes remain producer-reported until those bytes can
be inspected. Native artifact 13822004903 reports 46 files and 1,472,767 bytes;
its original members and screenshots remain unextracted/unviewed. Tooltip
capture/dismissal and later acceptance gates were not promoted, and passed-only
AppKit distribution remained skipped.

The same actual merge passed all **32 rendered overlay tests** in
[run 42944976784](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42944976784),
job 130275485356. The [completed browser receipt](../evidence/v1-web-a685bd1-overlay-pass/README.md)
retains the independently rehashed complete 43,810-byte log and completed
metadata. Render artifact 13822033472 reports 280,598 bytes; its ZIP/PNGs remain
unextracted/unviewed. This helper browser pass does not satisfy the outstanding
native desktop, final combined-candidate or physical-device gates.

### November 11 AppKit startup failure and browser correction

The completed follow-up at head
`f157c9bf207f8ceae890e299f9667b56ab78360d`,
actual merge `6d6b913c771e49385e5a57c9737b66fbeb07a9a7`,
tree `ac12abeb27d91dcb978492d9aad187c4f198e3b5`, has a
[separate startup-failure receipt](../evidence/v1-appkit-f157c9b-startup-timeout/README.md).
The actual merge's full 2,048-leaf tree and ordered parents were independently
verified. Native run 42938338972 passed all eleven source checks with zero
failures/skips, clean installed-consumer/API verification, the actual
Foundation/socketpair probe and native compilation. Runtime then failed
`Native driver response timed out awaiting tron.window (request 2)`.

The verifier had not reached its root-main mount check or allocated tooltip
evidence.
The absence of a tooltip summary is expected; this run provides no new tooltip
observation. The original activation trace, client transcript and process
sample remain unextracted, so the failed activation phase and thread state
during the request are unknown. Historical 8fe late-reply observations are not
assigned to this run. The inspected current source and historical evidence
do not yet justify changing the activation behavior or its unchanged
35-second client deadline.

The complete original source/native job logs are 19,328/53,466 UTF-8 bytes and
were independently retrieved and rehashed. The exact selected build summary
records exit zero and a producer-reported 12,329,248-byte original compiler
transcript. Runtime artifact 13820233523 reports 1,416,533 bytes and 44 uploaded
files. Its original ZIP members and the compiler transcript remain unextracted
and independently unverified; their reported hashes remain distinct from the
inspected log identities. Passed-only AppKit distribution was skipped.

The same helper's corrected browser fixture passed all 32 rendered overlay
tests in run 42938339031, job 130253832511, at that exact actual merge.
The [completed browser receipt](../evidence/v1-web-f157c9b-overlay-pass/README.md)
retains the full original 43,807-byte log and normalized completed metadata.
This closes the missing `@nyc-tron/core/overlays` alias failure in that run.
Artifact 13820060342 reports 280,598 bytes; the rendered ZIP and PNGs remain
unextracted/unviewed. These helper results do not replace final combined
candidate verification, native desktop acceptance or physical-device gates.

### November 11 bounded startup evidence

The source-reviewed follow-up at helper
`a685bd17d3023307181371a9c042bfbc1530c232`, tree
`0b3c93477329d5db0076e0f6a54c6afa2dbcd3b8`, changes only the private
`verify-native.mjs` reporter. Its complete 2,048-leaf tree differs from f157
at that one path. The [source review](../evidence/v1-appkit-a685bd1-startup-observation-source/README.md)
keeps implementation review separate from the next native run.

The reporter executes after the existing failure capture and before the
original exception is rethrown and the owned driver/app are closed. It reads
only the existing app log, command transcript and process-failure JSON.
The live app log contributes at most a 1 MiB prefix, retained once with
exclusive creation as `startup-app-log-snapshot.log`. Its digest identifies
those captured bytes, never the eventual original app log. File-change,
identity, truncation and unread-byte observations remain explicit.

The command and process reads are capped at 256 KiB plus one overflow byte.
Only complete reads with consistent observed file metadata receive a
whole-file digest. The projection selects fixed phases, commands, owned-PID
records and typed values; arbitrary payloads, errors and paths are omitted.
Missing values remain distinct from observed false or zero. ISO timestamps
must round-trip exactly, so normalized invalid calendar dates are rejected.
The first/last selection operates within a 4,096-line scanned prefix, with
an 8,192-byte line limit and explicit omitted/unscanned counts.

The complete console envelope is capped at 32 KiB including markers and
newlines. Reproducible V8/mock checks exercised real trimming to 32,766 bytes,
snapshot conflicts, changing files, exact/over read caps, PID filtering,
unknown values and secondary errors. Those checks use in-memory adapters;
they do not execute Node filesystem or native AppKit operations. Root also
verified the complete verifier's syntax in V8 with its module-only syntax
adapted for parsing, and exact reversal restores the prior verifier bytes.

The native application and driver, activation sequence, single-session
protocol, 35-second client deadline, permissions, gestures, assertions,
existing evidence writes, cleanup and passed-only archive gates are unchanged.
No startup cause, native correction or acceptance pass is inferred from this
source-only diagnostic. Actual runtime results remain separately required.

### November 11 AppKit compile and tooltip-hover result

The [completed 3891 run](../evidence/v1-appkit-3891ee1-tooltip-hover-failure/README.md)
passed eleven source checks with zero failures/skips, clean consumer preparation,
the fifteen-subpath/33-declaration API check, the real Foundation/socketpair
probe and ARM64 native compilation. Actual merge
`8cf0e6fd70c9984c471560e432783e0881f0f63d` matches helper tree
`335314d5b47567fa2db208096707a52d99b23a09`; all 2,048 leaves and the actual
merge's ordered parents were independently verified.

The workflow's new bounded build reporting worked in the actual run. Its
source-bound envelope reports build exit zero and an original compiler
transcript of 12,329,153 bytes, SHA256
`bf800a11426fa2d749ecd29127fc72728e586704ebecb2d8c78dfca3554c78aa`.
That file's bytes remain unextracted and the hash is producer-reported.
The complete 53,338-byte native job log was separately retrieved and verified;
the retained 318-byte build-result log summary is explicitly derived from it.

The exact first runtime failure is `Timed out waiting for new visible native
help-tag text after the posted pointer reaches the trigger`, at
`verify-native.mjs:257:29`. The unchanged wait requires actual cursor-inside,
a cleared pointer-sequence flag and matching AXHelpTag text with nonzero
element/window frames. The console does not isolate the failed conjunct.
Earlier menu/property assertions, Boolean type checks, the enabled hover branch
and outside/no-matching-tag baseline completed according to verified source
control flow; original runtime JSON remains uninspected. No cursor-arrival,
AX trust value, missing tooltip, permission denial or underlying cause is
invented. Later popover and OS-drag assertions were not reached, and passed-only
distribution retention/upload were skipped.

Artifact 13818227148 reports 45 uploaded files, 1,448,094 bytes and SHA256
`550dd8f292b02c1d8a2c7b5728802ef31b694341a25bdd652e67585ee889e078`.
Original ZIP/member bytes and screenshots remain unextracted/unviewed. This
new result does not establish the earlier cea run's uninspected first failure.
The [source-reviewed follow-up](../evidence/v1-appkit-f157c9b-tooltip-observation-source/README.md)
at `f157c9bf207f8ceae890e299f9667b56ab78360d` adds failure-only reporting of
the already-retained tooltip JSON, with exact original-byte/hash binding,
strict unknown-value handling and a 16 KiB complete console-envelope cap.
Native commands, gestures, deadlines, assertions, original evidence writes and
passed-only distribution gates remain unchanged. Its actual PR merge is
`6d6b913c771e49385e5a57c9737b66fbeb07a9a7`, matching full 2,048-leaf tree
`ac12abeb27d91dcb978492d9aad187c4f198e3b5` and the verified ordered parents.
[Native run 42938338972](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42938338972)
was newly started at the source checkpoint; actual runtime outcomes are
recorded separately. Source/V8 checks do not establish native execution.

The aggregate-specific AppKit workflow is
`c19589c71bf77b8145766ee9efe446b4cdce0142`, based on
`98721a164949cac6238c009ec5d5602d21473308`, with canonical archive inputs
preserved. The helper-specific workflow is distinct. The separate
[3891 rendered-overlay failure](../evidence/v1-web-3891ee1-overlay-alias-failure/README.md)
stopped at fixture bundling because the helper lacks the core overlay alias.
The aggregate already has the exact one-line fix, and f157 now backports it
to this helper. [Rendered-overlay run 42938339031](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42938339031)
was newly started at the source checkpoint. Its result remains separate from
the original failed run. This fixture issue does not identify the native tooltip cause.

### Windows: OS drag starts, rejected-drop result still failing

[Windows at `988008c`](../evidence/v1-windows-988008c-drag-transition-failure/README.md)
compiled and deployed, passed overlay-removal traversal and strict inspector
remount/draft/new-edit assertions, then failed during the drag-scene transition.
The [diagnostic run at `0ae548a`](../evidence/v1-windows-0ae548a-native-crash/README.md)
repeated those passes and captured an actual process crash before any OS drag.
The complete original ZIP, minidump and native job log remain unchanged.

[Exact binary, symbol, source and unwind analysis](../evidence/v1-windows-0ae548a-native-crash/analysis/README.md)
identifies the enabling-CanDrag path through WinUI cross-slide registration to
an unmatched island input-site failure. The calculation stops at the unsymbolized
NYC-Tron library frame; it does not invent an own-library source line. The exact
upstream source is bound by the PDB source-server revision and compiler checksum.

The reviewed correction at `d17aa297` waits for actual RNW mounting, WinUI
loading and a live connected owned island before enabling drag capabilities.
It replays current properties, cancels on readiness loss, rejects late events
and prevents disposed callbacks from cancelling a replacement surface. All
49 source/controller checks passed in the prepared isolated workspace. Its
[completed native run](../evidence/v1-windows-d17aa29-drag-start-failure/README.md)
passed source, native library and executable compilation, deployment, overlay
removal and strict inspector remount. It reached the drag scene and arranged
the two windows without the earlier crash, then failed the first real drag-start
phase. The owned process/window remained alive; the crash-event query completed
with no matching records. The original screenshot and automation tree show
the native source button's reported bounds approximately 45 pixels above its
rendered position after resizing. The adapter layout path is under review;
no arbitrary gesture offset or weakened assertion is used. All 21 original
artifact files and the complete log are retained. No passed Windows archive
or completed OS-drag/navigation result follows from this failed run.

The follow-up at `a0ea5e2e` uses RNW's public own-layout event after new metrics
are committed. It refreshes only the retained live ChildSiteLink translation,
replacing the old own-origin contribution while preserving the current ancestor
and scroll offset and accounting for scale changes. No SDK source, driver
coordinate or native assertion changes. The focused portable C++17 regression
and all 49 existing isolated checks passed independently. Its
[completed native run](../evidence/v1-windows-a0ea5e2-drag-start-failure/README.md)
compiled and deployed, then again failed the first drag-start phase. The final
native bounds now match the button's painted position, closing the observed
45-pixel discrepancy in that final state. Initial pointer coordinates/readiness
and direct WinUI DragStarting delivery were not recorded; the failed label
reflects JS state.

Further review of the exact WinUI source found a separate reachable blocker:
[ButtonBase handles the press](https://github.com/microsoft/microsoft-ui-xaml/blob/eb74b62692d9cdef17575bc11ebd3514ec6cd5b6/src/dxaml/xcp/dxaml/lib/ButtonBase_Partial.cpp)
before the [automatic drag helper's ordinary handler](https://github.com/microsoft/microsoft-ui-xaml/blob/eb74b62692d9cdef17575bc11ebd3514ec6cd5b6/src/dxaml/xcp/dxaml/lib/AutomaticDragHelper.cpp).
The reviewed follow-up at `e37b1873` uses a real ContentControl drag region with
an explicit native Custom/NYCTronDragRegion peer, inherited name/enabled/focus
semantics and a complete hit-test background. WinUI still owns recognition,
DragStarting, DropCompleted and the existing data/broker lifecycle. The driver
now requires stable owned native endpoints, checked ordered SendInput moves
and retained pointer/window/provider observations. Seven portable mocked-provider
regressions and all 49 isolated checks passed; actual Win32 input is separate.
Its [completed native run](../evidence/v1-windows-e37b187-peer-compile-failure/README.md)
passed source checks but failed library compilation because the composable
implementation does not expose `this->as<FrameworkElement>()`. The complete
original native job log and checkout identity are retained. Application build,
deployment and native interactions were skipped in that run.

The independently reviewed one-line correction at `8effb2db` uses the pinned
C++/WinRT composable base's `static_cast<Xaml::FrameworkElement>(*this)`
conversion. [Its completed native run](../evidence/v1-windows-8effb2d-native-drop-outcome/README.md)
passed source, native library and executable compilation, deployment and the
previous overlay/edit/remount assertions. The first real OS drag-start phase
now passed. All 24 checked pointer steps reached the owned target window, the
button-up insertion succeeded and completed-drag count became one. The next
strict assertion failed: the final result was `none/cancelled` instead of the
required `none/rejected`. The app/window remained alive with 51 descendants and
zero matched crash events; document ownership remained main and transfers zero.
Accepted move and explicit cancellation cases were not reached.

All 22 original artifact members, the complete original ZIP and the complete
native job log are independently verified and retained. The new receipt proves
native endpoint bounds and the actual held cursor over the owned target before
release. It does not record target event delivery, extracted nonce or broker
offer acceptance, so the missing rejection result's cause remains under review.
Strict transfer and cancellation outcomes remain required. Portable checks had
not compiled the failed e37 peer implementation; the successful 8eff native
compiler result is recorded separately.

The reviewed diagnostic candidate at `5a9709d9` preserves the native gesture,
nonce transport, target checks, broker decisions and strict outcome assertions.
An opt-in private hook records bounded lifecycle, target-event, data-read and
broker phases without storing document content, owner tokens or nonce values.
The runner retains the original trace with verified copy hashes. Source checks,
fresh installed-consumer preparation, generated bindings and fixture typechecks
passed in [run 42912913242](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42912913242).
The native library, consumer executable and deployment also passed. The
[completed native result](../evidence/v1-windows-5a9709d-missing-target-events/README.md)
again failed the required `none/rejected` assertion after a real source drag.
The target's last capability observation records it loaded, connected, enabled
and ready with `AllowDrop: true`. The trace then records source start, data
preparation and completion with effect `none`, but no target enter/over/drop/leave
or broker hover/offer. It contains 29 consecutive records without truncation or
a record-error marker. This narrows investigation to native target event
delivery; nonce validation was not observed. All 24 original artifact members,
the complete ZIP and complete native log are independently verified and retained.
The exact tested merge is `ea5f13f4ecff638c7c1d062403c62e2227fa9513`, whose
tree matches the published helper tree `7562beb4363bbc54797b75a41f6d9525eb008faf`.

The reviewed follow-up at `f450eaa2` adds a bounded read-only environment
diagnostic before pointer input. It observes actual owned HWND parent chains,
process-token elevation/integrity/UIAccess, EnableLUA and only two already-loaded
Microsoft UI module files. It preserves original first-observation JSON and
prints a selected, hashed log summary with explicit omissions. UIA and Win32
class labels remain distinct, and a missing UIA handle is never guessed.
The existing final endpoint recheck and native gesture/outcome assertions remain.

Its [source checkpoint](../evidence/v1-windows-f450eaa-environment-source/README.md)
retains the complete original source-job log and exact reconstruction identities.
[Run 42924119449](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42924119449),
actual merge `3765f328a994524b530c8876b8e2228c2d36a878`, passed the 13-check
native-source gate and the full 49-check source/adapter suite, including those
same 13 checks. These are 49 distinct checks, not an additive 62. Types, packing
and the eight-subpath/44-declaration API snapshot passed. The required Windows
PowerShell Desktop 5.1 x64 step passed actual script parsing, production diagnostic
C# compilation and all eight environment plus seven input regressions.

The [completed native receipt](../evidence/v1-windows-f450eaa-rejected-drop-failure/README.md)
records successful installed codegen, RNW application generation, native library
and actual executable compilation, and deployment. UIA reached the required
rejected-drop result wait after the source drag-start step, then failed:
`UIA element named 'Native drag result: none/rejected' did not appear within 30 s`.
The owned process remained alive; the final traversal reported 51 descendants
and the crash query reported zero matching Application Error/WER records.
The complete original 333,924-byte native job log is independently verified.
The actual final label, native target-event trace and full original environment
file remain inside the unextracted runtime artifact; the previous 5a
`none/cancelled` and zero-target-event observations are not attributed to this run.
Passed-only Windows distribution retention and upload were skipped.

The actual selected log summary records integrity RID 12288 (0x3000, high
integrity), elevation type 1 (no linked token), UIAccess 0 and EnableLUA 1.
The explicit TokenElevation query failed with Win32 error 24; its failing call
stage was not recorded and TokenIsElevated is unknown. Microsoft documents
[elevated/admin execution as unsupported for StartDragAsync](https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.uielement.startdragasync?view=windows-app-sdk-1.8).
This is a compatibility concern requiring the successful process-token read,
not a demonstrated cause of the observed drag failure. Both owned input-site
chains stop deliberately at the foreign desktop boundary; hidden/zero-area
input-site HWNDs alone do not establish bad drag registration. The diagnostic
hashes identify files at the two loaded-module paths, not in-memory image bytes.

The separate follow-up at `c3a52cfc25e90ea01f802c360cacfdc34f0f24b8` changes only
the diagnostic scalar token buffers and its required compatibility regression.
Its [completed source and native receipt](../evidence/v1-windows-c3a52cf-elevated-drag-failure/README.md)
retains the original 31,780-byte source log, original 337,399-byte native log,
exact selected environment JSON line, completed metadata and reviewed source
identities. [Run 42926949889](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42926949889)
tested actual merge `a79c975bd77834ab80f1fe3fda022009ecd48de0`, with the same tree
as the helper and independently verified ordered parents.

The 13-check native-source invocation and full 49-check suite, including those
13 checks, passed with zero failures/skips. The required Windows PowerShell
Desktop 5.1 x64 gate passed the real owned compatibility-process token query
and borrowed-handle guard, plus all eight environment and seven input groups.
Installed codegen, RNW generation, native library compilation, actual executable
compilation and deployment passed. The app's own TOKEN_QUERY now also succeeds:
PID 4868 reports TokenIsElevated 1, elevation type 1, integrity RID 12288 and
UIAccess 0, with no token-close error and stable process identity. This directly
observes elevated app privileges; it is separate from the compatibility process
and does not fill in the missing f450 observation.

The native gate still failed the same required `none/rejected` result within
30 seconds. The owned process/HWND remained alive, the final traversal reported
51 descendants, and the crash query reported zero matching records. Passed-only
archive retention/upload were skipped. The final actual label and original
native target-event history remain uninspected inside artifact `13814737077`.
Its metadata reports 334,258 bytes and SHA-256
`4e13f2a29c1e457de2f22de4b679cd67211c70d50023ffed50555e6b0b8c69cb`;
the ZIP and members have not been independently rehashed/extracted. No earlier
`none/cancelled` or zero-event observation is assigned to this run.

Microsoft's documented elevated/admin restriction applies to the automatic path
used here: at the matching XAML PDB's source revision, CanDrag configures the
automatic helper and its mouse/pen threshold path directly calls StartDragAsync.
The start-operation source also records the elevated-process limitation.
The [upstream source review](../evidence/v1-windows-c3a52cf-elevated-drag-failure/upstream-source-review.json)
binds the current loaded-path file hash to the previously verified official PE,
matching PDB and source-server revision, and identifies all four fetched source
blobs. The earlier individual C13 checksum match is limited to InputServices.cpp.
A supported unelevated interactive session is therefore required for further
drag acceptance. The runtime does not show that the null-operation guard fired
or caused this timeout; the actual cause and an eligible existing shell remain
unproved. No launcher, security, production drag, gesture timing or strict
assertion change is made.

The [same-revision browser receipt](../evidence/v1-web-c3a52cf-rendered-and-consumer-pass/README.md)
retains five complete original logs: 32 overlay, 29 reference-browser and 686
instrument tests passed; three reference-model tests passed with zero failures
or skips. Expo passed two installed-consumer cases; basic passed one and skipped
the Expo-only case passed by the Expo lane. All logs identify the actual c3
merge. Original render ZIPs/PNGs remain unextracted/unviewed, and these helper
passes do not establish the final combined candidate.

The exact c3 aggregate workflow merge adds only the same two reviewed blocks
(33 lines), preserving canonical archive inputs, verification and retention.
Removing them restores preimage `7332c96514fefc1d54bacef61689289fd51b5bed`;
the result is `988737b29372fdb4b7eaf69e5f1c8da85654a9e9`. The already reviewed
token-query helper is blob `721e781922999ec95f9246719b2678edd41fbc64`.

The aggregate retains canonical workspace archive inputs, manifest checks and
original archive retention; only the exact new compatibility step is inserted
into that workflow. The helper also carries the existing reviewed core overlay
alias correction. The [completed browser receipt](../evidence/v1-web-f450eaa-rendered-and-consumer-pass/README.md)
retains four complete original logs from the same actual f450 merge: 32 overlay
and 686 instrument tests passed; Expo passed two installed-consumer cases, while
basic passed one and skipped the Expo-only case passed by the Expo lane.
Artifact ZIPs/PNGs remain unextracted/unviewed. These helper passes do not replace
the frozen combined candidate's browser or native results.

The preceding 5a helper's separate [browser overlay failure](../evidence/v1-web-overlay-5a9709d-bundle-failure/README.md)
occurred before browser assertions because its source fixture lacked the exact
`@nyc-tron/core/overlays` alias. The aggregate already contains that one-line
correction from `2899ffde`. The original failure log and exact source comparison
remain retained. No local rendered assertion pass is claimed.

### AppKit: menu generations passed; latest native interaction gate failed

[AppKit at `c0f6601`](../evidence/v1-appkit-c0f6601-live-mount-timeout/README.md)
passed eight source checks, installed-consumer preparation/API checks and native
compilation, then timed out on initial `waitFor(root-main)` request 2 before
activation or any interaction group. The unchanged native/client deadlines were
20/35 seconds. The [real socket source gate](../evidence/v1-appkit-c0f6601-driver-source/README.md)
is separate from that failed native result.

The corrected client retained the failed session until sampling finished. The
actual process was present before and after capture; 25 thread groups show
ordinary AppKit loop/layout activity, mostly idle JavaScript with some microtasks,
and a native thread in `recv` beneath unsymbolicated app frames. The sample is
not evidence of a startup deadlock and does not establish whether the missing
reply was serialized or sent. Nonfinite geometry remains an unproved hypothesis.
The complete original artifact is retained alongside the trace and process
evidence. The
preceding [d42 empty sample](../evidence/v1-appkit-d42b445-mount-timeout/README.md)
and [7af visible-but-non-key attempt](../evidence/v1-appkit-7afcf31-foreground-failure/README.md)
remain attached to their own checkouts.

The follow-up at `0308fbdb` applies an independently reviewed, exact-preimage
Spark 0.0.2 test-driver patch only in the generated private native-acceptance
consumer. It records bounded request/execution/reply/serialization/send stages
and returns explicit failure for invalid or throwing serialization. Original
and patched source, license and input hashes are retained. Three filesystem
guards, JavaScript syntax and aggregate workflow lint passed. The
[completed Mac run](../evidence/v1-appkit-0308fbd-late-main-reply/README.md)
passed eleven source checks, the real Foundation/socketpair probe and native
compilation, then again failed the initial root wait before activation. Its
trace places the delay before reply: the main reply arrived about 35.281 seconds
after dispatch, after the client deadline, then serialized and sent successfully.
No serialization failure or replacement occurred. The late payload was discarded;
its byte length cannot establish its success/error fields. All 42 original files,
complete original ZIP, source-job log and exact patch/probe inputs are retained
and independently verified.

On the actual Mac probe, both senders preserved the finite response. All six
invalid original inputs threw without sending bytes; each patched input produced
an explicit failure. No probe case demonstrated silent nil-return output. These
controlled results do not establish the earlier c0 timeout's cause. The live
sample has 27 thread groups but begins after timeout, so it does not describe
the complete preceding execution state.

The verifier-only follow-up at `3b1d6745` moves its existing strict owned-window
show/activation before the unchanged root mount and JS-ready waits. The pinned
host creates its exact main window and native placeholder before React, and the
command/inspection path does not require Fabric mount. This corrects the
interactive test's startup ordering without assigning a historical cause.
Its [completed native run](../evidence/v1-appkit-3b1d674-context-menu-tracking/README.md)
passed all eleven source checks, the actual Foundation/socketpair probe, native
compilation, strict same-process activation, root mounting and JS readiness.
The native controls/display interaction group passed. Native application-menu
and context-menu save actions reached React and updated the saved title, but
the later context-menu dismissal assertion timed out. Hover, popover and OS-drag
acceptance were not reached. The complete original ZIP, all 42 member hashes,
source job log and exact checkout are retained and independently verified.

The private fixture lacked a native end/new-generation barrier between selecting
the first menu and canceling the second. Selection could resolve its React
Promise while the first menu still tracked; the next inspection accepted any
tracked menu. All 367 subsequent status responses still showed the saved state,
and the failure sample shows a native menu tracking. The original trace cannot
identify which menu received cancellation or prove a production callback defect.

The reviewed follow-up at `8fe74048` derives generations and completion from
actual NSMenu begin/end notifications. Actions require the exact live generation;
the verifier observes the first native end before reopening, requires a newer
second generation and observes its end after cancellation. The existing native
cancelTracking operation, save/title and canceled/dismissed assertions remain.
Its [completed native run](../evidence/v1-appkit-8fe7404-late-activation-reply/README.md)
passed all eleven source checks, installed consumer/API, actual Foundation probe
and native compilation, then timed out on the initial `tron.window` show request
before root-mount inspection or any menu operation. The native trace dispatches
the command promptly but records its reply about 35.486 seconds later, after the
unchanged client deadline. It serializes 157 bytes and sends 158 successfully,
without replacement or serialization failure. The discarded late payload's
length does not establish activation state or success/error fields.

The app remains present before and after sampling; 29 thread groups were
captured. The sample starts after the timeout and cannot establish the preceding
execution state. All 42 original members, the unchanged full ZIP, complete
source log, compiler log and exact patch/probe inputs are verified and retained.
The menu-generation correction was not reached in that 8fe run. The following
candidate at `92c7882e` adds a bounded private-driver activation phase trace
to distinguish the request, callback and main-continuation stages while preserving
the activation API, operation order, deadlines and native assertions. Diagnostic
details are evaluated inside an exception guard; observations cannot replace
the real operation or reply.

[Run 42912189002](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42912189002)
passed all eleven source checks, clean installed-consumer/API checks, the actual
Foundation/socketpair probe and native compilation. Its exact tested merge is
`36e1a765428b54fe7200bb077c0c69e04eedf14c`, whose tree matches helper tree
`3a66490ec9997478e34061b5757e8fb3d8c6278d`. The original trace establishes
a successful same-process, visible/key/active/frontmost activation in about
1.115 seconds. The off-main workspace callback, main continuation and reply
were all observed. This successful run does not establish the cause of the
earlier late replies or show that instrumentation corrected that cause.

The actual application menu passed. Context-menu generation 1 was selected
and ended; generation 2 was canceled and ended; React then reported
`Native context menu dismissed`. Tooltip property and accessibility-help
checks passed. The first failure was request 44, tooltip permission inspection:
`postEventsAllowed: true` and `accessibilityTrusted: 1`. The strict verifier
correctly required the latter to be a boolean. Actual tooltip hover, popover
interaction and cross-window OS drag were not reached; the passed-distribution
upload was skipped.

Before the execution workspace disconnected, root independently verified the
complete original 833,107-byte ZIP, all 42 member hashes and the complete source
job log. The original ZIP SHA-256 is
`d0e7a8ed62ba34c529afc93361a4b736a37b156cfec8898d313a0f75fc0aca44`.
That receipt was committed locally at
`3b5d45116c839d8df221ee27df3512319be294d3`, but its original files have not
yet been published into the aggregate. They must be recovered and verified
before their later retention is claimed. GitHub artifact `13809117349` remains
available; this status paragraph does not substitute for the unpublished receipt.

The reviewed correction at `cea75ae6` makes both private
`AXIsProcessTrusted()` observations explicitly select `@YES` or `@NO`.
Each site still queries the real API once and preserves the actual value.
Strict JavaScript boolean assertions, actual permission requirements, activation
ordering, deadlines and required CGEvent gestures remain unchanged; no permission
prompt or permission change was introduced.

[Run 42916675370](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42916675370),
actual merge `b7ededbb446cf129a30b76673afe55235fb4afe8`, passed all eleven
source checks, clean installed-consumer/API checks, the Foundation/socketpair
probe and native compilation. The interaction step failed and the passed
distribution upload was skipped. Its original artifact `13810981867` is
available: metadata reports 834,146 bytes and SHA-256
`f9be7224c06d49c406726173dc7fb26c05a859a7f86f93525c943bd319d1c075`.
Those bytes have not yet been independently rehashed or extracted, and the
exact first failing assertion remains uninspected. The workspace is unavailable
and the full native-job log endpoint returns a transport error. No activation,
permission or gesture result is inferred from the job-level failure or elapsed
duration. The [continuation checkpoint](../evidence/v1-desktop-2026-11-10-continuation/README.md)
records the published source and the separate evidence-recovery boundary.

### Actual gestures remain mandatory

A separate review closed an acceptance gap: AppKit previously could produce a
passed archive after observing denied CGEvent permission and omitting actual
hover/drag checks. The current native verifier requires both completed
CGEvent tooltip-hover and NSDraggingSession/cross-window-transfer results
before any passed report or archive receipt. Permission denial retains a
clear blocked diagnosis and fails the native gate. The aggregate archive
merger independently requires both check identifiers; eight focused merger
regressions passed, including omitted and permission-blocked gesture cases.

The frozen combined candidate still needs completed native results and exact
tested archive receipts before desktop acceptance or release assembly. The
source inventory remains 332 local plus nine pinned external rows; full
acceptance across all eight required platforms is not inferred from these
individual component or diagnostic results.

## November 11 helper mobile result

The separate [helper mobile receipt](../evidence/v1-mobile-12e35b4-helper-ui-failures/README.md)
records native-controls run 42958884395 at actual merge
`96e7558fbb859a2430b0f192bb5f11e940229cfa` (helper `12e35b48`).
Source checks passed 131 tests across ten groups with zero failures, skips
or cancellations. Android native compilation and eleven decoder checks passed
before a generic Maestro wrapper failure; its detailed assertion is uninspected.
iOS metadata reports native compilation and decoder step 20 passed,
UI step 21 failed, and evidence upload succeeded. Two failed original-log reads
leave its decoder count and assertion unknown; only the second returned error
text was retained, reporting `Transport closed`.

The explicit 168-path source comparison has six differences and nineteen
matching navigation paths. This helper lacks the aggregate's PR61 cancellation
fix and later snapshot-retention, pointer-fixture and canonical-archive changes.
Those additional changes are not all attributed to PR61. The result does not
establish mobile flakiness, either failure's cause, or a regression of the
reviewed aggregate. Original source/Android logs are retained; original iOS log
and artifact ZIP/member bytes remain unavailable or uninspected as specified
in the receipt. No acceptance or release gate changes.

## November 10 native integration

The chronology below preserves each checkpoint's results and original failures.
References to a next candidate or fresh run describe the requirement at that
historical revision; the desktop boundary above and completed canonical mobile
receipts below provide the later recorded status.

### Repaired mobile and browser checkpoint

PR 61 head `2899ffdedf98e2a86c077f15aa1baf6401c07b80`, tested through merge
`0576bea35225fde1437a50263c8154aca525ec8d`, passed all six of its
[source, native, browser, reference and installed-consumer workflows](../evidence/v1-native-2899ffd/workflow-runs.json).
The original downloaded mobile artifacts were independently checked against
their reports, package identities and complete native payloads.

| Target | Actual result at this checkout | Retained evidence |
|---|---|---|
| Android | Native compilation, eleven media checks and all four UI flows passed, with zero recoveries. The unchanged Home/resume cancellation test records one committed stroke, one cancellation, zero predictions and final phase cancel | [Original reports, captures and independently verified APK](../evidence/v1-native-2899ffd/android/README.md) |
| iOS | Native compilation, eleven media checks and all three UI flows passed, with zero recoveries. All 226 app payload entries match the manifest; both native keyboard-dismissal branches completed | [Original reports, captures and complete payload verification](../evidence/v1-native-2899ffd/ios/README.md) |
| Browser overlays | All 32 Chromium tests passed after fixing the shared overlay source alias; the original screenshot artifact was independently verified | [Original result and selected captures](../evidence/v1-web-overlays-2899ffd/README.md) |

These passes establish the repaired mobile/browser checkpoint. The assembled
candidate, including the later desktop corrections, needs its own exact-revision
native gates. The source and full eight-platform acceptance counts are unchanged.

The retained [installed-package hash comparison](../evidence/v1-native-2899ffd/workspace-archive-comparison.json)
also exposes a distribution gap at this checkpoint: iOS and Android independently
packed the same source on their runners, and all ten installed archive hashes
differ. The original workflow artifacts did not retain those input `.tgz` files,
so the receipts cannot establish whether their payload content or only archive
metadata differs. Both runtime passes remain valid for their recorded inputs;
they do not establish that both platforms tested one exact release archive set.
The follow-up now produces the thirteen workspace archives once in the existing
Ubuntu source job. Its manifest records the actual checkout, package identities,
versions, byte counts and hashes. Both mobile consumers verify that manifest
against the producer's job output and verify npm's installed file resolution and
integrity. The aggregate release workflow passes that same artifact to browser
and desktop consumers, then retains and rechecks the thirteen workspace archives
after adding the two tested desktop archives. The producer manifest and original
workspace checksum file remain with the fifteen-archive candidate. Fresh installed
native runs are required; PR 61 head `2a74fbf5bc5f3be5137af73d9590ce05abaaf0b0`
contains the narrow mobile/provenance changes while the aggregate includes the
release handoff. Seventeen focused checks passed in that mobile source tree,
including actual offline npm installation and rejection of stale source,
tampering, wrong versions and same-version repacking.

The [fresh canonical producer](../evidence/v1-native-2a74fbf/workspace/README.md)
passed at tested merge `0ce41081d56acb365c1c1cf382eeaff27aa24543` in native run
`42871225491`. Its original ZIP, all thirteen archive hashes/sizes and embedded
package identities were independently verified. The producer manifest hash is
`34335d9968c0c4baab066ef454c29d25be04f8514b9778bbc23f52c29647b4fa`.
Both native jobs completed successfully with those canonical inputs. The
[Android receipt](../evidence/v1-native-2a74fbf/android/README.md) records all
eleven media checks and four UI flows, with zero transport recoveries. The
[iOS receipt](../evidence/v1-native-2a74fbf/ios/README.md) records all eleven
media checks and three final UI flows, with one evidence-qualified initial
Settings transport recovery. Independent verification matched both consumers'
manifest and checksum bytes, all ten installed package hashes and npm
integrities, and the complete APK/iOS app payload identities.

The original iOS evidence also records one missing hidden driver log and one
uploaded XCTest log whose hash differs from its pre-recovery receipt. Its
classification inputs match, but this run does not establish complete recovery
log retention. The later independent snapshot/scoped upload correction and
Android pointer-fixture status-bar correction remain prospective at this
checkpoint. The frozen combined candidate must pass fresh native gates with
its own canonical archives; the original receipts and their limitations remain
attached to `2a74fbf`.

### Earlier mobile and desktop checkpoint

At the earlier source checkpoint `0edd5f302e99877191ba9a412c5c060571a5f6c9`,
the [iOS installed consumer](../evidence/v1-native-0edd5f3/ios/README.md)
passed native compilation, all eleven media checks and all three native UI
flows with no transport recovery. The complete 226-file app payload matches
the retained manifest. Both [installed browser consumers](../evidence/v1-release-consumers-0edd5f3/README.md)
also passed, with the Expo/web job succeeding after one registry-transport
retry. These receipts name actual tested merge
`e597d73757911e9a58005d577b3c2bf2496bd798`.

Android at that same checkpoint compiled and passed all eleven media checks,
Settings, Editor and the normal pointer lifecycle. Its final pointer-cancel
assertion failed: the diagnostic recorded a cancel at 0,0 while the accepted
stroke remained down. The [original Android evidence](../evidence/v1-native-0edd5f3/android/README.md)
retains that failed result and the independently verified APK. The capture
does not contain the incoming device/pointer IDs; the Android platform's
synthetic-cancel contract and adapter source identify reliance on those
synthetic contents as the defect. [PR 61](https://github.com/mikevocalz/NYC-Tron-UI/pull/61),
head `2899ffdedf98e2a86c077f15aa1baf6401c07b80`, cancels the view's retained
contacts before parsing a cancel event. It keeps the strict router and original
native cancellation assertion, and also repairs the isolated browser fixture's
missing shared overlay alias. Its [fresh Chromium overlay run](../evidence/v1-web-overlays-2899ffd/README.md)
passed all 32 tests at actual merge `0576bea35225fde1437a50263c8154aca525ec8d`.
Both fresh native jobs also passed as recorded above; the original failed
cancellation result remains attached to its own checkout.

That same checkpoint's new Windows native build and deployment succeeded,
but its screenshot driver failed on a nonfocusable top-level UIA window;
the whole job remains failed. AppKit's actual build stopped in Expo's Swift
source under Xcode 16.4, before native adapter acceptance. The original
[Windows](../evidence/v1-native-0edd5f3/windows/README.md) and
[AppKit](../evidence/v1-appkit-0edd5f3-compiler-failure/README.md)
failures remain attached to their own revision. Their corrections are part of
the desktop interaction follow-ups below.

The first combined head `0a4f34b9334814f5bfd9b1568402a2a131faedd8` produced
the following actual native checkpoint:

| Target | Observed result | Evidence |
|---|---|---|
| Android | Native compilation, all eleven strict media checks and four OS UI flows passed; no transport recovery | [Original reports and APK verification](../evidence/v1-native-0a4f34b/android/README.md) |
| Windows | Installed C++ library and app compiled; packaged navigation and seven desktop lifecycle check groups passed | [Original reports, tested archive and capture limitations](../evidence/v1-native-0a4f34b/windows/README.md) |
| iOS | No runner was assigned; GitHub canceled the queued job after repeated allocation attempts | [Original capacity annotations](../evidence/v1-native-0a4f34b/ios/README.md). No app execution or UI result exists for this head |
| AppKit | Clean archive installation, official Spark analysis and installed API checks passed; native build stopped before Xcode because new-project migration initialization was missing | [Run 42841109849](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42841109849). The follow-up invokes Spark's official template/migration initialization and requires a fresh native run |

The follow-up also shares the existing popup geometry and command-item types
through `@nyc-tron/core/overlays`, with compatible UI re-exports. All prior public
declaration signatures and external type boundaries are preserved; the shared
API now has 619 subpaths and 3,306 reachable declarations. The subsequent
desktop interaction implementation is recorded below; the earlier successful
Windows lifecycle checkpoint does not establish its native interaction results.

### Desktop interaction implementation

The AppKit follow-up is [PR 59](https://github.com/mikevocalz/NYC-Tron-UI/pull/59),
with source checkpoint `a097b8bad924115a9e49a38d8ccf33ab257707cc`. It adds real
NSMenu/context menus, NSView tooltips, a Fabric NSPopover with retained React
content, and anchored inspectors. Popover placement is checked against the
observed native window frame and selected usable region; resizing preserves the
active native field editor. Its driver requires native controls and lifecycle,
menu invocation, inspector edits, dismissal/focus return, constrained placement,
and the document drag protocol. At that checkpoint, an OS-posted drag was required when the host
granted input-posting access, while denied TCC capability was recorded as missing
gesture evidence. The current stricter gate above requires actual gestures for
any passed native receipt. The workflow selects and verifies Xcode 26.2 for the pinned
Expo 55 runtime before compiling.

The [actual Xcode 26.2 build at fd86](../evidence/v1-appkit-fd86-compiler-failure/README.md)
passed the toolchain probe, clean installation and installed API check, then
failed on the private acceptance driver's missing Yoga header path. The current
head uses the pinned React Native Fabric dependency helper for both native
pods. It also gives detached popovers the actual native window measurement
boundary, preserving React child ownership while aligning responder page
coordinates with Fabric measurements. A fully visible ordinary Pressable must
pass synthetic NSEvent down/move/up through the actual RCTSurfaceTouchHandler;
that check is separate from native control target/action and OS gesture proof.
The [next actual native build at 4c96008](../evidence/v1-appkit-4c96008-compiler-failure/README.md)
reached the AppKit adapter, then stopped because Apple and React Native both
declare `Point` and `Size`. The current head qualifies those React Native types
and renames the private driver's `Rect` helper to avoid Apple's typedef. That
failed build did not reach the acceptance driver's compilation or any native
interaction. All fifteen required native groups still need the fresh run. The
tooltip property/help check is explicitly separate from actual hover visibility.
The aggregate also adds public native help-tag observation when the actual
process allows Core Graphics event posting. Cursor readback must reach and leave
the visible trigger, a new `AXHelpTag` must expose the expected text and native
frame, and its window must disappear after exit. A native help-tag content bitmap
is retained during hover; owner capture follows dismissal. Permission denial
records blocked hover evidence separately. A permitted but unobserved hover fails
the run. Those earlier revisions made the sixteenth permission-observation group
mandatory while leaving actual gesture groups conditional on host capability.
The current native and archive gates above close that conditional-pass gap.

The Windows follow-up is [PR 60](https://github.com/mikevocalz/NYC-Tron-UI/pull/60),
with source checkpoint `fc85173985e7e7a2a9d37e2562151b6a70092278`. It adds actual
WinUI MenuFlyout, ContextFlyout, Flyout inspectors, ToolTipService, and native
cross-window DataPackage drag/drop. Inspector event acknowledgements preserve
newer native typing until the app accepts or rejects the corresponding edit.
Native drag deferrals retain one app-owned transfer decision and require both
that decision and an observed OS Move completion before reporting a transfer.
The native driver covers rejected, cancelled, close-during-approval and accepted
gestures. A separate UIA stage checks Settings focus return, real window resize,
explicit RTL, drawer collapse/reopen and an actual high-contrast setting change;
it restores and verifies the original OS/window state afterward.

The [first Windows interaction build](../evidence/v1-windows-fc85173-compiler-failure/README.md)
reached the installed C++ library but failed on a `XamlIsland` member absent
from the pinned SDK. Follow-up head
`3e2c88f91905b23e2286659948cfcf1970292264` removes that unsupported setter and
retains the supported native Flyout constraint. It also guarantees drag
completion after cleanup errors and waits for app-committed popup dismissal.
Private scope/request acknowledgements permit a subsequent dismissal after a
veto that produces no React commit. Forty-nine isolated tests, five portable
C++ state regressions, official code generation, a fresh archive consumer and
the unchanged installed API snapshot passed for the same source tree. The
[second native build](../evidence/v1-windows-3e2c88f-compiler-failure/README.md)
passed installation/codegen but stopped on the native
TextChanged sender signature and a precompiled-header boundary in the portable
assertion file. Head `9b902a2506493c0c754a34509eab17923876940d` matches the SDK's
IInspectable sender and compiles only that assertion file without precompiled
headers. Neither failed compiler run reached UIA. The
[subsequent 9b902a2 native run](../evidence/v1-windows-9b902a2-tooltip-failure/README.md)
passed the library, consumer executable and deployment, then progressed through
window lifecycle and native menu/context actions. It failed on the missing
hover tooltip before inspector, drag or navigation-accessibility acceptance.
Head `b19b76078476c0945c7b942e43fceaa5ad7b3feb` observes popup closure, sends a
fresh off-anchor/on-anchor mouse movement, and verifies actual cursor position
and native hit identity before requiring the genuine tooltip and its dismissal.
The production tooltip remains unchanged; the original trace does not establish
the cause of its absence. The [b19b760 rerun](../evidence/v1-windows-b19b760-hit-provider-failure/README.md)
again compiled and deployed the app, then observed the cursor inside the visible
anchor. Its new leaf-provider identity assertion stopped the run before the
tooltip wait. The pinned RNW source permits an island/container provider fallback;
the original trace does not establish which unnamed provider it returned. Head
`f08accf14f5d23936000b815694947f784552e28` records the complete provider chain,
requires actual cursor placement and app foreground ownership, and keeps genuine
ToolTip visibility and dismissal as the blocking interaction assertions. Fresh
runtime evidence remains required.

The [actual f08accf run](../evidence/v1-windows-f08accf-inspector-edit-failure/README.md)
passed genuine ToolTip visibility/capture and dismissal, while recording the
outer `DesktopChildSiteBridge` point provider. It then failed the strict rapid
inspector test: both the native field and app state show `NativeRapi123abc`,
missing the requested `d`, with acknowledgement 15. The original captures do
not record per-mutation callback interleaving. Source review found that advancing
the native counter in asynchronous `TextChanged` permitted an older app response
to replace a newer mutation before its event was observed. Head
`4b730937b5eae8356227738bb0f422dce7bd8e47` observes text/count synchronously in
`TextChanging` and queues the existing event without changing the native visual
tree. Three focused portable C++ regressions and all 49 isolated package tests
passed. The unchanged rapid-input test and later native groups require a fresh
run; no tested desktop archive was retained from the failed f08accf gate.

The assembled Windows reference fixture also gives each remounted inspector a
new native mount key and edit-count domain while preserving its draft. Old-mount
callbacks cannot repopulate that domain. Same-stage selection retains the live
field and its count. Five owner tests pass, including coalesced leave/return;
the combined candidate's UIA additionally requires observed unmount, draft
restoration, a zero initial count and the first accepted new edit.

Both implementations are included in the combined candidate. Their actual
native builds and interaction results must be recorded against the exact
tested revision before acceptance or a tested archive is claimed. The Windows
follow-up also removes the failed top-level UIA SetFocus call from screenshot
capture; it retains foreground-window and stable-bounds checks. The original
failure is preserved in [the 0edd5f3 evidence](../evidence/v1-native-0edd5f3/windows/README.md).

The source candidate now includes both isolated desktop implementations:
`@nyc-tron/windows-fluent-fabric` binds native WinUI navigation and shared-runtime
secondary windows, and `@nyc-tron/macos-appkit` binds actual Spark AppKit controls,
display enumeration and the shared window lifecycle. Their runtime pins stay
separate from the Expo 58 application lane. Their platform workflows must still
compile and exercise the installed archives before a native pass is recorded.

The complete distribution inventory is now **fifteen archives**: thirteen
workspace packages plus the two isolated desktop packages. The release workflow
requires both native desktop jobs, downloads their passed-only package artifacts,
checks the exact candidate revision, package identity and SHA-256, and copies
those same archive bytes into the candidate. It does not rebuild a desktop
package after native acceptance. Both native receipts remain with the candidate.
Release consumers now share the standard packer's single Ubuntu-produced set of
thirteen workspace archives, including staged licenses and notices. Each native
desktop job imports its peers from that artifact, and the merger requires their
hashes to match the retained release packages. Standalone desktop PR workflows
retain their existing Ubuntu peer producer; those receipts identify their own
inputs and do not establish the release workflow's shared-artifact handoff.

Local integration verification at source `54002b8a` passed 1,199 tests with no failures or skips,
workspace builds and types, 619 shared public subpaths, 3,306 reachable
declarations, thirteen workspace archive checks and seventeen clean consumer
imports. The isolated installed APIs have separate TypeScript 5.9.3 baselines:
Windows has eight typed subpaths and 44 reachable declarations; AppKit has
fifteen typed subpaths and 33 reachable declarations. Their external type
boundaries number 24 and 57 respectively. The full and subset release
packers produced byte-identical core and Windows contract archives.

The twelve integration rows remain implemented at source level. This change does
not promote the canonical acceptance ledger: the requirement remains 341 rows
with actual accepted evidence on each of the eight specified platforms. Physical
pen/palm behavior, assistive-technology speech, headset execution, multi-display
interaction and performance still require the applicable device evidence.

The keyboard correction at `e8a7efb9f0971746d01c68532540c65af502de9f` preserves
the native interaction assertions and driver commands. It enables drag dismissal
on existing scroll surfaces and Done submission on the two single-line reference
fields. Its evidence and original failure are recorded in
[V1-NATIVE-KEYBOARD.md](V1-NATIVE-KEYBOARD.md). Later native execution results must
be bound to their own run and app identity.

## Earlier observed CI and local results

The following tables and retained artifacts are historical checkpoints. Their
fourteen-package counts and earlier Windows API shape describe those revisions;
they are not the current fifteen-package desktop inventory.

| Gate | Observed result | Evidence and limit |
|---|---|---|
| Source, exports, types and package checks | Passed for PR head `e2b65dd5e9288b193b6bfd807d6003b184b8c642`; 1,173 tests on Windows | [CI run 42770189328](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42770189328), including the declaration-graph gate |
| Installed basic UI consumer | Passed: one Chromium test; one Expo-only test intentionally skipped | [Consumer run 42770189171](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42770189171), job `129675906719`; [original result](../evidence/v1-automated-e2b65dd5/consumers/basic/results.json) |
| Installed Expo/web consumer | Passed: two Chromium tests | Same run, job `129675906970`; [original result](../evidence/v1-automated-e2b65dd5/consumers/expo/results.json); UI, core, panes and Expo controls came from produced tarballs |
| Native consumer packaging | Passed locally: ten NYC-Tron archives installed in a new npm project; strict app typecheck and Expo iOS/Android exports completed | iOS: 1,142 modules; Android: 1,144 modules; approximately 2.4 MB Hermes bundle each, including the generated reference MP4. These are bundling results, not native runtime results |
| Native iOS installed consumer | Compiled and passed all eleven strict decoder checks at `e2b65dd5`; the UI flow failed when the simulator cancelled its first Settings contact | [Native run 42770189195](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42770189195), job `129675906574`; [original reports and payload verification](../evidence/v1-native-e2b65dd5/ios/provenance.json). The whole job remains failed |
| Native Android installed consumer | Compiled and passed all eleven strict decoder checks at `e2b65dd5`; Maestro's initial app launch returned `device offline` before any UI assertion | Same run, job `129675906933`; [original reports and APK verification](../evidence/v1-native-e2b65dd5/android/provenance.json). The whole job remains failed |
| Windows native consumer | Actual C++ consumer build, registration and keyboard UI Automation passed at head `e2b65dd5` | [WinUI run 42770189124](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42770189124); [retained capture](../evidence/v1-automated-e2b65dd5/windows/03-accepted.png). This does not establish Narrator speech or physical-device input |
| Workspace public declaration snapshot | Passed locally for the follow-up's shared window-model extraction | 13 packages, 618 typed public subpaths, 3,306 reachable project declarations, 94 external type boundaries; TypeScript 6.0.3. The new core subpath is additive; the existing panes subpath re-exports the same declarations |
| Isolated Windows public declaration snapshot | Passed locally after its own dependency install and build | 1 package, 1 typed public subpath, 4 reachable project declarations, 7 external type boundaries; TypeScript 5.9.3 / RN 0.85.3 |
| Tooling regressions | Passed locally | Eight declaration-graph regressions and five tarball-integrity/dependency-boundary regressions |

The retained installed-consumer captures below are associated with PR head `7b5b3de`; GitHub checked out its
merge commit `1a5e0ad8033b51b9aefb16178158249a60291016`. Both consumers recorded
that exact checkout. The retained
[results, archive hashes and runtime pins](../evidence/v1-release-consumers-7b5b3de/results.json)
preserve this distinction. Captures were downloaded from the successful CI
artifacts; the basic narrow and Expo/web wide captures were visually inspected:
[basic wide](../evidence/v1-release-consumers-7b5b3de/basic-wide.png),
[basic narrow](../evidence/v1-release-consumers-7b5b3de/basic-narrow.png),
[Expo/web wide](../evidence/v1-release-consumers-7b5b3de/expo-web-wide.png),
[Expo/web narrow](../evidence/v1-release-consumers-7b5b3de/expo-web-narrow.png).
The fixtures use minimal app styling to exercise package consumption. The
[complete installed-consumer rerun](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42765514145)
also passed at head `7aec1ec1`; the older retained images remain labeled with the
revision that produced them.

Local headless Chromium could not launch because the managed runtime denied
its process socket; its attempted download also returned an invalid archive.
No local browser pass is claimed. The browser evidence above is from GitHub's
Chromium run using Playwright 1.62.1 and Chrome Headless Shell 151.0.7922.34.

## Forge service runtime

The final Forge implementation/driver candidate `f5469d03` passed actual iOS and
Android runtime in [run 42765520077](https://github.com/mikevocalz/nitro-forge/actions/runs/42765520077).
Original [iOS](../evidence/v1-forge-f5469d0/ios/provenance.json) and
[Android](../evidence/v1-forge-f5469d0/android/provenance.json) receipts, process
identities, complete payload manifests and artifact hashes are retained here.
Each platform passed all fifteen final checks after a genuine process restart,
including MMKV/Yjs and all eleven engine snapshots. These are service/runtime
results for that exact Forge commit, separate from NYC-Tron's native UI gate.

## Verified decoder checkpoint and UI transport follow-up

At head `e2b65dd5`, all six nonmobile workflows passed. The
[retained CI record](../evidence/v1-automated-e2b65dd5/nonmobile/ci.json) includes
686 browser instrument cases, 29 reference cases plus three model tests,
installed consumers and the actual WinUI executable/UI Automation run. The
reference images were downloaded again and match the delivered images byte for
byte. Their current artifact identity and render measurements are retained.

Both native decoders passed the unchanged eleven checks in run `42770189195`:
24,000 PCM frames, 8,000 downsampled frames, 48,000 upsampled frames, 32,000
full-interval frames and 4,000 tail frames; the presentation index has forty
entries. Original receipts and native payload manifests are preserved above.
The Android APK and complete iOS app payload were independently rehashed from
the verified downloaded archives and match the runtime identities.

The UI failures are separately recorded. Android lost its ADB transport during
Maestro's initial launch command, before an app assertion. iOS's recorded
Settings contact was cancelled by the simulator's Recap registration race;
the [original log lines and timestamps](../evidence/v1-native-e2b65dd5/ios/ui/delivery-evidence.json)
bind the unknown sender and nonempty cancelled contact to that tap and app.
The actual iPhone 17 Pro/iOS 26.5 host has correct safe-area header/tab bounds,
and the previous SwiftUI raw-text error is absent. No successful Settings,
Editor or pointer result is inferred from those failed attempts.

The follow-up permits one transport recovery only when those initial-command
conditions are proven. It preserves every original failed driver artifact and
reruns the entire unchanged Settings flow. Any second failure, ordinary
assertion failure or later interaction remains final. The
[native UI guide](../../../tooling/native/UI_ACCEPTANCE.md) defines the limits.
Fresh native execution remains required. Local full verification passed
1,180 tests with no failures/skips, the API and canonical-roster gates, thirteen
workspace packs and sixteen clean consumer imports. The isolated Windows
archive was retained and checked, giving fourteen reviewable archives.

The same follow-up moves the existing pure window model into peer-free
`@nyc-tron/core/window-lifecycle`, retaining the panes compatibility export.
Its behavior is unchanged and all thirty-nine lifecycle tests pass. This lets
isolated native hosts share one lifecycle contract without adopting an
incompatible renderer peer. The AppKit and Windows host implementations still
require their own source review and native results before support is claimed.

## Corrections leading to `e2b65dd5`

The `7aec1ec1` source gate passed 1,169 Windows tests with zero failures/skips,
and all six source/browser/consumer/WinUI workflows passed. Its actual Android
Settings and Editor flows each executed and passed, including native labels,
screenshots and observed safe-host geometry. The complete native workflow
remained failed because the later pointer and media checks failed; no partial
result is represented as a whole-job pass.

The `e2b65dd5` candidate corrected those findings:

- A newly selected Android audio extractor stays at its original beginning when
  preroll reaches zero, preserving the fixture's negative-PTS AAC priming packet
  for Codec2's existing delay trim. No output timestamps or expected counts change.
- SwiftUI Slider labels use actual SwiftUI Text children, matching the pinned
  Expo 58 Slot contract. The old raw string caused a real native LogBox.
- The pointer page places live feedback above its canvas and allows the remaining
  controls to scroll, preserving the actual touch/cancel assertions.
- Native runners first consume the actual Metro JavaScript bundle response with
  bounded time/bytes and retained status/hash metadata. A running `/status`
  endpoint alone had allowed cold compilation to consume the decoder's receipt
  deadline; the captured iOS app was still at `Bundling 76%...`. The native receipt
  deadline and decoder assertions remain unchanged after this preparation step.

The decoder corrections passed in the fresh `e2b65dd5` run recorded above.
Its complete UI flow still failed at test input delivery. Complete platform
acceptance, native host adapters, physical input/speech/performance and owner
review remain bounded by [Support](../../SUPPORT.md) and the release conditions.

## What the installed-consumer gate proves

[`consumer-release.mjs`](../../../tooling/consumer-release.mjs) verifies each
archive against `SHA256SUMS`, prepares a new directory outside the repository,
and installs `file:` tarballs with the existing exact runtime pins. Missing
NYC-Tron artifacts fail instead of falling back to npm. Both isolated desktop
adapters are rejected from the Expo dependency lane. Installed versions and locations are
recorded, and the browser bundle must resolve only inside the new app and use
the installed UI distribution.

The basic consumer installs UI without core, Expo, Expo UI, Skia, gesture
handler, TanStack Table, drag/drop content view, linear-gradient or Uniwind.
Those absences are asserted after installation. Its form saves a trimmed name,
rejects an empty value without overwriting saved data, and retains the original
focused input and draft at widths 1280, 600, 320 and 1024. It also checks for
horizontal overflow. The Expo/web consumer exercises the real browser picker,
selection callback, appearance state and adaptive master/detail pane behavior.

Native jobs copy the authored reference screens and assets into their clean
consumer, use installed package CSS sources, run Expo export and native
prebuild, and compile the resulting iOS/Android host. They retain package
hashes, the generated npm lockfile and acceptance-build artifacts. Release
depends on these reusable jobs through relative workflow paths, so its checks
run at the selected release candidate. See
[`release.yml`](../../../.github/workflows/release.yml),
[`release-consumer.yml`](../../../.github/workflows/release-consumer.yml), and
[`native-controls-port.yml`](../../../.github/workflows/native-controls-port.yml).

## Candidate assembly and explicit publication

The common thirteen-workspace-plus-two-desktop archive path remains in the
existing release workflow. Manual runs now have an explicit boolean `publish`
input whose default is `false`. The sole release/tag creation step requires
successful prior gates and either the existing tag-push event or a manual
`publish: true` input. A manual candidate run cannot create a release or tag
even if all acceptance and owner-review checks later pass.

The source/native/archive and stable-readiness checks are unchanged. The exact
fifteen-archive candidate uploads before readiness; an unmet stable acceptance
or owner-review requirement still fails that check and retains its blocked
readiness report. There is no `continue-on-error` or fabricated approval. All
thirty focused readiness/archive regressions passed; the two workflow guard
tests and actionlint also passed independently on the combined source.

Any final candidate invocation must explicitly select the frozen
`codex/v1-completion` revision, `version: 1.0.0` and `publish: false`. The current
default branch has an earlier release workflow and is not the reviewed common
archive candidate. No release workflow was dispatched for this guard change.

## Public API gate

[`api-signatures.mjs`](../../../tooling/api-signatures.mjs) follows TypeScript
symbols from every published declaration target. It records exported aliases,
normalized declarations, public props, callbacks, return types, overload order,
and all reachable project types, including private helpers exposed through a
public type. Unused private helpers are excluded. It also records the ordered
export-condition maps, so moving an adapter between browser and native
conditions cannot silently pass.

External libraries form explicit boundaries with their installed package
version, package-relative declaration path, symbol and directly referenced
declaration. The whole React/DOM dependency tree is not presented as NYC-Tron
source. Missing named or inline-import types fail collection. Absolute install
paths are excluded; a relocation regression verifies this. Snapshot drift
fails the normal check and never rewrites its baseline.

Run from the repository root:

```sh
corepack pnpm build
node tooling/api-surface.mjs
node tooling/api-signatures.mjs
node --test tooling/tests/api-signatures.test.mjs
```

After reviewing an intentional public change, update the workspace baseline
explicitly with `node tooling/api-signatures.mjs --write`. Review the resulting
[`api-signatures.json`](../../api-signatures.json) diff for required props,
unions, callbacks, generics and return values; this gate detects changes and
does not decide their semver compatibility automatically. An export-key change
also needs the existing explicit `api-surface.mjs --update` workflow.

The Windows package has an isolated baseline and uses its own installed compiler,
preserving the RNW 0.85 / TypeScript 5.9 lane:

```sh
npm --prefix packages/windows-fluent/rnw-fabric install --package-lock=false --no-audit --no-fund
npm --prefix packages/windows-fluent/rnw-fabric run build
node tooling/api-signatures.mjs --package packages/windows-fluent/rnw-fabric --snapshot docs/api-signatures-windows.json
```

Append `--write` to the last command only for a reviewed update to
[`api-signatures-windows.json`](../../api-signatures-windows.json). The isolated
Windows workflow runs this check before it tests and retains the native archive.
The AppKit workflow likewise checks its separate
[`api-signatures-macos.json`](../../api-signatures-macos.json) against the clean
installed Spark consumer. Its compiler and runtime dependencies stay in that
consumer rather than entering the Expo 58 workspace.
The metadata export `./package.json` is not a typed component subpath.

## Licensing and distribution review

The repository and all fifteen distributable packages carry the original-code
MIT license. Each package is `private: true`, has version `1.0.0`, declares
`license: "MIT"`, and includes `LICENSE` in its `files` list. This inventory was
checked directly, including both nested desktop packages. The thirteen workspace
archives were produced successfully with the pack gate's notice, license,
declaration, compiled-export and workspace-specifier checks.

The desktop adapters are intentionally different: their archives include
typed `src/` for native codegen as well as compiled `dist/`. They are packed in the
separate runtime lanes. README and release notes describe this exception and the
different notice locations accurately; `pnpm pack:release` alone produces the
thirteen workspace archives; the native desktop jobs supply the other two.

The [root provenance inventory](../../../THIRD_PARTY_NOTICES.md) records
NYC-MON/NeonBlade, ArtCraft-family ports, Floating UI, AudioKit, optional Skia,
Vico, Mediabunny and the RNW sample pattern. Existing upstream license texts are
retained. No Exact source/runtime or external product artwork was copied for
the native-feel reference.

Mediabunny 1.65.2 remains an unmodified dependency. Its MPL-2.0 text is present
at `packages/platform-services/third-party/mediabunny/LICENSE`; the
[package notice](../../../packages/platform-services/THIRD_PARTY.md) identifies
the exact source archive, upstream commit and SHA512 integrity. Mozilla's
[MPL 2.0 sections 3.1–3.4](https://www.mozilla.org/en-US/MPL/2.0/) and
[distribution FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/)
are the primary references for covered source availability and retained
notices. The inventory and pack checks do not constitute an owner compliance
attestation. The previously documented owner distribution-review requirement
remains in [D2](../../V1_DECISIONS.md#d2-licensing-and-provenance) until an actual
record is provided; none was invented here.

## Native UI interaction gate

The required native jobs now run the built clean-tarball app through pinned
official Maestro 2.12.1. Settings editing/save and Editor draft retention/save
use actual OS taps, text input and scrolling. A separate native pointer entry
requires one real touch/up stroke; Android additionally verifies an active
touch is cancelled when Home removes app focus. This is separate from the
media decoder's runtime receipt.

The runner retains JUnit, native accessibility trees, screenshots, command and
Metro logs, complete native artifact identity, installed archive hashes, source
revision and the tool's verified release SHA-256. iOS identity hashes a sorted
manifest of the entire app payload, including the debug dylib and frameworks;
the launcher hash is recorded separately. Android identity hashes the APK bytes.
The manifest is saved before installation, including when a run fails. It rejects empty, skipped or failed reports,
missing semantic labels, missing screenshots and stale output directories.
Media and UI run independently against the same built app, and either failure
keeps the native job red. Both native jobs upload the evidence even on failure. The
[native UI gate guide](../../../tooling/native/UI_ACCEPTANCE.md) records the
pinned tool/source, commands and exact flows.

Focused artifact/evidence/media, bundle preparation and native adapter regressions
passed locally, along with native example typechecking and Maestro's actual
parsing of all four flow files.
Settings and Editor now require observed OS header/tab bounds to lie within the
measured safe-content host; the regression uses the actual failed iOS geometry. The local
driver found no connected devices; that result is not native interaction
acceptance. The candidate's simulator jobs must produce their own reports.
Physical pen/palm behavior, spoken VoiceOver/TalkBack output and active iOS
touch cancellation remain separately recorded device checks.

## Stable publication gate

The release requires the reusable actual Windows C++/WinRT compile and UI
Automation workflow, the AppKit native compile and lifecycle workflow, and the
generic Windows package lane. It also
requires the reference browser workflow's authored flows, screenshots and
render measurements. These are required jobs on the release candidate itself;
older green runs do not satisfy them. This wiring is separate from a claim that
the new candidate has already passed those native jobs.

After collecting all fifteen archives, the release uploads
`release-candidate-v<version>` with every `.tgz` and `SHA256SUMS`. It then runs
[`release-readiness.mjs`](../../../tooling/release-readiness.mjs). The retained
archives remain reviewable if stable publication is blocked. A separate
`release-readiness-v<version>` artifact records the decision and blockers.

Stable publication requires both conditions:

1. All 341 canonical rows are accepted. The existing component validator still
   requires completed local or pinned external implementation and an existing
   passed evidence reference for each of the eight required platforms. The gate
   never writes acceptance statuses.
2. The owner distribution review in
   [`distribution-review.json`](../distribution-review.json) is approved for
   this version and this exact fifteen-archive checksum manifest. The gate
   hashes the actual archives, checks the complete inventory and version, then
   reads the linked comment through GitHub's API. The response must identify
   `mikevocalz` as the repository owner and contain the exact approval statement.
   A pending record, missing author/evidence, different hashes, deleted comment
   or unavailable API cannot authorize stable publication.

The tracked review remains `pending`. When the owner has reviewed the retained
archives and their included notices, the comment body must contain exactly:

```text
NYC-Tron distribution approval
Version: 1.0.0
SHA256SUMS-SHA256: <sha256 of the exact SHA256SUMS file>
I approve distribution of these NYC-Tron release archives with their included licenses and source notices.
```

The reviewed record can then set `status: "approved"` and name
`approval.reviewer`, `approval.manifestSha256`, and `approval.commentUrl` (the
owner's `https://github.com/mikevocalz/NYC-Tron-UI/pull/<number>#issuecomment-<id>`
URL). The gate performs a read-only
[GitHub comment lookup](https://docs.github.com/en/rest/issues/comments#get-an-issue-comment);
it never submits an approval comment. Using an owner comment also works when
the owner authored the PR and cannot approve their own pull-request review.

For a local readiness check:

```sh
node tooling/release-readiness.mjs --version 1.0.0-rc.1
node tooling/release-readiness.mjs --version 1.0.0 --artifacts /path/to/fifteen-archive-candidate
node --test tooling/tests/release-readiness.test.mjs
```

The first command validates the canonical scope and tracked review while
allowing candidate work to remain pending. The second is expected to block
today: the platform ledger is unverified and no owner approval has been
recorded. Packing a candidate does not promote it to stable or change any row.
Nine regression tests cover forged approval records, wrong owner/statement,
missing platform evidence, altered archives, API failure, immutable statuses,
and release job dependencies/artifact ordering.

## Acceptance boundary

These results establish specific source, packaging, type and browser gates.
They do not establish VoiceOver/TalkBack/Narrator speech, physical pen pressure
or palm behavior, hardware folds, tracked headset poses, or successful native
media playback merely because a bundle or binary exists. Current runtime
reports, performance measurements and platform limitations must be read with
the complete [platform closure report](V1-PLATFORM-CLOSURE.md) before the stable
release decision. The user-approved twelve N rows remain active scope.
