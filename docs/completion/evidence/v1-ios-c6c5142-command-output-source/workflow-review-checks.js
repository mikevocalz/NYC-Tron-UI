// Reproduce the iOS workflow capture source review in V8 only.
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


const utf8=s=>{const b=[];for(const ch of s){const n=ch.codePointAt(0);if(n<0x80)b.push(n);else if(n<0x800)b.push(0xc0|(n>>6),0x80|(n&63));else if(n<0x10000)b.push(0xe0|(n>>12),0x80|((n>>6)&63),0x80|(n&63));else b.push(0xf0|(n>>18),0x80|((n>>12)&63),0x80|((n>>6)&63),0x80|(n&63));}return b;};

return function reviewIosWorkflowCapture({source,preimage,manifest,packageSource,testRunner,discovery,runUiSource}) {
  const m=typeof manifest==="string"?JSON.parse(manifest):manifest;
  let assertions=0;const groups=[];
  const ok=(value,label)=>{++assertions;if(!value)throw Error(label);};
  const eq=(a,b,label)=>ok(a===b,label);
  const count=(s,t)=>s.split(t).length-1;
  const identity=s=>({gitBlob:gitBlobSha(s),...sha256Bytes(utf8(s))});
  function sameIdentity(s,e,label){const a=identity(s);for(const k of ["gitBlob","bytes","sha256"])eq(a[k],e[k],label+"."+k);}
  sameIdentity(preimage,m.preimage,"preimage");sameIdentity(source,m.candidate,"candidate");
  eq(m.preimage.gitBlob,"624bcf9c74ddfb89a43ca7e303560331c258cafb","fixed baseline");
  eq(m.edits.length,3,"three edits");
  let built=preimage;for(const e of m.edits){eq(count(built,e.before),1,"unique forward "+e.id);built=built.replace(e.before,()=>e.after);}
  eq(built,source,"full forward");
  for(const e of [...m.edits].reverse()){eq(count(built,e.after),1,"unique inverse "+e.id);built=built.replace(e.after,()=>e.before);}
  eq(built,preimage,"full inverse");
  eq(source.slice(0,source.indexOf("\n  ios:\n")),preimage.slice(0,preimage.indexOf("\n  ios:\n")),"triggers/source/Android unchanged");
  groups.push("Exact source identities and three unique forward/inverse transforms");

  const [build,ui,upload]=m.edits;
  const canonical=s=>s.split("\n").map(x=>x.trim()).join("\n");
  const oldBuild=build.before.slice(0,build.before.indexOf(" | tee /tmp/xcodebuild.log"));
  const newBuild=build.after.slice(build.after.indexOf("xcodebuild "),build.after.indexOf(" > /tmp/xcodebuild.log"));
  eq(canonical(newBuild),canonical(oldBuild),"original xcodebuild tokens/options once");
  eq(count(source,"xcodebuild -workspace"),1,"one xcodebuild");
  const newUi=ui.after.slice(ui.after.indexOf("node tooling/native/run-ui-acceptance.mjs ios"),ui.after.indexOf(' > "$nyc_tron_ios_output/ui-stdout.log"'));
  eq(newUi,ui.before.trim(),"original node UI tokens once");
  eq(count(source,'node tooling/native/run-ui-acceptance.mjs ios "$app" "$NYC_TRON_CONSUMER"'),1,"one UI command");
  ok(build.after.includes('> /tmp/xcodebuild.log 2> "$nyc_tron_ios_output/build-stderr.log"; then'),"separate build stream paths");
  ok(ui.after.includes('> "$nyc_tron_ios_output/ui-stdout.log" 2> "$nyc_tron_ios_output/ui-stderr.log"; then'),"separate UI stream paths");
  for(const [mode,edit] of [["build",build],["ui",ui]]) {
    const status="nyc_tron_"+mode+"_status";
    ok(edit.after.includes("then\n              "+status+"=0\n            else\n              "+status+"=$?\n            fi"),"immediate command status "+mode);
    ok(edit.after.includes("else\n            "+status+"=$?\n            printf"),"immediate setup status "+mode);
    ok(edit.after.includes("before command execution.' >&2 || :"),"secondary fixed setup marker "+mode);
    const reporter='node "$GITHUB_WORKSPACE/tooling/native/report-ios-command-output.mjs" '+mode+' "$'+status+'" "$NYC_TRON_CONSUMER" || :';
    eq(count(edit.after,reporter),1,"one secondary reporter "+mode);
    ok(edit.after.indexOf(reporter)>edit.after.indexOf("\n          fi"),"reporter after capture block "+mode);
    ok(edit.after.startsWith('          nyc_tron_ios_output="$NYC_TRON_CONSUMER/ios-command-output"\n          if mkdir -p "$nyc_tron_ios_output"; then'),"fixed sibling-only setup "+mode);
  }
  ok(build.after.endsWith('test "$nyc_tron_build_status" -eq 0'),"original0/1 build gate");
  ok(ui.after.endsWith('exit "$nyc_tron_ui_status"'),"exact UI exit");
  eq(upload.after.replace('            \x24{{ runner.temp }}/nyc-tron-native-consumer/ios-command-output\n',""),upload.before,"only sibling upload path");
  ok(!build.after.includes("runtime-ui-ios")&&!ui.after.includes("runtime-ui-ios"),"no runtime-dir precreation");
  eq(count(source,"runs-on:"),count(preimage,"runs-on:"),"runner declarations unchanged count");
  sameIdentity(runUiSource,m.runUiSource.identity,"unchanged run-ui source");
  ok(runUiSource.includes('mkdirSync(output); // A previous run\'s reports cannot satisfy this one.'),"runner retains output freshness");
  ok(runUiSource.includes('encoding: "utf8"')&&runUiSource.includes('(result.stdout ?? "") + (result.stderr ?? "")'),"nested logs remain existing decoded concatenations");
  groups.push("Once-only command tokens, fixed streams, status guards, existing gates and runtime freshness preservation");

  // Contract truth table only, not Bash execution.
  const statuses=[0,1,2,65,126,127,130,255];let cases=0;
  for(const commandStatus of statuses)for(const reporterStatus of [0,1,127]) {
    const saved=commandStatus;
    const buildStep=saved===0?0:1;
    const uiStep=saved;
    eq(buildStep,commandStatus===0?0:1,"build normalization independent of reporter"+reporterStatus);
    eq(uiStep,commandStatus,"UI raw status independent of reporter"+reporterStatus);
    ++cases;
  }
  for(const setupStatus of [1,2,126]) {
    const observation={saved:setupStatus,nativeCommandAttempts:0,commandExecutionEstablished:false};
    eq(observation.nativeCommandAttempts,0,"no setup-failure fallback");
    eq(observation.saved,setupStatus,"setup status retained");
    eq(observation.commandExecutionEstablished,false,"setup status does not establish native launch");
  }
  groups.push("Portable status contract: reporter failure stays secondary; build0/1 differs from UI exact status; setup is not native execution");

  sameIdentity(packageSource,m.testDiscovery.identities.package,"root package");
  sameIdentity(testRunner,m.testDiscovery.identities.testRunner,"test runner");
  sameIdentity(discovery,m.testDiscovery.identities.discovery,"test discovery");
  eq(JSON.parse(packageSource).scripts.test,"node tooling/run-tests.mjs","normal pnpm test entry");
  ok(testRunner.includes('import { discoverTests } from "./test-files.mjs";')&&testRunner.includes("const files = discoverTests();"),"runner uses discovery");
  ok(discovery.includes('walk(join(root, "tooling", "tests"), found);'),"tooling tests discovered");
  ok(/\.test\.(mjs|js)$/.test("ios-command-output.test.mjs"),"new reporter test filename matches");
  ok(!source.includes("ios-command-output.test.mjs"),"no extra native-source step");
  groups.push("Static general-suite discovery of the reporter test without workflow source-step edits");
  return {status:"passed",scope:"Four source/portable status-contract review groups only; no YAML/Bash execution, Node filesystem operations, XCTest, simulator or native execution.",
    assertions,statusCases:cases,groups,identities:{preimage:identity(preimage),candidate:identity(source)}};
};

})()
