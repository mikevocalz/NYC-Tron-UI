// Source-review checks for the AppKit startup failure reporter.
// Runs only in a JavaScript/V8 evaluator with in-memory filesystem and console adapters.
// No Node filesystem, sockets, AppKit, OS input, workflow dispatch or native acceptance is executed.
// Call reviewStartupReporter(candidateSource, {app, commands, process}) with the exact Git-blob strings named below.


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

function createStartupHarness(block, initial, options, sha256Bytes) {
  options = options || {};
  const encode = text => { const out=[]; for(const c of String(text)){const x=c.codePointAt(0);if(x<128)out.push(x);else if(x<2048)out.push(192|(x>>6),128|(x&63));else if(x<65536)out.push(224|(x>>12),128|((x>>6)&63),128|(x&63));else out.push(240|(x>>18),128|((x>>12)&63),128|((x>>6)&63),128|(x&63));}return out; };
  class MockBuffer extends Uint8Array {
    static alloc(size) { return new MockBuffer(size); }
    static from(value) { return new MockBuffer(typeof value === 'string' ? encode(value) : value); }
    static byteLength(value) { return encode(value).length; }
    toString() { return decodeURIComponent(Array.from(this, x => '%'+x.toString(16).padStart(2,'0')).join('')); }
  }
  const files=new Map(), handles=new Map(), reads=[], writes=[], logs=[];
  let nextInode=1, nextHandle=1, grew=false, grewOther=false;
  const put=(name,data)=>files.set('/owned/'+name,{data:MockBuffer.from(data),dev:1,ino:nextInode++,mtimeMs:1,ctimeMs:1,regular:true});
  for(const [name,data] of Object.entries(initial||{})) put(name,data);
  const failing=(stage,path)=>options.failStage===stage && (!options.failFile || path.endsWith('/'+options.failFile));
  const stat=file=>({dev:file.dev,ino:file.ino,size:file.data.length,mtimeMs:file.mtimeMs,ctimeMs:file.ctimeMs,isFile:()=>file.regular});
  const fs={
    lstatSync(path) { if(failing('stat',path))throw new Error('SECRET stat failure');const f=files.get(path);if(!f)throw new Error('SECRET missing path');return stat(f); },
    openSync(path,flags) { if(flags!=='r')throw new Error('unexpected open');if(failing('open',path))throw new Error('SECRET open failure');const file=files.get(path);if(!file)throw new Error('SECRET absent');const fd=nextHandle++;handles.set(fd,{file,path});return fd; },
    fstatSync(fd) { const h=handles.get(fd);if(!h)throw new Error('bad handle');if(failing('fstat',h.path))throw new Error('SECRET fstat failure');return stat(h.file); },
    readSync(fd,buffer,offset,count,position) {
      const h=handles.get(fd);if(!h)throw new Error('bad handle');if(failing('read',h.path))throw new Error('SECRET read failure');
      const length=Math.max(0,Math.min(count,h.file.data.length-position));
      buffer.set(h.file.data.subarray(position,position+length),offset);reads.push({path:h.path,position,requested:count,bytes:length});
      if(options.growApp && !grew && h.path==='/owned/app.log') {grew=true;h.file.data=MockBuffer.from([...h.file.data,...MockBuffer.from(options.growApp)]);h.file.mtimeMs++;h.file.ctimeMs++;}
      if(options.replaceApp && !grew && h.path==='/owned/app.log') {grew=true;put('app.log','replacement\n');}
      if(options.growFile && !grewOther && h.path==='/owned/'+options.growFile) {grewOther=true;h.file.data=MockBuffer.from([...h.file.data,...MockBuffer.from(options.growText||'\n')]);h.file.mtimeMs++;h.file.ctimeMs++;}
      return length;
    },
    closeSync(fd) { const h=handles.get(fd);if(!h)throw new Error('bad handle');handles.delete(fd);if(failing('close',h.path))throw new Error('SECRET close failure'); },
    writeFileSync(path,data,flags) {
      if(flags?.flag!=='wx')throw new Error('snapshot must use wx');
      if(files.has(path)||failing('write',path))throw new Error('SECRET collision/write failure');
      put(path.slice('/owned/'.length),data);writes.push({path,bytes:data.length});
    },
  };
  const context={...fs,Buffer:MockBuffer,output:'/owned',join:(...parts)=>parts.join('/'),hash:bytes=>sha256Bytes(bytes).sha256,
    revision:'a'.repeat(40),child:{pid:Object.hasOwn(options,'pid')?options.pid:123},
    console:{info:value=>{if(options.consoleFailure)throw new Error('SECRET console failure');logs.push(String(value));}}};
  const factory=new Function('context','const { Buffer, output, join, hash, child, revision, console, lstatSync, openSync, fstatSync, readSync, closeSync, writeFileSync } = context;\n'+block+'\nreturn { startupProject, startupStream, startupProcess, readStartupInput, reportStartupFailure };');
  const api=factory(context);
  return {api,files,handles,reads,writes,logs,Buffer:MockBuffer,context,
    report(){api.reportStartupFailure();if(!logs.length)return null;const lines=logs.at(-1).split('\n');if(lines.length!==3||lines[0]!=='NYCTRON_STARTUP_EVIDENCE_BEGIN'||lines[2]!=='NYCTRON_STARTUP_EVIDENCE_END')throw new Error('Invalid envelope');return JSON.parse(lines[1]);}};
}

