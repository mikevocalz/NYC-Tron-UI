# rc.3 release candidate checklist

Status: **draft; publication blocked**. This checklist does not create a tag,
release, npm publication or approval. The intended version is `1.0.0-rc.3` across
all sixteen archives. Every package remains private and distribution remains
GitHub Release tarballs.

| Requirement | Observed state |
| --- | --- |
| Sixteen package versions and exact internal desktop peers | Prepared at rc.3; native peer/runtime pins and public APIs unchanged. |
| Workspace build and package/export/declaration checks | Fourteen workspace packages and both isolated desktop TypeScript packages built and packed; all sixteen development archives pass inventory/hash verification. Native desktop runtime checks remain their CI jobs' responsibility. |
| Unit, contract and source checks | 1,340 passed, zero failed or skipped, in the local integrated draft. |
| Frozen dependency graph | Offline frozen lockfile-only validation passed for all eighteen workspaces; no new version resolution required. |
| Built documentation | 478 routes and examples verified, five browser tests passed, zero automated AA violations. This local run does not imply a clean release candidate. |
| Exact candidate library receipts | Required; no rc.3 web, iOS or Android release-eligible receipt has been recorded in this draft. rc.2 or dirty local receipts cannot substitute. |
| Exact sixteen-archive checksum list | Sixteen actual development archives are available locally, with a verified checksum list. They are dirty-source packaging artifacts, not clean/native-tested release receipts. Publication still requires exact tested desktop archives from the native jobs. |
| Stable/preview labels | Owner confirmation pending for all 478 public component exposures. No proposal promoted. |
| Stable distribution approval | Pending, approval null; the existing owner/version/checksum/comment algorithm is unchanged. This stable-only rule is separate from the required prerelease library gate. |
| Prerequisite changes | Reviewed slices are layered for technical integration. Their owner merges and the release proposal review remain outstanding. |
| Forge consumer update | Keep rc.2 until rc.3 actually exists. The later F3 install cannot be demonstrated using an unpublished URL. |

Before publication, review and merge the prerequisite slices, confirm the exact
stable/preview proposal through the existing owner flow, and run every required
workflow from the final clean candidate source. Preserve the candidate archives,
documentation output and all actual receipt artifacts. Read the strict readiness
result before creating any tag or release. For stable publication, obtain the
owner's approval for the final sixteen-archive checksum binding.

The release workflow always supplies `--require-library`, including rc.3, so a
prerelease tag cannot bypass missing library evidence or pending stability labels.
No npm publishing flow is introduced.
