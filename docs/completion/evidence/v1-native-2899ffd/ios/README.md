# iOS native acceptance at 2899ffd

[Native workflow 42858538373](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42858538373)
completed iOS job `129978088030` successfully for PR 61 head
`2899ffdedf98e2a86c077f15aa1baf6401c07b80`. The clean tarball consumer tested
merge `0576bea35225fde1437a50263c8154aca525ec8d`.

Native compilation, all eleven installed media checks and all three native UI
flows passed. Settings edit/save, Editor draft route retention/save and pointer
touch/release each executed one JUnit case with zero failures or skips. The
original UI result records zero transport recoveries.

The child command traces independently confirm both iOS keyboard flows. Settings
asserted the native keyboard was present, tapped the workspace-preferences
heading and asserted the native keyboard was absent. Editor asserted the
keyboard was present, pressed Enter and asserted it was absent. The iOS
conditional branch and every child action/assertion have status `COMPLETED`,
in the expected order. Saved-value and route-retention assertions still passed.

## Payload and receipt verification

Artifact `13785403370` matches GitHub's ZIP SHA-256 and byte count:

`de5bc5337412c6be15a77ce49c5f120162fef3145ad384476f574c4faa9d81f9`

Every one of the 226 entries in the archived simulator app was independently
compared with the installed-app manifest, including relative paths, types,
directory/file modes, file sizes and hashes, and literal symlink targets.
Internal symlink validity was checked as well. The verified native identity is:

`e64490d5a6ce2dbdaff0ccda8cafad2144d27b405ec075391be7df0de286be5f`

That identity matches the media and UI receipts. Consumer, installed-package,
media and UI source identities agree. Package receipt hashes, warmup record
hashes, JUnit hashes, native hierarchy hashes and screenshot hashes were checked.
[verification.json](verification.json) maps all 29 retained original files to
their ZIP entries and SHA-256 hashes. The original GitHub job and artifact
responses are included. App binaries and full compiler/device logs are omitted.

Native accessibility trees were reparsed independently. Both reference screens
retain their header and bottom tabs inside the observed safe content bounds;
the geometry matches the original UI report. The trees contain the saved
workspace, retained/saved cover and committed pointer trace labels. Saved
screenshots were visually inspected and show readable dark status-bar content
on the light reference background.

This result establishes the executed simulator flows at this revision. Physical
pen pressure, tilt and hover, palm rejection, spoken VoiceOver output and active
iOS touch cancellation by an OS interruption remain separate gates, as recorded
in the original [UI result](ui/result.json).
