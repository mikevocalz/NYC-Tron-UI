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
    assert.equal(steps[editorTap - 1], '- scrollUntilVisible:\n    element:\n      text: "^Editor$"\n    direction: DOWN\n    timeout: 30000\n    centerElement: true');
    const disabled = steps.findIndex(step => step === '- assertVisible:\n    text: ^Unavailable$\n    enabled: false');
    assert.ok(disabled > editorTap);
    assert.equal(steps[disabled - 1], '- scrollUntilVisible:\n    element:\n      text: "^Unavailable$"\n    direction: DOWN\n    timeout: 30000\n    centerElement: true');
    assert.ok(steps.includes('- assertVisible:\n    text: ^Editor$\n    selected: true'));
    for (const [index, step] of steps.entries()) {
      if (step.startsWith('- scrollUntilVisible:')) assert.match(step, /\n    centerElement: true$/);
      if (step === '- assertVisible:\n    id: rail-result\n    text: "Selected: editor"') assert.equal(steps[index - 1], '- scrollUntilVisible:\n    element:\n      id: rail-result\n    direction: DOWN\n    timeout: 30000\n    centerElement: true');
    }
    const selected = steps.indexOf('- assertVisible:\n    text: ^Editor$\n    selected: true');
    assert.equal(steps[selected - 1], '- scrollUntilVisible:\n    element:\n      text: "^Editor$"\n    direction: UP\n    timeout: 30000\n    centerElement: true');
    assert.ok(steps.includes('- assertVisible:\n    text: ^Shell Editor$\n    leftOf:\n      id: shell-draft'));
    assert.ok(steps.includes('- assertVisible:\n    text: ^Shell Editor$\n    rightOf:\n      id: shell-draft'));
    assert.doesNotMatch(nativeFlow(mode), /id: shell-rail/);
    assert.doesNotMatch(nativeFlow(mode), /element:\n      id: rail-demo|childOf:|point:|visibilityPercentage:|optional:/);
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
 assert.equal(steps[count+1],'- scrollUntilVisible:\n    element:\n      id: button-primary\n    direction: UP\n    timeout: 30000\n    centerElement: true');
 const order=['secondary','ghost','danger','disabled','loading','small'];
 let index=count+2;
 for(const variant of order) {
   assert.equal(steps[index++],`- scrollUntilVisible:\n    element:\n      id: button-${variant}\n    direction: DOWN\n    timeout: 30000\n    centerElement: true`);
   assert.equal(steps[index++],`- assertVisible:\n    id: button-${variant}`+(['disabled','loading'].includes(variant)?'\n    enabled: false':''));
 }
 assert.match(steps[index],/id: card-raised\n    direction: DOWN/);
});
