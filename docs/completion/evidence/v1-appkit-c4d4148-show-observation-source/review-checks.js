(async function reviewWindowShowObservations({ source, preimage }) {
  const h = (() => {
function utf8(s) {
 const out=[];
 for(const c of s) {
  let p=c.codePointAt(0); if(p>=0xd800&&p<=0xdfff)p=0xfffd;
  if(p<0x80)out.push(p);
  else if(p<0x800)out.push(0xc0|(p>>>6),0x80|(p&63));
  else if(p<0x10000)out.push(0xe0|(p>>>12),0x80|((p>>>6)&63),0x80|(p&63));
  else out.push(0xf0|(p>>>18),0x80|((p>>>12)&63),0x80|((p>>>6)&63),0x80|(p&63));
 }
 return new Uint8Array(out);
}
function bytes(v){return typeof v==="string"?utf8(v):new Uint8Array(v);}
function padded(v){
 const input=bytes(v),p=new Uint8Array(Math.ceil((input.length+9)/64)*64);
 p.set(input);p[input.length]=0x80;
 let bits=BigInt(input.length)*8n;
 for(let i=0;i<8;i++){p[p.length-1-i]=Number(bits&255n);bits>>=8n;}
 return p;
}
const hex=w=>(w>>>0).toString(16).padStart(8,"0");
const rol=(x,n)=>(x<<n)|(x>>>(32-n));
const ror=(x,n)=>(x>>>n)|(x<<(32-n));
function sha1(v){
 const p=padded(v),w=new Uint32Array(80);
 let a0=0x67452301,b0=0xefcdab89,c0=0x98badcfe,d0=0x10325476,e0=0xc3d2e1f0;
 for(let off=0;off<p.length;off+=64){
  for(let i=0;i<16;i++){const q=off+i*4;w[i]=((p[q]<<24)|(p[q+1]<<16)|(p[q+2]<<8)|p[q+3])>>>0;}
  for(let i=16;i<80;i++)w[i]=rol(w[i-3]^w[i-8]^w[i-14]^w[i-16],1)>>>0;
  let a=a0,b=b0,c=c0,d=d0,e=e0;
  for(let i=0;i<80;i++){
   let f,k;
   if(i<20){f=(b&c)|((~b)&d);k=0x5a827999;}
   else if(i<40){f=b^c^d;k=0x6ed9eba1;}
   else if(i<60){f=(b&c)|(b&d)|(c&d);k=0x8f1bbcdc;}
   else{f=b^c^d;k=0xca62c1d6;}
   const t=(rol(a,5)+f+e+k+w[i])>>>0;
   e=d;d=c;c=rol(b,30)>>>0;b=a;a=t;
  }
  a0=(a0+a)>>>0;b0=(b0+b)>>>0;c0=(c0+c)>>>0;d0=(d0+d)>>>0;e0=(e0+e)>>>0;
 }
 return [a0,b0,c0,d0,e0].map(hex).join("");
}
const K=new Uint32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);
function sha256(v){
 const p=padded(v),w=new Uint32Array(64);
 let state=new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
 for(let off=0;off<p.length;off+=64){
  for(let i=0;i<16;i++){const q=off+i*4;w[i]=((p[q]<<24)|(p[q+1]<<16)|(p[q+2]<<8)|p[q+3])>>>0;}
  for(let i=16;i<64;i++){const x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(ror(x,7)^ror(x,18)^(x>>>3))+w[i-7]+(ror(y,17)^ror(y,19)^(y>>>10)))>>>0;}
  let [a,b,c,d,e,f,g,h]=state;
  for(let i=0;i<64;i++){
   const t1=(h+(ror(e,6)^ror(e,11)^ror(e,25))+((e&f)^((~e)&g))+K[i]+w[i])>>>0;
   const t2=((ror(a,2)^ror(a,13)^ror(a,22))+((a&b)^(a&c)^(b&c)))>>>0;
   h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;
  }
  const next=[a,b,c,d,e,f,g,h];for(let i=0;i<8;i++)state[i]=(state[i]+next[i])>>>0;
 }
 return Array.from(state).map(hex).join("");
}
function blob(s){const b=utf8(s),head=utf8("blob "+b.length+"\0"),all=new Uint8Array(head.length+b.length);all.set(head);all.set(b,head.length);return sha1(all);}
return {utf8,sha1,sha256,blob};
})();
  const fail = message => { throw new Error(message); };
  const equal = (actual, expected, message) => { if (!Object.is(actual, expected)) fail(message || 'Values differ'); };
  const same = (actual, expected, message) => equal(JSON.stringify(actual), JSON.stringify(expected), message);
  const ok = (value, message) => { if (!value) fail(message || 'Expected truthy value'); };
  const between = (text, start, end) => {
    const a = text.indexOf(start), b = text.indexOf(end, a);
    if (a < 0 || b < 0 || text.indexOf(start, a + start.length) >= 0) fail('Source anchor missing or ambiguous');
    return text.slice(a, b);
  };
  equal(h.blob(preimage), 'd21bf8d24520183a61bf6b82879d78bd6a9d322f', 'Preimage identity');
  equal(h.blob(source), 'ae88774e652cab55d556b5cd94da0a85d2505a45', 'Candidate identity');
  const helpers = between(source, '// Failure-only observation of responses already returned', 'async function waitFor(');
  const wait = between(source, 'async function waitFor(', 'const inspect =');
  const oldWait = between(preimage, 'async function waitFor(', 'const inspect =');
  const shown = between(source, 'async function show(', 'const control =');
  const oldShow = between(preimage, 'async function show(', 'const control =');
  const groups = [], metrics = {};
  const group = async (name, task) => { await task(); groups.push({ name, status: 'passed' }); };
  function build({ original = false, responses, requestError, inspectError, writeError, consoleError, existingFile } = {}) {
    let now = 0, index = 0;
    const calls = [], logs = [], writes = [], files = new Map();
    if (existingFile !== undefined) files.set('/evidence/window-show-failure.json', existingFile);
    const errors = { wait: [], assertions: [] };
    const assert = { equal(a, b, message) {
      if (!Object.is(a, b)) { const error = new Error(message || 'Strict comparison failed'); errors.assertions.push(error); throw error; }
    } };
    const driver = { request: async (...args) => {
      calls.push({ command: args[0], payload: args[1] });
      if (requestError) throw requestError;
      return { activationPath: 'NSWorkspace.openApplication', processId: 42 };
    } };
    const inspect = async (testID, window) => {
      calls.push({ command: 'tron.inspect', payload: { window, ...(testID ? { testID } : {}) } });
      if (inspectError) throw inspectError;
      const selected = typeof responses === 'function' ? responses(index) : responses[Math.min(index, responses.length - 1)];
      index++; return selected;
    };
    const writeFileSync = (path, text, options) => {
      writes.push({ path, text, options });
      if (writeError) throw writeError;
      if (options?.flag !== 'wx') fail('Receipt must use exclusive creation');
      if (files.has(path)) throw Object.assign(new Error('fixture existing file'), { code: 'EEXIST' });
      files.set(path, text);
    };
    const console = { info(text) { if (consoleError) throw consoleError; logs.push(text); } };
    const wrapper = wait.replace('async function waitFor(', 'async function originalWaitFor(') +
      '\nasync function waitFor(...args) { try { return await originalWaitFor(...args); } catch (error) { errors.wait.push(error); throw error; } }\n';
    const execute = new Function('revision', 'output', 'child', 'driver', 'Buffer', 'console', 'writeFileSync', 'join',
      'assert', 'assertRunning', 'inspect', 'observeInitialWindowRequest', 'pause', 'Date', 'errors',
      helpers + wrapper + (original ? oldShow : shown) +
      '\nreturn { show, projectShowResponse, createShowObservation, captureShowResponse, showObservationSummary, reportShowFailure };');
    const api = execute('a'.repeat(40), '/evidence', { pid: 42 }, driver, { byteLength: text => h.utf8(text).length },
      console, writeFileSync, (...parts) => parts.join('/'), assert, () => {}, inspect, value => value,
      async delay => { equal(delay, 50, 'Unchanged polling pause'); now += delay; }, { now: () => now }, errors);
    return { api, calls, logs, writes, files, errors, now: () => now };
  }
  const good = { processId: 42, activationPolicy: 0, canBecomeKey: true,
    visible: true, key: true, applicationActive: true, frontmostProcessId: 42 };
  const captureError = async action => { try { await action(); } catch (error) { return error; } fail('Expected rejection'); };
  const consoleReport = fixture => {
    equal(fixture.logs.length, 1, 'One bounded failure console record');
    const lines = fixture.logs[0].split('\n');
    equal(lines.length, 3, 'Single complete JSON envelope');
    equal(lines[0], 'NYCTRON_WINDOW_SHOW_EVIDENCE_BEGIN');
    equal(lines[2], 'NYCTRON_WINDOW_SHOW_EVIDENCE_END');
    ok(h.utf8(fixture.logs[0] + '\n').length <= 8192, 'Full envelope byte bound');
    return JSON.parse(lines[1]);
  };

  await group('exact source identities, two inverses, syntax and unchanged acceptance predicates', () => {
    equal(wait, oldWait, 'Actual waitFor implementation changed');
    equal(source.replace(helpers, '').replace(shown, oldShow), preimage, 'Complete inverse');
    equal(source.split(helpers).length, 2, 'Unique helper insertion');
    equal(source.split(shown).length, 2, 'Unique show replacement');
    const strict = [
      "assert.equal(request.activationPath, 'NSWorkspace.openApplication');",
      "assert.equal(request.processId, child.pid, 'Workspace activation must retain the launched acceptance process');",
      'assert.equal(observed.processId, child.pid);',
      "assert.equal(observed.activationPolicy, 0, 'Interactive acceptance requires regular AppKit activation policy');",
      "assert.equal(observed.canBecomeKey, true, 'The requested owner must be able to become key');",
      'return observed.visible && observed.key && observed.applicationActive && observed.frontmostProcessId === child.pid ? observed : undefined;',
    ];
    for (const line of strict) { ok(oldShow.includes(line)); ok(shown.includes(line)); }
    equal(shown.match(/driver\.request\(/g)?.length, 1);
    equal(shown.match(/await inspect\(/g)?.length, 1);
    equal(source.slice(source.indexOf('const control =')), preimage.slice(preimage.indexOf('const control =')), 'All later gates and failure cleanup unchanged');
    const syntaxOnly = source.split('\n').filter(line => !/^import /.test(line)).join('\n').replaceAll('import.meta.url', "'file:///review-only/verify-native.mjs'");
    new Function('return async function(){\n' + syntaxOnly + '\n}');
  });

  await group('typed false key, false active, unknowns and closed projection privacy', () => {
    const f = build({ responses: [good] }), p = f.api.projectShowResponse;
    const key = p({ ...good, key: false }, 42), active = p({ ...good, applicationActive: false }, 42);
    equal(key.conjunction.key, false); equal(key.conjunction.applicationActive, true);
    equal(active.conjunction.key, true); equal(active.conjunction.applicationActive, false);
    const unknown = p({ processId: '42', activationPolicy: '0', canBecomeKey: 1, visible: 'yes', key: null,
      applicationActive: undefined, frontmostProcessId: -1, label: 'PRIVATE_FIXTURE_STRING', path: '/private/fixture' }, 42);
    same(unknown, { assertions: { processIdMatches: null, activationPolicyRegular: null, canBecomeKey: null },
      conjunction: { visible: null, key: null, applicationActive: null, frontmostProcessMatches: null } });
    ok(!JSON.stringify(unknown).includes('PRIVATE_FIXTURE_STRING'));
    equal(f.api.createShowObservation('PRIVATE_FIXTURE_STRING', 42).owner, null);
    const state = f.api.createShowObservation('main', 42);
    f.api.captureShowResponse(state, { get processId() { throw new Error('private getter text'); } });
    const summary = f.api.showObservationSummary(state);
    equal(summary.captureFailed, true); equal(summary.records.length, 1); equal(summary.records[0].last, true);
    equal(summary.records[0].assertions.processIdMatches, null);
    ok(!JSON.stringify(summary).includes('private getter text'));
  });

  await group('bounded first/last/state-change selection and explicit omissions', () => {
    const f = build({ responses: [good] }), s = f.api.createShowObservation('document-1', 42);
    for (let index = 0; index < 20; index++) f.api.captureShowResponse(s, { ...good, key: index % 2 === 0 });
    f.api.captureShowResponse(s, { ...good, key: false });
    const summary = f.api.showObservationSummary(s);
    equal(summary.returnedResponses, 21); equal(summary.stateChanges, 19);
    equal(summary.records.length, 8); equal(summary.records[0].response, 1); equal(summary.records.at(-1).response, 21);
    equal(summary.omittedResponses, 13); equal(summary.omittedStateChanges, 13);
    equal(summary.records.filter(x => x.first).length, 1); equal(summary.records.filter(x => x.last).length, 1);
    const repeated = f.api.createShowObservation('main', 42);
    for (let i = 0; i < 6; i++) f.api.captureShowResponse(repeated, good);
    const compact = f.api.showObservationSummary(repeated);
    equal(compact.records.length, 2); equal(compact.stateChanges, 0); equal(compact.omittedResponses, 4);
    repeated.returnedResponses = Number.MAX_SAFE_INTEGER;
    f.api.captureShowResponse(repeated, good);
    const overflow = f.api.showObservationSummary(repeated);
    equal(overflow.returnedResponses, null); equal(overflow.omittedResponses, null); equal(overflow.countOverflow, true);
  });

  await group('original 20-second timeout identity and identical command sequence', async () => {
    const state = { ...good, key: false };
    const current = build({ responses: [state] }), original = build({ original: true, responses: [state] });
    const actual = await captureError(() => current.api.show('document-1'));
    const prior = await captureError(() => original.api.show('document-1'));
    equal(actual, current.errors.wait[0], 'Catch replaced original timeout object');
    equal(actual.message, prior.message);
    equal(current.now(), 20000); equal(original.now(), 20000);
    same(current.calls, original.calls, 'Diagnostic added or changed a command');
    equal(current.calls.length, 401); equal(current.calls.filter(x => x.command === 'tron.window').length, 1);
    const report = consoleReport(current);
    equal(report.returnedResponses, 400); equal(report.records[0].conjunction.key, false);
    equal(report.original.writeStatus, 'retained');
    equal(current.writes.length, 1); equal(current.writes[0].path, '/evidence/window-show-failure.json');
    metrics.timeoutPolls = report.returnedResponses;
    metrics.ordinaryEnvelopeBytes = h.utf8(current.logs[0] + '\n').length;
  });

  await group('successful polling keeps commands, return value and no diagnostic artifact', async () => {
    const states = [{ ...good, key: false }, { ...good, applicationActive: false }, good];
    const current = build({ responses: states }), original = build({ original: true, responses: states });
    equal(await current.api.show('main'), good); equal(await original.api.show('main'), good);
    same(current.calls, original.calls); equal(current.now(), 100); equal(original.now(), 100);
    equal(current.logs.length, 0); equal(current.writes.length, 0);
  });

  await group('assertion facts and inspect rejection preserve their original errors', async () => {
    for (const [field, value, projected] of [['processId', 43, 'processIdMatches'], ['activationPolicy', 1, 'activationPolicyRegular'], ['canBecomeKey', false, 'canBecomeKey']]) {
      const f = build({ responses: [{ ...good, [field]: value }] });
      const error = await captureError(() => f.api.show('main'));
      equal(error, f.errors.assertions[0]); equal(error, f.errors.wait[0]); equal(f.calls.length, 2); equal(f.now(), 0);
      const record = consoleReport(f).records[0];
      equal(record.assertions[projected], false);
      same(record.conjunction, { visible: true, key: true, applicationActive: true, frontmostProcessMatches: true });
    }
    const missing = build({ responses: [{ ...good, activationPolicy: undefined }] });
    equal(await captureError(() => missing.api.show('main')), missing.errors.assertions[0]);
    equal(consoleReport(missing).records[0].assertions.activationPolicyRegular, null);
    const sentinel = new Error('private inspect failure'), failed = build({ inspectError: sentinel });
    equal(await captureError(() => failed.api.show('document-1')), sentinel);
    equal(consoleReport(failed).returnedResponses, 0); equal(failed.calls.length, 2);
    ok(!failed.logs[0].includes('private inspect failure'));
  });

  await group('file and console failures are secondary; first receipt cannot be replaced', async () => {
    for (const code of ['EACCES', 'EEXIST', 'PRIVATE_FIXTURE_CODE']) {
      const f = build({ responses: [{ ...good, key: false }], writeError: Object.assign(new Error('private file failure'), { code }) });
      const error = await captureError(() => f.api.show('main'));
      equal(error, f.errors.wait[0]); equal(f.now(), 20000);
      const report = consoleReport(f);
      equal(report.original.writeStatus, 'failed');
      equal(report.original.writeErrorCode, code === 'PRIVATE_FIXTURE_CODE' ? 'other' : code);
      ok(!f.logs[0].includes('private file failure')); ok(!f.logs[0].includes('PRIVATE_FIXTURE_CODE'));
    }
    const first = 'unchanged-first-receipt', duplicate = build({ responses: [{ ...good, key: false }], existingFile: first });
    equal(await captureError(() => duplicate.api.show('main')), duplicate.errors.wait[0]);
    equal(duplicate.files.get('/evidence/window-show-failure.json'), first);
    equal(consoleReport(duplicate).original.writeErrorCode, 'EEXIST');
    const silent = build({ responses: [{ ...good, key: false }], writeError: new Error('write'), consoleError: new Error('log') });
    equal(await captureError(() => silent.api.show('main')), silent.errors.wait[0]);
    equal(silent.calls.length, 401);
  });

  await group('maximum valid record/count widths remain inside the complete 8-KiB envelope', () => {
    const f = build({ responses: [good] }), s = f.api.createShowObservation('document-1', Number.MAX_SAFE_INTEGER);
    s.returnedResponses = Number.MAX_SAFE_INTEGER - 21;
    s.stateChanges = Number.MAX_SAFE_INTEGER - 21;
    for (let index = 0; index < 20; index++) f.api.captureShowResponse(s, {
      ...good, processId: Number.MAX_SAFE_INTEGER, frontmostProcessId: Number.MAX_SAFE_INTEGER, key: index % 2 === 0,
    });
    f.api.captureShowResponse(s, { ...good, processId: Number.MAX_SAFE_INTEGER, frontmostProcessId: Number.MAX_SAFE_INTEGER, key: false });
    f.api.reportShowFailure(s);
    const report = consoleReport(f);
    equal(report.records.length, 8); equal(report.original.writeStatus, 'retained');
    ok(report.records.every(x => Object.values(x.assertions).every(v => typeof v === 'boolean' || v === null)));
    ok(report.records.every(x => Object.values(x.conjunction).every(v => typeof v === 'boolean' || v === null)));
    metrics.maximumValidEnvelopeBytes = h.utf8(f.logs[0] + '\n').length;
    ok(metrics.maximumValidEnvelopeBytes <= 8192);
    ok(h.utf8(f.files.get('/evidence/window-show-failure.json')).length <= 8192);
  });
  return { status: 'passed', scope: 'pure V8 source parsing and mocked IO/clock/driver; no Node filesystem or AppKit execution',
    groups, metrics, source: { gitBlob: h.blob(source), bytes: h.utf8(source).length, sha256: h.sha256(source) },
    preimage: { gitBlob: h.blob(preimage), bytes: h.utf8(preimage).length, sha256: h.sha256(preimage) } };
})