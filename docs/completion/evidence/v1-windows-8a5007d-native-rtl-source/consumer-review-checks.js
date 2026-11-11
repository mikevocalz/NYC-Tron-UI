/* Portable source and protocol models only. No PowerShell/.NET/Win32 execution. */
(()=>{
const utf8=s=>{const out=[];for(const c of s){const n=c.codePointAt(0);if(n<128)out.push(n);else if(n<2048)out.push(192|(n>>6),128|(n&63));else if(n<65536)out.push(224|(n>>12),128|((n>>6)&63),128|(n&63));else out.push(240|(n>>18),128|((n>>12)&63),128|((n>>6)&63),128|(n&63));}return out;};
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
function reviewNativeRtlConsumer(input) {
  const {source,preimage,manifest,traceSource,smokeSource}=input;
  const groups=[];let assertions=0;
  function assert(ok,label){assertions++;if(!ok)throw new Error(label);}
  function rejects(fn,label){let failed=false;try{fn();}catch{failed=true;}assert(failed,label);}
  function equal(a,b,label){assert(JSON.stringify(a)===JSON.stringify(b),label);}
  function one(s,t,label){assert(s.split(t).length===2,label);}
  function section(s,a,b){one(s,a,"section start "+a);const i=s.indexOf(a),j=s.indexOf(b,i+a.length);assert(j>i,"section end "+b);return s.slice(i,j);}
  function group(name,fn){fn();groups.push({name,status:"passed"});}
  function clone(o){return JSON.parse(JSON.stringify(o));}
  function identity(s){return{git:gitBlobSha(s),bytes:utf8(s).length,sha256:sha256Bytes(utf8(s)).sha256};}
  const isObject=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
  const integer=(x,min,max)=>typeof x==="number"&&Number.isFinite(x)&&Number.isInteger(x)&&x>=min&&x<=max;
  const fields=(o,names)=>isObject(o)&&Object.keys(o).length===names.length&&Object.keys(o).every(k=>names.includes(k));
  const proto=manifest.protocol.content;
  const consumerFailureEnums=[...source.match(/code=\(Rtl-SummaryEnum \$rtlWitness\.failure\.code @\(([^]*?)\)\)/)[1].matchAll(/"([^"]+)"/g)].map(m=>m[1]);
  const nativeFailure=x=>typeof x==="string"&&proto.failureEnums.includes(x)?x:null;
  const i32=x=>integer(x,-2147483648,2147483647);
  function rect(x,y,width,height){return{x,y,left:x,top:y,width,height,right:x+width,bottom:y+height};}
  function pixel(r){
    if(!fields(r,["x","y","left","top","width","height","right","bottom"])||!Object.values(r).every(i32)||
      r.width<=0||r.height<=0||r.left!==r.x||r.top!==r.y||r.right!==r.x+r.width||r.bottom!==r.y+r.height)throw new Error("geometry");
    return clone(r);
  }
  function same(a,b){return a.x===b.x&&a.y===b.y&&a.width===b.width&&a.height===b.height&&a.right===b.right&&a.bottom===b.bottom;}
  function contains(a,b){return b.x>=a.x&&b.y>=a.y&&b.right<=a.right&&b.bottom<=a.bottom;}
  function mirrored(a,b){return a.stable&&b.stable&&["owner","navigation","toggle"].every(k=>same(a[k],b[k]))&&
    a.icon.width===b.icon.width&&a.icon.height===b.icon.height&&a.icon.y===b.icon.y&&
    a.icon.right<=a.toggle.x+a.toggle.width/2&&b.icon.x>=b.toggle.x+b.toggle.width/2;}
  const binding={owner:{processId:924,threadId:800,hwnd:720964,key:"1,2",runtimeId:[1,2]},
    revision:"e8f8c19db909a53f3054976449a7571b2a0524e9",session:"{00112233-4455-6677-8899-AABBCCDDEEFF}",
    creationText:"134388600121142211",hwndText:"720964",sequence:0,generation:0,native:null};
  const nativeBinding={generation:4,componentTag:20,navigation:1,root:2,toggle:3,icon:4,identityVerified:true};
  const header=(seq,phase)=>({schemaVersion:1,sourceRevision:binding.revision,session:binding.session,creationFileTime:binding.creationText,
    processId:924,windowHandle:"720964",threadId:800,sequence:seq,phase,complete:true});
  function validHeader(v,b,seq,phase){return integer(v.schemaVersion,1,1)&&typeof v.sourceRevision==="string"&&v.sourceRevision===b.revision&&
    typeof v.session==="string"&&v.session===b.session&&typeof v.creationFileTime==="string"&&v.creationFileTime===b.creationText&&
    integer(v.processId,b.owner.processId,b.owner.processId)&&typeof v.windowHandle==="string"&&v.windowHandle===b.hwndText&&
    integer(v.threadId,b.owner.threadId,b.owner.threadId)&&integer(v.sequence,seq,seq)&&integer(v.phase,phase,phase)&&v.complete===true;}
  const headerKeys=["schemaVersion","sourceRevision","session","creationFileTime","processId","windowHandle","threadId","sequence","phase","complete","status"];
  function ready(){return{...header(0,0),status:"ready",messageId:49152,requestLimit:128,requestBytes:2048,responseBytes:8192};}
  function validateReady(v,b=binding){
    const keys=headerKeys.concat(["messageId","requestLimit","requestBytes","responseBytes"],v.status==="unavailable"?["failure"]:[]);
    if(!fields(v,keys)||!/^\{[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\}$/.test(v.session)||
      v.session==="{00000000-0000-0000-0000-000000000000}"||!validHeader(v,b,0,0)||v.messageId!==49152||
      !integer(v.requestLimit,128,128)||!integer(v.requestBytes,2048,2048)||!integer(v.responseBytes,8192,8192))throw new Error("ready mismatch");
    if(v.status!=="ready")throw Object.assign(new Error("unavailable"),{nativeFailure:nativeFailure(v.failure)});
    return true;
  }
  function response(seq=1,phase=1,right=false){return{...header(seq,phase),status:"observed",snapshot:{
    binding:clone(nativeBinding),counts:{registryEntries:1,nodesDiscovered:99,nodesRead:99,maxDepth:9,toggles:1,icons:1,complete:true},
    navigation:rect(16,32,320,600),toggle:rect(16,32,320,48),icon:rect(right?288:48,48,16,16),stable:true,
    coordinateContract:"same-XamlRoot-RectInt32-physical-screen",stabilityScope:"matching-sequential-observations-not-atomic-or-render-complete"}};}
  function validateResponse(v,b,seq,phase,owner=rect(0,0,1000,760),ownerAfter=owner){
    if(!["observed","unavailable"].includes(v.status)||!fields(v,headerKeys.concat(v.status==="observed"?["snapshot"]:["failure"]))||
      !validHeader(v,b,seq,phase))throw new Error("response mismatch");
    if(v.status==="unavailable")throw Object.assign(new Error("unavailable"),{nativeFailure:nativeFailure(v.failure)});
    const s=v.snapshot,n=s.binding,c=s.counts;
    if(!fields(s,["binding","counts","navigation","toggle","icon","stable","coordinateContract","stabilityScope"])||
      typeof s.stable!=="boolean"||s.coordinateContract!=="same-XamlRoot-RectInt32-physical-screen"||
      s.stabilityScope!=="matching-sequential-observations-not-atomic-or-render-complete")throw new Error("snapshot");
    if(!fields(n,["generation","componentTag","navigation","root","toggle","icon","identityVerified"])||
      !integer(n.generation,1,128)||!i32(n.componentTag)||n.navigation!==1||n.root!==2||n.toggle!==3||n.icon!==4||n.identityVerified!==true)throw new Error("binding");
    if(phase===2&&["generation","componentTag","navigation","root","toggle","icon"].some(k=>n[k]!==b.native[k]))throw new Error("binding changed");
    if(!fields(c,["registryEntries","nodesDiscovered","nodesRead","maxDepth","toggles","icons","complete"])||
      c.registryEntries!==1||!integer(c.nodesDiscovered,1,512)||c.nodesRead!==c.nodesDiscovered||!integer(c.maxDepth,0,24)||
      c.toggles!==1||c.icons!==1||c.complete!==true)throw new Error("traversal");
    const out={owner:clone(owner),navigation:pixel(s.navigation),toggle:pixel(s.toggle),icon:pixel(s.icon),stable:s.stable&&same(owner,ownerAfter)};
    if(!contains(out.owner,out.navigation)||!contains(out.navigation,out.toggle)||!contains(out.toggle,out.icon))throw new Error("containment");
    if(phase===1){b.native=clone(n);b.generation=n.generation;}
    return out;
  }
  function strictJson(text){
    let p=0;
    const space=()=>{while(p<text.length&&" \r\n\t".includes(text[p]))p++;};
    function string(){
      if(text[p++]!=='"')throw new Error("string");const start=p;
      while(p<text.length&&text[p]!=='"'){const n=text.charCodeAt(p);if(n<32||n>126||text[p]==="\\"||p-start>=256)throw new Error("string range");p++;}
      if(p>=text.length)throw new Error("unterminated");return text.slice(start,p++);
    }
    function object(depth){
      space();if(depth>8||text[p++]!=="{")throw new Error("object");const keys=new Set();space();
      if(text[p]==="}"){p++;return;}
      while(true){
        const k=string().toLowerCase();if(keys.size>=32||keys.has(k))throw new Error("keys");keys.add(k);space();
        if(text[p++]!==":")throw new Error("separator");space();
        if(text[p]==="{")object(depth+1);
        else if(text[p]==='"')string();
        else if(text[p]==="-"||(text[p]>="0"&&text[p]<="9")){
          const m=text.slice(p).match(/^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/);
          if(!m||!Number.isFinite(Number(m[0])))throw new Error("number");p+=m[0].length;
        }else{const v=["true","false","null"].find(x=>text.slice(p,p+x.length)===x);if(!v)throw new Error("value");p+=v.length;}
        space();if(text[p]==="}"){p++;return;}if(text[p++]!==",")throw new Error("continuation");space();
      }
    }
    object(0);space();if(p!==text.length)throw new Error("trailing");return JSON.parse(text);
  }
  function balance(s,mode){
    const stack=[],op="([{",cl=")]}";let i=0;
    while(i<s.length){
      let c=s[i];
      if(mode==="ps"&&c==="#"){while(i<s.length&&s[i]!=="\n")i++;continue;}
      if(mode==="cs"&&s.slice(i,i+2)==="//"){while(i<s.length&&s[i]!=="\n")i++;continue;}
      if(mode==="cs"&&s.slice(i,i+2)==="/*"){const end=s.indexOf("*/",i+2);if(end<0)throw new Error("comment");i=end+2;continue;}
      const verbatim=mode==="cs"&&c==="@"&&s[i+1]==='"';if(verbatim){i++;c='"';}
      if(c==='"'||c==="'"){
        const quote=c;i++;let closed=false;
        while(i<s.length){
          if((mode==="ps"&&quote==='"'&&s.charCodeAt(i)===96)||(mode==="cs"&&!verbatim&&s[i]==="\\")){i+=2;continue;}
          if(s[i]===quote){if((mode==="ps"&&quote==="'")||verbatim){if(s[i+1]===quote){i+=2;continue;}}i++;closed=true;break;}i++;
        }
        if(!closed)throw new Error("unclosed string");continue;
      }
      if(op.includes(c))stack.push(c);
      if(cl.includes(c)&&stack.pop()!==op[cl.indexOf(c)])throw new Error("delimiter");
      i++;
    }if(stack.length)throw new Error("open delimiters");return true;
  }
  group("Exact identities, ten inverses, protected actions and lexical delimiters",()=>{
    equal(identity(source),manifest.after,"final identity");equal(identity(preimage),manifest.before,"preimage identity");
    let forward=preimage;for(const e of manifest.edits){one(forward,e.before,e.label+" forward");forward=forward.replace(e.before,()=>e.after);}
    assert(forward===source&&manifest.edits.length===10,"exact ten forward edits");
    let reverse=source;for(const e of [...manifest.edits].reverse()){one(reverse,e.after,e.label+" inverse");reverse=reverse.replace(e.after,()=>e.before);}
    assert(reverse===preimage,"exact inverse");
    const actionLines=s=>Array.from(s.matchAll(/^\s*(?:Invoke-Button|Save-Screenshot|Assert-Selection|Wait-Focus|Wait-Contrast|Find-ByName)[^\n]*/gm),m=>m[0].trim());
    equal(actionLines(source),manifest.preserved.actionStatements,"unchanged action statements");
    const anchor=manifest.preserved.laterTail.anchor;
    const afterTail=source.slice(source.indexOf(anchor)).replace("  Write-NativeRtlWitnessSummary\n","  Write-RawRtlWitnessSummary\n");
    equal(identity(afterTail),{git:manifest.preserved.laterTail.git,bytes:manifest.preserved.laterTail.bytes,sha256:manifest.preserved.laterTail.sha256},"entire later tail");
    assert(source.includes(manifest.preserved.mirroringPredicate.content),"unchanged exact half-side predicate");
    for(const s of [source,preimage]){
      const cs=s.match(/^Add-Type @"\n([\s\S]*?)^"@ -ReferencedAssemblies[^\n]*\n/m);assert(!!cs,"one C# here string");
      assert(balance(cs[1],"cs"),"C# lexical delimiters");assert(balance(s.replace(cs[0],""),"ps"),"PowerShell lexical delimiters");
    }
    assert(!source.includes("TreeWalker]::RawViewWalker")&&!source.includes("Bind-RawRtlWitness"),"no assumed Icon peer discovery");
    assert(source.includes("finally { if (value.scheme != IntPtr.Zero) Marshal.FreeHGlobal(value.scheme); }"),"SET ownership intact");
  });
  group("Fixed resolver, borrowed-process ownership and protocol grammar",()=>{
    assert(gitBlobSha(traceSource)==="60870a22f0af9808c39e2969c8edfc9370b34d2b","exact existing resolver");
    assert(traceSource.includes("Get-AppxPackage | Where-Object { $_.PackageFamilyName -eq $family }")&&traceSource.includes("$packages.Count -ne 1"),"one exact package");
    assert(traceSource.includes('Packages\\$family\\LocalState\\nyctron-native-drag-$OwnedProcessId.jsonl'),"fixed LocalState derivation");
    assert(gitBlobSha(smokeSource)==="aa54819df02c2decfba2fb19e3b4d2a5aaabd554","exact parent");
    for(const part of ["$null = $process.Handle","$ownedProcessStartTime = $process.StartTime.ToUniversalTime().ToString(\"o\")",'& "$PSScriptRoot\\uia-navigation-accessibility.ps1" -Window $window -OutDir $OutDir'])assert(smokeSource.includes(part),"retained parent dependency");
    for(const part of ["GetProcessId(process) == processId","((ulong)created.high << 32) | created.low","$process.StartTime.ToUniversalTime().ToString(\"o\") -cne $ownedProcessStartTime",
      '$expected.threadId -ne $ownerThread','$expected.key -cne $key','$value.creationFileTime -is [string]'])assert(source.includes(part),"held owner source guard "+part);
    assert(validateReady(strictJson(JSON.stringify(ready())+"\r\n")),"valid native ready encoding");
    const bad=['{"x":1,"x":2}','{"X":1,"x":2}','{"x":[1]}','{"x":"\\u0041"}','{"x":"private\ntext"}','{"x":"é"}','{"x":NaN}','{"x":1e999}','{"x":01}','{"x":1.}','{"x":1e}','{"x":true,}','{"x":null} extra','\ufeff{"x":1}',
      '{"x":"'+ "a".repeat(257)+'"}','{"x":'+ '{"x":'.repeat(9)+'1'+'}'.repeat(9)+'}'];
    for(const x of bad)rejects(()=>strictJson(x),"invalid/ambiguous fixed JSON rejected");
    rejects(()=>strictJson("{"+Array.from({length:33},(_,i)=>'"k'+i+'":0').join(",")+"}"),"key cap");
    assert(strictJson('{"x":1.0,"y":1e2,"z":-0}').y===100,"JSON number notation before schema");
    const held={pid:924,creation:"134388600121142211",start:"2026-11-11T11:00:00.0000000Z",handlePid:924,live:true,hwnd:"720964",thread:800,key:"1,2"};
    const expected=clone(held),owns=x=>x.live===true&&["pid","creation","start","handlePid","hwnd","thread","key"].every(k=>x[k]===expected[k]);
    assert(owns(held),"one retained owner");
    for(const[k,v]of [["pid",925],["creation",134388600121142211],["start",null],["handlePid",1],["live",false],["hwnd","0"],["thread",801],["key","2,1"]]){const x=clone(held);x[k]=v;assert(!owns(x),"owner mismatch "+k);}
  });
  group("Strict ready/reply fields, generation and unavailable unknowns",()=>{
    assert(validateReady(ready()),"ready");
    const mutations=[["schemaVersion",0],["sourceRevision","a".repeat(40)],["session","{00112233-4455-6677-8899-aabbccddeeff}"],["creationFileTime",134388600121142211],
      ["processId","924"],["windowHandle",720964],["threadId",801],["sequence",1],["phase",1],["complete",1],["requestLimit",129],["requestBytes",2049],["responseBytes",8193],["messageId",49153]];
    for(const[k,v]of mutations){const r=ready();r[k]=v;rejects(()=>validateReady(r),"ready binding "+k);}
    const extra=ready();extra.extra=1;rejects(()=>validateReady(extra),"extra ready field");
    const missing=ready();delete missing.complete;rejects(()=>validateReady(missing),"missing ready field");
    for(const failure of ["icon-unavailable",{secret:"DO-NOT-LOG"},"DO-NOT-LOG",null]){
      const r={...header(0,0),status:"unavailable",messageId:49152,requestLimit:128,requestBytes:2048,responseBytes:8192,failure};
      rejects(()=>validateReady(r),"unavailable never passes");
      assert(nativeFailure(failure)===(failure==="icon-unavailable"?failure:null),"typed failure unknown");
    }
    const b=clone(binding);validateResponse(response(),b,1,1);assert(b.generation===4,"initial generation bound once");validateResponse(response(2,2,true),b,2,2);
    for(const[k,v]of [["sequence",1],["phase",1],["creationFileTime","134388600121142212"],["session","bad"],["processId",925],["threadId",801],["complete",false]]){
      const r=response(2,2,true);r[k]=v;rejects(()=>validateResponse(r,b,2,2),"response freshness "+k);
    }
    for(const[k,v]of [["generation",5],["componentTag",21],["root",7],["identityVerified",null]]){
      const r=response(2,2,true);r.snapshot.binding[k]=v;rejects(()=>validateResponse(r,b,2,2),"native binding "+k);
    }
    for(const[k,v]of [["registryEntries",2],["nodesDiscovered",513],["nodesRead",98],["maxDepth",25],["toggles",2],["icons",0],["complete",null]]){
      const r=response(2,2,true);r.snapshot.counts[k]=v;rejects(()=>validateResponse(r,b,2,2),"complete traversal "+k);
    }
    for(const val of [null,"true",1]){const r=response(2,2,true);r.snapshot.stable=val;rejects(()=>validateResponse(r,b,2,2),"stable unknown not boolean");}
    assert(source.includes("nativeFailure = Probe-NativeFailure $ready.failure")&&source.includes("nativeFailure = Probe-NativeFailure $record.failure"),"both raw failures normalized");
    assert(!source.includes("nativeFailure = $ready.failure")&&!source.includes("nativeFailure = $record.failure"),"no raw typed-state retention");
  });
  group("Strict physical geometry and unchanged mirrored-layout requirements",()=>{
    const b=clone(binding),ltr=validateResponse(response(),b,1,1),rtl=validateResponse(response(2,2,true),b,2,2);
    assert(mirrored(ltr,rtl),"left to right movement");assert(ltr.navigation.right<=ltr.owner.left+ltr.owner.width/2,"physical left pane");
    for(const r of [rect(0,0,0,20),rect(0,0,-1,20),rect(2147483647,0,1,1),{...rect(0,0,1,1),x:NaN},
      {...rect(0,0,1,1),y:Infinity},{...rect(0,0,1,1),width:"1"},{...rect(0,0,1,1),right:0},{...rect(0,0,1,1),left:1},{...rect(0,0,1,1),x:0.5}])rejects(()=>pixel(r),"invalid Int32 rectangle");
    equal(pixel(rect(-100,-50,10,10)),rect(-100,-50,10,10),"negative physical origin allowed");
    for(const key of ["owner","navigation","toggle"]){const r=clone(rtl);r[key].x++;assert(!mirrored(ltr,r),"stable containing rectangle "+key);}
    for(const key of ["width","height","y"]){const r=clone(rtl);r.icon[key]++;assert(!mirrored(ltr,r),"icon invariant "+key);}
    assert(!mirrored(ltr,{...rtl,stable:false}),"unstable cannot pass");assert(!mirrored(ltr,{...rtl,icon:rect(48,48,16,16)}),"nonmirrored cannot pass");
    const moved=response(2,2,true);moved.snapshot.icon=rect(400,48,16,16);rejects(()=>validateResponse(moved,b,2,2),"icon containment");
    assert(!validateResponse(response(2,2,true),b,2,2,rect(0,0,1000,760),rect(1,0,1000,760)).stable,"owner motion stays unstable");
  });
  const ioMetrics={};
  group("Bounded complete IO, atomic publication, exclusive retention and errors",()=>{
    const events=[];
    function file(text){return{text,bytes:utf8(text),type:1,attributes:0,path:"C:\\owned\\record.json",size:utf8(text).length,volume:1,index:2,write:3};}
    function read(f,max=8192){
      events.push("open");if(f===null)return null;if(f.openError)throw f.openError;
      if(f.type!==1||(f.attributes&0x410)!==0||f.size<=0||f.size>max)throw new Error("type/size");
      if(f.path!=="C:\\owned\\record.json")throw new Error("path");events.push("read");
      if(f.partial||f.trailing||["size","volume","index","write","attributes"].some(k=>f.after&&f.after[k]!==f[k]))throw new Error("unstable");
      events.push("close");if(f.closeError)throw f.closeError;events.push("hash");
      return{bytes:f.bytes,text:f.text,sha256:sha256Bytes(f.bytes).sha256};
    }
    const f=file(JSON.stringify(ready())),r=read(f);assert(r.bytes.length===f.size&&r.sha256.length===64,"complete bytes/hash");
    assert(events.indexOf("close")<events.indexOf("hash"),"hash after closure");assert(read(null)===null,"missing waits explicitly");
    for(const mutation of [{type:3},{attributes:0x400},{attributes:0x10},{size:0},{size:8193},{path:"C:\\other\\record.json"},{partial:true},{trailing:true},{openError:new Error("secret")},{closeError:new Error("secret")}])rejects(()=>read({...f,...mutation}),"IO failure stays unavailable");
    for(const k of ["size","volume","index","write","attributes"]){const x={...f,after:{...f,[k]:f[k]+1}};rejects(()=>read(x),"changed handle info "+k);}
    assert(read(file("x".repeat(8192))).bytes.length===8192,"exact response cap");rejects(()=>read(file("x".repeat(8193))),"response cap plus one");
    const disk=new Map(),order=[];
    function writeNew(name,bytes,fail){if(disk.has(name))throw new Error("exists");disk.set(name,bytes.slice());order.push("write");if(fail==="write")throw new Error("write");order.push("flush");if(fail==="flush")throw new Error("flush");order.push("close");if(fail==="close")throw new Error("close");}
    function publish(name,bytes,fail){if(bytes.length===0||bytes.length>2048)throw new Error("limit");writeNew(name+".tmp",bytes,fail);if(disk.has(name))throw new Error("exists");order.push("move");disk.set(name,disk.get(name+".tmp"));disk.delete(name+".tmp");}
    publish("request-1",utf8("{}\r\n"));equal(order,["write","flush","close","move"],"complete close before publication");
    const saved=disk.get("request-1").slice();rejects(()=>publish("request-1",utf8('{"x":1}')),"existing final refused");equal(disk.get("request-1"),saved,"original unchanged");
    for(const failure of ["write","flush","close"]){const name="request-"+failure;rejects(()=>publish(name,utf8("{}"),failure),"partial publication "+failure);assert(!disk.has(name),"partial never final");}
    rejects(()=>publish("over",new Array(2049).fill(32)),"request cap");
    writeNew("evidence",r.bytes);equal(disk.get("evidence"),r.bytes,"exact retention");rejects(()=>writeNew("evidence",r.bytes),"evidence collision");
    for(const part of ["CreateFileW(path, 0x80000000, 1, IntPtr.Zero, 3, 0x00200000","GetFileType(file) != 1","(before.attributes & 0x410) != 0",
      "RequirePath(file, path);","new System.Text.UTF8Encoding(false, true).GetString(bytes)","stream.Flush(true);","System.IO.File.Move(temporary, path);",
      "copied.Sha256 != value.Sha256"])assert(source.includes(part),"actual IO contract "+part);
    ioMetrics.rawBytes=f.size;ioMetrics.hash=r.sha256;
  });
  group("One-shot phase binding, fresh replies and one shared RTL deadline",()=>{
    const requestEvents=[];let now=0,seq=0,gen=0;
    function request(phase,deadline,delay=0,options={}){
      if(seq>=128||(phase===1&&(seq!==0||gen!==0))||(phase===2&&gen===0))throw new Error("phase");
      if(now>=deadline)throw new Error("deadline");if(options.existing)throw new Error("preexisting");
      const n=seq+1;requestEvents.push({n,phase,deadline,generation:gen});seq=n;if(options.postError)throw options.postError;
      while(delay>0){if(now>=deadline)throw new Error("deadline");const step=Math.min(10,delay);now+=step;delay-=step;}
      if(now>=deadline)throw new Error("deadline");if(options.error)throw options.error;if(options.unavailable)throw new Error("unavailable");
      if(phase===1)gen=4;return{sequence:seq,phase};
    }
    request(1,10000,20);assert(seq===1&&gen===4,"one baseline");rejects(()=>request(1,10000),"no rebind");
    const deadline=now+10000;for(let i=0;i<3;i++){now+=100;request(2,deadline,10);}request(2,deadline,10);
    assert(requestEvents.filter(x=>x.phase===1).length===1&&requestEvents.slice(1).every(x=>x.deadline===deadline),"shared final deadline");
    equal(requestEvents.map(x=>x.n),[1,2,3,4,5],"strict sequence");rejects(()=>request(2,deadline,0,{existing:true}),"no stale reply");
    const original=new Error("owned original");let caught;try{request(2,deadline,0,{error:original});}catch(e){caught=e;}assert(caught===original,"original failure identity");
    now=deadline-100;rejects(()=>request(2,deadline,200),"deadline never reset");seq=128;now=0;rejects(()=>request(2,deadline),"request budget");
    const rtlStage=section(source,'  $stage = "native-rtl-and-physical-left-pane"','  $stage = "native-pane-collapse-and-restore"');
    assert((rtlStage.match(/\$deadline = \(Get-Date\)\.AddSeconds\(10\)/g)||[]).length===1,"one existing RTL deadline");
    assert(rtlStage.includes('Start-Sleep -Milliseconds 100')&&rtlStage.includes('Read-NativeRtlSnapshot $nativeBinding "rtl" $deadline')&&rtlStage.includes('Read-NativeRtlSnapshot $nativeBinding "rtl-final" $deadline'),"actual shared deadline call sites");
    const consumer=section(source,"function Read-NativeRtlSnapshot","function Test-RawRtlMirrored");
    assert(!consumer.includes("AddSeconds")&&consumer.includes("Start-Sleep -Milliseconds 10")&&consumer.includes("$binding.sequence -ge 128"),"bounded wait no deadline refresh");
    assert(consumer.includes("Assert-ProbeProcess $binding $false"),"waiting avoids extra UIA owner reads");
    assert(consumer.indexOf("PublishProbeRequest")<consumer.indexOf("PostMessageW")&&consumer.indexOf("PostMessageW")<consumer.indexOf("$record = Read-ProbeRecord"),"publication/post/reply order");
    assert(consumer.includes("$rtlWitness.discovery.latest = $null")&&consumer.includes("$rtlWitness.transport.latestResponse = $null"),"no stale latest fields");
  });
  const metrics={};
  group("Typed query-free bounded summary, unknowns, privacy and secondary errors",()=>{
    const number=x=>typeof x==="number"&&Number.isFinite(x)?x:null,count=(x,max)=>integer(x,0,max)?x:null,bool=x=>typeof x==="boolean"?x:null;
    const en=(x,names)=>typeof x==="string"&&names.includes(x)?x:null;
    const projectRect=x=>isObject(x)?Object.fromEntries(["x","y","left","top","width","height","right","bottom"].map(k=>[k,number(x[k])])):null;
    const projectSnapshot=x=>isObject(x)?{phase:en(x.phase,["ltr","rtl","rtl-final"]),stable:bool(x.stable),...Object.fromEntries(["owner","navigation","toggle","icon"].map(k=>[k,projectRect(x[k])]))}:null;
    const projectCounts=x=>isObject(x)?{complete:bool(x.complete),...Object.fromEntries(["registryEntries","nodesDiscovered","nodesRead","toggles","icons"].map(k=>[k,count(x[k],512)])),maxDepth:count(x.maxDepth,24)}:null;
    const projectFile=x=>isObject(x)?{bytes:count(x.bytes,8192),retained:bool(x.retained),sha256:typeof x.sha256==="string"&&/^[a-f0-9]{64}$/.test(x.sha256)?x.sha256:null}:null;
    function project(x){
      const t=x.transport||{},b=x.binding;let bindingOut=null;
      if(isObject(b)){
        bindingOut={processId:count(b.processId,2147483647),threadId:count(b.threadId,2147483647),hwnd:typeof b.hwnd==="number"&&Number.isSafeInteger(b.hwnd)?String(b.hwnd):null,
          creationFileTime:typeof b.creationFileTime==="string"&&/^[1-9][0-9]{0,18}$/.test(b.creationFileTime)?b.creationFileTime:null,sessionMatched:bool(b.sessionMatched),
          ownerRuntimeId:Array.isArray(b.ownerRuntimeId)&&b.ownerRuntimeId.length>0&&b.ownerRuntimeId.length<=32&&b.ownerRuntimeId.every(i32)?b.ownerRuntimeId:null,native:null};
        if(isObject(b.native))bindingOut.native={identityVerified:bool(b.native.identityVerified),componentTag:i32(b.native.componentTag)?b.native.componentTag:null,
          ...Object.fromEntries(["generation","navigation","root","toggle","icon"].map(k=>[k,count(b.native[k],128)]))};
      }
      return{schemaVersion:1,summaryStatus:"captured-state",sourceRevision:binding.revision,method:"native-visual-icon-physical-screen",
        status:en(x.status,["not-started","binding-ltr","waiting-for-right","geometry-observed","failed"]),
        failure:isObject(x.failure)?{code:en(x.failure.code,consumerFailureEnums),role:en(x.failure.role,["tree","owner","navigation","toggle","icon","geometry","transport"])}:null,
        binding:bindingOut,pollAttempts:count(x.pollAttempts,2147483647),
        limits:{nodes:512,depth:24,runtimeIdIntegers:32,requests:128,requestUtf8Bytes:2048,responseUtf8Bytes:8192,outputUtf8Bytes:8192,pollSeconds:10,pollSleepMilliseconds:100},
        deadlineScope:"shared retry-window; synchronous UIA and file calls are not cancellable by it",coordinateContract:"same-XamlRoot-RectInt32-physical-screen",
        stabilityScope:"matching-sequential-observations-not-atomic-or-render-complete",byteScope:"UTF-8 envelope including its trailing newline; excludes runner timestamps",
        transport:{readyMatched:bool(t.readyMatched),requests:count(t.requests,128),latestSequence:count(t.latestSequence,128),latestPhase:count(t.latestPhase,2),
          latestMatched:bool(t.latestMatched),nativeFailure:nativeFailure(t.nativeFailure),ready:projectFile(t.ready),latestResponse:projectFile(t.latestResponse)},
        discovery:{initial:projectCounts(x.discovery?.initial),final:projectCounts(x.discovery?.final),latest:projectCounts(x.discovery?.latest)},ltr:projectSnapshot(x.ltr),latest:projectSnapshot(x.latest)};
    }
    function emit(value,write,serializer=JSON.stringify){
      try{let json=serializer(value),envelope="NYCTRON_RTL_WITNESS_BEGIN\r\n"+json+"\r\nNYCTRON_RTL_WITNESS_END\r\n";
        if(utf8(envelope).length>8192){json=JSON.stringify({schemaVersion:1,summaryStatus:"output-limit",sourceRevision:binding.revision,outputByteLimit:8192});envelope="NYCTRON_RTL_WITNESS_BEGIN\r\n"+json+"\r\nNYCTRON_RTL_WITNESS_END\r\n";}
        if(utf8(envelope).length<=8192){write(envelope);return utf8(envelope).length;}return null;
      }catch{return null;}
    }
    const b=clone(binding),l=validateResponse(response(),b,1,1),r=validateResponse(response(2,2,true),b,2,2);
    const state={status:"geometry-observed",pollAttempts:1,binding:{processId:924,threadId:800,hwnd:720964,creationFileTime:binding.creationText,sessionMatched:true,ownerRuntimeId:[1,2],native:nativeBinding},
      transport:{readyMatched:true,requests:2,latestSequence:2,latestPhase:2,latestMatched:true,nativeFailure:null,ready:{bytes:600,sha256:"a".repeat(64),retained:true},latestResponse:{bytes:1200,sha256:"b".repeat(64),retained:true}},
      discovery:{initial:response().snapshot.counts,final:response().snapshot.counts,latest:response().snapshot.counts},ltr:{...l,phase:"ltr"},latest:{...r,phase:"rtl-final"},private:"DO-NOT-LOG"};
    let output="";metrics.ordinaryEnvelope=emit(project(state),s=>output=s);
    assert(metrics.ordinaryEnvelope<=8192&&output.includes('"latest"')&&!output.includes("DO-NOT-LOG")&&!output.includes(binding.session),"bounded geometry/privacy");
    const bad=clone(state);bad.transport.nativeFailure={text:"DO-NOT-LOG"};bad.transport.latestMatched=false;bad.transport.ready.bytes=NaN;bad.binding.ownerRuntimeId=new Array(33).fill(1);bad.latest.stable="false";bad.latest.owner.x=Infinity;
    const out=project(bad);assert(out.transport.nativeFailure===null&&out.transport.latestMatched===false&&out.transport.ready.bytes===null&&out.binding.ownerRuntimeId===null&&out.latest.stable===null&&out.latest.owner.x===null,"false vs unknown");
    const empty=project({});assert(empty.binding===null&&empty.ltr===null&&empty.discovery.initial===null&&empty.transport.readyMatched===null,"missing unknown");
    const maximum=clone(state);maximum.binding.ownerRuntimeId=new Array(32).fill(-2147483648);maximum.pollAttempts=2147483647;maximum.transport.requests=128;maximum.transport.latestSequence=128;maximum.failure={code:"native-traversal-incomplete-or-ambiguous",role:"transport"};
    for(const name of ["ltr","latest"])for(const role of ["owner","navigation","toggle","icon"])for(const key of Object.keys(maximum[name][role]))maximum[name][role][key]=-Number.MAX_VALUE;
    metrics.maximumEnvelope=emit(project(maximum),s=>output=s);assert(metrics.maximumEnvelope<=8192&&JSON.parse(output.split("\r\n")[1]).summaryStatus==="captured-state","maximum typed output");
    metrics.fallbackEnvelope=emit(project(state),s=>output=s,()=> " ".repeat(8192));assert(JSON.parse(output.split("\r\n")[1]).summaryStatus==="output-limit"&&metrics.fallbackEnvelope<=8192,"complete fallback");
    assert(emit(project(state),()=>{throw new Error("report");})===null,"report errors secondary");
    const actualSummary=section(source,"function Write-NativeRtlWitnessSummary","function Fail-RawRtlWitness");
    assert(!/ReadProbeFile|Get-Content|GetFileHash|\.Current|GetRuntimeId|PostMessageW|GetProcessTimes/.test(actualSummary),"no provider/file reads");
    assert(actualSummary.includes('GetByteCount($envelope + [Environment]::NewLine) -gt 8192')&&actualSummary.includes('GetByteCount($envelope + [Environment]::NewLine) -le 8192')&&actualSummary.includes('} catch {}'),"actual complete-envelope/exception guards");
  });
  return{status:"passed",scope:"Seven portable source/lexical/contract/IO/lifecycle/projection model designs; no PowerShell parser, C# compilation, .NET, UIA, filesystem or native execution",
    groups,assertions,metrics:{...metrics,...ioMetrics,sourceBytes:utf8(source).length,edits:manifest.edits.length,originalActionStatements:manifest.preserved.actionStatements.length}};
}
return reviewNativeRtlConsumer;
})()
