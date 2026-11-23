import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isMainModule } from '../library-components.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const json = file => JSON.parse(readFileSync(file, 'utf8'));
const run = (command, args, cwd) => {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.error || result.status !== 0) throw new Error(`${command} failed (${result.error?.message ?? result.status})`);
};
export function candidateArchives(packs) {
  return ['core', 'ui'].map(name => {
    const candidates = readdirSync(packs).filter(file => new RegExp(`^nyc-tron-${name}-[0-9][A-Za-z0-9.+-]*\\.tgz$`).test(file));
    if (candidates.length !== 1) throw new Error(`Expected exactly one candidate ${name} archive`);
    const filename = candidates[0], bytes = readFileSync(join(packs, filename));
    const manifest = JSON.parse(execFileSync('tar', ['-xzOf', join(packs, filename), 'package/package.json'], { encoding: 'utf8' }));
    if (manifest.name !== `@nyc-tron/${name}` || manifest.private !== true) throw new Error('Candidate archive identity/private contract differs');
    return { package: manifest.name, filename, version: manifest.version, sha256: sha256(bytes), integrity: 'sha512-' + createHash('sha512').update(bytes).digest('base64') };
  });
}
export function prepareConsumer({ packs, destination, sourceRoot = root, install = true }) {
  packs = realpathSync(resolve(packs)); destination = resolve(destination);
  if (existsSync(destination)) throw new Error('Consumer destination must be new; existing files are never replaced');
  const archives = candidateArchives(packs);
  if (new Set(archives.map(a => a.version)).size !== 1) throw new Error('Core and UI candidate versions differ');
  const indexPath = join(packs, 'candidate.json');
  if (!existsSync(indexPath)) throw new Error('A source-bound candidate index is required before preparing an installed consumer');
  const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: sourceRoot, encoding: 'utf8' }).trim();
  const sourceDirty = execFileSync('git', ['status', '--porcelain'], { cwd: sourceRoot, encoding: 'utf8' }).trim().length > 0;
  const indexed = json(indexPath);
  if (indexed.sourceCommit !== sourceCommit || indexed.sourceDirty !== sourceDirty || indexed.version !== archives[0].version ||
    JSON.stringify(indexed.archives) !== JSON.stringify(archives)) throw new Error('Downloaded candidate index does not match these archive bytes and source checkout');
  const app = join(sourceRoot, 'examples/kitchen-sink');
  mkdirSync(join(destination, 'vendor'), { recursive: true });
  for (const name of ['App.tsx', 'fixtures.tsx', 'model.ts', 'index.js', 'app.json', 'metro.config.js', 'tsconfig.json', 'css.d.ts', 'uniwind-types.d.ts', 'global.css', 'assets']) {
    cpSync(join(app, name), join(destination, name), { recursive: true });
  }
  const manifest = json(join(app, 'package.json'));
  for (const archive of archives) {
    cpSync(join(packs, archive.filename), join(destination, 'vendor', archive.filename));
    manifest.dependencies[archive.package] = `file:./vendor/${archive.filename}`;
  }
  writeFileSync(join(destination, 'package.json'), JSON.stringify(manifest, null, 2) + '\n');
  const installCommand = ['npm', 'install', '--allow-remote=all', '--no-audit', '--no-fund'];
  writeFileSync(join(destination, 'candidate.json'), JSON.stringify({ schemaVersion: 1, sourceCommit, sourceDirty,
    version: archives[0].version, archives, installCommand }, null, 2) + '\n');
  if (install) {
    run(installCommand[0], installCommand.slice(1), destination);
    verifyInstalledConsumer(destination);
  }
  console.log(`Kitchen consumer prepared: ${archives.length} candidate archives; ${archives[0].version}; source clean: ${!sourceDirty}; no release approval inferred.`);
  return { destination, archives, sourceCommit, sourceDirty };
}
export function verifyInstalledConsumer(destination) {
  const candidate = json(join(destination, 'candidate.json')), lock = json(join(destination, 'package-lock.json'));
  for (const archive of candidate.archives) {
    const installed = join(destination, 'node_modules', archive.package);
    if (!realpathSync(installed).startsWith(realpathSync(join(destination, 'node_modules')) + sep)) throw new Error('Consumer resolves a workspace/source link rather than an installed archive');
    const manifest = json(join(installed, 'package.json'));
    if (manifest.name !== archive.package || manifest.version !== archive.version) throw new Error('Installed package identity/version differs');
    if (sha256(readFileSync(join(destination, 'vendor', archive.filename))) !== archive.sha256) throw new Error('Candidate archive bytes changed');
    if (lock.packages?.[`node_modules/${archive.package}`]?.integrity !== archive.integrity) throw new Error('npm install integrity does not bind the candidate archive');
  }
  return candidate;
}
if (isMainModule(import.meta.url)) {
  const args = process.argv.slice(2), values = {};
  for (let i = 0; i < args.length; i += 2) {
    if (!['--packs', '--destination'].includes(args[i]) || !args[i + 1] || values[args[i]]) throw new Error('Usage: --packs <candidate-packs> --destination <new-consumer>');
    values[args[i]] = args[i + 1];
  }
  if (!values['--packs'] || !values['--destination']) throw new Error('Both packs and destination are required');
  prepareConsumer({ packs: values['--packs'], destination: values['--destination'] });
}
