import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from '@typescript/typescript6';

const source = readFileSync(new URL('../src/NativePointerInput.web.tsx', import.meta.url), 'utf8');
const code = ts.transpileModule(source, {compilerOptions: {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
}}).outputText;

function target() {
  const listeners = new Map();
  return {
    addEventListener(type, callback) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(callback);
    },
    removeEventListener(type, callback) { listeners.get(type)?.delete(callback); },
    dispatch(type, values = {}) {
      for (const callback of [...listeners.get(type) ?? []]) callback({type, ...values});
    },
    listenerCount: () => [...listeners.values()].reduce((count, values) => count + values.size, 0),
  };
}

// Execute the actual adapter with host refs/listeners. Browser event ordering
// comes from the failing Chromium trace; this unit harness does not render DOM.
function harness() {
  const effects = [], batches = [], captures = [];
  const node = Object.assign(target(), {
    style: {touchAction: 'pan-y'},
    getBoundingClientRect: () => ({left: 30, top: 50}),
    setPointerCapture: id => captures.push(id), focus() {},
  });
  const window = target(), exports = {};
  const mocks = {
    react: {useRef: value => ({current: value}), useEffect: effect => effects.push(effect)},
    'react-native': {View: 'View'},
    'react/jsx-runtime': {jsx: (type, props) => ({type, props})},
  };
  runInNewContext(code, {exports, window, require: name => {
    assert.ok(Object.hasOwn(mocks, name), `Unexpected adapter dependency ${name}`);
    return mocks[name];
  }});
  const tree = exports.NativePointerInput({width: 300, height: 280, label: 'Input drawing surface',
    onBatch: batch => batches.push(JSON.parse(JSON.stringify(batch))),
  });
  tree.props.ref.current = node;
  const cleanup = effects[0]();
  let time = 0;
  return {node, window, batches, captures, cleanup,
    send(type, pointerType = 'touch', pointerId = 11, values = {}) {
      node.dispatch(type, {pointerId, pointerType, clientX: 80, clientY: 90,
        timeStamp: ++time, pressure: 0.5, tiltX: 0, tiltY: 0, buttons: 0, ...values});
    },
  };
}

test('touch release and cancellation do not fabricate hover exits from boundary events', () => {
  for (const [terminal, phase] of [['pointerup', 'up'], ['pointercancel', 'cancel']]) {
    const h = harness();
    h.send('pointerdown');
    h.send(terminal);
    h.send('lostpointercapture');
    h.send('pointerleave');
    assert.deepEqual(h.batches.map(batch => batch.phase), ['down', phase]);
    assert.deepEqual(h.captures, [11]);
    assert.equal(h.batches.at(-1).samples[0].kind, 'touch');
    h.cleanup();
    assert.equal(h.batches.length, 2, 'unmount cannot invent hover for a completed touch');
  }
});

test('observed mouse and pen hover exits once after captured contact ends', () => {
  for (const kind of ['mouse', 'pen']) {
    const h = harness();
    h.send('pointerleave', kind);
    assert.equal(h.batches.length, 0, 'a boundary event alone does not establish hover');
    h.send('pointermove', kind);
    h.send('pointerdown', kind);
    h.send('pointerleave', kind);
    h.send('pointerup', kind);
    h.send('pointerleave', kind);
    h.send('pointerleave', kind);
    assert.deepEqual(h.batches.map(batch => batch.phase), ['hover', 'down', 'up', 'hover-exit']);
    h.cleanup();
    assert.equal(h.batches.length, 4, 'completed hover is not reported again during cleanup');
  }
});

test('blur and unmount preserve contact cancellation and observed hover cleanup', () => {
  const h = harness();
  h.send('pointermove', 'mouse', 1);
  h.send('pointerdown', 'touch', 2);
  h.window.dispatch('blur');
  h.window.dispatch('blur');
  assert.deepEqual(h.batches.map(batch => batch.phase), ['hover', 'down', 'cancel', 'hover-exit']);
  h.cleanup();
  assert.equal(h.node.style.touchAction, 'pan-y');
  assert.equal(h.node.listenerCount(), 0);
  assert.equal(h.window.listenerCount(), 0);
  assert.equal(h.batches.length, 4);
});
