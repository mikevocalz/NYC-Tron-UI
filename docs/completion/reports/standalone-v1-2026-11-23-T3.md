# T3: standalone library release gate candidate

Prepared 2026-11-23 UTC on reviewed technical base `26742419a77dab1bc58704c238e9982b6e107069`. This is a separately reviewed candidate, not a landed release policy, published release or owner decision. T1/T2/T4 remain subject to owner merge sequencing.

The release policy reads the complete generated library export inventory rather than the historical Forge application program. It regenerates all 478 public component exports across sixteen packages before checking evidence; deleting an export from the input cannot reduce the required scope. The current manifest retains null final labels and pending owner confirmation. Its ten proposed stable public imports are planning targets only.

Confirmed stable imports need export, declaration, unit/model, static accessibility, rendered-web, installed-tarball iOS and installed-tarball Android receipts and generated component documentation. Candidate version, clean source revision, raw archive SHA256s, manifest fingerprint, executable source, log, screenshots and structured assertions/import-state coverage are bound. Wrong archives/candidates, stale files, failed/skipped/empty checks and another component's proof fail. Runtime screenshots must be PNG artifacts. The docs contract binds actual page, data, source and example bytes; actual complete typecheck and unskipped browser results must back its receipt. Preview runtime checks do not block publication, while preview docs and a visible preview label remain required.

The optional stability-review configuration keeps pending/null unchanged. Confirmation requires the known owner, explicit decision reference, complete ID-to-label map and export/proposal structural digest. Missing/extra IDs, changed proposals, conflicting declaration aliases and an all-preview shortcut fail. This configuration never supplies authenticated archive distribution approval.

The exact owner distribution functions remain byte-for-byte unchanged, protected by a source-hash regression: same authenticated owner comment, exact statement, version and sixteen-archive SHA256SUMS byte binding. Source LF normalization does not normalize archive/checksum bytes. No public library API or owner approval/acceptance record changes.

The temporary active program bridge is removed. Historical readers reside in the dated archive; original archived bytes remain unchanged. Qt tests are explicit historical work rather than normal standalone release discovery. Its original pre-accessibility source graph/report is frozen with original revision and byte hashes in `2026-11-23-qt-case-study`; its test validates that graph, not current source. Optional current audits remain available through `pnpm verify:qt`.

## Actual verification

Applied project no-ai-slop/foldable-layout guidance and the exact standalone engineering code-review procedure. This implementation still requires a different independent reviewer; it does not review itself.

```sh
node --test tooling/tests/collect-library-evidence.test.mjs tooling/tests/library-readiness.test.mjs tooling/tests/release-readiness.test.mjs tooling/tests/legacy-program-handoff.test.mjs tooling/tests/test-files.test.mjs tooling/tests/library-components.test.mjs tooling/tests/historical/qt-component-coverage.test.mjs
```

Actual complete output, exit 0:

