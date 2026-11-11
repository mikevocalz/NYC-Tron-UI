# Combined fc90103 mobile outcome

The completed attempt contains verified source and Android original logs and a failed iOS touch job whose original log could not be retrieved. This receipt does not mark mobile acceptance complete.

## Source identity

- Draft PR #64 head: `fc901030ba1e0eed1b399ad0a3100529bf97e52f`.
- Source and Android original checkout: `255b63f5800cfbd2cbc7fa27ed6e1cad477c14c6`.
- Executed tree: `5acadef01a5fcafa3600949e7c50e730aa3663e9`; ordered merge parents are `25a6af6d020e34d790f6a4f3d9f117738b252f1e`, then `fc901030ba1e0eed1b399ad0a3100529bf97e52f`.
- Workflow run [43026784330](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43026784330), attempt 1, completed with failure. The iOS job metadata identifies the PR head, but its original checkout line was unavailable.

## Observed results

The source job (130543376260) passed and wrote 13 workspace tarballs. Its original checkout is on line 123 and pack count on line 555.

The Android job (130544275610) completed successfully at 13:31:47 UTC. The original log explicitly reports **11 native decoder checks** on line 2739 and **four actual OS-driven UI flows** on line 2740, both at the observed checkout above. No explicit recovery count was observed; zero is not inferred.

The iOS job (130544275678) completed with failure at 13:40:30 UTC. Completed step metadata reports successful simulator compilation and decoder execution. The XCTest reference/pointer touch step failed at 13:39:34 UTC, and its evidence-retention step succeeded. These are metadata conclusions only: the specific failing assertion, decoder/UI counts, recovery count and original checkout are unknown.

Two completed reads through the dedicated job-log connector returned `Transport closed`. This establishes log unavailability through that connector, not its underlying cause. There was no unchanged rerun or alternate execution to recover the evidence.

## Preserved evidence and limits

`source-job.log` and `android-job.log` preserve the original decoded bytes, with independently recomputed Git blob IDs, SHA-256 hashes and byte lengths in `provenance.json`. The provenance also preserves exact selected original lines and both retrieval errors. `completed-metadata.json` contains the completed run, jobs and producer artifact metadata.

Artifacts are producer metadata only. No ZIP extraction, member inspection, installed-byte equality, physical-device result, final archive acceptance or release approval is asserted. This attempt does not establish iOS UI acceptance, acceptance across all eight platforms, or approval to merge, tag or publish a release.
