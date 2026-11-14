# T1 post-rc.2 graph refresh candidate — 2026-11-13

Base: `0e09d3be8263b3dbb2eab1a78e5dd66b83b68e44`. This is a new candidate,
not a replacement of the immutable rc.2 source, tag or archives. No component
acceptance, stable-readiness or owner distribution gate changes.

## Bump and hold disposition

| Package/lane | This candidate | Disposition |
|---|---|---|
| Expo principal 58 lane | 58.0.24 → 58.0.25 | Ten exact direct manifest pins; workspace lock regenerated. Replace only its exact existing release-age exception. Spark Expo 55 unchanged. |
| react-native-skia | 3.10.0 → 3.10.1 | Two development/example pins and workspace lock; optional peer `>=3.9.1 <4` unchanged. pnpm additionally generated the exact `react-native-skia@3.10.1` age exception under existing policy; no general age-policy change. |
| Zustand browser suites | 5.0.16 → 5.1.0 | Both isolated npm browser manifests and their corresponding locks must move together; aligns with principal workspace 5.1.0. |
| React / react-dom principal lane | 19.3.0 | Hold latest 19.3.1. Both Expo 58.0.24 and 58.0.25 bundled manifests still select 19.3.0 alongside RN 0.88.1; preserve existing renderer compatibility choice. |
| RN principal lane | 0.88.1; principal peer floor >=0.88.0 | Current selected stable latest. No floor/cap/API changes; existing separately declared compatibility exceptions remain intact. |
| Spark/AppKit | Spark 0.0.3, Expo 55.0.32, RN 0.83.10, React/react-dom 19.2.0, TS 5.9.3 | Preserve exact isolated host/adapter graph. Latest Spark metadata still requires the Expo 55/RN 0.83 cohort and bundles Nitro 0.37.0. Its optional RNW 0.83.2 is not the Windows lane. |
| RNW/Fabric | RNW 0.85.0, RN 0.85.3, React 19.2.3, TS ~5.9.3 | Latest RNW is 0.85.2; defer to a separate exact-peer/API/Windows build-and-host scope. No Windows pin changed here. |
| Mediabunny | 1.65.2 | Latest is 1.66.0; defer production media dependency/release-note/decoder/export review to its own scope. No media dependency or licensing policy change here. |
| Zustand desktop examples | 5.0.8 | Preserve separate desktop graphs for this slice; a later lane-specific refresh needs compatibility proof. Browser alignment does not authorize desktop graph unification. |
| react-native-svg | Optional icons peer >=15.0.0; lock resolves 15.16.1 | Already at selected latest; no new direct dependency or peer change. |
| react-native-webgpu | Not declared in inspected package manifests | Latest 0.21.4 does not justify adding a dependency. Skia's different transitive `react-native-webgpu-dawn@158.0.0` is retained. |
| Browser test tools | Playwright 1.62.1 in both suites; UI Tailwind/CLI 4.3.4 | Actual npm metadata reports latest Playwright 1.65.1 and Tailwind/CLI 4.3.5. Deferred to a separate browser-tool update and rendered-suite proof; no claim these suites are fully latest. |
| Toolchain | pnpm 12.18.0, workspace TS 7.0.2, compiler-API alias 6.0.2 | Selected latest unchanged. Desktop TS 5.9.3 remains a separate compatibility check. |
| Other selected principal pins | Expo UI 58.0.28; asset 58.0.21; file-system 58.0.13; gradient 58.0.4; gesture-handler 3.5.0; safe-area 5.11.1; Uniwind 1.13.2; Tailwind 4.3.5 | Current selected registry latest. Gesture-handler lower peer/floor tests remain intact; Expo's older bundled recommendation is not an instruction to downgrade the tested pin. |

