import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { isMainModule } from '../library-components.mjs';

export const KITCHEN_IOS_RUNTIME = 'com.apple.CoreSimulator.SimRuntime.iOS-27-0';
export const KITCHEN_IOS_DEVICE = 'iPhone 17';
export function selectKitchenIosDevice(inventory) {
  const candidates = (inventory.devices?.[KITCHEN_IOS_RUNTIME] ?? [])
    .filter(device => device.isAvailable === true && device.name === KITCHEN_IOS_DEVICE && typeof device.udid === 'string' && device.udid.length > 0)
    .sort((a, b) => Number(b.state === 'Booted') - Number(a.state === 'Booted') || a.udid.localeCompare(b.udid));
  if (!candidates.length) throw new Error('The kitchen requires the preinstalled iPhone 17 / iOS 27.0 simulator; no latest-runtime or Duo fallback is permitted');
  return { ...candidates[0], runtime: KITCHEN_IOS_RUNTIME };
}
export function verifyKitchenIosReady(selected, run) {
  run(['simctl', 'bootstatus', selected.udid, '-b'], 'bootstatus', 420000);
  const actualUdid = run(['simctl', 'getenv', selected.udid, 'SIMULATOR_UDID'], 'booted-device-identity', 30000).trim();
  if (actualUdid !== selected.udid) throw new Error('The booted simulator identity differs from the strictly selected iPhone 17 / iOS 27.0 target');
  return { ...selected, state: 'Booted', verification: { method: 'bootstatus and targeted SIMULATOR_UDID', udid: actualUdid } };
}

// This executable is exclusively for the disposable hosted CI runner. Local
// simulator control remains Argent-owned. Imports/tests exercise selection only.
if (isMainModule(import.meta.url)) {
  if (process.platform !== 'darwin' || process.env.GITHUB_ACTIONS !== 'true' || !process.env.RUNNER_TEMP || !process.env.GITHUB_ENV) throw new Error('Kitchen iOS preparation only runs on the hosted macOS CI runner');
  const output = resolve(process.env.RUNNER_TEMP, 'kitchen-ios-target'); mkdirSync(output);
  const run = (args, label, timeout) => {
    const result = spawnSync('xcrun', args, { encoding: 'utf8', timeout, maxBuffer: 4 * 1024 * 1024 });
    writeFileSync(join(output, label + '.log'), (result.stdout ?? '') + (result.stderr ?? '') + `\nExit code: ${result.status}\n`);
    if (result.error || result.status !== 0) throw new Error('Pinned iOS setup failed at ' + label + ': ' + (result.error?.code ?? result.status));
    return result.stdout;
  };
  try {
    const selected = selectKitchenIosDevice(JSON.parse(run(['simctl', 'list', 'devices', 'available', '--json'], 'available-devices', 90000)));
    if (selected.state !== 'Booted') run(['simctl', 'boot', selected.udid], 'boot', 90000);
    const verified = verifyKitchenIosReady(selected, run);
    writeFileSync(join(output, 'selection.json'), JSON.stringify({ ...verified, runtime: KITCHEN_IOS_RUNTIME }, null, 2) + '\n');
    appendFileSync(process.env.GITHUB_ENV, 'NYC_TRON_IOS_UDID=' + selected.udid + '\n');
    console.log('Prepared explicit ' + KITCHEN_IOS_DEVICE + ' / iOS 27.0 (' + selected.udid + '), built with the separately pinned Xcode 27.1 SDK.');
  } catch (error) { writeFileSync(join(output, 'failure.txt'), String(error.stack ?? error) + '\n'); throw error; }
}
