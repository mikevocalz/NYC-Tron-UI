# Android native acceptance at e8a7efb9

[Native workflow 42834403759](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42834403759)
completed its Android installed-consumer job `129892655235` successfully on
2026-11-10. The PR head was `e8a7efb9f0971746d01c68532540c65af502de9f`;
the actual tested merge was `0a041ca97b08958ba7c6577dbdee3d99382dbc38`.

The original [media result](media/result.json) passed all eleven strict decoder
checks. The original [UI result](ui/result.json) passed four OS-driven flows:
Settings edit/save, Editor draft retention/save, pointer touch/up, and pointer
cancellation when Home removes Activity focus. Every JUnit case executed with
zero failures or skips. No transport recovery was used. Settings and Editor
receipts include observed native header/tab bounds within the safe host.

These are Android API 35 emulator results with the pinned Maestro 2.12.1 driver.
They do not establish physical pen/fold behavior or spoken TalkBack output.

## Verified artifacts

Downloaded artifact `13773108615`, `native-release-consumer-android`, matched
GitHub's ZIP SHA-256:

`852358c7b2560064de29e14789a1ab2a173a83e3e21c33b729aeffd1705af9c9`

The APK bytes were independently streamed and rehashed after downloading. The
result matches both media and UI native-artifact receipts:

`13581f958cfc457b4644dcf485febd6230b125de8c20fe17df7bbd99bf2a0df8`

All original JUnit, hierarchy and screenshot hashes were verified against the
UI result. The consumer, media and UI source revisions also agree.
[Verification](verification.json) retains those checks and artifact identities.
Original report JSON/XML, command receipts, semantic trees and screenshots are
retained byte for byte. The APK and driver/device log bundles are not committed.

The Editor saved-state screenshot was visually inspected and shows the retained
headline, saved status and the expected phone navigation. The original failed
iOS keyboard evidence at the previous head remains in
[`v1-native-d6b2c81`](../../v1-native-d6b2c81/ios/ui/).
