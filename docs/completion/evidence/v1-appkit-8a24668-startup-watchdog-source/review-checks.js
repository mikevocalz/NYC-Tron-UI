// Reproducible V8-only review of the initial-request startup watchdog.
// Evaluate this file, then await reviewStartupWatchdog({source, preimage,
// historicalSample}) with the three exact UTF-8 blob contents below:
// source: 4507f860155746bb6f1a3a9528dd0e74de5d6492
// preimage: 2d9efdb7834b3ee461bf00e3fecbcc5c11b43964
// historicalSample: 394dd1966d30d917c471a6d9eec323c654fee15e
// The historical sample is a FORMAT fixture only, not evidence of this run.
// Timers, child processes, filesystem and console are deterministic mocks.
// These checks do not execute Node OS IO, Apple sample or native AppKit code.
// Reproduction in another isolate repeats these designs; it is not a new suite.

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

async function reviewStartupWatchdog({source,preimage,historicalSample}) {
  const results=[], metrics={};
  const assert=(condition,message)=>{if(!condition)throw Error(message);};
  const group=async(name,run)=>{try{await run();results.push({name,status:'passed'});}catch(error){error.failedGroup=name;error.completedGroups=results;throw error;}};
  const fixed=(value,needle,replacement)=>{assert(value.split(needle).length===2,'Nonunique inverse '+needle.slice(0,50));return value.replace(needle,()=>replacement);};
  const first=source.indexOf('let initialStartupObservation;'),last=source.indexOf('function tooltipFailureSummary(');
  assert(first>=0&&last>first,'Watchdog source boundaries absent');
  const block=source.slice(first,last);
  const run=options=>createWatchdogHarness(block,options);
  const spawnKinds=env=>env.events.filter(x=>x.kind==='spawn').map(x=>x.command);
  const originalError=()=>Object.assign(Error('original request rejection'),{code:'E_ORIGINAL_REQUEST'});
  const quiet=env=>assert(env.errors.length===0,'Mock callback failed: '+env.errors.map(x=>x.message).join(', '));
  const defaultFrame='    + 200 NSApplicationMain  (in AppKit) + 880  [0x12345678]';
  const sample=(frames=[defaultFrame],header='Analysis of sampling App (pid 77) every 10 milliseconds\nProcess: App [77]\n')=>
    header+'Call graph:\n    200 Thread_1   DispatchQueue_1: com.apple.main-thread  (serial)\n'+frames.join('\n')+'\nTotal number in stack\n';
  await group('exact source identity, five-edit inverse and initial-only integration',async()=>{
    assert(gitBlobSha(preimage)==='2d9efdb7834b3ee461bf00e3fecbcc5c11b43964','Wrong preimage');
    assert(gitBlobSha(source)==='4507f860155746bb6f1a3a9528dd0e74de5d6492','Wrong candidate');
    let inverse=fixed(source,"import { mkdir as mkdirAsync } from 'node:fs/promises';\n",'');
    inverse=inverse.slice(0,inverse.indexOf('let initialStartupObservation;'))+inverse.slice(inverse.indexOf('function retainProcessFailure() {'));
    inverse=fixed(inverse,"  if (initialStartupObservation?.skipPostFailureSample) {\n    processState.sample = { status: 'skipped-predeadline-sampler-close-unconfirmed', diagnosticOnly: true };\n  } else if (Number.isInteger(child.pid) && child.exitCode === null && child.signalCode === null) {\n","  if (Number.isInteger(child.pid) && child.exitCode === null && child.signalCode === null) {\n");
    inverse=fixed(inverse,"async function show(window = 'main', observeStartupRequest = false) {\n  const response = driver.request('tron.window', { window, action: 'show' });\n  const request = await (observeStartupRequest ? observeInitialWindowRequest(response) : response);\n","async function show(window = 'main') {\n  const request = await driver.request('tron.window', { window, action: 'show' });\n");
    inverse=fixed(inverse,"  await show('main', true);\n  await mounted('root-main'); await status('Native workspace ready');\n","  await show();\n  await mounted('root-main'); await status('Native workspace ready');\n");
    assert(inverse===preimage,'Full inverse differs');
    const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
    new AsyncFunction(source.replace(/^import .+;\n/gm,'').replace(/import\.meta/g,'({})'));
    assert(source.split("await show('main', true);").length===2,'Initial observer call not unique');
    const showHead=source.slice(source.indexOf('async function show('),source.indexOf("  assert.equal(request.activationPath",source.indexOf('async function show(')));
    assert((showHead.match(/driver\.request\('tron\.window'/g)||[]).length===1,'Initial show duplicates request');
    metrics.sourceBytes=utf8(source).length;
  });
  await group('healthy resolve and early rejection cancel the watcher without observers',async()=>{
    const healthy=run({});await healthy.advance(9999);const value={owned:true};healthy.resolve(value);await healthy.flush();await healthy.advance(10002);
    assert(healthy.outcome.value===value&&healthy.outcome.resolved,'Healthy result changed');
    assert(healthy.events.length===0&&healthy.logs.length===0&&healthy.reads.length===0,'Healthy request launched observation');
    const rejected=run({});const error=originalError();rejected.reject(error);await rejected.flush();await rejected.advance(11000);
    assert(rejected.outcome.error===error&&rejected.events.length===0,'Early rejection was replaced or watched');
    quiet(healthy);quiet(rejected);
  });
  await group('watchdog latch precedes observers and settlement during directory/preflight stops sampling',async()=>{
    const preparing=run({directoryDelay:1000});await preparing.advance(10000);
    assert(preparing.events.length===1&&preparing.events[0].kind==='mkdir'&&preparing.events[0].fired===true,'Directory preceded latch');
    preparing.resolve({ok:true});await preparing.flush();assert(!preparing.outcome.settled,'Did not await bounded triggered task after resolution');
    await preparing.advance(1001);
    assert(spawnKinds(preparing).length===0&&preparing.outcome.error?.code==='E_STARTUP_DIAGNOSTIC_ONLY','Directory race escaped diagnostic-only gate');
    const preflight=run({preflight:{closeAt:1000}});await preflight.advance(10010);
    const error=originalError();preflight.reject(error);await preflight.flush();await preflight.advance(1000);
    assert(preflight.outcome.error===error&&spawnKinds(preflight).join(',')==='/bin/ps','Preflight race sampled or replaced rejection');
    assert(preflight.report().status==='request-settled-during-preflight','Preflight status misleading');
    quiet(preparing);quiet(preflight);
  });
  await group('asynchronous sample leaves request pending and defers reads, hashes and reporting until settlement',async()=>{
    const env=run({});await env.advance(15000);
    assert(!env.outcome.settled&&env.reads.length===0&&env.hashes.length===0&&env.logs.length===0,'Predeadline processing blocked or inspected request');
    assert(spawnKinds(env).join(',')==='/bin/ps,/usr/bin/sample','Unexpected process sequence');
    assert(env.events.filter(x=>x.kind==='spawn').every(x=>x.fired===true),'Subprocess preceded diagnostic latch');
    const ps=env.events.find(x=>x.command==='/bin/ps'),sampler=env.events.find(x=>x.command==='/usr/bin/sample');
    assert(ps.args.join('|')==='-ww|-p|77|-o|pid=,ppid=,comm=','Identity query broadened');
    assert(sampler.args.join('|')==='77|2|10|-file|/owned/startup-predeadline/sample.txt','Sample arguments changed');
    await env.advance(20000);const error=originalError();env.reject(error);await env.flush();
    const report=env.report();
    assert(env.outcome.error===error,'Original rejection identity lost');
    assert(env.reads.every(x=>x.at>=env.settledAt())&&env.hashes.every(x=>x.at>=env.settledAt()),'Read/hash occurred before original settlement');
    assert(report.diagnosticOnly&&report.samplingMayPerturbScheduling&&!report.nativeAcceptancePermitted&&report.firstRequestOnly,'Diagnostic-only labels lost');
    assert(report.requestedDurationSeconds===2&&report.requestedIntervalMilliseconds===10&&report.statusScope==='observer-task-outcome','Requested/task scope mislabeled');
    assert(report.original.completeStableRead&&report.original.digestScope==='complete-stable-file-after-sampler-close','Stable closed file identity lost');
    assert(report.original.originalSha256===sha256Bytes(env.files.get('/owned/startup-predeadline/sample.txt').bytes).sha256,'Original sample digest differs');
    assert(!env.logs.join('').includes('SECRET')&&!env.logs.join('').includes('/owned/'),'Private output or paths leaked');
    metrics.normalEnvelopeBytes=utf8(env.logs[0]+'\n').length;quiet(env);
  });
  await group('a request resolving after the trigger cannot reach native acceptance',async()=>{
    const env=run({});await env.advance(12010);env.resolve({success:true});await env.flush();
    assert(env.outcome.resolved===false&&env.outcome.error?.code==='E_STARTUP_DIAGNOSTIC_ONLY','Triggered success became accepted');
    assert(env.report().requestOutcome==='resolved'&&!env.report().nativeAcceptancePermitted,'Resolved original was mislabeled');
    quiet(env);
    const pending=run({sample:{closeAt:5000}});
    await pending.advance(10050);
    const error=originalError();pending.reject(error);await pending.flush();
    assert(!pending.outcome.settled&&pending.reads.length===0,'Sampler was awaited before settlement or unfinished file read');
    await pending.advance(5000);
    assert(pending.outcome.error===error&&pending.report().sample.closeObserved,'Mid-sample rejection was replaced or cleanup not awaited');
    assert(pending.reads.every(x=>x.at>=pending.settledAt()),'Sample read preceded request settlement');
    quiet(pending);
  });
  await group('identity mismatches, output overflow and changed app ownership stop before sample',async()=>{
    const cases=[
      {preflight:{stdout:'78 55 /owned/App\n'}},
      {preflight:{stdout:'77 56 /owned/App\n'}},
      {preflight:{stdout:'77 55 /other/App\n'}},
      {preflight:{stdout:'77 55 /owned/App\n77 55 /owned/App\n'}},
      {preflight:{stdout:'x'.repeat(65537)}},
      {preflight:{beforeClose:child=>{child.exitCode=0;}}},
      {preflight:{beforeClose:child=>{child.pid=78;}}}
    ];
    for(const option of cases){
      const env=run(option);await env.advance(14000);const error=originalError();env.reject(error);await env.flush();
      assert(env.outcome.error===error&&spawnKinds(env).length===1,'Unverified ownership launched sample');
      assert(env.api.observation().diagnosticOnly===true,'Identity failure removed conservative latch');
      quiet(env);
    }
  });
  await group('directory and subprocess denial stay secondary and cannot fabricate observed close',async()=>{
    for(const option of [{directoryError:true},{directoryDelay:5000},{preflight:{throwSpawn:'EACCES'}},{sample:{throwSpawn:'EPERM'}},
      {sample:{pid:null,spawnEvent:false,errorAt:0,errorCode:'EACCES',closeAt:2,writeFile:false}}]){
      const env=run(option);await env.advance(20000);const error=originalError();env.reject(error);await env.flush();
      assert(env.outcome.error===error&&env.api.observation().diagnosticOnly,'Denial replaced original or allowed acceptance');
      assert(!env.report()?.original?.completeStableRead,'Denied observer manufactured complete sample');
      quiet(env);
    }
  });
  await group('kill acknowledgment and kill errors without close produce bounded unknown cleanup and suppress overlap',async()=>{
    for(const killError of [false,true]){
      const env=run({sample:{closeAt:null,ignoreKill:true,killError}});await env.advance(21000);const error=originalError();env.reject(error);await env.flush();
      const report=env.report();assert(env.outcome.error===error&&env.outcome.settled,'Bounded cleanup hung or changed error');
      assert(report.sample.closeObserved===false&&report.sample.cleanupLimitReached&&report.skipPostFailureSample,'Signal acknowledgment became closure');
      assert(report.original.status==='sampler-close-or-spawn-unconfirmed'&&env.reads.length===0,'Unclosed sample file was read');
      const sampler=env.subprocesses.find(x=>x.kind==='sample');
      assert(sampler.sub.killed&&sampler.sub.unreferenced&&sampler.sub.stdout.destroyed&&sampler.sub.stderr.destroyed,'Unconfirmed observer resources remained referenced');
      assert(env.signals.length===2&&env.signals.every(x=>x.kind==='sample')&&env.signals.map(x=>x.signal).join(',')==='SIGTERM,SIGKILL','Signals escaped owned sampler or became unbounded');
      env.api.retainProcessFailure();assert(!env.events.some(x=>x.kind==='spawnSync'),'Old postfailure sampler overlapped unknown closure');
      quiet(env);
    }
  });
  await group('exit-before-close and late close preserve historical cleanup boundary separately from observed closure',async()=>{
    const pending=run({sample:{exitAt:1000,closeAt:10000,ignoreKill:true}});await pending.advance(19500);const error=originalError();pending.reject(error);await pending.flush();
    const before=pending.report();
    assert(before.sample.exitObserved&&!before.sample.closeObserved&&before.skipPostFailureSample&&pending.signals.length===0,'Exit was treated as stdio close or signaled again');
    assert(before.statusScope==='observer-task-outcome','Task status scope absent');
    const late=run({sample:{exitAt:1000,closeAt:10000,ignoreKill:true}});await late.advance(21000);late.reject(error);await late.flush();
    const after=late.report();
    assert(after.status==='sampler-cleanup-unconfirmed'&&after.statusScope==='observer-task-outcome','Historical task result silently rewritten');
    assert(after.sample.closeObserved&&after.sample.cleanupLimitReached&&!after.sample.cleanupUnconfirmed&&!after.skipPostFailureSample,'Late observed close lost historical limit or current state');
    assert(after.original.completeStableRead,'Later observed close failed to allow completed file observation');
    quiet(pending);quiet(late);
  });
  await group('historical sample is a bounded format fixture with exact PID declarations and explicit main thread',async()=>{
    assert(gitBlobSha(historicalSample)==='394dd1966d30d917c471a6d9eec323c654fee15e','Wrong historical format fixture');
    const env=run({});const parsed=env.api.startupObservationSample(historicalSample,37118,'NYCTronExample');
    assert(parsed.status==='projected-main-thread'&&parsed.headerCount===1&&parsed.headerProcessId===37118&&parsed.analysisHeaderCount===1&&parsed.analysisProcessId===37118,'Historical format or identity failed');
    assert(parsed.mainThreadGroups===1&&parsed.frames.length===32&&parsed.parsedFrameLines===480&&parsed.omittedFrameLines===448,'Historical main-frame budget differs');
    assert(!JSON.stringify(parsed).includes('0x')&&!JSON.stringify(parsed).includes('/Users/'),'Absolute address/path leaked');
    metrics.historicalFixture={processId:37118,formatOnly:true,frames:parsed.frames.length,parsedFrameLines:parsed.parsedFrameLines,omittedFrameLines:parsed.omittedFrameLines};
    env.resolve(null);await env.flush();quiet(env);
  });
  await group('conflicting, malformed and duplicate declarations cannot silently project frames',async()=>{
    const env=run({}),parse=text=>env.api.startupObservationSample(text,77,'App');
    const cases=[
      sample().replace('Process: App [77]','Process: App [78]'),
      sample().replace('Process: App [77]','Process: App [77]\nProcess: App [77]'),
      sample().replace('(pid 77)','(pid 78)'),
      sample().replace('(pid 77)','(pid x)'),
      sample().replace('(pid 77)','(pid 77) (pid 77)'),
      sample().replace('Process:','Analysis of sampling App (pid 77) every 10 milliseconds\nProcess:'),
      sample().replace('Process: App [77]','Process: App [9007199254740993]'),
      sample().replace('com.apple.main-thread','com.apple.another-thread'),
      sample().replace('Total number in stack','    1 Thread_2   DispatchQueue_2: com.apple.main-thread  (serial)\nTotal number in stack')
    ];
    for(const value of cases)assert(parse(value).status!=='projected-main-thread','Invalid identity/main group projected');
    assert(parse(sample([defaultFrame],'Process: App [77]\n')).status==='projected-main-thread','Optional absent Analysis declaration was required');
    env.resolve(null);await env.flush();quiet(env);
  });
  await group('frame parsing preserves closed labels and scan/count/offset bounds without raw values',async()=>{
    const env=run({}),parse=text=>env.api.startupObservationSample(text,77,'App');
    const secret='PRIVATE_CREDENTIAL_DO_NOT_LOG';
    const frames=[
      defaultFrame,
      '    ! 4 '+secret+'  (in '+secret+') + 12  [0xabcdef]',
      '    : 4 ???  (in App) load address 0x12345678 + 0x80  [0x123456ff]',
      '    + 4 '+secret+'  (in AppKit) + 9007199254740993  [0xabcdef]',
      '    + 4 '+secret.repeat(400)+'  (in AppKit) + 12  [0xabcdef]'
    ];
    const value=parse(sample(frames));
    assert(value.frames.length===3&&value.frames[1].symbol==='unknown'&&value.frames[1].image==='unknown','Arbitrary symbol/image was retained');
    assert(value.frames[2].image==='owned-application'&&value.frames[2].offset===128&&value.frames[2].offsetKind==='image-relative','Safe relative app offset lost');
    assert(value.unparsedFrameLines===1&&value.oversizedLines===1&&!JSON.stringify(value).includes(secret)&&!JSON.stringify(value).includes('0x'),'Malformed/oversized private values leaked');
    const bounded=parse(sample(Array(4100).fill(defaultFrame)));
    assert(bounded.scannedLines===4096&&bounded.unscannedLines===4&&bounded.frames.length===32&&bounded.omittedFrameLines===4064,'Frame line/row budget not enforced');
    env.resolve(null);await env.flush();quiet(env);
  });
  await group('complete-file hashes require observed close and exact stable reads within one MiB',async()=>{
    const cap=1024*1024;
    for(const [option,expected] of [
      [{sampleText:sample()+' '.repeat(cap-utf8(sample()).length)},'complete-stable-read'],
      [{sampleText:sample()+' '.repeat(cap+1)},'incomplete-or-changing-read'],
      [{changingFile:true},'incomplete-or-changing-read'],
      [{fileFailure:'stat'},'read-unavailable'],
      [{fileFailure:'open'},'read-unavailable'],
      [{fileFailure:'read'},'read-unavailable'],
      [{fileFailure:'close'},'close-unavailable']
    ]){
      const env=run(option);await env.advance(13000);const error=originalError();env.reject(error);await env.flush();
      const original=env.report().original;
      assert(env.outcome.error===error&&original.status===expected,'File failure/scope incorrect: '+expected);
      assert(env.reads.filter(x=>x.kind==='read').reduce((n,x)=>n+x.bytes,0)<=cap+1,'File read exceeded processing cap');
      if(expected==='complete-stable-read')assert(original.originalSha256&&original.completeStableRead,'Complete stable hash absent');
      else assert(original.originalSha256===null&&!original.completeStableRead&&original.parsed===null,'Partial/failed read became whole-file evidence');
      if(expected==='incomplete-or-changing-read')assert(original.prefixSha256&&original.prefixBytes<=cap&&original.digestScope==='read-prefix-only-not-whole-file','Prefix hash scope lost');
      quiet(env);
    }
  });
  await group('wx original retention, output failures and maximum allowed frames preserve the primary rejection and output cap',async()=>{
    const existing='ORIGINAL DO NOT REPLACE',path='/owned/startup-predeadline.json';
    const maxFrame=' '.repeat(8000)+'9007199254740991 -[NSApplication(NSEventRouting) _nextEventMatchingEventMask:untilDate:inMode:dequeue:]  (in libsystem_platform.dylib) + 9007199254740991  [0xffffffffffff]';
    for(const option of [{files:{[path]:existing}},{writeFailure:true},{consoleFailure:true},{sampleText:sample(Array(32).fill(maxFrame))}]){
      const env=run(option);await env.advance(13000);const error=originalError();env.reject(error);await env.flush();
      assert(env.outcome.error===error,'Reporting error replaced request rejection');
      if(option.files)assert(env.files.get(path).bytes.toString()===existing,'wx overwrote original receipt');
      for(const output of env.logs){
        const length=utf8(output+'\n').length;assert(length<=16384,'Console envelope exceeded 16 KiB');
        const lines=output.split('\n');assert(lines[0]==='NYCTRON_STARTUP_SAMPLE_BEGIN'&&lines[2]==='NYCTRON_STARTUP_SAMPLE_END'&&lines.length===3,'Malformed console envelope');
        const record=JSON.parse(lines[1]);assert(record.original.parsed?.frames.length<=32,'Frame cap lost');
        if(option.sampleText)metrics.maximumFrameEnvelopeBytes=length;
      }
      quiet(env);
    }
  });
  return {status:'passed',groups:results,metrics,scope:'V8 source assertions and deterministic mocked timers, child processes, filesystem and console; no Node OS IO, AppKit compilation or native execution.'};
}