function runStartupChecks(block, createHarness, hashBytes, fixture, history) {
  const checks=[];
  const assert=(ok,message)=>{if(!ok)throw new Error(message);};
  const group=(name,run)=>{try{const details=run();checks.push({name,status:'passed',...(details||{})});}catch(e){checks.push({name,status:'failed',error:String(e.message)});}};
  const h=(files=fixture,options={})=>createHarness(block,files,options,hashBytes);
  const header=(type,value,pid=123)=>'2026-11-11 01:02:03.004 PRIVATE-APP['+pid+':900] '+type+' '+JSON.stringify(value)+'\n';
  group('strict typed selectors and fixed vocabulary',()=>{
    const a=h().api;
    const r=a.startupProject('activation',{phase:'policy-returned',operation:7,at:12,mainThread:false,details:{accepted:false,state:{policy:0,visible:false,key:0,applicationActive:'false',miniaturized:null,canBecomeKey:true}}});
    assert(r.mainThread===false&&r.details.accepted===false&&r.state.visible===false&&r.state.key===null&&r.state.applicationActive===null&&r.state.canBecomeKey===true,'Unknown and observed false collapsed');
    assert(a.startupProject('activation',{phase:'PRIVATE'})===null&&a.startupProject('activation',[])===null,'Unrecognized phase accepted');
    const c=a.startupProject('commands',{phase:'request-failed',at:'PRIVATE',request:{id:9007199254740992,command:'PRIVATE',token:'SECRET'},error:'SECRET'});
    assert(c.requestId===null&&c.command===null&&c.at===null&&!JSON.stringify(c).includes('SECRET'),'Unsafe IDs or free text escaped');
  });
  group('canonical ISO validators reject normalized invalid calendar dates',()=>{
    const a=h().api,valid='2024-02-29T12:34:56.789Z';
    for(const at of ['2026-02-31T00:00:00.000Z','2026-02-29T00:00:00.000Z','2026-01-01T24:00:00.000Z','2026-13-01T00:00:00.000Z']) {
      assert(a.startupProject('commands',{phase:'socket-connecting',at}).at===null,'Invalid command date normalized');
      const p=a.startupProcess({processId:123,observedAt:at,beforeSample:{observedAt:at},afterSample:{observedAt:at},sample:{observedAt:at}},123);
      assert(p.observedAt===null&&p.beforeSample.observedAt===null&&p.afterSample.observedAt===null&&p.sample.observedAt===null,'Invalid process date normalized');
    }
    assert(a.startupProject('commands',{phase:'socket-connecting',at:valid}).at===valid&&a.startupProcess({processId:123,observedAt:valid},123).observedAt===valid,'Valid leap-day ISO rejected');
  });
  group('nested activation state and transport classifications',()=>{
    const a=h().api;
    const p=a.startupProject('activation',{phase:'workspace-completion-received',operation:1,mainThread:false,details:{hasApplication:true,hasError:false}});
    assert(p.details.hasApplication===true&&p.details.hasError===false&&p.state.visible===null,'Callback observation invented state');
    const t=a.startupProject('transport',{phase:'serialization-failed',sequence:2,command:'tron.window',details:{validJSONObject:false,hasError:true,errorCode:-1,threwException:true,fieldIssues:[{path:'SECRET'}]}});
    assert(t.details.validJSONObject===false&&t.details.errorCode===-1&&!JSON.stringify(t).includes('SECRET'),'Transport fields leaked or coerced');
  });
  group('owned NSLog PID and complete line parsing',()=>{
    const x=h(),a=x.api;
    const good={phase:'policy-entered',operation:1,mainThread:true,details:{}};
    const text=header('NYCTronActivation',good,999)+header('NYCTronActivation',good)+header('NYCTronActivation',{phase:'PRIVATE'})+'2026-11-11 01:02:03.004 PRIVATE[123:900] NYCTronActivation {bad}\n'+header('NYCTronActivation',good).trimEnd();
    const s=a.startupStream('activation',x.Buffer.from(text),123,true);
    assert(s.pidMismatchRecords===1&&s.matchedRecords===1&&s.unsupportedRecords===1&&s.malformedRecords===1&&s.partialTrailingLine,'Header/PID/partial validation failed');
    const none=a.startupStream('activation',x.Buffer.from(header('NYCTronActivation',good)),null,true);
    assert(none.matchedRecords===0&&none.pidMismatchRecords===1,'Unowned process accepted a trace');
  });
  group('process projection PID, unknown status and sampler digest scope',()=>{
    const a=h().api;
    const p=a.startupProcess({processId:123,exitCode:null,signalCode:null,sample:{hasThreadStacks:false,threadGroups:0,sha256:'invalid',stdout:'SECRET'}},123);
    assert(p.exitCode===null&&p.exitCodeAvailable&&p.sample.hasThreadStacks===false&&p.sample.threadGroups===0&&p.sample.sha256===null&&!JSON.stringify(p).includes('SECRET'),'Process projection lost types/privacy');
    const unknown=a.startupProcess({processId:123},123);
    assert(unknown.exitCode===null&&!unknown.exitCodeAvailable&&unknown.sample===null,'Missing process fields became observed results');
    assert(a.startupProcess({processId:124,sample:{hasThreadStacks:true}},123).status==='pid-mismatch','Foreign process data accepted');
  });
  group('exact original digests, retained snapshot and no secret console content',()=>{
    const x=h(),r=x.report(),app=x.files.get('/owned/startup-app-log-snapshot.log').data;
    assert(app.toString()===fixture['app.log']&&x.files.get('/owned/app.log').data.toString()===fixture['app.log'],'Snapshot/original bytes changed');
    assert(r.inputs.appLog.snapshot.sha256===hashBytes(app).sha256&&r.inputs.appLog.originalSha256===null&&r.inputs.appLog.sourceLive&&r.inputs.appLog.laterAppendsPossible,'Live snapshot claimed final app hash');
    for(const [key,name] of [['commands','commands.jsonl'],['processFailure','native-process-failure.json']]) assert(r.inputs[key].completeOriginalFile&&r.inputs[key].originalSha256===hashBytes(x.Buffer.from(fixture[name])).sha256,'Full original hash mismatch');
    assert(x.writes.length===1&&x.handles.size===0&&!x.logs[0].includes('SECRET')&&!x.logs[0].includes('/owned/'),'Extra writes, open handles or private data');
    assert(x.Buffer.byteLength(x.logs[0]+'\n')<=32768,'Envelope over budget');
    return {envelopeUtf8Bytes:x.Buffer.byteLength(x.logs[0]+'\n')};
  });
  group('live append preserves bounded initial prefix and labels change',()=>{
    const x=h(fixture,{growApp:'LATER SECRET APPEND\n'}),r=x.report();
    assert(x.files.get('/owned/startup-app-log-snapshot.log').data.toString()===fixture['app.log'],'Later append entered initial snapshot');
    assert(r.inputs.appLog.changedDuringRead===true&&!r.inputs.appLog.completeAtRead&&r.inputs.appLog.unreadBytesObserved>0&&r.inputs.appLog.originalSha256===null,'Growth became a complete final-file claim');
    assert(x.files.get('/owned/app.log').data.toString().endsWith('LATER SECRET APPEND\n'),'Source append was changed');
  });
  group('source replacement remains a captured descriptor snapshot',()=>{
    const x=h(fixture,{replaceApp:true}),r=x.report();
    assert(r.inputs.appLog.sameFileIdentity===false&&r.inputs.appLog.changedDuringRead&&!r.inputs.appLog.completeAtRead,'Path replacement not observed');
    assert(x.files.get('/owned/startup-app-log-snapshot.log').data.toString()===fixture['app.log']&&x.files.get('/owned/app.log').data.toString()==='replacement\n','Replacement source was overwritten or reused');
  });
  group('wx collision preserves prior bytes and does not claim a fresh snapshot',()=>{
    const x=h({...fixture,'startup-app-log-snapshot.log':'PRIOR EXACT BYTES\n'}),r=x.report();
    assert(x.files.get('/owned/startup-app-log-snapshot.log').data.toString()==='PRIOR EXACT BYTES\n'&&x.writes.length===0,'Collision overwrote prior snapshot');
    assert(r.inputs.appLog.status==='snapshot-retention-failed'&&!r.inputs.appLog.snapshot.retained&&r.inputs.appLog.snapshot.sha256===null&&r.activation.status==='unavailable'&&r.commands.matchedRecords===3,'Collision disguised an old snapshot or hid independent files');
  });
  group('missing inputs remain explicit unavailable observations',()=>{
    const x=h({}),r=x.report();
    assert(r.inputs.appLog.status==='open-failed'&&r.inputs.commands.originalSha256===null&&r.inputs.processFailure.originalSha256===null&&r.activation.status==='unavailable'&&r.process.status==='unavailable','Missing file invented a state/hash');
    assert(x.writes.length===0&&x.handles.size===0,'Missing inputs wrote evidence');
  });
  group('invalid JSON and invalid typed observations remain distinct',()=>{
    const x=h({...fixture,'commands.jsonl':'{bad}\n'+JSON.stringify({phase:'response',at:'PRIVATE',request:{id:2,command:'tron.window'},response:{id:2,ok:1,secret:'SECRET'}})+'\n','native-process-failure.json':'{bad}\n'}),r=x.report();
    assert(r.commands.malformedRecords===1&&r.commands.records[0].ok===null&&r.inputs.processFailure.jsonStatus==='invalid-json'&&r.inputs.processFailure.completeOriginalFile&&r.process.status==='unavailable','Invalid JSON/type became valid evidence or lost complete-file identity');
    assert(!x.logs[0].includes('SECRET'),'Invalid records leaked');
  });
  group('hard read caps and overflow never publish a complete partial hash',()=>{
    const huge='x'.repeat(1024*1024+50),other='y'.repeat(256*1024+50);
    const x=h({'app.log':huge,'commands.jsonl':other,'native-process-failure.json':other}),r=x.report();
    assert(r.inputs.appLog.readBytes===1048576&&r.inputs.appLog.truncated&&r.inputs.appLog.snapshot.bytes===1048576,'App prefix read exceeded cap');
    assert(r.inputs.commands.readBytes===262145&&r.inputs.processFailure.readBytes===262145&&r.inputs.commands.originalSha256===null&&r.inputs.processFailure.originalSha256===null,'Oversized complete-file read/hash accepted');
    assert(r.inputs.processFailure.jsonStatus==='not-read-completely'&&x.files.get('/owned/startup-app-log-snapshot.log').data.length===1048576,'Oversized process parsed or snapshot size wrong');
  });
  group('changing command and process files cannot receive complete-file digests',()=>{
    for(const name of ['commands.jsonl','native-process-failure.json']) {
      const x=h(fixture,{growFile:name,growText:' \n'}),r=x.report(),key=name==='commands.jsonl'?'commands':'processFailure';
      assert(r.inputs[key].changedDuringRead===true&&!r.inputs[key].completeOriginalFile&&r.inputs[key].originalSha256===null,'Changed non-live file got a full original hash');
      if(key==='processFailure')assert(r.inputs[key].jsonStatus==='not-read-completely'&&r.process.status==='unavailable','Changing process JSON was projected');
    }
  });
  group('exact complete-file cap accepts only the full EOF-terminated read',()=>{
    const text='z'.repeat(256*1024),x=h({'commands.jsonl':text}),r=x.api.readStartupInput('commands.jsonl');
    assert(r.info.readBytes===262144&&r.info.completeOriginalFile&&!r.info.truncated&&r.info.originalSha256===hashBytes(x.Buffer.from(text)).sha256,'Exact-size file mishandled at boundary');
    assert(x.reads.reduce((n,r)=>n+r.bytes,0)===262144&&x.handles.size===0,'Exact-size read exceeded cap or left handle');
  });
  group('line scan and record retention budgets disclose omissions',()=>{
    const x=h(),line=header('NYCTronActivation',{phase:'policy-entered',operation:1,mainThread:true,details:{}});
    const s=x.api.startupStream('activation',x.Buffer.from(line.repeat(4100)),123,true);
    assert(s.scannedLines===4096&&s.unscannedLines===4&&s.matchedRecords===4096&&s.selectedRecords===32&&s.omittedRecords===4064&&s.records[0].line===1&&s.records.at(-1).line===4096,'Line/record caps failed');
    const big=x.api.startupStream('activation',x.Buffer.from('x'.repeat(8193)+'\n'),123,true);
    assert(big.oversizedLines===1&&big.matchedRecords===0,'Oversized line parsed');
  });
  group('complete 32 KiB envelope trims records while retaining latest stages',()=>{
    const rows=Array.from({length:100},(_,i)=>i+1), wide=Number.MAX_SAFE_INTEGER-100;
    const app=rows.map(i=>header('NYCTronActivation',{phase:'reply-prepared',operation:wide+i,at:Number.MAX_SAFE_INTEGER,mainThread:true,details:{accepted:false,hasApplication:true,hasError:false,sameProcess:true,sameBundle:true,ok:true,policy:0,applicationActive:true,visible:true,key:true,miniaturized:false,canBecomeKey:true}})+header('NYCTronDriverTransport',{phase:'send-completed',sequence:wide+i,command:'tron.drag-protocol',at:Number.MAX_SAFE_INTEGER,mainThread:true,details:{parsed:true,dictionary:true,nilResponse:false,validJSONObject:true,hasError:false,threwException:false,replacedWithFailure:false,bytes:Number.MAX_SAFE_INTEGER,errno:Number.MAX_SAFE_INTEGER,errorCode:-Number.MAX_SAFE_INTEGER}})).join('');
    const commands=rows.map(i=>JSON.stringify({phase:'response',at:'2026-11-11T01:02:03.004Z',request:{command:'tron.drag-protocol',id:wide+i},response:{id:wide+i,ok:true},protocol:Number.MAX_SAFE_INTEGER})+'\n').join('');
    const x=h({...fixture,'app.log':app,'commands.jsonl':commands}),r=x.report();
    assert(x.Buffer.byteLength(x.logs[0]+'\n')<=32768&&x.logs[0].split('\n').length===3,'Output budget or envelope framing failed');
    for(const s of [r.activation,r.transport,r.commands])assert(s.matchedRecords===100&&s.selectedRecords===s.records.length&&s.omittedRecords===100-s.records.length,'Output omission counts wrong');
    assert(r.activation.records.at(-1).operation===Number.MAX_SAFE_INTEGER&&r.transport.records.at(-1).sequence===Number.MAX_SAFE_INTEGER&&r.commands.records.at(-1).requestId===Number.MAX_SAFE_INTEGER,'Latest stages discarded');
    assert(r.activation.outputOmittedRecords+r.transport.outputOmittedRecords+r.commands.outputOmittedRecords>0,'Output limit path was not exercised');
    return {envelopeUtf8Bytes:x.Buffer.byteLength(x.logs[0]+'\n')};
  });
  group('all new IO/reporting failures preserve primary error and cleanup',()=>{
    for(const [failStage,failFile] of [['open','app.log'],['read','app.log'],['close','app.log'],['write','startup-app-log-snapshot.log']]){
      const x=h(fixture,{failStage,failFile}),primary=new Error('PRIMARY');
      let caught;try{try{throw primary;}catch(e){x.api.reportStartupFailure();throw e;}}catch(e){caught=e;}
      assert(caught===primary&&x.handles.size===0,'Secondary '+failStage+' masked primary or leaked handle');
      assert(x.logs.length===1&&!x.logs[0].includes('SECRET'),'Secondary '+failStage+' suppressed independent observation or exposed text');
    }
    const x=h(fixture,{consoleFailure:true}),primary=new Error('PRIMARY');let caught;
    try{try{throw primary;}catch(e){x.api.reportStartupFailure();throw e;}}catch(e){caught=e;}
    assert(caught===primary&&x.logs.length===0&&x.handles.size===0&&x.files.has('/owned/startup-app-log-snapshot.log'),'Console failure altered primary or lost snapshot');
  });
  group('empty originals differ from missing originals',()=>{
    const x=h({'app.log':'','commands.jsonl':'','native-process-failure.json':''}),r=x.report();
    assert(r.inputs.appLog.snapshot.retained&&r.inputs.appLog.snapshot.bytes===0&&r.activation.status==='projected'&&r.activation.matchedRecords===0,'Empty app log became missing');
    assert(r.inputs.commands.completeOriginalFile&&r.inputs.commands.originalSha256===hashBytes([]).sha256&&r.commands.status==='projected','Empty command original lost identity');
    assert(r.inputs.processFailure.jsonStatus==='invalid-json','Empty process JSON accepted');
  });
  if(history)group('authentic historical timeout and late-send records stay separate',()=>{
    const x=h({'app.log':history.app,'commands.jsonl':history.commands,'native-process-failure.json':history.process},{pid:37118}),r=x.report();
    const failed=r.commands.records.find(x=>x.phase==='request-failed'),late=r.transport.records.find(x=>x.phase==='main-replied'&&x.sequence===2);
    assert(failed?.requestId===2&&late&&late.atEpochSeconds*1000>Date.parse(failed.at),'Historical timeout/late reply timeline lost');
    assert(r.activation.matchedRecords===0&&r.process.sample.hasThreadStacks===true&&r.inputs.appLog.originalSha256===null,'Absent old activation trace or sampler overclaimed');
    assert(!x.logs[0].includes('/Users/')&&!x.logs[0].includes('stdout')&&!x.logs[0].includes('stderr'),'Original path/output leaked');
  });
  return {scope:'V8 source selectors and mocked bounded filesystem/console only; no Node filesystem, macOS or native acceptance execution',checks,passed:checks.filter(x=>x.status==='passed').length,failed:checks.filter(x=>x.status==='failed').length};
}

