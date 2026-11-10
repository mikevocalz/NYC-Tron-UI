# v1 release-gate evidence

Recorded 2026-11-10. This report covers distribution, installed consumers,
public API declarations and provenance. The twelve native/Forge integration
rows and their platform acceptance are tracked separately in
[V1-PLATFORM-CLOSURE.md](V1-PLATFORM-CLOSURE.md). No tag, release, npm publish or
blanket device-acceptance claim is created by this report.

## Observed CI and local results

| Gate | Observed result | Evidence and limit |
|---|---|---|
| Source, exports, types and package checks | Passed for PR head `e2b65dd5e9288b193b6bfd807d6003b184b8c642`; 1,173 tests on Windows | [CI run 42770189328](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42770189328), including the declaration-graph gate |
| Installed basic UI consumer | Passed: one Chromium test; one Expo-only test intentionally skipped | [Consumer run 42770189171](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42770189171), job `129675906719`; [original result](../evidence/v1-automated-e2b65dd5/consumers/basic/results.json) |
| Installed Expo/web consumer | Passed: two Chromium tests | Same run, job `129675906970`; [original result](../evidence/v1-automated-e2b65dd5/consumers/expo/results.json); UI, core, panes and Expo controls came from produced tarballs |
| Native consumer packaging | Passed locally: ten NYC-Tron archives installed in a new npm project; strict app typecheck and Expo iOS/Android exports completed | iOS: 1,142 modules; Android: 1,144 modules; approximately 2.4 MB Hermes bundle each, including the generated reference MP4. These are bundling results, not native runtime results |
| Native iOS installed consumer | Compiled and passed all eleven strict decoder checks at `e2b65dd5`; the UI flow failed when the simulator cancelled its first Settings contact | [Native run 42770189195](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42770189195), job `129675906574`; [original reports and payload verification](../evidence/v1-native-e2b65dd5/ios/provenance.json). The whole job remains failed |
| Native Android installed consumer | Compiled and passed all eleven strict decoder checks at `e2b65dd5`; Maestro's initial app launch returned `device offline` before any UI assertion | Same run, job `129675906933`; [original reports and APK verification](../evidence/v1-native-e2b65dd5/android/provenance.json). The whole job remains failed |
| Windows native consumer | Actual C++ consumer build, registration and keyboard UI Automation passed at head `e2b65dd5` | [WinUI run 42770189124](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42770189124); [retained capture](../evidence/v1-automated-e2b65dd5/windows/03-accepted.png). This does not establish Narrator speech or physical-device input |
| Workspace public declaration snapshot | Passed locally for the follow-up's shared window-model extraction | 13 packages, 618 typed public subpaths, 3,306 reachable project declarations, 94 external type boundaries; TypeScript 6.0.3. The new core subpath is additive; the existing panes subpath re-exports the same declarations |
| Isolated Windows public declaration snapshot | Passed locally after its own dependency install and build | 1 package, 1 typed public subpath, 4 reachable project declarations, 7 external type boundaries; TypeScript 5.9.3 / RN 0.85.3 |
| Tooling regressions | Passed locally | Eight declaration-graph regressions and five tarball-integrity/dependency-boundary regressions |

The retained installed-consumer captures below are associated with PR head `7b5b3de`; GitHub checked out its
merge commit `1a5e0ad8033b51b9aefb16178158249a60291016`. Both consumers recorded
that exact checkout. The retained
[results, archive hashes and runtime pins](../evidence/v1-release-consumers-7b5b3de/results.json)
preserve this distinction. Captures were downloaded from the successful CI
artifacts; the basic narrow and Expo/web wide captures were visually inspected:
[basic wide](../evidence/v1-release-consumers-7b5b3de/basic-wide.png),
[basic narrow](../evidence/v1-release-consumers-7b5b3de/basic-narrow.png),
[Expo/web wide](../evidence/v1-release-consumers-7b5b3de/expo-web-wide.png),
[Expo/web narrow](../evidence/v1-release-consumers-7b5b3de/expo-web-narrow.png).
The fixtures use minimal app styling to exercise package consumption. The
[complete installed-consumer rerun](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42765514145)
also passed at head `7aec1ec1`; the older retained images remain labeled with the
revision that produced them.

