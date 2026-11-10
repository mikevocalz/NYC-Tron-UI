import test from 'node:test';
import assert from 'node:assert/strict';
import { createWindowController, toSharedBounds, toSparkBounds, validateDisplays } from '../dist/window-controller.js';

const displays = [{ id: 'primary', primary: true, origin: { x: 0, y: 0 }, bounds: { x: 0, y: 25, width: 1440, height: 875 }, scaleFactor: 2 }];
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
function fixture() {
  const infos = new Map(), callbacks = [], guards = new Map(), calls = [];
  let geometry = displays;
  const emit = (id, type) => { for (const c of callbacks) if (!c.removed && c.id === id && c.type === type) c.handler(); };
  const transport = {
    async open(options) {
      calls.push(['open', options]);
      const info = { id: options.id, kind: 'window', title: options.title ?? '', parentId: null, modal: false, visible: options.show !== false, focused: false, minimized: false, maximized: false, fullscreen: false, bounds: { displayId: 'primary', x: 40, y: 60, width: 600, height: 450 } };
      infos.set(options.id, info); return structuredClone(info);
    },
    async get(id) { if (!infos.has(id)) throw new Error('Closed'); return structuredClone(infos.get(id)); },
    async show(id, options) { calls.push(['show', id]); if (options?.focus !== false) for (const info of infos.values()) info.focused = false; Object.assign(infos.get(id), { focused: options?.focus !== false, visible: true, minimized: false }); emit(id, 'visibilityChanged'); },
    async close(id) { if (guards.has(id) && !(await guards.get(id)())) return { closed: false, reason: 'vetoed' }; infos.delete(id); emit(id, 'closed'); return { closed: true }; },
    async minimize(id) { Object.assign(infos.get(id), { minimized: true, focused: false }); emit(id, 'visibilityChanged'); },
    async bounds(id, rect) { infos.get(id).bounds = structuredClone(rect); emit(id, 'boundsChanged'); },
    async options(id, options) { Object.assign(infos.get(id), options); },
    async listen(id, type, handler) { const c = { id, type, handler, removed: false }; callbacks.push(c); return { async remove() { c.removed = true; } }; },
    async beforeClose(id, handler) { calls.push(['guard', id]); guards.set(id, handler); return { async remove() { guards.delete(id); } }; },
    async displays() { return geometry; },
    async displayChanges(handler) { const c = { id: '', type: 'displays', handler, removed: false }; callbacks.push(c); return { async remove() { c.removed = true; } }; },
  };
  return { transport, infos, callbacks, guards, calls, emit, setDisplays(value) { geometry = value; emit('', 'displays'); } };
}

test('NSScreen-to-core mapping is reversible across negative origins and mixed scale', () => {
  const screens = validateDisplays([...displays, { id: 'left', primary: false, origin: { x: -1920, y: -200 }, bounds: { x: -1920, y: -175, width: 1920, height: 1055 }, scaleFactor: 1 }]);
  const original = { displayId: 'left', x: 100, y: 60, width: 640, height: 480 };
  const rect = toSharedBounds(original, screens);
  assert.deepEqual(rect, { x: -1820, y: -140, width: 640, height: 480 });
  assert.deepEqual(toSparkBounds('left', rect, screens), original);
  assert.throws(() => toSharedBounds({ ...original, displayId: 'gone' }, screens), /disconnected/);
  assert.throws(() => validateDisplays([{ ...displays[0], scaleFactor: 0 }]), /Invalid/);
});

test('native open stays hidden until observation and the app close guard are installed', async () => {
  const f = fixture(), host = createWindowController(f.transport);
  await host.open({ id: 'a', component: 'RegisteredDocument', props: { documentId: 'd' } });
  assert.equal(f.calls[0][1].show, false);
  assert.ok(f.calls.findIndex(c => c[0] === 'guard') < f.calls.findIndex(c => c[0] === 'show'));
  assert.equal(host.getSnapshot().focusedId, 'a');
  assert.deepEqual(host.getSnapshot().windows[0].rect, { x: 40, y: 60, width: 600, height: 450 });
  await host.dispose(); assert.ok(f.callbacks.every(c => c.removed));
});

test('native close veto preserves registry/document ownership and an allowed close removes observers', async () => {
  const f = fixture(); let saved = false;
  const host = createWindowController(f.transport, { beforeClose: () => saved });
  await host.open({ id: 'a', component: 'Document' });
  assert.deepEqual(await host.close('a'), { closed: false, reason: 'vetoed' });
  assert.equal(host.getSnapshot().windows.length, 1);
  saved = true; assert.deepEqual(await host.close('a'), { closed: true });
  assert.equal(host.getSnapshot().windows.length, 0);
  assert.ok(f.callbacks.filter(c => c.id === 'a').every(c => c.removed));
  await host.dispose();
});