const startupReporterFixture = {
  "app.log": "SECRET unrelated app message\n2026-11-11 01:02:03.004 SECRET-App[123:900] NYCTronActivation {\"phase\":\"policy-entered\",\"operation\":1,\"at\":1794358923.004,\"mainThread\":true,\"details\":{\"policy\":2,\"applicationActive\":false,\"visible\":false,\"key\":false,\"miniaturized\":false,\"canBecomeKey\":true,\"secret\":\"SECRET\"}}\n2026-11-11 01:02:03.004 SECRET-App[123:900] NYCTronActivation {\"phase\":\"workspace-request-entered\",\"operation\":1,\"at\":1794358923.005,\"mainThread\":true,\"details\":{}}\n2026-11-11 01:02:03.004 SECRET-App[123:900] NYCTronDriverTransport {\"phase\":\"main-dispatched\",\"sequence\":2,\"command\":\"tron.window\",\"at\":1794358923.006,\"mainThread\":true,\"details\":{}}\n",
  "commands.jsonl": "{\"phase\":\"authentication-response\",\"at\":\"2026-11-11T01:02:03.000Z\",\"ok\":true,\"protocol\":1,\"token\":\"SECRET\"}\n{\"phase\":\"request-started\",\"at\":\"2026-11-11T01:02:03.005Z\",\"request\":{\"id\":2,\"command\":\"tron.window\",\"window\":\"SECRET\",\"token\":\"SECRET\"}}\n{\"phase\":\"request-failed\",\"at\":\"2026-11-11T01:02:38.005Z\",\"request\":{\"id\":2,\"command\":\"tron.window\",\"value\":\"SECRET\"},\"error\":\"SECRET timeout path\"}\n",
  "native-process-failure.json": "{\"processId\":123,\"exitCode\":null,\"signalCode\":null,\"observedAt\":\"2026-11-11T01:02:38.006Z\",\"launchError\":\"SECRET\",\"beforeSample\":{\"observedAt\":\"2026-11-11T01:02:38.010Z\",\"exitCode\":0,\"signal\":null,\"stdout\":\"123 1 S SECRET\",\"stderr\":\"SECRET\"},\"afterSample\":{\"observedAt\":\"2026-11-11T01:02:42.010Z\",\"exitCode\":0,\"signal\":null,\"stdout\":\"SECRET\"},\"sample\":{\"durationSeconds\":2,\"intervalMilliseconds\":10,\"exitCode\":0,\"signal\":null,\"threadGroups\":3,\"hasThreadStacks\":true,\"file\":\"native-process-sample.txt\",\"sha256\":\"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\",\"stdout\":\"SECRET\",\"stderr\":\"SECRET\",\"error\":\"SECRET\",\"limitation\":\"SECRET\"}}\n"
};

