# Windows d1: four drag sequences reached navigation, then smoke exited

[Completed run 42985816081, attempt 1](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42985816081/attempts/1) built and deployed the Windows consumer. Its strict script progressed through rejected drop, Escape cancellation, target-close cancellation with late approval, and accepted move assertions. It then entered native navigation checks and exited abnormally after the RTL action.

The complete native gate **failed**. The original log reports exit code **-1073740940**, without identifying the faulting process, module or cause. Tested-package retention and upload were skipped. The app and existing shell were both observed elevated; this run does not close the supported-host acceptance requirement.

## Exact executed source

| Item | Identity |
| --- | --- |
| Helper head | `d1d955aae1895cf3727b71a73c2c9de95fef6615` |
| Actual checkout | `d4d0de4f47bd5d0167a8a656bb109fdb71be0390` |
| Checkout tree | `30bb83f83df516de0a2cb6de9be1bde37dc8b3da` |
| Ordered merge parents | `ac5d69585a52a6e945dc996ea08030e190574699`, then `d1d955aae1895cf3727b71a73c2c9de95fef6615` |
| Source job | `130406593361`, completed success |
| Native job | `130406979461`, completed failure |
| Executed smoke script | `a6bfaccc3dcbdafcd398bd0d1c5bde63ba22ab23` |
| Executed navigation script | `cb69ad47c11d6b868957a2a72feb8fb27319d975` |
| Executed workflow | `dd9532580fc8666223863528cc98d62d72ae8ef8` |

The source log at line 123 and native log at line 111 identify the same actual checkout. Its complete 2,076-leaf map and all 284 directory hashes were independently verified. This receipt concerns that helper execution; it does not certify a different aggregate tree or incorporate later external workflow changes, including later WER collection.

## Separate build and test outcomes

The source job's 13-test preflight and 49-test suite passed with no failures or skips. The 13-test preflight is a source subset, not 13 additional native interactions. The Windows job also ran the same 49-test suite successfully; these are two executions, not 98 distinct tests. Both jobs matched the isolated API snapshot: one package, eight subpaths and 44 reachable declarations.

The mandatory Windows PowerShell Desktop 5.1/x64 compatibility step passed its parser and real helper C# compilation gates. Its 21 reported PASS groups comprise ten environment mocks, seven input mocks, one actual owned-process token/handle check, and three actual user/session/SID/ownership groups. Five installed-consumer Node owner/source tests passed separately. None of those counts is a count of native UI acceptance tests.

The installed native C++ package compiled, the consumer executable compiled, and packaged deployment succeeded. UI Automation was the failing step. [workflow-metadata.json](workflow-metadata.json) retains the completed step outcomes and timestamps.

## What the runtime progression establishes

The exact executed smoke script, lines 638–675, requires the following observations before it can invoke native navigation at line 680. `Find-ByName` throws if its exact-name condition does not appear; the script does not catch and continue around these assertions.

| Sequence | Required observations before progression |
| --- | --- |
| Rejected drop | Completed count 1; `none/rejected`; owner `main`; zero authorized transfers |
| Escape cancellation | Completed count 2; `none/cancelled`; owner `main`; zero authorized transfers |
| Target closes during delayed approval | Pending app approval; target closes; completed count 3; later approval leaves owner `main` and zero authorized transfers |
| Accepted drop | Completed count 4; `move/accepted`; both windows report owner `document`; one authorized transfer |

The source does not assert a separate final result label for the third sequence. No such label is invented here.

Native log line 1892 records the accepted-drag screenshot save, and line 1893 records entering the navigation fixture. Its subsequent lines record Settings focus-return selection, three resize selections and the resize screenshot. Their earlier identity/focus assertions returned according to the executed navigation source. This is control-flow evidence from the exact script and original log; the detailed UIA files, native event trace, pointer receipts and screenshot pixels remain uninspected.

At **08:26:47.0918706 UTC**, line 1901 records:

> Pressed 'Use RTL navigation' with the keyboard (no InvokePattern)

