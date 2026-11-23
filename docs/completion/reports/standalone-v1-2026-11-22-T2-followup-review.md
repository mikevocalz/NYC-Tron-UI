# Independent review: T2 line endings and CLI entry points

Reviewer: `skill_discovery`; implementer: `tron_manifest`.
Date: 2026-11-23 UTC. Follow-up to draft PR #82 candidate `7f405fb1`.
Skill: `knowledge-work-plugins/engineering` 1.2.0 standalone `code-review`.

Verdict: passed for the line-ending and CLI entry-point corrections. No
blocking findings remain in these corrections. A new Windows CI pass is still pending; this local review
does not claim the failed Windows run has passed.

## Problem and implementation

The original Windows job in run `45097405986`, job `137440175215`, found
checkout-dependent source-input digests: CRLF and LF source bytes hashed
differently despite identical parsed inventory data. The fix normalizes CRLF
to LF before UTF-8 source-text fingerprints. Its encoding is stated in the
manifest and inventory guide.

Review also identified a second instance of the same issue: raw comparisons
of generated JSON would reject a CRLF checkout when either CLI is run. Both
read-only CLI checks now use the shared normalized-text comparison. It still
compares the full generated JSON rather than ignoring changed properties.

The separate lookup digest retains its original meaning: SHA-256 over
`JSON.stringify` of the parsed ledger. The new explicit encoding label
clarifies that it is not a raw-file or Git blob digest. Its value is invariant
under LF/CRLF formatting. Release-archive checksums and exact archive-byte
verification code were not changed.

## Independent checks actually run

Compiler API: repository-pinned `@typescript/typescript6` package 6.0.2,
provided from an isolated tooling installation. Node: v26.13.0.
Machine-specific compiler-root arguments are omitted from this portable report.

```text
$ node --test tooling/tests/library-components.test.mjs packages/ui/tests/contracts.test.mjs
[8 inventory checks and 16 existing contract checks passed]
tests 24
pass 24
fail 0
cancelled 0
skipped 0
todo 0

$ git diff --check
[no output; exit 0]
```

The new regression converts all five source JSON inputs, all sixteen package
manifests and both generated files to CRLF. The complete inventory, including
fingerprints, equals the LF result. It tests changed declaration data and an
added export still producing drift/failure. Lookup tests also verify parsed
LF/CRLF ledger equivalence.

An additional independent subprocess experiment copied the relevant sources,
docs and packages to a disposable canonical-path checkout and converted all
five source JSON files, both generated outputs and the ledger to CRLF. Both
actual CLI entry points ran and printed nonempty success output:

```text
CRLF actual CLI: Library inventory: 16 packages; 478 public component exports; 456 declaration identities; 10 proposed stable / 468 proposed preview; owner confirmation pending.
CRLF actual CLI: Forge import lookup: 341 baseline rows and 5 added rows; no acceptance or library scope changes.
Changed provenance value: actual inventory CLI rejected drift
Changed ledger name: actual lookup CLI rejected drift
```

The negative checks changed D5's measured-date value and a ledger component
name independently. Each actual CLI exited 1 with its expected generated-file
drift error. This verifies the normalization does not hide data changes.

The final implementation report, inventory guide and complete 24-test stdout
were read. They distinguish the actual Windows failure from local simulated
CRLF evidence and leave the follow-up Windows run pending. No public export,
component count, proposed label, approval, native configuration, archive
checksum policy or acceptance record changed.

## Artifact hashes

| Artifact | SHA-256 |
| --- | --- |
| Inventory generator | `84f59840808f5d69c718b4a19bb53188dc729da3ca0db143643df864693c6dcc` |
| Lookup generator | `4e93f0db962f5ed4d7760806b9cfd7f996dea832e0573c412a48cff06a8104a6` |
| Inventory tests | `7081e80ea63711a8a823f3d1d7aac5ec76153dd1aa0a85f918ccc08410466f9b` |
| Component manifest | `fe69d799340ce7d29bf7358cc1d8975b0ad1e3d0dbcb1e38a2723b822428ba20` |
| Lookup manifest | `037bd5a5c731d22bc770ff214b865e08095dd5644122c6ffcf29eee9cee11820` |
| Complete follow-up test stdout | `660a15d6613fe54810a5b50cf876e463571801877639abac605a24dec09305f2` |

## Limitations

Local CRLF perturbations ran on macOS; the follow-up Windows runner is pending.
Full build/typecheck and native/browser/installed-tarball acceptance were not
rerun by this reviewer. Stable/preview proposals still require the owner's
confirmation. This review authorizes no merge, release or distribution approval.

The symlinked-entry defect found during this review is fixed in both new
CLIs. Their shared guard compares real paths, safely treats ENOENT/ENOTDIR
stdin/eval entry values as imports, and propagates other filesystem errors.
No legacy tool was changed.

The independent final 24-test run exercised both actual CLIs through a
directory alias, asserted nonempty validation stdout, then changed each
generated file and required its CLI's nonzero drift rejection. A separate
stdin subprocess imported both modules without running either CLI. Both tests
ran successfully; none was skipped. The portable test uses a Windows junction
on Windows and only reports an explicit skip if alias creation is refused by
the filesystem. A new Windows runner pass is still required.

Final local-link and privacy scan across twelve changed/added files found zero
missing local Markdown targets and zero absolute machine-specific user,
private or temporary paths. Reviewer attribution/link updates may follow;
they do not establish new runtime evidence.