function reviewStartupReporter(candidateSource, historicalFixtures) {
  if (gitBlobSha(candidateSource) !== 'e773cfb2661e80f01daa400f14cd09b903e6b087') throw new Error('Candidate source differs');
  const begin = candidateSource.indexOf('function startupProject(');
  const end = candidateSource.indexOf('async function waitFor(check, label, timeoutMs = 20000) {', begin);
  if (begin < 0 || end < begin) throw new Error('Source block absent');
  const block = candidateSource.slice(begin, end);
  const inverse = (candidateSource.slice(0, begin) + candidateSource.slice(end))
    .replace('openSync, closeSync, readSync, fstatSync }', 'openSync, closeSync, readSync }')
    .replace('  reportStartupFailure();\n  throw error;\n} finally {', '  throw error;\n} finally {');
  if (gitBlobSha(inverse) !== 'deeedf41711c84dbcca0029104e5ea03e6b55a2c') throw new Error('Inverse source differs');
  const expected = { app: '3949183f89bbdbaefbbe6fee066fe3c1664f7a4b', commands: 'f6f93527325fcc1c67adc0f766f728d1b004498a', process: '44e2eefd3a36794f846ea1fad043feb6cd54771b' };
  for (const [key, sha] of Object.entries(expected)) if (typeof historicalFixtures?.[key] !== 'string' || gitBlobSha(historicalFixtures[key]) !== sha) throw new Error('Historical fixture differs: ' + key);
  return runStartupChecks(block, createStartupHarness, sha256Bytes, startupReporterFixture, historicalFixtures);
}

