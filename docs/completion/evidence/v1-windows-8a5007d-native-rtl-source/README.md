# Windows 8a5007d: private native RTL consumer source

The reviewed helper replaces the unavailable Raw UIA Icon observation with a fixed, private native visual-tree observation channel. It preserves the strict RTL geometry requirement and the original navigation actions. This is a source checkpoint: native compilation and execution were still unverified here.

The earlier [782 result](../v1-windows-782ed39-raw-icon-unavailable/README.md) and [combined 9a result](../v1-combined-9a43033-windows-raw-icon-unavailable/README.md) each completed the bounded Raw UIA walk without a qualifying Icon peer. Those observations do not establish that the rendered icon was absent or that its layout was wrong. They remain unchanged historical outcomes.

## Published identity and review scope

Root published draft [PR63](https://github.com/mikevocalz/NYC-Tron-UI/pull/63) head `8a5007d197539c782e065f1b59daf3fe5ed752ec` at 2026-11-11 12:39:08 UTC. The exact head postread was at 12:39:51; the body postread was at 12:40:06. Its tree is `9f7d87a249edc25216dcbc11763b009eda825ba2`, with sole parent `782ed3911dd35950797f7417fed813f5fa669c4e`.

The generated merge `e7901ec687e96a240a7b820baef50318fde40ddd` has that same tree and ordered parents `25a6af6d020e34d790f6a4f3d9f117738b252f1e`, then the helper head. Root and this reviewer independently fetched that metadata. Actual completed job checkout proof remained pending. Ordinary source run 43022193456 and native run 43022193331 had started; this receipt assigns neither a completed source outcome nor a native geometry result.

All 3,153 leaves and 514 directory hashes were verified, with exactly four source paths changed and 3,149 prior leaves unchanged. Root and Forge completed their independent tree/source gates before publication; the consumer author also recomputed the full remote tree afterward. The four changes are:

| Path relative to packages/windows-fluent/rnw-fabric | Reviewed blob |
|---|---|
| windows/NYCTronFluentFabric/TronNavigationView.cpp | `0f450e13031f974641e940cb97f550e83405a517` |
| example/native/NavigationProbe.h | `25555353791ca4b35f1be51e7566c2062ecc8091` |
| example/scripts/prepare-host.mjs | `07bc119118d38befb91f8aecfc94a67a96adfec4` |
| example/scripts/uia-navigation-accessibility.ps1 | `fc36388876504e8c51578933abde326ddfd275b2` |

The [separate native fixture receipt](../v1-windows-2555535-navigation-probe-source/README.md) covers the first three paths, private COM ABI and preparation. This folder covers the consumer's ten exact edits from `877c51ea1e16918968a6929e389c1f61f4a4e23d`, plus their binding to the complete helper. No workflow, dependency, permission or activation change is included.

## Consumer behavior

The consumer uses the parent's already-held process handle, original start time and owned top-level UIA window. It verifies PID, process creation FILETIME, window handle, native thread and runtime ID. The existing AUMID resolver supplies the exact packaged application's LocalState directory. No process search, provider reacquisition or UIA Icon inference is added.

A ready record supplies a fresh native GUID session. Every request and response must match the source revision, session, process creation, process/window/thread, sequence and phase. Phase 1 binds one generation; phase 2 must retain its component and native role identities. The fixed protocol permits at most 128 requests, with 2 KiB request and 8 KiB response limits. Missing, malformed, unavailable, stale, ambiguous or incomplete observations fail.

The file reader rejects non-disk, reparse, directory, empty and oversized inputs. It verifies the resolved handle path and complete stable bytes without sharing write/delete access. Request publication uses a new temporary file, complete write/flush/close and a non-replacing move. Exact ready/request/response bytes are retained under fixed evidence names, with exclusive creation and readback hash/byte comparison. The typed state keeps only a fixed native failure enum or null; the original response remains separately available.

The initial phase-1 response has one ten-second window. The original RTL action/status ordering and ten-second, 100 ms outer poll remain. Every phase-2 reply and final uniqueness observation shares that same RTL deadline; no request sequence is replayed and the deadline is never refreshed. Missing-file checks sleep 10 ms. Synchronous UIA and filesystem calls are not cancelled by this retry-window deadline.

The native rectangles must be finite, positive, checked-edge Int32 screen rectangles in the same XamlRoot coordinate contract. Owner, navigation, toggle and icon containment must hold. Native sequential stability and bracketed owner geometry are required. The exact old left-half-to-right-half predicate, unchanged containing rectangles/icon size, physical-left pane check, selection, screenshots, drawer collapse, contrast and restoration remain strict. Sequential agreement is not an atomic or render-completion guarantee.

The secondary console summary reads captured state only. Its complete UTF-8 envelope, including markers and final newline, is capped at 8 KiB. Overflow is explicit; reporting errors remain secondary. It does not print the raw session GUID, paths, exception text or arbitrary native values.

## Checks and limits

The immutable harness contains seven author designs with 215 assertions: exact hashes/ten-edit inverses, lexical delimiter balance, fixed resolver and process binding, malformed/stale protocol rejection, strict physical geometry, bounded IO/publication/retention models, shared-deadline lifecycle models, and typed summary privacy/limits. Modeled ordinary, maximum-width and fallback envelopes are 2,599, 4,447 and 187 bytes.

Forge and root independently fetched the exact inputs and reproduced those same seven designs and 215 assertions. Root's reproduction completed at 12:42:05 UTC with the same 2,599 / 4,447 / 187-byte modeled envelopes, ten edits and 24 preserved action statements. These reruns repeat the same designs; they are not additional designs or native execution. Root also independently approved the consumer source and native/helper tree.

These checks ran as portable JavaScript source/contract/IO/lifecycle/projection models. They did **not** parse PowerShell with its actual parser, compile C#, run .NET filesystem/message APIs, execute UIA or compile/run the native fixture. The models were still being packaged when root published after the independent source/tree reviews; the later passing results do not retroactively change that publication boundary.

The 24 original action statements and 4,455-byte later drawer/contrast/error/restoration/result tail are preserved exactly, apart from the secondary summary-call name. The borrowed GET contrast pointer and owned SET allocation/free remain unchanged. Native geometry, host eligibility, final acceptance and a tested release archive remain unproved here.

## Reproduction artifacts

Evaluate `consumer-review-checks.js`, then invoke the returned function with the exact source strings and parsed manifest: `{source, preimage, manifest, traceSource, smokeSource}`. The required source identities and existing resolver/parent dependencies are recorded in the manifest.

| File | Git blob | UTF-8 bytes | SHA-256 |
|---|---|---:|---|
| [source-review.json](source-review.json) | `36eb24cd2e9c5e16810706c143d4009a7604973d` | 13987 | `44a634ab10f7067754862e30785f2b52dc8a3d357597a8bb09e4335583fad4e4` |
| [consumer-edit-manifest.json](consumer-edit-manifest.json) | `15d84edce40ee47cd897a295a2adc5a151290273` | 71229 | `5caa84841f979ae96f0864083c336020cc73fd856e8249571d46a7fef0d38341` |
| [consumer-review-checks.js](consumer-review-checks.js) | `1e0054e46ee51404f5da3ecac793d48e57fc6b12` | 36006 | `2fb6bc7fa8556b5408b24bff0125763984cd99a99af54147b2bded0d0c75639f` |

Microsoft's [CreateFileW](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew), [resolved-handle path](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-getfinalpathnamebyhandlew), [PostMessageW](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-postmessagew) and [File.Move](https://learn.microsoft.com/en-us/dotnet/api/system.io.file.move) contracts support the chosen file/message operations. A successful post is not an observation acknowledgment; the complete matching response is required.
