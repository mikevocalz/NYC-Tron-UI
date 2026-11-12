import test from 'node:test';
import assert from 'node:assert/strict';
import { createWindowController } from '../dist/window-controller.js';
import { createMacOSWindowChromeHost, macOSTitleBarOptions, validateTitleBarInsets } from '../dist/window-chrome.js';
import { createWindowChromeController } from '@nyc-tron/core/window-chrome';

const displays = [{ id: 'primary', primary: true, origin: { x: 0, y: 0 }, bounds: { x: 0, y: 25, width: 1440, height: 875 }, scaleFactor: 2 }];
const settle = () => new Promise(resolve => setTimeout(resolve, 0));

// A Spark-shaped fake: windows, guards and listeners in memory, with zoom
// changing bounds and emitting boundsChanged the way AppKit's zoom does.
function fixture() {
  const infos = new Map(), callbacks = [], guards = new Map(), calls = [];
  const emit = (id, type) => { for (const c of callbacks) if (!c.removed && c.id === id && c.type === type) c.handler(); };
  const transport = {
    async open(options) {
      infos.set(options.id, { id: options.id, kind: 'window', title: '', parentId: null, modal: false, visible: options.show !== false, focused: false, minimized: false, maximized: false, fullscreen: false, bounds: { displayId: 'primary', x: 40, y: 60, width: 600, height: 450 } });
      return structuredClone(infos.get(options.id));
    },
    async get(id) { if (!infos.has(id)) throw new Error('Closed'); return structuredClone(infos.get(id)); },
    async show(id, options) { calls.push(['show', id, options?.focus]); Object.assign(infos.get(id), { focused: options?.focus !== false, visible: true, minimized: false }); emit(id, 'visibilityChanged'); },
    async close(id) { calls.push(['close', id]); if (guards.has(id) && !(await guards.get(id)())) return { closed: false, reason: 'vetoed' }; infos.delete(id); emit(id, 'closed'); return { closed: true }; },
    async minimize(id) { calls.push(['minimize', id]); Object.assign(infos.get(id), { minimized: true, focused: false }); emit(id, 'visibilityChanged'); },
    async bounds(id, rect) { infos.get(id).bounds = structuredClone(rect); emit(id, 'boundsChanged'); },
    async options() {},
    async listen(id, type, handler) { const c = { id, type, handler, removed: false }; callbacks.push(c); return { async remove() { c.removed = true; } }; },
    async beforeClose(id, handler) { guards.set(id, handler); return { async remove() { guards.delete(id); } }; },
    async displays() { return displays; },
    async displayChanges(handler) { const c = { id: '', type: 'displays', handler, removed: false }; callbacks.push(c); return { async remove() { c.removed = true; } }; },
  };
  const setZoom = (id, value) => {
    const info = infos.get(id);
    info.maximized = value;
    info.bounds = value ? { displayId: 'primary', x: 0, y: 25, width: 1440, height: 875 } : { displayId: 'primary', x: 40, y: 60, width: 600, height: 450 };
    emit(id, 'boundsChanged');
  };
  const chrome = {
    async info(id) { if (!infos.has(id)) throw new Error('Closed'); return { maximized: infos.get(id).maximized }; },
    async maximize(id) { calls.push(['maximize', id]); setZoom(id, true); },
    async unmaximize(id) { calls.push(['unmaximize', id]); setZoom(id, false); },
    insets: '{"leading":78,"trailing":0,"height":28}',
    async readInsets(id) { calls.push(['insets', id]); return chrome.insets; },
  };
  return { transport, chrome, infos, calls, setZoom };
}

test('a close request the app vetoes keeps the window open; a saved document closes', async () => {
  const f = fixture(); let saved = false;
  const windows = createWindowController(f.transport, { beforeClose: () => saved });
  await windows.open({ id: 'doc', component: 'Document' });
  const host = createMacOSWindowChromeHost(windows, f.chrome);
  const titleBar = createWindowChromeController(host, 'doc');
  assert.deepEqual(await host.requestClose('doc'), { closed: false, reason: 'vetoed' });
  assert.deepEqual(await titleBar.run('close'), { command: 'close', status: 'vetoed' });
  assert.equal(windows.getSnapshot().windows.length, 1);
  assert.equal(titleBar.getSnapshot().status, 'open');
  saved = true;
  assert.deepEqual(await titleBar.run('close'), { command: 'close', status: 'done' });
  assert.equal(windows.getSnapshot().windows.length, 0);
  assert.equal(titleBar.getSnapshot().status, 'closed');
  assert.deepEqual(await titleBar.run('close'), { command: 'close', status: 'ignored', reason: 'closed' });
  titleBar.dispose(); host.dispose(); await windows.dispose();
});

test('minimize and restore go through the controller and restore focuses the window', async () => {
  const f = fixture();
  const windows = createWindowController(f.transport);
  await windows.open({ id: 'doc', component: 'Document' });
  const host = createMacOSWindowChromeHost(windows, f.chrome);
  const titleBar = createWindowChromeController(host, 'doc');
  assert.deepEqual(await titleBar.run('restore'), { command: 'restore', status: 'ignored', reason: 'unavailable' });
  assert.deepEqual(await titleBar.run('minimize'), { command: 'minimize', status: 'done' });
  assert.equal(windows.getSnapshot().windows[0].status, 'minimized');
  assert.equal(titleBar.getSnapshot().status, 'minimized');
  assert.deepEqual(await titleBar.run('restore'), { command: 'restore', status: 'done' });
  assert.equal(windows.getSnapshot().windows[0].status, 'open');
  assert.equal(windows.getSnapshot().focusedId, 'doc');
  assert.deepEqual(f.calls.filter(c => c[0] === 'show').at(-1), ['show', 'doc', true]);
  titleBar.dispose(); host.dispose(); await windows.dispose();
});