```text
✔ collector preserves missing checks rather than inventing successful receipts (37.608875ms)
✔ tested archive merge reuses exact bytes and forbids repacked replacements (38.039125ms)
✔ dirty, wrong-revision, wrong-version and tampered candidate archives fail (90.641ms)
✔ the dated map preserves its pinned source graph, frozen roster and unverified acceptance (22.457333ms)
✔ generated-report validation accepts Windows checkouts but rejects stale content and whitespace (60.375ms)
✔ row validation rejects scope loss, unsupported mappings and static-to-runtime promotion (74.302084ms)
✔ runtime export selection respects condition order and excludes declarations (0.250042ms)
✔ selected package paths follow actual target-relative imports without counting unused mobile providers (9.919083ms)
✔ explicit relative filenames preserve the emitted file instead of selecting a platform variant (2.958084ms)
✔ runtime imports expose missing APIs and native providers while type-only imports stay erased (5.695584ms)
✔ computed imports, namespace APIs and unresolved local edges remain visible (3.496167ms)
✔ mixed import and require edges select distinct internal package conditions (4.208709ms)
✔ the cross-repository public API check rejects drift instead of assuming generic RN parity (2.4485ms)
✔ old ledger links resolve to a pinned Forge home while the historical record retains all row fields (945.3145ms)
✔ lookup accepts the adopted ledger's pinned source links without inventing external imports (28.233375ms)
✔ archive checkout attributes preserve frozen bytes and the reader rejects changed historical values (68.566166ms)
✔ archive CLI validates through a symlink or Windows junction and rejects a tampered archive (700.903334ms)
✔ every current component export is inventoried across workspace and desktop packages, without alias loss (1856.801833ms)
✔ semantic classifier resolves compound and alias declarations and rejects unresolved component returns (129.509167ms)
✔ ambiguous graph imports fail rather than selecting the first declaration (0.164583ms)
✔ export and condition drift fail before any manifest is accepted (2177.239375ms)
✔ lookup accounts for baseline and added rows independently and never fabricates external imports (16.1645ms)
✔ CRLF checkout text preserves complete inventory fingerprints and generated checks without hiding value drift (5752.270458ms)
✔ CLI entry guards safely ignore stdin and non-entry imports (147.578375ms)
✔ both CLIs run and reject drift when invoked through a symlink or Windows junction (4604.344041ms)
✔ pending owner labels remain null; proposal readiness never passes (1852.7485ms)
✔ owner label map binds every export and proposal to an explicit owner decision (863.084166ms)
✔ stable missing evidence blocks while preview runtime evidence is not required (2478.978375ms)
✔ complete synthetic fixture passes without mutating records (1329.629625ms)
✔ public export deletion cannot reduce the required inventory (1628.137625ms)
✔ receipt rejects wrong candidate/archive, stale source, unrun checks and changed artifact bytes (799.424625ms)
✔ proof for another export does not satisfy the selected component (1611.9515ms)
✔ dirty source is reported as a release blocker (1263.258417ms)
✔ evidence paths cannot escape through traversal or symlinks (814.046458ms)
✔ owner distribution algorithms and exact archive byte binding remain unchanged (0.2585ms)
✔ source immutability hash accepts CRLF checkouts but detects changed owner logic (0.21775ms)
✔ documentation binds page, source, data and example bytes to executed verification (1562.31775ms)
✔ documentation receipt cannot borrow route or example proof from another manifest (1180.954209ms)
✔ structured results must agree with the claimed assertions and import coverage (799.242375ms)
✔ one declaration cannot carry conflicting alias stability promises (799.895833ms)
✔ rendered route proof verifies labels in an SPA shell instead of raw HTML text (1192.597708ms)
✔ wrong executed badge or route cannot satisfy a preview documentation contract (2543.107292ms)
✔ rehashing built data cannot substitute a different stability label (1303.885708ms)
✔ actual kitchen install token array is accepted; substring commands cannot impersonate an install (844.005875ms)
✔ web proof cannot be relabeled as an iOS or Android mount (849.032208ms)
✔ native proof cannot be transplanted to a different executed platform (851.049459ms)
✔ SSR proof cannot be relabeled as TypeScript declarations or accessibility execution (840.838959ms)
✔ executed result evidence kind is bound independently of receipt labels (835.388459ms)
✔ PNG signature stubs and truncated screenshots cannot establish render evidence (1656.066334ms)
✔ release versions distinguish stable from actual prereleases and reject malformed semver (1.451958ms)
✔ prerelease packaging reports library blockers without fetching or inventing owner approval (1818.406ms)
✔ stable requires real evidence for its own stable export instead of historic program rows (1270.206417ms)
✔ stable cannot publish from pending, incomplete or locally forged distribution review (1232.050333ms)
✔ stable owner approval must authenticate the exact author, repository, statement, version and bytes (6470.433833ms)
✔ stable requires and verifies all sixteen archive hashes, including both isolated desktop packages (1227.035083ms)
✔ omitting the AppKit archive cannot silently restore the older fourteen-package inventory (801.619208ms)
✔ an authenticated approval for prior checksums cannot authorize a later artifact inventory (1586.412958ms)
✔ only complete platform acceptance and a live exact owner approval can make stable ready without mutation (1197.403875ms)
✔ release retains candidate archives before readiness and requires both native desktop hosts plus reference evidence (3.390375ms)
✔ explicit prerelease library requirement blocks missing proof but never authenticates stable distribution (1967.0825ms)
✔ discovery lists every package test directory, not a hand-kept subset (0.876875ms)
✔ discovery skips Playwright browser suites and fixtures (0.389208ms)
✔ discovery returns forward-slash relative paths, sorted (1.185542ms)
✔ Qt downstream case-study verification is optional historical work (0.173083ms)
ℹ tests 64
ℹ suites 0
ℹ pass 64
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 28130.243708
```

Actual stable CLI, exit 1 as required:

```sh
node tooling/release-readiness.mjs --version 1.0.0 --output docs/completion/reports/standalone-v1-2026-11-23-T3-readiness.json
```

```text
Release readiness: stable publication blocked: owner stable/preview confirmation is pending; release evidence requires a clean source commit; owner distribution review is pending; the sixteen actual release archives and SHA256SUMS are required
```

