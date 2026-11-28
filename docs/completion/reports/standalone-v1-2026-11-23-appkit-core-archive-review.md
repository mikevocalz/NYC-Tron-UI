# Independent review: AppKit generated core archive dependency

Reviewer `tron_gate`; implementation `tron_docs`; base `f0dd6ddf6358391ae5a358155c9497c0b92d66ab`. Applied the exact standalone engineering code-review procedure. Verdict: **approve for draft review; no blocking findings**. Full Spark/native execution remains unclaimed.

The generated acceptance consumer copied the requested validated core archive but retained the static example's rc.2 file URL. The one-line correction assigns its core dependency from `sharedCore.filename` after `copySharedCore` has validated and copied that exact archive. It does not update the repository's historical example pin or replace validation with a guessed version string.

Independently compared the full preparation script to the base: exactly the generated dependency assignment was added. The shared archive validator, static example package manifest, AppKit and release workflows and owner distribution record remain byte-identical. All existing version, SHA256SUMS, regular-file, package identity, copied-byte, installed-version, lock-integrity, final installed-byte and provenance checks remain in place.

Independent test command:

```sh
node --test tooling/macos-appkit/shared-archives.test.mjs
```

Actual result: **7 passed, 0 failed, 0 skipped**. The new cases run the real preparation CLI in temporary Git repositories with real tarballs/checksums for both rc.2 and rc.3. Only npm is intercepted in the child process, and execution deliberately stops at the first install boundary. They verify the exact dependency and copied archive, complete generated-manifest equality apart from the two intended bootstrap dependencies, and unchanged template bytes. A checksum-valid archive containing the wrong version is rejected before copying or invoking npm. The tests do not download dependencies or pretend to compile Spark.

`git diff --check` passed. The writer's original-code rc.3 failure and full sixteen-test AppKit suite are inspected evidence; this reviewer independently reran the seven focused archive/first-install checks rather than claiming the full suite or native build.

No public API, native source, runtime pin, example release pin, device state, acceptance status or owner approval changes. The hosted AppKit retry must establish the remaining actual install/build/runtime outcome. Exact reviewed source/test/report hashes and patch identity are in `tron-appkit-core-archive-review-freeze.json`.
