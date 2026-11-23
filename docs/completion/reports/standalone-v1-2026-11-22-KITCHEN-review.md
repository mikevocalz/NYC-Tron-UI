# Independent review: T5 kitchen sink

Reviewer: `skill_discovery`; implementer: `argent_environment_inspector`.
Review date: 2026-11-23 UTC. Intended publication parent: `26742419`.
Skill: `knowledge-work-plugins/engineering` 1.2.0 standalone `code-review`.
Project no-ai-slop, state/layout rules and relevant Argent workflow/QA guidance
were read. No device interaction, app launch or native build was performed by
this reviewer; the separately running build was not changed or stopped.

Verdict: passed after the proof-constructor and documentation corrections
below. No outstanding critical or warning findings. This does not authorize
merge, release or owner stability approval.

## Scope

This review covers only `examples/kitchen-sink/`, `tooling/kitchen-sink/`,
`.github/workflows/kitchen-sink.yml`, the lockfile and the kitchen report.
The three UI accessibility source changes, browser regression files and their
report belong to the separately published prerequisite PR and are excluded.
The final isolated publication checkout was reviewed on the designated
prerequisite commit. The added Android QA recording, final test, report and
two pass logs are also included below.

## Findings

| Severity | Finding | Required disposition |
| --- | --- | --- |
| Warning, resolved | Native proof originally accepted version 2.12.10 as a substring of the expected 2.12.1 contract. | Exact trimmed observed-version equality is required; the near-match rejection regression passes. |
| Warning, resolved | Existing output could supply stale native screenshots to a new run. | Exclusive new output/stage directories and exactly one current-stage PNG are required. Stale-output and missing-new-image regressions pass. |
| Documentation gap, resolved | Mandatory developer profiles and concrete handoff details were missing. | The report now contains three task-based profiles and explicit layout, typography, palette, token, state, motion and responsive specifications. No interviews or measured usability are invented. |

The two constructor defects were confirmed together with a disposable synthetic
negative fixture: a stub process emitted version 2.12.10 and one SUCCESS JUnit
case per mode but generated no screenshots. Copied preexisting images were
accepted and a passed receipt declared version 2.12.1. This was deliberately a
proof-constructor test; no real device, build or native acceptance was involved.

The missing-index hardening recommendation was also implemented: preparation
requires the source-bound candidate index before writing the consumer directory.
Both missing and foreign indexes fail in regression tests.

## Source and workflow review

The app retains orientation `default` and all previous examples. State is a
per-instance vanilla Zustand store held in a ref, subscribed through selectors.
There is no new React useState. Component imports cover all five proposed
stable identities through root and direct aliases; labels remain explicitly
pending owner approval.

App-owned CSS supplies semantic light/dark colors and documented component
radius tokens. The contained rail/shell demonstrations explicitly choose
physical edges and text direction; they do not claim hardware-family detection
or change the consuming app's window contract. The source includes stable
fixture IDs, visible labels/errors, retained draft, disabled/loading controls
and named selected actions. Full APG arrows, native speech, font scaling and
manual contrast are not claimed.

Consumer preparation copies the example into a new directory and replaces only
its two workspace dependencies with copied private package archives. Archive
identity/version and digests are read from actual tarballs. Installed package
realpaths must remain inside the consumer node_modules; npm lockfile integrity
and vendor archive hashes are checked. The mandatory candidate index binds the same source revision, dirty flag,
version and archive records.

The workflow packs core/UI once and shares exactly those artifact bytes across
web, Android and iOS jobs. Each native job compiles the installed consumer,
installs that build on an ephemeral runner target and runs the declared flow.
Maestro installation uses the existing immutable official archive checksum.
JUnit executed-flow counts are distinguished from individual assertions.
The flow exercises both import modes and observes physical relative placement
through semantic selectors, without guessed screenshot coordinates.

The web proof checks actual rendered states, alias equivalence, keyboard
activation, retained state, narrow layout, selected theme treatment, changed
palette, runtime errors and four axe cases. Unit/model proof resolves UI imports
from installed packages and labels its RN shim/SSR runner rather than claiming
native rendering. Installed consumer typechecking has a separate receipt.
The receipt paths and hashes bind logs, structured results and screenshots;
sourceDirty true results remain development evidence only.

## Independent verification

