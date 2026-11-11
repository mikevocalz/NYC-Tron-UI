# Windows native lifecycle acceptance at 0a4f34b

[Run 42841109661](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42841109661)
passed both jobs at PR head `0a4f34b9334814f5bfd9b1568402a2a131faedd8`.
The actual checkout was merge `aa68e5ceb6875e02f73ee48dbdfa1c22641540d1`;
native job `129916824833` completed successfully on November 10, 2026.

The job compiled the installed C++/WinRT package and real consumer executable,
deployed the packaged app, and exercised controlled navigation, two native
windows sharing one runtime/document owner, minimize/restore, an unsaved close
veto, an accepted saved close, and reopening the same document ID.
The original [native acceptance](native-acceptance.json) and
[tested package receipt](tested-package.json) preserve the seven check groups.

The adapter archive SHA-256 is
`a5c22ea5cfa8f936f1078257d3cd72b4df350e2aeece3326d577e36606f91c69`.
The receipt also binds the exact canonical core and Windows contract archives.
The original package archive was downloaded and successfully passed the release
merger against those same shared archives without repacking.

The downloaded tested-package ZIP matched GitHub's SHA-256
`2903b254f601fd6cb3f60f8186fed23ede96e5cec3e56d155b01231e628951ad`;
the original UIA evidence ZIP matched
`83d105ca9871c010737799f8bab92ab93d411844ca4146edf8987a38814c3c80`.
Every retained screenshot, UIA tree and result hash matches the native receipt.
[Verification](verification.json) records the source, artifact and job identities.

## Evidence limits

The executable hash was reported by the native runner. A complete executable
payload was not downloaded and independently rehashed for this checkpoint.
The original `04-native-document.png` and `05-close-veto.png` capture screen
pixels at the document's bounds while the main window occludes that rectangle.
They are retained unchanged. The passing UIA assertions establish secondary
window state; these two captures do not establish visible document content.
The follow-up capture helper requires the requested owned window to become the
actual foreground window with stable bounds before capturing it.

This checkpoint does not cover native desktop overlays or OS drag/drop; those
bindings and interaction cases are subsequent work. It does not establish
Narrator speech, physical display changes, device performance or all eight
platforms' component acceptance.
