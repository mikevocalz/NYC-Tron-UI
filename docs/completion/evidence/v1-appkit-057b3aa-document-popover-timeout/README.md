# AppKit 057: document popover presentation timed out

Native run [42990107157](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42990107157), attempt 1, **compiled successfully and failed native acceptance**. The canonical core producer job succeeded. The actual checkout is `69eb1c504c105b57844181c1e27c1a430fc888cd`, with tree `da0cbf6c7dedd2505a963db67d53d8f2810f23d2` and ordered parents `ac5d69585a52a6e945dc996ea08030e190574699`, `057b3aa7a28c12594f26dd4bc9baf9bc636610e8`. The complete 2,050-leaf map and all 284 directory hashes were verified against these immutable identities.

The first final error is **Timed out waiting for shown native NSPopover**, at executed verifier `f21e9349b35922ad689a2f6320ed651b5557de64`, line 1265. Original native-log lines 535, 538 and 543 bind the error, stack and exit code 1. This is a completed failure, not a still-running job.

## What the failure establishes

The failed document popover wait requires both `current.shown` and `current.contentVisible`. Its later native-popover, positive-frame and usable-region assertions were not reached for that presentation. The retained projection does not identify which part of the wait was false.

Exact source control flow shows that the earlier Escape dismissal/status/opener-focus assertions, retained-content reopen, document activation, drag-protocol rejection/cancellation/transfers, layout restoration, and main-popover dismissal preserving newer document focus returned. This is a control-flow conclusion, not independent inspection of all original per-step native files. Owner-minimize coverage and later real pointer/drag gates were not reached.

The later reviewed e086 run fails at a different, earlier document-focus wait. It does not establish that this document-popover presentation failure was resolved. No production focus-stealing cause is assigned.

## Evidence and limits

The original native and core logs are retained byte-for-byte. JSON extracts remove only their logged timestamp prefix and retain the original record/newline. The startup envelope preserves all **10 interleaved non-JSON stderr lines** in original order. These lines must not be dropped to make the log appear cleaner.

The startup projection describes a read-time prefix of a live app log. It is not the final complete app log. The command-file read is bounded and incomplete; omitted commands cannot establish nonexecution. `provenance.json` records actual read sizes, unobserved bytes, selected/omitted records and partial-line state. Full command files, retained app-log snapshots, process sample stacks and original artifact ZIP bytes remain uninspected.

The build summary reports a complete, unnormalized compiler transcript of **12,329,230 bytes**, SHA-256 `5abb66b73b2f2a9671fd8b9c4ecac42a169160d9f39a7064a5216dc6d3cda214`. That is producer-recorded provenance; the complete compiler transcript was not separately fetched. Artifact IDs/sizes/digests in `metadata.json` are API/producer records, not independent ZIP-byte verification.

No source, permission, TCC, launcher, host, runner or release setting is changed by this receipt. All 341 source rows remain implemented (332 local plus nine pinned external), including the requested twelve; full eight-platform acceptance remains **0/341**. Physical-device, spoken-output, performance, exact original-archive and owner-manifest gates remain open.

## Retained identities

| File | Bytes | Git blob | SHA-256 |
| --- | ---: | --- | --- |
| native-job.log | 87659 | `f5b20289953a87106df369db6969ab2ac3c3b088` | `c864224a91bdf91483453da256832f29a27a593cb79173e05cae61a110f36675` |
| core-job.log | 19701 | `63d7e697b0c80bd8b901b8d4df35141499e788f0` | `b017ba201e7908421b8a3a2bc1c61873e62a1f3d3321fe7bef1aa62ee11ab5ac` |
| build-summary.json | 319 | `c9ab504f1706c26f3549dd52d1670a9587dcfcce` | `a30bf0e4c0c365283407a9196a9fb469987de7256acede6b73911de3e76a4de0` |
| tooltip-summary.json | 2800 | `7c16a8edb76dee93638b24b7f764555ff3679d89` | `b1c36c096f49cd80bb91db4fcf81fabf3c98c212751dd4523fcaa8bedad9ab56` |
| tooltip-envelope.log | 2947 | `74dac1d745d6ecaa6358f43bedd2c6023f5a2640` | `9ee59f42fd0fec32f6b4c0fb3be10c7f58ff2eb8227bdfad082a7fd6945cb8f1` |
| startup-summary.json | 31132 | `4b52145858022d980b6f9eb0d0aaa7350e20c8f1` | `395e052daa67ec770366079debad49bdf1d0b7de8b9674de11e601b509d88dc6` |
| startup-envelope.log | 32086 | `b8b3bea500a3f16e5b94514eb21083342d6b0216` | `61b14466bcab72fa2451520cf6fc1537a00450ca33da7142c94e73458c4d8862` |
| metadata.json | 28210 | `136da0a18cd8db8d519c1f77057eb0209844fed6` | `b8902f201e5dc04fff67bdc96ca4b9e7d79d92781a7a602f97312cfc2fc35137` |
| provenance.json | 9306 | `2eecb042835ec6e6aa56775f5fc890dbd3dd030e` | `6a5a647fbb1f2a79c142ab9ebc729c109f2b71d4d500188da0ae6da30ec4aed2` |

The source review, this completed-run outcome and subsequent source changes are separate checkpoints. The receipt does not transfer an earlier pass to a later source tree.
