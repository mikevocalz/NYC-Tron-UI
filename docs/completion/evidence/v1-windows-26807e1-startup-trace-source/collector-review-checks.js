// Portable review only. Evaluate this file, then pass exact source/preimage/manifest/protocol texts.
(function(){
const utf8=s=>{const out=[];for(const c of s){const n=c.codePointAt(0);if(n<128)out.push(n);else if(n<2048)out.push(192|(n>>6),128|(n&63));else if(n<65536)out.push(224|(n>>12),128|((n>>6)&63),128|(n&63));else out.push(240|(n>>18),128|((n>>12)&63),128|((n>>6)&63),128|(n&63));}return out;};
const git=function gitBlobSha(text) {
function utf8(value){const out=[];for(const ch of value){const c=ch.codePointAt(0);if(c<128)out.push(c);else if(c<2048)out.push(192|(c>>6),128|(c&63));else if(c<65536)out.push(224|(c>>12),128|((c>>6)&63),128|(c&63));else out.push(240|(c>>18),128|((c>>12)&63),128|((c>>6)&63),128|(c&63));}return out;}
const body=utf8(text), bytes=utf8("blob "+body.length+"\0").concat(body);
const len=bytes.length*8;bytes.push(128);while(bytes.length%64!==56)bytes.push(0);const high=Math.floor(len/4294967296),low=len>>>0;for(let n=3;n>=0;n--)bytes.push((high>>>(n*8))&255);for(let n=3;n>=0;n--)bytes.push((low>>>(n*8))&255);
let h0=0x67452301,h1=0xefcdab89,h2=0x98badcfe,h3=0x10325476,h4=0xc3d2e1f0;
const rol=(v,n)=>((v<<n)|(v>>>(32-n)))>>>0;
for(let o=0;o<bytes.length;o+=64){const w=new Uint32Array(80);for(let j=0;j<16;j++)w[j]=((bytes[o+j*4]<<24)|(bytes[o+j*4+1]<<16)|(bytes[o+j*4+2]<<8)|bytes[o+j*4+3])>>>0;for(let j=16;j<80;j++)w[j]=rol(w[j-3]^w[j-8]^w[j-14]^w[j-16],1);let a=h0,b=h1,c=h2,d=h3,e=h4;for(let j=0;j<80;j++){let f,k;if(j<20){f=(b&c)|((~b)&d);k=0x5a827999;}else if(j<40){f=b^c^d;k=0x6ed9eba1;}else if(j<60){f=(b&c)|(b&d)|(c&d);k=0x8f1bbcdc;}else{f=b^c^d;k=0xca62c1d6;}const temp=(rol(a,5)+f+e+k+w[j])>>>0;e=d;d=c;c=rol(b,30);b=a;a=temp;}h0=(h0+a)>>>0;h1=(h1+b)>>>0;h2=(h2+c)>>>0;h3=(h3+d)>>>0;h4=(h4+e)>>>0;}
return [h0,h1,h2,h3,h4].map(v=>v.toString(16).padStart(8,"0")).join("");
};
const sha=function sha256Bytes(input) {
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
};

return function reviewStartupCollector({source,preimage,manifest,protocol}) {
  const m=typeof manifest==="string"?JSON.parse(manifest):manifest;
  const p=typeof protocol==="string"?JSON.parse(protocol):protocol;
  let assertions=0;const groups=[];
  const check=(ok,label)=>{++assertions;if(!ok)throw Error(label);};
  const eq=(a,b,label)=>check(a===b,label);
  const same=(a,b,label)=>eq(JSON.stringify(a),JSON.stringify(b),label);
  const count=(s,t)=>s.split(t).length-1;
  const identity=s=>({gitBlob:git(s),utf8Bytes:utf8(s).length,sha256:sha(utf8(s)).sha256});
  const assertIdentity=(s,i,label)=>{const actual=identity(s);for(const key of ["gitBlob","utf8Bytes","sha256"])eq(actual[key],i[key],label+"."+key);};
  assertIdentity(source,m.candidate,"candidate");assertIdentity(preimage,m.preimage,"preimage");
  eq(m.candidate.gitBlob,"51a86756bfb8305c7ada28f77fa952fe772afcb7","frozen source");
  eq(m.preimage.gitBlob,"aa54819df02c2decfba2fb19e3b4d2a5aaabd554","frozen parent");
  eq(m.edits.length,6,"six scoped edits");
  let forward=preimage;for(const e of m.edits){eq(count(forward,e.before),1,"unique before "+e.id);forward=forward.replace(e.before,()=>e.after);}eq(forward,source,"exact full forward");
  let inverse=source;for(const e of m.edits.slice().reverse()){eq(count(inverse,e.after),1,"unique after "+e.id);inverse=inverse.replace(e.after,()=>e.before);}eq(inverse,preimage,"exact full inverse");
  const csharp=source.slice(source.indexOf("public static class NativeStartupTrace {"),source.indexOf('\n"@\nNew-Item'));
  const powershell=source.slice(source.indexOf("# Failure-only observation."),source.indexOf("$started = Get-Date\n$process = $null"));
  const stages=[...csharp.slice(csharp.indexOf("static readonly string[] Stages"),csharp.indexOf("public sealed class Snapshot")).matchAll(/"([a-z-]+)"/g)].map(x=>x[1]);
  same(stages,p.stages,"exact native stage vocabulary");eq(new Set(stages).size,49,"49 distinct stages");
  check(!csharp.includes("HashSet<"),"no System.Core HashSet dependency");
  check(csharp.includes("Array.IndexOf(Stages, stage) < 0"),"closed exact stage membership");
  const prefix=preimage.slice(0,preimage.indexOf('\n"@\nNew-Item'));
  check(source.startsWith(prefix),"original NativeWindow C# unchanged");
  const forbidden=[/OpenProcess\s*\(/,/Process\.GetProcessById/,/Process\.Start/,/Stop-Process/,/Start-Process/,/Get-Process/,/SendInput/,/SetForegroundWindow/,/WaitForExit/];
  for(const pattern of forbidden)check(!pattern.test(csharp+powershell),"no new action "+pattern);
  eq(count(source,"$ownedProcessHandle = $process.Handle"),1,"one original handle access captured");
  eq(count(preimage,"$null = $process.Handle"),1,"one original handle accessor");
  check(source.indexOf("$ownedProcessHandle = $process.Handle") < source.indexOf("$ownedProcessStartTime = $process.StartTime"),"same handle/start order");
  check(source.includes("$primaryFailure = $_\n  $startupTraceFailureObserved = $true\n"),"flag after preserved original error");
  eq(count(source,"throw $primaryFailure"),count(preimage,"throw $primaryFailure"),"original rethrow unchanged");
  check(source.lastIndexOf("Save-NativeStartupTrace $ownedProcessHandle") > source.lastIndexOf('Save-CrashDumpReceipt $crashCapture $OutDir $ownedProcessId'),"collector after all original cleanup");
  const required=[
    "WaitForSingleObject(process, 0)","GetProcessId(process)","fileTime != (ulong)start.ToFileTimeUtc()",
    "GetTempPathW(MaxPath + 1, directory)","CreateFileW(path, 0x80000000, 1, IntPtr.Zero, 3, 0x00200080, IntPtr.Zero)",
    "GetFinalPathNameByHandleW(file, resolved, MaxPath + 5, 0)","!Same(before, after)",
    "System.IO.FileMode.CreateNew","stream.Flush(true)","result.sha256 = Hash(data)",
    "records.Count >= RecordLimit - 1"
  ];
  for(const text of required)check(csharp.includes(text),"actual source guard "+text);
  check(csharp.includes("values.ContainsKey(key)")&&csharp.includes("Array.IndexOf(Keys, key) < 0"),"duplicate/unknown keys fail");
  check(powershell.indexOf("SaveExclusive((Join-Path $OutDir \"native-startup-trace.jsonl\")") < powershell.indexOf("[NativeStartupTrace]::Parse("),"raw retention precedes projection");
  check(powershell.includes("GetByteCount($output + [Environment]::NewLine) -gt 8192"),"complete output cap");
  check(powershell.includes('try { Write-Host "Native startup trace observation unavailable." } catch {}'),"report errors secondary");
  groups.push("Exact source identities, six inverses, protected actions/error/cleanup order and fixed API/vocabulary contracts");

  const max64=18446744073709551615n, revision="a".repeat(40), pid=1860;
  const start="2026-11-11T13:46:00.1234567Z";
  function creationFromStart(text) {
    const x=/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})\.(\d{7})Z$/.exec(text||"");
    if(!x)return null;const iso=x[1]+"."+x[2].slice(0,3)+"Z",ms=Date.parse(iso);
    if(!Number.isFinite(ms)||new Date(ms).toISOString()!==iso)return null;
    const value=BigInt(ms)*10000n+116444736000000000n+BigInt(x[2].slice(3));
    return value>0n&&value<=max64?value.toString():null;
  }
  const creation=creationFromStart(start);
  function identityGate(o) {
    if(!o.handle||!Number.isInteger(o.pid)||o.pid<1||o.pid>4294967295||!/^[0-9a-f]{40}$/.test(o.revision||""))return "identity-input-unavailable";
    const expected=creationFromStart(o.start);if(!expected)return "start-time-unavailable";
    if(o.currentPid===null)return "process-id-query-failed";
    if(o.currentPid!==o.pid)return "process-identity-mismatch";
    if(o.currentCreation===null)return "process-time-query-failed";
    if(typeof o.currentCreation!=="string"||o.currentCreation!==expected)return "process-identity-mismatch";
    if(o.exit===false)return "process-not-exited";
    if(o.exit!==true)return "process-exit-unconfirmed";
    return "identity-confirmed";
  }
  const owner={handle:1,pid,revision,start,currentPid:pid,currentCreation:creation,exit:true};
  eq(identityGate(owner),"identity-confirmed","exact owned handle identity");
  eq(BigInt(creation)%10000n,4567n,"seven-digit 100ns precision retained");
  const identityCases=[
    [{handle:0},"identity-input-unavailable"],[{pid:0},"identity-input-unavailable"],[{revision:"A".repeat(40)},"identity-input-unavailable"],
    [{currentPid:null},"process-id-query-failed"],[{currentPid:pid+1},"process-identity-mismatch"],
    [{currentCreation:null},"process-time-query-failed"],[{currentCreation:(BigInt(creation)+1n).toString()},"process-identity-mismatch"],
    [{currentCreation:Number(creation)},"process-identity-mismatch"],[{start:"2026-02-31T00:00:00.0000000Z"},"start-time-unavailable"],
    [{exit:false},"process-not-exited"],[{exit:null},"process-exit-unconfirmed"]
  ];
  for(const [change,status]of identityCases)eq(identityGate({...owner,...change}),status,"identity "+status);
  function fixedPath(directory,o) {
    if(identityGate(o)!=="identity-confirmed"||typeof directory!=="string"||!directory.endsWith("\\")||! /^[A-Za-z]:\\/.test(directory))return null;
    const path=directory+"nyctron-startup-"+o.revision+"-"+o.pid+"-"+o.currentCreation+".jsonl";
    return path.length<260?path:null;
  }
  const path=fixedPath("C:\\Temp\\",owner);
  eq(path,"C:\\Temp\\nyctron-startup-"+revision+"-"+pid+"-"+creation+".jsonl","single exact path");
  eq(fixedPath("C:\\"+"x".repeat(250)+"\\",owner),null,"overlong path unavailable");
  eq(fixedPath("C:\\Temp\\",{...owner,currentCreation:"0"+creation}),null,"noncanonical creation cannot select file");
  groups.push("Portable owned-handle identity and fixed-path contract, exact FILETIME strings and unknown exit states");

  const keys=["schemaVersion","sourceRevision","processId","creationFileTime","sequence","threadId","stage","contentionObservedThroughRow"];
  const stageSet=new Set(stages);
  const row=(sequence=1,extra={})=>({schemaVersion:1,sourceRevision:revision,processId:pid,creationFileTime:creation,sequence,threadId:456,stage:"configure-entry",contentionObservedThroughRow:false,...extra});
  const line=r=>JSON.stringify(r)+"\n";
  function parseRowModel(text) {
    if(!text.startsWith("{")||!text.endsWith("}"))return{status:"malformed-record"};
    const values=new Map();let at=1;
    const pair=/[ \t]*"([A-Za-z][A-Za-z0-9]*)"[ \t]*:[ \t]*(?:"([A-Za-z0-9-]*)"|(0|[1-9][0-9]*)|(true|false))[ \t]*/y;
    while(at<text.length-1) {
      pair.lastIndex=at;const x=pair.exec(text);
      if(!x||x.index!==at||!keys.includes(x[1])||values.has(x[1]))return{status:"malformed-record"};
      values.set(x[1],x[2]!==undefined?{type:"s",value:x[2]}:x[3]!==undefined?{type:"n",value:x[3]}:{type:"b",value:x[4]});
      at=pair.lastIndex;if(at===text.length-1)break;
      if(text[at]!==","||++at===text.length-1)return{status:"malformed-record"};
    }
    if(at!==text.length-1||values.size!==8)return{status:"malformed-record"};
    const number=k=>{const t=values.get(k);if(t?.type!=="n")return null;const n=BigInt(t.value);return n<=4294967295n?Number(n):null;};
    const str=k=>values.get(k)?.type==="s"?values.get(k).value:null;
    const schema=number("schemaVersion"),process=number("processId"),seq=number("sequence"),thread=number("threadId");
    if(schema!==1||process===null||process===0||seq===null||seq<1||seq>64||thread===null||thread===0)return{status:"malformed-record"};
    const rev=str("sourceRevision"),created=str("creationFileTime"),stage=str("stage");
    if(!/^[0-9a-f]{40}$/.test(rev||"")||! /^[1-9][0-9]*$/.test(created||"")||BigInt(created)>max64)return{status:"malformed-record"};
    if(rev!==revision||process!==pid||created!==creation)return{status:"record-identity-mismatch"};
    if(!stageSet.has(stage)||values.get("contentionObservedThroughRow")?.type!=="b")return{status:"malformed-record"};
    return{status:"row",row:{sequence:seq,threadId:thread,stage,contentionObservedThroughRow:values.get("contentionObservedThroughRow").value==="true"}};
  }
  function parseModel(data) {
    const out={status:"unavailable",recordStreamComplete:null,verifiedCompleteRows:null,partialTailBytes:null,rows:[]};
    const fail=status=>({...out,status});
    if(!Array.isArray(data)||data.length>16384)return fail("byte-limit");
    if(data.some(x=>x>127))return fail("non-ascii-record");
    const records=[];let begin=0;
    for(let at=0;at<data.length;at++)if(data[at]===10){
      if(at-begin+1>512)return fail("record-size-limit");
      if(records.length>=64)return fail("record-limit");
      if(records.at(-1)?.stage==="trace-limit")return fail("terminal-record-followed");
      const parsed=parseRowModel(String.fromCharCode(...data.slice(begin,at)));
      if(parsed.status!=="row")return fail(parsed.status);
      if(parsed.row.sequence!==records.length+1)return fail("sequence-mismatch");
      if(records.length>=63&&parsed.row.stage!=="trace-limit")return fail("ordinary-record-limit");
      records.push(parsed.row);begin=at+1;
    }
    const tail=data.length-begin;if(tail>=512)return fail("record-size-limit");
    if(tail&&records.at(-1)?.stage==="trace-limit")return fail("terminal-record-followed");
    return{status:tail?"partial-tail":data.length?"validated-records":"empty-file",recordStreamComplete:data.length?tail===0:null,verifiedCompleteRows:records.length,partialTailBytes:tail,rows:records};
  }
  const good=utf8(line(row()));const parsed=parseModel(good);
  eq(parsed.status,"validated-records","valid row");
  eq(parsed.rows[0].contentionObservedThroughRow,false,"actual false retained");
  eq(parseModel([]).status,"empty-file","empty not successful startup");eq(parseModel([]).recordStreamComplete,null,"empty completeness unknown");
  const partial=parseModel(utf8(line(row())+'{"private":"/Users/secret-token"'));
  eq(partial.status,"partial-tail","partial tail explicit");eq(partial.verifiedCompleteRows,1,"validated prefix retained");eq(partial.recordStreamComplete,false,"prefix not complete");
  check(!JSON.stringify(partial).includes("secret-token"),"partial arbitrary text not projected");
  const negatives=[
    line(row(2)), line({...row(),processId:pid+1}), line({...row(),sourceRevision:"b".repeat(40)}),
    line({...row(),creationFileTime:(BigInt(creation)+1n).toString()}),line({...row(),creationFileTime:Number(creation)}),
    line({...row(),creationFileTime:"0"+creation}),line({...row(),schemaVersion:"1"}),line({...row(),processId:0}),
    line({...row(),threadId:4294967296}),line({...row(),sequence:0}),line({...row(),contentionObservedThroughRow:"false"}),
    line({...row(),stage:"unknown-secret"}),line({...row(),stage:"Configure-entry"}),line({...row(),password:"secret-token"}),
    line(row()).replace(',"threadId":456',',"threadId":456,"threadId":456'),
    line(row()).replace('"processId":1860','"processId":01860'),line(row()).replace('"processId":1860','"processId":1.86e3'),
    line(row()).replace('}\n',',}\n'),line(row()).replace('}\n','}\r\n'),line(row()).replace('"stage":"configure-entry"','"stage":"configure\\u002dentry"'),
    String.fromCharCode(0xfeff)+line(row())
  ];
  for(const text of negatives){const result=parseModel(utf8(text));check(result.status!=="validated-records"&&result.rows.length===0,"malformed/foreign suppresses all rows");}
  const goodThenBad=parseModel(utf8(line(row())+line(row(2,{password:"private"}))));eq(goodThenBad.rows.length,0,"malformed complete suffix suppresses prefix");
  eq(parseModel(utf8("x".repeat(512))).status,"record-size-limit","partial row size bound");
  eq(parseModel(new Array(16385).fill(0)).status,"byte-limit","source byte cap");
  const maxRows=Array.from({length:64},(_,i)=>line(row(i+1,{stage:i===63?"trace-limit":"property-set-returned",threadId:4294967295}))).join("");
  const maxParsed=parseModel(utf8(maxRows));eq(maxParsed.verifiedCompleteRows,64,"63 ordinary plus terminal");eq(maxParsed.rows.at(-1).stage,"trace-limit","terminal stage");
  eq(parseModel(utf8(maxRows+line(row(64)))).status,"record-limit","65th record rejected");
  eq(parseModel(utf8(line(row(1,{stage:"trace-limit"}))+line(row(2)))).status,"terminal-record-followed","no rows after terminal");
  const ordinary64=Array.from({length:64},(_,i)=>line(row(i+1))).join("");eq(parseModel(utf8(ordinary64)).status,"ordinary-record-limit","64th ordinary rejected");
  groups.push("Portable strict ASCII JSONL model: canonical identity, exact types/keys, malformed suppression, partial tails and record limits");

  function readModel(o={}) {
    const calls=[],record={status:"unavailable",identityMatched:null,processExited:null,fileExists:null,stable:null,sourceBytes:null,bytes:null,sha256:null};
    const finish=()=>({record,calls});const own={...owner,...o.owner};
    calls.push("identity");const gate=identityGate(own);if(gate!=="identity-confirmed"){record.status=gate;return finish();}
    record.identityMatched=true;record.processExited=true;
    calls.push("resolve-fixed-path");if(o.pathInvalid){record.status="temp-path-unavailable";return finish();}
    calls.push("open-source");if(o.missing){record.status="source-missing";record.fileExists=false;return finish();}
    if(o.openFailed){record.status="source-open-failed";return finish();}
    record.fileExists=true;
    const data=o.data||good;
    if(o.kindInvalid){calls.push("close-source");record.status="source-kind-unavailable";return finish();}
    if(o.pathMismatch){calls.push("close-source");record.status="source-path-mismatch";return finish();}
    if(data.length>16384){calls.push("close-source");record.status="source-oversize";return finish();}
    record.sourceBytes=data.length;calls.push("read-source");
    if(o.shortRead){calls.push("close-source");record.status="source-short-read";return finish();}
    if(o.changed){calls.push("close-source");record.status="source-changed";record.stable=false;return finish();}
    calls.push("close-source");if(o.closeFailed){record.status="source-read-failed";return finish();}
    calls.push("hash-snapshot");record.bytes=data.slice();record.sha256=sha(data).sha256;record.stable=true;record.status="snapshot-read";return finish();
  }
  const read=readModel();eq(read.record.status,"snapshot-read","stable full read");check(read.calls.indexOf("close-source")<read.calls.indexOf("hash-snapshot"),"close precedes full hash");
  for(const key of ["missing","openFailed","kindInvalid","pathMismatch","shortRead","changed","closeFailed"]){
    const result=readModel({[key]:true});eq(result.record.bytes,null,"no promoted bytes "+key);eq(result.record.sha256,null,"no full hash "+key);
  }
  eq(readModel({data:new Array(16384).fill(32)}).record.status,"snapshot-read","exact 16KiB read bound");
  eq(readModel({data:new Array(16385).fill(32)}).record.status,"source-oversize","cap-plus-one rejected");
  const live=readModel({owner:{exit:false}});same(live.calls,["identity"],"no file access before confirmed exit");
  function archiveModel(snapshot,o={}) {
    const calls=[],result={retained:false,bytes:null,sha256:null,parsed:null};
    if(snapshot.status!=="snapshot-read")return{calls,result};
    calls.push("create-new-raw");if(o.exists||o.writeFailed||o.readbackFailed||o.closeFailed)return{calls,result};
    calls.push("raw-write-flush-readback-close");result.retained=true;result.bytes=snapshot.sourceBytes;result.sha256=snapshot.sha256;
    calls.push("parse-retained-raw");result.parsed=parseModel(snapshot.bytes);return{calls,result};
  }
  for(const key of ["exists","writeFailed","readbackFailed","closeFailed"]){const saved=archiveModel(read.record,{[key]:true});eq(saved.result.retained,false,"retention failure "+key);eq(saved.result.parsed,null,"no projection before retention "+key);}
  const retained=archiveModel(read.record);check(retained.calls.indexOf("raw-write-flush-readback-close")<retained.calls.indexOf("parse-retained-raw"),"raw saved before parse");
  const partialRead=readModel({data:utf8(line(row())+'{"secret":')});const partialSaved=archiveModel(partialRead.record);
  eq(partialSaved.result.sha256,sha(partialRead.record.bytes).sha256,"hash covers partial final bytes");eq(partialSaved.result.parsed.status,"partial-tail","partial file retained honestly");
  groups.push("Deterministic stable-read/close/hash and exclusive-retention models, unavailable ownership and IO failures");

  function summaryModel(parsed=parsedDefault,raw=read.record,retained=true) {
    const rows=parsed.rows,selected=rows.filter((_,i)=>i<8||i>=Math.max(8,rows.length-16)).map(r=>({sequence:r.sequence,threadId:r.threadId,stage:r.stage,contentionObservedThroughRow:r.contentionObservedThroughRow}));
    return{
      schemaVersion:1,scope:"derived-startup-trace-subset",sourceRevision:revision,processId:pid,creationFileTime:creation,
      observation:{status:raw.status,identityMatched:raw.identityMatched,processExited:raw.processExited,fileExists:raw.fileExists,stableRead:raw.stable,win32Error:null},
      original:{name:"native-startup-trace.jsonl",retained,bytes:retained?raw.sourceBytes:null,sha256:retained?raw.sha256:null},
      records:{status:parsed.status,recordStreamComplete:parsed.recordStreamComplete,verifiedCompleteRows:parsed.verifiedCompleteRows,partialTailBytes:parsed.partialTailBytes,selectedRows:selected.length,omittedRows:parsed.verifiedCompleteRows===null?null:parsed.verifiedCompleteRows-selected.length,items:selected},
      limits:{sourceBytes:16384,records:64,rowBytes:512,selectedRows:24,outputBytes:8192},
      interpretation:{selection:"first-8-and-last-16-validated-complete-rows",originalScope:"closed-stable-read-time-file-snapshot",prefixOnlyWhenPartialTail:true,noFinalizedFooter:true,missingFileDoesNotProveConfigureAbsent:true,parentAndChildTempPathsMayDiffer:true,contentionIsKnownOnlyThroughEachRow:true,missingReturnedMarkerDoesNotProveCallDidNotReturn:true,tracingMayPerturbStartup:true,noCausalAttribution:true}
    };
  }
  const parsedDefault=parsed;
  const begin="NYC_TRON_WINDOWS_STARTUP_TRACE_BEGIN",end="NYC_TRON_WINDOWS_STARTUP_TRACE_END",nl="\r\n";
  function reportModel(summary,options={}) {
    let body=JSON.stringify({schemaVersion:1,summaryRetained:!options.summaryFailed,summaryName:"native-startup-trace-summary.json",projection:summary});
    let text=begin+nl+body+nl+end+nl;let fallback=false;
    if(utf8(text).length>8192){fallback=true;body='{"schemaVersion":1,"scope":"derived-startup-trace-subset","status":"output-limit","outputByteLimit":8192}';text=begin+nl+body+nl+end+nl;}
    if(options.consoleThrows)return{status:"secondary-console-error",bytes:utf8(text).length,fallback};
    return{status:"reported",bytes:utf8(text).length,fallback,text,body:JSON.parse(body)};
  }
  const normal=reportModel(summaryModel());
  check(normal.bytes<8192&&!normal.fallback,"ordinary complete envelope fits");
  const maxSnapshot=readModel({data:utf8(maxRows)}).record;
  const maximum=reportModel(summaryModel(maxParsed,maxSnapshot));
  eq(maximum.body.projection.records.selectedRows,24,"first8/last16 cap");eq(maximum.body.projection.records.omittedRows,40,"honest omissions");
  same(maximum.body.projection.records.items.map(r=>r.sequence),[1,2,3,4,5,6,7,8,...Array.from({length:16},(_,i)=>49+i)],"unique deterministic row indices");
  check(maximum.bytes<8192&&!maximum.fallback,"64-record input projection fits");
  check(!maximum.text.includes("C:\\")&&!maximum.text.includes("private"),"no source paths or arbitrary content");
  const extra={...summaryModel(),onlyForOverflowBranch:"x".repeat(9000)};const fallback=reportModel(extra);
  check(fallback.fallback&&fallback.bytes<=8192,"complete overflow fallback cap");eq(fallback.body.outputByteLimit,8192,"fallback declares limit");
  const partialReport=reportModel(summaryModel(partialSaved.result.parsed,partialRead.record));
  check(!partialReport.text.includes('"secret"')&&partialReport.body.projection.records.recordStreamComplete===false,"partial secret omitted, incompleteness retained");
  eq(reportModel(summaryModel(),{summaryFailed:true}).body.summaryRetained,false,"summary failure typed false");
  eq(reportModel(summaryModel(),{consoleThrows:true}).status,"secondary-console-error","console failure secondary");
  groups.push("Portable typed projection, deterministic omissions, raw-byte binding and complete CRLF envelope limits");

  function lifecycleModel({fails=true,collectorThrows=false,consoleThrows=false,cleanupThrows=false}={}) {
    const error=new Error("original"),calls=["existing-launch","existing-handle-access","existing-start-time"];let flag=false,caught=null;
    try{calls.push("existing-native-actions");if(fails)throw error;calls.push("existing-passed-report");}
    catch(e){caught=e;calls.push("primary-assignment");flag=true;calls.push("existing-failure-report");}
    finally{
      for(const stage of ["existing-stop","existing-drag-retention","existing-restore","existing-crash-receipt"]){try{calls.push(stage);if(cleanupThrows)throw Error("secondary");}catch{}}
      if(flag){try{calls.push("collector");if(collectorThrows)throw Error("collector");if(consoleThrows)throw Error("console");}catch{calls.push("secondary-isolated");}}
    }
    return{error,caught,calls};
  }
  for(const options of [{},{collectorThrows:true},{consoleThrows:true},{cleanupThrows:true},{collectorThrows:true,cleanupThrows:true}]){
    const result=lifecycleModel(options);eq(result.caught,result.error,"original error identity preserved");
    eq(count(result.calls.join("|"),"existing-handle-access"),1,"one original handle query");
    check(result.calls.indexOf("collector")>result.calls.indexOf("existing-crash-receipt"),"collector stays last");
    check(!result.calls.includes("existing-passed-report"),"failure not promoted to pass");
  }
  const success=lifecycleModel({fails:false});eq(success.caught,null,"success unchanged");check(!success.calls.includes("collector"),"no success-side collection");
  groups.push("Explicit non-PowerShell lifecycle model: failure-only placement, original Error identity and cleanup isolation");
  return{status:"passed",scope:"Six source/portable contract/model designs only; no PowerShell parser, C# compiler, .NET/Win32 IO, process, UIA or native execution.",groups,assertions,metrics:{ordinaryEnvelopeBytes:normal.bytes,sixtyFourRecordEnvelopeBytes:maximum.bytes,fallbackEnvelopeBytes:fallback.bytes,maximumRows:64,selectedRows:24,omittedRows:40},identities:{source:identity(source),preimage:identity(preimage)}};
};

})()