test('zoom toggles through maximize and unmaximize and isZoomed follows observed WindowInfo', async () => {
  const f = fixture();
  const windows = createWindowController(f.transport);
  await windows.open({ id: 'doc', component: 'Document' });
  const host = createMacOSWindowChromeHost(windows, f.chrome);
  const titleBar = createWindowChromeController(host, 'doc');
  await settle();
  assert.equal(host.zoom.isZoomed('doc'), false);
  assert.equal(titleBar.getSnapshot().zoomed, false);
  assert.deepEqual(await titleBar.run('zoom'), { command: 'zoom', status: 'done' });
  assert.equal(host.zoom.isZoomed('doc'), true);
  assert.equal(titleBar.getSnapshot().zoomed, true);
  await titleBar.run('zoom');
  assert.equal(host.zoom.isZoomed('doc'), false);
  assert.deepEqual(f.calls.filter(c => c[0] === 'maximize' || c[0] === 'unmaximize'), [['maximize', 'doc'], ['unmaximize', 'doc']]);
  // A click on the system zoom button changes bounds without a host call.
  f.setZoom('doc', true);
  for (let i = 0; i < 20 && !host.zoom.isZoomed('doc'); i++) await settle();
  assert.equal(host.zoom.isZoomed('doc'), true, 'boundsChanged must refresh the zoom cache');
  assert.equal(titleBar.getSnapshot().zoomed, true);
  await assert.rejects(host.zoom.toggleZoom('missing'), /not owned/);
  titleBar.dispose(); host.dispose(); await windows.dispose();
});

test('insets are read natively and validated', async () => {
  const f = fixture();
  const windows = createWindowController(f.transport);
  await windows.open({ id: 'doc', component: 'Document' });
  const host = createMacOSWindowChromeHost(windows, f.chrome);
  assert.deepEqual(await host.readInsets('doc'), { leading: 78, trailing: 0, height: 28 });
  assert.ok(Object.isFrozen(await host.readInsets('doc')));
  f.chrome.insets = { leading: 70, trailing: 0, height: 32, extra: true };
  assert.deepEqual(await host.readInsets('doc'), { leading: 70, trailing: 0, height: 32 });
  for (const [value, error] of [
    ['not json', TypeError], [null, TypeError], [{ leading: 1, trailing: 0 }, TypeError], [{ leading: '78', trailing: 0, height: 28 }, TypeError],
    [{ leading: -1, trailing: 0, height: 28 }, RangeError], [{ leading: Infinity, trailing: 0, height: 28 }, RangeError], [{ leading: 0, trailing: 0, height: 10_001 }, RangeError],
  ]) {
    f.chrome.insets = value;
    await assert.rejects(host.readInsets('doc'), error);
    assert.throws(() => validateTitleBarInsets(value), error);
  }
  await assert.rejects(host.readInsets(''), TypeError);
  host.dispose(); await windows.dispose();
});

test('title bar styles map to Spark options that keep the system buttons', () => {
  assert.deepEqual(macOSTitleBarOptions('standard'), { titleBarStyle: 'default', macos: { titleBar: { titleVisibility: 'visible', transparent: false, contentLayout: 'contentLayoutGuide' } } });
  assert.deepEqual(macOSTitleBarOptions('hiddenTitle'), { titleBarStyle: 'default', macos: { titleBar: { titleVisibility: 'hidden', transparent: false, contentLayout: 'contentLayoutGuide' } } });
  assert.deepEqual(macOSTitleBarOptions('contentUnderTitleBar'), { titleBarStyle: 'overlay', macos: { titleBar: { titleVisibility: 'hidden', transparent: true, contentLayout: 'fullSize' } } });
  for (const style of ['standard', 'hiddenTitle', 'contentUnderTitleBar']) {
    const options = macOSTitleBarOptions(style);
    assert.ok(!['hidden', 'borderless'].includes(options.titleBarStyle));
    assert.equal('trafficLights' in options.macos.titleBar, false);
    // Callers may mutate their copy without changing the next result.
    options.macos.titleBar.titleVisibility = 'visible';
    assert.notEqual(macOSTitleBarOptions(style), options);
  }
  assert.equal(macOSTitleBarOptions('hiddenTitle').macos.titleBar.titleVisibility, 'hidden');
  for (const style of ['hidden', 'borderless', 'toString', '__proto__', undefined]) assert.throws(() => macOSTitleBarOptions(style), TypeError);
});

test('dispose stops notifications and is idempotent', async () => {
  const f = fixture();
  const windows = createWindowController(f.transport);
  await windows.open({ id: 'doc', component: 'Document' });
  const host = createMacOSWindowChromeHost(windows, f.chrome);
  let calls = 0;
  const unsubscribe = host.subscribe(() => { calls++; });
  await windows.minimize('doc');
  assert.ok(calls > 0);
  unsubscribe(); unsubscribe();
  const after = calls;
  host.dispose(); host.dispose();
  await windows.focus('doc');
  assert.equal(calls, after);
  await windows.dispose();
});
