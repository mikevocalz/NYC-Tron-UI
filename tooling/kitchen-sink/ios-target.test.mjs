import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { KITCHEN_IOS_RUNTIME, KITCHEN_IOS_DEVICE, selectKitchenIosDevice, verifyKitchenIosReady } from './prepare-ios.mjs';
import { maestroFlowArguments } from './native-proof.mjs';
import { nativeFlow } from './native-flow.mjs';

const device = (name, udid, state = 'Shutdown') => ({ name, udid, state, isAvailable: true });
test('explicit Duo on 27.2 wins over other booted runtimes', () => {
  const selected = selectKitchenIosDevice({ devices: { [KITCHEN_IOS_RUNTIME]: [device('iPhone 17','near'), device('iPhone Duo','exact')], 'com.apple.CoreSimulator.SimRuntime.iOS-27-1': [device('iPhone Duo','duo','Booted')], 'com.apple.CoreSimulator.SimRuntime.iOS-27-0': [device('iPhone 17','older','Booted')] } });
  assert.equal(selected.udid,'exact'); assert.equal(selected.runtime,KITCHEN_IOS_RUNTIME);
});
test('the runtime and device pins match the documented measured target', () => {
  assert.equal(KITCHEN_IOS_RUNTIME,'com.apple.CoreSimulator.SimRuntime.iOS-27-2');
  assert.equal(KITCHEN_IOS_DEVICE,'iPhone Duo');
});
test('selection prefers an already booted exact target and remains deterministic', () => {
  assert.equal(selectKitchenIosDevice({ devices: { [KITCHEN_IOS_RUNTIME]: [device('iPhone Duo','a'), device('iPhone Duo','b','Booted')] } }).udid,'b');
});
for (const inventory of [{ devices: {} }, { devices: { 'com.apple.CoreSimulator.SimRuntime.iOS-27-1': [device('iPhone Duo','wrong-runtime','Booted')] } }, { devices: { [KITCHEN_IOS_RUNTIME]: [device('iPhone 17','wrong-device')] } }, { devices: { [KITCHEN_IOS_RUNTIME]: [{ ...device('iPhone Duo','unavailable'), isAvailable:false }] } }]) test('missing exact available runtime/device fails without a fallback', () => {
  assert.throws(() => selectKitchenIosDevice(inventory), /no alternate-device or runtime fallback/);
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
test('preparation requires bootstatus only and defers identity to actual execution', () => {
  const selected = selectKitchenIosDevice({devices:{[KITCHEN_IOS_RUNTIME]:[device('iPhone Duo','selected')]}});
  const calls=[];
  const result=verifyKitchenIosReady(selected,(...args)=>{calls.push(args); return 'already booted';});
  assert.deepEqual(calls,[[['simctl','bootstatus','selected','-b'],'bootstatus',420000]]);
  assert.equal(result.state,'Booted');
  const source=readFileSync(new URL('./prepare-ios.mjs',import.meta.url),'utf8');
  assert.doesNotMatch(source,/getenv|SIMULATOR_UDID/);
});
test('bootstatus failure remains fatal', () => {
  assert.throws(()=>verifyKitchenIosReady(device('iPhone Duo','selected'),()=>{throw new Error('boot failed');}),/boot failed/);
});
