// Reproducible review of diagnostic-only AppKit activation timing.
// Evaluate this script, then call reviewActivationTiming(driverBefore, driverAfter, verifierBefore, verifierAfter).
// Source strings must be the four exact Git blobs in timingManifest. IO is mocked; no Node/AppKit/native execution occurs.

function gitBlobSha(text) {
function utf8(value){const out=[];for(const ch of value){const c=ch.codePointAt(0);if(c<128)out.push(c);else if(c<2048)out.push(192|(c>>6),128|(c&63));else if(c<65536)out.push(224|(c>>12),128|((c>>6)&63),128|(c&63));else out.push(240|(c>>18),128|((c>>12)&63),128|((c>>6)&63),128|(c&63));}return out;}
const body=utf8(text), bytes=utf8("blob "+body.length+"\0").concat(body);
const len=bytes.length*8;bytes.push(128);while(bytes.length%64!==56)bytes.push(0);const high=Math.floor(len/4294967296),low=len>>>0;for(let n=3;n>=0;n--)bytes.push((high>>>(n*8))&255);for(let n=3;n>=0;n--)bytes.push((low>>>(n*8))&255);
let h0=0x67452301,h1=0xefcdab89,h2=0x98badcfe,h3=0x10325476,h4=0xc3d2e1f0;
const rol=(v,n)=>((v<<n)|(v>>>(32-n)))>>>0;
for(let o=0;o<bytes.length;o+=64){const w=new Uint32Array(80);for(let j=0;j<16;j++)w[j]=((bytes[o+j*4]<<24)|(bytes[o+j*4+1]<<16)|(bytes[o+j*4+2]<<8)|bytes[o+j*4+3])>>>0;for(let j=16;j<80;j++)w[j]=rol(w[j-3]^w[j-8]^w[j-14]^w[j-16],1);let a=h0,b=h1,c=h2,d=h3,e=h4;for(let j=0;j<80;j++){let f,k;if(j<20){f=(b&c)|((~b)&d);k=0x5a827999;}else if(j<40){f=b^c^d;k=0x6ed9eba1;}else if(j<60){f=(b&c)|(b&d)|(c&d);k=0x8f1bbcdc;}else{f=b^c^d;k=0xca62c1d6;}const temp=(rol(a,5)+f+e+k+w[j])>>>0;e=d;d=c;c=rol(b,30);b=a;a=temp;}h0=(h0+a)>>>0;h1=(h1+b)>>>0;h2=(h2+c)>>>0;h3=(h3+d)>>>0;h4=(h4+e)>>>0;}
return [h0,h1,h2,h3,h4].map(v=>v.toString(16).padStart(8,"0")).join("");
}
function sha256Bytes(input) {
  const bytes=Array.from(input);
  const byteLength=bytes.length, bitLength=byteLength*8;
  bytes.push(0x80);while(bytes.length%64!==56)bytes.push(0);
  const hi=Math.floor(bitLength/4294967296),lo=bitLength>>>0;
  for(let i=3;i>=0;i--)bytes.push((hi>>>(i*8))&255);
  for(let i=3;i>=0;i--)bytes.push((lo>>>(i*8))&255);
  const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64);
  const rr=(x,n)=>(x>>>n)|(x<<(32-n));
  for(let o=0;o<bytes.length;o+=64){
    for(let j=0;j<16;j++)w[j]=((bytes[o+j*4]<<24)|(bytes[o+j*4+1]<<16)|(bytes[o+j*4+2]<<8)|bytes[o+j*4+3])>>>0;
    for(let j=16;j<64;j++){const s0=rr(w[j-15],7)^rr(w[j-15],18)^(w[j-15]>>>3),s1=rr(w[j-2],17)^rr(w[j-2],19)^(w[j-2]>>>10);w[j]=(w[j-16]+s0+w[j-7]+s1)>>>0;}
    let [a,b,c,d,e,f,g,hh]=h;
    for(let j=0;j<64;j++){const s1=rr(e,6)^rr(e,11)^rr(e,25),ch=(e&f)^(~e&g),t1=(hh+s1+ch+k[j]+w[j])>>>0,s0=rr(a,2)^rr(a,13)^rr(a,22),maj=(a&b)^(a&c)^(b&c),t2=(s0+maj)>>>0;hh=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;}
    const v=[a,b,c,d,e,f,g,hh];for(let j=0;j<8;j++)h[j]=(h[j]+v[j])>>>0;
  }
  return {bytes:byteLength,sha256:h.map(x=>x.toString(16).padStart(8,"0")).join("")};
}
const utf8 = s=>{const out=[];for(const c of s){const n=c.codePointAt(0);if(n<128)out.push(n);else if(n<2048)out.push(192|(n>>6),128|(n&63));else if(n<65536)out.push(224|(n>>12),128|((n>>6)&63),128|(n&63));else out.push(240|(n>>18),128|((n>>12)&63),128|((n>>6)&63),128|(n&63));}return out;};
const timingManifest = {
  "driver": {
    "preimage": "5a7c3b5c293dced56ad7dc4d28cfee75015288a4",
    "gitBlob": "209e0ebfee4b9ba7fe902b64ec1bd09ae108b000",
    "bytes": 58123,
    "sha256": "6de2030b82c0881cc9eb39307da72c0a985a4f90a6bdc11568bae3e752fcadf9"
  },
  "verifier": {
    "preimage": "0b0555a2cb0c37867418600bf9c9fbfbd77e6566",
    "gitBlob": "2d9efdb7834b3ee461bf00e3fecbcc5c11b43964",
    "bytes": 70956,
    "sha256": "489685c674ced00fdd831043f315e7698991fcca5b9b0e4f9ad4d1920d6bb74b"
  }
};
const timingNativeTransforms = [
  {
    "label": "clock import",
    "old": "#import <AppKit/AppKit.h>\n",
    "replacement": "#import <AppKit/AppKit.h>\n#import <QuartzCore/CAMediaTiming.h>\n"
  },
  {
    "label": "callback samples and guarded continuation details",
    "old": "        [NSWorkspace.sharedWorkspace openApplicationAtURL:bundleURL configuration:configuration completionHandler:^(NSRunningApplication *application, NSError *error) {\n          TraceActivation(@\"workspace-completion-received\", operation, ^{ return @{ @\"hasApplication\": @(application != nil), @\"hasError\": @(error != nil) }; });\n          // NSWorkspace completes on a concurrent queue; window operations and\n          // the observed activation state must return to AppKit's main queue.\n          dispatch_async(dispatch_get_main_queue(), ^{\n            TraceActivation(@\"workspace-main-continuation\", operation, ^{ return ActivationWindowState(window); });\n",
    "replacement": "        [NSWorkspace.sharedWorkspace openApplicationAtURL:bundleURL configuration:configuration completionHandler:^(NSRunningApplication *application, NSError *error) {\n          const CFTimeInterval completionTraceStarted = CACurrentMediaTime();\n          TraceActivation(@\"workspace-completion-received\", operation, ^{ return @{ @\"hasApplication\": @(application != nil), @\"hasError\": @(error != nil) }; });\n          // NSWorkspace completes on a concurrent queue; window operations and\n          // the observed activation state must return to AppKit's main queue.\n          const CFTimeInterval submissionStarted = CACurrentMediaTime();\n          dispatch_async(dispatch_get_main_queue(), ^{\n            const CFTimeInterval mainEntered = CACurrentMediaTime();\n            TraceActivation(@\"workspace-main-continuation\", operation, ^{\n              // This clock excludes system sleep. Both intervals include any\n              // descheduling; submission-to-entry also includes dispatch work.\n              // Neither duration isolates queue residence or establishes cause.\n              double completionTraceElapsedSeconds = submissionStarted - completionTraceStarted;\n              double submissionStartToMainEntrySeconds = mainEntered - submissionStarted;\n              return @{ @\"state\": ActivationWindowState(window), @\"timing\": @{\n                @\"clock\": @\"CACurrentMediaTime\", @\"clockExcludesSystemSleep\": @YES,\n                @\"intervalsAreNotQueueResidence\": @YES, @\"intervalsDoNotEstablishCause\": @YES,\n                @\"completionTraceElapsedSeconds\": isfinite(completionTraceElapsedSeconds) && completionTraceElapsedSeconds >= 0 ? @(completionTraceElapsedSeconds) : NSNull.null,\n                @\"submissionStartToMainEntrySeconds\": isfinite(submissionStartToMainEntrySeconds) && submissionStartToMainEntrySeconds >= 0 ? @(submissionStartToMainEntrySeconds) : NSNull.null\n              } };\n            });\n"
  }
];
const timingVerifierTransform = {
  "label": "continuation-only typed timing projection",
  "old": "    for (const key of ['applicationActive', 'visible', 'key', 'miniaturized', 'canBecomeKey']) result.state[key] = bool(state[key]);\n",
  "replacement": "    for (const key of ['applicationActive', 'visible', 'key', 'miniaturized', 'canBecomeKey']) result.state[key] = bool(state[key]);\n    if (value.phase === 'workspace-main-continuation') {\n      const timing = object(details.timing) ? details.timing : {}, knownClock = timing.clock === 'CACurrentMediaTime';\n      result.timing = { clock: knownClock ? 'CACurrentMediaTime' : null,\n        clockExcludesSystemSleep: knownClock && timing.clockExcludesSystemSleep === true ? true : null,\n        intervalsAreNotQueueResidence: knownClock && timing.intervalsAreNotQueueResidence === true ? true : null,\n        intervalsDoNotEstablishCause: knownClock && timing.intervalsDoNotEstablishCause === true ? true : null,\n        completionTraceElapsedSeconds: knownClock ? number(timing.completionTraceElapsedSeconds) : null,\n        submissionStartToMainEntrySeconds: knownClock ? number(timing.submissionStartToMainEntrySeconds) : null };\n    }\n"
};
function createStartupTimingHarness(block, inputFiles, options = {}) {
  const encode = value => {
    const out = [];
    for (const c of String(value)) {
      const x = c.codePointAt(0);
      if (x < 128) out.push(x);
      else if (x < 2048) out.push(192 | (x >> 6), 128 | (x & 63));
      else if (x < 65536) out.push(224 | (x >> 12), 128 | ((x >> 6) & 63), 128 | (x & 63));
      else out.push(240 | (x >> 18), 128 | ((x >> 12) & 63), 128 | ((x >> 6) & 63), 128 | (x & 63));
    }
    return out;
  };
  class MockBuffer extends Uint8Array {
    static alloc(size) { return new MockBuffer(size); }
    static from(value) { return new MockBuffer(typeof value === 'string' ? encode(value) : value); }
    static byteLength(value) { return encode(value).length; }
    toString() { return decodeURIComponent(Array.from(this, x => '%' + x.toString(16).padStart(2, '0')).join('')); }
  }
  const files = new Map(), handles = new Map(), logs = [], reads = [], writes = [], touched = [];
  for (const [name, contents] of Object.entries(inputFiles)) files.set('/owned/' + name, { bytes: MockBuffer.from(contents), ino: files.size + 1 });
  let nextHandle = 1;
  const stat = file => ({ isFile: () => true, size: file.bytes.length, dev: 1, ino: file.ino, mtimeMs: 1, ctimeMs: 1 });
  const context = {
    Buffer: MockBuffer, output: '/owned', join: (...parts) => parts.join('/'), revision: 'a'.repeat(40), child: { pid: 77 },
    hash: value => sha256Bytes(value).sha256,
    lstatSync(path) {
      touched.push({ operation: 'stat', path });
      const file = files.get(path);
      if (!file || options.failStage === 'stat') throw Error('SECRET stat path');
      return stat(file);
    },
    openSync(path, flag) {
      touched.push({ operation: 'open', path, flag });
      if (flag !== 'r' || !files.has(path) || options.failStage === 'open') throw Error('SECRET open path');
      const fd = nextHandle++; handles.set(fd, { path, file: files.get(path) }); return fd;
    },
    fstatSync(fd) { if (!handles.has(fd)) throw Error('SECRET fstat'); return stat(handles.get(fd).file); },
    readSync(fd, target, offset, count, position) {
      if (!handles.has(fd) || !Number.isSafeInteger(position) || options.failStage === 'read') throw Error('SECRET read path');
      const file = handles.get(fd).file, size = Math.max(0, Math.min(count, file.bytes.length - position, options.chunkSize || Infinity));
      target.set(file.bytes.subarray(position, position + size), offset);
      reads.push({ path: handles.get(fd).path, offset: position, requested: count, bytes: size }); return size;
    },
    closeSync(fd) {
      if (!handles.has(fd)) throw Error('SECRET close');
      handles.delete(fd); if (options.failStage === 'close') throw Error('SECRET close path');
    },
    writeFileSync(path, bytes, config) {
      writes.push({ path, flag: config?.flag, bytes: MockBuffer.from(bytes) });
      if (path !== '/owned/startup-app-log-snapshot.log' || config?.flag !== 'wx' || files.has(path) || options.failStage === 'write') throw Error('SECRET snapshot conflict');
      files.set(path, { bytes: MockBuffer.from(bytes), ino: files.size + 1 });
    },
    console: { info(value) { if (options.consoleFailure) throw Error('SECRET console'); logs.push(String(value)); } },
  };
  const api = new Function('context', 'const { Buffer, output, join, hash, child, revision, console, lstatSync, openSync, fstatSync, readSync, closeSync, writeFileSync } = context;\n' + block + '\nreturn { startupProject, startupStream, startupProcess, readStartupInput, reportStartupFailure };')(context);
  return { api, files, logs, reads, writes, touched, handles, Buffer: MockBuffer,
    report() {
      api.reportStartupFailure(); if (!logs.length) return null;
      const lines = logs.at(-1).split('\n');
      if (lines.length !== 3 || lines[0] !== 'NYCTRON_STARTUP_EVIDENCE_BEGIN' || lines[2] !== 'NYCTRON_STARTUP_EVIDENCE_END') throw Error('Invalid startup envelope');
      return JSON.parse(lines[1]);
    }
  };
}
function reviewActivationTiming(driverBefore, driverAfter, verifierBefore, verifierAfter) {
  const groups = [], measured = {};
  const assert = (condition, message) => { if (!condition) throw Error(message); };
  const equal = (a, b, message) => assert(JSON.stringify(a) === JSON.stringify(b), message);
  const check = (name, action) => { action(); groups.push({ name, status: 'passed' }); };
  const replaceOnce = (source, from, to) => {
    assert(source.split(from).length === 2, 'Transform anchor is not unique');
    return source.replace(from, () => to);
  };
  const block = source => {
    const begin = source.indexOf('function startupProject('), end = source.indexOf('\nasync function waitFor(', begin);
    assert(begin >= 0 && end > begin, 'Missing startup functions');
    return source.slice(begin, end);
  };
  const oldBlock = block(verifierBefore), newBlock = block(verifierAfter);
  const project = new Function(newBlock + '\nreturn startupProject;')();
  const beforeProject = new Function(oldBlock + '\nreturn startupProject;')();
  const state = { policy: 0, applicationActive: false, visible: true, key: false, miniaturized: false, canBecomeKey: true };
  const timing = { clock: 'CACurrentMediaTime', clockExcludesSystemSleep: true, intervalsAreNotQueueResidence: true,
    intervalsDoNotEstablishCause: true, completionTraceElapsedSeconds: 0.125, submissionStartToMainEntrySeconds: 35.25 };
  const record = (changes = {}) => ({ phase: 'workspace-main-continuation', at: 1794368087.035872, mainThread: true, operation: 1,
    details: { state, timing }, ...changes });
  const line = (value, pid = 77, kind = 'activation') => '2026-11-11 03:34:47.035 Fixture[' + pid + ':42] ' +
    (kind === 'activation' ? 'NYCTronActivation' : 'NYCTronDriverTransport') + ' ' + JSON.stringify(value) + '\n';
  const files = appLog => ({
    'app.log': appLog,
    'commands.jsonl': JSON.stringify({ phase: 'request-started', at: '2026-11-11T03:34:11.314Z', request: { id: 2, command: 'tron.window', token: 'SECRET credential' } }) + '\n',
    'native-process-failure.json': JSON.stringify({ schemaVersion: 1, processId: 77, observedAt: '2026-11-11T03:34:46.321Z', stdout: 'SECRET raw process path' })
  });
  const withoutTiming = value => {
    const copy = JSON.parse(JSON.stringify(value)); delete copy.timing; return copy;
  };
  check('exact input identities and two-file source inverses', () => {
    equal(gitBlobSha(''), 'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391', 'Git empty vector');
    equal(sha256Bytes(utf8('abc')).sha256, 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', 'SHA vector');
    for (const [key, before, after] of [['driver', driverBefore, driverAfter], ['verifier', verifierBefore, verifierAfter]]) {
      assert(gitBlobSha(before) === timingManifest[key].preimage, key + ' preimage mismatch');
      assert(gitBlobSha(after) === timingManifest[key].gitBlob && utf8(after).length === timingManifest[key].bytes &&
        sha256Bytes(utf8(after)).sha256 === timingManifest[key].sha256, key + ' candidate identity mismatch');
    }
    let inverse = driverAfter;
    for (const change of timingNativeTransforms.slice().reverse()) inverse = replaceOnce(inverse, change.replacement, change.old);
    assert(inverse === driverBefore, 'Native scope extends beyond approved transforms');
    assert(replaceOnce(verifierAfter, timingVerifierTransform.replacement, timingVerifierTransform.old) === verifierBefore, 'Verifier scope exceeds projection insertion');
  });
  check('native sample positions, immutable captures, original trace/state counts and verifier syntax', () => {
    assert(driverAfter.includes('#import <QuartzCore/CAMediaTiming.h>\n'), 'Clock declaration import absent');
    assert((driverAfter.match(/const CFTimeInterval \w+ = CACurrentMediaTime\(\);/g) || []).length === 3, 'Unexpected clock sample count');
    assert(driverAfter.includes('completionHandler:^(NSRunningApplication *application, NSError *error) {\n          const CFTimeInterval completionTraceStarted = CACurrentMediaTime();\n          TraceActivation(@"workspace-completion-received"'), 'Callback sample is not before existing trace');
    assert(driverAfter.includes('const CFTimeInterval submissionStarted = CACurrentMediaTime();\n          dispatch_async(dispatch_get_main_queue(), ^{\n            const CFTimeInterval mainEntered = CACurrentMediaTime();\n            TraceActivation(@"workspace-main-continuation"'), 'Submission/entry positions add work before dispatch or entry sample');
    for (const marker of ['ActivationWindowState(window)', 'TraceActivation(', 'dispatch_async(', '@catch', 'std::atomic']) {
      assert(driverAfter.split(marker).length === driverBefore.split(marker).length, 'Original operation count changed: ' + marker);
    }
    const added = timingNativeTransforms[1].replacement;
    assert(!added.includes('__block'), 'Shared mutation introduced');
    assert(added.indexOf('double completionTraceElapsedSeconds') > added.indexOf('TraceActivation(@"workspace-main-continuation"'), 'Duration work escaped lazy diagnostic guard');
    for (const field of ['completionTraceElapsedSeconds', 'submissionStartToMainEntrySeconds']) {
      assert(added.includes('isfinite(' + field + ') && ' + field + ' >= 0 ? @(' + field + ') : NSNull.null'), 'Invalid native duration is not explicit null');
    }
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    new AsyncFunction(verifierAfter.replace(/^import .*;\n/gm, '').replaceAll('import.meta.url', "'file:///parse-only.mjs'"));
  });
  check('typed valid zero/positive durations preserve epoch and existing window state', () => {
    const got = project('activation', record());
    equal(got.timing, timing, 'Valid timing changed');
    equal(got.state, state, 'Existing state changed');
    equal(withoutTiming(got), beforeProject('activation', record()), 'Original projection fields changed');
    const zero = project('activation', record({ details: { state, timing: { ...timing, completionTraceElapsedSeconds: 0, submissionStartToMainEntrySeconds: 0 } } }));
    assert(zero.timing.completionTraceElapsedSeconds === 0 && zero.timing.submissionStartToMainEntrySeconds === 0, 'Zero promoted to unknown');
    assert(got.atEpochSeconds === 1794368087.035872, 'Existing epoch timestamp was replaced by monotonic time');
    equal(project('activation', record({ details: state })).state, state, 'Historical flat-state format no longer works');
  });
  check('missing, malformed and unrecognized clocks keep every timing field explicitly unknown', () => {
    const expected = Object.fromEntries(Object.keys(timing).map(key => [key, null]));
    for (const value of [undefined, null, [], 'SECRET clock payload', {}, { ...timing, clock: null }, { ...timing, clock: false },
      { ...timing, clock: 'Date.now' }, { ...timing, clock: ['CACurrentMediaTime'] }]) {
      equal(project('activation', record({ details: { state, timing: value } })).timing, expected, 'Unknown clock promoted data');
    }
    equal(project('activation', record({ details: null })).timing, expected, 'Missing detail object omitted unknown fields');
  });
  check('no numeric coercion or invalid-duration promotion, fixed metadata remains typed', () => {
    for (const value of [undefined, null, true, false, '', '0.1', [], {}, NaN, Infinity, -Infinity, -0.1, Number.MAX_SAFE_INTEGER + 1]) {
      const got = project('activation', record({ details: { state, timing: { ...timing, completionTraceElapsedSeconds: value, submissionStartToMainEntrySeconds: value } } })).timing;
      assert(got.completionTraceElapsedSeconds === null && got.submissionStartToMainEntrySeconds === null, 'Invalid duration promoted: ' + String(value));
    }
    for (const key of ['clockExcludesSystemSleep', 'intervalsAreNotQueueResidence', 'intervalsDoNotEstablishCause']) {
      for (const value of [undefined, null, false, 1, 'true', []]) {
        assert(project('activation', record({ details: { state, timing: { ...timing, [key]: value } } })).timing[key] === null, 'Malformed interpretation flag promoted');
      }
    }
  });
  check('timing is phase-local and does not expose arbitrary callback/log content', () => {
    for (const phase of ['policy-entered', 'policy-returned', 'workspace-request-entered', 'workspace-request-returned',
      'workspace-completion-received', 'workspace-rejected', 'identity-checked', 'deminiaturize-entered', 'deminiaturize-returned',
      'order-front-entered', 'order-front-returned', 'reply-prepared', 'trace-encoding-failed', 'trace-encoding-threw']) {
      equal(project('activation', record({ phase })), beforeProject('activation', record({ phase })), 'Unrelated phase changed');
    }
    for (const [kind, value] of [['transport', { phase: 'main-replied', sequence: 2, command: 'tron.window', details: { timing, bytes: 157 } }],
      ['commands', { phase: 'request-started', at: '2026-11-11T03:34:11.314Z', request: { id: 2, command: 'tron.window' }, details: { timing } }]]) {
      equal(project(kind, value), beforeProject(kind, value), 'Other stream changed');
    }
    const got = project('activation', record({ path: 'SECRET path', details: { state: { ...state, title: 'SECRET title' },
      timing: { ...timing, raw: 'SECRET token', exception: 'SECRET exception', durations: [123] } } }));
    assert(!JSON.stringify(got).includes('SECRET') && !Object.hasOwn(got.timing, 'raw') && Object.keys(got.timing).length === 6, 'Unallowlisted data leaked');
  });
  check('mocked fixed-file IO retains exact snapshot bytes and hashes with new timing projection', () => {
    const input = files(line(record({ details: { state, timing: { ...timing, ignored: 'SECRET private value' } } })));
    const harness = createStartupTimingHarness(newBlock, input, { chunkSize: 17 }), report = harness.report();
    assert(report.diagnosticOnly && report.processId === 77 && report.sourceRevision === 'a'.repeat(40), 'Identity binding lost');
    equal(report.activation.records[0].timing, timing, 'Timing missing through full reporter');
    const snapshot = harness.files.get('/owned/startup-app-log-snapshot.log').bytes;
    assert(snapshot.toString() === input['app.log'], 'Snapshot changed original log bytes');
    assert(report.inputs.appLog.snapshot.retained && report.inputs.appLog.snapshot.sha256 === sha256Bytes(snapshot).sha256 &&
      report.inputs.appLog.originalSha256 === null && report.inputs.appLog.snapshot.eventualAppLogHash === false, 'Snapshot hash misrepresents final app.log');
    assert(report.inputs.commands.originalSha256 === sha256Bytes(utf8(input['commands.jsonl'])).sha256, 'Completed command digest changed');
    assert(harness.writes.length === 1 && harness.writes[0].flag === 'wx' && harness.handles.size === 0, 'Snapshot or descriptor contract changed');
    assert(harness.touched.every(x => ['/owned/app.log', '/owned/commands.jsonl', '/owned/native-process-failure.json'].includes(x.path)), 'Arbitrary path was read');
    assert(!harness.logs[0].includes('SECRET'), 'Original content leaked into console projection');
    measured.normalEnvelopeBytes = harness.Buffer.byteLength(harness.logs[0] + '\n');
    const previous = createStartupTimingHarness(oldBlock, input, { chunkSize: 17 }).report();
    delete previous.capturedAt; const normalized = JSON.parse(JSON.stringify(report)); delete normalized.capturedAt;
    for (const row of normalized.activation.records) delete row.timing;
    equal(normalized, previous, 'Existing report content or IO metadata changed');
  });
  check('PID filtering, historical records and bounded selection preserve explicit coverage', () => {
    const harness = createStartupTimingHarness(newBlock, {});
    const text = line(record(), 78) + line(record({ details: state })) + 'malformed SECRET raw line\n' +
      Array.from({ length: 70 }, (_, i) => line(record({ operation: i + 2 }))).join('');
    const result = harness.api.startupStream('activation', harness.Buffer.from(text), 77, true);
    assert(result.pidMismatchRecords === 1 && result.ignoredLines === 1 && result.matchedRecords === 71 && result.records.length === 32 && result.omittedRecords === 39, 'Stream counts or cap changed');
    assert(result.records[0].timing.clock === null && result.records.at(-1).operation === 71, 'Historical unknown or latest selected observation lost');
    assert(result.lineScanLimit === 4096 && result.lineByteLimit === 8192, 'Existing read/row budgets changed');
  });
  check('snapshot collisions and read/reporting failures remain secondary to the original error', () => {
    const input = files(line(record())), originalSnapshot = 'original snapshot';
    const collision = createStartupTimingHarness(newBlock, { ...input, 'startup-app-log-snapshot.log': originalSnapshot });
    const report = collision.report();
    assert(report.inputs.appLog.status === 'snapshot-retention-failed' && report.activation.status === 'unavailable' &&
      collision.files.get('/owned/startup-app-log-snapshot.log').bytes.toString() === originalSnapshot, 'Collision replaced original or projected unretained bytes');
    for (const stage of ['stat', 'open', 'read', 'close', 'write']) {
      const broken = createStartupTimingHarness(newBlock, input, { failStage: stage });
      const result = broken.report();
      assert(result && result.activation.status === 'unavailable' && !broken.logs[0].includes('SECRET'), 'IO error escaped or leaked');
    }
    const primary = Error('original strict activation timeout'), broken = createStartupTimingHarness(newBlock, input, { consoleFailure: true });
    let caught;
    try { try { throw primary; } catch (error) { broken.api.reportStartupFailure(); throw error; } } catch (error) { caught = error; }
    assert(caught === primary && broken.logs.length === 0, 'Diagnostic console failure replaced the primary error');
  });
  check('max-width timing records respect existing full-envelope cap and retain latest observation', () => {
    const wideTiming = { ...timing, completionTraceElapsedSeconds: Number.MAX_SAFE_INTEGER, submissionStartToMainEntrySeconds: Number.MAX_SAFE_INTEGER };
    const activation = Array.from({ length: 96 }, (_, i) => line(record({ operation: i + 1, at: Number.MAX_SAFE_INTEGER, details: { state, timing: wideTiming } }))).join('');
    const transportValue = { phase: 'serialization-failed', at: Number.MAX_SAFE_INTEGER, mainThread: false, sequence: Number.MAX_SAFE_INTEGER, command: 'tron.context-menu',
      details: { parsed: true, dictionary: true, nilResponse: false, validJSONObject: false, hasError: true, threwException: false, replacedWithFailure: true,
        bytes: Number.MAX_SAFE_INTEGER, errno: Number.MAX_SAFE_INTEGER, errorCode: -Number.MAX_SAFE_INTEGER } };
    const input = files(activation + Array.from({ length: 96 }, () => line(transportValue, 77, 'transport')).join(''));
    input['commands.jsonl'] = Array.from({ length: 96 }, () => JSON.stringify({ phase: 'response', at: '2026-11-11T03:34:46.318Z',
      request: { id: Number.MAX_SAFE_INTEGER, command: 'tron.context-menu' }, response: { id: Number.MAX_SAFE_INTEGER, ok: false } }) + '\n').join('');
    const harness = createStartupTimingHarness(newBlock, input), report = harness.report();
    measured.trimmedEnvelopeBytes = harness.Buffer.byteLength(harness.logs[0] + '\n');
    assert(measured.trimmedEnvelopeBytes <= 32768 && report.consoleByteLimit === 32768, 'Full emitted envelope exceeds unchanged cap');
    assert(report.activation.outputOmittedRecords + report.transport.outputOmittedRecords + report.commands.outputOmittedRecords > 0, 'Wide fixture did not exercise trimming');
    assert(report.activation.records.at(-1).operation === 96 && report.activation.records.at(-1).timing.submissionStartToMainEntrySeconds === Number.MAX_SAFE_INTEGER, 'Latest timing observation lost during deterministic trimming');
    assert(report.activation.matchedRecords === 96 && report.transport.matchedRecords === 96 && report.commands.matchedRecords === 96, 'Original coverage counts lost');
  });
  return { scope: 'V8 selectors, mocked synchronous IO, source inverses and static native-source invariants only', nativeExecution: false, nodeFilesystemExecution: false, groups, measured };
}
