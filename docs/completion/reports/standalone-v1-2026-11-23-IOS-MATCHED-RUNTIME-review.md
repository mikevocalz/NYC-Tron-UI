# Independent SDK-matched iOS target review

Verdict: PASS for the draft target-selection experiment. New-target native acceptance is NOT RUN.

Reviewer: skill_discovery, independent of implementation by argent_environment_inspector. Applied standalone engineering code-review skill knowledge-work-plugins/engineering/1.2.0/skills/code-review/SKILL.md. No source edits or local device commands by reviewer.

Reviewed the final four-file patch, including corrected workflow step label. Constants strictly select available iPhone Duo/iOS27.1; initial exact selection, bootstatus420second deadline, targeted UDID query30second deadline/equality, diagnostics/export ordering and no-fallback behavior remain intact. Booted preference applies only among exact matching targets. Changes do not relax clearState, per-mode fresh driver, direct/root assertions, JUnit, archive identity or fresh screenshot acceptance. No runtime retry, timeout increase, app/window/orientation change or physical/foldable promotion is introduced.

The [official runner inventory](https://github.com/actions/runner-images/blob/main/images/macos/xcode-27-arm64-Readme.md#installed-simulators), independently consulted during this review sequence, lists Xcode27.1 build27A9275 with iphonesimulator27.1 and Duo as the sole27.1 simulator. iPhone17 exists on27.0/27.2. This supports the exact matching target choice, not a proven compatibility repair. Independently inspected1185 retained evidence: bootstatus0/alreadybooted then selected-target identity ETIMEDOUT/statusnull. The underlying responsiveness cause remains unknown; earlier27.2direct success does not establish27.1 acceptance.

Independent scoped execution:14 tests passed, zero failures/skips. Controls cover exact pins, competing booted older/newer devices, wrong runtime/device, unavailable/missing target, identity mismatch/absence, boot failure and query timeout, plus preserved driver/flow wiring. git diff --check passed. All four file hashes and patch digest independently match the frozen bindings below. A complete hosted build and both exact native modes remain mandatory before any passing receipt. Owner/publication restrictions remain unchanged.

## Portable frozen bindings

```json
{
  "base": "11851638d2327dc08db1b154b70dd7684798f977",
  "patchSha256": "8d72af38c50c1fecf062c5e30d5e6c829409423ac5d3f531f09ce99a7b62dacf",
  "files": [
    {
      "path": "tooling/kitchen-sink/prepare-ios.mjs",
      "sha256": "98d24c61496f46b831efd40196c9d4747637e2ff9852f795c5c65dde822e6e07"
    },
    {
      "path": "tooling/kitchen-sink/ios-target.test.mjs",
      "sha256": "c9b1807f6c4614d63b5237171fd9515435d222b63323b86612912d3a8a759114"
    },
    {
      "path": ".github/workflows/kitchen-sink.yml",
      "sha256": "719aea71f34ebf46c607be953db0b699dbfb3edd89c1e9e90b73359893b61630"
    },
    {
      "path": "docs/completion/reports/standalone-v1-2026-11-23-IOS-MATCHED-RUNTIME.md",
      "sha256": "085f4893dd4c3460b7f0a29970dbec366cfb4963249bf45ac9dd96d820c91f44"
    }
  ]
}
```
