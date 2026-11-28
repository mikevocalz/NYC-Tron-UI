# Independent T6 workflow review

Verdict: PASS for the reviewed draft preparation; publication remains blocked.

Reviewer: skill_discovery, independent of implementation. Workflow/producer implementation: argent_environment_inspector, with the earlier integration contract authored by tron_gate. Applied standalone engineering code-review skill: knowledge-work-plugins/engineering/1.2.0/skills/code-review/SKILL.md. No implementation files were edited by this reviewer.

Reviewed release dependency graph, all artifact producer/download names, seven structured evidence paths, source/version/archive identity, documentation verification and installation example, strict publication ordering, failure retention and unchanged owner approval boundaries. The mandatory nine prerequisites include the reusable kitchen producer. Twelve workspace packages are freshly packed; exact tested core/UI archives and two native desktop artifacts complete sixteen. Source/version checks prevent replacement by an unrelated build. Both prerelease and stable publication require --require-library; no optional bypass or success override was found.

Resolved review findings: added focused workflow integration regressions with LF-normalized source reads, and required the existing published-guide clean installation/copied-example check before publication, retaining its proof. The published guide installation checks the currently available version; the unpublished candidate is separately bound through candidate archives and installed-consumer evidence.

Independent verification: 41 targeted tests passed, zero failures/skips, covering workflow integration, evidence collection, tested package merging, release readiness and public contract boundaries. After final workflow changes, all five integration tests passed again; git diff --check passed. Actual local inventory verification independently accepted sixteen rc.3 development archives and SHA256SUMS digest 2d3a362e7df9819ddfdc2dea2c40402154081b53311af82cd0b6e4105ece7277. Strict actual rc.3 readiness exited 1 with owner stable/preview confirmation pending and clean-source evidence required. An initial check of the earlier two-archive staging directory correctly failed exact-sixteen validation; final verification used the complete inventory. A preliminary import used an incorrect module filename and was corrected to release-readiness.mjs.

Writer's full final suite: 1340 passed, zero skipped, attributed to the implementation report rather than independently rerun in full. Separate independent version/peer/lock/copy review belongs to tron_gate. Public API contracts remain covered by the independent targeted suite and that scoped version review.

Limits: these sixteen local archives are dirty-source development preparation. Desktop TypeScript/prepack success is not native-host runtime evidence. No iOS/Android/native desktop pass, owner label confirmation, distribution approval, release, tag, merge or package publication is inferred. Hosted clean exact-candidate checks are still required. Forge retains rc.2 until a published rc.3 exists; F3 installation is unrun. The reported iOS retry concurrency failure is not a successful runtime check.

## Reviewed file SHA-256 bindings

Paths are repository-relative; these bindings cover the T6 frozen delta and consulted integration boundaries. Prior reviewed T3/T5 slices retain their own reports.

