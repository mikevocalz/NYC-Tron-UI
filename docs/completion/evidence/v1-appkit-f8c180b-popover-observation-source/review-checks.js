(function () {
const H = (() => {
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
const expected = {"before":"8c3176f220c5b038b2f1c7d1bbbc41dc693606f2","after":"f79ff69823912de0efb4b6664ede1f14627b9bda","helpers":"34870863622f000e9a9246f552f15810287c9281","beforeBytes":120831,"afterBytes":128984,"afterSha256":"06da9207bda3fec1b8b599d1de1517c64e124683ba2718800078ef5b2b24b298","waitEdit":{"name":"observe existing presentation-poll responses and preserve the original failure","before":"  const value = await waitFor(async () => { const current = await popover(window); return current.shown && current.contentVisible ? current : undefined; }, 'shown native NSPopover');","after":"  const observation = createPopoverObservation(window);\n  let value;\n  try {\n    value = await waitFor(async () => {\n      const current = await popover(window);\n      capturePopoverResponse(observation, current);\n      return current.shown && current.contentVisible ? current : undefined;\n    }, 'shown native NSPopover');\n  } catch (error) {\n    reportPopoverFailure(observation);\n    throw error;\n  }"}};

const ensure = (value, message) => { if (!value) throw new Error(message); };
const equal = (actual, expected, message) => { if (actual !== expected) throw new Error(message + ": " + String(actual) + " !== " + String(expected)); };
const same = (actual, expected, message) => equal(JSON.stringify(actual), JSON.stringify(expected), message);
function section(text, begin, end) {
  const start = text.indexOf(begin), finish = text.indexOf(end, start + begin.length);
  ensure(start >= 0 && finish > start, "Missing exact source section " + begin);
  ensure(text.indexOf(begin, start + 1) < 0, "Nonunique source section " + begin);
  return text.slice(start, finish);
}
function extracted(text) {
  const helperStart = text.indexOf("function projectPopoverResponse(");
  const shownStart = text.indexOf("async function shownPopover(window = 'main') {");
  return {
    helpers: helperStart < 0 ? "" : text.slice(helperStart, shownStart),
    wait: section(text, "async function waitFor(", "\nconst inspect ="),
    popover: section(text, "const popover =", "\nasync function armPopoverCloseObservation"),
    shown: section(text, "async function shownPopover(window = 'main') {", "\nasync function dragProtocol"),
  };
}
function environment(text, options = {}) {
  const pieces = extracted(text), good = {
    ok: true, nativePopover: true, shown: true, contentVisible: true, contentIdentity: "PRIVATE_IDENTITY_SENTINEL",
    frame: { x: 20, y: 30, width: 40, height: 50 }, region: { x: 0, y: 0, width: 500, height: 400 },
    class: "PRIVATE_CLASS_SENTINEL", classes: ["PRIVATE_NESTED_CLASS"], closeTrace: { scopeToken: "PRIVATE_TOKEN" },
  };
  const values = options.values ?? [good];
  const trace = { time: 0, polls: 0, calls: [], assertions: [], files: [], logs: [], consoleAttempts: 0,
    waitFailure: null, assertionError: null, storage: new Map(), popovers: [] };
  if (options.existingDiagnostic !== undefined) trace.storage.set("/mock-evidence/popover-show-failure.json", options.existingDiagnostic);
  const driver = { request(name, args) {
    trace.calls.push({ name, args }); equal(name, "tron.popover", "Added or changed native command");
    const index = trace.polls++;
    if (options.requestError) return Promise.reject(options.requestError);
    return Promise.resolve(values[Math.min(index, values.length - 1)]);
  } };
  const assertionFailure = message => { const error = new Error(message ?? "Mock assertion failed"); trace.assertionError = error; throw error; };
  const assert = {
    equal(actual, expected, message) { trace.assertions.push({ kind: "equal", actual, expected, message: message ?? null }); if (actual !== expected) assertionFailure(message); },
    ok(value, message) { trace.assertions.push({ kind: "ok", value: Boolean(value), message: message ?? null }); if (!value) assertionFailure(message); },
  };
  const write = (path, content, flags) => {
    trace.files.push({ path, content, flags: flags ?? null });
    if (path.endsWith("/popover-show-failure.json")) {
      equal(flags?.flag, "wx", "Diagnostic output must be exclusive");
      if (options.writeError) throw options.writeError;
      if (trace.storage.has(path)) { const error = new Error("private duplicate detail"); error.code = "EEXIST"; throw error; }
    } else {
      equal(path, "/mock-evidence/popovers.json", "Unexpected filesystem output");
      if (options.popoversWriteError) throw options.popoversWriteError;
    }
    trace.storage.set(path, content);
  };
  const instrument = [
    "const originalWaitFor = waitFor;",
    "waitFor = async (...args) => { try { return await originalWaitFor(...args); } catch (error) { trace.waitFailure = error; throw error; } };",
    "return { shownPopover,",
    "project: typeof projectPopoverResponse === 'function' ? projectPopoverResponse : null,",
    "create: typeof createPopoverObservation === 'function' ? createPopoverObservation : null,",
    "capture: typeof capturePopoverResponse === 'function' ? capturePopoverResponse : null,",
    "summary: typeof popoverObservationSummary === 'function' ? popoverObservationSummary : null,",
    "report: typeof reportPopoverFailure === 'function' ? reportPopoverFailure : null };",
  ].join("\n");
  const program = pieces.helpers + "\n" + pieces.wait + "\n" + pieces.popover + "\n" + pieces.shown + "\n" + instrument;
  const api = new Function("driver", "assert", "pause", "Date", "Buffer", "writeFileSync", "join", "output", "revision", "console", "assertRunning", "trace", "popovers", program)(
    driver, assert, async milliseconds => { trace.time += milliseconds; }, { now: () => trace.time },
    { byteLength: value => H.utf8(value).length }, write, (...parts) => parts.join("/"), "/mock-evidence", "a".repeat(40),
    { info(value) { trace.consoleAttempts++; if (options.consoleError) throw options.consoleError; trace.logs.push(value); } },
    () => { if (options.runningError) throw options.runningError; }, trace, trace.popovers);
  return { trace, api, good, async run(owner = "document-1") {
    try { return { value: await api.shownPopover(owner), error: null }; } catch (error) { return { value: null, error }; }
  } };
}
function envelope(text) {
  const lines = text.split("\n");
  equal(lines.length, 3, "Envelope must be complete three-line output");
  equal(lines[0], "NYCTRON_POPOVER_SHOW_EVIDENCE_BEGIN", "Wrong begin marker");
  equal(lines[2], "NYCTRON_POPOVER_SHOW_EVIDENCE_END", "Wrong end marker");
  ensure(H.utf8(text + "\n").length <= 8192, "Console envelope exceeded eight KiB");
  return JSON.parse(lines[1]);
}
function privateOutput(trace) {
  const selected = trace.files.filter(file => file.path.endsWith("/popover-show-failure.json")).map(file => file.content).concat(trace.logs).join("\n");
  for (const forbidden of ["PRIVATE_IDENTITY_SENTINEL", "PRIVATE_CLASS_SENTINEL", "PRIVATE_NESTED_CLASS", "PRIVATE_TOKEN", "PRIVATE_ERROR_SENTINEL"])
    ensure(!selected.includes(forbidden), "Diagnostic leaked " + forbidden);
}

return async function reviewPopoverCapture({ source, preimage }) {
  const groups = [];
  equal(H.blob(preimage), expected.before, "Wrong verifier preimage");
  equal(H.blob(source), expected.after, "Wrong verifier candidate");
  equal(H.utf8(source).length, expected.afterBytes, "Wrong candidate bytes");
  equal(H.sha256(source), expected.afterSha256, "Wrong candidate SHA256");
  const before = extracted(preimage), after = extracted(source);
  equal(H.blob(after.helpers), expected.helpers, "Wrong helper insertion");
  equal(source.split(expected.waitEdit.after).length, 2, "Nonunique replacement");
  let inverse = source.replace(expected.waitEdit.after, expected.waitEdit.before);
  equal(inverse.split(after.helpers).length, 2, "Nonunique helper insertion");
  inverse = inverse.replace(after.helpers, "");
  equal(inverse, preimage, "Two-edit inverse differs from complete preimage");
  equal(before.wait, after.wait, "20-second/50-ms wait changed");
  equal(before.popover, after.popover, "Native request helper changed");
  equal(before.shown.slice(before.shown.indexOf("  assert.equal(value.nativePopover")), after.shown.slice(after.shown.indexOf("  assert.equal(value.nativePopover")), "Assertion/retention order changed");
  equal(preimage.slice(preimage.indexOf("\nasync function dragProtocol")), source.slice(source.indexOf("\nasync function dragProtocol")), "Later runtime, error or cleanup tail changed");
  equal(source.split("return current.shown && current.contentVisible ? current : undefined;").length, 2, "Original predicate changed or duplicated");
  const parseOnly = source.replace(/^import .*;\r?$/gm, "").replaceAll("import.meta.url", '"file:///review/verify-native.mjs"');
  new (Object.getPrototypeOf(async function(){}).constructor)(parseOnly);
  groups.push("exact identities, two-edit inverse, original wait/request/predicate/assertion/runtime suffix and V8 parse only");

  const pure = environment(source), project = pure.api.project;
  same(project({ nativePopover: true, shown: false, contentVisible: true }).state.conjunction, { shown: false, contentVisible: true }, "Shown false was lost");
  same(project({ nativePopover: true, shown: true, contentVisible: false }).state.conjunction, { shown: true, contentVisible: false }, "Hidden content was conflated with shown false");
  const unknown = project({ nativePopover: 1, shown: "false", frame: { x: "0", y: 0, width: 1, height: 2 }, region: { x: 0, y: 0, width: Infinity, height: 5 } }).state;
  equal(unknown.nativePopover, null, "Wrong native type must be unknown");
  same(unknown.conjunction, { shown: null, contentVisible: null }, "Missing/malformed predicate values coerced");
  equal(unknown.frame.status, "invalid", "Invalid rectangle must remain invalid");
  equal(unknown.frame.x, null, "Numeric string coerced");
  equal(unknown.region.width, null, "Infinity retained");
  equal(unknown.geometry.frameInsideRegion, null, "Invalid geometry became containment result");
  const outside = project({ frame: { x: 90, y: 0, width: 20, height: 20 }, region: { x: 0, y: 0, width: 100, height: 100 } }).state;
  equal(outside.geometry.frameInsideRegion, false, "Observed outside geometry lost");
  const overflowGeometry = project({ frame: { x: Number.MAX_VALUE, y: 0, width: Number.MAX_VALUE, height: 1 }, region: { x: 0, y: 0, width: Number.MAX_VALUE, height: 10 } }).state;
  equal(overflowGeometry.geometry.frameInsideRegion, null, "Overflowing extent became containment result");
  equal(project({ contentIdentity: "" }).state.identity.stringPresent, false, "Observed empty string must be false");
  equal(project({ contentIdentity: "x".repeat(129) }).state.identity.stringPresent, null, "Over-limit identity must be unknown");
  equal(project({ contentIdentity: "0x0" }).state.identity.stringPresent, true, "Identity presence must describe string shape only");
  let accessorReads = 0;
  const withAccessor = {}; Object.defineProperty(withAccessor, "shown", { get() { accessorReads++; throw new Error("PRIVATE_ERROR_SENTINEL"); } });
  equal(project(withAccessor).state.conjunction.shown, null, "Accessor field must remain unknown");
  equal(accessorReads, 0, "Projection invoked a getter");
  groups.push("typed false-versus-unknown predicates, finite geometry/overflow, bounded identity shape and own-data-only projection");

  const constant = pure.api.create("document-1");
  for (let index = 0; index < 400; index++) pure.api.capture(constant, { ...pure.good, shown: false });
  const constantSummary = pure.api.summary(constant);
  equal(constantSummary.returnedResponses, 400, "Constant response count");
  equal(constantSummary.stateChanges, 0, "Constant state invented changes");
  equal(constantSummary.selectedRecords, 2, "First and last retention");
  equal(constantSummary.omittedResponses, 398, "Constant omission count");
  equal(constantSummary.records[0].first, true, "First marker");
  equal(constantSummary.records[1].last, true, "Last marker");
  const identityObservation = pure.api.create("unrecognized-owner");
  pure.api.capture(identityObservation, {});
  pure.api.capture(identityObservation, { ...pure.good });
  pure.api.capture(identityObservation, { ...pure.good, contentIdentity: "OTHER_PRIVATE_IDENTITY" });
  const identitySummary = pure.api.summary(identityObservation);
  equal(identitySummary.owner, null, "Arbitrary owner leaked");
  equal(identitySummary.identityBaselineResponse, 2, "Identity baseline must bind first bounded observed string");
  equal(identitySummary.records.at(-1).identity.matchesFirstObserved, false, "Different identity equality not observed");
  ensure(!JSON.stringify(identitySummary).includes("OTHER_PRIVATE_IDENTITY"), "Identity string leaked");
  identityObservation.returnedResponses = Number.MAX_SAFE_INTEGER; identityObservation.stateChanges = Number.MAX_SAFE_INTEGER;
  pure.api.capture(identityObservation, { ...pure.good, shown: false });
  const overflowCounts = pure.api.summary(identityObservation);
  equal(overflowCounts.returnedResponses, null, "Counter overflow wrapped");
  equal(overflowCounts.stateChanges, null, "Change counter overflow wrapped");
  equal(overflowCounts.omittedResponses, null, "Unknown count became omitted count");
  equal(overflowCounts.countOverflow, true, "Counter overflow status absent");
  groups.push("first/last/change accounting, private identity baseline, owner allowlist and safe-counter overflow");

  const successValues = [{ ...pure.good, shown: false }, { ...pure.good, contentVisible: false }, pure.good];
  const oldSuccess = environment(preimage, { values: successValues }), newSuccess = environment(source, { values: successValues });
  const oldSuccessResult = await oldSuccess.run(), newSuccessResult = await newSuccess.run();
  equal(oldSuccessResult.error, null, "Preimage success fixture failed");
  equal(newSuccessResult.error, null, "New success fixture failed");
  equal(newSuccessResult.value, pure.good, "Original response object not returned");
  same(newSuccess.trace.calls, oldSuccess.trace.calls, "Successful native request sequence changed");
  same(newSuccess.trace.assertions, oldSuccess.trace.assertions, "Success assertion order changed");
  same(newSuccess.trace.files, oldSuccess.trace.files, "Success original popovers retention changed");
  equal(newSuccess.trace.polls, 3, "Delayed success polls changed");
  equal(newSuccess.trace.time, 100, "Delayed success cadence changed");
  equal(newSuccess.trace.logs.length, 0, "Successful presentation emitted failure log");
  groups.push("same successful three-response polling, original response/assertion order and popovers retention");

  let normalEnvelopeBytes = null;
  for (const value of [{ ...pure.good, shown: false }, { ...pure.good, contentVisible: false }, { ...pure.good, shown: undefined, contentVisible: undefined }]) {
    const original = environment(preimage, { values: [value] }), current = environment(source, { values: [value] });
    const originalResult = await original.run(), currentResult = await current.run();
    ensure(originalResult.error && originalResult.error === original.trace.waitFailure, "Preimage timeout fixture invalid");
    equal(currentResult.error, current.trace.waitFailure, "Original timeout Error object replaced");
    equal(current.trace.time, 20000, "Timeout deadline changed");
    equal(current.trace.polls, 400, "Timeout polling changed");
    same(current.trace.calls, original.trace.calls, "Timeout introduced native requests");
    equal(current.trace.logs.length, 1, "Expected one failure envelope");
    const report = envelope(current.trace.logs[0]);
    equal(report.returnedResponses, 400, "Wrong retained response count");
    equal(report.selectedRecords, 2, "Constant timeout must retain first and last");
    equal(report.original.writeStatus, "retained", "Original diagnostic was not retained");
    same(report.records[0].conjunction, project(value).state.conjunction, "Failed conjunction projection altered");
    privateOutput(current.trace);
    if (normalEnvelopeBytes === null) normalEnvelopeBytes = H.utf8(current.trace.logs[0] + "\n").length;
  }
  groups.push("same 20-second timeout/Error identity and 400-command sequence for false shown, hidden content and unknowns");

  for (const option of ["requestError", "runningError"]) {
    const sentinel = new Error("PRIVATE_ERROR_SENTINEL"), current = environment(source, { [option]: sentinel });
    const result = await current.run();
    equal(result.error, sentinel, "Original " + option + " replaced");
    equal(current.trace.calls.length, option === "requestError" ? 1 : 0, "Rejection added a request");
    privateOutput(current.trace);
  }
  const accessorFailure = new Error("PRIVATE_ERROR_SENTINEL"); let predicateReads = 0;
  const getterResponse = { ...pure.good };
  Object.defineProperty(getterResponse, "shown", { get() { predicateReads++; throw accessorFailure; } });
  const accessorEnvironment = environment(source, { values: [getterResponse] }), accessorResult = await accessorEnvironment.run();
  equal(accessorResult.error, accessorFailure, "Predicate getter error replaced");
  equal(predicateReads, 1, "Diagnostic invoked the predicate getter");
  equal(accessorEnvironment.trace.calls.length, 1, "Getter failure added a request");
  groups.push("request/process/predicate errors keep exact objects without extra requests or getter calls");

  const rejected = { ...pure.good, shown: false }, oldBytes = "first original bytes\n";
  const duplicate = environment(source, { values: [rejected], existingDiagnostic: oldBytes }), duplicateResult = await duplicate.run();
  equal(duplicateResult.error, duplicate.trace.waitFailure, "Duplicate write replaced timeout");
  equal(duplicate.trace.storage.get("/mock-evidence/popover-show-failure.json"), oldBytes, "Existing first file replaced");
  equal(envelope(duplicate.trace.logs[0]).original.writeErrorCode, "EEXIST", "Duplicate write status lost");
  for (const option of ["writeError", "consoleError"]) {
    const sentinel = new Error("PRIVATE_ERROR_SENTINEL"); sentinel.code = "EPERM";
    const current = environment(source, { values: [rejected], [option]: sentinel }), result = await current.run();
    equal(result.error, current.trace.waitFailure, "Diagnostic failure replaced primary Error");
    equal(current.trace.calls.length, 400, "Diagnostic failure altered native calls");
    if (option === "writeError") {
      const report = envelope(current.trace.logs[0]); equal(report.original.writeStatus, "failed", "Write error status");
      equal(report.original.writeErrorCode, "EPERM", "Bounded write error code"); privateOutput(current.trace);
    } else equal(current.trace.consoleAttempts, 1, "Console error retried logging");
  }
  groups.push("exclusive first-file preservation and secondary file/console errors with unchanged primary timeout");

  const stress = environment(source), observation = stress.api.create("document-1");
  const maximalA = { ...stress.good, shown: false,
    frame: { x: -Number.MAX_VALUE, y: -Number.MIN_VALUE, width: Number.MAX_VALUE, height: Number.MIN_VALUE },
    region: { x: -Number.MAX_VALUE, y: -Number.MIN_VALUE, width: Number.MAX_VALUE, height: Number.MIN_VALUE } };
  const maximalB = { ...maximalA, shown: true, contentVisible: false };
  for (let index = 0; index < 400; index++) stress.api.capture(observation, index % 2 ? maximalB : maximalA);
  stress.api.capture(observation, maximalB);
  stress.api.report(observation);
  equal(stress.trace.logs.length, 1, "Stress report missing");
  const stressReport = envelope(stress.trace.logs[0]);
  equal(stressReport.selectedRecords, 8, "Eight-record selection limit");
  equal(stressReport.records[0].first, true, "Stress first response omitted");
  equal(stressReport.records.at(-1).last, true, "Stress last response omitted");
  equal(stressReport.returnedResponses, 401, "Stress response count");
  equal(stressReport.stateChanges, 399, "Stress changes count");
  equal(stressReport.omittedResponses, 393, "Stress omitted responses");
  equal(stressReport.omittedStateChanges, 393, "Stress omitted changes");
  privateOutput(stress.trace);
  for (const bad of [
    { ...pure.good, nativePopover: false },
    { ...pure.good, frame: { ...pure.good.frame, width: 0 } },
    { ...pure.good, frame: { ...pure.good.frame, x: -1 } },
    { ...pure.good, frame: { ...pure.good.frame, width: 1000 } }
  ]) {
    const old = environment(preimage, { values: [bad] }), next = environment(source, { values: [bad] });
    const oldResult = await old.run(), nextResult = await next.run();
    ensure(oldResult.error && oldResult.error === old.trace.assertionError, "Bad geometry preimage must reject");
    equal(nextResult.error, next.trace.assertionError, "Original postpoll assertion error replaced");
    same(next.trace.calls, old.trace.calls, "Postpoll failure changed commands");
    same(next.trace.assertions, old.trace.assertions, "Postpoll assertion order changed");
    equal(next.trace.logs.length, 0, "Postpoll failure scope changed");
  }
  groups.push("eight-record finite-numeric envelope bound/omissions and unchanged postpoll native/geometry assertions");
  return { status: "passed", scope: "Exact extracted verifier functions in V8 with mocked driver, clock, assertions and IO; no Node filesystem or native execution.",
    designCount: groups.length, groups: groups.map(name => ({ name, status: "passed" })),
    metrics: { timeoutPolls: 400, timeoutMilliseconds: 20000, timeoutNativeRequests: 400,
      delayedSuccessPolls: newSuccess.trace.polls, delayedSuccessMilliseconds: newSuccess.trace.time,
      normalEnvelopeBytes, maximumNumericEightRecordEnvelopeBytes: H.utf8(stress.trace.logs[0] + "\n").length },
    nativeExecution: false, nodeFilesystemExecution: false };
};

})()
