# Browser overlay acceptance at `2899ffd`

The isolated Chromium overlay workflow passed all **32 tests in 8.8 seconds**
after the fixture gained the real `@nyc-tron/core/overlays` alias. This result
belongs to PR head `2899ffdedf98e2a86c077f15aa1baf6401c07b80`, tested through
merge `0576bea35225fde1437a50263c8154aca525ec8d`.

- [Original run 42858538441](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42858538441), Chromium job `129978085474`.
- [Provenance](provenance.json) records the original artifact identity and independent ZIP verification.
- [Original log excerpts](job-log-excerpt.txt) retain checkout identity, test outcomes and uploaded artifact identity. The full downloaded job log's hash is recorded separately; the full log is not included here.
- [Artifact file manifest](artifact-files.json) records byte counts and SHA-256 hashes for all twenty downloaded original PNGs. Exactly two original PNGs are retained in this folder: [light tablet popover](popover-light-tablet.png) and [dark phone trigger popover](trigger-popover-dark-phone.png).

Both selected captures were visually inspected. Their popovers fit within the
respective viewport, text is visible, and the focused first action has a
visible outline. These minimally styled interaction fixtures are not a product
design reference. The artifact contains screenshots, not a machine-readable
test report; the 32-test pass is established by the original successful job log.

This evidence establishes the browser result for the stated checkout. It does
not establish native AppKit, mobile, hardware-input or final combined-candidate
acceptance. The failed browser bundling result at the earlier `0edd5f3`
checkpoint remains historical evidence of the corrected fixture defect.
