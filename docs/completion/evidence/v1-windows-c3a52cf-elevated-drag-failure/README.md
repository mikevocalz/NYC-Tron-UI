# Windows c3a52cf: token query passes; rejected drop still fails

[Run 42926949889](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42926949889)
tests helper `c3a52cfc25e90ea01f802c360cacfdc34f0f24b8`, tree
`3d38ebbc0f68124cfc1b7ec654382931bf1a7cf2`, through actual PR merge
`a79c975bd77834ab80f1fe3fda022009ecd48de0`. The merge has the same tree and
ordered parents `0edd5f302e99877191ba9a412c5c060571a5f6c9` and the helper head.

## Correction and completed validation

The [preceding f450 run](../v1-windows-f450eaa-rejected-drop-failure/README.md)
recorded a failed TokenElevation query with no value and no failed-call stage.
This correction queries the three documented scalar token outputs with fixed
four-byte buffers. The variable-length integrity SID retains bounded sizing,
actual-length validation and SID bounds. Existing handle/token/buffer ownership
and cleanup remain. No launcher, security configuration, native drag, gesture,
deadline or outcome assertion is changed.

The required Windows PowerShell Desktop 5.1 x64 gate compiles the production C#
declarations and adds an actual read-only query of the owned compatibility
process. All four outputs must be observed with non-null values. TokenIsElevated
uses zero/nonzero DWORD semantics; elevation type must be a valid enum. The
expected-PID mismatch guard must reject the borrowed handle without opening
another process, and the retained process handle must remain usable.
This real check passed, together with the unchanged eight environment and seven
input regression groups.

Source job `130215725384` passed the 13-check native-source invocation and
the full 49-check source/adapter suite containing those same 13 checks.
Both invocations had zero failures/skips, establishing 49 distinct checks.
Types, packing and the eight-subpath/44-declaration API snapshot passed.
Native job `130216123785` passed installed codegen, RNW application generation,
native library compilation, actual consumer compilation and packaged deployment.

UIA then failed the unchanged required result:

> UIA element named 'Native drag result: none/rejected' did not appear within 30 s

It reached that wait after the required source drag-start step and checked OS
pointer path. The owned process `4868` and main HWND `459140` remained alive.
The final traversal reported 51 descendants and the crash query reported zero
matching Application Error/WER records. Passed-only archive retention and upload
were skipped. The final actual result label and original native target-event
trace remain inside the unextracted artifact; this receipt does not assign them
the earlier run's `none/cancelled` value or zero target-event count.

## Actual app token, separate from the compatibility process

The selected app environment summary was captured at
`2026-11-11T00:02:59.6461746Z` for PID `4868`, with process start
`2026-11-11T00:02:42.8786375Z`.
The before/after process identity was stable. TOKEN_QUERY returned:

| Field | Actual status/value |
|---|---|
| TokenElevation / TokenIsElevated | observed, DWORD 1 |
| TokenElevationType | observed, enum 1 |
| Integrity RID | observed, 12288 (0x3000) |
| TokenUIAccess | observed, DWORD 0 |
| Token close error | null |
| Registry64 EnableLUA | observed, DWORD 1 |

