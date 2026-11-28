import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { requireKitchenIosExecutionTarget } from './ios-execution-target.mjs';
const udid='C898E3E4-5033-4085-B886-963EE2D0C478';
const actualDevice=`iPhone Duo - iOS 27.2 - ${udid}`;
const xml=device=>`<testsuites><testsuite name="Test Suite" device="${device}" tests="1"><testcase status="SUCCESS"/></testsuite></testsuites>`;
test('retained actual ef8 passing report matches its selected device',()=>{
 const retained=readFileSync(new URL('./fixtures/ios-ef8-direct-report.xml',import.meta.url),'utf8');
 assert.equal(requireKitchenIosExecutionTarget(retained,udid).observedDevice,actualDevice);
});
test('exact measured pinned Maestro device format produces identity metadata',()=>{
  assert.equal(requireKitchenIosExecutionTarget(xml(actualDevice),udid).observedDevice,actualDevice);
});
for(const wrong of ['',`iPhone 17 - iOS 27.2 - ${udid}`,`iPhone Duo - iOS 27.1 - ${udid}`,`iPhone Duo - iOS 27.20 - ${udid}`,`${actualDevice} extra`,`prefix ${actualDevice}`,`iPhone Duo - iOS 27.2 - A898E3E4-5033-4085-B886-963EE2D0C478`]) test('wrong/blank/prefix device evidence is refused '+wrong,()=>{
 assert.throws(()=>requireKitchenIosExecutionTarget(xml(wrong),udid),/differs/);
});
for(const invalid of [xml(actualDevice).replace(' device=',` device="${actualDevice}" device=`),xml(actualDevice).replace('</testsuites>',`<testsuite device="${actualDevice}"></testsuite></testsuites>`),`<!--${xml(actualDevice)}-->`,xml(actualDevice).replace('device="','device=UNQUOTED'),xml(actualDevice).replace(' device="'+actualDevice+'"',''),`<!DOCTYPE x>${xml(actualDevice)}`,xml(actualDevice).replace('iPhone Duo','iPhone&#32;Duo')]) test('ambiguous or unsupported XML cannot supply identity',()=>{
 assert.throws(()=>requireKitchenIosExecutionTarget(invalid,udid));
});
test('invalid selected UDID cannot weaken comparison',()=>{assert.throws(()=>requireKitchenIosExecutionTarget(xml(actualDevice),''));});
test('collector checks actual identity for each iOS mode before screenshot/stage acceptance',()=>{
 const source=readFileSync(new URL('./native-proof.mjs',import.meta.url),'utf8');
 assert.match(source,/platform === 'ios' \? requireKitchenIosExecutionTarget\(junitText, device\)/);
 assert.ok(source.indexOf('requireKitchenIosExecutionTarget(junitText, device)')<source.indexOf('stages.push'));
 assert.match(source,/executionTarget \? \{ executionTarget \}/);
});

for (const malformed of [
 `<testsuites><?bogus <testsuite device="${actualDevice}" tests="1">?><testcase status="SUCCESS"/></testsuite></testsuites>`,
 xml(actualDevice).replace('<testsuites>','<testsuites><?bogus x?>'),
 xml(actualDevice).replace('</testsuite></testsuites>','</testsuites></testsuite>'),
 xml(actualDevice).replace('</testsuite>',''),
 xml(actualDevice)+'</testsuites>',
 xml(actualDevice).replace('<testcase','<testsuites><testcase'),
 xml(actualDevice).replace('status="SUCCESS"','status="SUCCESS" status="SUCCESS"'),
 ' '.repeat(65536)+xml(actualDevice),
]) test('bounded complete pinned XML shape rejects malformed or oversized input',()=>{
 assert.throws(()=>requireKitchenIosExecutionTarget(malformed,udid));
});

test('actual 334b inventory selects the same Duo UUID as retained ef8 passing JUnit', async()=>{
 const {selectKitchenIosDevice,KITCHEN_IOS_RUNTIME,KITCHEN_IOS_VERSION}=await import('./prepare-ios.mjs');
 const inventory=JSON.parse(readFileSync(new URL('./fixtures/ios-334b-available-devices.json',import.meta.url),'utf8'));
 const selected=selectKitchenIosDevice(inventory);
 assert.equal(selected.udid,udid);
 assert.equal(selected.runtime,'com.apple.CoreSimulator.SimRuntime.iOS-27-2-iPhone19-4');
 assert.equal(KITCHEN_IOS_VERSION,'27.2');
 const retained=readFileSync(new URL('./fixtures/ios-ef8-direct-report.xml',import.meta.url),'utf8');
 const executed=requireKitchenIosExecutionTarget(retained,selected.udid);
 assert.equal(executed.runtime,KITCHEN_IOS_RUNTIME);assert.equal(executed.version,'27.2');
});
for(const runtime of ['com.apple.CoreSimulator.SimRuntime.iOS-27-2','com.apple.CoreSimulator.SimRuntime.iOS-27-2-iPhone19-40','com.apple.CoreSimulator.SimRuntime.iOS-27-20-iPhone19-4']) test('generic or prefix runtime lookalike cannot select the Duo '+runtime, async()=>{
 const {selectKitchenIosDevice}=await import('./prepare-ios.mjs');
 assert.throws(()=>selectKitchenIosDevice({devices:{[runtime]:[{name:'iPhone Duo',udid,isAvailable:true,state:'Booted'}]}}),/no alternate-device or runtime fallback/);
});
