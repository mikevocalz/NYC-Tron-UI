# iOS command-output capture — source review only

This receipt covers a minimal output-retention change to `.github/workflows/native-controls-port.yml`. It does not establish a fix for the failed iOS touch test.

The motivating completed job, [130544275678 in run 43026784330](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43026784330/job/130544275678), belongs to PR64 head `fc901030ba1e0eed1b399ad0a3100529bf97e52f`. Completed metadata reports successful simulator compilation and decoder execution, followed by a failed touch step. Two completed original-log reads returned `Transport closed`. The connector's underlying failure cause and the exact native assertion remain unknown.

## Exact source

| Artifact | Git blob | Bytes |
|---|---|---:|
| Workflow preimage | `624bcf9c74ddfb89a43ca7e303560331c258cafb` | 24,929 |
| Workflow candidate | `c6c51423a0fcbab4768751bd8f1e04d2939f20fe` | 26,243 |
| [Three-edit manifest](workflow-edit-manifest.json) | `273825d5e83ff43ded700a916290a18d24df7bec` | 7,566 |
| [Reproducible checks](workflow-review-checks.js) | `8cad3b606a542633b0a8b0579ed80ca7e9ec1d40` | 10,426 |

The candidate SHA-256 is `42a89920560c87eb92c77bd0042bfa7b3642a45103929b9a0924db4419a8a00f`. Its three unique replacements and their inverse are exact. [Source review](workflow-source-review.json) records the other identities, preserved boundaries and test-discovery proof.

## What changes

The existing `xcodebuild` command runs at most once with its original arguments, working directory and environment. Standard output remains `/tmp/xcodebuild.log`, preserving the existing compiler-source checks. Standard error goes to the fixed sibling `<consumer>/ios-command-output/build-stderr.log`.

The existing `node tooling/native/run-ui-acceptance.mjs ios …` command also runs at most once. Its streams go to `ui-stdout.log` and `ui-stderr.log` in that same sibling directory. The workflow does not precreate `runtime-ui-ios`; the runner's existing exclusive directory creation, launcher, driver, security settings, assertions, deadlines and retry logic remain unchanged.

After the command or capture setup settles, the workflow invokes the reporter, whose source and tests are reviewed separately:

```text
node "$GITHUB_WORKSPACE/tooling/native/report-ios-command-output.mjs" <build|ui> <shell-status> "$NYC_TRON_CONSUMER"
```

The reporter invocation is guarded with `|| :`, so its error cannot replace the saved status. A fixed setup-failure message is secondary too. There is no fallback command execution or retry. The existing `always()` artifact upload gains only the sibling output directory.

## Exit status and evidence limits

The saved status can originate from a native command, shell redirection, or directory setup. A nonzero value does not independently prove that the native command launched. Capture files may be missing, stale or partial; file presence alone establishes neither launch nor complete/fresh command output.

Build status has two distinct meanings. The reporter receives the actual captured shell status. The terminal `test "$nyc_tron_build_status" -eq 0` retains the original build-step success/failure normalization to 0 or 1. For example, a captured `xcodebuild` status of 65 remains a failed step with effective status 1. The UI step exits with its exact saved status.

The new top-level stream files are shell-captured bytes. They must remain distinct from existing nested runner logs: `run-ui-acceptance.mjs` already decodes subprocess output as UTF-8 and concatenates stdout and stderr when writing those logs. That implementation is unchanged.

## Verification boundary

Root and the independent reviewer read the full change and reproduced all three forward/inverse transformations. Four portable source/status-contract review groups passed in V8, with 116 assertions and 24 status combinations. They check exact command tokens, immediate status capture, secondary reporter behavior, preserved source/Android steps and runtime freshness, and normal source-suite discovery.

The exact existing source chain is `package.json` → `tooling/run-tests.mjs` → `tooling/test-files.mjs`. It recursively discovers `tooling/tests/ios-command-output.test.mjs`, so this workflow adds no extra source-test step.

These are source and model results. No YAML parser, Bash execution, Node filesystem capture, Xcode build, XCTest/Maestro run, simulator interaction or physical-device test was executed for this candidate here. Reporter source/tests and later actual CI outcomes retain their own review boundaries. No workflow dispatch, rerun, ref, PR or host change was performed by this author.
