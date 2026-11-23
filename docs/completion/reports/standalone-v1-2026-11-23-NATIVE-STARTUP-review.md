# Independent native startup hardening review

Verdict: PASS for draft CI hardening. Hosted startup diagnostics and full native acceptance on this new source remain NOT RUN.

Reviewer: skill_discovery, independent of implementation by argent_environment_inspector. Applied exact standalone engineering code-review skill knowledge-work-plugins/engineering/1.2.0/skills/code-review/SKILL.md. No implementation edits, real host/JVM inspection or device commands by reviewer; test processes are owned synthetic children.

Independently inspected actual retained failures. The989version check passed exact2.12.1 in36594ms, then driver startup failed; its runner log filename06:51:23 and HTTP server startup06:53:25 support roughly122seconds, while exact polling start is not logged. The distinct6b9probe timed out after65486ms with its configured60000ms cap, statusnull/SIGKILL/ETIMEDOUT and empty streams, before driver/flow execution. The report correctly avoids identifying one cause or claiming the driver budget repairs the empty version timeout.

The kitchen reuses the existing shared driverStartupMs180000 contract. Independently inspected the [exact pinned LocalXCTestInstaller source](https://raw.githubusercontent.com/mobile-dev-inc/Maestro/67d8a677029261fa424a45a10d08eacd6aa0deed/maestro-ios-driver/src/main/kotlin/xcuitest/installer/LocalXCTestInstaller.kt): MAESTRO_DRIVER_STARTUP_TIMEOUT is supported and otherwise defaults120000. This is a bounded driver setting; the strict60000ms version cap and600000ms flow cap remain unchanged.

A SHA-verified exact-version preflight now precedes app compilation and simulator boot. Postboot verification remains independently strict. Both calls use one watchdog inside the existing synchronous verifier, guarded to hosted Darwin, pinned Java and output below RUNNER_TEMP. At40000ms it records bounded process metadata without environment/argument columns; jcmd selects only exact maestro.cli.AppKt JVM descendants of the owning PID, and inspects at most one. Raw JVM discovery output is not persisted. Each diagnostic command has5000ms timeout/64KiB capture and32KiB retained stream limits; existing version diagnostics survive failure. Output artifacts retain early and postboot diagnostics.

Review gaps resolved before approval: the initial watcher covered only early preflight; final placement covers both probes without duplicate watchers or changing the synchronous API. Killing only the Node watcher could orphan its in-flight diagnostic child; final detached owned POSIX process-group cleanup kills both, including on failure. Worker and collector reject nonsafe, fractional, nonpositive and PID1 owners before inspection, preventing ancestry broadening. Child mode also enforces the output/CI guard before writing. A real owned synthetic grandchild heartbeat regression proves cleanup stops child activity; no real ps/JVM snapshot is claimed.

Independent final candidate command:79 tests passed, zero failures/skips. Eight added controls cover environment/settings, bounded owned-JVM selection, failure bounds, actual synthetic early strict success/wrong-version and fresh output, workflow order/artifact retention, both-probe guarding, in-flight group cleanup and invalid owners. git diff --check passed. All five final file hashes and patch digest match below. Archive/tool pins, exact stdout/version comparison, both import modes, fresh drivers, all27assertion blocks, runtime/JUnit identity, screenshots/provenance and app/API/window/orientation contracts remain unchanged. No retry allowance, owner approval, release/tag/merge/publication or native pass is inferred; the forty-second hosted stall path still requires actual measurement.

## Portable frozen bindings

```json
{
  "base": "98957f02f26fc5a696090613b8bfb3e609a2814c",
  "patchSha256": "cf2df5e9670bb8065fda642e32c9e263835273abc5aa5e6884f10567e7532be0",
  "files": [
    {
      "path": ".github/workflows/kitchen-sink.yml",
      "sha256": "b2e0699fca5f251028f3009feef1fcf6e3b4fbb271ec2e89b7a6d9d3526ed02d"
    },
    {
      "path": "tooling/kitchen-sink/maestro-version.mjs",
      "sha256": "6bcfc48cd18bdb8a41162d3641530a56b6fbf32e672aaa4068fec5eb8538ece6"
    },
    {
      "path": "tooling/kitchen-sink/maestro-preflight.mjs",
      "sha256": "c4c604590f79ce34e939ed562de4a86424ba9c7a7913d551a58b88ea51e04b53"
    },
    {
      "path": "tooling/kitchen-sink/maestro-preflight.test.mjs",
      "sha256": "56b6d7394ed33cc71a1e6eb0d85461579274e1897b83615578ec46adba03725b"
    },
    {
      "path": "docs/completion/reports/standalone-v1-2026-11-23-NATIVE-STARTUP.md",
      "sha256": "d31029b8ee53e3a6fde778cf5675fefc390590879ab5e5c119ed1a8bb4317581"
    }
  ]
}
```
