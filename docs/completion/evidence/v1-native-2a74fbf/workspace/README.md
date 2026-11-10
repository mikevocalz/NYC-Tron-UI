# Canonical workspace archives for PR head `2a74fbf`

The Ubuntu source job in [native run 42871225491](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42871225491)
produced one set of thirteen workspace tarballs for the fresh iOS and Android
consumers. [Job 130022710856](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42871225491/job/130022710856)
passed on 2026-11-10. The original package archive artifact is
[`native-workspace-packages`, artifact 13790311200](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42871225491/artifacts/13790311200).

| Identity | Recorded value |
| --- | --- |
| PR head | `2a74fbf5bc5f3be5137af73d9590ce05abaaf0b0` |
| Actual tested merge | `0ce41081d56acb365c1c1cf382eeaff27aa24543` |
| Tested tree | `f6d55646022c3544136b0aab917081cc179b851e` |
| Workspace inventory | Thirteen packages, each version `1.0.0` |
| Artifact ZIP size | 2,209,953 bytes |
| Artifact ZIP SHA-256 | `83561f0fa823ecf5f7242b03a509b1070843e3d994874f430817a8fe2fd62c7e` |
| Producer manifest SHA-256 | `34335d9968c0c4baab066ef454c29d25be04f8514b9778bbc23f52c29647b4fa` |
| Original `SHA256SUMS` SHA-256 | `715866f9a930cef6cb64752adff5ab46213ca28738bd99064467b4b46b23736c` |

The complete downloaded ZIP was checked against GitHub's artifact digest and
size. All thirteen tarball byte counts and SHA-256 values matched both the
[original checksum file](SHA256SUMS) and the
[original producer manifest](workspace-packages.json). Each tarball's embedded
manifest matched its package name, version and private distribution setting;
its built distribution, README and license were present. The archive contained
exactly those thirteen tarballs and the two original manifest files.

The [retained producer log proof](producer-log-proof.json) contains the verbatim
output that emitted this source commit and manifest hash, together with the
job-output confirmation. It identifies the complete decoded job log by hash and
the excerpt by its original line range and hash. The
[original GitHub commit object](github-tested-commit.json) confirms that the
tested merge includes the requested PR head and has the recorded tree.

[Independent verification](verification.json) records each archive hash and
its independently computed npm SHA-512 integrity value. The
[original job response](github-job.json) and
[original artifact response](github-artifact.json) retain the execution and
download identities. This producer result does not establish either native
runtime result; media, UI and payload acceptance requires its own completed
platform receipts. The earlier `2899ffd` native receipts remain unchanged.
