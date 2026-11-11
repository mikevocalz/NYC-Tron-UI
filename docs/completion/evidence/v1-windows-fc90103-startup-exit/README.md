# Combined fc90103: executable compiled, process exited before the first UIA window

The combined [Windows Fabric workflow 43026784222, attempt 1](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43026784222/attempts/1) compiled and deployed the application, then failed during startup. The first UIA failure was **“Consumer process exited before creating a window.”** The matching Windows error record reports exception `0xc0000005` in the application executable. The original log does not identify a function or causal source line.

## Exact source and completed stages

Head `fc901030ba1e0eed1b399ad0a3100529bf97e52f` ran at actual merge `255b63f5800cfbd2cbc7fa27ed6e1cad477c14c6`, tree `5acadef01a5fcafa3600949e7c50e730aa3663e9`. Both retained complete originals print this checkout. The ordered merge parents are `25a6af6d020e34d790f6a4f3d9f117738b252f1e`, then the head.

| Stage | Actual result |
|---|---|
| Fabric source job `130543374921` | 13 source contracts and the 49-test package suite passed; API snapshot 1 package / 8 subpaths / 44 declarations. The first test group is included in the second. |
| PowerShell diagnostic gate and code generation | Passed. These preparation checks do not establish application interaction. |
| Installed native package compilation | Passed, 13:13:40–13:18:17 UTC. |
| Example executable compilation | Passed, 13:18:17–13:19:36 UTC. |
| Packaged consumer deployment | Passed, 13:19:36–13:20:59 UTC. |
| UIA smoke, job `130543971826` step 16 | Failed, 13:20:59–13:21:04 UTC, while waiting for the first window. |
| Tested-package retention and upload | Skipped. |

This run includes corrected private header `00f6ff5f1735c81a5268855a5fb33627f5112cd7`. The earlier `Hook final` compiler blocker is cleared by this actual build. No native observer protocol or geometry result follows from compilation alone.

## Exact startup evidence

Native original lines 1729–1732 show the existing `shell:AppsFolder` launch, then process PID **1860** exited with code **-1073741819**, handle **0**, and no observed owner window. Lines 1738–1748 contain one matching Application Error/WER record: application and module `NYCTronWindowsExample.exe`, exception `0xc0000005`, image-relative offset `0x4e8c`, process `0x744` (1860). The image timestamp is `0x6af46b66`.

These fields identify the failed executable but do not supply an inspected stack, binary/PDB mapping, function name or crash cause. An application can execute initialization or mount callbacks before UIA observes a window; this receipt does not claim those callbacks were unexecuted.

The existing app-scoped WER path reports enabling and restoring its settings. A failure-screenshot save message is present. No dump contents or screenshot pixels were inspected. There is no native navigation-observer envelope in the original, and UIA did not reach the navigation geometry/RTL, drag or later acceptance checks.

## Retention and limits

This folder retains the complete Fabric source and native originals, exact native lines 1721–1758, normalized completed workflow/job/artifact metadata and a provenance index. All stored original bytes and their hashes were independently checked without newline normalization.

Artifact `13861040131` is reported as 642,649 bytes, SHA256 `a9e3170d4824453b9d2fcd50d0f27dc3a12b446cf41efabd0e50fc4c292d7fd3`; the uploader reports 23 files. Shared-archive artifact `13857073394` is reported as 62,822 bytes, SHA256 `4fe6a467bc3ca9731aca5c457cd8ff8fd63babfbf3cda24f6af1e1d8c6dfce60`. ZIP bytes and members were not extracted or inspected; those sizes, digests and member counts remain producer/API reports.

No current host-eligibility, physical-input, eight-platform, tested native distribution or final release acceptance is established. No cause is assigned from the module name or offset. The source diagnosis and any future correction remain separate from this completed outcome.