```text
$ node --test tooling/kitchen-sink/proof.test.mjs packages/ui/tests/contracts.test.mjs tooling/tests/native-ui-acceptance.test.mjs
tests 32
pass 32
fail 0
skipped 0

$ git diff --check
[no output; exit 0]
```

This final run occurred in the isolated publication checkout, not the writer's
mixed source tree. Nine kitchen guards cover archive identity/digest, duplicate
archives, foreign and missing source indexes, wrong driver version, stale
output, missing current-stage screenshot and missing/failed/skipped JUnit.
The sixteen existing component contracts and seven shared native-evidence
checks also pass. Synthetic fixtures test rejection only and are not native
acceptance evidence.

The writer's installed-archive 72 unit/model assertions, 84 web assertions,
four zero-violation axe cases and declaration success are attributed to its
report; this reviewer did not repeat the browser or build runs. Local evidence
is explicitly sourceDirty true. Full clean-runner native collector proof and hosted CI for the new slice are
NOT RUN by this reviewer; the focused recorded Android run below is separate. Automated axe does not imply full WCAG AA
or screen-reader conformance.

## Screen critique and handoff review

| Finding | Severity | Observed disposition |
| --- | --- | --- |
| Theme palette changed while selected mode remained System | Major | Zustand selection and the native Appearance guard are corrected; the web runner checks selected treatment and palette independently. |
| Loading/selection/field descriptions lacked appropriate web semantics | Major | Separate prerequisite UI PR supplies the fix; kitchen imports it from its publication parent, without republishing those source changes. |
| Native proof could accept wrong-version or stale artifacts | Major | Exact version, fresh stage ownership and fail-closed negative tests now guard receipt construction. |

The implemented system/native type choice keeps examples comparable to host
controls. The 30/24-unit heading hierarchy and grouped live states make it
possible to compare controls without navigating away from a draft. A capped
960-unit column, wrapping rows and a 320-unit case bound density. Application
semantic colors let the same behavior be inspected across two palettes without
imposing a library theme. These are review inferences from the delivered
implementation, not participant findings or a full contrast compliance audit.

## Recorded Android QA review

Read the raw first recording, polished test, QA report and both complete pass
logs. The final standalone path launches the app, proves direct imports and a
zero counter, increments the counter, switches to root imports while retaining
that count, selects Light and visits the Card, TextField, rail and shell groups.
All expectations have hard selector checks. The five recorded element-seeking
swipes were converted to goal-based scroll-to directives, as the Argent
live-authoring reference permits. Recorded waits retain their selector maps;
idle after launch is an allowed polish insertion. There are no raw coordinates
or fixed sleeps in the final test and no snapshot-baseline promotion.

Both logs report 24 passed, zero failed/errored/skipped, using the unchanged
29-step test. The reported service reset before pass one, same runner and
consecutive passes are attributed to the lead. The idle warning is disclosed
and corroborated by the intentionally always-loading Button fixture in source;
following import/counter checks provide concrete readiness. Screenshots are
human inspection only. This reviewer did not perform or repeat device actions.

The QA report binds the actual ARM64/API36 development build and APK hash. It
also binds the two dirty-source archive hashes and explicitly excludes release
eligibility, complete state coverage in both modes, iOS and screen-reader
speech. The focused Android demonstration does not replace clean-runner T3
receipts or owner approval.

## Final scope and artifact binding

Only the kitchen slice and its Android QA artifacts are included. The separate
UI source/test files remain excluded. All previous examples and public package
APIs remain intact. A final publishable-file scan found no machine-specific
private paths or missing local Markdown targets. The artifact manifest below
binds the reviewed files; later review-attribution/PR-link metadata does not
establish additional runtime evidence.


