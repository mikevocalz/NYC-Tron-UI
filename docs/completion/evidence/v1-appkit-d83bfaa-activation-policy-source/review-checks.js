/* Reproducible source review of the private AppKit activation-policy predicate.
 * Evaluate this file; call its returned function with exact decoded text inputs
 * {source: d83bfaa..., preimage: 6f119bc..., nativeLog: b39e919...}.
 * The six extracted-comparison cases do not invoke AppKit. The original completed
 * 0bee attempt1 log is checked separately, and does not validate this new source.
 */
(function () {
"use strict";
const hashes = (() => {
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
const manifest = {
  "source": {
    "gitBlob": "d83bfaa57bec5eda7111f40b4a41069f8396bdef",
    "bytes": 60484,
    "sha256": "7e2b735a33911cc60336dbfbb8ce1577f2a3a62e9715cd4cdf8637e23179b0b0"
  },
  "preimage": {
    "gitBlob": "6f119bca252082f18f573370e853bf2e86128934",
    "bytes": 60268,
    "sha256": "83d8569de1b6e4fe1c895b51bf3c3292364d09c657acaef07be3e19ff9bf163f"
  },
  "nativeLog": {
    "gitBlob": "b39e919ef2e6bb806412c53e1103cf17b875a024",
    "bytes": 80367,
    "sha256": "1466980748f763d112ac54738a8092c6b690c4a934cbe6ba15ee0c70355a1bd1"
  },
  "startupJson": {
    "gitBlob": "a214aa75259fa19ff0a4bbe7309f1790d210d9aa",
    "bytes": 23562,
    "sha256": "76c0da2236bbef80558945bd560af5ad46257d15bcbdf975ce52cb1d75613c4b"
  },
  "checkout": "3f9d3ad376bd6b4514ca691997c56dfc74888bec"
};
const transform = {
  "from": "        if (!policyAccepted) { reply(Failure(@\"The native test host refused interactive activation policy\")); return; }",
  "to": "        // The setter reports a policy-switch result. Require the observed policy;\n        // a false return alone does not establish that the required state is absent.\n        if (NSApp.activationPolicy != NSApplicationActivationPolicyRegular) { reply(Failure(@\"The native test host refused interactive activation policy\")); return; }"
};
function reviewActivationPolicyPredicate({source,preimage,nativeLog}) {
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  const inputs={source,preimage,nativeLog};
  for(const [name,value]of Object.entries(inputs)){
    const expected=manifest[name];
    assert(typeof value==="string",name+" must be exact decoded UTF-8 text");
    assert(hashes.blob(value)===expected.gitBlob,name+" Git blob identity");
    assert(hashes.utf8(value).length===expected.bytes,name+" byte length");
    assert(hashes.sha256(value)===expected.sha256,name+" SHA-256");
  }
  assert(preimage.split(transform.from).length===2,"old guard must be unique");
  assert(source.split(transform.to).length===2,"replacement must be unique");
  assert(preimage.replace(transform.from,transform.to)===source,"single forward transform");
  assert(source.replace(transform.to,transform.from)===preimage,"single inverse transform");
  const setterAndTrace='        BOOL policyAccepted = [NSApp setActivationPolicy:NSApplicationActivationPolicyRegular];\n        TraceActivation(@"policy-returned", operation, ^{ return @{ @"accepted": @(policyAccepted), @"state": ActivationWindowState(window) }; });';
  assert(preimage.includes(setterAndTrace)&&source.includes(setterAndTrace),"real setter and raw-return trace unchanged");
  const tailMarker="        // Sonoma ignores activateIgnoringOtherApps";
  assert(preimage.split(tailMarker).length===2&&source.split(tailMarker).length===2,"strict activation tail marker unique");
  assert(preimage.slice(preimage.indexOf(tailMarker))===source.slice(source.indexOf(tailMarker)),"all subsequent activation/identity source unchanged");
  const condition=transform.to.match(/if \((NSApp\.activationPolicy != NSApplicationActivationPolicyRegular)\)/);
  assert(condition,"extract actual replacement comparison");
  const reject=Function("NSApp","NSApplicationActivationPolicyRegular","return ("+condition[1]+");");
  const cases=[];
  for(const setterReturn of [false,true])for(const policy of [0,1,2]){
    const rejected=reject({activationPolicy:policy},0);
    assert(rejected===(policy!==0),"policy comparison mismatch");
    cases.push({setterReturn,observedPolicy:policy,rejected,continuationPermittedByPredicate:!rejected});
  }
  const lines=nativeLog.split(/\r?\n/),stripped=lines.map(line=>line.replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z /,""));
  const starts=stripped.map((line,index)=>line==="NYCTRON_STARTUP_EVIDENCE_BEGIN"?index:-1).filter(index=>index>=0);
  const ends=stripped.map((line,index)=>line==="NYCTRON_STARTUP_EVIDENCE_END"?index:-1).filter(index=>index>=0);
  assert(starts.length===1&&ends.length===1&&starts[0]<ends[0],"unique standalone startup markers");
  const between=stripped.slice(starts[0]+1,ends[0]);
  assert(between.length===1,"this exact startup envelope has no interleaved line");
  const raw=between[0];
  assert(hashes.blob(raw)===manifest.startupJson.gitBlob&&hashes.utf8(raw).length===manifest.startupJson.bytes&&hashes.sha256(raw)===manifest.startupJson.sha256,"raw startup JSON identity");
  const envelope=JSON.parse(raw);
  assert(envelope.sourceRevision===manifest.checkout&&envelope.processId===25836,"exact checked-out source and owned PID");
  const activation=envelope.activation;
  assert(activation.matchedRecords===12&&activation.selectedRecords===12&&activation.omittedRecords===0&&activation.outputOmittedRecords===0,"complete selected activation records");
  const operation=activation.records.filter(record=>record.operation===2);
  assert(operation.length===2,"exact operation2 record count");
  assert(operation[0].phase==="policy-entered"&&operation[1].phase==="policy-returned","exact operation2 phases");
  for(const record of operation){
    assert(record.mainThread===true&&record.state.policy===0&&record.state.applicationActive===true,"recorded owned app Regular/active");
    assert(record.state.visible===false&&record.state.key===false,"recorded second window not shown/key");
  }
  assert(operation[1].details.accepted===false,"actual raw setter return was false");
  const responses=envelope.commands.records.filter(record=>record.requestId===164);
  assert(responses.length===2&&responses[0].phase==="request-started"&&responses[1].phase==="response"&&responses[1].ok===false,"recorded command rejection");
  assert(nativeLog.includes("Error: tron.window: The native test host refused interactive activation policy"),"actual first failure message");
  assert(nativeLog.includes("/verify-native.mjs:1212:3"),"actual executed failure stack");
  return {status:"passed",reversibleTransforms:1,sourceIdentities:{preimage:manifest.preimage.gitBlob,source:manifest.source.gitBlob},
    cases,actualSetterAndRawReturnTraceUnchanged:true,subsequentActivationTailByteIdentical:true,
    originalEvidence:{nativeLog:manifest.nativeLog.gitBlob,startupJson:manifest.startupJson.gitBlob,checkout:manifest.checkout,processId:25836,
      operation:2,observedPolicyBefore:0,observedPolicyAfter:0,setterReturned:false,commandRequestId:164,commandReturnedOk:false},
    scope:"Six V8 cases for an extracted numeric comparison plus exact source/inverse/original-log checks. No Objective-C++ compilation, AppKit API invocation, Node filesystem, new native continuation, or false-return cause claim."};
}
return reviewActivationPolicyPredicate;
})()
