# Helper 8e5ee2e: source, packaging and installed-browser evidence

This receipt retains the five complete original job logs for [source run 42982526846](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42982526846) and [installed-consumer run 42982526713](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42982526713). Both workflows completed successfully.

Every job checked out exact merge `d329a921bf3ee6183d94bc83204451bf2bc7cc93`, for helper `8e5ee2e3c153d04f67f5d53983b308554a4f969c`. The source suites each report **1,187 passed**, not the aggregate's historical 1,199. The basic browser profile reports **one passed and one skipped**; the Expo web profile reports **two passed**.

## Exact source boundary

The helper's sole parent is `a957d4059b8a86735f2c152371eb7a2c2bd4e4ae`. The actual merge's ordered parents are `ac5d69585a52a6e945dc996ea08030e190574699`, then the helper. Their shared tree is `04c43947361d463940ccfe7cbb02ca8b48382929`; all 2,050 leaves and 284 tree hashes were independently verified.

The actual checkout appears at workspace-log line 122, Windows-log line 109, contract-log line 122, and line 123 of both installed-consumer logs.

This helper differs from aggregate `e8395372bd163ea97ecf84e026538c68822aac5c` in **86 non-documentation/non-Markdown leaf paths**. That count was independently reproduced by comparing leaf IDs, modes and types after excluding `docs/**` and `.md/.markdown` paths. These helper passes do not transfer to the aggregate. They neither replace its earlier 1,199-test result at source `54002b8a` nor establish a run of its current expected suite. Exact release commit and manifest provenance remain separate.

## Completed results

| Job | Actual scope and result |
| --- | --- |
| Workspace TypeScript, 130396022441 | Package builds and typechecks; 13 packages, 619 built conditional exports, 750 ESM files; API snapshot matches 619 subpaths and 3,306 reachable declarations |
| Linux contracts, 130396022881 | 1,187 tests passed; 0 failed, cancelled or skipped; reported duration 17,083.080003 ms |
| Windows tests and pack, 130396022791 | 1,187 tests passed; 0 failed, cancelled or skipped; reported duration 32,849.4614 ms |
| Basic installed consumer, 130396022031 | One installed release tarball verified; typecheck and browser build passed; Chromium: 1 passed, 1 skipped, reported 2.3 s |
| Expo web installed consumer, 130396022358 | Four installed release tarballs verified; typecheck and browser build passed; Chromium: 2 passed, reported 2.1 s |

The two 1,187-test executions exercise the helper suite on different runners. They are not 2,374 distinct tests. The Windows result covers source tests and packaging; native Windows interaction remains a separate gate.

The workspace component checker reports **341 canonical IDs: 332 local implementations, nine pinned external implementations, zero partial and zero pending**. It also explicitly reports **zero accepted with all eight platform proofs**. This is the checked implementation inventory, not a blanket eight-platform acceptance result.

## Package and import evidence

The workspace, Windows and both installed-consumer jobs each report packing 13 tarballs plus `SHA256SUMS`. The packages are core, expo-controls, geometry, hardware-keys, icons, native-charts, native-controls, native-navigation, panes, platform-services, reserved-regions, ui and windows-fluent.

The workspace and Windows source jobs each then install the three dependency-free packages in a fresh project and successfully import **17 export subpaths** from `@nyc-tron/core`, `@nyc-tron/geometry` and `@nyc-tron/windows-fluent`. The exact checked-in smoke script is blob `67a8ced1e59e2ee477d1e32b26832a59d6585fdb`; it discovers the import targets from the packed manifests and executes them inside the temporary consumer project.

The three Linux producer reports—workspace, basic consumer and Expo web consumer—print identical package filenames, file counts and SHA-256 values for all 13 archives. **All 13 Windows archive hashes differ**, although package names and file counts match. For example, core is reported as `dc280637a48a055478cb39ff6ca7df3d5d53424339a7bb6f1b05c96d30a0c355` by those Linux jobs and `2079abe606dadde1d0d34cba4a4a31820f289cd893f2ad1e0a5c85a20914992c` by Windows.

The separate per-job lists, including exact original log lines, are retained in [workflow-metadata.json](workflow-metadata.json). These are producer-reported archive identities. The original tarballs were not retrieved or independently hashed here; the difference's cause and equality with a final release manifest are not established.

Packing all 13 packages is distinct from importing the 17 dependency-free subpaths or verifying the one/four tarballs used by each browser consumer. It also does not include an accepted standalone AppKit or Windows Fabric distribution.

## Actual installed-browser cases

The complete logs report preparation outside the repository and browser builds without workspace imports. At this exact source, `tooling/consumer-release.mjs` blob `24fba0d445440b399e36ee86c7b6cd7fce71b808` configures the basic consumer with `@nyc-tron/ui`; the Expo web consumer additionally selects core, panes and expo-controls. Those names are source-derived configuration, while the observed installed-tarball counts are one and four.

In the basic profile, the installed UI/reflow case passed. The case titled “Expo browser exports — installed picker and panes work through the browser export conditions” was skipped. The Expo web profile passed both cases. The skipped basic case is not counted as passed.

The basic artifact is [13838371400](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42982526713/artifacts/13838371400), reported as 64,098 bytes with SHA-256 `9e7f25d4f600466edcb6be586e11f18b1d16a739b064491bbca6ab2dce8b4898`. The Expo web artifact is [13838132805](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42982526713/artifacts/13838132805), reported as 117,308 bytes with SHA-256 `0cc02ec46e7108d54a19a2b0226181ff04c7c6e1fc48f883ed3173e5b4ad1618`. Each upload reports seven files. No artifacts were returned by the source workflow's artifact listing.

The ZIPs, dependency receipts, original capture images and other members were not extracted or viewed. Artifact sizes and hashes remain API/producer-reported. The browser results are remote CI observations, not local browser execution.

## Retained original records

Five complete decoded job logs total **507,215 bytes** and retain their original newlines and ANSI bytes. [provenance.json](provenance.json) records every file's size, SHA-256 and Git blob identity; the metadata records the completed jobs, exact checkout lines, source/consumer counts and all four archive-producer lists.

This receipt performs no new tests, dispatches, reruns, source edits, ref updates or PR changes. It does not establish aggregate validation, native desktop interaction, physical-platform acceptance, owner approval or final release-manifest closure.
