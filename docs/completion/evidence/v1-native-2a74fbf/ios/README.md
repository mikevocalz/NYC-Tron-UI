# iOS acceptance with canonical archives at `2a74fbf`

[Native workflow 42871225491](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42871225491)
completed [iOS job 130023536936](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42871225491/job/130023536936)
successfully for PR head `2a74fbf5bc5f3be5137af73d9590ce05abaaf0b0`.
The actual tested merge was `0ce41081d56acb365c1c1cf382eeaff27aa24543`.

Native compilation, all eleven installed media checks and all three final
native UI flows passed. Settings edit/save, Editor draft route retention/save
and pointer touch/release each executed one successful JUnit case, with zero
final failures or skips. Settings took two attempts: the first navigation
encountered one evidence-qualified simulator transport cancellation before any
edit. That failed attempt and the successful full retry are retained separately.
The original [media](media/result.json) and [UI](ui/result.json) results record
the executed checks and the single recovery.

## Exact canonical package inputs

This consumer and the [Android consumer](../android/README.md) downloaded the
same [Ubuntu producer's thirteen-package artifact](../workspace/README.md).
Each installed its ten required NYC-Tron packages from those original archives.
The iOS [producer manifest](workspace-packages.json) and
[workspace checksum file](workspace-SHA256SUMS) are byte-for-byte identical to
the producer's originals. Consumer, installed-package, media and UI receipts
identify the same tested merge and package version `1.0.0`.

The producer manifest SHA-256 is:

`34335d9968c0c4baab066ef454c29d25be04f8514b9778bbc23f52c29647b4fa`

Every installed package's recorded SHA-256 matches its independently hashed
original producer tarball. Its original npm lock entry resolves that exact
local archive and has the SHA-512 integrity independently computed from its
bytes. [Canonical input verification](canonical-input-verification.json)
records all ten comparisons. [Npm lock proof](npm-lock-proof.json) preserves
the selected original lock entries and identifies the complete lock by its
original ZIP entry, byte count and SHA-256. The full lock remains in the
original artifact. These results apply to the downloaded archives; later
repacking does not inherit this evidence.

## Native payload and interactions

Artifact `13791728728` is 73,706,849 bytes and matches GitHub's original ZIP digest:

`4534b1c4859345539cad5364fbb25c8a1e26b1e7383cd2e0daee02f1a7d6012a`

The nested simulator app was verified without extracting its binaries. All
226 archived app entries match the original native manifest's paths, types,
modes, sizes, file hashes and symlink targets. Both media and UI receipts bind
that same app manifest:

`45e0bf10ff71227b36a0f628e80a85d85502d1e0dadae2a5f84a64242c7e0d68`

[Verification](verification.json) maps all 43 retained original files to their
ZIP entries and hashes. Package and source identities, native payload identity,
Metro warmup receipts, final JUnit cases, native hierarchies and screenshots
were checked independently. Original GitHub job and artifact responses are
included. App binaries and complete simulator/compiler logs are not copied into
this folder; selected original driver logs are retained as listed in the inventory.

The Settings command trace records a visible native keyboard, an actual
heading tap and a strict keyboard-absence assertion before save. The Editor
trace records a visible keyboard, Enter and a strict keyboard-absence assertion
before navigation, draft retention and save. Each platform branch and native
action completed in order. These are original OS-driven command receipts.

[Recomputed reference geometry](native-layout-verification.json) matches the
original report and keeps the header and tabs within native safe-content
bounds. The inspected Settings and Editor captures show the saved workspace
and retained cover with readable dark OS status icons on the light background.
The iOS pointer capture also has readable dark status icons and shows one
committed stroke, zero cancellations, zero prediction samples and last event
`up`. Android's separately documented pointer status-bar contrast defect is
not present in this iOS capture.

## First Settings attempt and retention limitations

The original failed screenshot remains on Library, and its JUnit result records
the failed `Workspace preferences` assertion. Independent reclassification read
the complete original 23,430,372-byte simulator log and 5,063-byte command
receipt from the artifact. Both match the hashes recorded before recovery.
Their contents reproduce the original eligibility exactly: the first Settings
tap's interval contains a Recap registration, unknown sender, nonempty cancelled
contact and cancelled path for sender `0x1037596000000`, path `2`, and this app's
scene. No edit had executed. The complete Settings flow then passed on its
single permitted retry.

[Recovery verification](transport-recovery-verification.json) preserves the
recomputed classification, original source paths, line numbers and full
recorded inventory. It also records two limitations in the uploaded evidence:

| Recorded original | Observed artifact result |
| --- | --- |
| `debug/.maestro/tests/2026-11-10_182500/maestro.log` | Missing from the ZIP despite its recorded SHA-256. The native upload did not enable hidden files. |
| `artifacts/2026-11-10_182500/xctest_runner_2026-11-10_182537.log` | Present, but its SHA-256 differs from the hash recorded before recovery. The recorded digest does not match any byte prefix of the uploaded log. |

Of the twelve listed originals plus the runner-failure record, eleven match,
one is missing and one has changed. The uploaded XCTest log is retained with
its actual bytes and hash, alongside the unmodified original recovery receipt
and its different recorded hash. The exact later writer or mutation was not
established. The full simulator log and command receipt used for eligibility
both match; the two retention defects do not alter the final native reports.
This run does not establish complete recovery-log retention.

The subsequent retention correction creates independent snapshots, hashes the
retained bytes, records the interval before recovery, and preserves live driver
files separately. It also enables hidden files only within the existing scoped
native artifact paths. That correction and the pointer fixture appearance
change are later source changes; the final combined candidate requires fresh
native gates to verify them. Original `2a74fbf` and earlier `2899ffd` receipts
remain unchanged.

These results establish the executed simulator flows at this revision.
Physical pen pressure, tilt, hover, palm rejection, foldable behavior, spoken
VoiceOver output and active iOS touch cancellation by OS interruption remain
the separate gates recorded by the native UI harness.
