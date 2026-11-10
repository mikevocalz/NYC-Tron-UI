# v1.0.0 decisions

Each surface below is BUILD, STRIKE or DEFER. A deferral names its blocker so
nobody closes it with the wrong fix. Revisit a row when its condition changes.

Date recorded: 2026-11-09. Baseline: `0.1.0-alpha.4` plus PR #54.

## D1. Distribution: BUILD tarball releases, DEFER npm

v1.0.0 ships as GitHub Release tarballs with `SHA256SUMS`, installed by release
URL, the same channel as alpha.1 to alpha.4. Packages stay `private: true` and
`tooling/verify-packages.mjs` keeps enforcing that.

npm publishing is deferred. Blockers, all owner actions:

- Claim the `@nyc-tron` npm scope.
- Sign off on the license review in D2, including the MPL-2.0 `mediabunny`
  dependency of `@nyc-tron/platform-services`.
- Decide on a support policy for peer ranges (`react-native >=0.88.0` is
  uncapped today).

AGENTS.md rule 9 stays in force until those three are done.

## D2. License: BUILD MIT for NYC-Tron original code

Five packages already carry `MIT, Copyright (c) 2026 NYC-Tron UI contributors`.
v1 applies that text to the repo root and every package, and adds
`"license": "MIT"` to every manifest.

Ported code keeps its upstream license and header. `THIRD_PARTY_NOTICES.md`
lists every ported file (ArtCraft family: MIT or Apache-2.0 at the user's
option; Floating UI; AudioKit Controls; Skia; Vico by Maven reference).

`mediabunny` (MPL-2.0) is used unmodified as a runtime dependency. Its license
text ships in `packages/platform-services/third-party/mediabunny`. The owner
confirms that this satisfies MPL-2.0 for tarball distribution before the tag.

## D3. Scope: v1 is the library, with stated support tiers

v1.0.0 means the 329 library-scope components are implemented, exported and
covered by Node, mocked-render and Chromium tests, and that iOS SwiftUI and
Android Compose sources compile in CI.

It does not mean device-accepted. All 341 ledger rows keep
`acceptance: "unverified"` until evidence exists. The README and release notes
say so. Nothing in v1 changes that field without a recorded run.

| Tier | Contents | Evidence today |
|---|---|---|
| Supported | Web (React Native Web), iOS SwiftUI controls, Android Compose controls, shared TS packages | Node, Chromium, native compile in CI; two passing iOS and Android scenario runs for overlays |
| Experimental | `@nyc-tron/windows-fluent` and `windows-fluent-fabric` (RN 0.85 lane), native charts, native media decoding | Compiles on `windows-2025`; UIA smoke test; no Narrator, high-contrast or resize runs |
| Not included | AppKit/macOS adapter, multi-window native bridge, visionOS, Quest, PICO | No code or no proof |

The Windows adapter ships in lockstep with the same version number, because
`tooling/pack-release.mjs` requires one version per tag. It is labelled
experimental and cannot be installed alongside the RN 0.88 packages.

## Struck and deferred rows

| Item | Disposition | Condition to revisit |
|---|---|---|
| 12 N-rows (N-01, N-03, N-04, N-09, N-10, N-11, N-13, N-14, N-15, N-16, N-18, N-19) | DEFER | Engine and platform integration is owned by Forge #63; not library scope |
| Device acceptance for any row | DEFER | A physical device or emulator run is recorded in `docs/completion/evidence` |
| AppKit/macOS adapter (issue #4) | STRIKE for v1 | A macOS runner and an Apple desktop for sign-off |
| WinUI menus, popovers, tooltips (issue #4) | DEFER | Narrator and focus checks on a Windows machine with a desktop session |
| Native multi-window bridge (issue #4) | DEFER | Device run; the pure TypeScript lifecycle contract is in v1 |
| Skia and desktop chart renderers (issue #7) | DEFER | Rendering checks on Windows and macOS |
| Narrator, VoiceOver, TalkBack speech checks | DEFER | A screen reader on hardware |
| Foldable hinge runs, stylus and pen input | DEFER | A foldable Android device or Surface Duo; a stylus |
| iOS 27.1 `reservedRegions` runtime run | DEFER | An iOS 27.1 device or simulator |
| Performance budgets for 1,048,576 x 16,384 sheets | DEFER | Device benchmarking |
| npm publishing | DEFER | See D1 |
