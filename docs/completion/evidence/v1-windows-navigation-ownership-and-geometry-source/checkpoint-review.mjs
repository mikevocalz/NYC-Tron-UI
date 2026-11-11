// Pure JavaScript source-contract checks only. No PowerShell parsing/execution,
// Node filesystem, UIA, Win32 or native process is exercised.
// Evaluate this file to obtain the function, then call with exact
// { source, preimage, manifest } strings fetched by their immutable Git blob IDs.
(function reviewNavigationCheckpoints(input) {
  "use strict";
  const {source, preimage, manifest} = input;
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
  const hash = function sha256Bytes(input) {
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
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  const results = [];
  const record = typeof manifest === "string" ? JSON.parse(manifest) : manifest;
  const prefix = "NYCTRON_NAVIGATION_CHECKPOINT ";
  const labels = ["rtl-status-before","rtl-status-returned","rtl-toggle-poll-before","rtl-toggle-poll-returned","rtl-pane-bounds-before","rtl-pane-bounds-returned","rtl-host-bounds-before","rtl-host-bounds-returned","rtl-selection-before","rtl-selection-returned","rtl-screenshot-before","rtl-screenshot-returned","navigation-catch-entered","navigation-finally-entered","restore-contrast-before","restore-contrast-returned","restore-window-before","restore-window-returned","navigation-result-before","navigation-result-returned"];
  function uniqueReplace(text, before, after, name) {
    check(typeof before === "string" && before.length > 0 && typeof after === "string", "Invalid replacement: " + name);
    check(text.split(before).length === 2, "Nonunique source anchor: " + name);
    return text.replace(before, () => after);
  }
  function result(name, fn) { fn(); results.push({name, status:"passed"}); }
  result("exact source identities and reversible ten-edit manifest", () => {
    check(git(preimage) === "cb69ad47c11d6b868957a2a72feb8fb27319d975", "Wrong preimage");
    check(git(source) === "c998f9f2f534db692a0ba2ab7296c4a78077086c", "Wrong source");
    check(record.schemaVersion === 1 && record.transforms.length === 10, "Wrong manifest");
    for (const [value, identity] of [[preimage,record.before],[source,record.after]]) {
      check(git(value) === identity.gitBlob && utf8(value).length === identity.bytes && hash(utf8(value)).sha256 === identity.sha256, "Manifest identity mismatch");
    }
    let rebuilt = preimage;
    for (const edit of record.transforms) rebuilt = uniqueReplace(rebuilt, edit.before, edit.after, edit.name);
    check(rebuilt === source, "Forward reconstruction differs");
    let restored = source;
    for (const edit of [...record.transforms].reverse()) restored = uniqueReplace(restored, edit.after, edit.before, edit.name);
    check(restored === preimage, "Inverse differs");
  });
  const helperStart = source.indexOf("# Fixed call sites outside loops");
  const helperEnd = source.indexOf("$ae = [System.Windows.Automation.AutomationElement]", helperStart);
  check(helperStart >= 0 && helperEnd > helperStart, "Helper boundary missing");
  const helper = source.slice(helperStart, helperEnd);
  const calls = [...source.matchAll(/^\s*Write-NavigationCheckpoint "([^"]+)"$/gm)].map(match => match[1]);
  result("closed fixed labels and conservative 1092-byte emission bound", () => {
    check(calls.length === 20 && new Set(calls).size === 20, "Unexpected call count or repeated label");
    check(calls.every(label => labels.includes(label)), "Unexpected checkpoint label");
    check(labels.every(label => calls.includes(label)), "Missing checkpoint label");
    const allowed = helper.match(/if \(\$label -notin @\(([\s\S]*?)\n    \)\)/);
    check(allowed !== null, "Closed helper allowlist missing");
    const helperLabels = [...allowed[1].matchAll(/"([^"]+)"/g)].map(match => match[1]);
    check(JSON.stringify(helperLabels) === JSON.stringify(labels), "Allowlist differs from fixed labels");
    check(labels.every(label => /^[a-z-]+$/.test(label)), "A fixed label is not ASCII");
    check(helper.includes('Write-Host ("' + prefix + '" + $label)'), "Unexpected output expression");
    check((helper.match(/Write-Host/g) || []).length === 1 && helper.includes("} catch {}"), "Reporting isolation differs");
    check(!/\$Window|\$OutDir|\$process|Get-Date|System\.|Get-Item|Get-Content|Set-Content|AppendAllText|ReadAll|WriteAll|Start-Process|Invoke-Button|Find-/.test(helper), "Reporting helper queries application or filesystem state");
    const bytes = labels.reduce((sum, label) => sum + utf8(prefix + label + "\r\n").length, 0);
    check(bytes === 1092 && record.console.maximumFixedContentUtf8BytesIncludingCRLF === bytes, "Emission bound changed");
  });
  result("all original operations survive removal of diagnostic-only statements", () => {
    let stripped = source.slice(0,helperStart) + source.slice(helperEnd);
    stripped = stripped.replace(/^[ \t]*Write-NavigationCheckpoint "[^"]+"\n/gm, "");
    stripped = uniqueReplace(stripped,
      "  $paneRect = $pane.Current.BoundingRectangle\n  $hostRect = $Window.Current.BoundingRectangle\n",
      "  $paneRect = $pane.Current.BoundingRectangle; $hostRect = $Window.Current.BoundingRectangle\n",
      "rejoin original bounds expression");
    check(stripped === preimage, "Original action, assertion, deadline, restoration or C# bytes changed");
    const csharpClose = '\n"@ -ReferencedAssemblies System, System.Drawing\n';
    const csharpEnd = preimage.indexOf(csharpClose);
    check(csharpEnd >= 0 && source.slice(0,csharpEnd + csharpClose.length) === preimage.slice(0,csharpEnd + csharpClose.length), "C# source changed");
  });
  result("loop and error-path placement stays observational", () => {
    const rtlLoop = '  $deadline = (Get-Date).AddSeconds(10)\n  do {\n    Start-Sleep -Milliseconds 100\n    $rtl = (Find-Id "TogglePaneButton").Current.BoundingRectangle\n  } while ($rtl.X -le $ltr.X+20 -and (Get-Date) -lt $deadline)\n';
    check(preimage.includes(rtlLoop) && source.includes('  Write-NavigationCheckpoint "rtl-toggle-poll-before"\n' + rtlLoop + '  Write-NavigationCheckpoint "rtl-toggle-poll-returned"\n'), "RTL loop was instrumented internally or moved");
    const restoreStart = preimage.indexOf("    $deadline = (Get-Date).AddSeconds(10)\n", preimage.indexOf('} finally {', preimage.indexOf('  $result = "passed"')));
    const restoreEnd = preimage.indexOf('    if (-not $restored)', restoreStart);
    check(restoreStart >= 0 && restoreEnd > restoreStart && source.includes(preimage.slice(restoreStart,restoreEnd)), "Restoration loop changed");
    check(!/\b(?:for|foreach|while|do)\s*\(/.test(helper), "Reporting helper added a loop");
    check(source.includes('  $failure = $_.Exception.Message\n  Write-NavigationCheckpoint "navigation-catch-entered"\n  throw\n} finally {\n  Write-NavigationCheckpoint "navigation-finally-entered"\n'), "Failure capture or throw order changed");
    check(source.includes('    Wait-Contrast (($contrast.Flags -band 1) -ne 0) | Out-Null\n    Write-NavigationCheckpoint "restore-contrast-returned"\n  } catch {'), "Contrast marker can falsely report a caught failure as returned");
    check(source.includes('    if (-not $restored) { throw "Actual window bounds/state did not return to their original values" }\n    Write-NavigationCheckpoint "restore-window-returned"\n  } catch {'), "Window marker can falsely report a caught failure as returned");
    check(source.includes('    ConvertTo-Json -Depth 8 | Set-Content (Join-Path $OutDir "navigation-accessibility-result.json") -Encoding UTF8\n  Write-NavigationCheckpoint "navigation-result-returned"\n'), "Result marker precedes existing pipeline return");
  });
  return {status:"passed", scope:"V8 source-contract checks only; not PowerShell parsing/runtime or native execution", sourceBytes:utf8(source).length, groups:results, fixedCallSites:calls.length, maximumFixedContentUtf8BytesIncludingCRLF:1092, runnerDecorationIncluded:false};
})