```json
{
  "intendedParent": "23cf902718c6063826479a4dfc0e94a961db147b",
  "layers": {
    "T3": "23cf902718c6063826479a4dfc0e94a961db147b",
    "kitchen": "ba37e4b618599bf3f1a6d8fd0b8094c06fa456c9",
    "docs": "0f4e16f76495548fb28673390004ec5142b2ed86"
  },
  "files": {
    ".github/workflows/kitchen-sink.yml": "e859053691d525c1dc7d91a3dd9e27d0137f34d3d58391c9d33836f97eaa480b",
    ".github/workflows/release.yml": "192d7b287abc8e81dd3751396ee6f92a02b6cf14b3c83faed4ad8d63d024bd01",
    "CHANGELOG.md": "fbd64fc6cd4239bf1e01310956074d6a40b562bd27a441db6fff702a699ec4b9",
    "docs/completion/reports/RC3-RELEASE-CHECKLIST.md": "dba1ec659d0ae061d3aeffb9abc206d56d000a60ecf989f2369b4c92204282ad",
    "docs/completion/reports/standalone-v1-2026-11-23-T6-local-archives.json": "3023b64110f730270e4606518f2b99c3df74c80cee2f76ba6dd63a35db540a51",
    "docs/completion/reports/standalone-v1-2026-11-23-T6-readiness.json": "0c961bcd6e10fc39d7c0caa86288d6749da984d4b2815dce59630eecacd4ce97",
    "docs/completion/reports/standalone-v1-2026-11-23-T6.md": "b683b32366c894169210d945fa4cc0b1bdae85d25f82a67511299a25c799895d",
    "packages/app-identity/package.json": "399dc84bb599bb64d82b2c363282b1013b5665244eec94f008a4fd7e47892eb9",
    "packages/core/package.json": "6440584e747b352a679e97a921545748b4557b03c2b03f9898b2dc97a61f4ca9",
    "packages/expo-controls/package.json": "3cc05a86d923849645f52f1e360c518d07bdae9441570071ee8d20998b124d27",
    "packages/geometry/package.json": "2f09287a70edcbe2180f12ce4357f4324d5685fb8323dd53a8790fc7e7a5f85b",
    "packages/hardware-keys/package.json": "3c3d8aef48e70cc2e35ab11de73a5c45b6d70d6fe41ec0b3f95d709e4a81eb6e",
    "packages/icons/package.json": "f5146e3f99a423e42d61bc79c00763a4c7a3de0b123bf4271f4cc9050a50fc6f",
    "packages/macos-appkit/spark/package.json": "f9750d3c1e86c67b65163f0b074859f540abaa69e1ac0c5c78691b947ac3cc4b",
    "packages/native-charts/package.json": "f0bcf1c78706e8500d2f8a88a4a61dfa0b0e0e9c4b920ca16f780da4a22ae7c0",
    "packages/native-controls/package.json": "d0e14ea7d26d6f1b42c49ef24c79892466c75d9de3d0aa962bdf5fc40f9a6145",
    "packages/native-navigation/package.json": "04d57b3730eb406ee07dab1cfcb8804fb9e471786eb134693d495ff681e4f08b",
    "packages/panes/package.json": "843497489aff97e3b050ba8a82f08625a8474b521c53916dd250e37934192898",
    "packages/platform-services/package.json": "61982e2559700efa09e148e9bb7e3390a5af5520fdfbf10d9089478dd5243389",
    "packages/reserved-regions/package.json": "250665b752a7d5156cd366a255128fa3cc7b2d2059d8e337582b331440303d01",
    "packages/ui/package.json": "85537af11d73ab3be818f0a0916ebbe2ac7b6a4e5e2dbebb1504cdd861cb2b07",
    "packages/windows-fluent/package.json": "b40786ddd1265c000a5cbc63f2f3d133606adb0276526685a3e38ba3e0ff02ab",
    "packages/windows-fluent/rnw-fabric/package.json": "2e86a683e736f10049da466513446df887a71e9876b8a810916f544644fb6928",
    "tooling/collect-library-evidence.mjs": "ebfb25995c70df8f70ec4022687ca68925f3ab4028d5c35e48df2d99c0a16ecc",
    "tooling/kitchen-sink/native-proof.mjs": "0cec77486833679f6f00e0ae5d1ac4066825915be390c6cbe9951da112f01836",
    "tooling/kitchen-sink/unit-proof.mjs": "4c06a708d6cadba75d7eb3a89c4dce732993f6fb53756a5c428cbf6b804482d2",
    "tooling/kitchen-sink/web-proof.mjs": "ac94a7dbc268a07f8dcd81a066cf457f6d9fbd9618b2073026f2b24cf2b5ca79",
    "tooling/library-readiness.mjs": "98087f1e988f8ba4eebea978dab3c293ef2f8058aa6eaad729d9f505ac5fe6d9",
    "tooling/merge-tested-package.mjs": "b50ae5c052f608e5d515b69e0254a0faad0ec245c07b6c186d8f0418f825c11f",
    "tooling/release-readiness.mjs": "8324dbd14f65dc5fa2fc0fb7930b0c220038f7efa24b118f3868570f112454f1",
    "tooling/tests/release-library-integration.test.mjs": "59374dcbeb1173c8f09a3ebd1d351bfc641e668b54092730b3617632509057a1",
    "docs/completion/reports/standalone-v1-2026-11-23-IOS-TOOLCHAIN.md": "959a000f4f68857bf4138de2ee4a9c91d062dde70c1b2b9fe46e77c9fbcaa959"
  }
}
```

## Supported iOS toolchain follow-up

PASS for the workflow-only correction. Independently compared the final kitchen workflow against the prior published-slice working tree: only four iOS toolchain lines change (runner label, DEVELOPER_DIR, exact Xcode version and build assertion). Build, installed archives, simulator scenarios, structured receipts, artifact names and mandatory release dependency remain unchanged. Dependencies, native code, app orientation and release-core workflow are unchanged by this follow-up. Five release integration guards passed again, zero failures/skips. The source investigation report was reviewed with appropriately attributed compiler diagnostics and no unsupported success claim.

Independently consulted [Expo infrastructure](https://docs.expo.dev/build-reference/infrastructure/#ios-server-images), which binds SDK58 to Xcode27.1 build27A9275; [GitHub GA announcement](https://github.blog/changelog/2026-10-15-xcode-27-runner-image-generally-available/), which documents xcode-27 and arm64; and [official runner inventory](https://github.com/actions/runner-images/blob/main/images/macos/xcode-27-arm64-Readme.md), which documents the selected app path and build. This supports trying the corrected environment; it does not prove that the previous compiler failure is fixed. Hosted build and both unchanged import-path runtime scenarios remain required. Runner architecture changes to arm64; setup failures must be reported as failures, never as native proof.
