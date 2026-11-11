# Combined Windows native outcome: Raw Icon peer unavailable

[Windows native run 43015171470, attempt 1](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43015171470/attempts/1) completed with a managed UI Automation failure on combined head `9a430338d8336283b230203a8555257798fcd62c`. Both C++ builds and packaged deployment passed. The first runtime failure was **`Native RTL witness: icon-peer-unavailable (icon)`**, followed by exit 1. This is the combined candidate's own completed result, separate from the earlier helper [782 outcome](../v1-windows-782ed39-raw-icon-unavailable/README.md).

## Exact source and originals

Both complete original logs identify checkout `e8f8c19db909a53f3054976449a7571b2a0524e9`: source line 123 and native line 134. The independently fetched merge has tree `434f2cfa1a001bcec73788462e42957206819328` and ordered parents `ac5d69585a52a6e945dc996ea08030e190574699` then the combined head. Its complete 3,314-leaf/537-directory tree was already independently reviewed. Navigation is exact blob `877c51ea1e16918968a6929e389c1f61f4a4e23d`; the sequential smoke script is `aa54819df02c2decfba2fb19e3b4d2a5aaabd554`.

| File | Git blob | UTF-8 bytes | SHA-256 |
|---|---|---:|---|
| [source-job.log](source-job.log) | `08adc7dfc677cfd53fa7f8c5ee60eb8e1f362c22` | 31,862 | `b558dcd0284495efe6ba7ea1944e16b0c5a318dfcffb41ab87869d76b4af2f0c` |
| [native-job.log](native-job.log) | `c44b560511c2c48024f95e6e3017c322e28bfa1b` | 397,321 | `d9c01733645362e28c1393e15282b67b1998a00f9ba4ad3034809247518a9725` |
| [rtl-witness.json](rtl-witness.json) | `1b092ffaaf26379472f38043cd11c267caa49e09` | 724 | `16ba0a38d799f711fb4dd141f32eeb6b64e8f514da317471335fb844fbc3ebb2` |
| [rtl-witness-envelope.log](rtl-witness-envelope.log) | `838c771d8c60b53f44b89aee9c9756ea4fe774ff` | 863 | `b9c20c0854ccf39863bc176c5d3a57911091da29b3b5b8a4831a8301ade5c939` |
| [workflow-metadata.json](workflow-metadata.json) | `ca6f639ee3a822a024bb6d02728d2999d207c31c` | 13,377 | `291f5770be41867e0ac09dc5673a88b56700f8ee91f5fbb7f77497dae6fe89a8` |
| [provenance.json](provenance.json) | `94fcfe1db9fe5d022edcf49cefe6c8ee29f222fd` | 20,223 | `88a5cccc9f07537a35c2cdada4b6438ba1d62c72a3bbfe9d683731ef16fd0127` |

Every listed blob was created and fetched back byte-for-byte. The source log preserves its BOM/LF and 362 records; the native log preserves its BOM/CRLF and 2,004 records. Originals were fetched only after their jobs completed. Metadata is an explicitly normalized API record.

The unique RTL envelope is native lines **1926–1928**, without interleaved stderr. The 724-byte JSON removes only line 1927's timestamp prefix and retains its trailing CRLF; it is not reserialized. The 863-byte envelope retains all timestamps and CRLF. These hashes bind the retained console bytes, not an extracted original navigation-result file.

## Actual failure boundary

The typed witness reports a complete initial Raw-view search:

- 46 nodes discovered and read, with maximum depth 9.
- One toggle, one named navigation ancestor and zero qualifying `Icon` peers.
- `icon-peer-unavailable`, role `icon`, and zero poll attempts.
- Null binding, LTR/latest geometry and final discovery.

The source binds before the “Use RTL navigation” action. That action, icon geometry snapshots/polling and later drawer/high-contrast assertions were not reached. The result establishes no qualifying exact AutomationId descendant in this bounded owned UIA walk. It does not establish that the rendered XAML icon is absent, invisible or incorrectly placed, or that the separate visual tree was inspected atomically.

Native log line 1935 records the original binding failure. Catch/finally markers follow the same source path; contrast restoration, window restoration and result serialization returned at lines 1930, 1932 and 1934. The binding error remained the final reported error and the process exited 1 at line 1952. At failure, app PID 924 was still active and HWND 720964 remained present and owned by it. The existing scoped WER lookup found zero matching records. This is a preserved managed failure, not proof about the cause or repair of a prior heap-corruption exit.

## Preceding checks and limits

Fabric source job 130504315570 passed the initial thirteen native-source tests and the later 49-test package/adapter suite with zero failures, cancellations or skips. The thirteen are included in the 49; they are not 62 distinct tests. Isolated types and API checks passed at 1 package, 8 subpaths and 44 reachable declarations. The native job repeated that package suite and passed five separate reference-owner tests.

The PowerShell diagnostic compatibility step passed its real self-token/SID checks and separate portable mock suites. Its explicit parser list does not include navigation. Navigation subsequently parsed and executed in Windows PowerShell, as the actual selection/resize/search/finally records demonstrate.

The four strict drag scenarios—rejection, Escape cancellation, target closure during delayed approval, and accepted cross-window transfer—returned before navigation. This is a control-flow inference from the exact sequential smoke assertions at lines 632–677 and the inspected log, including the accepted screenshot save and navigation entry at native lines 1915–1916. Original per-drag receipts and images remain uninspected; saving an image is not image inspection. Settings-focus selection and resize selection at widths 992 → 772 → 992 also returned before initial Icon binding failed.

The [combined general source receipt](../v1-combined-9a43033-source-pass/README.md) separately records the same 1,204-test suite on Linux and Windows. Those repository tests are not added to the package counts above. No source or helper pass substitutes for this combined native failure.

## Host and artifact boundaries

All four existing environment projections observed app PID 924 and shell PID 7636 with elevation 1, elevation type 1, integrity RID 12288 and UIAccess 0. Shell eligibility remained `observed-ineligible`: eight predicates true, two false and two unobserved. Unknown same-user results are not mismatches. These observations do not establish an eligible unelevated host or authorize a launcher/security change. The original environment JSON files were not extracted.

UI artifact 13853610088 is reported as **455,220 bytes and 51 files**, with archive SHA-256 `d0225e292bd1f9ad695c1116180d3367f999b50df76ae2a2ab902d0a4530c45e`. The original log and API metadata agree. Its ZIP bytes, members, screenshots and navigation-result file remain uninspected. Both tested-distribution retention/upload stages were skipped. The optional exact release-producer workspace-archive step was also skipped; no exact cross-producer binary claim follows from the canonical archive download.

No source, requirement, workflow, ref, PR, CI retry or additional host/security setting was changed to retain this receipt. Full native, supported-host, original tested-archive, physical-device, speech, performance and final owner-manifest gates remain open.
