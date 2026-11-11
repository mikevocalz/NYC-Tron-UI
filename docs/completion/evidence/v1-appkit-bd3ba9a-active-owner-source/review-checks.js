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
const edits = {"native":[{"id":"retain-verified-workspace-identity","before":"static NSUInteger ActivationSequence;\n","after":"static NSUInteger ActivationSequence;\nstatic pid_t WorkspaceVerifiedProcessId;\nstatic NSURL *WorkspaceVerifiedBundleURL;\n"},{"id":"select-already-active-owned-window","before":"        TraceActivation(@\"policy-entered\", operation, ^{ return ActivationWindowState(window); });\n","after":"        TraceActivation(@\"policy-entered\", operation, ^{ return ActivationWindowState(window); });\n        // A window switch within the verified foreground process does not need\n        // another bundle reopen, whose host policy can select the main window.\n        // The initial and inactive paths still use Workspace identity checks.\n        if (WorkspaceVerifiedProcessId > 0 && NSApp.activationPolicy == NSApplicationActivationPolicyRegular && NSApp.active) {\n          pid_t processId = NSProcessInfo.processInfo.processIdentifier;\n          NSURL *bundleURL = NSBundle.mainBundle.bundleURL.URLByResolvingSymlinksInPath;\n          BOOL sameProcess = WorkspaceVerifiedProcessId == processId;\n          BOOL sameBundle = WorkspaceVerifiedBundleURL && [WorkspaceVerifiedBundleURL isEqual:bundleURL];\n          BOOL frontmost = sameProcess && sameBundle && NSWorkspace.sharedWorkspace.frontmostApplication.processIdentifier == processId;\n          if (frontmost) {\n            TraceActivation(@\"policy-returned\", operation, ^{ return @{ @\"accepted\": @YES, @\"state\": ActivationWindowState(window) }; });\n            TraceActivation(@\"identity-checked\", operation, ^{ return @{ @\"sameProcess\": @(sameProcess), @\"sameBundle\": @(sameBundle) }; });\n            if (window.miniaturized) {\n              TraceActivation(@\"deminiaturize-entered\", operation, ^{ return ActivationWindowState(window); });\n              [window deminiaturize:nil];\n              TraceActivation(@\"deminiaturize-returned\", operation, ^{ return ActivationWindowState(window); });\n            }\n            TraceActivation(@\"order-front-entered\", operation, ^{ return ActivationWindowState(window); });\n            [window makeKeyAndOrderFront:nil];\n            TraceActivation(@\"order-front-returned\", operation, nil);\n            NSDictionary *result = @{ @\"ok\": @YES, @\"activationPath\": @\"NSWindow.makeKeyAndOrderFront\", @\"priorWorkspaceIdentityVerified\": @YES,\n              @\"processId\": @(processId), @\"activationPolicy\": @(NSApp.activationPolicy), @\"applicationActive\": @(NSApp.active), @\"key\": @(window.keyWindow), @\"visible\": @(window.visible) };\n            TraceActivation(@\"reply-prepared\", operation, ^{ return @{ @\"ok\": result[@\"ok\"], @\"policy\": result[@\"activationPolicy\"],\n              @\"applicationActive\": result[@\"applicationActive\"], @\"key\": result[@\"key\"], @\"visible\": result[@\"visible\"] }; });\n            reply(result);\n            return;\n          }\n        }\n"},{"id":"record-successful-workspace-identity","before":"            if (window.miniaturized) {\n              TraceActivation(@\"deminiaturize-entered\", operation, ^{ return ActivationWindowState(window); });\n              [window deminiaturize:nil];\n              TraceActivation(@\"deminiaturize-returned\", operation, ^{ return ActivationWindowState(window); });\n            }\n            TraceActivation(@\"order-front-entered\", operation, ^{ return ActivationWindowState(window); });\n            [window makeKeyAndOrderFront:nil];\n            TraceActivation(@\"order-front-returned\", operation, nil);\n            NSDictionary *result = @{ @\"ok\": @YES, @\"activationPath\": @\"NSWorkspace.openApplication\"","after":"            WorkspaceVerifiedProcessId = processId;\n            WorkspaceVerifiedBundleURL = [bundleURL.URLByResolvingSymlinksInPath copy];\n            if (window.miniaturized) {\n              TraceActivation(@\"deminiaturize-entered\", operation, ^{ return ActivationWindowState(window); });\n              [window deminiaturize:nil];\n              TraceActivation(@\"deminiaturize-returned\", operation, ^{ return ActivationWindowState(window); });\n            }\n            TraceActivation(@\"order-front-entered\", operation, ^{ return ActivationWindowState(window); });\n            [window makeKeyAndOrderFront:nil];\n            TraceActivation(@\"order-front-returned\", operation, nil);\n            NSDictionary *result = @{ @\"ok\": @YES, @\"activationPath\": @\"NSWorkspace.openApplication\""}],"verifier":[{"id":"validate-truthful-owner-selection-path","before":"  assert.equal(request.activationPath, 'NSWorkspace.openApplication');\n  assert.equal(request.processId, child.pid, 'Workspace activation must retain the launched acceptance process');\n","after":"  if (observeStartupRequest) assert.equal(request.activationPath, 'NSWorkspace.openApplication');\n  else assert.ok(request.activationPath === 'NSWorkspace.openApplication' || request.activationPath === 'NSWindow.makeKeyAndOrderFront', 'Expected a supported native owner-selection path');\n  if (request.activationPath === 'NSWindow.makeKeyAndOrderFront') assert.equal(request.priorWorkspaceIdentityVerified, true, 'Direct owner selection requires the prior verified Workspace identity');\n  assert.equal(request.processId, child.pid, 'Window selection must retain the launched acceptance process');\n"}],"readme":[{"id":"describe-initial-activation-and-active-owner-selection","before":"Its explicit `tron.window` show command enables regular AppKit activation and\nrequests foreground presentation through `NSWorkspace.openApplication` for the\nexact existing test bundle. The returned process must be the already launched\nacceptance process. The fixture then requires observed visible, key and active\nowner-window state, including the frontmost process identity; a successful\nactivation request alone cannot pass. Spark's stock capture-only driver\notherwise prohibits activation. Activation uses public AppKit APIs and grants\nno input-posting permission.\n","after":"Its explicit `tron.window` show command uses `NSWorkspace.openApplication` for\ninitial activation of the exact existing test bundle, enabling regular AppKit\nactivation and verifying the returned process and resolved bundle identity.\nAfter that verification, a subsequent command that observes the same process\nalready Regular, active and frontmost selects its owned window directly with\n`NSWindow.makeKeyAndOrderFront`. If those conditions do not hold, it retains the\nWorkspace activation path. The response identifies the path actually used;\ninitial startup still requires Workspace activation. Every path retains the\nobserved visible, key and active owner-window checks and frontmost process\nidentity; an activation or selection request alone cannot pass. Spark's stock\ncapture-only driver otherwise prohibits activation. These operations use public\nAppKit APIs and grant no input-posting permission.\n"}]};
const expected = {"native":{"before":"bdd64d6becb859622bd024fce036482fc668a91f","after":"7df9831d697b7815cd7662ea3317a331cf9570e7"},"verifier":{"before":"ae88774e652cab55d556b5cd94da0a85d2505a45","after":"8c3176f220c5b038b2f1c7d1bbbc41dc693606f2"},"readme":{"before":"ce95b08424288985ed6cb1e1b2169f67056941cc","after":"97a554f649de9663913895e416c45cd51e24a873"}};

