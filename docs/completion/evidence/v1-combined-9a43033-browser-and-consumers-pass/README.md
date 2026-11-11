# Combined browser and installed-consumer results

The combined PR64 candidate passed the rendered overlay, instrument and reference workflows and both installed-tarball browser consumer jobs. All five complete original logs print actual checkout `e8f8c19db909a53f3054976449a7571b2a0524e9`; metadata binds its tree and ordered parents recorded in provenance.json.

| Job | Completed result |
| --- | --- |
| Rendered overlays | 32 passed |
| Rendered instruments and component fixtures | 686 passed |
| Reference screen | 29 browser tests passed; three separate async-state source model tests passed |
| Installed Expo web consumer | Both cases passed, including Expo browser export conditions |
| Installed basic web consumer | Shared consumer case passed; Expo-only case intentionally skipped |

These results belong to the combined candidate, not the earlier helper runs. Exact run/job IDs, original line locations, blob identities, byte counts and SHA-256 values are in provenance.json. Completed job/step and artifact metadata are retained separately in completed-metadata.json. The five original logs retain their exact fetched bytes and were independently read back from their immutable blobs.

The browser tests exercised actual Chromium. The rendered ZIPs, screenshots and consumer dependency payloads have not been extracted or visually inspected here. Artifact digests remain producer-reported. No pixel-inspection claim is made.

The installed consumer jobs built their own pull-request tarballs and installed them outside the repository. Their release-producer canonical-download steps were skipped. A consumer pass is not verification of the final original thirteen workspace plus two desktop archives, exact peer hashes or owner approval.

The reference source tests and the common installed consumer scenario are not added to a fabricated distinct-test total. Desktop native failures, supported Windows host, physical devices, speech, performance and final distribution verification remain separate gates.
