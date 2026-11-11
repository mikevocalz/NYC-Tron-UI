// Reproducible V8-only source/mock review of the post-settlement symbol diagnostic.
// Evaluate this file, then await reviewStartupSymbolication({source, preimage,
// historicalSample}) with these exact UTF-8 blob contents:
// source: a82e2fc7df3bde243eb6d053a97e310c39b1293c
// preimage: 4507f860155746bb6f1a3a9528dd0e74de5d6492
// historicalSample: 394dd1966d30d917c471a6d9eec323c654fee15e
// The historical sample is only a FORMAT fixture, never current-run stack evidence.
// Filesystem, tools, child processes, timers and console are deterministic mocks.
// No Node OS IO, dwarfdump, atos, macOS compilation or native execution occurs.
// Reproducing these ten groups repeats the same designs; do not add test counts.
// Atos signatures not explicitly recognized stay unknown; source-file observation
// is separate from exact/unique caller attribution. No current cause is inferred.

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
const utf8=s=>{const out=[];for(const c of s){const n=c.codePointAt(0);if(n<128)out.push(n);else if(n<2048)out.push(192|(n>>6),128|(n&63));else if(n<65536)out.push(224|(n>>12),128|((n>>6)&63),128|(n&63));else out.push(240|(n>>18),128|((n>>12)&63),128|((n>>6)&63),128|(n&63));}return out;};
const symbolSourceEdits=[{"label":"fixed platform image labels","old":"'libsystem_trace.dylib', 'libsystem_platform.dylib', 'libsystem_malloc.dylib', 'libxpc.dylib'];","replacement":"'libsystem_trace.dylib', 'libsystem_platform.dylib', 'libsystem_malloc.dylib', 'libxpc.dylib', 'libsystem_blocks.dylib', 'libobjc.A.dylib'];"},{"label":"fixed cleanup and wait function labels","old":"'__ulock_wait', '__ulock_wait2', '__psynch_mutexwait', '__psynch_cvwait', 'semaphore_wait_trap', 'semaphore_timedwait_trap'];","replacement":"'__ulock_wait', '__ulock_wait2', '__psynch_mutexwait', '__psynch_cvwait', 'semaphore_wait_trap', 'semaphore_timedwait_trap',\n    '_Block_copy', '_Block_release', '_Block_object_dispose', 'objc_release', 'objc_storeStrong',\n    '_dispatch_block_async_invoke', '_dispatch_block_async_invoke2', '_dispatch_block_async_invoke_and_release',\n    'dispatch_block_wait', 'dispatch_semaphore_wait', '_dispatch_semaphore_wait_slow', '_dispatch_sema4_wait'];"},{"label":"closed selector classifications","old":"    result.frames.push({ count, depthColumns: match[1].length, image: images.includes(match[4]) ? match[4] : match[4] === applicationName ? 'owned-application' : 'unknown',\n      symbol: symbols.includes(match[3]) ? match[3] : 'unknown', offset, offsetKind: match[5] === undefined ? 'image-relative' : 'symbol-relative' });","replacement":"    let symbol = symbols.includes(match[3]) ? match[3] : 'unknown';\n    if (symbol === 'unknown' && ['Foundation', 'AppKit', 'libobjc.A.dylib'].includes(match[4])) {\n      const selector = match[3].match(/^-\\[[A-Za-z_$][A-Za-z0-9_$]{0,100}(?:\\([A-Za-z0-9_$]{1,100}\\))? (dealloc|waitUntilFinished|waitUntilAllOperationsAreFinished)\\]$/);\n      if (selector) symbol = ({ dealloc: 'objc-dealloc-selector', waitUntilFinished: 'objc-wait-until-finished-selector', waitUntilAllOperationsAreFinished: 'objc-wait-all-operations-selector' })[selector[1]];\n    }\n    result.frames.push({ count, depthColumns: match[1].length, image: images.includes(match[4]) ? match[4] : match[4] === applicationName ? 'owned-application' : 'unknown',\n      symbol, offset, offsetKind: match[5] === undefined ? 'image-relative' : 'symbol-relative' });"},{"label":"private stable sample callback","old":"function readStartupObservationSample(observation) {","replacement":"function readStartupObservationSample(observation, onComplete) {"},{"label":"reuse same stable sample text","old":"    result.parsed = startupObservationSample(bytes.toString('utf8'), observation.processId, executable.split('/').at(-1));","replacement":"    const text = bytes.toString('utf8');\n    result.parsed = startupObservationSample(text, observation.processId, executable.split('/').at(-1));\n    if (onComplete) onComplete(text);"},{"label":"offline symbol helpers and post-settlement report","old":"function reportStartupObservation(observation) {\n  try {\n","replacement":"function startupSymbolUUID(text) {\n  const lines = text.split(/\\r?\\n/).filter(line => line.trim());\n  const match = lines.length === 1 ? lines[0].match(/^UUID: ([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}) \\(arm64\\) .+$/) : null;\n  return match ? match[1].toUpperCase() : null;\n}\nfunction startupSymbolInput(text, observation, original) {\n  const result = { status: 'sample-input-unavailable', architecture: null, imageUUIDUnique: null, imageRangeBytes: null,\n    ownedFrames: 0, selectedFrames: 0, omittedOwnedFrames: 0, frame: null };\n  if (!original.completeStableRead || original.parsed?.status !== 'projected-main-thread' || typeof text !== 'string' ||\n      original.parsed.headerCount !== 1 || original.parsed.headerProcessId !== observation.processId ||\n      !Number.isSafeInteger(observation.processId) || observation.processId <= 0 ||\n      Buffer.byteLength(text, 'utf8') > 1048576 || hash(Buffer.from(text, 'utf8')) !== original.originalSha256) return { result };\n  const name = executable.split('/').at(-1), bundle = app.split('/').at(-1), identifier = config.macos?.bundleIdentifier;\n  if (!/^[A-Za-z0-9._-]{1,100}$/.test(name) || config.name !== name || bundle !== name + '.app' ||\n      app !== join(root, '.spark', 'products', 'macos-arm64', 'release', bundle) ||\n      executable !== join(app, 'Contents', 'MacOS', name) || typeof identifier !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9.-]{0,200}$/.test(identifier)) {\n    result.status = 'owned-product-layout-unverified'; return { result };\n  }\n  const lines = text.split(/\\r?\\n/), graph = lines.indexOf('Call graph:'), images = lines.indexOf('Binary Images:');\n  if (graph < 0 || images <= graph || lines.filter(line => line === 'Call graph:').length !== 1 || lines.filter(line => line === 'Binary Images:').length !== 1) { result.status = 'sample-sections-unavailable'; return { result }; }\n  const header = lines.slice(0, graph);\n  const one = key => { const values = header.filter(line => line.startsWith(key)); return values.length === 1 ? values[0].slice(key.length).trim() : null; };\n  const suffix = '/' + bundle + '/Contents/MacOS/' + name;\n  const path = one('Path:'), architecture = one('Code Type:'), loadText = one('Load Address:');\n  if (architecture !== 'ARM64' || one('Identifier:') !== identifier || typeof path !== 'string' || !path.endsWith(suffix) ||\n      typeof loadText !== 'string' || !/^0x[0-9a-fA-F]+$/.test(loadText)) {\n    result.status = 'sample-owner-header-unverified'; return { result };\n  }\n  result.architecture = 'arm64';\n  // Count candidate owner rows before parsing; malformed or oversized rows\n  // cannot disappear and create a false uniqueness result.\n  const token = new RegExp('(?:^|\\\\s)\\\\+?' + identifier.replace(/\\./g, '\\\\.') + '(?:\\\\s|$)');\n  const ownerRows = lines.slice(images + 1).filter(line => token.test(line) || line.trimEnd().endsWith(suffix));\n  const row = ownerRows.length === 1 && Buffer.byteLength(ownerRows[0], 'utf8') <= 8192 ? ownerRows[0].match(/^\\s*(0x[0-9a-fA-F]+)\\s*-\\s*(0x[0-9a-fA-F]+)\\s+\\+?(\\S+)\\s+\\([^)]*\\)\\s+<([0-9A-Fa-f-]{36})>\\s+(.+)$/) : null;\n  if (!row || row[3] !== identifier || !row[5].endsWith(suffix)) {\n    result.status = 'sample-owned-image-ambiguous'; return { result };\n  }\n  const load = Number(row[1]), end = Number(row[2]), headerLoad = Number(loadText);\n  const uuid = row[4].toUpperCase();\n  if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/.test(uuid) ||\n      lines.slice(images + 1).filter(line => line.toUpperCase().includes('<' + uuid + '>')).length !== 1 ||\n      ![load, end, headerLoad].every(Number.isSafeInteger) || load !== headerLoad || end < load || end - load > 0xffffffff) {\n    result.status = 'sample-image-range-or-uuid-unverified'; return { result };\n  }\n  result.imageUUIDUnique = true; result.imageRangeBytes = end - load + 1;\n  const main = /^\\s+\\d+\\s+Thread_\\d+\\s+DispatchQueue_\\d+:\\s+com\\.apple\\.main-thread\\s+\\(serial\\)\\s*$/;\n  const starts = lines.slice(graph + 1, images).map((line, i) => main.test(line) ? graph + 1 + i : -1).filter(i => i >= 0);\n  if (starts.length !== 1) { result.status = 'sample-main-group-unverified'; return { result }; }\n  const frames = [];\n  for (const line of lines.slice(starts[0] + 1, Math.min(images, starts[0] + 4097))) {\n    if (/^\\s+\\d+\\s+Thread_/.test(line) || line.startsWith('Total number in stack')) break;\n    if (Buffer.byteLength(line, 'utf8') > 8192) continue;\n    const frame = line.match(/^([ +!|:.\\t-]*)(\\d+)\\s+(.+?)\\s{2,}\\(in ([^)\\r\\n]+)\\)\\s+(?:\\+\\s+(\\d+)|load address (0x[a-fA-F0-9]+)\\s+\\+\\s+(0x[a-fA-F0-9]+))\\s+\\[(0x[a-fA-F0-9]+)\\]\\s*$/);\n    if (!frame || frame[4] !== name) continue;\n    const count = Number(frame[2]), pc = Number(frame[8]), offset = Number(frame[5] ?? frame[7]);\n    if (![count, pc, offset].every(Number.isSafeInteger) || count < 0 || offset < 0 || pc < load || pc > end ||\n        (frame[6] !== undefined && (Number(frame[6]) !== load || load + offset !== pc)) ||\n        (frame[5] !== undefined && pc - offset < load)) {\n      result.status = 'sample-owned-frame-outside-image'; return { result };\n    }\n    frames.push({ count, depthColumns: frame[1].length, offset, offsetKind: frame[5] === undefined ? 'image-relative' : 'symbol-relative',\n      imageRelativeOffset: pc - load, address: frame[8] });\n  }\n  result.ownedFrames = frames.length; result.selectedFrames = Math.min(1, frames.length); result.omittedOwnedFrames = Math.max(0, frames.length - 1);\n  if (!frames.length) { result.status = 'no-owned-main-frame'; return { result }; }\n  const retained = original.parsed.frames.filter(frame => frame.image === 'owned-application' &&\n    frame.count === frames[0].count && frame.depthColumns === frames[0].depthColumns &&\n    frame.offset === frames[0].offset && frame.offsetKind === frames[0].offsetKind);\n  if (retained.length !== 1) { result.status = 'owned-frame-not-uniquely-retained'; return { result }; }\n  const { address, ...frame } = frames[0];\n  result.frame = frame; result.status = 'sample-image-bound';\n  // Addresses and source paths are private inputs only, never projected.\n  return { result, uuid, address, loadAddress: row[1], name, bundle };\n}\nfunction startupSymbolFile(file, maximumBytes) {\n  const result = { status: 'unavailable', bytes: null, sha256: null };\n  let fd, failed = false, count = 0, before, after, current;\n  try {\n    if (!file.startsWith(root + '/')) return { ...result, status: 'outside-owned-product-root' };\n    for (let at = file; at !== root; at = dirname(at)) {\n      const value = lstatSync(at);\n      if (value.isSymbolicLink()) return { ...result, status: 'symlink-refused' };\n    }\n    if (!lstatSync(file).isFile()) return { ...result, status: 'not-regular-file' };\n    fd = openSync(file, 'r'); before = fstatSync(fd);\n    if (!before.isFile() || !Number.isSafeInteger(before.size) || before.size <= 0 || before.size > maximumBytes) return { ...result, status: 'size-outside-bound' };\n    const digest = createHash('sha256'), buffer = Buffer.alloc(65536);\n    while (count <= maximumBytes) {\n      const read = readSync(fd, buffer, 0, Math.min(buffer.length, maximumBytes + 1 - count), count);\n      if (!read) break; digest.update(buffer.subarray(0, read)); count += read;\n    }\n    after = fstatSync(fd); current = lstatSync(file);\n    if (count > maximumBytes || count !== before.size || !current.isFile() ||\n        ![after, current].every(value => value.dev === before.dev && value.ino === before.ino && value.size === before.size && value.mtimeMs === before.mtimeMs && value.ctimeMs === before.ctimeMs)) {\n      result.status = 'changed-or-incomplete-file'; return result;\n    }\n    result.bytes = count; result.sha256 = digest.digest('hex'); result.status = 'complete-stable-file';\n  } catch (error) { failed = true; result.status = error?.code === 'ENOENT' ? 'file-absent' : 'file-unavailable'; }\n  finally { if (fd !== undefined) { try { closeSync(fd); } catch { failed = true; result.status = 'close-unavailable'; } } }\n  if (failed) { result.bytes = null; result.sha256 = null; }\n  return result;\n}\nfunction startupSymbolClassification(text, expectedImage) {\n  const result = { status: 'unresolved', sourceFile: 'unknown', functionFamily: 'unknown',\n    uniqueSourceCallerEstablished: false, sourceLineValuesPrivate: true, inliningAndDeduplicationLimited: true };\n  const lines = text.split(/\\r?\\n/).filter(line => line.trim());\n  if (lines.length !== 1 || Buffer.byteLength(lines[0] ?? '', 'utf8') > 8192) { result.status = 'multiple-or-invalid-symbol-results'; return result; }\n  const line = lines[0];\n  if (/<deduplicated_symbol>|inlined|inline frame/i.test(line)) { result.status = 'ambiguous-inline-or-deduplicated'; return result; }\n  const match = line.match(/^(.+?) \\(in ([^)\\r\\n]+)\\)(?: \\(([^()\\r\\n]+):(\\d+)\\))?$/);\n  if (!match || /^0x[0-9a-f]+$/i.test(match[1]) || / \\+ \\d+$/.test(match[1])) return result;\n  if (typeof expectedImage !== 'string' || match[2] !== expectedImage) { result.status = 'symbol-image-mismatch'; return result; }\n  // A predecessor/symbol-table name without an actual source annotation is\n  // insufficient for attribution. Keep the raw tool text in private evidence.\n  if (!match[3] || !Number.isSafeInteger(Number(match[4]))) { result.status = 'symbol-name-without-source'; return result; }\n  const file = match[3].split('/').at(-1);\n  const sources = { 'NYCTronAcceptanceDriver.mm': 'private-acceptance-driver', 'SparkTestDriver.mm': 'pinned-spark-driver',\n    'ConstantsProvider.swift': 'expo-constants-provider',\n    'AppDelegate.mm': 'app-delegate', 'AppDelegate.m': 'app-delegate', 'main.m': 'app-entry', '<compiler-generated>': 'compiler-generated' };\n  result.sourceFile = Object.hasOwn(sources, file) ? sources[file] : 'unknown';\n  const name = match[1];\n  const exact = { TraceActivation: 'activation-trace', ActivationWindowState: 'activation-state-read',\n    SparkExecute: 'spark-command-dispatch', SparkSession: 'spark-server-session', SparkServe: 'spark-server-loop',\n    '+[NYCTronAcceptanceDriver load]': 'acceptance-driver-registration' };\n  // Unrecognized demangled parameter signatures stay unknown. Never strip\n  // arguments to manufacture an exact function or unique caller attribution.\n  const simple = name.startsWith('_') && !name.startsWith('__') ? name.slice(1) : name;\n  if (Object.hasOwn(exact, simple)) result.functionFamily = exact[simple];\n  else if (/^__destroy_helper_block_[A-Za-z0-9_]{1,160}$/.test(name)) result.functionFamily = 'compiler-block-destruction';\n  else if (/^__copy_helper_block_[A-Za-z0-9_]{1,160}$/.test(name)) result.functionFamily = 'compiler-block-copy';\n  else if (/^__\\d+\\+\\[NYCTronAcceptanceDriver load\\]_block_invoke(?:_\\d+)?$/.test(name)) result.functionFamily = 'acceptance-driver-registration-block';\n  result.status = result.sourceFile !== 'unknown' || result.functionFamily !== 'unknown' ? 'closed-source-or-family-observation' : 'unrecognized-source-and-function';\n  return result;\n}\nasync function startupSymbolication(observation, original, text) {\n  const result = { status: 'unavailable', diagnosticOnly: true, offlineOnly: true, liveProcessAttachment: false,\n    uniqueSourceCallerEstablished: false, originalSampleSha256: original.originalSha256, binding: null,\n    executable: null, optionalDsym: { candidate: 'pinned-deriveddata-release-product', presenceEstablished: false, status: 'not-probed' },\n    symbolProvider: null, tools: [], classification: null, toolLimit: 3, toolTimeoutMs: 3000, toolCleanupGraceMs: 1000,\n    executableByteLimit: 67108864, symbolByteLimit: 134217728, selectedFrameLimit: 1 };\n  try {\n    const input = startupSymbolInput(text, observation, original); result.binding = input.result;\n    if (input.result.status !== 'sample-image-bound') { result.status = input.result.status; return result; }\n    const binary = startupSymbolFile(executable, result.executableByteLimit);\n    result.executable = { status: binary.status, bytes: binary.bytes, sha256: binary.sha256, matchesLaunchHash: binary.sha256 === null ? null : binary.sha256 === nativeArtifact.executableSha256, uuidMatches: null, matchesBeforeToolsHashAndBytes: null };\n    if (binary.status !== 'complete-stable-file' || !result.executable.matchesLaunchHash) { result.status = 'executable-launch-hash-unverified'; return result; }\n    const run = async (label, args) => {\n      const task = startupObservationProcess('/usr/bin/xcrun', args, result.toolTimeoutMs, () => false);\n      const completed = await task.promise, state = completed.record;\n      const record = { tool: label, status: 'unavailable', closeObserved: state.closeObserved, exitCode: state.exitCode,\n        timedOut: state.timedOut, cleanupLimitReached: state.cleanupLimitReached, outputLimit: state.outputLimit,\n        errorCode: state.errorCode, stdoutBytes: state.stdoutBytes, stderrBytes: state.stderrBytes,\n        file: 'startup-symbol-' + label + '.txt', retained: false, retainedSha256: null, retainedEncoding: 'decoded-stdout-as-utf8' };\n      result.tools.push(record);\n      const usable = state.spawnObserved && state.closeObserved && state.exitCode === 0 && !state.timedOut && !state.outputLimit && !state.captureFailed && state.errorCode === null;\n      record.status = usable ? 'completed' : state.closeObserved ? 'tool-failed' : 'tool-close-unconfirmed';\n      try {\n        writeFileSync(join(output, record.file), completed.stdout, { flag: 'wx' });\n        record.retained = true; record.retainedSha256 = hash(Buffer.from(completed.stdout, 'utf8'));\n      } catch { record.status = 'private-output-retention-failed'; }\n      return usable && record.retained ? completed.stdout : null;\n    };\n    const executableUUID = startupSymbolUUID((await run('executable-uuid', ['dwarfdump', '--uuid', executable])) ?? '');\n    result.executable.uuidMatches = executableUUID === null ? null : executableUUID === input.uuid;\n    if (!result.executable.uuidMatches) { result.status = 'executable-uuid-or-architecture-unverified'; return result; }\n    // Pinned Spark build.ts derives this product directory, but the existence\n    // and contents of this optional dSYM have not been assumed or generated.\n    const dsym = join(root, '.spark', 'DerivedData', 'macos-arm64', 'Build', 'Products', 'Release',\n      input.bundle + '.dSYM', 'Contents', 'Resources', 'DWARF', input.name);\n    const symbols = startupSymbolFile(dsym, result.symbolByteLimit);\n    result.optionalDsym.status = symbols.status;\n    let symbolFile = executable, selectedSymbols = binary;\n    if (symbols.status === 'complete-stable-file') {\n      result.optionalDsym.presenceEstablished = true; result.optionalDsym.bytes = symbols.bytes; result.optionalDsym.sha256 = symbols.sha256;\n      const uuid = startupSymbolUUID((await run('dsym-uuid', ['dwarfdump', '--uuid', dsym])) ?? '');\n      result.optionalDsym.uuidMatches = uuid === null ? null : uuid === executableUUID;\n      if (!result.optionalDsym.uuidMatches) { result.status = 'optional-dsym-uuid-or-architecture-unverified'; return result; }\n      symbolFile = dsym; selectedSymbols = symbols; result.symbolProvider = 'uuid-matched-existing-dsym';\n    } else if (symbols.status === 'file-absent') result.symbolProvider = 'exact-launch-executable';\n    else { result.status = 'optional-symbol-file-unverified'; return result; }\n    const resolved = await run('atos', ['atos', '-arch', 'arm64', '-o', symbolFile, '-l', input.loadAddress, '-i', '-dedup', input.address]);\n    // Unsupported flags fail closed; never retry with ambiguity flags removed.\n    if (resolved === null) { result.status = 'atos-unavailable'; return result; }\n    const binaryAfter = startupSymbolFile(executable, result.executableByteLimit);\n    result.executable.matchesBeforeToolsHashAndBytes = binaryAfter.status === 'complete-stable-file' && binaryAfter.sha256 === binary.sha256 && binaryAfter.bytes === binary.bytes;\n    let symbolsStable = true;\n    if (symbolFile !== executable) {\n      const after = startupSymbolFile(dsym, result.symbolByteLimit);\n      symbolsStable = after.status === 'complete-stable-file' && after.sha256 === selectedSymbols.sha256 && after.bytes === selectedSymbols.bytes;\n      result.optionalDsym.matchesBeforeToolsHashAndBytes = symbolsStable;\n    }\n    if (!result.executable.matchesBeforeToolsHashAndBytes || !symbolsStable) { result.status = 'symbol-input-changed'; return result; }\n    result.classification = startupSymbolClassification(resolved, input.name);\n    result.status = 'offline-symbol-observation-completed';\n  } catch { result.status = 'symbol-observation-unavailable'; }\n  return result;\n}\n\nasync function reportStartupObservation(observation) {\n  try {\n    let sampleText;\n    const original = readStartupObservationSample(observation, text => { sampleText = text; });\n    const symbolication = await startupSymbolication(observation, original, sampleText);\n"},{"label":"bounded symbol report fields","old":"      skipPostFailureSample: observation.skipPostFailureSample, original: readStartupObservationSample(observation) };","replacement":"      skipPostFailureSample: observation.skipPostFailureSample, original, symbolication };"},{"label":"await only after original request settlement","old":"      if (observation.fired) reportStartupObservation(observation);","replacement":"      if (observation.fired) await reportStartupObservation(observation);"}];
function createSymbolHarness(source, options={}) {
  class MockBuffer extends Uint8Array {
    static alloc(size){return new MockBuffer(size);}
    static from(value){return new MockBuffer(typeof value==='string'?utf8(value):value);}
    static byteLength(value){return utf8(String(value)).length;}
    toString(){return decodeURIComponent(Array.from(this,x=>'%'+x.toString(16).padStart(2,'0')).join(''));}
  }
  const root='/owned',name='NYCTronAppKitReference',bundle=name+'.app';
  const app=root+'/.spark/products/macos-arm64/release/'+bundle;
  const executable=app+'/Contents/MacOS/'+name;
  const dsym=root+'/.spark/DerivedData/macos-arm64/Build/Products/Release/'+bundle+'.dSYM/Contents/Resources/DWARF/'+name;
  const output='/owned/evidence',sampleFile=output+'/startup-predeadline/sample.txt';
  const uuid='11111111-2222-3333-4444-555555555555',otherUUID='AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE';
  const fixture='Analysis of sampling '+name+' (pid 77) every 10 milliseconds\nProcess: '+name+' [77]\nPath: /Users/USER/*/'+bundle+'/Contents/MacOS/'+name+'\nLoad Address: 0x100000000\nIdentifier: org.nyctron.appkit.reference\nCode Type: ARM64\n\nCall graph:\n    164 Thread_1   DispatchQueue_1: com.apple.main-thread  (serial)\n    + 164 _Block_release  (in libsystem_blocks.dylib) + 28  [0x20000001c]\n    +   164 ???  (in '+name+') load address 0x100000000 + 0x100  [0x100000100]\n    +     164 -[PrivateSecretClass dealloc]  (in Foundation) + 52  [0x200000034]\nTotal number in stack\nBinary Images:\n  0x100000000 - 0x100001fff +org.nyctron.appkit.reference (1.0.0 - 1) <'+uuid+'> /Users/*/'+bundle+'/Contents/MacOS/'+name+'\n';
  const files=new Map(),dirs=new Set([root]),handles=new Map(),calls=[],reads=[],writes=[],logs=[];let nextHandle=1,api;
  const dirname=path=>path.slice(0,path.lastIndexOf('/'))||'/';
  const put=(path,value,extra={})=>{files.set(path,{bytes:MockBuffer.from(value),regular:true,symlink:false,ino:files.size+1,mtimeMs:1,ctimeMs:1,...extra});for(let p=dirname(path);p!==root&&p!=='/';p=dirname(p))dirs.add(p);};
  const binary='EXACT EXECUTABLE FIXTURE',dwarf='EXACT MATCHING SYMBOL FIXTURE';
  put(executable,binary);if(options.dsym!==false)put(dsym,dwarf);
  const sampleText=options.sampleText??fixture;put(sampleFile,sampleText);
  for(const[path,value]of Object.entries(options.files||{}))put(path,value);
  const byteHash=value=>sha256Bytes(value).sha256;
  const nativeArtifact={executableSha256:options.launchHash??byteHash(MockBuffer.from(binary))};
  const stat=(file,fdCheck=false)=>({isFile:()=>file.regular,isSymbolicLink:()=>file.symlink,size:file.reportedSize??file.bytes.length,dev:1,ino:file.ino,mtimeMs:file.mtimeMs+(fdCheck&&options.changeDuringRead?1:0),ctimeMs:file.ctimeMs});
  const ioError=code=>Object.assign(Error('PRIVATE ERROR PATH/SECRET'),{code});
  const context={
    Buffer:MockBuffer,root,app:options.app??app,executable,output,revision:'a'.repeat(40),config:{name:options.name??name,macos:{bundleIdentifier:'org.nyctron.appkit.reference'}},nativeArtifact,dirname,join:(...p)=>p.join('/'),hash:byteHash,
    createHash(){const chunks=[];return{update(value){chunks.push(Array.from(value));return this;},digest(){return byteHash(chunks.flat());}};},
    lstatSync(path){reads.push({kind:'stat',path});if(options.symlink===path)return{isFile:()=>false,isSymbolicLink:()=>true};if(files.has(path))return stat(files.get(path));if(dirs.has(path)||path===output)return{isFile:()=>false,isSymbolicLink:()=>false};throw ioError('ENOENT');},
    openSync(path,mode){if(options.fileFailure==='open')throw ioError('EACCES');if(mode!=='r'||!files.has(path))throw ioError('ENOENT');const fd=nextHandle++;handles.set(fd,{path,checks:0});return fd;},
    fstatSync(fd){const handle=handles.get(fd);if(!handle)throw ioError('EINVAL');handle.checks++;return stat(files.get(handle.path),handle.checks>1);},
    readSync(fd,buffer,offset,count,position){if(options.fileFailure==='read')throw ioError('EIO');const handle=handles.get(fd),file=files.get(handle.path),size=Math.max(0,Math.min(count,file.bytes.length-position));buffer.set(file.bytes.subarray(position,position+size),offset);reads.push({kind:'read',path:handle.path,bytes:size});return size;},
    closeSync(fd){handles.delete(fd);if(options.fileFailure==='close')throw ioError('EIO');},
    writeFileSync(path,text,config){writes.push({path,flag:config?.flag});if(options.writeFailure||config?.flag==='wx'&&files.has(path))throw ioError('EEXIST');put(path,typeof text==='string'?text:text.toString());},
    console:{info(value){if(options.consoleFailure)throw ioError('EIO');logs.push(value);}},
    startupObservationProcess(command,args,timeout,pending){
      const label=args[0]==='atos'?'atos':args[2]===executable?'executable-uuid':'dsym-uuid';
      const call={command,args:[...args],timeout,pending:pending(),label};calls.push(call);
      if(options.throwTool===label)throw ioError('EPERM');
      const override=options.tools?.[label]??{};
      const record={spawnObserved:true,closeObserved:true,exitCode:0,timedOut:false,cleanupLimitReached:false,outputLimit:false,captureFailed:false,errorCode:null,stdoutBytes:0,stderrBytes:0,...override};
      const stdout=override.stdout??(label==='atos'?'TraceActivation (in '+name+') (NYCTronAcceptanceDriver.mm:77)\n':'UUID: '+uuid+' (arm64) '+(label==='executable-uuid'?executable:dsym)+'\n');
      record.stdoutBytes=MockBuffer.byteLength(stdout);
      if(label==='atos'&&options.changeAfterAtos)put(options.changeAfterAtos==='dsym'?dsym:executable,'CHANGED FILE');
      return{record,promise:Promise.resolve({record,stdout})};
    }
  };
  const start=source.indexOf('function startupObservationSample('),end=source.indexOf('async function observeInitialWindowRequest(');
  const block=source.slice(start,end);
  api=new Function('c','const {Buffer,root,app,executable,output,revision,config,nativeArtifact,dirname,join,hash,createHash,lstatSync,openSync,fstatSync,readSync,closeSync,writeFileSync,console,startupObservationProcess}=c;\n'+block+'\nreturn { startupObservationSample,readStartupObservationSample,startupSymbolInput,startupSymbolUUID,startupSymbolFile,startupSymbolClassification,startupSymbolication,reportStartupObservation };')(context);
  const observation={processId:77,fired:true,diagnosticOnly:true,requestOutcome:'rejected',status:'sampler-closed',sample:{spawnObserved:true,closeObserved:true},skipPostFailureSample:false};
  const original=()=>({completeStableRead:true,originalSha256:byteHash(MockBuffer.from(sampleText)),parsed:api.startupObservationSample(sampleText,77,name)});
  return{api,observation,original,fixture,sampleText,uuid,otherUUID,root,name,bundle,app,executable,dsym,output,files,handles,put,calls,reads,writes,logs,Buffer:MockBuffer,context,
    run:()=>api.startupSymbolication(observation,original(),sampleText),report:()=>api.reportStartupObservation(observation)};
}
function createWatchdogHarness(block, options = {}) {
  const encode = utf8;
  class MockBuffer extends Uint8Array {
    static alloc(size) { return new MockBuffer(size); }
    static from(value) { return new MockBuffer(typeof value === 'string' ? encode(value) : value); }
    static concat(values) { const result = new MockBuffer(values.reduce((n,x)=>n+x.length,0));let offset=0;for(const value of values){result.set(value,offset);offset+=value.length;}return result; }
    static byteLength(value) { return encode(String(value)).length; }
    toString() { return decodeURIComponent(Array.from(this, x => '%' + x.toString(16).padStart(2,'0')).join('')); }
  }
  const timers=new Map(), errors=[], events=[], logs=[], reads=[], writes=[], hashes=[], signals=[], subprocesses=[], files=new Map(), directories=new Set();
  let now=0,nextTimer=1,nextHandle=1,settledAt=null;
  const flush=async()=>{for(let i=0;i<24;i++)await Promise.resolve();};
  const setTimer=(fn,delay=0)=>{const id=nextTimer++;timers.set(id,{at:now+delay,fn});return id;};
  const clearTimer=id=>timers.delete(id);
  const advance=async milliseconds=>{
    const end=now+milliseconds;await flush();
    for(;;){
      const due=[...timers].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at||a[0]-b[0])[0];
      if(!due)break;now=due[1].at;timers.delete(due[0]);
      try{due[1].fn();}catch(error){errors.push(error);}
      await flush();
    }
    now=end;await flush();
  };
  const epoch=1794372134270;
  class ClockDate extends Date { constructor(...args){super(...(args.length?args:[epoch+now]));}static now(){return epoch+now;} }
  class Emitter {
    constructor(){this.listeners=new Map();this.destroyed=false;}
    on(name,fn){if(!this.listeners.has(name))this.listeners.set(name,[]);this.listeners.get(name).push(fn);return this;}
    emit(name,...args){for(const fn of this.listeners.get(name)||[]){try{fn(...args);}catch(error){errors.push(error);}}}
    destroy(){this.destroyed=true;}
  }
  const child={pid:77,exitCode:null,signalCode:null,kill(signal){signals.push({kind:'application',signal,at:now});}};
  const executable='/owned/App', sampleFile='/owned/startup-predeadline/sample.txt';
  const defaultSample='Analysis of sampling App (pid 77) every 10 milliseconds\nProcess: App [77]\nCall graph:\n    200 Thread_1   DispatchQueue_1: com.apple.main-thread  (serial)\n    + 200 NSApplicationMain  (in AppKit) + 880  [0x12345678]\n    +   200 SECRET_PRIVATE_SYMBOL  (in SECRET_PRIVATE_IMAGE) + 44  [0xabcdef]\nTotal number in stack\n';
  const putFile=(path,text,extra={})=>{files.set(path,{bytes:MockBuffer.from(text),ino:files.size+1,mtimeMs:1,ctimeMs:1,regular:true,...extra});};
  for(const[path,value]of Object.entries(options.files||{}))putFile(path,value);
  let api;
  const spawn=(command,args,spawnOptions)=>{
    const kind=command==='/bin/ps'?'ps':command==='/usr/bin/sample'?'sample':'unexpected';
    const plan={...(kind==='ps'?options.preflight:options.sample)};
    events.push({kind:'spawn',command,args:[...args],options:spawnOptions,at:now,fired:api?.observation()?.fired});
    if(plan.throwSpawn)throw Object.assign(Error('SECRET spawn error'),{code:plan.throwSpawn});
    const sub=new Emitter();sub.pid=plan.pid===null?undefined:1000+subprocesses.length;sub.stdout=new Emitter();sub.stderr=new Emitter();sub.killed=false;sub.unreferenced=false;
    sub.unref=()=>{sub.unreferenced=true;};
    const close=()=>{sub.emit('exit',plan.code??0,plan.signal??null);sub.emit('close',plan.code??0,plan.signal??null);};
    sub.kill=signal=>{
      sub.killed=true;signals.push({kind,pid:sub.pid,signal,at:now});
      if(plan.killError){sub.emit('error',Object.assign(Error('SECRET kill error'),{code:'EPERM'}));throw Object.assign(Error('SECRET kill throw'),{code:'EPERM'});}
      if(!plan.ignoreKill)setTimer(close,1);
      return true;
    };
    subprocesses.push({kind,sub,plan});
    if(plan.spawnEvent!==false)setTimer(()=>sub.emit('spawn'),0);
    if(plan.errorAt!==undefined)setTimer(()=>sub.emit('error',Object.assign(Error('SECRET error'),{code:plan.errorCode??'EACCES'})),plan.errorAt);
    const stdout=kind==='ps'?(plan.stdout??'77 55 /owned/App\n'):(plan.stdout??'SECRET sampler path\n');
    setTimer(()=>sub.stdout.emit('data',MockBuffer.from(stdout)),plan.dataAt??1);
    setTimer(()=>sub.stderr.emit('data',MockBuffer.from(plan.stderr??'')),plan.dataAt??1);
    if(kind==='sample'&&plan.writeFile!==false)setTimer(()=>putFile(sampleFile,options.sampleText??defaultSample),plan.writeAt??2);
    if(plan.exitAt!==undefined)setTimer(()=>sub.emit('exit',plan.code??0,plan.signal??null),plan.exitAt);
    const closeAt=plan.closeAt===null?null:plan.closeAt??(kind==='ps'?2:2000);
    if(closeAt!==null)setTimer(()=>{if(plan.beforeClose)plan.beforeClose(child);close();},closeAt);
    return sub;
  };
  const handles=new Map();
  const stat=entry=>({isFile:()=>entry.regular,size:entry.bytes.length,dev:1,ino:entry.ino,mtimeMs:entry.mtimeMs,ctimeMs:entry.ctimeMs});
  const context={
    Buffer:MockBuffer,Date:ClockDate,setTimeout:setTimer,clearTimeout:clearTimer,spawn,child,executable,output:'/owned',revision:'a'.repeat(40),process:{pid:55},
    join:(...parts)=>parts.join('/'),
    mkdirAsync(path,configuration){
      events.push({kind:'mkdir',path,configuration,at:now,fired:api.observation()?.fired});
      return new Promise((resolve,reject)=>{
        setTimer(()=>{
          if(options.directoryError||directories.has(path)){reject(Error('SECRET directory failure'));return;}
          directories.add(path);resolve();
        },options.directoryDelay??0);
      });
    },
    lstatSync(path){reads.push({kind:'stat',path,at:now});const f=files.get(path);if(!f||options.fileFailure==='stat')throw Error('SECRET stat');return stat(f);},
    openSync(path,flags){reads.push({kind:'open',path,at:now});if(flags!=='r'||!files.has(path)||options.fileFailure==='open')throw Error('SECRET open');const fd=nextHandle++;handles.set(fd,{path,checks:0});return fd;},
    fstatSync(fd){const h=handles.get(fd);if(!h)throw Error('SECRET fd');h.checks++;const result=stat(files.get(h.path));if(options.changingFile&&h.checks>1)result.mtimeMs++;return result;},
    readSync(fd,target,offset,count,position){
      const h=handles.get(fd);if(!h||options.fileFailure==='read')throw Error('SECRET read');
      const bytes=files.get(h.path).bytes,n=Math.max(0,Math.min(count,bytes.length-position,options.chunkSize??Infinity));
      target.set(bytes.subarray(position,position+n),offset);reads.push({kind:'read',path:h.path,at:now,requested:count,bytes:n});return n;
    },
    closeSync(fd){if(!handles.has(fd))throw Error('SECRET close');handles.delete(fd);if(options.fileFailure==='close')throw Error('SECRET close');},
    hash(value){hashes.push({at:now,bytes:value.length});return sha256Bytes(value).sha256;},
    writeFileSync(path,text,configuration){
      writes.push({path,at:now,flag:configuration?.flag});
      if(options.writeFailure||configuration?.flag==='wx'&&files.has(path))throw Error('SECRET write');
      putFile(path,typeof text==='string'?text:text.toString());
    },
    existsSync:path=>files.has(path),readFileSync:path=>files.get(path)?.bytes,
    spawnSync(...args){events.push({kind:'spawnSync',args,at:now});return{status:0,signal:null,stdout:'',stderr:''};},
    console:{info(text){if(options.consoleFailure)throw Error('SECRET console');logs.push(String(text));}}
  };
  api=new Function('context','const { Buffer,Date,setTimeout,clearTimeout,spawn,child,executable,output,revision,process,join,mkdirAsync,lstatSync,openSync,fstatSync,readSync,closeSync,hash,writeFileSync,existsSync,readFileSync,spawnSync,console }=context;let launchError;\n'+block+'\nreturn { observeInitialWindowRequest,startupObservationIdentity,startupObservationSample,readStartupObservationSample,reportStartupObservation,retainProcessFailure,observation:()=>initialStartupObservation,setLaunchError:value=>{launchError=value} };')(context);
  let resolveRequest,rejectRequest;
  const request=new Promise((resolve,reject)=>{resolveRequest=resolve;rejectRequest=reject;});
  const observed=api.observeInitialWindowRequest(request);
  const outcome={settled:false};
  observed.then(value=>Object.assign(outcome,{settled:true,resolved:true,value}),error=>Object.assign(outcome,{settled:true,resolved:false,error}));
  const settle=(resolved,value)=>{settledAt=now;if(resolved)resolveRequest(value);else rejectRequest(value);};
  return {api,outcome,advance,flush,events,logs,reads,writes,hashes,signals,errors,subprocesses,child,files,handles,putFile,Buffer:MockBuffer,
    resolve:value=>settle(true,value),reject:error=>settle(false,error),now:()=>now,settledAt:()=>settledAt,
    report:()=>logs.length?JSON.parse(logs.at(-1).split('\n')[1]):null};
}
async function reviewStartupSymbolication({source,preimage,historicalSample}) {
  const results=[],metrics={};
  const assert=(value,message)=>{if(!value)throw Error(message);};
  const group=async(name,run)=>{try{await run();results.push({name,status:'passed'});}catch(error){error.failedGroup=name;error.completedGroups=results;throw error;}};
  const fixed=(value,needle,replacement)=>{assert(value.split(needle).length===2,'Nonunique inverse: '+needle.slice(0,60));return value.replace(needle,()=>replacement);};
  const env=options=>createSymbolHarness(source,options);
  const region=(value,start,end)=>{const a=value.indexOf(start),b=value.indexOf(end,a);assert(a>=0&&b>a,'Missing source boundary');return value.slice(a,b);};
  const bind=(e,text=e.sampleText,changes={})=>e.api.startupSymbolInput(text,{processId:77,...changes},{completeStableRead:true,originalSha256:e.context.hash(e.Buffer.from(text)),parsed:e.api.startupObservationSample(text,77,e.name)});
  await group('exact source identity, eight-transform inverse and unchanged request/tool lifecycle',async()=>{
    assert(gitBlobSha(preimage)==='4507f860155746bb6f1a3a9528dd0e74de5d6492','Wrong verifier preimage');
    assert(gitBlobSha(source)==='a82e2fc7df3bde243eb6d053a97e310c39b1293c','Wrong symbol candidate');
    let inverse=source;
    for(const edit of [...symbolSourceEdits].reverse())inverse=fixed(inverse,edit.replacement,edit.old);
    assert(inverse===preimage,'Full source inverse differs');
    const processStart='function startupObservationProcess(',processEnd='function startupObservationSample(';
    assert(region(source,processStart,processEnd)===region(preimage,processStart,processEnd),'Bounded subprocess helper changed');
    const observe=region(source,'async function observeInitialWindowRequest(','function retainProcessFailure(');
    assert(fixed(observe,'if (observation.fired) await reportStartupObservation(observation);','if (observation.fired) reportStartupObservation(observation);')===region(preimage,'async function observeInitialWindowRequest(','function retainProcessFailure('),'Request lifecycle changed outside post-settlement await');
    assert(source.slice(source.indexOf('function retainProcessFailure('))===preimage.slice(preimage.indexOf('function retainProcessFailure(')),'Original failure/tooltip/startup/acceptance tail changed');
    assert(!region(source,'function startupSymbolUUID(','async function reportStartupObservation(').includes('spawnSync'),'New tool path is synchronous');
    const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
    new AsyncFunction(source.replace(/^import .+;\n/gm,'').replace(/import\.meta/g,'({})'));
    metrics.sourceBytes=utf8(source).length;
  });
  await group('same-sample positive tool chain and historical format-only binding',async()=>{
    const e=env(),result=await e.run();
    assert(result.status==='offline-symbol-observation-completed'&&result.executable.matchesLaunchHash&&result.executable.uuidMatches,'Positive executable binding failed');
    assert(result.optionalDsym.presenceEstablished&&result.optionalDsym.uuidMatches&&result.symbolProvider==='uuid-matched-existing-dsym','Positive optional dSYM binding failed');
    assert(result.classification.functionFamily==='activation-trace'&&result.classification.sourceFile==='private-acceptance-driver'&&!result.classification.uniqueSourceCallerEstablished,'Positive closed observation changed attribution boundary');
    assert(e.calls.length===3&&e.calls.every(x=>x.command==='/usr/bin/xcrun'&&x.timeout===3000&&x.pending===false&&!x.args.includes('-p')),'Unexpected tool/timeout/live attachment');
    assert(e.calls[0].args.join('|')===['dwarfdump','--uuid',e.executable].join('|')&&e.calls[1].args.join('|')===['dwarfdump','--uuid',e.dsym].join('|'),'Symbol paths were not the fixed owned products');
    assert(e.calls[2].args.join('|')===['atos','-arch','arm64','-o',e.dsym,'-l','0x100000000','-i','-dedup','0x100000100'].join('|'),'Atos ambiguity flags/input changed');
    assert(result.tools.every(x=>x.retained&&x.retainedSha256&&x.retainedEncoding==='decoded-stdout-as-utf8')&&e.writes.every(x=>x.flag==='wx'),'Private stdout retention lost');
    const publicText=JSON.stringify(result);
    for(const secret of[e.uuid,e.executable,e.dsym,'0x100000100','NYCTronAcceptanceDriver.mm:77','TraceActivation ('])assert(!publicText.includes(secret),'Private symbol input/output leaked');
    assert(gitBlobSha(historicalSample)==='394dd1966d30d917c471a6d9eec323c654fee15e','Wrong historical format fixture');
    const old=env({sampleText:historicalSample}),parsed=old.api.startupObservationSample(historicalSample,37118,old.name);
    const binding=old.api.startupSymbolInput(historicalSample,{processId:37118},{completeStableRead:true,originalSha256:old.context.hash(old.Buffer.from(historicalSample)),parsed}).result;
    assert(parsed.frames.length===32&&parsed.parsedFrameLines===480&&parsed.omittedFrameLines===448,'Historical parser bounds changed');
    assert(binding.architecture==='arm64'&&binding.imageUUIDUnique===true&&binding.imageRangeBytes===5159744&&binding.status==='owned-frame-not-uniquely-retained','Historical image headers/redaction not conservatively handled');
    assert(old.calls.length===0,'Historical format fixture was sent to tools');
    metrics.historicalFormatOnly={retainedFrames:32,parsedFrames:480,omittedFrames:448,selectedFrameUnknown:true};
  });
  await group('owner uniqueness, UTF-8 row bounds, header and PC contradictions fail closed',async()=>{
    const e=env(),row=e.fixture.split('\n').find(x=>x.includes('+org.nyctron.appkit.reference'));
    const malformed=row.replace('0x100000000','INVALID').replace(e.uuid,e.otherUUID);
    const cases=[
      e.fixture+malformed+'\n',
      e.fixture+malformed.replace('/Users/*/','/Users/'+('é'.repeat(4100))+'/')+'\n',
      e.fixture.replace(row,row.replace('/Users/*/','/Users/'+('é'.repeat(4100))+'/')),
      e.fixture.replace('[0x100000100]','[0x100000200]'),
      e.fixture.replace('Code Type: ARM64','Code Type: ARM64\nCode Type: ARM64'),
      e.fixture.replace('Code Type: ARM64','Code Type: X86-64'),
      e.fixture.replace('Load Address: 0x100000000','Load Address: 0x100001000'),
      e.fixture.replace('Identifier: org.nyctron.appkit.reference','Identifier: unrelated.bundle'),
      e.fixture.replace('(pid 77)','(pid 78)'),
      e.fixture.replace('Process: NYCTronAppKitReference [77]','Process: NYCTronAppKitReference [78]')
    ];
    for(const sampleText of cases){const n=env({sampleText}),r=await n.run();assert(r.status!=='offline-symbol-observation-completed'&&n.calls.length===0,'Invalid sample reached tools');}
    for(const options of[{app:'/owned/Other.app'},{name:'Other'}]){const n=env(options);assert((await n.run()).status==='owned-product-layout-unverified'&&n.calls.length===0,'Unverified owned layout reached tools');}
    const badHash=e.original();badHash.originalSha256='0'.repeat(64);
    assert(e.api.startupSymbolInput(e.fixture,e.observation,badHash).result.status==='sample-input-unavailable','Changed sample hash accepted');
    const incomplete=e.original();incomplete.completeStableRead=false;
    assert(e.api.startupSymbolInput(e.fixture,e.observation,incomplete).result.status==='sample-input-unavailable','Incomplete sample accepted');
  });
  await group('regular-file, symlink, bounded-read and close failures retain unknown identity',async()=>{
    for(const failure of['open','read','close']){
      const e=env({fileFailure:failure}),r=await e.run();
      assert(r.status==='executable-launch-hash-unverified'&&r.executable.sha256===null&&e.calls.length===0,'File error exposed accepted identity');
      assert(e.handles.size===0,'File handle not closed');
    }
    for(const location of['executable','dsym']){
      const e=env();e.files.get(e[location]).symlink=true;
      const r=await e.run();assert(r.status!=='offline-symbol-observation-completed'&&r.classification===null,'Symlink accepted');
    }
    const changed=env({changeDuringRead:true});
    assert((await changed.run()).executable.sha256===null&&changed.calls.length===0,'Changing file received complete hash');
    const bounded=env(),small=bounded.output+'/bounded.fixture';bounded.put(small,'abc');
    assert(bounded.api.startupSymbolFile(small,3).status==='complete-stable-file','Exact file cap rejected');
    bounded.files.get(small).reportedSize=2;
    const inconsistent=bounded.api.startupSymbolFile(small,2);
    assert(inconsistent.status==='changed-or-incomplete-file'&&inconsistent.sha256===null,'Cap-plus-one became complete hash');
    assert(bounded.reads.filter(x=>x.kind==='read'&&x.path===small).every(x=>x.bytes<=3),'Bounded read exceeded cap plus probe');
    bounded.files.get(small).regular=false;
    assert(bounded.api.startupSymbolFile(small,3).status==='not-regular-file','Nonregular file accepted');
    assert(bounded.api.startupSymbolFile('/unowned/file',3).status==='outside-owned-product-root','Foreign file boundary lost');
  });
  await group('launch hash, exact architecture/UUID and optional-symbol absence versus mismatch',async()=>{
    const hash=env({launchHash:'0'.repeat(64)});
    assert((await hash.run()).status==='executable-launch-hash-unverified'&&hash.calls.length===0,'Launch hash mismatch accepted');
    const base=env(),badUUID='UUID: '+base.otherUUID+' (arm64) /private/file\n';
    for(const stdout of[badUUID,'UUID: '+base.uuid+' (x86_64) /private/file\n','UUID: '+base.uuid+' (arm64) /a\nUUID: '+base.uuid+' (arm64) /b\n']){
      const e=env({tools:{'executable-uuid':{stdout}}}),r=await e.run();
      assert(r.status==='executable-uuid-or-architecture-unverified'&&e.calls.length===1&&r.classification===null,'Invalid executable UUID advanced');
    }
    const missing=env({dsym:false}),fallback=await missing.run();
    assert(fallback.symbolProvider==='exact-launch-executable'&&!fallback.optionalDsym.presenceEstablished&&missing.calls.length===2&&missing.calls[1].args.includes(missing.executable),'Missing optional dSYM did not use exact executable');
    const mismatch=env({tools:{'dsym-uuid':{stdout:badUUID}}}),r=await mismatch.run();
    assert(r.status==='optional-dsym-uuid-or-architecture-unverified'&&mismatch.calls.length===2,'Mismatched present dSYM silently fell back');
    const oversized=env();oversized.files.get(oversized.dsym).reportedSize=134217729;
    assert((await oversized.run()).status==='optional-symbol-file-unverified'&&oversized.calls.length===1,'Oversized dSYM silently fell back');
  });
  await group('closed-tool, output-cap, unsupported-flag and private-retention failures never retry',async()=>{
    const failures=[
      {closeObserved:false},{spawnObserved:false},{exitCode:1},{timedOut:true},
      {outputLimit:true},{captureFailed:true},{errorCode:'EPERM'}
    ];
    for(const failure of failures){
      const e=env({tools:{atos:failure}}),r=await e.run();
      assert(r.status==='atos-unavailable'&&r.classification===null&&e.calls.length===3,'Failed atos accepted or retried');
      assert(e.calls.at(-1).args.includes('-i')&&e.calls.at(-1).args.includes('-dedup'),'Ambiguity protection dropped');
    }
    const unsupported=env({tools:{atos:{exitCode:1,stdout:'unsupported private path and flags'}}});
    assert((await unsupported.run()).status==='atos-unavailable'&&unsupported.calls.length===3,'Unsupported flags retried');
    const throwing=env({throwTool:'executable-uuid'});
    assert((await throwing.run()).status==='symbol-observation-unavailable'&&throwing.calls.length===1,'Tool throw escaped');
    const failedWrite=env({writeFailure:true});
    assert((await failedWrite.run()).status==='executable-uuid-or-architecture-unverified'&&failedWrite.calls.length===1,'Private retention failure advanced');
    const collision=env();collision.put(collision.output+'/startup-symbol-executable-uuid.txt','ORIGINAL PRIVATE BYTES');
    assert((await collision.run()).status==='executable-uuid-or-architecture-unverified'&&collision.files.get(collision.output+'/startup-symbol-executable-uuid.txt').bytes.toString()==='ORIGINAL PRIVATE BYTES','wx replaced original private evidence');
  });
  await group('atos image, source-file and function classifications remain nonunique and closed',async()=>{
    const e=env(),classify=text=>e.api.startupSymbolClassification(text,e.name),suffix=' (in '+e.name+')';
    assert(classify('TraceActivation (in UnrelatedFramework) (NYCTronAcceptanceDriver.mm:77)').status==='symbol-image-mismatch','Foreign image classified');
    for(const text of['0x100000100'+suffix,'TraceActivation + 42'+suffix,'TraceActivation'+suffix,'<deduplicated_symbol>'+suffix+' (NYCTronAcceptanceDriver.mm:77)','inline frame'+suffix+' (NYCTronAcceptanceDriver.mm:77)','TraceActivation'+suffix+'\nSparkSession'+suffix]){
      const r=classify(text);assert(r.functionFamily==='unknown'&&r.sourceFile==='unknown'&&!r.uniqueSourceCallerEstablished,'Ambiguous/predecessor output was attributed');
    }
    const signature=classify('TraceActivation(NSString*, unsigned long, NSDictionary* () block_pointer)'+suffix+' (NYCTronAcceptanceDriver.mm:77)');
    assert(signature.sourceFile==='private-acceptance-driver'&&signature.functionFamily==='unknown'&&!signature.uniqueSourceCallerEstablished,'Unrecognized signature was stripped into exact attribution');
    const provider=classify('getDeviceName()'+suffix+' (ConstantsProvider.swift:86)');
    assert(provider.sourceFile==='expo-constants-provider'&&provider.functionFamily==='unknown'&&!provider.uniqueSourceCallerEstablished&&!JSON.stringify(provider).includes('86'),'Provider source label became a function/caller/line claim');
    const helper=classify('__destroy_helper_block_e8_32s'+suffix+' (<compiler-generated>:1)');
    assert(helper.functionFamily==='compiler-block-destruction'&&helper.sourceFile==='compiler-generated'&&!helper.uniqueSourceCallerEstablished,'Compiler family was lost or became a caller');
    const privateName='PrivateSecretFunction',privatePath='/private/secret/PrivateSource.mm';
    const unknown=classify(privateName+suffix+' ('+privatePath+':98654)');
    const text=JSON.stringify(unknown);
    assert(unknown.functionFamily==='unknown'&&unknown.sourceFile==='unknown'&&!text.includes(privateName)&&!text.includes(privatePath)&&!text.includes('98654'),'Arbitrary source text leaked');
  });
  await group('fixed sample labels preserve counts/relative offsets and remove class names',async()=>{
    const e=env(),parsed=e.original().parsed;
    assert(parsed.frames[0].image==='libsystem_blocks.dylib'&&parsed.frames[0].symbol==='_Block_release','Block platform label missing');
    assert(parsed.frames[2].symbol==='objc-dealloc-selector'&&parsed.frames[2].offset===52&&parsed.frames[2].count===164,'Closed selector metadata missing');
    assert(!JSON.stringify(parsed).includes('PrivateSecretClass')&&!JSON.stringify(parsed).includes('0x'),'Raw class/address leaked');
    const known=['_Block_copy','_Block_object_dispose','objc_release','objc_storeStrong','_dispatch_block_async_invoke','_dispatch_block_async_invoke2','_dispatch_block_async_invoke_and_release','dispatch_block_wait','dispatch_semaphore_wait','_dispatch_semaphore_wait_slow','_dispatch_sema4_wait'];
    for(const symbol of known){
      const text=e.fixture.replace('_Block_release',symbol).replace('libsystem_blocks.dylib',symbol.startsWith('objc_')?'libobjc.A.dylib':'libdispatch.dylib');
      assert(e.api.startupObservationSample(text,77,e.name).frames[0].symbol===symbol,'Closed exact vocabulary missing');
    }
    const foreign=e.fixture.replace('(in Foundation)','(in UnrelatedPrivateImage)');
    assert(e.api.startupObservationSample(foreign,77,e.name).frames[2].symbol==='unknown','Foreign-image selector generalized');
  });
  await group('post-tool hash/bytes comparisons and complete 16 KiB report stay bounded/private',async()=>{
    for(const changeAfterAtos of['binary','dsym']){
      const e=env({changeAfterAtos}),r=await e.run();
      assert(r.status==='symbol-input-changed'&&r.classification===null,'Changed input classified');
      assert(!JSON.stringify(r).includes('stableAfterTools'),'Cross-call hash falsely labeled continuous stability');
    }
    const normal=env();await normal.report();
    assert(normal.logs.length===1,'Normal report missing');
    const record=JSON.parse(normal.logs[0].split('\n')[1]);
    assert(record.original.originalSha256===record.symbolication.originalSampleSha256&&!record.nativeAcceptancePermitted&&record.diagnosticOnly,'Report sample or diagnostic binding changed');
    metrics.normalEnvelopeBytes=utf8(normal.logs[0]+'\n').length;
    assert(metrics.normalEnvelopeBytes<=16384,'Normal envelope exceeds limit');
    for(const secret of[normal.uuid,normal.executable,normal.dsym,'0x100000100','PrivateSecretClass','NYCTronAcceptanceDriver.mm:77'])assert(!normal.logs[0].includes(secret),'Public report leaked private input/output');
    const huge=env();
    const line='    + '+Number.MAX_SAFE_INTEGER+' -[NSApplication(NSEventRouting) _nextEventMatchingEventMask:untilDate:inMode:dequeue:]  (in AppKit) + '+Number.MAX_SAFE_INTEGER+'  [0x200000001]';
    const many=huge.fixture.replace('Total number in stack',Array.from({length:40},()=>line).join('\n')+'\nTotal number in stack');
    const maximum=env({sampleText:many});
    maximum.observation.preflight={status:'fixed-test-padding'.repeat(350)};
    await maximum.report();
    assert(maximum.logs.length===1,'Trimmed envelope missing');
    const trimmed=JSON.parse(maximum.logs[0].split('\n')[1]);
    assert(trimmed.original.parsed.frames.length===0&&trimmed.original.parsed.omittedForOutputLimit===32,'Actual report did not apply existing frame trimming');
    assert(trimmed.symbolication.classification?.functionFamily==='activation-trace','Trimmed report lost selected symbol observation');
    metrics.trimmedEnvelopeBytes=utf8(maximum.logs[0]+'\n').length;
    assert(metrics.trimmedEnvelopeBytes<=16384,'Trimmed envelope exceeds cap');
    const over=env();over.observation.preflight={status:'fixed-test-padding'.repeat(1000)};await over.report();
    assert(over.logs.length===0,'Unavoidably oversized envelope was emitted');
    for(const options of[{consoleFailure:true},{writeFailure:true},{fileFailure:'read'}]){
      const e=env(options);await e.report();
      assert(e.logs.every(x=>utf8(x+'\n').length<=16384),'Failure report exceeded cap');
      assert(!e.logs.join('').includes('PRIVATE ERROR'),'Error text leaked');
    }
  });
  await group('new awaited reporter cannot replace original rejection or permit triggered success',async()=>{
    const start=source.indexOf('let initialStartupObservation;'),end=source.indexOf('function tooltipFailureSummary(');
    const block=source.slice(start,end);
    for(const resolved of[false,true]){
      const e=createWatchdogHarness(block,{consoleFailure:true});
      await e.advance(13000);
      assert(e.api.observation().fired&&e.api.observation().sample?.closeObserved,'Lifecycle fixture failed to sample while pending');
      assert(e.reads.length===0&&e.hashes.length===0,'New symbol processing ran before request settlement');
      const original=Object.assign(Error('original request rejection'),{code:'E_ORIGINAL_REQUEST'});
      if(resolved)e.resolve({late:true});else e.reject(original);
      await e.flush();
      assert(e.outcome.settled&&!e.outcome.resolved,'Triggered request reached acceptance');
      assert(resolved?e.outcome.error.code==='E_STARTUP_DIAGNOSTIC_ONLY':e.outcome.error===original,'Original outcome guard changed');
      assert(e.errors.length===0&&e.events.filter(x=>x.kind==='spawn'&&x.command!=='/bin/ps'&&x.command!=='/usr/bin/sample').length===0,'Lifecycle fixture had unexpected process/error');
    }
  });
  return {status:'passed',groups:results,metrics,scope:'V8 syntax/source checks and deterministic mocked filesystem/tools/timers/child processes/console; no Node OS IO, dwarfdump, atos, macOS or native execution.'};
}

