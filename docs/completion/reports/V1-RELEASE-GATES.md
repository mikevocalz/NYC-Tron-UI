# v1 release-gate evidence

Recorded 2026-11-10. This report covers distribution, installed consumers,
public API declarations and provenance. The twelve native/Forge integration
rows and their platform acceptance are tracked separately in
[V1-PLATFORM-CLOSURE.md](V1-PLATFORM-CLOSURE.md). No tag, release, npm publish or
blanket device-acceptance claim is created by this report.

## Current desktop gate boundary

The latest completed desktop attempts still failed their complete native gates.
The original failures, supported corrections and new native runs have separate
receipts; a source or compiler pass does not substitute for interaction results.

### Windows: crash point passed, native drag start still failing

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

### AppKit: live process, missing initial reply

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
reply was serialized or sent. A bounded acceptance-driver transport trace is
being prepared; nonfinite geometry remains an unproved hypothesis. The complete
original artifact is retained alongside the trace and process evidence. The
preceding [d42 empty sample](../evidence/v1-appkit-d42b445-mount-timeout/README.md)
and [7af visible-but-non-key attempt](../evidence/v1-appkit-7afcf31-foreground-failure/README.md)
remain attached to their own checkouts.

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
