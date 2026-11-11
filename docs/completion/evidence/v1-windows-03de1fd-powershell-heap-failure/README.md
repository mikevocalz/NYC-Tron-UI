# Windows 03de1fd: PowerShell heap failure after four drag sequences

[Completed run 42987324915, attempt 1](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42987324915/attempts/1) built and deployed the native consumer, progressed through all four strict drag sequences, and entered native navigation. After the RTL action, the smoke step exited with **-1073740940**. The subsequent Application Error record identifies **powershell.EXE**, PID **6300**, with exception **0xc0000374** and faulting module **ntdll.dll**.

The event's process creation FILETIME exactly matches the smoke driver's identity before and after all four environment observations. The consumer app was a separate process, PID **7620**. The precise corrupting operation, faulting call and cause remain unknown. Full native acceptance failed; tested-package retention and upload were skipped. This receipt does not identify the faulting process in the separate [d1 run](../v1-windows-d1d955a-drag-progress-smoke-exit/README.md).

## Exact execution and source boundary

| Item | Identity |
| --- | --- |
| Helper head | `03de1fde81734d12ed49478dbc52570a4bc1312e` |
| Actual checkout | `41967d41afe811cefdb192182a4f47cb132cb78a` |
| Checkout tree | `1aa932cb1bf07cc84d0e4b24d0e1820857b2392a` |
| Ordered merge parents | `ac5d69585a52a6e945dc996ea08030e190574699`, then `03de1fde81734d12ed49478dbc52570a4bc1312e` |
| Source job | `130411495279`, success |
| Native job | `130411925116`, failure |
| Smoke script | `a6bfaccc3dcbdafcd398bd0d1c5bde63ba22ab23` |
| Navigation script | `cb69ad47c11d6b868957a2a72feb8fb27319d975` |
| Workflow | `d211c05f3cfc5b3974f988575bd7d695a36a8d96` |

Source log line 123 and native log line 111 identify that checkout. Its complete 2,076-leaf map and all 284 directory hashes were independently verified. Comparing it with the actual d1 checkout finds exactly one changed leaf: the external workflow adds failure-event collection. Native source, UIA scripts and all other leaf IDs and modes are unchanged.

That workflow queries Application event IDs 1000 and 1001 over the prior 40 minutes, retaining at most 40 records without a process or provider filter. It writes `driver-crash-events.txt` and prints a bounded prefix of each message. This receipt preserves the already-completed original log; it does not authorize, adopt or rerun that broad collection. Derived prose and structured crash fields include only the matching PowerShell event. The full separately uploaded event file remains uninspected.

## Build, checks and actual progression

The source job passed its 13-test preflight and 49-test suite with no failures or skips. The preflight is a source subset. The Windows job separately passed the same 49-test suite, not 49 additional distinct designs. Both matched the isolated API snapshot of one package, eight subpaths and 44 declarations.

The mandatory Windows PowerShell Desktop 5.1/x64 step passed parsing and actual helper C# compilation. Its 21 PASS groups comprise ten environment mocks, seven input mocks, one actual owned-token/handle check and three actual user/session/SID groups. Five installed-consumer Node owner/source tests passed separately. These counts are separate from native UI acceptance.

The installed C++ package, consumer executable and packaged deployment succeeded. The strict smoke script requires these four sequences before invoking navigation:

| Sequence | Required observations |
| --- | --- |
| Rejected drop | Completed count 1; `none/rejected`; owner `main`; zero authorized transfers |
| Escape cancellation | Completed count 2; `none/cancelled`; owner `main`; zero authorized transfers |
| Target closes during delayed approval | Completed count 3; late approval leaves owner `main` and zero transfers |
| Accepted drop | Completed count 4; `move/accepted`; both windows report owner `document`; one transfer |

No separate final result label is asserted for the third sequence. These findings follow from the exact executed script at lines 638–675 and later log progression, not inspection of raw UIA records or pixels.

Native log line 1895 records the accepted-drag screenshot save; line 1896 enters navigation. Settings focus-return and resize assertions returned according to the executed source and subsequent log. At **08:40:40.7238337 UTC**, line 1904 records the keyboard press on `Use RTL navigation`. At **08:40:53.4348017 UTC**, line 1905 reports the abnormal process exit. Completed RTL layout, pane-collapse, high-contrast acceptance and the final smoke result are not established.

