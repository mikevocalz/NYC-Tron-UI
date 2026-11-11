# 0596aa2 source passes and native navigation exit

**The source workflows pass; native acceptance remains failed.** PR63 head `0596aa2e4441b2e3464a9fff32060cc10fb17481` has tree `6aad15f5f522da18a37fc5abe697953c71db92b0` and sole parent `7a160c536b845d71487ba2997262daf3cf07cb9b`. All five complete original job logs retained here show actual checkout `8ff0adf28897e7fd7300f6ebac112513ee7a4dbe`: the generated merge with ordered parents aggregate `25a6af6d…` then head `0596aa2e…`, and the same tree.

This is a completed outcome for that exact source. It neither replaces the [earlier failed de54 run](../v1-windows-7a160c5-source-native-failure/README.md) nor turns source review into native acceptance.

## Actual source-suite results

[Source workflow 42997727683](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42997727683), attempt 1, completed successfully.

| Job | Actual result |
| --- | --- |
| Linux pure contracts, 130445894076 | **1,204 tests passed, 0 failed, 0 skipped**, 22,498.073191 ms |
| Windows tests and pack, 130445894126 | **1,204 tests passed, 0 failed, 0 skipped**, 60,510.8985 ms |
| Workspace TypeScript, 130445894077 | Builds/typechecks passed; 619 conditional exports and 750 ESM files validated; public signature snapshot matched 13 packages, 619 subpaths and 3,306 reachable declarations |

The Linux and Windows numbers are executions of the same suite on two hosts, not 2,408 distinct contracts. Both former failures actually ran and passed on both platforms:

- The live-descriptor retention regression appears at Linux log line 1378 and Windows line 1381. The Windows execution took 37.7253 ms. It exercises real filesystem retention while the original driver log remains open, then checks that later append/rewrite/truncate operations cannot alter the retained snapshot and receipt.
- The explicit manual-publication opt-in test appears at Linux line 1389 and Windows line 1392. Its success does not authorize publication; the production opt-in requirement remains.

The TypeScript job's original line 613 reports **341 canonical IDs; 332 local implementations; 9 pinned external implementations; 0 partial; 0 pending; 0 accepted with all eight platform proofs**. This is source completeness with an explicit platform-acceptance boundary. Both the TypeScript lane and Windows pack lane wrote 13 tarballs plus checksums and imported 17 dependency-free export subpaths. Those packaging checks are distinct from the native tested-package gate.

## Six source changes after 7a160c5

The complete untruncated tree was fetched and all **3,152 leaves / 513 tree-object hashes** reconstructed. Exactly six paths changed against 7a160c5; the other **3,146 leaf identities and modes** are unchanged. [metadata.json](metadata.json) retains the full six-path mapping.

Four changes are the [reviewed retention portability correction](../v1-native-ui-retention-portability-source/README.md): leave failed live files in place, copy independent snapshots and use a separate Settings retry evidence prefix, with the substantive regression and documentation updated. The classifier, one-retry rule and native assertions remain unchanged.

The release-readiness test change is `62ba8325…` to `d5f217076df126f8160982d07db05e8cee288889`. The native dependency restoration changes `IslandConnection.h` from `afcd61d50584a90cc58ab8dbd77c2bcc2a602be1` to `5b8b1054bcc13d09e958be40709a6273b797d11f`: only an 88-byte insertion adding `Site() const noexcept` before `Close`, returning the existing `m_site`. The three lifecycle source files and UIA script from the original candidate remain unchanged. No workflow, host, security, launcher or deadline changed in 0596aa2.

The separately reviewed external-source dependency comparison found matching sets of 32 native C++/header/IDL paths; after restoring the accessor, 29 were identical and only the three intended lifecycle files differed. That comparison was static review. This run supplies the subsequent actual compile result.

## Actual native progress and failure

[Fabric workflow 42997727800](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42997727800), attempt 1, completed with failure in job **130446243806**.

Its source job **130445893932** passed the initial 13-case source suite and later 49-case package/isolated suite, with the matching 8-subpath / 44-declaration API snapshot. These suites overlap. The Windows job again passed 49 package/isolated cases and five consumer-connection source cases. The Windows PowerShell 5.1 diagnostic gate also completed. These source/diagnostic checks are separate from the subsequent app UIA interactions.

The installed native package compiled, the actual consumer executable built, and deployment completed. The UIA script then progressed through native windows and overlays into four cross-window drag scenarios. This conclusion is a **source-bound control-flow inference** from unchanged script `aa54819df02c2decfba2fb19e3b4d2a5aaabd554`, lines 635–672, and the original log's later accepted-drag capture/navigation progression:

| Scenario whose strict checks returned | Required observed state |
| --- | --- |
| Rejected drop | One completed drag, `none/rejected`, document owner stays main, zero authorized transfers |
| Escape cancellation | Two completed drags, `none/cancelled`, owner stays main, zero authorized transfers |
| Window closed before delayed approval | Three completed drags; after resolving the delayed approval, owner remains main and transfers stay zero |
| Accepted drop | Four completed drags, `move/accepted`, both windows report document ownership in the document window, exactly one authorized transfer |

The log contains all four OS-pointer sequences and proceeds past the strict status checks to the accepted-drag screenshot message at line 1895. This does not mean the entire job passed, and the PNG bytes have not been viewed.