```text
197af3119e0fca056d94babc6b7a678650c2d68cb7a0f31996054875730743ef  .argent/e2e/qa-tron-android-imports-state.yaml
ff314b89c13051c6032151b715a9f18c1401b9840b810e515ecd5be0fdfdcf97  .github/workflows/kitchen-sink.yml
e2cffe4b87862648aacecc1bb01270ebb596400ce174efb900b708c0539e841b  docs/completion/reports/standalone-v1-2026-11-22-KITCHEN.md
2d0fbbed72f506201b5d83a1713e01955d4a9b064a75a7f2f57c83638f9002d1  docs/completion/reports/standalone-v1-2026-11-23-ANDROID-QA.md
5cb7ecf7ef6b580b6e0ce1c6ce71f1040ed5c0ccdc7b76db7e36230d6e05e4b5  docs/completion/reports/standalone-v1-2026-11-23-android-first-recording.yaml
c5cbf8ce7b995d476c4603792c64817a4a9a8e710beba55ad8da8b777b69e7bb  docs/completion/reports/standalone-v1-2026-11-23-android-pass1.txt
3bffc10800e8b3e5fb97a594d4981d1c56b309988b174e9ace97a570d12bac4b  docs/completion/reports/standalone-v1-2026-11-23-android-pass2.txt
373ad277b2f39a7fd9d7b9ac404a5ff5fe0416580af7c1274da35168cb823197  examples/kitchen-sink/App.tsx
4b82dc3911afd9306d18eb28b9ec44d45c925e6841a1e0b813f10d3a10143ad8  examples/kitchen-sink/README.md
f423d4481a96e664935022a562d7d06efc5e12d651e44e0257b40f2d09450ff6  examples/kitchen-sink/app.json
10a3aa138f56b4b76c386ffa6cddd63f869dbe57367926454f6ea7ad557dd2a4  examples/kitchen-sink/assets/icon.png
da5bf71d48cf909584a01c80b445f730507068f5b34c920f352e2bfcf0315e4c  examples/kitchen-sink/css.d.ts
a7c56a290be0b7ead6229e3937e113553101c376ae8798f58e7082428585278d  examples/kitchen-sink/fixtures.tsx
b516a5c2c70227567dc5dab3166096020f77deb3eb62df57e51131e222cf9798  examples/kitchen-sink/global.css
af10e01cf5fa6d399a83829926cc80d935c1dca8fb01313ab7cb54aab84c028b  examples/kitchen-sink/index.js
3a65bb663a605c56d079208bc48e1efbe9bef4ec0dbe1f2347d1791e3b9a7795  examples/kitchen-sink/metro.config.js
60558a019e7298d77183c0edac07cc0ecc528f8f1bfd3ac0373aa0d8b4ba487f  examples/kitchen-sink/model.ts
8e2ed4f86935a7618da2dbb91267ab204a43d7d379bcd0ee05806ff0854505b0  examples/kitchen-sink/package.json
32b1876837b0811013efbc1122e552f89630ddfce455acb733a54b1ce59d9a46  examples/kitchen-sink/tsconfig.json
32c94b4b1c2f576ff04d0ca02e0dfe5bc8e09de4ef6a9632f780d60513db87bd  examples/kitchen-sink/uniwind-types.d.ts
16982777e0b2b2328f118f114a3d42f743bfcb404728b7e6fc3bb8a1238abd39  pnpm-lock.yaml
704e540487029a94ce8af29a2541b0447f137752e95f211d94060819dda2774e  tooling/kitchen-sink/archive-index.mjs
38482662c7ce1bb67e13d64fc895b324323fbdf1ec2f352d97cfe4d0b9ee4a10  tooling/kitchen-sink/contracts.mjs
3de747bb6d2866a12b4a2758173040c8b2ad40f38893b16257bcf6c85f337285  tooling/kitchen-sink/native-flow.mjs
6e9a10a90db2d08590c747598affab032c6439d4b4f392be302fe6ae8910e8d6  tooling/kitchen-sink/native-proof.mjs
f250e9de7dfd40f7587e804a0b612e95fa858cdb5fffe616df09426db2053ee1  tooling/kitchen-sink/prepare-consumer.mjs
63cf0ddd2eb6cc73ecf6fbc3d75473fffc844a4b7ee2af8ba32d3bf803bf7f48  tooling/kitchen-sink/proof.test.mjs
07b477f1cb1d8c7be0d7b42fce99a52a1e4f2eee5ae04cd26b53f30d4a395cec  tooling/kitchen-sink/unit-fixture.tsx
bcfe476c8617479c2f19613ac27f5359b0ae2ad2f3cc5f829eea40c1a0f36167  tooling/kitchen-sink/unit-proof.mjs
1f3a85a197aa03b994025ce36b5f57038006dc95291f5a1413b053bf66d200f2  tooling/kitchen-sink/web-proof.mjs
```
