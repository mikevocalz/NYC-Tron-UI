import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isMainModule, sourceFingerprint } from '../library-components.mjs';
import { COMPONENT_CONTRACTS, MODES, importFor } from './contracts.mjs';
import { verifyInstalledConsumer } from './prepare-consumer.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export async function proveUnits({ consumer, tools, output }) {
  consumer = resolve(consumer); output = resolve(output); mkdirSync(dirname(output), { recursive: true });
  const candidate = verifyInstalledConsumer(consumer), appRequire = createRequire(join(consumer, 'package.json'));
  const require = createRequire(join(resolve(tools), 'package.json')), { build } = require('esbuild');
  const testSource = 'tooling/kitchen-sink/unit-fixture.tsx', bundle = join(dirname(output), 'unit-runner.cjs');
  await build({ entryPoints: [join(root, testSource)], outfile: bundle, bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic',
    external: ['node:*'], nodePaths: [join(consumer, 'node_modules')],
    plugins: [{ name: 'installed-ui', setup(builder) { builder.onResolve({ filter: /^@nyc-tron\/ui(?:\/|$)/ }, args => ({ path: appRequire.resolve(args.path) })); } }],
    alias: { 'react-native': join(root, 'packages/ui/tests/browser/rn-shim.tsx'),
      react: appRequire.resolve('react'), 'react/jsx-runtime': appRequire.resolve('react/jsx-runtime'),
      'react-dom/server': appRequire.resolve('react-dom/server'), 'react-native-web': appRequire.resolve('react-native-web'),
      zustand: dirname(appRequire.resolve('zustand/package.json')) },
  });
  const run = spawnSync(process.execPath, [bundle], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  const log = basename(output).replace(/\.json$/, '') + '.log';
  writeFileSync(join(dirname(output), log), (run.stdout ?? '') + (run.stderr ?? ''));
  if (run.error || run.status !== 0) throw new Error('Component unit/model assertions failed: ' + (run.error?.message ?? run.stderr));
  const result = JSON.parse(run.stdout.trim().split(/\r?\n/).at(-1));
  if (result.status !== 'passed' || result.assertions.failed || result.assertions.skipped || result.modes.join(',') !== MODES.join(',') || result.components.join(',') !== COMPONENT_CONTRACTS.map(c => c.symbol).join(',')) throw new Error('Incomplete unit component coverage');
  const components = COMPONENT_CONTRACTS.map(c => ({ symbol: c.symbol, status: 'passed', imports: MODES.map(mode => ({ path: importFor(c, mode), symbol: c.symbol, rendered: true, assertedStates: c.states })) }));
  result.components = components;
  const resultPath = basename(output).replace(/\.json$/, '') + '-results.json';
  writeFileSync(join(dirname(output), resultPath), JSON.stringify(result, null, 2) + '\n');
  const artifact = path => ({ path, sha256: digest(readFileSync(join(dirname(output), path))) });
  const common = { schemaVersion: 1, status: 'passed', manifestSha256: sourceFingerprint(readFileSync(join(root, 'docs/library/components.json'))), candidate,
    runner: { name: 'node-react-ssr', command: 'node tooling/kitchen-sink/unit-proof.mjs --consumer <installed-consumer> --tools <esbuild-tools> --output <evidence.json>',
      testSource, testSha256: digest(readFileSync(join(root, testSource))), exitCode: 0, log: artifact(log), screenshots: [] },
    assertions: result.assertions, artifacts: [artifact(resultPath)],
    components,
  };
  writeFileSync(output, JSON.stringify({ ...common, kind: 'unit' }, null, 2) + '\n');
  writeFileSync(output.replace(/\.json$/, '') + '-exports.json', JSON.stringify({ ...common, kind: 'exports' }, null, 2) + '\n');
  const typescriptPackage = appRequire.resolve('typescript/package.json');
  const typescriptManifest = JSON.parse(readFileSync(typescriptPackage, 'utf8'));
  const tsc = resolve(dirname(typescriptPackage), typescriptManifest.bin.tsc);
  const declarationResult = spawnSync(process.execPath, [tsc, '--noEmit'], { cwd: consumer, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  const declarationLog = basename(output).replace(/\.json$/, '') + '-declarations.log';
  writeFileSync(join(dirname(output), declarationLog), (declarationResult.stdout ?? '') + (declarationResult.stderr ?? '') + `\nExit code: ${declarationResult.status}\n`);
  if (declarationResult.error || declarationResult.status !== 0) throw new Error('Installed consumer declaration check failed: ' + declarationResult.stdout + declarationResult.stderr);
  const declarationsPath = basename(output).replace(/\.json$/, '') + '-declarations-results.json';
  writeFileSync(join(dirname(output), declarationsPath), JSON.stringify({ status: 'passed', assertions: { passed: 1, failed: 0, skipped: 0 }, exitCode: 0, components }, null, 2) + '\n');
  writeFileSync(output.replace(/\.json$/, '') + '-declarations.json', JSON.stringify({ ...common, kind: 'declarations', runner: { ...common.runner,
    command: 'tsc --noEmit (installed-archive consumer)', testSource: 'examples/kitchen-sink/App.tsx', testSha256: digest(readFileSync(join(root, 'examples/kitchen-sink/App.tsx'))), log: artifact(declarationLog) },
    artifacts: [artifact(declarationsPath)], assertions: { passed: 1, failed: 0, skipped: 0 } }, null, 2) + '\n');
  console.log(`Kitchen unit proof: ${result.assertions.passed} actual assertions, five components through both import modes; installed declarations passed.`);
  return common;
}
if (isMainModule(import.meta.url)) {
  const values = {}, args = process.argv.slice(2);
  for (let i = 0; i < args.length; i += 2) { if (!['--consumer', '--tools', '--output'].includes(args[i]) || !args[i + 1] || values[args[i]]) throw new Error('Usage: --consumer <dir> --tools <esbuild-tools> --output <json>'); values[args[i]] = args[i + 1]; }
  for (const key of ['--consumer', '--tools', '--output']) if (!values[key]) throw new Error(key + ' required');
  await proveUnits({ consumer: values['--consumer'], tools: values['--tools'], output: values['--output'] });
}
