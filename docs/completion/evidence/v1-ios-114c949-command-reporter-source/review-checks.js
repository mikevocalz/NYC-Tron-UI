(function() {
const H = eval("(() => {\nfunction utf8(s) {\n const out=[];\n for(const c of s) {\n  let p=c.codePointAt(0); if(p>=0xd800&&p<=0xdfff)p=0xfffd;\n  if(p<0x80)out.push(p);\n  else if(p<0x800)out.push(0xc0|(p>>>6),0x80|(p&63));\n  else if(p<0x10000)out.push(0xe0|(p>>>12),0x80|((p>>>6)&63),0x80|(p&63));\n  else out.push(0xf0|(p>>>18),0x80|((p>>>12)&63),0x80|((p>>>6)&63),0x80|(p&63));\n }\n return new Uint8Array(out);\n}\nfunction bytes(v){return typeof v===\"string\"?utf8(v):new Uint8Array(v);}\nfunction padded(v){\n const input=bytes(v),p=new Uint8Array(Math.ceil((input.length+9)/64)*64);\n p.set(input);p[input.length]=0x80;\n let bits=BigInt(input.length)*8n;\n for(let i=0;i<8;i++){p[p.length-1-i]=Number(bits&255n);bits>>=8n;}\n return p;\n}\nconst hex=w=>(w>>>0).toString(16).padStart(8,\"0\");\nconst rol=(x,n)=>(x<<n)|(x>>>(32-n));\nconst ror=(x,n)=>(x>>>n)|(x<<(32-n));\nfunction sha1(v){\n const p=padded(v),w=new Uint32Array(80);\n let a0=0x67452301,b0=0xefcdab89,c0=0x98badcfe,d0=0x10325476,e0=0xc3d2e1f0;\n for(let off=0;off<p.length;off+=64){\n  for(let i=0;i<16;i++){const q=off+i*4;w[i]=((p[q]<<24)|(p[q+1]<<16)|(p[q+2]<<8)|p[q+3])>>>0;}\n  for(let i=16;i<80;i++)w[i]=rol(w[i-3]^w[i-8]^w[i-14]^w[i-16],1)>>>0;\n  let a=a0,b=b0,c=c0,d=d0,e=e0;\n  for(let i=0;i<80;i++){\n   let f,k;\n   if(i<20){f=(b&c)|((~b)&d);k=0x5a827999;}\n   else if(i<40){f=b^c^d;k=0x6ed9eba1;}\n   else if(i<60){f=(b&c)|(b&d)|(c&d);k=0x8f1bbcdc;}\n   else{f=b^c^d;k=0xca62c1d6;}\n   const t=(rol(a,5)+f+e+k+w[i])>>>0;\n   e=d;d=c;c=rol(b,30)>>>0;b=a;a=t;\n  }\n  a0=(a0+a)>>>0;b0=(b0+b)>>>0;c0=(c0+c)>>>0;d0=(d0+d)>>>0;e0=(e0+e)>>>0;\n }\n return [a0,b0,c0,d0,e0].map(hex).join(\"\");\n}\nconst K=new Uint32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);\nfunction sha256(v){\n const p=padded(v),w=new Uint32Array(64);\n let state=new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);\n for(let off=0;off<p.length;off+=64){\n  for(let i=0;i<16;i++){const q=off+i*4;w[i]=((p[q]<<24)|(p[q+1]<<16)|(p[q+2]<<8)|p[q+3])>>>0;}\n  for(let i=16;i<64;i++){const x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(ror(x,7)^ror(x,18)^(x>>>3))+w[i-7]+(ror(y,17)^ror(y,19)^(y>>>10)))>>>0;}\n  let [a,b,c,d,e,f,g,h]=state;\n  for(let i=0;i<64;i++){\n   const t1=(h+(ror(e,6)^ror(e,11)^ror(e,25))+((e&f)^((~e)&g))+K[i]+w[i])>>>0;\n   const t2=((ror(a,2)^ror(a,13)^ror(a,22))+((a&b)^(a&c)^(b&c)))>>>0;\n   h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;\n  }\n  const next=[a,b,c,d,e,f,g,h];for(let i=0;i<8;i++)state[i]=(state[i]+next[i])>>>0;\n }\n return Array.from(state).map(hex).join(\"\");\n}\nfunction blob(s){const b=utf8(s),head=utf8(\"blob \"+b.length+\"\\0\"),all=new Uint8Array(head.length+b.length);all.set(head);all.set(b,head.length);return sha1(all);}\nreturn {utf8,sha1,sha256,blob};\n})()");
function makeReviewRuntime(H, pathStyle) {
  function decode(bytes) {
    let out="";
    for(let i=0;i<bytes.length;) {
      const a=bytes[i]; if(a<128){out+=String.fromCharCode(a);i++;continue;}
      const n=a>=0xc2&&a<=0xdf?2:a>=0xe0&&a<=0xef?3:a>=0xf0&&a<=0xf4?4:0;
      if(!n||i+n>bytes.length){out+="\ufffd";i++;continue;}
      let cp=a&((1<<(7-n))-1), valid=true;
      for(let j=1;j<n;j++){if((bytes[i+j]&0xc0)!==0x80){valid=false;break;}cp=(cp<<6)|(bytes[i+j]&63);}
      if(!valid||cp<([0,0,128,2048,65536][n])||cp>0x10ffff||(cp>=0xd800&&cp<=0xdfff)){out+="\ufffd";i++;continue;}
      out+=String.fromCodePoint(cp);i+=n;
    } return out;
  }
  class ByteBuffer extends Uint8Array {
    static from(value,encoding) { if(typeof value==="string"){if(encoding==="hex"){const a=[];for(let i=0;i<value.length;i+=2)a.push(parseInt(value.slice(i,i+2),16));return new ByteBuffer(a);}return new ByteBuffer(H.utf8(value));} return new ByteBuffer(value); }
    static alloc(n) { return new ByteBuffer(n); }
    static byteLength(value) { return typeof value==="string"?H.utf8(value).length:value.length; }
    static concat(parts) { const out=new ByteBuffer(parts.reduce((n,p)=>n+p.length,0));let at=0;for(const p of parts){out.set(p,at);at+=p.length;}return out; }
    static isBuffer(value) { return value instanceof ByteBuffer; }
    equals(other) { return this.length===other.length&&this.every((x,i)=>x===other[i]); }
    toString(encoding="utf8") { return encoding==="hex"?Array.from(this,x=>x.toString(16).padStart(2,"0")).join(""):decode(this); }
  }
  const createHash = algorithm => { if(algorithm!=="sha256")throw Error("unreviewed hash");const parts=[];return {update(x){parts.push(ByteBuffer.from(x));return this;},digest(encoding){if(encoding!=="hex")throw Error("unreviewed digest");return H.sha256(ByteBuffer.concat(parts));}}; };
  const posix = (...parts) => { const out=[];for(const p of parts.join("/").replace(/\\/g,"/").split("/")){if(!p||p===".")continue;if(p==="..")out.pop();else out.push(p);}return "/"+out.join("/"); };
  const join=(...parts)=>pathStyle==="windows-separators"?posix(...parts).replace(/\//g,"\\"):posix(...parts);
  const resolve=(...parts)=>pathStyle==="windows-separators"?"C:"+join(...parts):posix(...parts);
  const isAbsolute=value=>typeof value==="string"&&(pathStyle==="windows-separators"?/^(?:[A-Za-z]:[\\/]|[\\/])/.test(value):value.startsWith("/"));
  return {Buffer:ByteBuffer,createHash,resolve,join,isAbsolute,pathToFileURL:p=>({href:"file://"+p}),process:{argv:["node","/review.test.mjs"],exitCode:undefined,stdout:{write(){throw Error("unmocked stdout");}}},fs:{}};
}

return async function reviewIOSCommandReporter({source,tests}) {
  const expected = {"source":{"gitBlob":"114c9490410b7b1598b6ec416b14a35cfb3dc233","bytes":21491,"sha256":"399a09ca060a67892e7f70ff1fa5a025d4aa5ff962a0223d33cb86ef485cb17a"},"tests":{"gitBlob":"e240477f92344c1ef506c0afbc27aff60e407e52","bytes":15584,"sha256":"efaee3ad37508eea6b2c9575e3f7b6373b8d14735f5c1d1050925487806dbe09"}};
  for (const [name, text] of Object.entries({source,tests})) {
    if(typeof text!=="string"||H.blob(text)!==expected[name].gitBlob||H.utf8(text).length!==expected[name].bytes||H.sha256(text)!==expected[name].sha256)throw Error("exact input identity: "+name);
  }
  const parsed=source.replace(/^import[^\n]*\n/gm,"").replace(/\bexport /g,"");
  new Function(parsed.replace(/import\.meta\.url/g,'"file:///syntax-only"'));
  const cutoff=parsed.lastIndexOf("if (process.argv[1]");
  if(cutoff<0)throw Error("entrypoint boundary");
  const testBody=tests.replace(/^import[\s\S]*?;\n/gm,"");
  new Function(testBody);
  const reproductions=[];
  for(const pathModel of ["posix","windows-separators"]) {
    const rt=makeReviewRuntime(H,pathModel),keys=Object.keys(rt);
    const api=new Function(...keys,parsed.slice(0,cutoff)+"\nreturn {IOS_COMMAND_LIMITS,readIOSCommandFile,projectIOSCommands,projectIOSJUnit,collectIOSCommandOutput,encodeIOSCommandEnvelope,reportIOSCommandOutput};")(...keys.map(k=>rt[k]));
    const groups=[];let assertions=0;
    const structural=(a,b)=>{if(Object.is(a,b))return true;if(!a||!b||typeof a!=="object"||typeof b!=="object")return false;const ak=Object.keys(a),bk=Object.keys(b);return ak.length===bk.length&&ak.every(k=>Object.hasOwn(b,k)&&structural(a[k],b[k]));};
    const assert={
      equal(a,b,message){assertions++;if(!Object.is(a,b))throw Error(pathModel+": "+(message||"equal")+" "+String(a)+" != "+String(b));},
      notEqual(a,b,message){assertions++;if(Object.is(a,b))throw Error(pathModel+": "+(message||"notEqual"));},
      deepEqual(a,b,message){assertions++;if(!structural(a,b))throw Error(pathModel+": "+(message||"deepEqual"));},
      ok(value,message){assertions++;if(!value)throw Error(pathModel+": "+(message||"ok"));},
    };
    const params={...api,test:(name,fn)=>groups.push({name,fn}),assert,createHash:rt.createHash,Buffer:rt.Buffer,process:rt.process};
    const testKeys=Object.keys(params);
    const fixtures=new Function(...testKeys,testBody+"\nreturn {memoryIO,uiFixture};")(...testKeys.map(k=>params[k]));
    const results=[];
    for(const group of groups){await group.fn();results.push({name:group.name,status:"passed"});}
    const output=[],observed=api.reportIOSCommandOutput(["ui","1","/owned-consumer"],{io:fixtures.uiFixture().io,emit:value=>output.push(value)});
    reproductions.push({pathModel,status:"passed",designCount:groups.length,assertions,groups:results,
      ordinaryEnvelopeBytes:H.utf8(output[0]).length,summaryBytes:observed.receipt.bytes});
  }
  if(reproductions.some(result=>result.designCount!==8))throw Error("same design count");
  return {status:"passed",designCount:8,reproductions,
    scope:"The same eight authored Node unit-test designs evaluated under POSIX and Windows-separator path models in V8, with explicit Buffer/crypto/path/assert shims and mocked file IO. These are environment variants, not sixteen independent designs; no Node process, real filesystem, actual Windows/macOS, shell, XCTest, native UI, simulator or iOS execution."};
};
})()