## Exact event-to-driver binding

Native log line 1923 retains this relevant event data:

| Field | Observed value |
| --- | --- |
| Event ID and time | 1000; `2026-11-11T08:40:51.7244013Z` |
| Application | `powershell.EXE` |
| Faulting module | `ntdll.dll` |
| Exception / offset | `0xc0000374` / `0x00000000001166d5` |
| PID | `0x189C` = 6300 |
| Process creation FILETIME | `0x1DD71B844152BC3` = decimal string `134388600121142211` |
| Report ID | `5748adc9-328d-42b8-961d-d42f8d62e9e1` |

All four exact environment payloads contain both `driverBefore` and `driverAfter` with PID 6300 and that same creation FILETIME: eight matching identities. Their ISO creation time is `2026-11-11T08:40:12.1142211Z`. The app observations instead identify PID 7620, created at `2026-11-11T08:40:13.7600648Z`.

For comparison, the original FILETIME digit tokens were copied to strings and converted directly to `BigInt`. No floating-point conversion was used. Original console JSON files remain verbatim; the derived decimal FILETIME in metadata is explicitly a string.

Microsoft defines [0xC0000374 as STATUS_HEAP_CORRUPTION](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-erref/596a1078-e883-4972-9bbc-49e60bebca55). This event establishes heap-corruption detection in the identified driver process. It does not identify the earlier corrupting write, the exact failing call, or a defect in a particular native component. No stack or dump was inspected. The event's timestamp follows the RTL press, which is sequence evidence, not proof of causation.

## Environment and supported-host limit

| Invocation | Native log lines | Captured at UTC | Exact JSON bytes |
| --- | --- | --- | --- |
| 1 | 1773–1775 | 2026-11-11T08:40:30.4510532Z | 14,435 |
| 2 | 1804–1806 | 2026-11-11T08:40:32.8571945Z | 14,435 |
| 3 | 1834–1836 | 2026-11-11T08:40:34.6751646Z | 14,435 |
| 4 | 1866–1868 | 2026-11-11T08:40:37.4684705Z | 14,435 |

All four actual UIA envelopes identify app PID **7620** and existing shell PID **7428**. Both report elevation DWORD **1**, elevation type **1**, integrity RID **12288**, UIAccess **0**, and session **2**. The observed identities remained stable. Shell eligibility for reviewing activation is `observed-ineligible`: **eight true, two false and two unobserved predicates**. The false predicates are shell-not-elevated and shell-medium-integrity; same-user checks were deliberately not requested after the unsupported shell state was observed, so they remain unknown.

The [previous existing-shell receipt](../v1-windows-0578582-elevated-existing-shell/README.md) documents the exact-source automatic-drag path and [Microsoft's elevated-mode support limit](https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.uielement.startdragasync?view=windows-app-sdk-1.8). Partial drag progression does not close that supported-host requirement. Elevation alone does not establish this crash's cause.

## Original bytes and limits

This thirteen-file receipt retains both complete original decoded job logs, four exact console JSON substrings and their four timestamped envelopes, completed metadata, provenance and this README. Native log bytes retain the UTF-8 BOM and all **1,972 CRLF** endings; source log bytes retain the BOM and **362 LF** endings. Each environment envelope has three CRLF-terminated lines with no interleaved output. Payload JSON has no added newline or reserialization.

Each selected summary advertises an original environment file of **81,427 bytes** with a producer-reported hash. Those originals, full native traces, UIA trees and PNG pixels remain uninspected. Loaded-module path-file hashes are producer observations, not new independent DLL-byte verification.

The upload reports **43 files** in artifact **13841311512**, `winui-fabric-uia-smoke`, **414,348 bytes**, digest `d63b6fcbe487306c79a7ca23abb90744964dd3c66e294f500b16975f99d24cfd`. The digest and size remain API/producer-reported; ZIP bytes were not independently hashed or extracted. The separately uploaded shared packages are not a distribution that passed native acceptance.

[workflow-metadata.json](workflow-metadata.json) preserves actual completed step times and the exact event binding. [provenance.json](provenance.json) binds every retained input and extraction to independently recomputed hashes. No retry, source/reference change, host alteration or acceptance promotion was performed for this receipt.
