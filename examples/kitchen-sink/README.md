# Tron UI kitchen sink

An Expo app with actual Button, Card, TextField, NavigationRail and
NavigationShell fixtures. These are **proposed** stable targets; the app does not
approve stability or change the component manifest. It renders both public root
and direct imports and retains a shared draft while changing edge, text direction,
appearance and viewport width. All application state uses a per-instance vanilla
Zustand store. Orientation remains `default`.

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm --filter @nyc-tron/core --filter @nyc-tron/ui build
pnpm --filter @nyc-tron/kitchen-sink start
```

For a consumer that proves installed package bytes rather than workspace links:

```sh
node tooling/pack-release.mjs "$TMPDIR/tron-packs" --packages core,ui
node tooling/kitchen-sink/archive-index.mjs "$TMPDIR/tron-packs"
node tooling/kitchen-sink/prepare-consumer.mjs --packs "$TMPDIR/tron-packs" --destination "$TMPDIR/tron-consumer"
cd "$TMPDIR/tron-consumer"
npx --no-install expo export --platform web --output-dir web-export
```

The destination must be new. A source-bound archive index is mandatory; foreign
or unindexed same-version archives cannot be attributed to the current checkout.
The preparation tool verifies archive identities,
SHA256 digests, npm lockfile integrity and installed package resolution. Never
repack archives between test platforms. CI's reusable `kitchen-sink.yml` produces
`kitchen-candidate-archives` once and consumes those exact bytes in web, Android
and iOS jobs. The artifact contains the two tarballs, `candidate.json` and
`SHA256SUMS`. Platform artifacts are `kitchen-proof-web`,
`kitchen-proof-android` and `kitchen-proof-ios`.

The portable proof commands are:

```sh
node tooling/kitchen-sink/unit-proof.mjs --consumer "$CONSUMER" --tools "$BROWSER_TOOLS" --output "$EVIDENCE/unit.json"
node tooling/kitchen-sink/web-proof.mjs --consumer "$CONSUMER" --web-dir "$CONSUMER/web-export" --tools "$BROWSER_TOOLS" --output "$EVIDENCE/web.json"
node tooling/kitchen-sink/native-proof.mjs --consumer "$CONSUMER" --platform android --device "$DEVICE" --maestro "$MAESTRO_BIN" --output "$EVIDENCE"
```

Browser tools are an isolated npm package directory containing pinned Playwright,
axe-core, serve-handler and esbuild as specified in the workflow. Native proof
requires a new evidence output directory, an already installed release app and the repository's verified Maestro
installation. Local simulator/emulator installation, interaction and saved manual
QA use Argent; CI owns disposable runner devices.

Each passing receipt binds source commit, dirty flag, manifest hash, exact archive
versions and digests, test source, real process exit status, structured results,
logs and screenshots. Pass receipts are written only after their actual checks
complete. Native assertion counts are executed passing JUnit **flows**, not an
invented count of individual UI assertions. Dirty-source receipts cannot qualify
for release. Axe checks do not replace manual screen-reader and contrast review.

The app owns semantic light/dark tokens. A containing app must preserve readable
text, visible focus and sufficient input-edge contrast when replacing those
tokens. Rail Tab/Enter interaction is checked on web; full APG arrow-key behavior
is not claimed.