Navigation startup/selection, settings-focus return and resize checks then returned. The final relevant console events are:

| Original line | Timestamp (UTC) | Observation |
| --- | --- | --- |
| 1903 | 09:53:55.3170698 | Saved `navigation-resize.png` reported |
| 1904 | 09:53:55.7270194 | `Pressed 'Use RTL navigation' with the keyboard (no InvokePattern)` |
| 1905 | 09:54:08.5520703 | Step process exited with **-1073740940** |

The timestamp difference is **12.8250509 seconds** from the RTL press message to the step-exit message. It is not a duration for a known failing API call. The current log has no caught UIA assertion or new Application Error/WER attribution identifying the faulting process/module or cause. RTL geometry success, the later high-contrast checks and the final navigation result are not established. The tested-package retention and upload steps were skipped.

The initial review inferred no source correction from the exit alone and read [Microsoft's HIGHCONTRASTW documentation](https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-highcontrastw) as requiring LocalFree. A subsequent independent review bound the [official .NET implementation](https://github.com/dotnet/dotnet/blob/461c220ba5d192fea95ca9249b22b96d3c9e9903/src/winforms/src/System.Private.Windows.Core/src/Windows/Win32/PInvokeCore.SystemParametersInfo.cs) to blob `c52fc3df81c9eccd38a1db134d76457c49cb2b85`; it explicitly identifies that documented free requirement as incorrect. The separate [navigation ownership correction](../v1-windows-navigation-ownership-and-geometry-source/README.md) therefore copies the borrowed GET scheme without freeing it and preserves cleanup of the caller-owned SET allocation. This first-party implementation evidence revises the earlier documentation-only conclusion. It does not establish the corrupting call or cause of this recorded exit.

## Observed host, without supported-host promotion

Four bounded environment summaries, captured before the four drag attempts, agree:

| Observation | Value |
| --- | --- |
| App / driver / existing shell PID | 6096 / 6780 / 5952 |
| App and shell TokenElevation | Observed 1 |
| App and shell elevation type | Observed 1 |
| App and shell integrity RID | Observed 12288 |
| App and shell UIAccess | Observed 0 |
| EnableLUA | Observed 1 |
| Existing-shell activation-review result | `observed-ineligible`; 8 true predicates, 2 false, 2 unobserved |

The same-user comparisons were deliberately not requested for this unsupported shell and remain unknown; they are not observed unequal users. Pre-drag process snapshots reported the owned app/driver/shell active with stable identity. They are not post-exit observations or attribution of the later process failure. Exact FILETIME integers are retained as original JSON bytes and as decimal strings in provenance, avoiding JavaScript number rounding.

These High/elevated observations do not establish a supported drag host. The actual assertions that returned in this environment are retained without promoting the environment or the failed job to release acceptance. No host, token, permission, launcher or runner configuration was changed by this investigation.

## Original bytes, projections and uninspected artifacts

Five complete original job logs are retained:

| File | Bytes | Git blob |
| --- | ---: | --- |
| [source-linux.log](source-linux.log) | 156,140 | `3742023be870f97a3d79330c4730510d70197458` |
| [source-windows.log](source-windows.log) | 198,275 | `57147b1e56275ff22668653e5f58290e1a02c423` |
| [workspace-types.log](workspace-types.log) | 62,126 | `87accd8276a365986579d2f96d81b74961d0ab8d` |
| [fabric-source.log](fabric-source.log) | 31,688 | `1b5bb97aa3ccf43dc529f6dd96b84fe34c5b361a` |
| [fabric-native.log](fabric-native.log) | 393,557 | `584c6fcdfff825993efc9e500ceded1ad9490b45` |

Each `environment-NN.json` retains the exact 14,437-byte JSON payload from its console line, without timestamp prefix or line ending. Each matching `.envelope.log` retains the exact 14,588-byte three-line timestamped CRLF block. All four envelopes are complete and have zero interleaved lines. No JSON reserialization was used for these raw payloads.

The summaries identify original `drag-environment-NN.json` files of 81,429 bytes each and report their hashes. Those larger originals are **uninspected**. The console summaries intentionally omit UIA ancestor arrays and compact child-window lists; they are not copies of the full original files. Hidden or zero-area InputSite HWND observations do not independently establish a broken registration or a failure cause.

Artifact **13845740998**, `winui-fabric-uia-smoke`, is reported as 417,056 bytes with 43 files, ZIP SHA-256 `f72049177586f4bd492941e6385d8f4dd03b501dcf0aac663c967de229b411c4`. Shared-package artifact **13844019150** is reported as 62,822 bytes with ZIP SHA-256 `d1d230c4432549bb8a1d43d1b516e2fa2852ba75069cf32a1b4a7a2fb7318516`. These archives and their PNG, native trace, process or result members have not been extracted/viewed for this receipt. Producer/API archive hashes remain distinct from the independently hashed log and console-payload bytes.

[provenance.json](provenance.json) binds all retained files and exact observations. [metadata.json](metadata.json) contains normalized completed run/job/step/artifact records. There is no passed native report or accepted tested-package archive from this run, no supported-host promotion, and no established causal diagnosis of the terminal exit.
