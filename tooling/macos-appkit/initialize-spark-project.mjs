import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const consumer = process.argv[2] && resolve(process.argv[2]);
if (!consumer) throw new Error('Supply the generated AppKit consumer directory');
const manifest = JSON.parse(await readFile(join(consumer, 'package.json'), 'utf8'));
if (manifest.name !== 'nyc-tron-appkit-reference') throw new Error('Only the generated AppKit reference is initialized by this helper');
const cli = join(consumer, 'node_modules/@legendapp/spark/vendor/node_modules/@legendapp/spark-cli/dist');
const { initializeTemplate } = await import(pathToFileURL(join(cli, 'init-template.cjs')).href);
const { installedSparkVersion, migrateProject, planMigrations } = await import(pathToFileURL(join(cli, 'migrations.cjs')).href);
const version = installedSparkVersion(consumer);
if (version !== '0.0.3') throw new Error('Expected the pinned Spark 0.0.3 starter');
initializeTemplate(consumer);
// This is the new-project initialization used by Spark 0.0.3's create command.
// The generated source/config already targets this SDK; this is not an upgrade
// of an older app and must not be marked by editing .spark/version directly.
migrateProject(consumer, version, true, { fromVersion: version });
const remaining = planMigrations(consumer, version, { automatic: true });
if (remaining.versions.length || remaining.manualSteps.length) throw new Error('The Spark starter still has pending migrations');
console.info(`Initialized the Spark ${version} starter with its official template/migration helpers.`);
