# v1.0.0 decisions and release conditions

Updated 2026-11-10. This is a release candidate; package versions alone do not
mean that a v1 tag or release exists. The user approved completing all twelve
previously deferred N rows. That direction supersedes the 2026-11-09 blanket
scope deferral. Implementation ownership and recorded acceptance remain
separate.

## D1. Distribution: GitHub Release tarballs

The distribution channel is fifteen GitHub Release tarballs with
`SHA256SUMS`, installed by immutable release URL. The thirteen workspace
packages are produced by `tooling/pack-release.mjs`. The two desktop packages,
`@nyc-tron/windows-fluent-fabric` and `@nyc-tron/macos-appkit`, are built and
tested separately in their RNW 0.85 and Spark / Expo 55 lanes. The release
downloads the exact archives installed by those native consumer jobs and
verifies their checksums, package identities and candidate revision before
including them. It does not repack either archive after its native test.
Every distributable manifest is
`private: true`, has version `1.0.0`, declares `MIT`, and includes `LICENSE`.

The release job requires the source/package checks, browser suites, installed
tarball consumers, iOS/Android native build/runtime jobs, actual Windows native
compilation and UI Automation, AppKit native controls/window lifecycle, and reference captures/render measurements from
the same candidate.
It rejects mismatched package versions and an existing release instead of
replacing its assets. No tag or release has been created as part of this
candidate work.

npm distribution remains a separate owner decision: scope ownership, the
recorded distribution review in D2, and a policy for currently uncapped peer
ranges must be settled first. Tested runtime pins are documented in
[Support policy](SUPPORT.md); a broad peer range is not proof of support for
every matching runtime.

## D2. Licensing and provenance

MIT metadata and the original-code license are present at the repository root
and in all fifteen packages. Ported code retains the upstream terms recorded
in [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md), package notices, and
their accompanying license texts. The pack gate verifies declared notices and
license files are actually present in the produced archives. Exact is a design
reference; its Contract/Rust runtime is not copied into NYC-Tron.

