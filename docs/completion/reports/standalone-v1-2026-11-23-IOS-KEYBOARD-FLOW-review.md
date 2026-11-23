# Independent iOS keyboard flow review

Verdict: PASS for the draft flow-only correction. Corrected hosted direct/root acceptance remains NOT RUN.

Reviewer: skill_discovery, independent of implementation by argent_environment_inspector. Applied exact standalone engineering code-review skill knowledge-work-plugins/engineering/1.2.0/skills/code-review/SKILL.md. No code/device actions by reviewer.

Independently inspected retained eeaa failure accessibility data: native Return key is enabled with resource-id Return and accessibilityText return; visible keyboard root is UIKeyboardLayoutStar Preview; edited field contains Retained kitchen draft. The actual command trace reaches input after ordered variants/cards, then fails hideKeyboard; no root pass/receipt follows. This is a keyboard dismissal failure, distinct from earlier startup faults, not full acceptance.

The generated flow branches only by explicit platform. iOS taps anchored Return and adds a mandatory keyboard-root-not-visible assertion. Android retains hideKeyboard. Existing draft-value assertion immediately follows both branches, guarding retained content. No optional action, coordinates, value injection or app-prop adjustment is added. Independently consulted [pinned RN0.88.1 TextInput source](https://raw.githubusercontent.com/facebook/react-native/v0.88.1/packages/react-native/Libraries/Components/TextInput/TextInput.js): absent multiline/submit overrides, single-line inputs use blurAndSubmit. Inspected library forwarding and fixture props: no such override. [Official Maestro conditions](https://docs.maestro.dev/maestro-flows/flow-control-and-logic/conditions) document iOS/Android platform branches and inline commands. This supports the action, not proof it has executed successfully.

Independent exact candidate command:81 tests passed, zero failures/skips. Generated both old/new modes and independently compared exact sorted assertVisible blocks:27before/27after, byte-identical multisets for direct and root. New assertNotVisible adds a blocking check. Parsed both generated YAML documents with installed Ruby/Psych, confirming each platform condition and nested command structure without new dependencies. git diff --check passed. All three final file hashes and patch digest match below. Startup/pins/archive identity, driver/clearState, timeouts/retries, all later state/layout assertions, JUnit, screenshot/provenance and app/API/window/orientation contracts remain unchanged. No native pass, owner approval, release/tag/merge or package publication is inferred.

## Portable frozen bindings

```json
{
  "base": "6ddab69858a6b946aaec9b6228d53c93c8b8f739",
  "patchSha256": "1adb5f3364340588637e618f1e46e14e7719336829eacc3292fb06be9ebb579b",
  "files": [
    {
      "path": "tooling/kitchen-sink/native-flow.mjs",
      "sha256": "e81dfdc32fd59cc85d21f77fb4414ff3446eeb67438b4a1588766a6f36564204"
    },
    {
      "path": "tooling/kitchen-sink/native-flow.test.mjs",
      "sha256": "889b59f94c58d5f415223ac41aeb52d8534508b2ec66565ca8de29ff21fde38f"
    },
    {
      "path": "docs/completion/reports/standalone-v1-2026-11-23-IOS-KEYBOARD-FLOW.md",
      "sha256": "cf13422c87460580eb1182a61838ee847dd8b33bb37b515712613ba5b4631dea"
    }
  ]
}
```
