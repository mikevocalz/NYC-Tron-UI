# Windows f450eaa completed rejected-drop failure

[Run 42924119449](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42924119449)
tests helper `f450eaa21589bcc72e6d25f31a1b205e7015ff01`, tree
`0ddf3e304dc2e1265baeaa24984674bd5985a64b`, through actual PR merge
`3765f328a994524b530c8876b8e2228c2d36a878`. The merge has the same tree and
ordered parents `0edd5f302e99877191ba9a412c5c060571a5f6c9` and the helper head.

## Completed outcome

The [source checkpoint](../v1-windows-f450eaa-environment-source/README.md)
records the 13-check native-source gate and the full 49-check source/adapter
suite, which includes the same 13 checks. Both invocations passed with zero
failures/skips. These are 49 distinct checks. Types, package preparation and
the eight-subpath/44-declaration API snapshot passed.

Native job `130206543842` passed the mandatory Windows PowerShell Desktop 5.1
x64 step, actual production C# compilation, all eight environment and seven
input regression groups, installed codegen, RNW application generation, native
library compilation, actual executable compilation and packaged deployment.

The first recorded runtime failure was:

> UIA element named 'Native drag result: none/rejected' did not appear within 30 s

The run reached that wait after the required source drag-start step. Checked
OS pointer input reached the requested target coordinates. At failure the owned
process `5280` and its main HWND `589990` remained alive. The final traversal
reported 51 descendants; the crash query reported zero matching Application
Error/WER records. Passed-only package retention and distribution upload were
skipped. The complete native gate failed.

The full final UIA tree and native JSONL target-event trace remain in the
unextracted runtime artifact. This receipt therefore makes no fresh claim about
the final actual result label, target-event count or transfer count. The earlier
5a `none/cancelled`, 29-record trace and zero target events belong to that
earlier run. Accepted-move, explicit-cancellation and later navigation acceptance
are not established by this failure.

## Retained evidence and exact byte scope

[native-job.log](native-job.log) is the complete original decoded connector log:
332,409 characters, 333,924 UTF-8 bytes, SHA-256
`76c67cb3331713e5478bde6d42a63b92581685f231801ffb1796f051fd681bc6`,
Git blob `68a1b8e9af4888d1e3ba3f15e1aba5aa4fa007ce`.
Root and independent reviewers retrieved the complete log separately and
matched its full string and byte digests. Its original line endings are retained.

[environment-log-summary.json](environment-log-summary.json) is a derived copy
of the single JSON line between the actual
`NYCTRON_DRAG_ENVIRONMENT_BEGIN` / `NYCTRON_DRAG_ENVIRONMENT_END` markers.
Only the job timestamp prefix and enclosing log line ending are removed.
No newline is added: 10,324 UTF-8 bytes, SHA-256
`151b3fcacda339e0da078d24a705954338bbbb92defa42425788f8949f143e20`.
It is a selected summary, not the complete original environment file.
The producer reports `drag-environment-01.json` as 51,975 bytes, SHA-256
`8cce32aaee71bc16638982bc01e2ee677a7bec42b38965033e768a08bea34f13`;
that full file has not been independently extracted or rehashed here.
Source/target UIA ancestry is omitted and native child records are compacted.

The original `winui-fabric-uia-smoke` artifact is `13813502001`.
GitHub metadata/upload reports 336,049 bytes and SHA-256
`cba55827d11cb982b6da7da83a31f473e9a22a719d7536b36440113359ca0863`;
the producer reports 39 uploaded files. Its ZIP and members remain unextracted
and independently unverified. [workflow-metadata.json](workflow-metadata.json)
preserves the completed normalized job and artifact metadata;
[provenance.json](provenance.json) separates those producer reports from the
independently verified complete log and derived summary.

## Actual read-only environment observations

At `2026-11-10T23:41:01.0767341Z`, TOKEN_QUERY succeeded sufficiently to
observe elevation type `1`, integrity RID `12288` and UIAccess `0`.
Token close reported no error. The explicit TokenElevation field failed with
Win32 error `24` and no value. The recorded error does not identify which
query call failed; it cannot be assigned to the sizing call or the data read.
TokenIsElevated remains unknown. Registry64 EnableLUA was observed as DWORD `1`.

Microsoft defines RID `0x3000` as [high integrity](https://learn.microsoft.com/en-us/windows/win32/secauthz/well-known-sids),
and elevation type `1` as a [token with no linked token](https://learn.microsoft.com/en-us/windows/win32/api/winnt/ne-winnt-token_elevation_type).
The latter does not mean unelevated. A successful
[TOKEN_ELEVATION](https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_elevation)
read separately defines TokenIsElevated by zero/nonzero DWORD semantics.
Microsoft documents [elevated/admin execution as unsupported for StartDragAsync](https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.uielement.startdragasync?view=windows-app-sdk-1.8).
These observations identify a compatibility concern, not a confirmed drag-failure
cause or authorization to change privileges, UAC, launch behavior or assertions.

Both source and target native chains contain four valid app-owned observations,
then deliberately stop at the foreign desktop boundary. The summary status
`outside-owned-process` describes that stop, not a foreign drag endpoint.
For owned child links, GetParent and GA_PARENT agree. At the top-level owned
window, GetParent is zero while GA_PARENT names the desktop; these remain
separate API observations. Hidden, zero-area input-site HWNDs do not alone prove
missing or incorrect drag registration. Native child enumeration completed
with 12 main-window and three document-window children, with zero rows omitted
by the summary limit; the root ownership checks remained stable.

The two files at already-loaded module paths were observed with stable file and
owned-process identity:

| File | Bytes | SHA-256 |
|---|---:|---|
| Microsoft.UI.Xaml.dll | 15,083,832 | `a544aaf30ee1863e0f502658f30e8d1a9543ebb142c8be956a346cd1343c0190` |
| Microsoft.UI.Input.dll | 1,701,688 | `c8cb8c10285c735ce94491352533bc7f4f0e183131dc6540d8184cd30b9ce975` |

These are file identities, not in-memory image measurements. The XAML file's
vendor build-version string containing `ContainerAdministrator` is not evidence
of the current app account. No unpublished static disassembly is reconstructed
or represented as runtime call evidence.

## Follow-up and remaining boundary

The independently reviewed follow-up at `c3a52cfc` uses fixed four-byte buffers
for the three scalar token outputs and adds a real owned compatibility-process
query with handle-ownership checks. Variable-length integrity information retains
bounded sizing. Native drag behavior, launcher/security settings, gesture
timing and all strict assertions remain unchanged. Its actual app token and UIA
result must be assessed from its own run; they cannot alter this f450 receipt.

The [same-revision browser receipt](../v1-web-f450eaa-rendered-and-consumer-pass/README.md)
records actual rendered and installed-consumer passes separately. Final combined
source verification, original canonical archives, all platform acceptance and
exact owner distribution approval remain required. No release, tag, native
acceptance or owner approval is created by this receipt.