The adjacent JSON preserves each proposed target's seven checks as NOT RUN and missing docs verification. It does not silently consume proposed labels or turn absent T5 artifacts into a pass. The working source is dirty during preparation. Current T5 local receipts likewise identify dirty source and cannot authorize release. Whole-workspace build/typecheck, hosted CI, installed native mount execution and publication were NOT RUN by this T3 implementation pass; their real collectors and separate reviews retain their own evidence.

## Integration handoff

Core T3 is frozen independently of unlanded T5 files. The collector can index real proof descriptors and retain the exact tested core/UI archive bytes, verifying all inputs before mutation and forbidding replacement by freshly repacked files. Its tests use clearly labeled synthetic fixtures, never production evidence.

A separate prepared T6 workflow delta connects the T5 reusable kitchen workflow, downloads its candidate and platform artifacts, packs the other twelve workspace packages, reuses exact tested core/UI bytes, verifies exact-source docs and supplies the strict evidence index to readiness before publication. That delta is retained outside this T3 candidate as `tron-release-integration.patch` for the lead; apply only after T5 technical integration. T3 does not reference absent workflows or build an invalid stack. No remote commit, push, merge, release, approval or final label was performed by this implementation agent.

## Review-driven interoperability corrections

The preview label is verified from actual checksum-bound browser route results,
not raw SPA bootstrap HTML. The exact component ID, route, import, symbol,
visible badge and owner-confirmation status must agree with built data and the
manifest. Added regressions cover a valid empty SPA shell, wrong route/badge,
and rehashed data with a changed stability value.

The actual kitchen producer records install commands as token arrays. Runtime
receipts now require exact `npm`, `install` tokens and nonempty arguments;
substring commands such as `echo npm install` cannot impersonate installation.
The fixture uses the actual producer's array format.

`--require-library` explicitly requires complete library readiness and all
sixteen archives for prerelease publication. Ordinary candidate packaging keeps
its diagnostic mode. No owner distribution authentication is fetched for a
prerelease; stable releases retain the unchanged exact approval rule. The T6
integration patch now supplies this flag.

Actual strict rc.3 CLI, exit 1:

```sh
node tooling/release-readiness.mjs --version 1.0.0-rc.3 --require-library --output docs/completion/reports/standalone-v1-2026-11-23-T3-rc3-readiness.json
```

```text
Release readiness: required library publication checks blocked: owner stable/preview confirmation is pending; release evidence requires a clean source commit; the sixteen actual release archives and SHA256SUMS are required
```

The final relevant suite has 64 passing tests, zero failures and zero skips.
Independent review belongs to the separately assigned reviewer; these fixes do
not act as self-approval.

The final portability regression normalizes CRLF only for the protected source
algorithm fingerprint; archive/checksum hashing remains raw-byte exact. The
path-escape fixture uses a real temporary outside file and a directory alias
(Windows junction), with traversal validation always executed.

Actual final T5 docs interoperability check (read-only, exit 0): the strict
validator accepted the real checksum-bound documentation receipt and 478 exact
executed route/label records, with zero documentation issues among the ten
proposed stable import targets. Overall release status stayed blocked by owner
confirmation pending and dirty preparation source. The actual T5 evidence was
read in its separate checkout, not copied into T3 or promoted to release proof.
The source-frozen T5 receipt contains 28 independently checked artifact hashes.

## Independent review: execution provenance corrections

The assigned reviewer found that platform/kind flags could transplant another
check's result and that a PNG signature alone was insufficient. The corrected
gate binds all seven evidence kinds to known runner and executable-source
contracts and the actual structured summary's `evidenceKinds`. Runtime summaries
also bind their executed platform. A Playwright web result cannot satisfy a
Maestro iOS/Android mount, Android cannot satisfy iOS, and SSR cannot masquerade
as TypeScript or axe execution. Static accessibility requires its actual raw
zero-violation axe cases. The producer metadata additions are isolated in the
separate reviewed kitchen follow-up; old receipts remain ineligible rather than
being relabeled or promoted.

Screenshots are decoded with the existing dependency-free PNG codec and must
have positive dimensions and a complete ending chunk. Positive synthetic
fixtures now contain valid PNGs. Negative regressions reject signature-only and
truncated files, wrong runtime runner/platform, wrong kind and mismatched
executed results. The final complete output above is 64 passed, 0 failed and 0
skipped. Both stable and strict rc.3 CLI commands were rerun against this final
source and retained the honest blockers shown above. No owner distribution
function or raw archive hashing changed.
