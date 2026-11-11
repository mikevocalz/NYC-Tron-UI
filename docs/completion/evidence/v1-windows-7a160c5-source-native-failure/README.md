# PR63 first source and native compile failures at 7a160c5

**Both completed workflows failed.** This receipt retains the first source and native results for PR63 head `7a160c536b845d71487ba2997262daf3cf07cb9b`, tree `24b244e41d6d61e7dfe56a1cd32d56d37bb0f035`. All three retained original job logs independently show checkout `de54b75c752e57fbfd12cbf01e458bfd41788c45`, the generated merge with ordered parents aggregate `25a6af6d…` then head `7a160c53…`. The merge and head have the same tree.

The earlier [lifecycle source-review receipt](../v1-windows-7a160c5-lifecycle-source/README.md) records source composition and review. It is not this CI outcome. No result here transfers to a later source revision.

## Completed workspace source run

[Source workflow 42994633542](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42994633542), attempt 1, was triggered by the pull request. The Windows job [130435532706](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42994633542/job/130435532706) built every workspace package, then ran **1,204 tests: 1,202 passed, 2 failed, 0 cancelled, 0 skipped**, in 45,600.9894 ms. Its later export/pack/fresh-import steps were skipped. The separate Linux pure-contract and TypeScript jobs report success in completed API metadata; their full logs and counts are not retained in this receipt.

The two exact failing cases in [workspace-windows.log](workspace-windows.log) are:

1. **“retained snapshots survive writes through an already-open driver log and include hidden debug evidence”** (`tooling/tests/native-ui-transport.test.mjs:123`). The test keeps a nested log descriptor open, then retention fails with `EPERM` while renaming `settings` to `settings-initial-transport-live`. The stack points to `retainInitialUiTransportFailure` at `tooling/native/ui-transport.mjs:113`. The retained diagnostic includes errno -4048 and syscall `rename`.
2. **“manual candidate runs cannot publish without explicit opt-in, even when every gate passes”** (`tooling/tests/release-readiness.test.mjs:194`). The assertion at line 198 says **“manual publication must have an explicit input”**, with actual `undefined` and expected `true`. This is a test assertion result; it is not evidence that a release was published or that a production publication guard was absent. Source analysis and the portability correction are separate records.

Totals are at original log lines 1416–1423, the retention failure at 1427–1444, and the publication-input assertion at 1446–1462. Those line numbers use the complete original text; its CRLF bytes are preserved.

## Completed Fabric run

[Fabric workflow 42994633333](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42994633333), attempt 1, also used the pull-request merge.

| Actual stage | Result and scope |
| --- | --- |
| Source/codegen job 130435532463 | Passed. The initial source suite reported 13/13; the later package plus isolated suite reported 49/49. These overlap and are not 62 distinct cases. |
| Public declaration snapshot | Matched 1 package, 8 subpaths and 44 reachable declarations in both source and Windows native jobs. |
| Windows source distribution and lifecycle suite | Passed 49/49; this is a repeated package/isolated suite, not additional native concurrency coverage. |
| Fresh installed consumer | Installation and subsequent installed-package codegen steps completed successfully. The log identifies the consumer outside the checkout. |
| Windows PowerShell 5.1 x64 diagnostic gate | Completed successfully. Original console output has 21 PASS lines across the actual owned-process query and mixed mocked/actual diagnostic suites. This is not the later packaged-app UIA smoke test. |
| Consumer connection source tests | Reported 5/5 before native compilation. |
| Installed native C++ package compile | **Failed** on missing `IslandConnection::Site`, followed by additional Site and dependent initialization/operator diagnostics. |
| Consumer executable compile, deployment and UIA smoke | **Skipped** after the package compiler failure. |
| Tested-package retention/upload | **Skipped**. No accepted native distribution is produced by this run. |

The first compiler diagnostic in [fabric-native.log](fabric-native.log), original line 804, is:

```text
TronDragSurface.cpp(304,24): error C2039:
'Site': is not a member of 'nyctron::islands::IslandConnection'
```

The compiler references `IslandConnection.h(13,7)`; later calls at source lines 467, 476 and 523 also report missing `Site`. The build step exits with code 1. The diagnostic is from the installed package path in the fresh consumer, not a rendered UI observation. It does not establish whether every later compiler or runtime requirement would pass after restoring the accessor.

## Preserved original bytes and archive boundary

| Original file | Bytes | Git blob |
| --- | ---: | --- |
| [workspace-windows.log](workspace-windows.log) | 159,544 | `058feca66e4a22a222bc2f6ca722154be9e8fa91` |
| [fabric-source.log](fabric-source.log) | 31,860 | `629bd26db9ddefbfddfb11093dea49083469a824` |
| [fabric-native.log](fabric-native.log) | 104,510 | `165a4650b55bed9dceeb3ba946b60628c5b7550b` |

[provenance.json](provenance.json) retains the full SHA-256 identities, exact endpoints, checkout lines, test counts and evidence limits. [metadata.json](metadata.json) contains normalized completed run/job/step/artifact API records. Complete original log strings were separately fetched and hashed by the receipt author and root coordinator, then immutable blobs were read back exactly. No line-ending normalization, excerpt substitution or truncation was applied.

The source producer uploaded `windows-fabric-shared-packages` artifact **13843521730**, reported 62,822 bytes, three files, ZIP SHA-256 `8956e8b7f1a2052081ef360a53ad8403913d97e27664556c23b341a392ab8508`. The Windows job reported downloading the same digest.

The failed native job uploaded `winui-fabric-uia-smoke` artifact **13843293794**, reported 16,353 bytes, sixteen files, ZIP SHA-256 `e809817fa55c585bf6f99fc89d57ddfc9f58e23d607a7f06c8af571187204768`. The artifact's name does not mean UIA ran: its UIA step was skipped. These ZIPs and their members have not been downloaded, extracted or independently inspected for this receipt. Their archive hashes, file counts and sizes are producer/API reports, separate from the independently verified complete job-log bytes.

## Separate follow-up source

After these completed failures, PR63 advanced to `0596aa2e4441b2e3464a9fff32060cc10fb17481`, tree `6aad15f5f522da18a37fc5abe697953c71db92b0`, with sole parent 7a160c5. Its generated merge is `8ff0adf28897e7fd7300f6ebac112513ee7a4dbe`, with the same tree and ordered parents aggregate 25a6af6d then 0596aa2e. These immutable commit identities were read independently at 09:45:19 UTC.

Follow-up source run **42997727683** and Fabric run **42997727800** are separate runs. This historical receipt does not inspect or claim their result or actual checkout. The [retention portability source receipt](../v1-native-ui-retention-portability-source/README.md) records that correction without a filesystem/native pass.

No packaged-app launch, new drag result, eligible host, physical interaction, crash-cause attribution or tested-package acceptance follows from de54. The source failures, missing accessor and any subsequent corrections remain tied to their own exact revisions.
