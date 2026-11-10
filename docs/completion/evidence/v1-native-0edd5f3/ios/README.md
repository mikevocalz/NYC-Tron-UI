# iOS native acceptance at 0edd5f3

[Native workflow 42847217952](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42847217952)
completed iOS job `129937839581` successfully on 2026-11-10. The PR head was
`0edd5f302e99877191ba9a412c5c060571a5f6c9`; the actual tested merge was
`e597d73757911e9a58005d577b3c2bf2496bd798`.

The installed app compiled and passed all eleven strict media checks. All
three OS-driven UI cases passed: Settings edit/save, Editor draft route
retention/save, and pointer touch/up. Each JUnit case executed with zero
failures or skips. No transport recovery was used.

## Keyboard correction executed

The original command traces confirm these mandatory iOS commands completed:

| Flow | Before action | Actual native action | After action |
| --- | --- | --- | --- |
| Settings | Keyboard `delete` key visible | Tap the static Workspace preferences heading | Keyboard `delete` key absent |
| Editor | Keyboard `delete` key visible | Press Enter | Keyboard `delete` key absent |

Settings then tapped Save settings and asserted the saved workspace header
and status. Editor switched routes, returned to the retained draft, tapped
Save cover, and asserted the retained preview and saved status. The platform
branches containing these commands executed; only their Android counterparts
were skipped, as intended on iOS.

Saved screenshots were visually inspected. Settings shows the saved workspace
name and closed keyboard. Editor shows the retained headline and saved status.
The pointer image shows one committed touch stroke and its final up event.
The light-theme screens have readable dark status-bar icons. The original
hierarchies independently satisfy the expected semantic labels and recorded
header/tab bounds inside the native safe host.

## Verified provenance

Downloaded artifact `13780478895`, `native-release-consumer-ios`, matched
GitHub's ZIP SHA-256:

`8678fcfcc68f64501ea63eed317dd8820b83883b4b7006c49ba4b1e64b3659e4`

All 226 entries in the archived app were independently checked against the
installed native manifest: relative paths, entry types, permission modes,
file sizes, SHA-256 values and literal symlink targets. The resulting manifest
identity matches both media and UI receipts:

`c75f836209847b3d829e966909a609ebb94915d65da68becaff9f2fcf454b2a6`

All original JUnit, hierarchy and screenshot hashes were verified. Consumer,
installed-package, media and UI source identities agree. `verification.json`
records those checks and maps every retained file to its original ZIP entry
and SHA-256. Reports, command receipts, hierarchies and screenshots are copied
byte for byte. The app binary and full device/compiler logs remain in the
original workflow artifact.

The passing build log identifies `/Applications/Xcode_26.6.app` and
`iphonesimulator26.5` on the workflow's `macos-latest` runner. This supplies no
claim about Xcode availability on a different macOS runner image.

This is simulator evidence. The physical-device and spoken-accessibility
manual gates listed in `ui/result.json` remain separate. Earlier failed
keyboard attempts and the runner-allocation failure retain their original
outcomes in the preceding evidence directories.
