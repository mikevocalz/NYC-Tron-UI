import test from 'node:test';
import assert from 'node:assert/strict';
import { nativeFlow } from './native-flow.mjs';
import { DRAFT, MODES } from './contracts.mjs';

for (const mode of MODES) {
  test(`${mode} rail actions scroll to the actual accessible item rather than a clipped container`, () => {
    const steps = nativeFlow(mode).split(/\n(?=- )/);
    const editorTap = steps.findIndex(step => step === '- tapOn:\n    text: ^Editor$');
    assert.ok(editorTap > 0);
    // Native AX flattening must not let the later shell action satisfy this match.
    const selector = /^- tapOn:\n    text: (.+)$/.exec(steps[editorTap])[1];
    assert.deepEqual(['Editor', 'Shell Editor'].filter(text => new RegExp(selector).test(text)), ['Editor']);
    assert.equal(steps[editorTap - 1], '- scrollUntilVisible:\n    element:\n      text: "^Editor$"\n    direction: DOWN\n    timeout: 30000\n    visibilityPercentage: 100\n    centerElement: true');
    const disabled = steps.findIndex(step => step === '- assertVisible:\n    text: ^Unavailable$\n    enabled: false');
    assert.ok(disabled > editorTap);
    assert.equal(steps[disabled - 1], '- scrollUntilVisible:\n    element:\n      text: "^Unavailable$"\n    direction: DOWN\n    timeout: 30000\n    visibilityPercentage: 100\n    centerElement: false');
    assert.ok(steps.includes('- assertVisible:\n    text: ^Editor$\n    selected: true'));
    for (const [index, step] of steps.entries()) {
      if (step.startsWith('- scrollUntilVisible:')) assert.match(step, steps[index + 1]?.startsWith('- tapOn:') ? /\n    visibilityPercentage: 100\n    centerElement: true$/ : /\n    visibilityPercentage: 100\n    centerElement: false$/);
      if (step === '- assertVisible:\n    id: rail-result\n    text: "Selected: editor"') assert.equal(steps[index - 1], '- scrollUntilVisible:\n    element:\n      id: rail-result\n    direction: DOWN\n    timeout: 30000\n    visibilityPercentage: 100\n    centerElement: false');
    }
    const selected = steps.indexOf('- assertVisible:\n    text: ^Editor$\n    selected: true');
    assert.equal(steps[selected - 1], '- scrollUntilVisible:\n    element:\n      text: "^Editor$"\n    direction: UP\n    timeout: 30000\n    visibilityPercentage: 100\n    centerElement: false');
    assert.ok(steps.includes('- assertVisible:\n    text: ^Shell Editor$\n    leftOf:\n      id: shell-draft'));
    assert.ok(steps.includes('- assertVisible:\n    text: ^Shell Editor$\n    rightOf:\n      id: shell-draft'));
    assert.doesNotMatch(nativeFlow(mode), /id: shell-rail/);
    assert.doesNotMatch(nativeFlow(mode), /element:\n      id: rail-demo|childOf:|point:|optional:/);
    // Retain the downstream state/layout checks; scrolling is not acceptance.
    for (const text of ['Physical edge: left; text: LTR', 'Physical edge: left; text: RTL', 'Physical edge: right; text: RTL', DRAFT]) {
      assert.ok(nativeFlow(mode).includes(`text: ${JSON.stringify(text)}`), text);
    }
    assert.match(nativeFlow(mode), /leftOf:\n      id: shell-draft/);
    assert.match(nativeFlow(mode), /rightOf:\n      id: shell-draft/);
  });
}

