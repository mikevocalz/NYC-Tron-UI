// Source review of diagnostic-only help-tag metadata and failure reporting.
// Call reviewHelpTagDiagnostics with the exact before/after Git-blob strings.
// Native code is inspected as text. No AppKit, Objective-C compilation, Node IO or OS input runs here.

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

function createTooltipHarness(block, original, options, sha256Bytes) {
  options = options || {};
  const encode = text => { const out=[]; for(const c of String(text)){const x=c.codePointAt(0);if(x<128)out.push(x);else if(x<2048)out.push(192|(x>>6),128|(x&63));else if(x<65536)out.push(224|(x>>12),128|((x>>6)&63),128|(x&63));else out.push(240|(x>>18),128|((x>>12)&63),128|((x>>6)&63),128|(x&63));}return out; };
  class MockBuffer extends Uint8Array {
    static alloc(size) { return new MockBuffer(size); }
    static from(value) { return new MockBuffer(typeof value === 'string' ? encode(value) : value); }
    static byteLength(value) { return encode(value).length; }
    toString() { return decodeURIComponent(Array.from(this, x => '%'+x.toString(16).padStart(2,'0')).join('')); }
  }
  const bytes = original === null ? null : MockBuffer.from(original);
  const handles = new Map(), logs = [], reads = [], touched = [];
  let nextHandle = 1;
  const path = '/owned/tooltip-hover.json';
  const context = {
    Buffer: MockBuffer, output: '/owned', join: (...parts) => parts.join('/'),
    hash: value => sha256Bytes(value).sha256, revision: 'a'.repeat(40), child: { pid: 123 },
    lstatSync(value) { touched.push(value); if (value !== path || !bytes || options.failStage === 'stat') throw Error('SECRET stat');
      return { isFile: () => options.regular !== false }; },
    openSync(value, flags) { if (value !== path || flags !== 'r' || options.failStage === 'open') throw Error('SECRET open');
      const fd = nextHandle++; handles.set(fd, 0); return fd; },
    readSync(fd, target, offset, count, position) {
      if (!handles.has(fd) || position !== null || options.failStage === 'read') throw Error('SECRET read');
      const cursor = handles.get(fd), size = Math.min(count, bytes.length - cursor, options.chunkSize || Infinity);
      target.set(bytes.subarray(cursor, cursor + size), offset); handles.set(fd, cursor + size);
      reads.push({ offset: cursor, requested: count, bytes: size }); return size;
    },
    closeSync(fd) { if (!handles.has(fd)) throw Error('bad close'); handles.delete(fd); if (options.failStage === 'close') throw Error('SECRET close'); },
    console: { info(value) { if (options.consoleFailure) throw Error('SECRET console'); logs.push(String(value)); } }
  };
  const factory = new Function('context', 'const { Buffer, output, join, hash, child, revision, console, lstatSync, openSync, readSync, closeSync } = context;\n' + block + '\nreturn { tooltipFailureSummary, reportTooltipFailure };');
  const api = factory(context);
  return { api, logs, reads, handles, touched, bytes, Buffer: MockBuffer,
    report() {
      api.reportTooltipFailure(); if (!logs.length) return null;
      const lines = logs.at(-1).split('\n');
      if (lines.length !== 3 || lines[0] !== 'NYCTRON_TOOLTIP_EVIDENCE_BEGIN' || lines[2] !== 'NYCTRON_TOOLTIP_EVIDENCE_END') throw Error('invalid envelope');
      return JSON.parse(lines[1]);
    }
  };
}