test('failed native resize does not commit imaginary geometry', async () => {
  const f = fixture(), host = createWindowController(f.transport);
  await host.open({ id: 'a', component: 'Document' });
  const before = host.snapshot();
  f.transport.bounds = async () => { throw new Error('Native refused'); };
  await assert.rejects(host.setBounds('a', 'primary', { x: 100, y: 100, width: 900, height: 700 }), /refused/);
  assert.deepEqual(host.snapshot(), before); await host.dispose();
});

test('minimize cancels a pending host-approved drop and late approval cannot move a document', async () => {
  const f = fixture(), host = createWindowController(f.transport), approval = deferred();
  await host.open({ id: 'a', component: 'Document' }); await host.open({ id: 'b', component: 'Document' });
  const payload = { documentId: 'owned-by-app' }, drag = host.beginDrag('a', payload);
  const dropping = host.drop(drag.token, 'b', offer => { assert.equal(offer.payload, payload); return approval.promise; });
  await host.minimize('b'); approval.resolve(true);
  const result = await dropping; assert.equal(result.ok, false); assert.equal(result.reason, 'stale-token'); assert.equal(result.transfer, undefined);
  assert.equal(host.getSnapshot().drag, null); await host.dispose();
});

test('only an accepted current drop yields a transfer, no document data is copied', async () => {
  const f = fixture(), host = createWindowController(f.transport);
  await host.open({ id: 'a', component: 'Document' }); await host.open({ id: 'b', component: 'Document' });
  let drag = host.beginDrag('a', { documentId: 'one' });
  assert.equal((await host.drop(drag.token, 'b', () => false)).transfer, undefined);
  drag = host.beginDrag('a', { documentId: 'one' });
  const result = await host.drop(drag.token, 'b', () => true);
  assert.equal(result.transfer.targetId, 'b'); assert.equal(result.transfer.payload.documentId, 'one');
  assert.equal(host.getSnapshot().drag, null); await host.dispose();
});

test('old native events cannot close a reopened window with the same logical ID', async () => {
  const f = fixture(), host = createWindowController(f.transport);
  await host.open({ id: 'a', component: 'Document' });
  const stale = f.callbacks.find(c => c.id === 'a' && c.type === 'closed').handler;
  await host.close('a'); await host.open({ id: 'a', component: 'Document' });
  stale(); assert.equal(host.getSnapshot().windows.length, 1); await host.dispose();
});

test('dispose during asynchronous native listener acquisition releases the late handle and rolls back created window', async () => {
  const f = fixture(), pending = deferred(), started = deferred(); let removed = false;
  f.transport.listen = async () => { started.resolve(); return pending.promise; };
  const host = createWindowController(f.transport);
  const opening = host.open({ id: 'a', component: 'Document' });
  await started.promise; const disposing = host.dispose();
  assert.equal(host.dispose(), disposing);
  pending.resolve({ async remove() { removed = true; } });
  await assert.rejects(opening, /registration|disposed/);
  await disposing;
  assert.equal(removed, true); assert.equal(f.infos.has('a'), false);
});

test('native display reflow uses observed work area and retains document/window identity', async () => {
  const f = fixture(), host = createWindowController(f.transport);
  await host.open({ id: 'a', component: 'Document' });
  await host.setBounds('a', 'primary', { x: 1300, y: 800, width: 600, height: 450 });
  await host.reflow();
  assert.deepEqual(host.getSnapshot().windows[0].rect, { x: 840, y: 450, width: 600, height: 450 });
  assert.equal(f.calls.filter(c => c[0] === 'open').length, 1);
  await host.dispose();
});

test('layout restoration preserves native identities and applies minimization, focus and current display bounds', async () => {
  const f = fixture(), host = createWindowController(f.transport);
  await host.open({ id: 'a', component: 'Document' }); await host.open({ id: 'b', component: 'Document' });
  const originalA = f.infos.get('a'), originalB = f.infos.get('b');
  const drag = host.beginDrag('a', { documentId: 'existing-document' });
  const saved = { version: 1, focusedId: 'a', windows: [
    { id: 'b', displayId: 'primary', rect: { x: 2000, y: 900, width: 600, height: 450 }, status: 'minimized' },
    { id: 'a', displayId: 'primary', rect: { x: 100, y: 150, width: 700, height: 500 }, status: 'open' },
  ] };
  const result = await host.restore(saved);
  assert.equal(f.infos.get('a'), originalA); assert.equal(f.infos.get('b'), originalB);
  assert.equal(f.calls.filter(c => c[0] === 'open').length, 2);
  assert.equal(result.focusedId, 'a');
  assert.deepEqual(result.windows.find(w => w.id === 'b').rect, { x: 840, y: 450, width: 600, height: 450 });
  assert.equal(result.windows.find(w => w.id === 'b').status, 'minimized');
  assert.equal(host.cancelDrag(drag.token).reason, 'stale-token');
  await host.dispose();
});

