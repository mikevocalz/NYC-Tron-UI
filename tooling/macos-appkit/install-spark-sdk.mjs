import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const consumer = process.argv[2] && resolve(process.argv[2]);
if (!consumer) throw new Error('Supply the isolated consumer directory');
const installed = join(consumer, 'node_modules/@legendapp/spark');
const sdk = JSON.parse(await readFile(join(installed, 'package.json'), 'utf8'));
if (sdk.version !== '0.0.2') throw new Error('Expected Spark 0.0.2 before preparing its native SDK inputs');
// Use the same versioned release helpers as Spark's official `create` command.
// They validate the embedded release manifest and every downloaded size/hash.
const releaseModule = await import(pathToFileURL(join(installed, 'vendor/node_modules/@legendapp/spark-cli/dist/release.js')).href);
const release = releaseModule.installedRelease();
if (!release || release.version !== sdk.version) throw new Error('Spark published native SDK manifest is missing');
await releaseModule.materializeReleasePackages(release, consumer);
releaseModule.verifyMaterializedReleasePackages(release, consumer);
const path = join(consumer, 'package.json');
const pkg = JSON.parse(await readFile(path, 'utf8'));
for (const [name, specifier] of Object.entries(releaseModule.packageSources(undefined, release))) {
  // This generated consumer stays at this path for the entire acceptance run.
  // npm resolves a relative file override on optional peers from the requesting
  // package's directory; root-absolute files preserve the verified archive.
  const source = specifier.startsWith('file:') ? `file:${resolve(consumer, specifier.slice(5))}` : specifier;
  if (pkg.dependencies[name]) pkg.dependencies[name] = source;
  if (!pkg.overrides) pkg.overrides = {};
  pkg.overrides[name] = source;
}
await writeFile(path, JSON.stringify(pkg, null, 2) + '\n');
await writeFile(join(consumer, 'spark-sdk-inputs.json'), JSON.stringify({ schemaVersion: 1, version: release.version, upstreamRevision: release.revision, packages: release.packages }, null, 2) + '\n');
console.info(`Prepared hash-verified native inputs from the Spark ${sdk.version} release manifest.`);