Microsoft defines nonzero [TokenIsElevated](https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_elevation)
as elevated privileges, RID 0x3000 as [high integrity](https://learn.microsoft.com/en-us/windows/win32/secauthz/well-known-sids),
and elevation type 1 as [no linked token](https://learn.microsoft.com/en-us/windows/win32/api/winnt/ne-winnt-token_elevation_type).
Thus the app's elevated state is now directly observed. It is not inferred from
the compatibility process, the registry setting or the vendor DLL build string.
This successful query does not retroactively supply the missing f450 value.

Microsoft documents [elevated/admin execution as unsupported for StartDragAsync](https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.uielement.startdragasync?view=windows-app-sdk-1.8).
The production component configures CanDrag and subscribes to DragStarting and
DropCompleted. At the matching XAML PDB's source revision, WinUI's
[automatic mouse/pen helper](https://github.com/microsoft/microsoft-ui-xaml/blob/eb74b62692d9cdef17575bc11ebd3514ec6cd5b6/src/dxaml/xcp/dxaml/lib/AutomaticDragHelper.cpp)
directly calls StartDragAsync after its movement threshold. The
[start-operation implementation](https://github.com/microsoft/microsoft-ui-xaml/blob/eb74b62692d9cdef17575bc11ebd3514ec6cd5b6/src/dxaml/xcp/dxaml/lib/StartDragAsyncOperation.cpp)
also documents the elevated-process limitation and guards a missing lower-level
async operation. The documented restriction therefore applies to the automatic
path used here; a supported unelevated interactive session is a prerequisite
for further drag acceptance.

[upstream-source-review.json](upstream-source-review.json) records the complete
identity chain and all four independently fetched upstream source blobs.
The current loaded-path XAML file hash matches the previously verified official
PE, matching PDB and source-server revision. The prior C13 checksum validation
applies only to InputServices.cpp; no individual compiler-input checksum match
is claimed for these four newly fetched files. This static source evidence does
not show that the null-operation guard ran or caused this timeout. The actual
failure cause remains unproved, and an eligible existing unelevated shell or
replacement host has not been established.

The loaded-path file hashes for Microsoft.UI.Xaml.dll and Microsoft.UI.Input.dll
again match the f450 observations exactly. File and process stability were
observed. These remain file identities, not in-memory hashes or a trace of
internal drag-manager calls. Owned native ancestry stops at the foreign desktop
boundary; hidden/zero-area input-site HWNDs do not prove bad registration.

## Exact retained bytes

| File | UTF-8 bytes | SHA-256 |
|---|---:|---|
| [source-job.log](source-job.log) | 31,780 | `cea904328c8fdb93fd05d4b0949f674dfac9b7270b287ba845103cb4880c0e52` |
| [native-job.log](native-job.log) | 337,399 | `8d41ef526eec0f105d14b4f83e54210bc37c893d0543644083758bd3ec90558b` |
| [environment-log-summary.json](environment-log-summary.json) | 10,319 | `b67603cc48d1c3487003de6509699d9043e722cb02b199135a5a78019e33ffc4` |

Both complete original decoded logs retain their original line endings and have
independent full-string/byte verification. The summary is the exact single JSON
line from the actual marker envelope with only the timestamp prefix and log
line ending removed; no newline is added. It is not the full original
`drag-environment-01.json`. The producer reports that original file as
51,970 bytes and SHA-256
`b4f0bf1b8a17a6993a6ff0638e633910e1bad5a5bd25ca0646741fc8f3411ee2`;
its bytes have not been independently extracted or rehashed.

Original artifact `13814737077`, `winui-fabric-uia-smoke`, is reported as
334,258 bytes and SHA-256
`4e13f2a29c1e457de2f22de4b679cd67211c70d50023ffed50555e6b0b8c69cb`.
The producer reports 39 uploaded files. Original ZIP bytes, member contents and
screenshots remain uninspected. [provenance.json](provenance.json) and
[workflow-metadata.json](workflow-metadata.json) keep these producer reports
separate from independently verified log bytes.

## Integration and remaining work

[source-review.json](source-review.json) binds the exact two-file correction.
The aggregate retains its canonical archive inputs, verification and retention.
Applying only the same two workflow insertions, totaling 33 added lines, to
aggregate preimage `7332c96514fefc1d54bacef61689289fd51b5bed` yields
`988737b29372fdb4b7eaf69e5f1c8da85654a9e9`. Removing those insertions restores
the aggregate preimage byte-for-byte. The helper workflow is not substituted
for the aggregate workflow.

The [same-revision browser receipt](../v1-web-c3a52cf-rendered-and-consumer-pass/README.md)
records 32 overlay, 29 reference-browser and 686 instrument passes, plus three
reference-model passes and the explicit installed-consumer pass/skip results.
Those helper results do not satisfy the failed native gate or the final combined
candidate's release run. The execution workspace remains unavailable for
original ZIP extraction, recovery of unpublished local receipts or final local
combined-source verification. The umbrella remains held pending desktop
convergence, complete canonical archives, platform evidence and exact owner
distribution approval.