function ensure(value, message) { if (!value) throw new Error(message); }
function equal(a,b,message) { ensure(a===b,message); }
function extract(text) {
 const start=text.indexOf("function projectShowResponse(");
 const waitStart=text.indexOf("async function waitFor(");
 const inspectStart=text.indexOf("const inspect =");
 const showStart=text.indexOf("async function show(");
 const end=text.indexOf("\nconst control =",showStart);
 ensure([start,waitStart,inspectStart,showStart,end].every(x=>x>=0),"Missing exact extraction boundary");
 return {helpers:text.slice(start,waitStart),wait:text.slice(waitStart,inspectStart),inspect:text.slice(inspectStart,showStart),show:text.slice(showStart,end)};
}
function environment(text, options={}) {
 const e=extract(text), trace={calls:[],polls:0,time:0,observedStartup:0,files:[],logs:[],waitFailure:null,assertionError:null};
 const good={processId:71,activationPolicy:0,canBecomeKey:true,visible:true,key:true,applicationActive:true,frontmostProcessId:71};
 const values=options.values??[good];
 const driver={request(name,args){
   trace.calls.push({name,args});
   if(name==="tron.window") return options.requestError?Promise.reject(options.requestError):Promise.resolve(options.reply??{activationPath:"NSWorkspace.openApplication",processId:71});
   ensure(name==="tron.inspect","Unexpected added command");
   const index=trace.polls++;
   if(options.inspectError) return Promise.reject(options.inspectError);
   return Promise.resolve(values[Math.min(index,values.length-1)]);
 }};
 const fail=message=>{const error=new Error(message??"Mock assertion failed");error.code="ERR_ASSERTION";trace.assertionError=error;throw error;};
 const assert={equal(a,b,message){if(a!==b)fail(message);},ok(value,message){if(!value)fail(message);}};
 const source=e.helpers+"\n"+e.wait+"\n"+e.inspect+"\n"+e.show+
   "\nconst preservedWaitFor=waitFor; waitFor=async (...args)=>{try{return await preservedWaitFor(...args);}catch(error){trace.waitFailure=error;throw error;}}; return show;";
 const show=new Function("driver","child","assert","pause","Date","Buffer","writeFileSync","join","output","revision","console","observeInitialWindowRequest","assertRunning","trace",source)(
   driver,{pid:71},assert,async ms=>{trace.time+=ms;},{now:()=>trace.time},
   {byteLength:s=>H.utf8(s).length},
   (path,data,flags)=>{ensure(flags.flag==="wx","First receipt must remain exclusive");trace.files.push({path,data});},
   (...pieces)=>pieces.join("/"),"/mock-evidence","a".repeat(40),{info:value=>trace.logs.push(value)},
   promise=>{trace.observedStartup++;return promise;},()=>{},trace);
 return {trace,good,async run(startup=false){try{return {value:await show(startup?"main":"document-1",startup),error:null};}catch(error){return {value:null,error};}}};
}
return async function reviewActiveOwnerSelection(input) {
 const groups=[];
 const required=["native","verifier","readme"];
 for(const kind of required) {
   const before=input[kind+"Preimage"],after=input[kind];
   equal(H.blob(before),expected[kind].before,"Wrong "+kind+" preimage");
   equal(H.blob(after),expected[kind].after,"Wrong "+kind+" candidate");
   let forward=before;
   for(const edit of edits[kind]){equal(forward.split(edit.before).length,2,"Nonunique "+edit.id);forward=forward.replace(edit.before,edit.after);}
   equal(forward,after,"Full forward mismatch "+kind);
   let reverse=after;
   for(const edit of [...edits[kind]].reverse()){equal(reverse.split(edit.after).length,2,"Nonunique inverse "+edit.id);reverse=reverse.replace(edit.after,edit.before);}
   equal(reverse,before,"Full inverse mismatch "+kind);
 }
 const a=extract(input.verifier),b=extract(input.verifierPreimage);
 equal(a.helpers,b.helpers,"Observation helpers changed");equal(a.wait,b.wait,"20s wait changed");equal(a.inspect,b.inspect,"Inspection RPC changed");
 equal(input.verifier.slice(input.verifier.indexOf("\nconst control =")),input.verifierPreimage.slice(input.verifierPreimage.indexOf("\nconst control =")),"Later gates/collector/cleanup changed");
 equal(a.show.slice(a.show.indexOf("  const observation =")),b.show.slice(b.show.indexOf("  const observation =")),"Strict poll/error body changed");
 const parse=input.verifier.replace(/^import .*;\r?$/gm,"").replaceAll("import.meta.url",'"file:///review/verify-native.mjs"');
 new (Object.getPrototypeOf(async function(){}).constructor)(parse);
 groups.push("exact three-file identities, five inverses, unchanged polling/tail and whole-verifier parse only");

 const workspace={activationPath:"NSWorkspace.openApplication",processId:71};
 const direct={activationPath:"NSWindow.makeKeyAndOrderFront",priorWorkspaceIdentityVerified:true,processId:71};
 const initial=environment(input.verifier,{reply:workspace}), initialResult=await initial.run(true);
 ensure(!initialResult.error,"Initial Workspace rejected");equal(initial.trace.observedStartup,1,"Initial observer skipped");
 const initialDirect=environment(input.verifier,{reply:direct}), rejectedInitial=await initialDirect.run(true);
 ensure(rejectedInitial.error&&rejectedInitial.error===initialDirect.trace.assertionError,"Initial direct path must reject its exact assertion");
 equal(initialDirect.trace.polls,0,"Rejected startup inspected");equal(initialDirect.trace.calls.length,1,"Rejected startup added command");
 groups.push("initial startup still requires Workspace and retains its existing observer");

 for(const reply of [workspace,direct]){
   const value={processId:71,activationPolicy:0,canBecomeKey:true,visible:true,key:true,applicationActive:true,frontmostProcessId:71};
   const env=environment(input.verifier,{reply,values:[value]}), result=await env.run();
   equal(result.value,value,"Valid path did not return exact observed object");equal(result.error,null,"Valid path failed");
   equal(env.trace.calls.length,2,"Valid path added request");equal(env.trace.polls,1,"Valid path changed polling");
   equal(env.trace.files.length,0,"Successful show wrote failure receipt");equal(env.trace.logs.length,0,"Successful show logged failure");
 }
 for(const reply of [
   {...direct,priorWorkspaceIdentityVerified:undefined},{...direct,priorWorkspaceIdentityVerified:false},
   {...direct,priorWorkspaceIdentityVerified:"true"},{...direct,processId:72},
   {...direct,activationPath:"unknown"},{...workspace,processId:72}
 ]){
   const env=environment(input.verifier,{reply}),result=await env.run();
   ensure(result.error&&result.error===env.trace.assertionError,"Malformed path/identity was accepted or replaced");
   equal(env.trace.polls,0,"Invalid reply reached inspect");equal(env.trace.calls.length,1,"Invalid reply added command");
   equal(env.trace.files.length,0,"Pre-poll rejection changed failure scope");
 }
 groups.push("truthful subsequent paths and identity attestation; invalid paths/flags/PIDs reject before inspection");

 const good={processId:71,activationPolicy:0,canBecomeKey:true,visible:true,key:true,applicationActive:true,frontmostProcessId:71};
 const delayed=environment(input.verifier,{reply:direct,values:[{...good,key:false},{...good,applicationActive:false},good]});
 const delayedResult=await delayed.run();equal(delayedResult.value,good,"Strict conjunction did not wait for complete success");
 equal(delayed.trace.polls,3,"Changed number of polls");equal(delayed.trace.time,100,"Changed poll interval");equal(delayed.trace.calls.length,4,"Added request on direct path");
 for(const changed of [{processId:72},{activationPolicy:1},{canBecomeKey:false}]){
   const env=environment(input.verifier,{reply:direct,values:[{...good,...changed}]}), result=await env.run();
   ensure(result.error===env.trace.assertionError&&result.error===env.trace.waitFailure,"Strict assertion identity was replaced");
   equal(env.trace.polls,1,"Strict assertion unexpectedly retried");
 }
 groups.push("direct path retains all three strict assertions and waits for the full focus conjunction");

 const never={...good,key:false};
 const base=environment(input.verifierPreimage,{reply:workspace,values:[never]}), baseResult=await base.run();
 const next=environment(input.verifier,{reply:workspace,values:[never]}), nextResult=await next.run();
 const local=environment(input.verifier,{reply:direct,values:[never]}), localResult=await local.run();
 for(const [env,result]of[[base,baseResult],[next,nextResult],[local,localResult]]){
   ensure(result.error&&result.error===env.trace.waitFailure,"Original timeout Error was replaced");
   equal(env.trace.time,20000,"Deadline changed");equal(env.trace.polls,400,"Polling count changed");
   equal(env.trace.calls.length,401,"Additional command on timeout");equal(env.trace.files.length,1,"Missing first failure receipt");
   equal(env.trace.logs.length,1,"Unexpected console behavior");ensure(H.utf8(env.trace.logs[0]+"\n").length<=8192,"Envelope exceeded original cap");
 }
 equal(JSON.stringify(next.trace.calls),JSON.stringify(base.trace.calls),"Workspace sequence changed");
 equal(JSON.stringify(local.trace.calls),JSON.stringify(base.trace.calls),"Direct selection added RPCs");
 groups.push("same 20-second mock timeout, exact original Error identity and identical 401-command sequences");

 for(const kind of ["requestError","inspectError"]){
   const sentinel=new Error("private fixture error"), env=environment(input.verifier,{reply:direct,[kind]:sentinel}), result=await env.run();
   equal(result.error,sentinel,"Original "+kind+" changed");
   equal(env.trace.calls.length,kind==="requestError"?1:2,"Failure added request");
 }
 groups.push("request and inspect rejections preserve original objects without a retry");
 return {status:"passed",scope:"Pure V8 exact JavaScript functions with mocked driver/clock/assertions/IO; native Objective-C++ statically reviewed only.",
  groups:groups.map(name=>({name,status:"passed"})),designCount:groups.length,
  metrics:{timeoutPolls:local.trace.polls,timeoutMilliseconds:local.trace.time,totalCommands:local.trace.calls.length,delayedSuccessPolls:delayed.trace.polls,delayedSuccessMilliseconds:delayed.trace.time,
   timeoutConsoleEnvelopeBytes:H.utf8(local.trace.logs[0]+"\n").length},
  nativeExecution:false,nodeFilesystemExecution:false};
};

})()
