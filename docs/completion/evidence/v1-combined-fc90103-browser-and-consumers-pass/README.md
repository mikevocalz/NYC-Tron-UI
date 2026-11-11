# Combined fc901 browser and installed-consumer passes

Four completed original job logs bind actual checkout `255b63f5800cfbd2cbc7fa27ed6e1cad477c14c6`
for PR64 head `fc901030ba1e0eed1b399ad0a3100529bf97e52f`. The merge has tree
`5acadef01a5fcafa3600949e7c50e730aa3663e9` and ordered parents 25a6 then fc901.

| Completed lane | Run / job | Result |
|---|---|---|
| Rendered web overlays | 43026784346 / 130543376188 | 32 passed |
| Rendered web instruments | 43026784430 / 130543375913 | 686 passed |
| Basic installed tarball consumer | 43026784298 / 130543375191 | One passed; one Expo-browser-export test skipped |
| Expo installed tarball consumer | 43026784298 / 130543375522 | Two passed |

All runs are successful, pull_request event, attempt 1. Each original prints
the complete actual checkout SHA. The basic original labels its skipped
case as Expo browser exports; the Expo job runs both cases. Counts are
reported per suite. Earlier reference-browser results retain their original
source identity and are outside this four-job receipt.

The complete originals, exact checkout/test summary lines and Git/byte/SHA256
identities are retained in [provenance.json](provenance.json). The companion
[completed metadata](completed-metadata.json) records successful jobs and
steps, plus the artifact metadata. Original bytes were created and fetched
back exactly without newline, BOM or timestamp normalization.

The installed-consumer logs each report thirteen newly packed PR tarballs.
Canonical release producer download steps are skipped. These builds and
browser passes do not establish the original final fifteen-archive inventory
or cross-producer archive byte identity.

All four artifact digests and sizes are producer/API reports. ZIP bytes,
members and screenshot pixels were not downloaded, extracted, independently
rehashed or inspected. This receipt establishes the completed browser and
installed-consumer executions, with no desktop-native, supported-host,
physical-device, speech, performance or owner-approval promotion.
