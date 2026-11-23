# Independent review: kitchen proof stages and iOS toolchain follow-up

Reviewer: `skill_discovery`; implementation: `argent_environment_inspector` follow-up coordinated
by the lead; `tron_gate` specified the consuming T3 evidence contract. Reviewed four applied files independently of their author:
kitchen workflow and unit, web and native proof constructors.
Skill: `knowledge-work-plugins/engineering` 1.2.0 standalone code-review.
Date: 2026-11-23 UTC. Verdict: passed; no outstanding blocking findings.

The iOS job now selects the repository's existing Xcode 26.2 toolchain contract,
also used by install-paths and AppKit workflows. It prints actual Xcode/Swift
versions and fails early unless the expected Xcode and Swift 6.2-or-later minor
are selected. This addresses the lead-reported default-toolchain compiler
failure. This reviewer did not rerun hosted iOS or verify runner installation;
the retry's actual result remains separate evidence.

Raw structured results now bind their execution category: unit/exports share
the actual SSR/model result, declarations have their own category and a
TypeScript runner name, web/accessibility share the real Playwright/axe result,
and native results identify their actual selected platform. This matches the
T3 checks that prevent web/native and SSR/declaration receipt relabeling.
Existing archive, source, assertion and artifact bindings are preserved.

Independent commands actually run, with machine-specific paths omitted:

```text
$ node --test tooling/kitchen-sink/proof.test.mjs
tests 9
pass 9
fail 0
skipped 0

$ node tooling/kitchen-sink/unit-proof.mjs --consumer <corrected-installed-consumer-v2> --tools <esbuild-0.28.2-tools> --output <new-review-evidence>/unit.json
Kitchen unit proof: 72 actual assertions, five components through both import modes; installed declarations passed.

$ git diff --check
[no output; exit 0]
```

The positive run used the corrected installed consumer whose UI archive digest
is `9426aa7954afe3ad19f5c66280a8ed98162a9acbca9d6721dbd64e42cc9ec869`.
An initial tool-path attempt lacked esbuild; an attempt with the obsolete v1
consumer correctly failed its loading ARIA assertion. Neither produced a pass
receipt. After selecting the existing esbuild 0.28.2 tools and corrected v2
consumer, all 72 assertions and installed TypeScript compilation passed.
No consumer, device, native build or source file was changed by this reviewer.

Inspected the newly produced structured results and verified their artifact
hashes: unit/exports report 72 checks and categories unit/exports; the separate
declaration result reports one successful compilation and category declarations,
with runner typescript. All remain sourceDirty true development evidence.
The writer's refreshed web result was read and checksum-verified: platform web,
categories web/accessibility, 84 passed assertions, zero failures/skips and
four cases. This reviewer did not repeat the browser run. No native collector
run or clean release eligibility is claimed.

| Applied file | SHA-256 |
| --- | --- |
| `.github/workflows/kitchen-sink.yml` | `771144b9f6e5fab23f9588169903085a920574885acc0fe69d7002a7dc2ac039` |
| `tooling/kitchen-sink/unit-proof.mjs` | `4c06a708d6cadba75d7eb3a89c4dce732993f6fb53756a5c428cbf6b804482d2` |
| `tooling/kitchen-sink/web-proof.mjs` | `ac94a7dbc268a07f8dcd81a066cf457f6d9fbd9618b2073026f2b24cf2b5ca79` |
| `tooling/kitchen-sink/native-proof.mjs` | `0cec77486833679f6f00e0ae5d1ac4066825915be390c6cbe9951da112f01836` |

These corrections introduce no public API, app-state, window/orientation,
acceptance, stability approval or distribution approval change. The PR remains
a draft and the hosted native follow-up must be inspected independently.