At **08:26:59.7989898 UTC**, line 1902 reports:

> Process completed with exit code -1073740940.

The command log does not establish that the RTL layout assertion completed, or what happened inside the intervening calls. Full navigation, pane-collapse and high-contrast acceptance are not established. No completed final smoke result, final tree count, matching WER event count, faulting executable or faulting module is inferred from this receipt.

## The four actual environment observations

Each real drag invocation emitted a standalone `NYCTRON_DRAG_ENVIRONMENT_BEGIN` / `END` envelope. These occur in the actual UIA step, separately from the compatibility test fixtures.

| Invocation | Original native log lines | Captured at UTC | Console JSON bytes |
| --- | --- | --- | --- |
| 1 | 1770–1772 | 2026-11-11T08:26:35.5063923Z | 14,464 |
| 2 | 1801–1803 | 2026-11-11T08:26:38.4863244Z | 14,464 |
| 3 | 1831–1833 | 2026-11-11T08:26:40.5705937Z | 14,464 |
| 4 | 1863–1865 | 2026-11-11T08:26:43.5330159Z | 14,464 |

All four selected summaries report app PID **5280** and existing shell PID **8172** with observed elevation DWORD **1**, elevation type **1**, integrity RID **12288** and UIAccess **0**. The observed session IDs are **2**. The held process/window identities were stable across each observation. Shell eligibility for reviewing activation is `observed-ineligible`: **eight known-true, two known-false and two unobserved predicates**. The two false predicates are shell-not-elevated and shell-medium-integrity. Same-user comparisons were deliberately not requested after the unsupported shell state was observed; they are unknown, not account mismatches.

This preserves the [previous supported-host boundary](../v1-windows-0578582-elevated-existing-shell/README.md). Microsoft's [Windows App SDK 1.8 StartDragAsync contract](https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.uielement.startdragasync?view=windows-app-sdk-1.8) excludes elevated execution. The prior receipt binds automatic CanDrag to that path. Partial drag progression on this host does not change the vendor support limit, and elevation alone does not establish the cause of the later smoke exit.

The source and target ancestor chains stop at the first non-owned desktop ancestor. That stop is not evidence of a foreign source or target. Loaded-module path-file identities are producer-observed fields in these summaries, not newly independently hashed DLL bytes. No token, launcher, privilege, account, UAC or runner setting was changed to prepare this receipt.

## Retained bytes and inspection limits

This thirteen-file receipt retains both complete decoded original job-log responses, four exact console JSON payloads, their four complete timestamped envelopes, completed metadata, provenance and this README. The native log's leading UTF-8 BOM and all 1,948 CRLF endings are preserved. The source log's BOM and LF endings are preserved. Each envelope has three original CRLF-terminated lines and no interleaved output.

The `*-summary.json` files are exact substrings, without the console timestamp or line ending. They were not parsed and reserialized. In particular, the raw FILETIME integers larger than JavaScript's safe-integer range remain verbatim. Derived metadata uses ISO timestamps and explicit identity booleans instead of rounded FILETIMEs.

Each summary advertises an original `drag-environment-0N.json` file of **81,459 bytes**, with its producer-reported hash. Those full files remain uninspected. The console omits full UIA ancestor sections and compacts native child topology. The four summary hashes in [provenance.json](provenance.json) are independently recomputed from console bytes; they are not the original environment-file hashes.

The upload reports **42 files** in artifact **13840151708**, `winui-fabric-uia-smoke`, **416,223 bytes**, SHA-256 `2fc75360dc3aa6460220c298fb11bb00650011b1978d16ecb9990c3986bf3beb`. Original upload lines and completed API metadata agree. That ZIP digest is producer/API-reported: the ZIP was not independently hashed, its members were not extracted, and no pixels were viewed. The separately uploaded shared-package artifact is not a distribution that passed native acceptance.

No retry, dispatch, source mutation, branch update or acceptance promotion was performed for this receipt.
