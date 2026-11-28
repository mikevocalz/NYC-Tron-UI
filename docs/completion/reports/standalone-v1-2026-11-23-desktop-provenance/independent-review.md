# Independent desktop API provenance follow-up review

Verdict: PASS for this draft provenance correction; native-host runtime and publication remain pending.

Reviewer: skill_discovery, independent of implementation by tron_docs. Applied standalone engineering code-review skill knowledge-work-plugins/engineering/1.2.0/skills/code-review/SKILL.md. No implementation files changed by reviewer.

Both regenerated desktop graphs change only allowed internal dependency identities from rc.2 to rc.3. The full originals are archived byte-for-byte, scoped -text attributes protect historical bytes on Windows, and a release-specific proof reverses known identity positions before comparing the complete original byte sequence. Windows: 56,044 original bytes, SHA25656f953c9b3029d46f7933d3e72713274523aad92079544223f66b705dc6e5f84. macOS: 66,178 original bytes, SHA25646e874ca518cd5890bb4a927c9563bc7bab2c55323a9be4195226d6e45921a29. Reviewer independently compared both archives against git HEAD originals and ran the whole-byte proof successfully.

Review findings resolved: the initial broad string relabel could hide a public string-literal type change, and mapped duplicate keys could conceal graph entries. Final proof changes only symbol/reference dependency IDs, external identity keys and scoped internal dependency version metadata; signature text and export conditions remain untouched, and key collisions fail closed. Dedicated negative tests reject both cases. The new CLI uses the shared realpath-aware entrypoint guard. The live API checker is byte-identical to baseline and does not call this release-specific normalization.

Independent verification: six provenance tests plus nine API checker tests passed with zero failures/skips. Negatives preserve rejection of real selectedId string-to-number drift, removed exports, unrelated external versions, unresolved references and platform routing changes. Actual strict TypeScript5.9.3 graph checks passed for both isolated compiled package fixtures: Windows nine subpaths/fifty reachable declarations, macOS sixteen subpaths/forty-two reachable declarations. This proves declaration compatibility for those fixtures, not a native application run. The implementation report discloses the initially rejected React-type-resolution mismatch and scoped correction to the reviewed Windows baseline.

Readonly inventory generation passed: sixteen packages, 478 public component exposures, 456 declaration identities. All 478 component records and all documentation component records independently compare equal to base. Changes are the two snapshot input hashes, one excluded external type identity and documentation manifest hash; proposed stability/owner state is preserved. Independently ran the consuming documentation-verification validator against the actual generated receipt, exact manifest, all478 IDs and SHA-bound artifacts; it passed. Writer's full docs run is attributed: 478 typed examples, four unit tests, five browser tests, exact478 route/label checks and eight automated accessibility scans passed. Reviewer checked its bound receipt/artifacts rather than rerunning all browser cases. git diff --check passed.

No source API, dependency manifest, native build configuration, window/orientation, owner labels, distribution approval or Forge pin is changed by this patch. Previous hosted failures remain failures; this baseline correction requires the subsequent hosted strict checks. No release, tag, merge or publication was performed or approved.

## Reviewed SHA-256 bindings

Repository-relative paths, base496009c7. Generated browser evidence remains in the actual development verification output; it is not a fabricated native receipt.

```json
{
  ".gitattributes": "d24f5fd1c0d9eff852586f3508beccb205da57ce0effbf62d3f4149844bc5d3c",
  "docs/api-signatures-macos.json": "b3fa3e331b2650dcf85c15d638971b1742edd1d152f8f0b03dd6fe93d2ff5cb5",
  "docs/api-signatures-windows.json": "bc2b17af08ce181012e79b0941b9ba2e767585721c68ece1d4d5f3b1eaa2c8c3",
  "docs/completion/reports/standalone-v1-2026-11-23-desktop-provenance/README.md": "e9457d89232b21198217521e6e27703cf4407440970885adbbf350cbd2d3c26f",
  "docs/completion/reports/standalone-v1-2026-11-23-desktop-provenance/api-check-tests.log": "08600e209a8a6ca0368760dc5ba2e09bcb51b51c7d12b9132fa824508ab02866",
  "docs/completion/reports/standalone-v1-2026-11-23-desktop-provenance/api-signatures-macos-rc2.json": "46e874ca518cd5890bb4a927c9563bc7bab2c55323a9be4195226d6e45921a29",
  "docs/completion/reports/standalone-v1-2026-11-23-desktop-provenance/api-signatures-windows-rc2.json": "56f953c9b3029d46f7933d3e72713274523aad92079544223f66b705dc6e5f84",
  "docs/completion/reports/standalone-v1-2026-11-23-desktop-provenance/proof.json": "dd2ff2cd531600a193b9949b346e1c30ddf9e5f6f97699b0a4b9b271e92118b8",
  "docs/library/components.json": "83a8f926b34acaa150442f9533f4e6c05f7dbd926e2e905c5e313e6128614bd6",
  "docs/library/documentation.json": "c479f19243a69b062a4d612026f62e55ff2c099254386ae1e6026d9223f7ccc0",
  "tooling/desktop-provenance.mjs": "ec8ed5cf34428d6a5f564977afdef41b9fcc1f52fb83cd8aee2b51049056913b",
  "tooling/tests/desktop-provenance.test.mjs": "6d64fccacae327efa6e8ed514e2bd192bf2a2836695c5f9d477fa4a3f3e68f0c"
}
```
