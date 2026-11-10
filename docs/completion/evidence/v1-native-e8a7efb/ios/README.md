# iOS evidence at e8a7efb: media passed, UI failed

Original evidence from [native workflow 42834403759](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42834403759),
job `129892655905`, artifact `13774678339`. The PR head was
`e8a7efb9f0971746d01c68532540c65af502de9f`; the clean consumer tested merge
`0a041ca97b08958ba7c6577dbdee3d99382dbc38`.

The native app compiled and all eleven strict media checks passed. Settings UI
failed its initial navigation assertion during an evidenced cancelled Recap
touch. The existing one-time initial transport recovery retained that failure
and ran Settings again. The second attempt navigated, focused the field,
erased its prior value and entered `Native UI workspace`, then failed
`hideKeyboard`. Editor and pointer UI acceptance did not run after that failure.

The corrected source's native Done key is visible in the final screenshot.
Enabling scroll dismissal alone did not make this iOS UI run pass. The final
command receipt explicitly recommends a tap on static text as the workaround.
The follow-up source change and its geometry analysis are described in
[V1-NATIVE-KEYBOARD.md](../../../reports/V1-NATIVE-KEYBOARD.md).

## Retained originals

- `ui/settings/`: final failed JUnit report, driver commands, native hierarchy,
  and screenshot.
- `ui/initial-transport-failure/`: first failed report, commands, hierarchy,
  and screenshot. This remains failed evidence even though recovery was eligible.
- `ui/transport-recovery.json`: original narrow recovery decision, source and
  app identity, simulator evidence lines, and hashes of original artifacts.
- `ui/commands.jsonl`, `ui/failure.txt`, `ui/native-artifact.json`: original runner
  command receipt, terminal error, and complete app identity manifest.
- `media/`: original passing result and app identity manifest.
- `consumer.json`, `installed-packages.json`: original clean-install records.

`provenance.json` maps every retained file to its exact original ZIP entry and
SHA-256. The downloaded artifact ZIP hash was independently verified as
`a8f0ef06351605b971a076c2e4932ff4d045a9d620414c88a626174f84ade693`.
Consumer, installed-package, media and recovery source identities agree. UI
and media manifests are byte-identical and their SHA-256 matches both receipts.
Original first-attempt report and command hashes match the recovery record.
The archived app ZIP was also independently streamed and all 226 payload
entries matched the installed manifest: paths, entry types, permission modes,
file sizes and SHA-256 values, and literal symlink targets.

The app binary archive and full simulator/XCTest log bundles remain in the
original GitHub artifact. This repository subset contains reports, receipts,
hierarchies and screenshots only; it is not an app distribution or an iOS UI
acceptance claim.
