# Combined fc901 source suite passed

[Source run 43026784250, attempt 1](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43026784250/attempts/1) completed successfully for combined head `fc901030ba1e0eed1b399ad0a3100529bf97e52f`. All three complete original job logs print actual checkout `255b63f5800cfbd2cbc7fa27ed6e1cad477c14c6`. The independently reviewed merge tree is `5acadef01a5fcafa3600949e7c50e730aa3663e9`, with ordered parents `25a6af6d020e34d790f6a4f3d9f117738b252f1e` then the combined head.

PR64 targets the frozen `codex/v1-reviewed-integration-nov10` base at `25a6af6d020e34d790f6a4f3d9f117738b252f1e`. This is the new combined candidate's own source execution; the earlier combined `9a430338` and Windows helper `8a5007d` results remain separate records.

## Observed checks

Linux passed **1,204 of 1,204 tests**, and Windows passed the **same 1,204-test suite**. Both report zero failures, cancelled tests, skips and todo entries. Durations were **21,897.776457 ms** and **60,288.8427 ms**. These are two executions of the same workflow test list, not 2,408 independent test designs.

The type and export checks validate 619 conditional exports and 750 ESM files. Public API checks match thirteen packages, 619 subpaths and 3,306 reachable declarations. The component verifier reports 341 canonical IDs: 332 local implementations, nine pinned external implementations, zero partial or pending, and zero accepted with all eight platform proofs.

Both applicable packaging lanes report thirteen workspace tarballs and seventeen fresh-import checks. Original binary archives and exact cross-producer archive byte identity were not inspected by this receipt.

## Retained originals and provenance

| Original | Completed job | UTF-8 bytes | Git blob |
|---|---:|---:|---|
| [linux-source-job.log](linux-source-job.log) | 130543376075 | 156,153 | `87d8a1ebcbf3de8c7bb50b4c9fda23e35dc7f702` |
| [windows-source-job.log](windows-source-job.log) | 130543375725 | 198,873 | `6c6d10a8b3916512b2bbe948934f1315760442c2` |
| [types-and-pack-job.log](types-and-pack-job.log) | 130543375277 | 62,121 | `201a3a9c60811a4eb50b28965b6b06ee10643f01` |

[Completed metadata](completed-metadata.json) records the run and all three successful jobs. [Provenance](provenance.json) records full SHA-256 identities and exact checkout, summary and packaging line references. All three complete decoded originals were created as immutable blobs and fetched back byte-for-byte; their original line endings, BOM and timestamps were preserved.

The [integration manifest](../v1-desktop-observation-integration-nov11/integration-manifest.json) binds the eight source changes, report and 64 new evidence files. Independent review checked all 3,380 leaves and 550 directory hashes, with exactly 74 changed paths and 3,306 other baseline leaves, types and modes unchanged. The source workflow remains `12e2027a8ab889117165588431b737ce53ae4bef` and this run's recorded event is `pull_request`, attempt 1.

## Result boundary

These general source, type and package checks do not execute the new C++/WinRT Hook, PowerShell consumer or AppKit presentation diagnostic. In particular, this result does not establish that the six-byte correction to the historical `8a5007d` native compiler failure compiles in the native example. Separate completed native originals must establish those results.

Source success does not close native interaction, supported-host eligibility, final archive verification, physical-device, speech, performance or exact final owner-manifest approval. No main merge, tag, release or npm publication is authorized by this receipt.