test('restore rejects unknown window IDs before mutation and owns the submitted layout', async () => {
  const f = fixture(), host = createWindowController(f.transport);
  await host.open({ id: 'a', component: 'Document' });
  const original = host.snapshot();
  await assert.rejects(host.restore({ ...original, focusedId: 'other', windows: [{ ...original.windows[0], id: 'other' }] }), /currently owned/);
  assert.deepEqual(host.snapshot(), original);
  const saved = host.snapshot(); saved.windows[0].rect.x = 100;
  const restoring = host.restore(saved); saved.windows[0].rect.x = 999;
  assert.equal((await restoring).windows[0].rect.x, 100);
  await host.dispose();
});

test('restore records the saved three-window order when the focused window is unchanged', async () => {
  const f = fixture(), host = createWindowController(f.transport);
  for (const id of ['a', 'b', 'c']) await host.open({ id, component: 'Document' });
  const saved = host.snapshot();
  await host.focus('b'); await host.focus('a'); await host.focus('c');
  assert.deepEqual(host.snapshot().windows.map(window => window.id), ['b', 'a', 'c']);
  const restored = await host.restore(saved);
  assert.equal(restored.focusedId, 'c');
  assert.deepEqual(restored.windows.map(window => window.id), ['a', 'b', 'c']);
  assert.deepEqual(f.calls.filter(call => call[0] === 'show').slice(-4).map(call => call[1]), ['a', 'b', 'c', 'c']);
  await host.dispose();
});

test('a failed restore reports only the native changes that actually completed', async () => {
  const f = fixture(), host = createWindowController(f.transport);
  await host.open({ id: 'a', component: 'Document' }); await host.open({ id: 'b', component: 'Document' });
  const saved = host.snapshot(); for (const w of saved.windows) w.rect.x = 200;
  const bounds = f.transport.bounds;
  f.transport.bounds = async (id, rect) => { if (id === 'b') throw new Error('Native bounds failed'); await bounds(id, rect); };
  await assert.rejects(host.restore(saved), /Native bounds failed/);
  assert.equal(host.getSnapshot().windows.find(w => w.id === 'a').rect.x, 200);
  assert.equal(host.getSnapshot().windows.find(w => w.id === 'b').rect.x, 40);
  await host.dispose();
});

test('display removal remembers the home through focus notifications and returns when the display reconnects', async () => {
  const secondary = { id: 'secondary', primary: false, origin: { x: 1440, y: 0 }, bounds: { x: 1440, y: 25, width: 1280, height: 775 }, scaleFactor: 1 };
  const f = fixture(); f.setDisplays([...displays, secondary]);
  const host = createWindowController(f.transport);
  await host.open({ id: 'a', component: 'Document' });
  await host.setBounds('a', 'secondary', { x: 1600, y: 100, width: 600, height: 450 });
  f.setDisplays(displays); await host.reflow(); await host.refresh('a');
  assert.deepEqual(host.getSnapshot().windows[0].home, { displayId: 'secondary', rect: { x: 1600, y: 100, width: 600, height: 450 } });
  f.setDisplays([...displays, secondary]); await host.reflow();
  assert.equal(host.getSnapshot().windows[0].displayId, 'secondary');
  assert.equal(host.getSnapshot().windows[0].rect.x, 1600);
  assert.equal(host.getSnapshot().windows[0].home, undefined);
  await host.dispose();
});

test('disposing while a display read is pending prevents a later native resize', async () => {
  const f = fixture(), host = createWindowController(f.transport), pending = deferred(), started = deferred();
  await host.open({ id: 'a', component: 'Document' }); await host.refresh('a');
  let writes = 0; f.transport.bounds = async () => { writes += 1; };
  f.transport.displays = async () => { started.resolve(); return pending.promise; };
  const resizing = host.setBounds('a', 'primary', { x: 200, y: 200, width: 600, height: 450 });
  await started.promise; const disposing = host.dispose(); pending.resolve(displays);
  await assert.rejects(resizing, /disposed/); await disposing;
  assert.equal(writes, 0); assert.ok(f.callbacks.every(c => c.removed));
});

test('disposal drains asynchronous removal after a native close event', async () => {
  const f = fixture(), pending = deferred(), started = deferred();
  const original = f.transport.listen;
  f.transport.listen = async (...args) => {
    const registration = await original(...args);
    return { async remove() { started.resolve(); await pending.promise; await registration.remove(); } };
  };
  const host = createWindowController(f.transport); await host.open({ id: 'a', component: 'Document' });
  await host.close('a'); await started.promise;
  let finished = false; const disposing = host.dispose().then(() => { finished = true; });
  await Promise.resolve(); assert.equal(finished, false);
  pending.resolve(); await disposing; assert.equal(finished, true);
  assert.ok(f.callbacks.every(c => c.removed));
});
