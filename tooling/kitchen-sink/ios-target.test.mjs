import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { KITCHEN_IOS_RUNTIME, selectKitchenIosDevice, verifyKitchenIosReady } from './prepare-ios.mjs';
import { maestroFlowArguments } from './native-proof.mjs';
import { nativeFlow } from './native-flow.mjs';

const device = (name, udid, state = 'Shutdown') => ({ name, udid, state, isAvailable: true });
test('explicit regular iPhone on 27.0 wins over a booted Duo and newer runtime', () => {
  const selected = selectKitchenIosDevice({ devices: { [KITCHEN_IOS_RUNTIME]: [device('iPhone 17e','near'), device('iPhone 17','exact')], 'com.apple.CoreSimulator.SimRuntime.iOS-27-2': [device('iPhone Duo','duo','Booted')] } });
  assert.equal(selected.udid,'exact'); assert.equal(selected.runtime,KITCHEN_IOS_RUNTIME);
});
test('selection prefers an already booted exact target and remains deterministic', () => {
  assert.equal(selectKitchenIosDevice({ devices: { [KITCHEN_IOS_RUNTIME]: [device('iPhone 17','a'), device('iPhone 17','b','Booted')] } }).udid,'b');
});
for (const inventory of [{ devices: {} }, { devices: { [KITCHEN_IOS_RUNTIME]: [device('iPhone Duo','duo')] } }, { devices: { [KITCHEN_IOS_RUNTIME]: [{ ...device('iPhone 17','unavailable'), isAvailable:false }] } }]) test('missing exact available runtime/device fails without a fallback', () => {
  assert.throws(() => selectKitchenIosDevice(inventory), /no latest-runtime or Duo fallback/);
});
test('each iOS mode uses fresh default driver installation while Android behavior is retained', () => {
  const args = { device:'synthetic', junit:'/evidence/report.xml', directory:'/evidence', flow:'/evidence/flow.yaml' };
  assert.ok(!maestroFlowArguments({ ...args, platform:'ios' }).includes('--no-reinstall-driver'));
  assert.ok(maestroFlowArguments({ ...args, platform:'android' }).includes('--no-reinstall-driver'));
  for (const mode of ['direct','root']) { const flow=nativeFlow(mode); assert.match(flow, /- launchApp:\n    clearState: true/); assert.ok(flow.includes(`Rendering: ${mode} imports`)); }
});
test('the kitchen workflow invokes and retains its exact target preparation', () => {
  const workflow=readFileSync(new URL('../../.github/workflows/kitchen-sink.yml',import.meta.url),'utf8').replace(/\r\n/g,'\n');
  assert.match(workflow,/run: node tooling\/kitchen-sink\/prepare-ios\.mjs/);
  assert.doesNotMatch(workflow,/run: node tooling\/native\/prewarm-ios\.mjs/);
  assert.match(workflow,/name: kitchen-ios-target/);
  assert.match(workflow,/path: \$\{\{ runner.temp \}\}\/kitchen-ios-target\//);
});
test('post-boot readiness queries only the selected target and preserves its strict identity metadata', () => {
  const selected = selectKitchenIosDevice({ devices: { [KITCHEN_IOS_RUNTIME]: [device('iPhone 17','selected-udid')] } });
  const calls = [];
  const verified = verifyKitchenIosReady(selected, (args, label, timeout) => { calls.push({ args, label, timeout }); return args[1] === 'getenv' ? 'selected-udid\n' : 'Device already booted, nothing to do.\n'; });
  assert.deepEqual(calls, [
    { args:['simctl','bootstatus','selected-udid','-b'], label:'bootstatus', timeout:420000 },
    { args:['simctl','getenv','selected-udid','SIMULATOR_UDID'], label:'booted-device-identity', timeout:30000 },
  ]);
  assert.equal(verified.state,'Booted'); assert.equal(verified.name,'iPhone 17'); assert.equal(verified.runtime,KITCHEN_IOS_RUNTIME); assert.equal(verified.verification.udid,selected.udid);
  const source = readFileSync(new URL('./prepare-ios.mjs',import.meta.url),'utf8');
  assert.equal((source.match(/\['simctl', 'list', 'devices', 'available', '--json'\]/g) ?? []).length,1, 'Only initial selection may enumerate all runtimes');
  assert.match(source,/const verified = verifyKitchenIosReady\(selected, run\)/);
});
for (const identity of ['wrong-udid\n','']) test('post-boot identity mismatch or absence cannot produce readiness metadata', () => {
  assert.throws(() => verifyKitchenIosReady(device('iPhone 17','selected-udid'), args => args[1] === 'getenv' ? identity : ''), /identity differs/);
});
test('bootstatus failure aborts before the targeted identity query', () => {
  let calls = 0;
  assert.throws(() => verifyKitchenIosReady(device('iPhone 17','selected-udid'), () => { calls++; throw new Error('synthetic boot failure'); }), /synthetic boot failure/);
  assert.equal(calls,1);
});
test('targeted identity timeout is retained as failure instead of accepted readiness', () => {
  assert.throws(() => verifyKitchenIosReady(device('iPhone 17','selected-udid'), args => { if(args[1] === 'getenv') throw new Error('synthetic ETIMEDOUT'); return ''; }), /ETIMEDOUT/);
});
