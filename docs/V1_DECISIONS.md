# v1.0.0 decisions and release conditions

Updated 2026-11-10. This is a release candidate; package versions alone do not
mean that a v1 tag or release exists. The user approved completing all twelve
previously deferred N rows. That direction supersedes the 2026-11-09 blanket
scope deferral. Implementation ownership and recorded acceptance remain
separate.

## D1. Distribution: GitHub Release tarballs

The distribution channel remains fourteen GitHub Release tarballs with
`SHA256SUMS`, installed by immutable release URL. The thirteen workspace
packages are produced by `tooling/pack-release.mjs`. The fourteenth,
`@nyc-tron/windows-fluent-fabric`, is built and packed separately in its RNW
0.85 lane by `.github/workflows/release.yml`. Every distributable manifest is
`private: true`, has version `1.0.0`, declares `MIT`, and includes `LICENSE`.

The release job requires the source/package checks, browser suites, installed
tarball consumers, and iOS/Android native build jobs from the same candidate.
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
and in all fourteen packages. Ported code retains the upstream terms recorded
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
sign-off. The previously required owner distribution review must be recorded
before the stable tag; no such attestation is added or inferred by this change.

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

## D4. Conditions for the candidate

| Area | Required evidence |
|---|---|
| Release and native compilation | Reusable native iOS/Android jobs consume this candidate's tarballs; release waits for them |
| Clean consumers | A basic UI app without unrelated optional peers, an Expo/web app, and the native reference app install actual archives outside the checkout |
| Reference flows | Settings, library/detail, editor/inspector and media flows preserve authored state through adaptive layout |
| Native interaction and accessibility | Actual platform interaction reports, cancellation/lifecycle behavior, keyboard and assistive-technology checks for the claimed targets |
| Public API stability | Export-key snapshot, reachable declaration/type graph, ordered export conditions, and a separate RNW declaration snapshot |
| Performance | Reproducible measurements with fixture, runtime, hardware, sample count and limits; no inherited Exact speed claim |
| Documentation and distribution | Accurate candidate/support status, bundled licenses/notices, migration instructions, verified archive contents, and the recorded owner distribution review |

Commands, observed results and commit-specific CI links are in
[V1-RELEASE-GATES.md](completion/reports/V1-RELEASE-GATES.md). A green run on an
earlier commit is evidence for that commit, not approval for a later candidate.
