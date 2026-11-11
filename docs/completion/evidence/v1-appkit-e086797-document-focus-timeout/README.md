# AppKit e086: second document activation timed out at the strict focus wait

Native run [42992156557](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42992156557), attempt 1, **compiled successfully and failed native acceptance**. The canonical core producer job succeeded. The actual checkout is `001763090bc16a9e72143022bf04543c5acd39b6`, with tree `b4f409fbf1af7a5de5c4d2eab0c73bd55806d6de` and ordered parents `ac5d69585a52a6e945dc996ea08030e190574699`, `e08679769e471aba5403cd864c8a2fa2310b9086`. The complete 2,050-leaf map and all 284 directory hashes were verified against these immutable identities.

The first final error is **Timed out waiting for visible, key and active native owner window (document-1)**, at executed verifier `d21bf8d24520183a61bf6b82879d78bd6a9d322f`, line 1319. Original native-log lines 536, 538 and 542 bind the error, stack and exit code 1. This is a completed failure, not a still-running job.

## What the failure establishes

This is the **second `show('document-1')`**, after the main inspector was shown and its second close witness armed. It corresponds to native activation **operation 4**. The retained `reply-prepared` record reports regular policy, active application, visible requested window and key requested window; the operation also reports matching process/bundle identity. These are the observations at that native reply, not the later polling result.

The subsequent existing polling conjunction requires visible, key, active and frontmost-PID match. Each successful inspect return separately asserts launched-process identity, regular policy and ability to become key. The retained command projection omits the later returned state values, so **the failed part of the conjunction remains unknown**. Explicit close at line 1320 and the second did-close completion wait at line 1321 were not reached.

By exact source control flow, the **first** Escape did-close/later-main-turn witness and unchanged opener-focus assertion returned. That does not establish second-witness completion or a focus-stealing cause. The tooltip hover check reports passed and its corrected typed extraction provenance is retained in `tooltip-summary.json`; its raw tooltip file and pixels were not independently inspected.

## Evidence and limits

The original native and core logs are retained byte-for-byte. JSON extracts remove only their logged timestamp prefix and retain the original record/newline. The startup envelope preserves all **9 interleaved non-JSON stderr lines** in original order. These lines must not be dropped to make the log appear cleaner.

The startup projection describes a read-time prefix of a live app log. It is not the final complete app log. The command-file read is bounded and incomplete; omitted commands cannot establish nonexecution. `provenance.json` records actual read sizes, unobserved bytes, selected/omitted records and partial-line state. Full command files, retained app-log snapshots, process sample stacks and original artifact ZIP bytes remain uninspected.

The build summary reports a complete, unnormalized compiler transcript of **12,329,229 bytes**, SHA-256 `e6351daee41430266ed3502fe5989750f1e36c57dba6aebb422c072e715e725c`. That is producer-recorded provenance; the complete compiler transcript was not separately fetched. Artifact IDs/sizes/digests in `metadata.json` are API/producer records, not independent ZIP-byte verification.

No source, permission, TCC, launcher, host, runner or release setting is changed by this receipt. All 341 source rows remain implemented (332 local plus nine pinned external), including the requested twelve; full eight-platform acceptance remains **0/341**. Physical-device, spoken-output, performance, exact original-archive and owner-manifest gates remain open.

## Retained identities

| File | Bytes | Git blob | SHA-256 |
| --- | ---: | --- | --- |
| native-job.log | 93759 | `947b5cd3793248f08d62cd89f4c49f8f00fbaf14` | `3af2be4c28cdd40df7235d280d85b904de46e800825141e4482ba34617c4d524` |
| core-job.log | 19522 | `e204e59749c038d12e2ebbe5369e108974f0f3a2` | `744803b65d143c4243e3f5f83c2c632274536136b170e63d527dbe591f6f772b` |
| build-summary.json | 319 | `ea48c1b07846a7997ee57a325fce3d304eca284a` | `5d6dc2a7b0c641b6788c0774fdaf9f4b33fa995f7daacd965d8368c66992c97f` |
| tooltip-summary.json | 9153 | `68fc5b333ca47e95bf803806313ef06429af69ed` | `544f11bc80c50eb2b38d4700873ad00d56b097787ead59c4d3b0ad909beab82d` |
| tooltip-envelope.log | 9300 | `d1118d8bfbd5676acbb811a7e1028da03707a68b` | `7f4bcd04c4561afc5eb994e683b52ea10e0905b0a7ec3d6e9d84ea43a1b56441` |
| startup-summary.json | 31142 | `e8264247da297e83c009325658759fa19e309a9d` | `2eab33ed4d4ca5fa9e4cdd2d473af601f2e75846b10df56b16ba27c685aa38d4` |
| startup-envelope.log | 31990 | `142a259c03f9ce32d4e18e0ab55c0e149cb18766` | `5178aea6e020ccb43fde9c21af6c11cfbf6f62460b8861e7a444da9e91969b27` |
| metadata.json | 28395 | `768e5c74520290761313e27edd419a2ac101c1fb` | `7bdd241d395f346f2476821592d0f617c2283b5dff4bb822da937f569f7848e6` |
| provenance.json | 15999 | `d5b3cf7f9b028d91fc9c7465e68e746ef24f025c` | `08fa9a9525fd5fad51bf552aa28912b2cfc0467c472ec3d4e929a88d809b08a4` |

The source review, this completed-run outcome and subsequent source changes are separate checkpoints. The receipt does not transfer an earlier pass to a later source tree.
