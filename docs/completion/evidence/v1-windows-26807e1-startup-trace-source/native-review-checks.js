// Reproduce the bounded private startup trace source review in V8.
// Evaluate this file, then call the returned function with the exact four inputs.
(function(){
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


const utf8 = s=>{const b=[];for(const ch of s){const n=ch.codePointAt(0);if(n<0x80)b.push(n);else if(n<0x800)b.push(0xc0|(n>>6),0x80|(n&63));else if(n<0x10000)b.push(0xe0|(n>>12),0x80|((n>>6)&63),0x80|(n&63));else b.push(0xf0|(n>>18),0x80|((n>>12)&63),0x80|((n>>6)&63),0x80|(n&63));}return b;};

return function reviewStartupTraceNative({source,preimage,manifest,protocol}) {
  let assertions=0;
  const groups=[];
  const check=(condition,label)=>{++assertions;if(!condition)throw new Error(label);};
  const exact=(a,b,label)=>check(a===b,label);
  const count=(s,part)=>s.split(part).length-1;
  const bytes=s=>utf8(s).length;
  const identity=s=>({gitBlob:gitBlobSha(s),...sha256Bytes(utf8(s))});
  function matches(actual,expected,label) {
    for(const field of ["gitBlob","bytes","sha256"])exact(actual[field],expected[field],label+"."+field);
  }
  matches(identity(source),manifest.candidate,"candidate");
  matches(identity(preimage),manifest.preimage,"preimage");
  exact(manifest.preimage.gitBlob,"00f6ff5f1735c81a5268855a5fb33627f5112cd7","exact native baseline");
  let forward=preimage;
  for(const edit of manifest.edits) {
    exact(count(forward,edit.before),1,"unique forward "+edit.id);
    forward=forward.replace(edit.before,()=>edit.after);
  }
  exact(forward,source,"full forward");
  let inverse=source;
  for(const edit of manifest.edits.slice().reverse()) {
    exact(count(inverse,edit.after),1,"unique inverse "+edit.id);
    inverse=inverse.replace(edit.after,()=>edit.before);
  }
  exact(inverse,preimage,"full inverse");
  exact(manifest.edits.length,15,"fifteen edits");
  groups.push("Exact Git/SHA/byte provenance and fifteen reversible unique source transforms");

  const set="settings.Properties().Set(HookKey(), winrt::make<Hook>(std::move(observer)));";
  exact(count(preimage,set),1,"original set once");
  exact(count(source,set),1,"set expression unchanged once");
  const config=source.slice(source.indexOf("inline void ConfigureNavigationProbe("));
  check(config.indexOf("BeginStartupTrace(revision)")<config.indexOf("auto observer = std::make_shared<Observer>(revision);"),"trace opens before observer factory");
  check(config.indexOf("StartupStage::PropertySetBefore")<config.indexOf(set)&&
    config.indexOf("StartupStage::PropertySetReturned")>config.indexOf(set),"unchanged set bracketed");
  const oldCtor=preimage.slice(preimage.indexOf("  explicit Observer("),preimage.indexOf("  Json::JsonObject Header("));
  const newCtor=source.slice(source.indexOf("  explicit Observer("),source.indexOf("  Json::JsonObject Header("));
  exact(newCtor.replace(/^    StartupTrace\(StartupStage::\w+\);\n/gm,""),oldCtor,"all constructor statements and order unchanged");
  const oldReg=preimage.slice(preimage.indexOf("  void Register(Object"),preimage.indexOf("  void RegistrationFailed("));
  const newReg=source.slice(source.indexOf("  void Register(Object"),source.indexOf("  void RegistrationFailed("));
  exact(newReg.replace(/^ +StartupTrace\(StartupStage::\w+\);\n/gm,""),oldReg,"all Observer Register statements and order unchanged");
  const oldMsg=preimage.slice(preimage.indexOf("  static LRESULT CALLBACK WindowMessage("),preimage.indexOf(" private:\n  Visuals Find("));
  const newMsg=source.slice(source.indexOf("  static LRESULT CALLBACK WindowMessage("),source.indexOf(" private:\n  Visuals Find("));
  exact(newMsg.replace("    StartupWindowMessageScope startupScope;\n",""),oldMsg,"window callback only gains local diagnostic scope");
  const oldOwn=preimage.slice(preimage.indexOf("  void RegistrationFailed("),preimage.indexOf("  static LRESULT CALLBACK WindowMessage("));
  const newOwn=source.slice(source.indexOf("  void RegistrationFailed("),source.indexOf("  static LRESULT CALLBACK WindowMessage("));
  exact(newOwn,oldOwn,"registration failure/unregister/close behavior unchanged");
  const oldObservation=preimage.slice(preimage.indexOf(" private:\n  Visuals Find("),preimage.indexOf("struct Hook :"));
  const newObservation=source.slice(source.indexOf(" private:\n  Visuals Find("),source.indexOf("struct Hook :"));
  exact(newObservation,oldObservation,"visual snapshot/request protocol byte-identical");
  groups.push("Original expression ownership, operation ordering, callback and geometry/protocol preservation");

  const helper=source.slice(source.indexOf("// Startup observation is private"),source.indexOf("inline RN::IReactPropertyName HookKey()"));
  const nameBlock=helper.slice(helper.indexOf("static constexpr char const* names[]"),helper.indexOf("const auto index ="));
  const names=Array.from(nameBlock.matchAll(/"([a-z][a-z-]+)"/g),match=>match[1]);
  exact(JSON.stringify(names),JSON.stringify(protocol.stages),"actual native enum label agreement");
  exact(new Set(names).size,49,"49 unique labels");
  for(const [constant,value] of [["StartupTraceRecordLimit",64],["StartupTraceByteLimit",16384],["StartupTraceRowBytes",512]]) {
    check(helper.includes("constexpr uint32_t "+constant+" = "+value+";"),"actual cap "+constant);
  }
  for(const forbidden of ["ApplicationData::","settings.Properties", "SetForegroundWindow", "SetWindowPos","GetWindowRect","ReactContext","Json::"]) {
    check(!helper.includes(forbidden),"no unrelated app/WinRT operations in trace helper: "+forbidden);
  }
  check(helper.includes("GetTempPathW(MAX_PATH + 1, directory)"),"bounded Win32 resolver");
  check(helper.includes('L"%lsnyctron-startup-%ls-%lu-%llu.jsonl"'),"exact fixed path format");
  check(helper.includes("length <= 0 || length >= MAX_PATH"),"full path bound");
  check(helper.includes("CreateFileW(path, GENERIC_WRITE, FILE_SHARE_READ, nullptr,\n      CREATE_NEW, FILE_ATTRIBUTE_NORMAL | FILE_FLAG_OPEN_REPARSE_POINT, nullptr)"),"exclusive immutable writer flags");
  check(!helper.includes("FILE_SHARE_WRITE")&&!helper.includes("FILE_SHARE_DELETE"),"no other write/delete sharing");
  const fields=["schemaVersion","sourceRevision","processId","creationFileTime","sequence","threadId","stage","contentionObservedThroughRow"];
  exact(JSON.stringify(Object.keys(protocol.fields)),JSON.stringify(fields),"protocol field order");
  const row=(stage,sequence=64,contention=false)=>JSON.stringify({
    schemaVersion:1,sourceRevision:"f".repeat(40),processId:4294967295,
    creationFileTime:"18446744073709551615",sequence,threadId:4294967295,
    stage,contentionObservedThroughRow:contention
  })+"\n";
  let maximumRowBytes=0;
  for(const name of names)for(const contention of [false,true]) {
    const record=row(name,64,contention);
    check(/^[\x20-\x7e]*\n$/.test(record),"ASCII JSONL "+name);
    exact(Object.keys(JSON.parse(record)).join(","),fields.join(","),"fixed keys "+name);
    maximumRowBytes=Math.max(maximumRowBytes,bytes(record));
    check(bytes(record)<512,"row bounded "+name);
  }
  exact(maximumRowBytes,262,"maximum legal row width");
  groups.push("Actual fixed resolver/flags/schema agreement and every label's maximum-width JSON row");

  // Portable model of the reviewed writer's caps/partial-write rules only.
  // This is not C++, Win32 IO, concurrency or native execution.
  function modelWrite(state,stage,{contention=false,partial=null,fail=false}={}) {
    if(contention){state.contention=true;return;}
    if(state.disabled)return;
    const limit=state.records>=63||state.bytes>16384-2*512;
    if(limit)stage="trace-limit";
    if(!names.includes(stage))return;
    const text=row(stage,state.records+1,state.contention);
    if(text.length>=512||state.bytes+text.length>16384){state.disabled=true;return;}
    if(fail||partial!==null){
      if(partial!==null)state.file+=text.slice(0,partial);
      state.disabled=true;return;
    }
    state.file+=text;state.bytes+=text.length;++state.records;
    if(limit)state.disabled=true;
  }
  const fresh=()=>({file:"",bytes:0,records:0,disabled:false,contention:false,handleOwned:true});
  let maximumFileBytes=0;
  const ordinary=names.filter(x=>x!=="trace-limit");
  const capCases=[ordinary.reduce((a,b)=>a.length>b.length?a:b),ordinary.reduce((a,b)=>a.length<b.length?a:b)];
  for(const stage of capCases) {
    const state=fresh();
    for(let n=0;n<1000;++n)modelWrite(state,stage);
    const records=state.file.trimEnd().split("\n").map(JSON.parse);
    check(state.disabled,"eventually stops "+stage);
    check(records.length<=64&&state.file.length<=16384,"hard byte/row limits "+stage);
    exact(records.at(-1).stage,"trace-limit","explicit successful cap row "+stage);
    check(state.handleOwned,"writer handle retained at cap "+stage);
    for(let n=0;n<records.length;++n)exact(records[n].sequence,n+1,"contiguous row "+stage);
    maximumFileBytes=Math.max(maximumFileBytes,state.file.length);
    const before=state.file;modelWrite(state,"configure-entry");exact(state.file,before,"no cap reopen "+stage);
  }
  const partial=fresh();
  modelWrite(partial,"configure-entry");
  const validPrefix=partial.file;
  modelWrite(partial,"observer-factory-before",{partial:17});
  check(partial.disabled&&partial.handleOwned,"partial write disables while retaining ownership");
  check(partial.file.startsWith(validPrefix)&&partial.file.length===validPrefix.length+17&&!partial.file.endsWith("\n"),"partial bytes retained exactly");
  const partialFile=partial.file;
  modelWrite(partial,"observer-factory-returned");exact(partial.file,partialFile,"no append after partial");
  const failed=fresh();modelWrite(failed,"configure-entry",{fail:true});
  check(failed.disabled&&failed.handleOwned&&failed.file==="","initial write failure remains absent, not fabricated success");
  const busy=fresh();modelWrite(busy,"configure-entry",{contention:true});modelWrite(busy,"observer-factory-before");
  exact(JSON.parse(busy.file).contentionObservedThroughRow,true,"recorded contention only once a later row is written");
  const beforeLateContention=busy.file;modelWrite(busy,"property-set-before",{contention:true});
  exact(busy.file,beforeLateContention,"later contention does not mutate old row");
  groups.push("Portable cap, partial-write, failed-write and contention semantics with retained writer ownership");

  const trace=helper.slice(helper.indexOf("inline void StartupTrace(StartupStage"),helper.indexOf("inline void BeginStartupTrace("));
  const begin=helper.slice(helper.indexOf("inline void BeginStartupTrace("),helper.indexOf("struct StartupWindowMessageScope"));
  for(const [label,part] of [["trace",trace],["begin",begin]]) {
    check(part.indexOf("StartupLastError preserve;")>=0,"last error guard "+label);
    check(part.indexOf("StartupLastError preserve;")<part.indexOf("TryAcquireSRWLockExclusive"),"guard precedes API "+label);
    check(part.includes("StartupUnlock unlock{&state.lock};"),"release before last-error restore "+label);
    check(part.includes("noexcept"),"noexcept diagnostic "+label);
  }
  check(helper.includes("~StartupLastError() noexcept { SetLastError(value); }"),"last error restore destructor");
  exact(count(helper,"AcquireSRWLockExclusive("),2,"only try acquisitions, no blocking acquisition");
  check(!/(?:WaitFor|Sleep\(|FlushFileBuffers|GetTempPath2|OpenProcess)/.test(helper),"no retry/wait/fallback/process reopen");
  check(!trace.includes("CloseHandle")&&!helper.slice(helper.indexOf("inline void StartupTraceLocked("),helper.indexOf("inline void StartupTrace(StartupStage")).includes("CloseHandle"),"caps/write failure keep handle ownership");
  check(begin.includes("state.attempted = true;"),"one initialization attempt");
  check(helper.includes("std::atomic<bool> firstWindowMessage{false};")&&helper.includes("firstWindowMessage.exchange(true"),"first callback only");
  const key=source.slice(source.indexOf("inline RN::IReactPropertyName HookKey()"),source.indexOf("struct Unavailable"));
  check(key.includes("auto key = RN::ReactPropertyBagHelper::GetName(")&&key.includes("return key;"),"owning by-value key result");
  groups.push("Source-level GetLastError, one-shot, nonblocking lock and secondary diagnostic ownership guards");
  return {
    status:"passed",scope:"Five portable source/format/model review designs only; no C++ compiler, Win32 IO, Windows process, native UI or concurrency execution.",
    groups,assertions,maximumRowBytes,maximumModeledFileBytes:maximumFileBytes,
    identities:{preimage:identity(preimage),candidate:identity(source)}
  };
};

})()
