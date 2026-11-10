# v1 release-gate evidence

Recorded 2026-11-10. This report covers distribution, installed consumers,
public API declarations and provenance. The twelve native/Forge integration
rows and their platform acceptance are tracked separately in
[V1-PLATFORM-CLOSURE.md](V1-PLATFORM-CLOSURE.md). No tag, release, npm publish or
blanket device-acceptance claim is created by this report.

## Observed CI and local results

| Gate | Observed result | Evidence and limit |
|---|---|---|
| Source, exports, types and Windows package checks | Passed for PR head `7b5b3deca420dcc9c7986ff93996f1f3a0a9b1df` | [CI run 42752976035](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42752976035); this run predates the new declaration-graph gate |
| Installed basic UI consumer | Passed: one Chromium test; one Expo-only test intentionally skipped | [Consumer run 42752975794](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42752975794), job `129620702408` |
| Installed Expo/web consumer | Passed: two Chromium tests | Same run, job `129620702182`; UI, core, panes and Expo controls came from produced tarballs |
| Native consumer packaging | Passed locally: ten NYC-Tron archives installed in a new npm project; strict app typecheck and Expo iOS/Android exports completed | iOS: 1,142 modules; Android: 1,144 modules; approximately 2.4 MB Hermes bundle each, including the generated reference MP4. These are bundling results, not native runtime results |
| Native compilation for the candidate | Running at this report's initial checkpoint | [Native run 42752975924](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42752975924); source job passed. Final native/runtime evidence belongs with the platform report |
| Workspace public declaration snapshot | Passed locally | 13 packages, 617 typed public subpaths, 3,306 reachable project declarations, 94 external type boundaries; TypeScript 6.0.3 |
| Isolated Windows public declaration snapshot | Passed locally after its own dependency install and build | 1 package, 1 typed public subpath, 4 reachable project declarations, 7 external type boundaries; TypeScript 5.9.3 / RN 0.85.3 |
| Tooling regressions | Passed locally | Eight declaration-graph regressions and five tarball-integrity/dependency-boundary regressions |

The consumer run is associated with PR head `7b5b3de`; GitHub checked out its
merge commit `1a5e0ad8033b51b9aefb16178158249a60291016`. Both consumers recorded
that exact checkout. The retained
[results, archive hashes and runtime pins](../evidence/v1-release-consumers-7b5b3de/results.json)
preserve this distinction. Captures were downloaded from the successful CI
artifacts; the basic narrow and Expo/web wide captures were visually inspected:
[basic wide](../evidence/v1-release-consumers-7b5b3de/basic-wide.png),
[basic narrow](../evidence/v1-release-consumers-7b5b3de/basic-narrow.png),
[Expo/web wide](../evidence/v1-release-consumers-7b5b3de/expo-web-wide.png),
[Expo/web narrow](../evidence/v1-release-consumers-7b5b3de/expo-web-narrow.png).
The fixtures use minimal app styling to exercise package consumption.

Local headless Chromium could not launch because the managed runtime denied
its process socket; its attempted download also returned an invalid archive.
No local browser pass is claimed. The browser evidence above is from GitHub's
Chromium run using Playwright 1.62.1 and Chrome Headless Shell 151.0.7922.34.

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

## Acceptance boundary

These results establish specific source, packaging, type and browser gates.
They do not establish VoiceOver/TalkBack/Narrator speech, physical pen pressure
or palm behavior, hardware folds, tracked headset poses, or successful native
media playback merely because a bundle or binary exists. Current runtime
reports, performance measurements and platform limitations must be read with
the complete [platform closure report](V1-PLATFORM-CLOSURE.md) before the stable
release decision. The user-approved twelve N rows remain active scope.
