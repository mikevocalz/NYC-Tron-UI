# Independent uniform full-visibility flow review

Verdict: PASS for the draft policy correction. Fresh changed-source Android/iOS and direct/root execution remains NOT RUN; no publication was performed by reviewer.

Reviewer: skill_discovery, independent of implementation by argent_environment_inspector. Applied exact standalone engineering code-review skill knowledge-work-plugins/engineering/1.2.0/skills/code-review/SKILL.md. No code/device actions or source edits; only own review documents copied as authorized.

Inspected exact0510 three-file diff and prior retained retry evidence. Editor tap completed, then rail-result centering failed despite reported visibility1.0 and retained selected state; its following acceptance assertion never executed. This is not relabeled a pass. Independently reviewed [pinned Orchestra semantics](https://raw.githubusercontent.com/mobile-dev-inc/Maestro/67d8a677029261fa424a45a10d08eacd6aa0deed/maestro-orchestra/src/main/java/maestro/orchestra/Orchestra.kt): optional near-center attempts can precede the configured visibility predicate and consume the deadline. Centering is positioning, not the semantic state/geometry assertion.

Both ID and anchored rail-text helpers now explicitly require visibilityPercentage100 with centerElementfalse. No alternate selector, lowered percentage, optional action, coordinate targeting, retry or deadline increase is introduced. Missing/partially visible targets still cannot satisfy the100percent predicate. Existing blocking taps and state/value/disabled/selected/physical-edge checks remain intact; centering is not used as a substitute for tap results.

Independent generated comparison against exact0510: direct and root each retain27byte-identical sorted assertVisible blocks. Entire flows are byte-identical after stripping only centerElement/visibilityPercentage lines, proving selectors, directions, deadlines, taps, input, order, keyboard and geometry preservation. Both YAMLs parsed with installed Ruby/Psych: each has30scrolls, all strict100/false, including both ID/text helper types. Existing per-target centering switches were removed without unrelated flow change.

Independent combined test scope:121passed, zero failed/skipped, including all83kitchen candidate tests plus archive, transport/diagnostic and release integration controls. Frozen hashes match the writer and both publication worktrees; git diff --check passed. No package/version/API/native/window/owner gate change was found. All remaining previously bound composite implementation files are unchanged. Existing29cb complete proof is genuine only for its own0c8488source; it cannot certify the changed flow or satisfy the failed #85 gate. Fresh current-source producer metadata and all required native checks remain mandatory; owner/release approval remains separate.

## Portable frozen bindings

```json
{
  "base": "0510b3b8dc64854d4f0627028046570e5212a4c5",
  "patchSha256": "c8c365660ad74cd9cdd312d7a13bd253a4b22829bbbb2a5649a0a66e0000f519",
  "files": [
    {
      "path": "tooling/kitchen-sink/native-flow.mjs",
      "sha256": "21b07aeb44f88d2baa347dae6896540bb38216e4f19a32ea5e4d2417eef658aa"
    },
    {
      "path": "tooling/kitchen-sink/native-flow.test.mjs",
      "sha256": "e7d59bbc8395a3fcfe99c786f4a6525747e7ee1563ccafe0cbe30683075fc2c6"
    },
    {
      "path": "docs/completion/reports/standalone-v1-2026-11-23-FULL-VISIBILITY.md",
      "sha256": "d99b03ca398d74a37bb684b025c7a3376e6eb17374db89da655fc26a3b8e236a"
    }
  ]
}
```
