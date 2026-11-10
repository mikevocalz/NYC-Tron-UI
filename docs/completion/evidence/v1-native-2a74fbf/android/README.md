# Android acceptance with canonical archives at `2a74fbf`

[Native workflow 42871225491](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42871225491)
completed [Android job 130023536716](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42871225491/job/130023536716)
successfully for PR head `2a74fbf5bc5f3be5137af73d9590ce05abaaf0b0`.
The actual tested merge was `0ce41081d56acb365c1c1cf382eeaff27aa24543`.

Native compilation, all eleven installed media checks and all four native UI
flows passed. Settings edit/save, Editor draft route retention/save, pointer
touch/release and pointer cancellation each executed one successful JUnit case,
with zero failures or skips. The original UI result records zero transport
recoveries. Original reports and screenshots are preserved under
[media](media/result.json) and [ui](ui/result.json).

## Exact canonical package inputs

The consumer downloaded the [Ubuntu producer's thirteen-package artifact](../workspace/README.md)
and installed its ten required NYC-Tron packages. Its original
[producer manifest](workspace-packages.json) and
[workspace checksum file](workspace-SHA256SUMS) are byte-for-byte identical to
the producer's originals. The consumer, installed-package receipt, media result
and UI result all identify the same tested merge and package version `1.0.0`.

The producer manifest SHA-256 is:

`34335d9968c0c4baab066ef454c29d25be04f8514b9778bbc23f52c29647b4fa`

For every installed package, its recorded SHA-256 matches the independently
hashed original producer tarball. The original npm lock resolves that exact
local archive and has the SHA-512 integrity independently computed from its
bytes. [Canonical input verification](canonical-input-verification.json) records
all ten comparisons. [Npm lock proof](npm-lock-proof.json) preserves the selected
original lock entries and identifies the complete lock file by its original ZIP
entry, byte count and SHA-256. The full lock remains in the original artifact.

## Native payload and interaction proof

Artifact `13791566541` is 121,386,018 bytes and matches GitHub's original ZIP digest:

`07717689999d82e94d867d0f8207c0d67bf76418c94a002383663b61fc5910ee`

The original APK was streamed and independently hashed. Its 364,067,365 bytes
match both installed native manifests and the media/UI receipts:

`8abbabe696c327048d79b4d05afb8c06bd4702f7f02fedcb555d47637b46fe65`

[Verification](verification.json) maps all 38 retained original files to their
ZIP entries and hashes. Package receipts, media/UI source identities, native
payload identity, Metro warmup receipts, JUnit results, native hierarchies and
screenshots were checked independently. The original GitHub job and artifact
responses are included. App binaries and full logs are not copied into this
folder.

The [cancellation verification](ui/pointer-cancellation-verification.json)
binds the original command receipts to their before/after native hierarchies.
Touch-down at the observed surface center `(161, 433)`, Home and Activity resume
all succeeded. Before Home there was one committed stroke, zero cancellations
and last event `down`. After resume there was **one committed stroke, one
cancellation, zero prediction samples and last event `cancel`**. The final
capture retains the original committed blue stroke.

[Recomputed reference geometry](native-layout-verification.json) matches the
original report and keeps the header and tabs within native safe-content
bounds. Settings and Editor captures show the saved workspace and cover, with
readable dark OS status icons on the light reference background. The standalone
pointer capture still has faint light OS status icons against its light
background; that fixture appearance is separate from the passed cancellation
and input assertions.

These results establish the executed API 35 emulator flows at this revision.
Physical pen pressure, tilt, hover, palm rejection, foldable behavior and spoken
TalkBack output remain the separate gates recorded by the native UI harness.
The earlier `2899ffd` receipts remain unchanged.
