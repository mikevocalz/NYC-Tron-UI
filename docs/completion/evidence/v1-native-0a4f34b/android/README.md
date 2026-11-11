# Android acceptance at 0a4f34b

[Native workflow 42841109908](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42841109908)
completed Android job `129916255586` successfully. PR head
`0a4f34b9334814f5bfd9b1568402a2a131faedd8` produced tested merge
`aa68e5ceb6875e02f73ee48dbdfa1c22641540d1`.

The original media result passes all eleven strict checks. The UI result
passes Settings edit/save, Editor draft route retention/save, pointer touch/up,
and pointer cancellation when Home removes Activity focus. Every JUnit case
executed with zero failures or skips. No transport recovery was used.
Android's system Back keyboard dismissal still executes inside the new
platform-specific flow branch.

The downloaded artifact `13777326268` matches GitHub's ZIP SHA-256:

`504dbd4039788c04c5aa4b1ddcf400b2d186347ed77c5b380ec31a8f520b4d7f`

The APK was independently streamed and hashed. Its result matches both native
media and UI receipts:

`9c31840f654d2fe9693ec49e95feae2f5bc587bc1a6c89a585fd15d533a71fba`

All JUnit, hierarchy and screenshot hashes match the UI result, and all
consumer/media/UI source identities agree. `verification.json` records those
checks and maps every retained file to its original ZIP entry and SHA-256.
Reports, command receipts, semantic trees and screenshots are copied byte for
byte. The APK and full device/driver logs are not committed.

Settings and Editor saved screenshots were visually inspected. They show the
saved workspace name, retained cover headline, saved status and phone bottom
navigation. They also reveal light Android status-bar icons against the light
reference background, which needs an explicit theme-aware status-bar owner.
The passing behavioral flows do not certify that contrast. These API 35
emulator results also do not establish physical pen/fold behavior or spoken
TalkBack output.
