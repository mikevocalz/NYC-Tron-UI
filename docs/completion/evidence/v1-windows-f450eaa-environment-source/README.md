# Windows f450eaa environment diagnostic source checkpoint

The [native workflow](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42924119449)
tests helper head `f450eaa21589bcc72e6d25f31a1b205e7015ff01`, tree
`0ddf3e304dc2e1265baeaa24984674bd5985a64b`, through actual PR merge
`3765f328a994524b530c8876b8e2228c2d36a878`. The merge has the same tree and
ordered parents `0edd5f302e99877191ba9a412c5c060571a5f6c9` and
`f450eaa21589bcc72e6d25f31a1b205e7015ff01`.

## Confirmed validation at this checkpoint

Initial source checkpoint recorded 2026-11-10 23:36:30 UTC.
Completed results added 2026-11-10 23:58:13 UTC.

Source job `130206100824` passed the 13-check native-source gate, then the full
49-check source/adapter suite, which includes those same 13 checks. Both
invocations had zero failures or skips; these are 49 distinct checks, not 62. Type checking, distribution packing and the
eight-subpath/44-declaration API snapshot passed. The complete original
[source-job.log](source-job.log) independently confirms the actual checkout:
31,871 UTF-8 bytes, SHA-256
`6ac76df49074c7e5d5b30b3f94139ee5f696abedea06f7f2255ede4b2392ab38`.

Native job `130206543842` passed the required Windows PowerShell Desktop 5.1
x64 compatibility step. Its reviewed script parses the actual copied consumer
scripts, compiles the production C# declarations, and requires all eight
environment and seven input regression cases to pass in separate processes.
Installed codegen and official RNW application generation also passed. The
retained [job-metadata.json](job-metadata.json) is the earlier normalized snapshot
while native compilation was active. The completed run subsequently passed
native library compilation, actual consumer compilation and deployment, then
failed the required rejected-drop result within its unchanged 30-second wait.
The [completed native receipt](../v1-windows-f450eaa-rejected-drop-failure/README.md)
retains the complete original job log and the selected environment log summary.
No native interaction pass or passed distribution follows from this source gate.

The historical job snapshot is not a substitute for the completed native receipt
or the original runtime artifact. The latter remains unextracted.
[source-review.json](source-review.json) records exact source identities and
the separate helper/aggregate workflow merge.

## Diagnostic scope

The preceding original 5a trace recorded a real source drag but no target
events. The new driver observes the owned process token, the actual EnableLUA
registry value, GetParent and GA_PARENT ancestry, and the versions and bounded
file hashes of only the already-loaded Microsoft.UI.Xaml.dll and
Microsoft.UI.Input.dll. File identity is labeled as the file at the loaded
module's path, not as an in-memory measurement.

The native observations are read-only, use owned process/HWND checks, and keep
GetParent owner semantics separate from the parent-only GA_PARENT chain.
A missing UIA native handle is never derived from a runtime ID. Actual Win32
child observations provide a bounded fallback; UIA class labels are not
assumed to identify native GetClassName values.

The complete first-observation JSON is retained unchanged with CreateNew.
A separate log summary hashes its successfully closed original bytes, includes
selected fields and at most sixteen compact child records for each owned root,
and explicitly labels omitted/compacted content. Its total output budget is
32 KiB. Synthetic test markers remain private to the test process. Reporting
errors cannot replace the primary drag failure. Capture occurs before pointer
movement, and the existing final endpoint/foreground check still precedes
button-down.

Gesture recognition, native data/nonce transport, broker decisions, permissions,
timing thresholds and strict rejection, move and cancellation assertions remain
unchanged. No source or inspection result establishes the missing native event
cause before the actual new run is read.

## Exact remote reconstruction and integration

The execution workspace was unavailable. The candidate was reconstructed from
fresh exact 5a GitHub preimages and reviewed as a new source candidate. Earlier
local PowerShell 7.5.4 results were not inherited by the final reconstructed
files. Root and the independent reviewer fetched complete immutable blobs and
recomputed their Git identities; root independently verified all six authored
file SHA-256 values, all 2,075 helper tree leaves, the complete tree hash and
the ordered commit parents. The branch update used an expected-head lease and
was nonforced. A local fetch was unavailable.

The helper also reuses the existing reviewed one-line core-overlay alias from
`2899ffde`, exact blob `2687299e55689f6fca67d7a8904eb85923d2aaa9`.
That removes the earlier browser fixture's bundling blocker while retaining
its real source and assertions. The [completed browser receipt](../v1-web-f450eaa-rendered-and-consumer-pass/README.md)
retains the complete original logs: 32 overlay tests and 686 instrument tests
passed. Expo passed two installed-consumer cases; basic passed one and skipped
the Expo-only case that the Expo lane actually passed. Every log identifies the
same actual merge. Render artifact ZIPs and PNGs remain unextracted/unviewed;
final combined-candidate verification remains required.

The aggregate Windows workflow already has canonical workspace archive inputs,
manifest verification and original archive retention. Integration therefore
inserts only the exact reviewed 56-line PowerShell gate into aggregate workflow
blob `22202c44b7d5a0b1d168fa4b1c73856b0af50743`, producing
`7332c96514fefc1d54bacef61689289fd51b5bed`. Removing that block reproduces
the aggregate preimage byte-for-byte. Replacing the whole file with the helper
workflow would lose the canonical archive wiring and is not the integration
performed here.

The earlier staged Windows Input routing analysis remains uncommitted in the
unavailable workspace. No disassembly or binary evidence was recreated from
memory. PR57 remains held until desktop convergence; final combined-source
verification, all fifteen original canonical archives, platform evidence and
the exact owner distribution approval remain required.