Primary source reads: npm registry `/latest` responses for 23 selected packages
on November 13 local (2026-11-14 01:36 UTC), and publisher
[Expo 58.0.25 bundled modules](https://unpkg.com/expo@58.0.25/bundledNativeModules.json)
compared with `.24`. Selected metadata is not an exhaustive transitive audit.
The only bundled-module differences are calendar, contacts, dev-client, location
and sqlite patch recommendations; the checked principal host's direct modules
and RN/React choices remain unchanged.

## Commands and evidence status

Workspace lock regeneration completed using the existing Node-invoked pnpm
12.18.0 script, avoiding the local managed-shim ENOEXEC issue and tool bootstrap:

```sh
node /Users/mikevocalz/Library/pnpm/.tools/pnpm/12.18.0/node_modules/pnpm/bin/pnpm.mjs install --lockfile-only --ignore-scripts --no-frozen-lockfile --prefer-offline
```

Actual result: 17 workspace projects, 574 supply-chain entries verified, exit 0.
Both YAML documents in the lock were inspected; the package-manager/tooling
first document is unchanged. Main graph package identities replace only
`expo@58.0.24` and `react-native-skia@3.10.0`; contextual Expo peer snapshots
change accordingly. No node_modules/native toolchain installed.

Both browser commands completed with exit 0 after disk headroom was restored:

```sh
npm install --package-lock-only --ignore-scripts --no-audit --no-fund --prefer-offline
```

Run separately in `packages/ui/tests/browser` and
`packages/expo-controls/tests/browser`, using npm 12.2.1. Neither creates
node_modules. Both lock root specs and resolved Zustand packages are now 5.1.0.
A structural comparison confirms each npm lock changes only that root spec and
the Zustand package version/resolved/integrity. Publisher version-bound registry
integrities match all newly selected Expo, Skia and Zustand package records.

Actual outdated reads (exit 1 means reported entries):

```sh
node /Users/mikevocalz/Library/pnpm/.tools/pnpm/12.18.0/node_modules/pnpm/bin/pnpm.mjs outdated -r --format json
npm outdated --json
```

Workspace output reports four dependency-type groups for React/react-dom
19.3.0 → 19.3.1; retain the renderer hold. Each browser command runs in its own
suite. With no installed node_modules, npm omits `current` and lists missing
direct dependencies as well as updates: interpret `wanted` as the declared pin,
not an installed execution result. Noncurrent pins are React/react-dom, both
Playwright 1.62.1 → 1.65.1, and UI Tailwind/CLI 4.3.4 → 4.3.5. Other listed wanted
pins match latest. The selected primary-registry cross-check separately finds
Mediabunny 1.66.0 and isolated RNW 0.85.2; they remain explicitly deferred even
though the workspace command did not report them. Do not infer an exhaustive
latest graph from one command's output.

A second workspace `install --lockfile-only --ignore-scripts --frozen-lockfile`
passed all 574 policy entries and left the lock bytes unchanged. Focused Node
consumer-model/native-contract/transport/warmup tests: **36 pass, 0 fail/skip**.
Manifest scope comparison confirmed exactly ten Expo, two Skia and two browser
Zustand pin changes; all other fields and isolated desktop paths are unchanged.
`git diff --check` passed.

Raw command outputs and selected primary records are retained in
[the candidate evidence directory](../evidence/T1-post-rc2-20261113/), with
checkout paths sanitized to `<checkout>` in outdated output. The separate local
original logs remain retained. These are source/metadata checks, not native
acceptance receipts. The initial disk-guard interruption wrote neither browser
lock; it was superseded by the two successful normal lock generations.

Local builds, declaration/API checks, rendered browser and native execution:
**NOT RUN**. Fresh exact-candidate CI, including actual installed consumers,
rendered browser suites and native media/UI, is required. Independent R1 must
review the final exact head and actual CI before integration. Existing receipts
belong to their own source graphs; they cannot prove this candidate.

## Preserved contracts and guidance

No package public API/peer range, product source/state, native plugin/manifest,
window/orientation, owner gate, ledger status or dependency-lane isolation edits.
The published Expo upgrade guidance informs version alignment and fresh native
build requirements; generic migration/cache-clearing instructions do not
supersede the pinned graph or authorize unrelated navigation/config changes.
Testing-strategy/debugging and GitHub Actions guidance keep source/lock checks
separate from installed consumer, native and visual evidence. No local heavy
install/build or broad dependency update is part of this slice.
