# Independent shared command diagnostics review

Verdict: PASS for the diagnostic-only draft correction. Shared native UI acceptance remains failed.

Reviewer: skill_discovery, independent of implementation by argent_environment_inspector. Applied standalone engineering code-review skill knowledge-work-plugins/engineering/1.2.0/skills/code-review/SKILL.md. No implementation edits or local device commands by reviewer.

Independently inspected actual retained900d runtime logs. Failed Maestro commands exited1 after20486ms and15304ms, without process timeout errors. Both failed command streams stop at sequence2 launchApp(stopApp=false), with device-offline errors; Settings assertions never ran. Thus elapsed total job time was not proof of a60second subprocess deadline. Report appropriately leaves the underlying transport cause unknown and does not present a speculative tool pin as a fix.

The exact wrapper delta adds signal to command metadata and replaces the faulty nullish stderr fallback with explicit status/signal plus separate nonempty stderr/stdout tails and spawn error. Empty stderr can no longer hide a nonzero status or stdout-only error. Text fields are bounded to4000characters each; existing full command log streams remain intact. Successful return behavior, optional-command handling, process timeout/output bounds, tool pins, recovery eligibility/one-recovery limit and all decoder/native UI assertions are unchanged. The new pure helper is globally discovered through tooling/tests; it has no device side effects.

Independent scoped tests:26passed, zero failures/skips. Six diagnostic controls cover empty streams, stdout-only failure, both streams, timeout/signal, bounded tails and wrapper wiring; twenty existing transport/recovery regressions remain passing. git diff --check passed. All four source/report hashes independently match the frozen manifest. No app pass, transport cure, owner approval, release/tag/merge/publication or successful hosted retry is inferred. The change makes the next real failure actionable; actual native acceptance remains mandatory.

## Portable frozen bindings

```json
{
  "base": "900d8ca3ff4f0c111f1b3b1c75879beadb584597",
  "files": [
    {
      "path": "tooling/native/run-ui-acceptance.mjs",
      "sha256": "ba1afb7f68d3896edd1ecbb8bd50b4fda6bddf572fbf66dc22b46ec2d07acd84"
    },
    {
      "path": "tooling/native/command-diagnostics.mjs",
      "sha256": "67dff1c4e3ace5a1ad36abdb53613cfa6ffb9dd7f56b90976254856a2a8c4152"
    },
    {
      "path": "tooling/tests/native-command-diagnostics.test.mjs",
      "sha256": "a62cd0f53831f8fae3f130c818d8ca6ba602fe1fff4e28837ec44643dc80cf16"
    },
    {
      "path": "docs/completion/reports/standalone-v1-2026-11-23-SHARED-ANDROID-TRANSPORT.md",
      "sha256": "6fb9342c0136fa93244f1a6a2919fbb5d705a368b903b68096f3630ef414bba9"
    }
  ],
  "patchSha256": "a0316319082c71ec09f282ee5b7c5dae1ffc0e7a2cb209a7cc7f294f3ecc266a"
}
```