function reviewHelpTagDiagnostics(driverBefore, driverAfter, verifierBefore, verifierAfter) {
  const assert = (value, message) => { if (!value) throw Error(message); };
  const clone = value => JSON.parse(JSON.stringify(value));
  const groups = [], measured = {};
  const check = (name, fn) => { fn(); groups.push({ name, status: 'passed' }); };
  const expected = "Save this document's local checkpoint";
  const extract = source => source.slice(source.indexOf('function tooltipFailureSummary('), source.indexOf('function startupProject('));
  const block = extract(verifierAfter);
  const summarize = new Function(block + '\nreturn tooltipFailureSummary;')();
  const originalSummary = new Function(extract(verifierBefore) + '\nreturn tooltipFailureSummary;')();
  const detail = (node, field) => ({ node, field, read: 'captured', calls: 2, kind: 'attributed-string',
    normalized: true, length: 37, nonempty: true, exactExpected: true, metadataStatus: 'observed' });
  const diagnostic = () => ({ schemaVersion: 1, status: 'observed', nodes: 2,
    current: { fieldSlots: 8, calls: 8, unavailable: 4, nil: 0, captured: 4, string: 2, attributedString: 2, other: 0,
      normalizedNil: 0, empty: 0, nonempty: 4, retainedStrings: 1, detailLimit: 16, detailsOmitted: 0,
      rows: Array.from({ length: 8 }, (_, i) => detail(i >> 2, ['value', 'label', 'title', 'text-field-value'][i % 4])) },
    legacy: { diagnosticOnly: true, nodeLimit: 8, nodesConsidered: 2, supportedReadsAttempted: 2, returned: 2, thrown: 0,
      selectorExceptions: 0, metadataExceptions: 0, nodesOmitted: 0,
      rows: Array.from({ length: 2 }, (_, i) => ({ ...detail(i, undefined), read: 'returned' })) } });
  const frame = { x: 329, y: 347, width: 213, height: 18 };
  const fixture = () => ({ schemaVersion: 1, status: 'failed', permission: { postEventsAllowed: true, accessibilityTrusted: true },
    lastObservation: { phase: 'hover', postEventsAllowed: true, accessibilityTrusted: true, ownerVisible: true, ownerKey: true,
      applicationActive: true, traversalTruncated: false, cursorInsideTrigger: true, pointerRunning: false,
      triggerFrame: { x: 249, y: 366, width: 160, height: 36 }, cursor: { x: 329, y: 384 },
      helpTags: [{ windowNumber: 41, role: 'AXHelpTag', frame: clone(frame), windowFrame: clone(frame),
        strings: [], textReadDiagnostic: diagnostic() }], windows: [] } });
  const first = result => result.observation.helpTags.records[0];
  const run = (record, options) => {
    const original = typeof record === 'string' || record === null ? record : JSON.stringify(record, null, 2) + '\n';
    const harness = createTooltipHarness(block, original, options, sha256Bytes);
    return { harness, report: harness.report(), original };
  };
  check('exact preimages, only two function regions in verifier, full V8 syntax', () => {
    assert(gitBlobSha(driverBefore) === 'b01dccc74827a61ce5b2cfe3ededeca5c001b045', 'driver preimage');
    assert(gitBlobSha(driverAfter) === '5a7c3b5c293dced56ad7dc4d28cfee75015288a4', 'driver candidate');
    assert(gitBlobSha(verifierBefore) === 'e773cfb2661e80f01daa400f14cd09b903e6b087', 'verifier preimage');
    assert(gitBlobSha(verifierAfter) === '0b0555a2cb0c37867418600bf9c9fbfbd77e6566', 'verifier candidate');
    assert(verifierAfter.replace(block, extract(verifierBefore)) === verifierBefore, 'changes outside tooltip functions');
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    new AsyncFunction(verifierAfter.replace(/^import .*;\n/gm, '').replaceAll('import.meta.url', "'file:///parse-only.mjs'"));
  });
  check('native source preserves original call order, normalization and unguarded failures', () => {
    const start = driverAfter.indexOf('static NSArray<NSString *> *HelpTagStrings(');
    const end = driverAfter.indexOf('static NSDictionary *TooltipObservation(', start);
    const collector = driverAfter.slice(start, end);
    const modern = collector.slice(0, collector.indexOf('  NSArray<NSString *> *result = strings.array;'));
    for (const name of ['accessibilityValue', 'accessibilityLabel', 'accessibilityTitle']) {
      assert(modern.split('[node ' + name + ']').length - 1 === 2, 'modern getter count ' + name);
      assert(modern.split('@selector(' + name + ')').length - 1 === 1, 'modern selector count ' + name);
    }
    assert(modern.split('((NSTextField *)node).stringValue').length - 1 === 1, 'text-field read');
    assert(modern.split('AccessibilityNodes(root, truncated)').length - 1 === 1, 'traversal repeated');
    assert(modern.indexOf('NSMutableOrderedSet<NSString *> *strings') < modern.indexOf('AccessibilityNodes(root, truncated)'), 'traversal relative order');
    assert(!modern.includes('@try'), 'original error swallowed');
    assert(modern.split('[value string]').length - 1 === 1 && modern.split('text.length').length - 1 === 1, 'normalization repeated');
    assert(modern.split('[strings addObject:text]').length - 1 === 1, 'ordered-set insertion changed');
    const ordered = ['@selector(accessibilityValue)', '@selector(accessibilityLabel)', '@selector(accessibilityTitle)', '[node isKindOfClass:NSTextField.class]', 'for (id value in values)', 'NSString *text = attributed', 'if (length) [strings addObject:text]'];
    assert(ordered.every((part, i) => modern.includes(part) && (!i || modern.indexOf(part) > modern.indexOf(ordered[i - 1]))), 'original calls reordered');
    assert(collector.indexOf('[node accessibilityAttributeValue:NSAccessibilityValueAttribute]') > collector.indexOf('result = strings.array'), 'legacy read precedes original result');
    assert(collector.split('[node accessibilityAttributeValue:NSAccessibilityValueAttribute]').length - 1 === 1, 'extra legacy attribute read');
    assert(collector.includes('if (budget->legacyNodes >= 8) break;') && collector.includes('if (budget->currentDetails < 16)'), 'shared caps missing');
    assert(driverAfter.split('[node accessibilityRole]').length === driverBefore.split('[node accessibilityRole]').length, 'added role reads');
    const oldCollector = driverBefore.slice(driverBefore.indexOf('static NSArray<NSString *> *HelpTagStrings('), driverBefore.indexOf('static NSDictionary *TooltipObservation('));
    let inverse = driverAfter.replace(driverAfter.slice(driverAfter.indexOf('// Read metadata stays separate from acceptance strings.'), end), () => oldCollector);
    inverse = inverse.replace('  HelpTagDiagnosticBudget diagnosticBudget;\n', '');
    const callStart = inverse.indexOf('      NSDictionary *textDiagnostic = nil;\n');
    const callEnd = inverse.indexOf('      } @catch (__unused NSException *exception) {}', callStart) + '      } @catch (__unused NSException *exception) {}'.length;
    const oldCall = driverBefore.split('\n').find(line => line.includes('"strings": HelpTagStrings(node, &truncated)'));
    inverse = inverse.slice(0, callStart) + oldCall + inverse.slice(callEnd);
    assert(inverse === driverBefore, 'native inverse or unrelated native change');
  });
  check('empty, missing, null and malformed strings stay distinguishable', () => {
    for (const [value, type, total, match] of [[[], 'array', 0, false], [undefined, 'missing', null, null], [null, 'null', null, null], ['SECRET', 'other', null, null], [[4], 'array', 1, null]]) {
      const record = fixture(); record.lastObservation.helpTags[0].strings = value;
      const tag = first(summarize(record));
      assert(tag.stringCollection.type === type && tag.stringCollection.total === total && tag.textMatchesExpected === match, 'collection type collapsed');
      if (type === 'array' && total === 0) assert(tag.stringCollection.inspectedEmptyCount === 0 && tag.stringCollection.complete === true, 'empty observation became unknown');
    }
  });
  check('bounded typed string counts and exact literal semantics', () => {
    const record = fixture(); record.lastObservation.helpTags[0].strings = [expected, '', 'different', 5, null];
    const tag = first(summarize(record)), count = tag.stringCollection;
    assert(count.inspectedStringCount === 3 && count.inspectedNonStringCount === 2 && count.inspectedEmptyCount === 1 && count.inspectedNonemptyCount === 2 && count.inspectedExactExpectedCount === 1, 'typed counts');
    assert(tag.textMatchesExpected === null, 'malformed array accepted');
    record.lastObservation.helpTags[0].strings = [expected + ' ', 'Save this document’s local checkpoint', expected.toUpperCase()];
    assert(first(summarize(record)).textMatchesExpected === false, 'normalization broadened the exact match');
    record.lastObservation.helpTags[0].strings = Array(128).fill('different').concat(expected);
    const capped = first(summarize(record));
    assert(capped.textMatchesExpected === true && capped.stringCollection.complete === false && capped.stringCollection.inspected === 128 && capped.stringCollection.inspectedExactExpectedCount === 0, 'sample counts changed full original predicate');
  });
  check('current/legacy nil, unavailable and exceptions cannot become empty success', () => {
    const record = fixture(), diag = record.lastObservation.helpTags[0].textReadDiagnostic;
    diag.current.rows = ['nil', 'unavailable'].map(read => ({ ...detail(0, 'value'), read, normalized: false, length: 0, nonempty: false, exactExpected: false }));
    diag.legacy.rows = ['nil', 'unavailable', 'read-exception', 'selector-exception'].map(read => ({ ...detail(0), read, normalized: false, length: 0, nonempty: false, exactExpected: false }));
    const projected = first(summarize(record)).textReadDiagnostic;
    for (const rows of [projected.current.rows.records, projected.legacy.rows.records]) for (const row of rows) {
      assert(row.normalized === null && row.length === null && row.nonempty === null && row.exactExpected === null, 'unknown read became empty or false');
    }
    diag.current.rows = [{ ...detail(0, 'value'), metadataStatus: 'exception' }];
    assert(first(summarize(record)).textReadDiagnostic.current.rows.records[0].exactExpected === null, 'metadata exception became comparison');
  });
  check('known numeric zero survives while missing or malformed counts remain unknown', () => {
    const record = fixture(), diag = record.lastObservation.helpTags[0].textReadDiagnostic;
    diag.current.nil = 0; delete diag.current.captured; diag.current.calls = 'SECRET'; diag.current.empty = -1; diag.current.other = Number.MAX_SAFE_INTEGER + 1;
    const current = first(summarize(record)).textReadDiagnostic.current;
    assert(current.nil === 0 && current.captured === null && current.calls === null && current.empty === null && current.other === null, 'count coercion');
    delete diag.current; diag.legacy = 'SECRET';
    const absent = first(summarize(record)).textReadDiagnostic;
    for (const [section, fields] of [[absent.current, ['fieldSlots', 'calls', 'nil', 'captured', 'detailsOmitted']], [absent.legacy, ['nodesConsidered', 'supportedReadsAttempted', 'returned', 'thrown', 'nodesOmitted']]]) {
      assert(fields.every(field => Object.hasOwn(section, field) && section[field] === null), 'absent subobject lost explicit null aggregate fields');
      assert(section.rows.records === null && section.rows.total === null && section.rows.omitted === null, 'absent rows became empty observed rows');
    }
    delete record.lastObservation.helpTags[0].textReadDiagnostic;
    assert(first(summarize(record)).textReadDiagnostic === null, 'missing diagnostic became observed empty');
    record.lastObservation.helpTags[0].textReadDiagnostic = { schemaVersion: 2, status: 'observed' };
    assert(first(summarize(record)).textReadDiagnostic === null, 'unknown schema accepted');
  });
  check('shared row budgets hold across tags with explicit omissions', () => {
    const record = fixture(), original = record.lastObservation.helpTags[0];
    original.textReadDiagnostic.current.rows = Array.from({ length: 13 }, (_, i) => detail(i, 'value'));
    original.textReadDiagnostic.legacy.rows = Array.from({ length: 7 }, (_, i) => ({ ...detail(i), read: 'returned' }));
    record.lastObservation.helpTags = Array.from({ length: 9 }, () => clone(original));
    const tags = summarize(record).observation.helpTags;
    assert(tags.records.length === 8 && tags.recordsOmitted === 1, 'tag retained cap');
    assert(tags.records.reduce((n, tag) => n + tag.textReadDiagnostic.current.rows.records.length, 0) === 16, 'current cap per tag instead of global');
    assert(tags.records.reduce((n, tag) => n + tag.textReadDiagnostic.legacy.rows.records.length, 0) === 8, 'legacy cap per tag instead of global');
    assert(tags.records[1].textReadDiagnostic.current.rows.omitted === 10 && tags.records[1].textReadDiagnostic.legacy.rows.omitted === 6, 'row omission counts');
  });
  check('legacy-positive metadata never changes existing acceptance predicates', () => {
    for (const strings of [[], [expected], ['different'], [7]]) {
      const record = fixture(); record.lastObservation.helpTags[0].strings = strings;
      const current = first(summarize(record)), previous = first(originalSummary(record));
      assert(current.textMatchesExpected === previous.textMatchesExpected && current.matchesShownTagPredicate === previous.matchesShownTagPredicate, 'metadata changed tag predicate');
      assert(summarize(record).status === 'failed', 'diagnostic promoted status');
    }
    const record = fixture(); record.lastObservation.cursorInsideTrigger = 1; record.lastObservation.pointerRunning = null;
    assert(summarize(record).observation.cursorInsideTrigger === null && summarize(record).observation.pointerRunning === null, 'booleans coerced');
  });
  check('privacy allowlist rejects text, classes, paths, arbitrary fields and error strings', () => {
    const record = fixture(), tag = record.lastObservation.helpTags[0], diag = tag.textReadDiagnostic;
    record.error = record.boundary = '/SECRET/private'; tag.strings = ['SECRET credential'];
    diag.secret = 'SECRET'; diag.current.rows[0].field = 'SECRET'; diag.current.rows[0].kind = 'SECRET'; diag.current.rows[0].secret = 'SECRET';
    diag.legacy.rows[0].reason = 'SECRET'; record.lastObservation.windows = [{ number: 1, class: 'SECRET', roles: ['SECRET'] }];
    const { harness, report } = run(record);
    assert(report.status === 'summary' && !harness.logs[0].includes('SECRET') && !harness.logs[0].includes('/owned'), 'free content leaked');
  });
  check('full envelope binds exact closed original bytes without writes', () => {
    const record = fixture(), { harness, report, original } = run(record, { chunkSize: 97 });
    assert(report.status === 'summary' && report.sourceRevision === 'a'.repeat(40) && report.processId === 123, 'source identity');
    assert(report.original.sha256 === sha256Bytes(harness.Buffer.from(original)).sha256 && report.original.bytes === harness.bytes.length && report.original.completeRead === true, 'original byte hash');
    assert(harness.bytes.toString() === original && harness.handles.size === 0 && harness.touched.every(path => path === '/owned/tooltip-hover.json'), 'original changed or scope expanded');
    measured.normalEnvelopeBytes = harness.Buffer.byteLength(harness.logs[0] + '\n');
    assert(measured.normalEnvelopeBytes <= 16384 && !report.diagnosticRowsOmittedForByteLimit, 'ordinary observation does not fit');
  });
  check('eight-tag normal shape trims only details while preserving last observation', () => {
    const record = fixture(), tag = record.lastObservation.helpTags[0];
    tag.textReadDiagnostic.current.rows = Array.from({ length: 16 }, (_, i) => detail(i >> 2, ['value', 'label', 'title', 'text-field-value'][i % 4]));
    tag.textReadDiagnostic.legacy.rows = Array.from({ length: 8 }, (_, i) => ({ ...detail(i), read: 'returned' }));
    record.lastObservation.helpTags = Array.from({ length: 8 }, () => clone(tag));
    record.lastObservation.windows = Array.from({ length: 12 }, (_, i) => ({ number: 40 + i, visible: true, onscreen: true, frame: clone(frame), roles: Array(12).fill('AXStaticText') }));
    const { harness, report } = run(record);
    measured.trimmedEnvelopeBytes = harness.Buffer.byteLength(harness.logs[0] + '\n');
    assert(report.status === 'summary' && report.diagnosticRowsOmittedForByteLimit && report.summary.observation.cursorInsideTrigger === true && first(report.summary).textMatchesExpected === false, 'trimming erased latest predicates');
    const modern = first(report.summary).textReadDiagnostic.current;
    assert(modern.rows.records.length === 0 && modern.rows.omitted === modern.rows.total && modern.fieldSlots === 8, 'trimming hid omitted rows or aggregate counts');
    assert(measured.trimmedEnvelopeBytes <= 16384, 'trimmed envelope overflow');
  });
  check('oversized original geometry retains explicit generic fallback within limit', () => {
    const record = fixture(), tag = record.lastObservation.helpTags[0], huge = 1.2345678901234567e+200;
    tag.frame = tag.windowFrame = { x: huge, y: huge, width: huge, height: huge };
    tag.textReadDiagnostic.current.rows = Array(16).fill(detail(0, 'value'));
    tag.textReadDiagnostic.legacy.rows = Array(8).fill({ ...detail(0), read: 'returned' });
    for (const section of [tag.textReadDiagnostic.current, tag.textReadDiagnostic.legacy]) for (const key of Object.keys(section)) if (typeof section[key] === 'number') section[key] = Number.MAX_SAFE_INTEGER;
    record.lastObservation.helpTags = Array.from({ length: 8 }, () => clone(tag));
    record.lastObservation.windows = Array.from({ length: 12 }, () => ({ number: Number.MAX_SAFE_INTEGER, visible: true, onscreen: true, frame: clone(tag.frame), roles: Array(12).fill('AXRadioButton') }));
    const { harness, report } = run(record);
    assert(report.status === 'omitted-over-log-limit' && report.outputSummaryOmitted && report.summary === undefined, 'generic fallback changed or partial JSON emitted');
    assert(harness.Buffer.byteLength(harness.logs[0] + '\n') <= 16384, 'fallback exceeded budget');
  });
  check('bounded exact-limit and over-limit original reads preserve complete hash boundary', () => {
    const limit = 1024 * 1024, minimum = JSON.stringify({ schemaVersion: 1 });
    const exact = minimum + ' '.repeat(limit - minimum.length), over = exact + 'X';
    const a = run(exact), b = run(over);
    assert(a.report.original.completeRead === true && a.report.original.bytes === limit && a.report.original.sha256, 'exact read limit rejected');
    assert(b.report.status === 'original-over-read-limit' && b.report.original.completeRead === false && b.report.original.sha256 === null && b.report.original.bytesRead === limit + 1, 'partial hash accepted');
    assert(b.harness.reads.reduce((n, x) => n + x.bytes, 0) === limit + 1, 'read cap exceeded');
  });
  check('missing, nonregular, malformed, schema and IO failures remain secondary', () => {
    for (const [value, options] of [[null, {}], ['{}', { regular: false }], ['{', {}], ['{"schemaVersion":2}', {}],
      [fixture(), { failStage: 'stat' }], [fixture(), { failStage: 'open' }], [fixture(), { failStage: 'read' }], [fixture(), { failStage: 'close' }]]) {
      const { report, harness } = run(value, options);
      assert(report.status === 'readback-unavailable' && !harness.logs[0].includes('SECRET'), 'secondary error escaped or leaked');
    }
    const primary = Error('original strict tooltip failure'), harness = createTooltipHarness(block, JSON.stringify(fixture()), { consoleFailure: true }, sha256Bytes);
    let caught;
    try { try { throw primary; } catch (error) { harness.api.reportTooltipFailure(); throw error; } } catch (error) { caught = error; }
    assert(caught === primary && harness.logs.length === 0, 'console failure replaced primary error');
  });
  return { scope: 'V8 selectors, mocked synchronous IO, and static native-source invariants only', nativeExecution: false, nodeFilesystemExecution: false, groups, measured };
}