Local headless Chromium could not launch because the managed runtime denied
its process socket; its attempted download also returned an invalid archive.
No local browser pass is claimed. The browser evidence above is from GitHub's
Chromium run using Playwright 1.62.1 and Chrome Headless Shell 151.0.7922.34.

## Forge service runtime

The final Forge implementation/driver candidate `f5469d03` passed actual iOS and
Android runtime in [run 42765520077](https://github.com/mikevocalz/nitro-forge/actions/runs/42765520077).
Original [iOS](../evidence/v1-forge-f5469d0/ios/provenance.json) and
[Android](../evidence/v1-forge-f5469d0/android/provenance.json) receipts, process
identities, complete payload manifests and artifact hashes are retained here.
Each platform passed all fifteen final checks after a genuine process restart,
including MMKV/Yjs and all eleven engine snapshots. These are service/runtime
results for that exact Forge commit, separate from NYC-Tron's native UI gate.

## Verified decoder checkpoint and UI transport follow-up

At head `e2b65dd5`, all six nonmobile workflows passed. The
[retained CI record](../evidence/v1-automated-e2b65dd5/nonmobile/ci.json) includes
686 browser instrument cases, 29 reference cases plus three model tests,
installed consumers and the actual WinUI executable/UI Automation run. The
reference images were downloaded again and match the delivered images byte for
byte. Their current artifact identity and render measurements are retained.

Both native decoders passed the unchanged eleven checks in run `42770189195`:
24,000 PCM frames, 8,000 downsampled frames, 48,000 upsampled frames, 32,000
full-interval frames and 4,000 tail frames; the presentation index has forty
entries. Original receipts and native payload manifests are preserved above.
The Android APK and complete iOS app payload were independently rehashed from
the verified downloaded archives and match the runtime identities.

The UI failures are separately recorded. Android lost its ADB transport during
Maestro's initial launch command, before an app assertion. iOS's recorded
Settings contact was cancelled by the simulator's Recap registration race;
the [original log lines and timestamps](../evidence/v1-native-e2b65dd5/ios/ui/delivery-evidence.json)
bind the unknown sender and nonempty cancelled contact to that tap and app.
The actual iPhone 17 Pro/iOS 26.5 host has correct safe-area header/tab bounds,
and the previous SwiftUI raw-text error is absent. No successful Settings,
Editor or pointer result is inferred from those failed attempts.

The follow-up permits one transport recovery only when those initial-command
conditions are proven. It preserves every original failed driver artifact and
reruns the entire unchanged Settings flow. Any second failure, ordinary
assertion failure or later interaction remains final. The
[native UI guide](../../../tooling/native/UI_ACCEPTANCE.md) defines the limits.
Fresh native execution remains required. Local full verification passed
1,180 tests with no failures/skips, the API and canonical-roster gates, thirteen
workspace packs and sixteen clean consumer imports. The isolated Windows
archive was retained and checked, giving fourteen reviewable archives.

The same follow-up moves the existing pure window model into peer-free
`@nyc-tron/core/window-lifecycle`, retaining the panes compatibility export.
Its behavior is unchanged and all thirty-nine lifecycle tests pass. This lets
isolated native hosts share one lifecycle contract without adopting an
incompatible renderer peer. The AppKit and Windows host implementations still
require their own source review and native results before support is claimed.

## Corrections leading to `e2b65dd5`

The `7aec1ec1` source gate passed 1,169 Windows tests with zero failures/skips,
and all six source/browser/consumer/WinUI workflows passed. Its actual Android
Settings and Editor flows each executed and passed, including native labels,
screenshots and observed safe-host geometry. The complete native workflow
remained failed because the later pointer and media checks failed; no partial
result is represented as a whole-job pass.

The `e2b65dd5` candidate corrected those findings:

- A newly selected Android audio extractor stays at its original beginning when
  preroll reaches zero, preserving the fixture's negative-PTS AAC priming packet
  for Codec2's existing delay trim. No output timestamps or expected counts change.
- SwiftUI Slider labels use actual SwiftUI Text children, matching the pinned
  Expo 58 Slot contract. The old raw string caused a real native LogBox.
- The pointer page places live feedback above its canvas and allows the remaining
  controls to scroll, preserving the actual touch/cancel assertions.
- Native runners first consume the actual Metro JavaScript bundle response with
  bounded time/bytes and retained status/hash metadata. A running `/status`
  endpoint alone had allowed cold compilation to consume the decoder's receipt
  deadline; the captured iOS app was still at `Bundling 76%...`. The native receipt
  deadline and decoder assertions remain unchanged after this preparation step.

The decoder corrections passed in the fresh `e2b65dd5` run recorded above.
Its complete UI flow still failed at test input delivery. Complete platform
acceptance, native host adapters, physical input/speech/performance and owner
review remain bounded by [Support](../../SUPPORT.md) and the release conditions.

## What the installed-consumer gate proves

[`consumer-release.mjs`](../../../tooling/consumer-release.mjs) verifies each
archive against `SHA256SUMS`, prepares a new directory outside the repository,
and installs `file:` tarballs with the existing exact runtime pins. Missing
NYC-Tron artifacts fail instead of falling back to npm. The RNW adapter is
rejected from the Expo dependency lane. Installed versions and locations are
recorded, and the browser bundle must resolve only inside the new app and use
the installed UI distribution.

The basic consumer installs UI without core, Expo, Expo UI, Skia, gesture
handler, TanStack Table, drag/drop content view, linear-gradient or Uniwind.
Those absences are asserted after installation. Its form saves a trimmed name,
rejects an empty value without overwriting saved data, and retains the original
focused input and draft at widths 1280, 600, 320 and 1024. It also checks for
horizontal overflow. The Expo/web consumer exercises the real browser picker,
selection callback, appearance state and adaptive master/detail pane behavior.

Native jobs copy the authored reference screens and assets into their clean
consumer, use installed package CSS sources, run Expo export and native
prebuild, and compile the resulting iOS/Android host. They retain package
hashes, the generated npm lockfile and acceptance-build artifacts. Release
depends on these reusable jobs through relative workflow paths, so its checks
run at the selected release candidate. See
[`release.yml`](../../../.github/workflows/release.yml),
[`release-consumer.yml`](../../../.github/workflows/release-consumer.yml), and
[`native-controls-port.yml`](../../../.github/workflows/native-controls-port.yml).

## Public API gate

[`api-signatures.mjs`](../../../tooling/api-signatures.mjs) follows TypeScript
symbols from every published declaration target. It records exported aliases,
normalized declarations, public props, callbacks, return types, overload order,
and all reachable project types, including private helpers exposed through a
public type. Unused private helpers are excluded. It also records the ordered
export-condition maps, so moving an adapter between browser and native
conditions cannot silently pass.

External libraries form explicit boundaries with their installed package
version, package-relative declaration path, symbol and directly referenced
declaration. The whole React/DOM dependency tree is not presented as NYC-Tron
source. Missing named or inline-import types fail collection. Absolute install
paths are excluded; a relocation regression verifies this. Snapshot drift
fails the normal check and never rewrites its baseline.

Run from the repository root:

```sh
corepack pnpm build
node tooling/api-surface.mjs
node tooling/api-signatures.mjs
node --test tooling/tests/api-signatures.test.mjs
```

After reviewing an intentional public change, update the workspace baseline
explicitly with `node tooling/api-signatures.mjs --write`. Review the resulting
[`api-signatures.json`](../../api-signatures.json) diff for required props,
unions, callbacks, generics and return values; this gate detects changes and
does not decide their semver compatibility automatically. An export-key change
also needs the existing explicit `api-surface.mjs --update` workflow.

The fourteenth package has an isolated baseline and uses its own installed
compiler, preserving the RNW 0.85 / TypeScript 5.9 lane:

```sh
npm --prefix packages/windows-fluent/rnw-fabric install --package-lock=false --no-audit --no-fund
npm --prefix packages/windows-fluent/rnw-fabric run build
node tooling/api-signatures.mjs --package packages/windows-fluent/rnw-fabric --snapshot docs/api-signatures-windows.json
```

Append `--write` to the last command only for a reviewed update to
[`api-signatures-windows.json`](../../api-signatures-windows.json). The isolated
Windows workflow and the release's Windows pack step both run this check.
The metadata export `./package.json` is not a typed component subpath.

## Licensing and distribution review

The repository and all fourteen distributable packages carry the original-code
MIT license. Each package is `private: true`, has version `1.0.0`, declares
`license: "MIT"`, and includes `LICENSE` in its `files` list. This inventory was
checked directly, including the nested Windows package. The thirteen workspace
archives were produced successfully with the pack gate's notice, license,
declaration, compiled-export and workspace-specifier checks.

The Windows Fabric adapter is intentionally different: its archive includes
typed `src/` for native codegen as well as compiled `dist/`. It is packed in the
separate RNW lane. README and release notes now describe this exception and the
different notice locations accurately; `pnpm pack:release` alone produces the
thirteen workspace archives, not the nested Windows package.

The [root provenance inventory](../../../THIRD_PARTY_NOTICES.md) records
NYC-MON/NeonBlade, ArtCraft-family ports, Floating UI, AudioKit, optional Skia,
Vico, Mediabunny and the RNW sample pattern. Existing upstream license texts are
retained. No Exact source/runtime or external product artwork was copied for
the native-feel reference.

Mediabunny 1.65.2 remains an unmodified dependency. Its MPL-2.0 text is present
at `packages/platform-services/third-party/mediabunny/LICENSE`; the
[package notice](../../../packages/platform-services/THIRD_PARTY.md) identifies
the exact source archive, upstream commit and SHA512 integrity. Mozilla's
[MPL 2.0 sections 3.1–3.4](https://www.mozilla.org/en-US/MPL/2.0/) and
[distribution FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/)
are the primary references for covered source availability and retained
notices. The inventory and pack checks do not constitute an owner compliance
attestation. The previously documented owner distribution-review requirement
remains in [D2](../../V1_DECISIONS.md#d2-licensing-and-provenance) until an actual
record is provided; none was invented here.

## Native UI interaction gate

The required native jobs now run the built clean-tarball app through pinned
official Maestro 2.12.1. Settings editing/save and Editor draft retention/save
use actual OS taps, text input and scrolling. A separate native pointer entry
requires one real touch/up stroke; Android additionally verifies an active
touch is cancelled when Home removes app focus. This is separate from the
media decoder's runtime receipt.

The runner retains JUnit, native accessibility trees, screenshots, command and
Metro logs, complete native artifact identity, installed archive hashes, source
revision and the tool's verified release SHA-256. iOS identity hashes a sorted
manifest of the entire app payload, including the debug dylib and frameworks;
the launcher hash is recorded separately. Android identity hashes the APK bytes.
The manifest is saved before installation, including when a run fails. It rejects empty, skipped or failed reports,
missing semantic labels, missing screenshots and stale output directories.
Media and UI run independently against the same built app, and either failure
keeps the native job red. Both native jobs upload the evidence even on failure. The
[native UI gate guide](../../../tooling/native/UI_ACCEPTANCE.md) records the
pinned tool/source, commands and exact flows.

Focused artifact/evidence/media, bundle preparation and native adapter regressions
passed locally, along with native example typechecking and Maestro's actual
parsing of all four flow files.
Settings and Editor now require observed OS header/tab bounds to lie within the
measured safe-content host; the regression uses the actual failed iOS geometry. The local
driver found no connected devices; that result is not native interaction
acceptance. The candidate's simulator jobs must produce their own reports.
Physical pen/palm behavior, spoken VoiceOver/TalkBack output and active iOS
touch cancellation remain separately recorded device checks.

## Stable publication gate

The release now requires the reusable actual Windows C++/WinRT compile and UI
Automation workflow, in addition to the generic Windows package lane. It also
requires the reference browser workflow's authored flows, screenshots and
render measurements. These are required jobs on the release candidate itself;
older green runs do not satisfy them. This wiring is separate from a claim that
the new candidate has already passed those native jobs.

After building all fourteen archives, the release uploads
`release-candidate-v<version>` with every `.tgz` and `SHA256SUMS`. It then runs
[`release-readiness.mjs`](../../../tooling/release-readiness.mjs). The retained
archives remain reviewable if stable publication is blocked. A separate
`release-readiness-v<version>` artifact records the decision and blockers.

Stable publication requires both conditions:

1. All 341 canonical rows are accepted. The existing component validator still
   requires completed local or pinned external implementation and an existing
   passed evidence reference for each of the eight required platforms. The gate
   never writes acceptance statuses.
2. The owner distribution review in
   [`distribution-review.json`](../distribution-review.json) is approved for
   this version and this exact fourteen-archive checksum manifest. The gate
   hashes the actual archives, checks the complete inventory and version, then
   reads the linked comment through GitHub's API. The response must identify
   `mikevocalz` as the repository owner and contain the exact approval statement.
   A pending record, missing author/evidence, different hashes, deleted comment
   or unavailable API cannot authorize stable publication.

The tracked review remains `pending`. When the owner has reviewed the retained
archives and their included notices, the comment body must contain exactly:

```text
NYC-Tron distribution approval
Version: 1.0.0
SHA256SUMS-SHA256: <sha256 of the exact SHA256SUMS file>
I approve distribution of these NYC-Tron release archives with their included licenses and source notices.
```

The reviewed record can then set `status: "approved"` and name
`approval.reviewer`, `approval.manifestSha256`, and `approval.commentUrl` (the
owner's `https://github.com/mikevocalz/NYC-Tron-UI/pull/<number>#issuecomment-<id>`
URL). The gate performs a read-only
[GitHub comment lookup](https://docs.github.com/en/rest/issues/comments#get-an-issue-comment);
it never submits an approval comment. Using an owner comment also works when
the owner authored the PR and cannot approve their own pull-request review.

For a local readiness check:

```sh
node tooling/release-readiness.mjs --version 1.0.0-rc.1
node tooling/release-readiness.mjs --version 1.0.0 --artifacts /path/to/fourteen-archive-candidate
node --test tooling/tests/release-readiness.test.mjs
```

The first command validates the canonical scope and tracked review while
allowing candidate work to remain pending. The second is expected to block
today: the platform ledger is unverified and no owner approval has been
recorded. Packing a candidate does not promote it to stable or change any row.
Nine regression tests cover forged approval records, wrong owner/statement,
missing platform evidence, altered archives, API failure, immutable statuses,
and release job dependencies/artifact ordering.

## Acceptance boundary

These results establish specific source, packaging, type and browser gates.
They do not establish VoiceOver/TalkBack/Narrator speech, physical pen pressure
or palm behavior, hardware folds, tracked headset poses, or successful native
media playback merely because a bundle or binary exists. Current runtime
reports, performance measurements and platform limitations must be read with
the complete [platform closure report](V1-PLATFORM-CLOSURE.md) before the stable
release decision. The user-approved twelve N rows remain active scope.
