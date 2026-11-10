import { createConnection } from 'node:net';

/** One authenticated Spark session; the native driver accepts one request at a time. */
export function connectDriver(socketPath, token, record = () => {}, { responseTimeoutMs = 35000 } = {}) {
  if (!Number.isFinite(responseTimeoutMs) || responseTimeoutMs <= 0) throw new RangeError('A positive response timeout is required');
  const socket = createConnection(socketPath);
  let buffer = '', ended, sequence = 0, rejectConnection;
  const messages = [], waiting = [];
  function fail(error) {
    if (ended) return;
    ended = error;
    buffer = ''; messages.length = 0;
    rejectConnection?.(error); rejectConnection = undefined;
    for (const item of waiting.splice(0)) item.reject(error);
  }
  socket.on('data', bytes => {
    if (ended) return;
    buffer += bytes.toString('utf8');
    if (buffer.length > 2 * 1024 * 1024) { fail(new Error('Native driver response exceeded its bound')); return; }
    for (;;) {
      const index = buffer.indexOf('\n'); if (index < 0) return;
      const line = buffer.slice(0, index); buffer = buffer.slice(index + 1);
      let result;
      try { result = JSON.parse(line); } catch { fail(new Error('Malformed native driver JSON')); return; }
      const item = waiting.shift(); if (item) item.resolve(result); else messages.push(result);
    }
  });
  socket.on('error', fail);
  socket.on('close', () => fail(new Error('Native driver disconnected')));
  const read = stage => {
    if (ended) return Promise.reject(ended);
    if (messages.length) return Promise.resolve(messages.shift());
    return new Promise((resolve, reject) => {
      // Spark terminates its app when this socket disconnects. A local failure
      // must keep the connection alive until the owner captures diagnostics.
      const timer = setTimeout(() => fail(new Error(`Native driver response timed out awaiting ${stage}`)), responseTimeoutMs);
      waiting.push({ resolve: value => { clearTimeout(timer); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
    });
  };
  // Return the handle before the asynchronous handshake finishes. The caller
  // owns close() even if connecting or authentication fails before ready.
  const ready = (async () => {
    try {
      record({ phase: 'socket-connecting', at: new Date().toISOString() });
      await new Promise((resolve, reject) => {
        rejectConnection = reject;
        socket.once('connect', () => { rejectConnection = undefined; resolve(); });
      });
      if (ended) throw ended;
      record({ phase: 'socket-connected', at: new Date().toISOString() });
      // Record the protocol stage without recording the one-time credential.
      record({ phase: 'authentication-started', at: new Date().toISOString() });
      socket.write(JSON.stringify({ token }) + '\n');
      let authentication;
      try { authentication = await read('authentication'); if (ended) throw ended; }
      catch (error) { record({ phase: 'authentication-failed', at: new Date().toISOString(), error: error.message }); throw error; }
      record({ phase: 'authentication-response', at: new Date().toISOString(), ok: authentication.ok, protocol: authentication.protocol });
      if (authentication.ok !== true || authentication.protocol !== 1) throw new Error('Native driver authentication failed');
    } catch (error) { fail(error); throw ended; }
  })();
  return {
    ready,
    async request(command, args = {}) {
      await ready;
      if (ended) throw ended;
      const request = { ...args, command, id: ++sequence };
      record({ phase: 'request-started', at: new Date().toISOString(), request });
      socket.write(JSON.stringify(request) + '\n');
      let response;
      try { response = await read(`${command} (request ${request.id})`); if (ended) throw ended; }
      catch (error) { record({ phase: 'request-failed', at: new Date().toISOString(), request, error: error.message }); throw error; }
      record({ phase: 'response', at: new Date().toISOString(), request, response });
      if (response?.id !== request.id || response?.ok !== true) {
        const error = new Error(`${command}: ${response?.error?.message ?? 'invalid native response'}`);
        fail(error); throw error;
      }
      return response;
    },
    close() { fail(new Error('Native driver closed by its owner')); socket.destroy(); },
  };
}
