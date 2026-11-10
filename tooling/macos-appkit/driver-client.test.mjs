import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as pause } from 'node:timers/promises';
import { test } from 'node:test';
import { connectDriver } from '../../examples/macos-appkit/spark/driver-client.mjs';

async function peer(t, receive) {
  const directory = mkdtempSync(join(tmpdir(), 'nt-appkit-driver-'));
  const path = process.platform === 'win32' ? String.raw`\\.\pipe\nt-appkit-${randomUUID()}` : join(directory, 'driver.sock');
  const messages = [], sockets = new Set();
  let connection, disconnected = false, accept, closed;
  const accepted = new Promise(resolve => { accept = resolve; });
  const disconnectedPromise = new Promise(resolve => { closed = resolve; });
  const server = createServer(socket => {
    connection = socket; sockets.add(socket); accept(socket);
    socket.on('error', () => {});
    socket.on('close', () => { disconnected = true; closed(); });
    let buffer = '';
    socket.on('data', bytes => {
      buffer += bytes.toString('utf8');
      for (;;) {
        const index = buffer.indexOf('\n'); if (index < 0) return;
        const value = JSON.parse(buffer.slice(0, index)); buffer = buffer.slice(index + 1);
        messages.push(value); receive(value, socket);
      }
    });
  });
  t.after(async () => {
    for (const socket of sockets) socket.destroy();
    await new Promise(resolve => server.close(resolve));
    rmSync(directory, { recursive: true, force: true });
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(path, resolve); });
  return { path, messages, accepted, disconnectedPromise, get socket() { return connection; }, get disconnected() { return disconnected; } };
}
const send = (socket, value) => socket.write(JSON.stringify(value) + '\n');

test('request timeout keeps the real session connected until its owner closes it', async t => {
  const native = await peer(t, (message, socket) => {
    if (message.token) send(socket, { ok: true, protocol: 1 });
    else if (message.command === 'ping') send(socket, { id: message.id, ok: true });
    // The real peer deliberately leaves waitFor unanswered, like the retained
    // failure. A disconnect here represents Spark terminating its application.
  });
  const trace = [];
  const driver = connectDriver(native.path, 'fixture-token', item => trace.push(item), { responseTimeoutMs: 150 });
  t.after(() => driver.close());
  await driver.ready;
  assert.equal((await driver.request('ping')).ok, true);
  let original;
  await assert.rejects(driver.request('waitFor', { testID: 'root-main' }), error => {
    original = error;
    return error.message === 'Native driver response timed out awaiting waitFor (request 2)';
  });
  await pause(20);
  assert.equal(native.disconnected, false, 'Failure capture must still have a live native peer');
  assert.equal(native.socket.destroyed, false);
  // Neither a matching late response nor another queued frame may revive the
  // failed session or allow a subsequent request to reach the native process.
  send(native.socket, { id: 2, ok: true, window: 'spark.main' });
  send(native.socket, { id: 3, ok: true });
  await pause(20);
  await assert.rejects(driver.request('tron.inspect'), error => error === original);
  await pause(20);
  assert.deepEqual(native.messages.filter(message => message.command).map(message => message.command), ['ping', 'waitFor']);
  assert.equal(trace.filter(item => item.phase === 'request-started').length, 2);
  assert.equal(trace.filter(item => item.phase === 'response').length, 1);
  assert.equal(JSON.stringify(trace).includes('fixture-token'), false);
  assert.equal(native.disconnected, false);
  driver.close();
  await native.disconnectedPromise;
  assert.equal(native.disconnected, true, 'Explicit cleanup owns native termination');
});

test('authentication timeout retains an immediately owned handle and rejects commands', async t => {
  const native = await peer(t, () => {});
  const driver = connectDriver(native.path, 'auth-fixture-token', undefined, { responseTimeoutMs: 150 });
  t.after(() => driver.close());
  assert.equal(typeof driver.close, 'function');
  let original;
  await assert.rejects(driver.ready, error => {
    original = error;
    return error.message === 'Native driver response timed out awaiting authentication';
  });
  await native.accepted;
  assert.equal(native.disconnected, false);
  send(native.socket, { ok: true, protocol: 1 });
  await pause(20);
  await assert.rejects(driver.request('ping'), error => error === original);
  assert.equal(native.messages.length, 1, 'A failed handshake cannot send any command');
  assert.equal(native.messages[0].token, 'auth-fixture-token');
  driver.close();
  await native.disconnectedPromise;
});

test('explicit close settles a pending handshake and disconnects its owned socket', async t => {
  const native = await peer(t, () => {});
  const driver = connectDriver(native.path, 'close-fixture-token');
  t.after(() => driver.close());
  const readyFailure = assert.rejects(driver.ready, /Native driver closed by its owner/);
  await native.accepted;
  driver.close();
  await readyFailure;
  await native.disconnectedPromise;
  await assert.rejects(driver.request('ping'), /Native driver closed by its owner/);
  assert.equal(native.messages.some(message => message.command), false);
});

test('initial connection failure still returns a cleanup handle', async t => {
  const directory = mkdtempSync(join(tmpdir(), 'nt-appkit-absent-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const path = process.platform === 'win32' ? String.raw`\\.\pipe\nt-appkit-absent-${randomUUID()}` : join(directory, 'absent.sock');
  const driver = connectDriver(path, 'unused-token');
  t.after(() => driver.close());
  assert.equal(typeof driver.close, 'function');
  await assert.rejects(driver.ready, error => error.code === 'ENOENT' || error.code === 'ECONNREFUSED');
  driver.close();
  await assert.rejects(driver.request('ping'));
});
