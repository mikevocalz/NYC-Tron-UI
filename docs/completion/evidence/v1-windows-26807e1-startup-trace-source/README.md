# Private Windows startup stage trace — source review only

This receipt covers a bounded diagnostic in the prepared example's native header. It does **not** establish a startup fix or a new native pass.

The motivating combined run, [`fc901030`](https://github.com/mikevocalz/NYC-Tron-UI/commit/fc901030ba1e0eed1b399ad0a3100529bf97e52f), compiled and deployed its Windows consumer. The process then exited with `0xc0000005` before UI Automation observed its first window. Its [original outcome receipt](../v1-windows-fc90103-startup-exit/README.md) preserves the complete job logs. Those records do not identify a causal function, and failure to observe a window does not prove that registration or other callbacks never ran.

## Exact source and review artifacts

| Item | Git blob | Bytes |
|---|---|---:|
| Native header preimage | `00f6ff5f1735c81a5268855a5fb33627f5112cd7` | 30,240 |
| Native header candidate | `26807e1426f40a83b5664871b1dbb82b7bc5cf19` | 41,674 |
| [Exact edit manifest](native-edit-manifest.json) | `d997a803ec42a82cbb9550735269aaad9a0bb98a` | 22,343 |
| [Fixed protocol](protocol.json) | `b982f6fdf349d251f48c6ec0aebbeb5e42c3ee33` | 3,362 |
| [Reproducible source/format/model checks](native-review-checks.js) | `09a67b698d2a57d64761ac85faff7869ff0bd5a5` | 15,874 |

The changed source path is `packages/windows-fluent/rnw-fabric/example/native/NavigationProbe.h`. The candidate SHA-256 is `38f29c17da9c9b8bcd651148b79f4d668935b55c248390684604d39fbc59ae0f`. Every artifact above was created as an immutable blob and read back exactly. [Native review evidence](native-source-review.json) records the other hashes, scope and primary API references.

Fifteen unique replacements reproduce the candidate; their reverse, applied in reverse order, restores the complete preimage. The original
`settings.Properties().Set(HookKey(), winrt::make<Hook>(std::move(observer)))`
expression remains unchanged. The change does not force an order between its arguments. `HookKey` still returns its owning value; the additional local value permits a returned marker without introducing a borrowed reference.

## What the diagnostic records

A private, one-attempt writer uses `GetTempPathW` and `CREATE_NEW` before the existing `Observer` factory and its `ApplicationData` call. Its fixed filename binds the exact source revision, process ID and process creation FILETIME. The handle is noninherited, permits only read sharing, and remains owned until process exit after ordinary writes, a cap or a write failure.

Rows contain only the eight typed protocol fields: schema, source, process, creation time, sequence, thread, a predefined stage and a contention-observed-through-row boolean. There are 49 allowed labels. The writer has a 64-record / 16 KiB budget and a 512-byte row buffer. A reserved `trace-limit` row is evidence only if it was actually written. A failed or short write disables further writes and preserves any partial trailing bytes.

The stages cover configuration, the existing Observer factory and constructor statements, the property-key call, Hook constructor body, registration and subclass/ready boundaries. Only the first window-message callback gains entry/scope-exit observation. The logger uses an exclusive try-lock and restores the calling thread's `GetLastError` value on its entry-point paths. It does not add app activation, focus, layout, template, accessibility or input actions.

A separate parent collector is required to bind an exited retained process to this file, preserve its exact bounded bytes, classify an incomplete tail and emit a typed console projection. That collector is outside this header-only receipt.

## Interpretation limits

- A `*-returned` marker proves that control reached the inserted statement. Several markers follow an existing success guard or `Refuse`; a missing marker does not prove the API never returned.
- Constructor-body entry follows member initialization. Hook body exit is not proof that `winrt::make` returned. The first callback's scope-exit marker is not a success result or coverage of later callbacks.
- `GetTempPathW` is environment-sensitive. A parent/child resolution mismatch, failed exclusive creation or missing file remains unknown; it cannot prove configuration was unentered.
- A contention flag describes only observations known through that retained row. Later omissions and final totals remain unknown. There is no completed-startup footer.
- Partial writes, caps, contention, process termination and trace failure can interrupt the sequence. The last retained marker does not identify a crash cause.
- Synchronous Win32 trace IO may perturb startup and has no hard cancellation bound. This source makes no timing or unperturbed-execution claim.

## Verification boundary

Five portable source/format/model review designs passed in V8, with 517 assertions. They check exact identities/inverses, original operation ordering and expression ownership, all fixed labels and maximum-width JSON rows, cap/partial-write behavior in a model, and source-level ownership/error-preservation guards. The maximum legal modeled row was 262 bytes including LF; the tested capped writer models reached at most 15,689 bytes.

Root independently read all fifteen edits and reproduced the same five groups. A second reviewer independently read the full native source/diff and found no blocker. These reviews cover source semantics only.

These are **source and model checks**. This candidate has not been compiled as C++/WinRT or executed through Win32 file IO, Windows startup or native UI in this receipt. It does not change or replace any activation, drag, navigation, RTL, archive or release acceptance requirement. Publication and actual native evidence belong to a later exact-source run.