for (const mode of MODES) test(`${mode} reveals the button row once then checks every variant in forward fixture order`, () => {
 const steps=nativeFlow(mode).split(/\n(?=- )/);
 const count=steps.indexOf('- assertVisible:\n    id: button-result\n    text: "Press count: 1"');
 assert.ok(count>0);
 assert.equal(steps[count+1],'- scrollUntilVisible:\n    element:\n      id: button-primary\n    direction: UP\n    timeout: 30000\n    visibilityPercentage: 100\n    centerElement: false');
 const order=['secondary','ghost','danger','disabled','loading','small'];
 let index=count+2;
 for(const variant of order) {
   assert.equal(steps[index++],`- scrollUntilVisible:\n    element:\n      id: button-${variant}\n    direction: DOWN\n    timeout: 30000\n    visibilityPercentage: 100\n    centerElement: false`);
   assert.equal(steps[index++],`- assertVisible:\n    id: button-${variant}`+(['disabled','loading'].includes(variant)?'\n    enabled: false':''));
 }
 assert.match(steps[index],/id: card-raised\n    direction: DOWN/);
});

for (const mode of MODES) test(`${mode} dismisses the actual iOS Return keyboard and retains Android hideKeyboard`, () => {
 const flow=nativeFlow(mode), steps=flow.split(/\n(?=- )/);
 const input=steps.indexOf(`- inputText: ${JSON.stringify(DRAFT)}`);assert.ok(input>0);
 assert.equal(steps[input+1],'- runFlow:\n    when:\n      platform: iOS\n    commands:\n      - tapOn:\n          id: ^Return$\n      - assertNotVisible:\n          id: ^UIKeyboardLayoutStar Preview$');
 assert.equal(steps[input+2],'- runFlow:\n    when:\n      platform: Android\n    commands:\n      - hideKeyboard');
 assert.equal(steps[input+3],'- scrollUntilVisible:\n    element:\n      id: draft-result\n    direction: DOWN\n    timeout: 30000\n    visibilityPercentage: 100\n    centerElement: false');
 assert.equal(steps[input+4],`- assertVisible:\n    id: draft-result\n    text: ${JSON.stringify('Draft: '+DRAFT)}`);
 assert.equal(steps.filter(step=>step.startsWith('- assertVisible:')).length,27);
 assert.doesNotMatch(flow,/optional:|point:|submitBehavior:|returnKeyType:/);
});

for (const mode of MODES) test(`${mode} centers only immediate pre-tap actions and fully reveals every inspection`, () => {
 const flow=nativeFlow(mode), steps=flow.split(/\n(?=- )/), scrolls=steps.filter(step=>step.startsWith('- scrollUntilVisible:'));
 assert.equal(scrolls.length,30);
 let actions=0, inspections=0;
 for (const [index,step] of steps.entries()) {
  if(!step.startsWith('- scrollUntilVisible:'))continue;
  const next=steps[index+1], action=next?.startsWith('- tapOn:');
  assert.match(step,/direction: (?:UP|DOWN)\n    timeout: 30000\n    visibilityPercentage: 100\n    centerElement: (?:true|false)$/);
  assert.equal((step.match(/visibilityPercentage:/g)||[]).length,1);
  assert.equal((step.match(/centerElement:/g)||[]).length,1);
  if(action) {
   actions++;assert.match(step,/centerElement: true$/);
   const id=/element:\n      id: (.+)\n/.exec(step)?.[1];
   const text=/element:\n      text: "(.+)"\n/.exec(step)?.[1];
   assert.equal(next,id?`- tapOn:\n    id: ${id}`:`- tapOn:\n    text: ${text}`);
  } else { inspections++;assert.match(step,/centerElement: false$/); }
  assert.doesNotMatch(step,/optional:|point:/);
 }
 assert.equal(actions,7);assert.equal(inspections,23);
 assert.equal(steps.filter(step=>step.startsWith('- assertVisible:')).length,27);
 for(const text of ['Physical edge: left; text: LTR','Physical edge: left; text: RTL','Physical edge: right; text: RTL',DRAFT])assert.ok(flow.includes(`text: ${JSON.stringify(text)}`));
 assert.match(flow,/leftOf:\n      id: shell-draft/);assert.match(flow,/rightOf:\n      id: shell-draft/);
});
