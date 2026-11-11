/* Published PR62 composition review.
 * Evaluate this complete file in V8 to obtain a synchronous review function.
 * Pass exact decoded source strings for every key in expected, including the
 * final source-edits.json bytes as manifest. No filesystem or network is used.
 * review-checks.js is the unchanged earlier 06c/6f eight-group harness.
 */
(function () {
"use strict";
const utf8 = s=>{const out=[];for(const c of s){const n=c.codePointAt(0);if(n<128)out.push(n);else if(n<2048)out.push(192|(n>>6),128|(n&63));else if(n<65536)out.push(224|(n>>12),128|((n>>6)&63),128|(n&63));else out.push(240|(n>>18),128|((n>>12)&63),128|((n>>6)&63),128|(n&63));}return out;};
const git = function gitBlobSha(text) {
function utf8(value){const out=[];for(const ch of value){const c=ch.codePointAt(0);if(c<128)out.push(c);else if(c<2048)out.push(192|(c>>6),128|(c&63));else if(c<65536)out.push(224|(c>>12),128|((c>>6)&63),128|(c&63));else out.push(240|(c>>18),128|((c>>12)&63),128|((c>>6)&63),128|(c&63));}return out;}
const body=utf8(text), bytes=utf8("blob "+body.length+"\0").concat(body);
const len=bytes.length*8;bytes.push(128);while(bytes.length%64!==56)bytes.push(0);const high=Math.floor(len/4294967296),low=len>>>0;for(let n=3;n>=0;n--)bytes.push((high>>>(n*8))&255);for(let n=3;n>=0;n--)bytes.push((low>>>(n*8))&255);
let h0=0x67452301,h1=0xefcdab89,h2=0x98badcfe,h3=0x10325476,h4=0xc3d2e1f0;
const rol=(v,n)=>((v<<n)|(v>>>(32-n)))>>>0;
for(let o=0;o<bytes.length;o+=64){const w=new Uint32Array(80);for(let j=0;j<16;j++)w[j]=((bytes[o+j*4]<<24)|(bytes[o+j*4+1]<<16)|(bytes[o+j*4+2]<<8)|bytes[o+j*4+3])>>>0;for(let j=16;j<80;j++)w[j]=rol(w[j-3]^w[j-8]^w[j-14]^w[j-16],1);let a=h0,b=h1,c=h2,d=h3,e=h4;for(let j=0;j<80;j++){let f,k;if(j<20){f=(b&c)|((~b)&d);k=0x5a827999;}else if(j<40){f=b^c^d;k=0x6ed9eba1;}else if(j<60){f=(b&c)|(b&d)|(c&d);k=0x8f1bbcdc;}else{f=b^c^d;k=0xca62c1d6;}const temp=(rol(a,5)+f+e+k+w[j])>>>0;e=d;d=c;c=rol(b,30);b=a;a=temp;}h0=(h0+a)>>>0;h1=(h1+b)>>>0;h2=(h2+c)>>>0;h3=(h3+d)>>>0;h4=(h4+e)>>>0;}
return [h0,h1,h2,h3,h4].map(v=>v.toString(16).padStart(8,"0")).join("");
};
const sha = function sha256Bytes(input) {
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
const expected = {
  "native": {
    "gitBlob": "bdd64d6becb859622bd024fce036482fc668a91f",
    "bytes": 75735,
    "sha256": "ec39ba4ba9321f5ba9e5c94c2c652b3c578352a7889e83c82d8e0c333095cc0d"
  },
  "verifier": {
    "gitBlob": "d21bf8d24520183a61bf6b82879d78bd6a9d322f",
    "bytes": 114435,
    "sha256": "71714864b1f10d975b640b6bfa09b203509f419d1441469700e32b9074be98ae"
  },
  "readme": {
    "gitBlob": "ce95b08424288985ed6cb1e1b2169f67056941cc",
    "bytes": 19469,
    "sha256": "75beb83db383c90dea906e43c7b5a0618c6504453e472c10f15fb51335145094"
  },
  "nativePreimage": {
    "gitBlob": "353fa05f0f2e0e939538c7fbaacdcdb449f44bd8",
    "bytes": 60640,
    "sha256": "82da7f8af04c8d5681e0ab51b781b5b856b16be6964d23b9d8dd8c5976ec73e9"
  },
  "verifierPreimage": {
    "gitBlob": "f21e9349b35922ad689a2f6320ed651b5557de64",
    "bytes": 108899,
    "sha256": "066e1f55509f9e8cde7564c37a47b77e9f904f4d8ee34b381d1ce8cc8673ca8f"
  },
  "readmePreimage": {
    "gitBlob": "5978122a5d665c27ffeffe865e0fbae61b64a7ab",
    "bytes": 18487,
    "sha256": "6c5f944e748f38b27e2f3cdb4f4f1d85b7d494cbb1d2fb5275e2bf2a1e528ae1"
  },
  "legacyNativePreimage": {
    "gitBlob": "6f119bca252082f18f573370e853bf2e86128934",
    "bytes": 60268,
    "sha256": "83d8569de1b6e4fe1c895b51bf3c3292364d09c657acaef07be3e19ff9bf163f"
  },
  "legacyNative": {
    "gitBlob": "06c9494f7448efdc3af93216806411f67191956f",
    "bytes": 75363,
    "sha256": "fb067201b7af0c2dd641b48eea3e324ebce919f0e24a178c706f4c1b41ea3224"
  },
  "manifest": {
    "gitBlob": "9fb47225df6f3e82b7a40c8e48f3f2dc08284009",
    "bytes": 40941,
    "sha256": "8326c18166f8ab1f7cf7db860aa489040640df8da248c58335197c7bf6f6e526"
  }
};

function check(value, message) { if (!value) throw new Error(message); }
function identity(value, expected, name) {
  check(typeof value === "string", name + " must be an exact decoded source string");
  check(utf8(value).length === expected.bytes && git(value) === expected.gitBlob &&
    sha(utf8(value)).sha256 === expected.sha256, name + " identity mismatch");
}
function replaceOne(source, oldValue, newValue, name) {
  check(typeof oldValue === "string" && oldValue.length > 0 && typeof newValue === "string", name + " invalid transform");
  const at = source.indexOf(oldValue);
  check(at >= 0 && source.indexOf(oldValue, at + oldValue.length) < 0, name + " must match exactly once");
  return { text: source.slice(0, at) + newValue + source.slice(at + oldValue.length), at };
}
function verifyEdits(before, after, stages, name) {
  let current = before;
  const inverse = [];
  for (const stage of stages) for (const edit of stage.edits) {
    const next = replaceOne(current, edit.old, edit.replacement, name + ":" + edit.label);
    inverse.push({ at: next.at, oldValue: edit.old, newValue: edit.replacement });
    current = next.text;
  }
  check(current === after, name + " forward composition mismatch");
  for (const edit of inverse.reverse()) {
    check(current.slice(edit.at, edit.at + edit.newValue.length) === edit.newValue, name + " inverse span mismatch");
    current = current.slice(0, edit.at) + edit.oldValue + current.slice(edit.at + edit.newValue.length);
  }
  check(current === before, name + " inverse did not restore exact preimage");
  return inverse.length;
}
return function reviewPublishedComposition(inputs) {
  check(inputs && typeof inputs === "object", "inputs required");
  for (const [name, pinned] of Object.entries(expected)) identity(inputs[name], pinned, name);
  const manifest = JSON.parse(inputs.manifest);
  check(manifest.commit === "e08679769e471aba5403cd864c8a2fa2310b9086" &&
    manifest.parent === "057b3aa7a28c12594f26dd4bc9baf9bc636610e8" &&
    manifest.tree === "b4f409fbf1af7a5de5c4d2eab0c73bd55806d6de", "published identity metadata mismatch");
  const editCounts = {};
  for (const file of manifest.files) {
    check(expected[file.key].gitBlob === file.gitBlob &&
      expected[file.key + "Preimage"].gitBlob === file.preimage, file.key + " manifest identity mismatch");
    editCounts[file.key] = verifyEdits(inputs[file.key + "Preimage"], inputs[file.key], file.stages, file.key);
  }
  const activation = manifest.activationPatch.exactTransform;
  check(replaceOne(inputs.legacyNativePreimage, activation.old, activation.replacement, "external 057").text === inputs.nativePreimage,
    "057 is not the exact external activation change over 6f");
  check(replaceOne(inputs.legacyNative, activation.old, activation.replacement, "final composition").text === inputs.native,
    "bdd is not the exact external activation change over reviewed 06c");
  check(replaceOne(inputs.nativePreimage, activation.replacement, activation.old, "external inverse").text === inputs.legacyNativePreimage,
    "057 inverse mismatch");
  check(replaceOne(inputs.native, activation.replacement, activation.old, "final inverse").text === inputs.legacyNative,
    "bdd inverse mismatch");
  const anchor = 'SparkTestDriverRegisterCommand(@"tron.window"';
  for (const name of ["native", "nativePreimage"]) check(inputs[name].indexOf(anchor) >= 0 &&
    inputs[name].indexOf(anchor) === inputs[name].lastIndexOf(anchor), name + " activation anchor mismatch");
  check(inputs.native.slice(inputs.native.indexOf(anchor)) === inputs.nativePreimage.slice(inputs.nativePreimage.indexOf(anchor)),
    "the final activation registration/tail differs from 057");
  check(inputs.native.length - inputs.legacyNative.length ===
    inputs.nativePreimage.length - inputs.legacyNativePreimage.length, "activation delta sizes differ");
  return {
    status: "passed",
    groups: [{ name: "published 057 composition, exact three-file inverses and inherited activation preservation", status: "passed" }],
    metrics: { editCounts, externalActivationDeltaBytes: utf8(inputs.nativePreimage).length - utf8(inputs.legacyNativePreimage).length,
      finalNativeBytes: utf8(inputs.native).length, finalVerifierBytes: utf8(inputs.verifier).length, finalReadmeBytes: utf8(inputs.readme).length },
    preservedEarlierHarness: "18b6d60c24d99fcc45a323e1e4a891dd98a0bd0d",
    scope: "Composition-only V8 source/hash checks. The original eight static/mock-command designs are retained separately and not rerun by this script. No Node, Objective-C++, AppKit or native execution."
  };
};

})();
