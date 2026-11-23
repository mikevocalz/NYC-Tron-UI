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
    assert.equal(steps[editorTap - 1], '- scrollUntilVisible:\n    element:\n      text: "^Editor$"\n    direction: DOWN\n    timeout: 30000');
    const disabled = steps.findIndex(step => step === '- assertVisible:\n    text: ^Unavailable$\n    enabled: false');
    assert.ok(disabled > editorTap);
    assert.equal(steps[disabled - 1], '- scrollUntilVisible:\n    element:\n      text: "^Unavailable$"\n    direction: DOWN\n    timeout: 30000');
    assert.ok(steps.includes('- assertVisible:\n    text: ^Editor$\n    selected: true'));
    assert.ok(steps.includes('- assertVisible:\n    id: rail-result\n    text: "Selected: editor"'));
    assert.doesNotMatch(nativeFlow(mode), /element:\n      id: rail-demo|childOf:|point:|visibilityPercentage:|optional:/);
    // Retain the downstream state/layout checks; scrolling is not acceptance.
    for (const text of ['Physical edge: left; text: LTR', 'Physical edge: left; text: RTL', 'Physical edge: right; text: RTL', DRAFT]) {
      assert.ok(nativeFlow(mode).includes(`text: ${JSON.stringify(text)}`), text);
    }
    assert.match(nativeFlow(mode), /leftOf:\n      id: shell-draft/);
    assert.match(nativeFlow(mode), /rightOf:\n      id: shell-draft/);
  });
}
