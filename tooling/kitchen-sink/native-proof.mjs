import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isMainModule, sourceFingerprint } from '../library-components.mjs';
import { MAESTRO, requirePassedFlow } from '../native/ui-evidence.mjs';
import { requireKitchenIosExecutionTarget } from './ios-execution-target.mjs';
import { COMPONENT_CONTRACTS, MODES, importFor } from './contracts.mjs';
import { nativeFlow } from './native-flow.mjs';
import { sha256, verifyInstalledConsumer } from './prepare-consumer.mjs';
import { maestroEnvironment, verifyMaestroVersion, POSTBOOT_PROBE_TIMEOUT_MS } from './maestro-version.mjs';
import { printFlowFailure } from '../native/flow-failure.mjs';

export { printFlowFailure };

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const files = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]);
export function maestroFlowArguments({ device, platform, junit, directory, flow }) {
  return ['--device', device, '--platform', platform, '--no-ansi', 'test',
    // iOS gets Maestro's default fresh XCTest-driver installation each mode.
    ...(platform === 'ios' ? [] : ['--no-reinstall-driver']), '--format', 'junit', '--output', junit,
    '--test-output-dir', join(directory, 'artifacts'), '--debug-output', join(directory, 'debug'), flow];
}
const simctl = (args, timeout) => {
  const result = spawnSync('xcrun', ['simctl', ...args], { encoding: 'utf8', timeout, maxBuffer: 4 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw new Error(`simctl ${args[0]} failed: ${result.error?.code ?? result.status} ${(result.stderr ?? '').trim()}`);
  return result.stdout ?? '';
};
const simulatorState = (device, run) => Object.values(JSON.parse(run(['list', 'devices', '--json'], 90000)).devices ?? {}).flat().find(entry => entry.udid === device)?.state ?? 'missing';
/** Maestro only drives a simulator that simctl reports as Booted. On 2026-11-28
 * (PR 94, kitchen-sink run 46164412328) the iPhone Duo stopped being one between
 * the app install and the first flow, and Maestro reported it "not connected".
 * Check before every flow, wait for the boot to finish, and print what was seen. */
export function requireBootedSimulator(device, run = simctl, write = text => process.stderr.write(text)) {
  const before = simulatorState(device, run);
  if (before !== 'Booted') write(`--- simulator ${device} was ${before} before the flow; waiting for bootstatus ---\n`);
  run(['bootstatus', device, '-b'], 420000);
  const after = before === 'Booted' ? before : simulatorState(device, run);
  if (after !== 'Booted') throw new Error(`Simulator ${device} is ${after}, not Booted, before the flow`);
  return { before, after };
}
/** Runs against an already installed release app. CI owns its ephemeral device lifecycle;
 * local device installation/launch and interactive QA use Argent. */
export function proveNative({ consumer, platform, device, maestro, output }) {
  if (!['ios', 'android'].includes(platform) || !device || !maestro) throw new Error('Native proof needs explicit platform, device and Maestro executable');
  consumer = resolve(consumer); output = resolve(output);
  const candidate = verifyInstalledConsumer(consumer), stages = [];
  // Never reuse a completed or failed run's files. Each invocation owns a new
  // output directory, and each flow can supply artifacts only from its stage.
  mkdirSync(dirname(output), { recursive: true });
  mkdirSync(output);
  verifyMaestroVersion({ maestro, output, timeoutMs: POSTBOOT_PROBE_TIMEOUT_MS });
  for (const mode of MODES) {
    const directory = join(output, mode); mkdirSync(directory);
    const flow = join(directory, 'flow.yaml'), junit = join(directory, 'report.xml');
    writeFileSync(flow, nativeFlow(mode));
    if (platform === 'ios') requireBootedSimulator(device);
    const command = maestroFlowArguments({ device, platform, junit, directory, flow });
    const result = spawnSync(maestro, command, { cwd: directory, encoding: 'utf8', timeout: 600000, maxBuffer: 32 * 1024 * 1024, env: maestroEnvironment() });
    const maestroLog = (result.stdout ?? '') + (result.stderr ?? '') + `\nExit code: ${result.status}\n`;
    writeFileSync(join(directory, 'maestro.log'), maestroLog);
    if (result.error || result.status !== 0) {
      // The log is also in the uploaded proof artifact; print its end so the
      // failing step is readable from the job log alone.
      process.stderr.write(`--- ${platform}/${mode} maestro.log (last 80 lines) ---\n` + maestroLog.split('\n').slice(-80).join('\n') + '\n');
      printFlowFailure({ label: `${platform}/${mode}`, junit, debug: join(directory, 'debug') });
      throw new Error(`${platform}/${mode} flow failed: ${result.error?.message ?? result.status}`);
    }
    const junitText = readFileSync(junit, 'utf8');
    const verdict = requirePassedFlow(junitText);
    const executionTarget = platform === 'ios' ? requireKitchenIosExecutionTarget(junitText, device) : undefined;
    const images = files(directory).filter(file => file.endsWith(`kitchen-${mode}-retained-shell.png`));
    const image = images[0];
    if (images.length !== 1 || readFileSync(image).subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('Missing or ambiguous current-stage native screenshot: ' + mode);
    stages.push({ importMode: mode, ...verdict, ...(executionTarget ? { executionTarget } : {}), flow: relative(output, flow), report: relative(output, junit), screenshot: relative(output, image) });
  }
  const artifact = path => ({ path, sha256: sha256(readFileSync(join(output, path))) });
  const components = COMPONENT_CONTRACTS.map(contract => ({ symbol: contract.symbol, status: 'passed', imports: stages.map(stage => ({ path: importFor(contract, stage.importMode), symbol: contract.symbol, rendered: true, assertedStates: contract.states })) }));
  // Counts describe executed JUnit flow cases, not an invented number of UI assertions.
  const assertions = { passed: stages.reduce((sum, stage) => sum + stage.executed, 0), failed: 0, skipped: 0 };
  const summary = { status: 'passed', platform, evidenceKinds: [platform], assertions, components, stages };
  const summaryPath = `${platform}-results.json`; writeFileSync(join(output, summaryPath), JSON.stringify(summary, null, 2) + '\n');
  const log = `${platform}.log`; writeFileSync(join(output, log), stages.map(stage => `PASS ${platform}/${stage.importMode}: ${stage.executed} executed JUnit flow`).join('\n') + '\n');
  const testSource = 'tooling/kitchen-sink/native-flow.mjs';
  const receipt = { schemaVersion: 1, kind: 'nyc-tron-library-render-evidence', platform, status: 'passed', candidate,
    manifestSha256: sourceFingerprint(readFileSync(join(root, 'docs/library/components.json'))), assertions, components,
    runner: { name: 'maestro', version: MAESTRO.version, command: 'node tooling/kitchen-sink/native-proof.mjs --consumer <installed-consumer> --platform ' + platform + ' --device <ephemeral-device> --maestro <pinned-maestro> --output <evidence-directory>',
      testSource, testSha256: sha256(readFileSync(join(root, testSource))), exitCode: 0, log: artifact(log), screenshots: stages.map(stage => artifact(stage.screenshot)) },
    artifacts: [artifact(summaryPath), artifact('maestro-version.json'), ...stages.flatMap(stage => [artifact(stage.report), artifact(stage.flow), artifact(`${stage.importMode}/maestro.log`)])],
    limits: ['JUnit counts are full executed flow cases; manual screen-reader speech and pixel contrast are separate reviews.', 'Dirty source is not release-candidate evidence.'] };
  writeFileSync(join(output, platform + '.json'), JSON.stringify(receipt, null, 2) + '\n');
  console.log(`Kitchen ${platform}: ${assertions.passed} actual passing JUnit flows, both import modes, five component contracts.`);
  return receipt;
}
if (isMainModule(import.meta.url)) {
  const args = process.argv.slice(2), options = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index]?.replace(/^--/, '');
    if (!['consumer', 'platform', 'device', 'maestro', 'output'].includes(key) || !args[index + 1] || options[key]) throw new Error('Usage: --consumer <dir> --platform ios|android --device <id> --maestro <executable> --output <dir>');
    options[key] = args[index + 1];
  }
  proveNative(options);
}
