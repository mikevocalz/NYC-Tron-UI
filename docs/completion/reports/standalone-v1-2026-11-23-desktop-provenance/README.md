# rc.3 desktop declaration provenance refresh

The rc.3 candidate changes all sixteen package versions and three internal peer constraints. The isolated desktop declaration graphs consequently identify their core/windows-fluent dependencies as rc.3 rather than rc.2. This follow-up updates those dependency provenance identities, not public props, types, exports or platform support.

The original rc.2 snapshot bytes are preserved here as `api-signatures-windows-rc2.json` and `api-signatures-macos-rc2.json`, with scoped `-text` attributes for Windows checkout preservation. `proof.json` binds those originals and the regenerated candidate snapshots by SHA256. These originals supersede any assumption that a current rc.3 snapshot is still the original rc.2 file; historical records and acceptance claims are otherwise unchanged.

`node tooling/desktop-provenance.mjs` checks the complete original byte sequence after reversing only internal graph identity locations for @nyc-tron/core and @nyc-tron/windows-fluent. Reversal changes dependency identity keys, symbol/reference IDs and corresponding external record version metadata. It never changes signature text, export conditions, external package versions, compiler version or other fields. Identity-key collisions fail closed. The proof is a release-specific audit and is not called by the live API signature checker, which remains unchanged and exact.

## Reproduction and outcomes

The Windows fixture used TypeScript 5.9.3, React 19.2.3, React Native 0.85.3, React Native Windows 0.85.0 and @types/react 19.3.0. The package's existing ^19.2.0 range permits that reviewed-baseline version. An initial local fixture had @types/react 19.2.0 and emitted different JSX references; that candidate was rejected. Only the isolated fixture's React types resolution was corrected before generating the accepted candidate. No package/dependency declaration or API checker was changed.

The macOS/Spark fixture used TypeScript 5.9.3, React 19.2.0, @types/react 19.2.18, React Native 0.83.10, React Native macOS 0.83.0, Nitro 0.37 and Spark 0.0.3. Both fixtures compiled the unchanged source in an isolated worktree with their existing pinned desktop compilers. The peer builder wrote only this worktree's generated core/windows declarations.

The exact commands were:

```sh
node packages/windows-fluent/rnw-fabric/scripts/build-peers.mjs
node packages/windows-fluent/rnw-fabric/node_modules/typescript/bin/tsc -p packages/windows-fluent/rnw-fabric/tsconfig.build.json
node packages/macos-appkit/spark/node_modules/typescript/bin/tsc -p packages/macos-appkit/spark/tsconfig.build.json
node tooling/api-signatures.mjs --package packages/windows-fluent/rnw-fabric --snapshot docs/api-signatures-windows.json
node tooling/api-signatures.mjs --package packages/macos-appkit/spark --snapshot docs/api-signatures-macos.json
node tooling/desktop-provenance.mjs
node --test tooling/tests/desktop-provenance.test.mjs tooling/tests/api-signatures.test.mjs
node tooling/library-components.mjs
npm --prefix website run verify
```

The strict isolated signature checks passed: Windows has nine subpaths and fifty reachable declarations; macOS has sixteen subpaths and forty-two reachable declarations. Complete reverse provenance equality passed for all 56,044 Windows bytes and all 66,178 macOS bytes. All fifteen API/provenance tests passed, including incompatible property types, deleted public exports, unrelated external version changes, identity-key collisions and public string-literal version changes.

Manifest regeneration preserves all 478 public component IDs, their proposed/actual stability and owner labels, 456 component declaration identities, and the proposal digest `8d7ced4037b258344a48a3659ea01a97694052824b1ad670e30ce6582f281f40`. The derived manifest changes two snapshot hashes and one excluded external type identity. Documentation metadata changes only its source-manifest hash; each component's page/data/source/example SHA remains unchanged. Native builds/runtime and publication/owner approval are not inferred from these checks. Documentation verification is recorded separately in its generated receipt.

Final documentation verification passed against this candidate’s own server: all 478 typed examples, four catalog tests and five Chromium browser tests passed with zero skips/failures; the browser covered all 478 exact route/import/label identities and eight automated AA template/viewport scans with zero violations (36.6 seconds). Its generated verification receipt binds the refreshed manifest and actual page/data/source/example artifacts. This is web documentation evidence, not native platform acceptance.