`@nyc-tron/platform-services` imports unmodified `mediabunny` 1.65.2 under
MPL-2.0. Its package contains the license and a source-availability statement
with the exact npm archive, upstream commit, and integrity value. See
[the dependency notice](../packages/platform-services/THIRD_PARTY.md) and
[release evidence](completion/reports/V1-RELEASE-GATES.md#licensing-and-distribution-review).
These are verifiable packaging facts. They do not establish an owner distribution
sign-off. The previously required owner distribution review is tracked in
[distribution-review.json](completion/distribution-review.json) and remains
`pending`. Stable publication checks an actual comment by the repository owner
through GitHub's API, approving the exact version and SHA-256 of the produced
fifteen-archive `SHA256SUMS`. Changing a local status field cannot satisfy this
gate. The archives are retained as a CI artifact before the check, so they can
be reviewed even when stable publication is blocked. The
[release evidence report](completion/reports/V1-RELEASE-GATES.md#stable-publication-gate)
documents the record and approval statement; none is submitted or inferred here.

## D3. Scope: finish the complete component program with its proper owners

All 341 rows in the canonical component program are in the completion target.
The twelve rows below are active work, rather than outside-scope deferrals:

| Rows | Required capability | Implementation ownership |
|---|---|---|
| N-01, N-04 | Native pointer data; palm rejection and prediction boundaries | NYC-Tron native input and pure input contracts, with real device input evidence |
| N-03, N-09 | Tracked 6DoF and XR presentation | Muse/Forge platform owners; pinned source and runtime evidence |
| N-10, N-11 | Offline/autosave and collaboration | Forge document/session owners |
| N-13, N-14, N-15, N-16, N-18 | Scheduling, media cache, undo transactions, binary data and telemetry | Forge service owners and their integration evidence |
| N-19 | Actual media decoding and presentation lifecycle | NYC-Tron platform-services/native host plus Forge integration |

The complete per-row mapping, pinned external implementations, and remaining
platform evidence belong in
[V1-PLATFORM-CLOSURE.md](completion/reports/V1-PLATFORM-CLOSURE.md). Engine code
is not copied into the UI package to change an implementation count. The
canonical ledger is not rewritten by a release summary.

Source coverage does not establish acceptance on every required platform.
An `acceptance: "accepted"` change needs evidence for the claimed interaction,
host and runtime. Browser geometry tests, native compilation, simulator
interaction, physical pen/fold/headset input, and screen-reader speech are
different records. Previous blanket deferrals are not a reason to skip the
approved work, and a successful compile is not a replacement for its runtime
checks. Support claims remain bounded by [SUPPORT.md](SUPPORT.md) and the
candidate's actual evidence.

`tooling/release-readiness.mjs` enforces this boundary before stable publication:
every one of the immutable 341 rows must be `accepted`, and the component
validator requires completed implementation plus existing passed evidence on
all eight required platforms. Prerelease packaging can retain pending work and
the pending owner review. It does not promote either status or claim stable
readiness.

## D4. Conditions for the candidate

| Area | Required evidence |
|---|---|
| Release and native compilation | Reusable iOS/Android jobs consume this candidate's tarballs; release also waits for Windows native compilation/UIA, AppKit controls/window lifecycle, and reference captures/render measurements. Both desktop archives are preserved from the successful native consumer jobs. |
| Clean consumers | A basic UI app without unrelated optional peers, an Expo/web app, and the native reference app install actual archives outside the checkout |
| Reference flows | Settings, library/detail, editor/inspector and media flows preserve authored state through adaptive layout |
| Native interaction and accessibility | Actual platform interaction reports, cancellation/lifecycle behavior, keyboard and assistive-technology checks for the claimed targets |
| Public API stability | Export-key snapshot, reachable declaration/type graph, ordered export conditions, and separate RNW and AppKit declaration snapshots |
| Performance | Reproducible measurements with fixture, runtime, hardware, sample count and limits; no inherited Exact speed claim |
| Documentation and distribution | Accurate candidate/support status, bundled licenses/notices, migration instructions, verified archive contents, and the recorded owner distribution review |

Commands, observed results and commit-specific CI links are in
[V1-RELEASE-GATES.md](completion/reports/V1-RELEASE-GATES.md). A green run on an
earlier commit is evidence for that commit, not approval for a later candidate.

## D5. Desktop component scope (gate T4)

Decided 2026-11-12 on the repository owner's instruction to decide (BUILD / STRIKE / DEFER).

The 1.0.0 desktop component list may be narrower than the mobile and web
list. `@nyc-tron/ui` keeps its React Native `>=0.88` peer floor in 1.0.0.

| Item | Decision | Condition |
|---|---|---|
| Desktop list narrower than mobile/web | Accepted for 1.0.0 | The list is published as a support limit in [SUPPORT.md](SUPPORT.md) |
| Lower the `ui` floor for the desktop lanes (RNW 0.85.3, Spark / React Native 0.83.10) | Deferred to the first minor after 1.0.0 | Blocked because it changes a public peer range and needs test coverage on two older React Native lines |
| Components that fail measurement in a desktop lane | Struck from that lane's support list | Returns when the lane's host ships React Native `>=0.88`, or when a lane-specific floor is tested in that lane |

The component list comes from the T4 measurement in PR #69, taken on
2026-11-12 on the T1 dependency graph (`@nyc-tron/ui` archive sha256
`c3d0f5881c8db1b27bc425324ca4d142f2a11f21b4d7f99ca93ca1e3e88f0dc7`):

| Lane | Run | Supported | Struck | Not verified on desktop |
|---|---|---|---|---|
| macOS, Spark 0.0.3 (React Native 0.83.10) | [43171140883](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43171140883) | 272 of 421 components | 54 | 95 |
| Windows, RNW 0.85 (React Native 0.85.3) | [43171140885](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43171140885) | 268 of 421 components | 41 | 112 |

All 166 exports without components load on both lanes. Struck components
need an optional peer the lane does not provide (`react-native-gesture-handler`,
`react-native-skia`, `@expo/ui`, `expo-linear-gradient`,
`@tanstack/react-table`, `expo-drag-drop-content-view`, `uniwind`). Four
more failed only on Windows with an RNW integer conversion error; PR #69
fixes that in `PrecisionScrubber` (decision 4 below). Components that are
"not verified on desktop" also fail on the web reference with the harness's
synthesized props, so the run proves nothing about the lane (decision 3).
The named lists are in [SUPPORT.md](SUPPORT.md#desktop-support-list) and
`desktop-support.json`.

### Decisions on the T4 owner questions

Decided 2026-11-12 by the integrator (A0) on the owner's instruction to
decide (BUILD / STRIKE / DEFER). Implemented in PR #69.

1. **Existing Expo app install (conditional BUILD).** Expo SDK 58 pins
   `react-native-gesture-handler ~3.3.0`, and `@nyc-tron/ui`'s optional peer
   was `>=3.4.0 <4`, so `npm install` failed with `ERESOLVE` in an existing
   Expo 58 app. `ui` uses no API that exists only in 3.4: every symbol it
   imports is in 3.3.0 with the same declarations, and the 3.3.0 to 3.4.0
   declaration diff only adds things `ui` does not use. The optional peer
   becomes `>=3.3.0 <4`, held by the `gesture-handler-floor` workflow, which
   type-checks `ui` and runs the browser suite against the newest 3.3.x and
   installs the packed archives into the default Expo 58 template. If that
   lane fails, the range stays `>=3.4.0 <4` and existing Expo 58 apps run
   `npx expo install react-native-gesture-handler@^3.4.0` first.
   Owner confirmation: pending.
2. **Desktop install with the `>=0.88` floor kept (BUILD).** The Spark and
   React Native Windows lanes install `ui` with one `package.json` override
   scoped to its `react-native` peer,
   `"overrides": {"@nyc-tron/ui": {"react-native": "$react-native"}}`, never
   `--legacy-peer-deps`. It is documented with the label "the desktop lanes
   are below ui's React Native floor; only components on the lane's support
   list are supported". The install-paths workflow installs this way on both
   lanes and renders `Button`. Spark's Runner and `spark build --dev` modes
   were not run in CI.
   Owner confirmation: pending.
3. **Components the harness could not measure (DEFER, not STRIKE).** The 95
   macOS and 112 Windows components that throw with synthesized props on the
   web reference as well get a third status, "not verified on desktop",
   separate from struck. Each returns when it is measured with a
   per-component props fixture. They do not block 1.0.0, and they are not
   struck.
   Owner confirmation: pending.
4. **Windows `Loss of precision during arithmetic conversion: (__int64)`
   (BUILD, local fix).** `PrecisionScrubber` passed fractional
   `aria-valuemin`/`max`/`now`, which React Native parses as `int`; RNW's
   `folly::dynamic::asInt()` throws on 0.1. Off the web the scrubber now
   passes the numeric range only when all three are whole numbers. RNW run
   43182075677 mounts all four affected components. Other controls that pass
   `aria-value*` were not audited for fractional values.
   Owner confirmation: pending.

## D6. Platform tiering for 1.0.0 (gate T5)

Decided 2026-11-12 on the repository owner's instruction to decide (BUILD / STRIKE / DEFER).

1.0.0 tiers platform support. This amends the stable-gate scope in D3, which
requires every one of the 341 rows to be accepted on all eight platforms.

| Tier | Platforms and rows | Stable requirement |
|---|---|---|
| Tier 1 | Every row and platform that CI or a simulator can prove: iOS/iPadOS simulator, Android emulator, web, the macOS AppKit job, Windows UI Automation, visionOS simulator | Must be `accepted` before stable 1.0.0 |
| Tier 2 | Quest, PICO, and the rows that need physical hardware: pen and palm, fold postures, screen-reader speech, multi-display, performance on hardware | Ships documented as "not verified for 1.0.0" in [SUPPORT.md](SUPPORT.md); each row gets an owner device-session script |

A Tier 2 row returns to accepted status when a signed session receipt for
that row lands. Row counts per tier are pending the T5 automated wave and are
not recorded here.

`tooling/release-readiness.mjs` still enforces the D3 boundary (all rows
accepted on all eight platforms). Until it changes, the stable gate stays as
it is. T5 must change it to enforce Tier 1 only, in a separate reviewed pull
request. This record does not change the validator, its tests, or any row
status.

T6 and F9 owner approval comments are not decided here. Only the owner's own
GitHub comment on the exact version and checksum hash satisfies them.
