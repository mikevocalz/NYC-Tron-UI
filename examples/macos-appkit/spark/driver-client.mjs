import { createConnection } from 'node:net';

/** One authenticated Spark session; the native driver accepts one request at a time. */
export async function connectDriver(socketPath, token, record = () => {}) {
  const socket = createConnection(socketPath);
  let buffer = '', ended, sequence = 0;
  const messages = [], waiting = [];
  function fail(error) {
    if (ended) return;
    ended = error;
    for (const item of waiting.splice(0)) item.reject(error);
  }
  socket.on('data', bytes => {
    buffer += bytes.toString('utf8');
    if (buffer.length > 2 * 1024 * 1024) { fail(new Error('Native driver response exceeded its bound')); socket.destroy(); return; }
    for (;;) {
      const index = buffer.indexOf('\n'); if (index < 0) return;
      const line = buffer.slice(0, index); buffer = buffer.slice(index + 1);
      let result;
      try { result = JSON.parse(line); } catch { fail(new Error('Malformed native driver JSON')); socket.destroy(); return; }
      const item = waiting.shift(); if (item) item.resolve(result); else messages.push(result);
    }
  });
  socket.on('error', fail);
  socket.on('close', () => fail(new Error('Native driver disconnected')));
  const read = () => {
    if (messages.length) return Promise.resolve(messages.shift());
    if (ended) return Promise.reject(ended);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { fail(new Error('Native driver response timed out')); socket.destroy(); }, 35000);
      waiting.push({ resolve: value => { clearTimeout(timer); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
    });
  };
  await new Promise((resolve, reject) => { socket.once('connect', resolve); socket.once('error', reject); });
  socket.write(JSON.stringify({ token }) + '\n');
  const authentication = await read();
  if (authentication.ok !== true || authentication.protocol !== 1) { socket.destroy(); throw new Error('Native driver authentication failed'); }
  return {
    async request(command, args = {}) {
      const request = { ...args, command, id: ++sequence };
      socket.write(JSON.stringify(request) + '\n');
      const response = await read();
      record({ request, response });
      if (response.id !== request.id || response.ok !== true) throw new Error(`${command}: ${response.error?.message ?? 'invalid native response'}`);
      return response;
    },
    close() { socket.destroy(); },
  };
}
