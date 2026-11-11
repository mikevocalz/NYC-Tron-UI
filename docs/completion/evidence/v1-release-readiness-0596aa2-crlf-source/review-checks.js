// Evaluate this file as a function expression and call it with exact {source, preimage, workflow, manifest} strings.
(function releaseReadinessLineEndingReview(input) {
const git = function gitBlobSha(text) {
function utf8(value){const out=[];for(const ch of value){const c=ch.codePointAt(0);if(c<128)out.push(c);else if(c<2048)out.push(192|(c>>6),128|(c&63));else if(c<65536)out.push(224|(c>>12),128|((c>>6)&63),128|(c&63));else out.push(240|(c>>18),128|((c>>12)&63),128|((c>>6)&63),128|(c&63));}return out;}
const body=utf8(text), bytes=utf8("blob "+body.length+"\0").concat(body);
const len=bytes.length*8;bytes.push(128);while(bytes.length%64!==56)bytes.push(0);const high=Math.floor(len/4294967296),low=len>>>0;for(let n=3;n>=0;n--)bytes.push((high>>>(n*8))&255);for(let n=3;n>=0;n--)bytes.push((low>>>(n*8))&255);
let h0=0x67452301,h1=0xefcdab89,h2=0x98badcfe,h3=0x10325476,h4=0xc3d2e1f0;
const rol=(v,n)=>((v<<n)|(v>>>(32-n)))>>>0;
for(let o=0;o<bytes.length;o+=64){const w=new Uint32Array(80);for(let j=0;j<16;j++)w[j]=((bytes[o+j*4]<<24)|(bytes[o+j*4+1]<<16)|(bytes[o+j*4+2]<<8)|bytes[o+j*4+3])>>>0;for(let j=16;j<80;j++)w[j]=rol(w[j-3]^w[j-8]^w[j-14]^w[j-16],1);let a=h0,b=h1,c=h2,d=h3,e=h4;for(let j=0;j<80;j++){let f,k;if(j<20){f=(b&c)|((~b)&d);k=0x5a827999;}else if(j<40){f=b^c^d;k=0x6ed9eba1;}else if(j<60){f=(b&c)|(b&d)|(c&d);k=0x8f1bbcdc;}else{f=b^c^d;k=0xca62c1d6;}const temp=(rol(a,5)+f+e+k+w[j])>>>0;e=d;d=c;c=rol(b,30);b=a;a=temp;}h0=(h0+a)>>>0;h1=(h1+b)>>>0;h2=(h2+c)>>>0;h3=(h3+d)>>>0;h4=(h4+e)>>>0;}
return [h0,h1,h2,h3,h4].map(v=>v.toString(16).padStart(8,"0")).join("");
};
const expected = {"source":"d5f217076df126f8160982d07db05e8cee288889","preimage":"62ba8325d3695a6e04e2144f70748f72327abf90","workflow":"bc0460ccb6dd3b0dbcbaa1cd1801e69a2a20bd0c","manifest":"77216836f4b837e237504ab0dae035a911c3cca9"};

  const need = (condition, message) => { if (!condition) throw new Error(message); };
  for (const key of ["source", "preimage", "workflow", "manifest"]) {
    need(typeof input[key] === "string", key + " must be exact source text");
    need(git(input[key]) === expected[key], key + " Git blob mismatch");
  }
  const manifest = JSON.parse(input.manifest);
  need(manifest.transforms.length === 1, "Expected one test-only transform");
  const { before, after } = manifest.transforms[0];
  const replaceOnce = (value, oldText, newText) => {
    need(value.split(oldText).length === 2, "Transform must have one exact occurrence");
    return value.replace(oldText, () => newText);
  };
  need(replaceOnce(input.preimage, before, after) === input.source, "Forward transform mismatch");
  need(replaceOnce(input.source, after, before) === input.preimage, "Inverse transform mismatch");
  need(manifest.protectedFiles[0].git === git(input.workflow), "Protected workflow identity mismatch");
  const groups = ["exact source identities and one-transform inverse"];

  const marker = 'test("manual candidate runs cannot publish without explicit opt-in, even when every gate passes", () => {\n';
  const fileExpression = 'new URL("../../.github/workflows/release.yml", import.meta.url)';
  function runTest(source, yaml) {
    need(source.split(marker).length === 2, "Expected the exact named test");
    const suffix = source.slice(source.indexOf(marker) + marker.length);
    need(suffix.endsWith("});\n"), "Expected the final test body");
    let testBody = suffix.slice(0, -4);
    testBody = replaceOnce(testBody, fileExpression, '"fixed-release-workflow"');
    let reads = 0, evaluations = 0;
    const assert = {
      ok(value, message) { need(!!value, message || "assert.ok failed"); },
      match(value, expression) { need(typeof value === "string" && expression.test(value), "assert.match failed: " + expression); },
      equal(actual, expectedValue, message) { need(Object.is(actual, expectedValue), message || "assert.equal failed"); },
    };
    const readFileSync = (path, encoding) => {
      need(path === "fixed-release-workflow" && encoding === "utf8", "Unexpected file read");
      reads++;
      return yaml;
    };
    // V8 substitute for node:vm only. The unchanged test's eight typed contexts
    // evaluate the extracted expression; this is not a Node or Actions run.
    const runInNewContext = (expression, context) => {
      evaluations++;
      return new Function("github", "inputs", "success", "return (" + expression + ");")(
        context.github, context.inputs, context.success);
    };
    new Function("readFileSync", "assert", "runInNewContext", testBody)(
      readFileSync, assert, runInNewContext);
    need(reads === 1, "Expected one mocked workflow read");
    need(evaluations === 8, "The eight original publication cases must remain active");
    return { reads, evaluations };
  }
  function rejected(source, yaml, expectedMessage) {
    let failure;
    try { runTest(source, yaml); } catch (error) { failure = error; }
    need(failure instanceof Error, "Unsafe or malformed workflow unexpectedly passed");
    if (expectedMessage) need(failure.message === expectedMessage, "Unexpected failure: " + failure.message);
    return failure.message;
  }
  need(!input.workflow.includes("\r"), "Pinned workflow must be LF");
  const crlf = value => value.replace(/\n/g, "\r\n");
  const baselineLF = runTest(input.preimage, input.workflow);
  const baselineCRLF = rejected(input.preimage, crlf(input.workflow), "manual publication must have an explicit input");
  groups.push("original LF passes and CRLF reproduces the observed assertion");
  const correctedLF = runTest(input.source, input.workflow);
  const correctedCRLF = runTest(input.source, crlf(input.workflow));
  groups.push("corrected LF and CRLF each evaluate all eight original publication cases");

  const publishBlock = input.workflow.match(/^      publish:\n(?:        .*\n)+/m)?.[0];
  need(publishBlock, "Missing positive fixture input block");
  const publicationCondition = input.workflow.match(/^        if: success\(\) && \(github\.event_name == 'push'.+$/m)?.[0];
  need(publicationCondition, "Missing positive fixture publishing condition");
  const malformedInputs = [
    ["missing publish input", replaceOnce(input.workflow, publishBlock, "")],
    ["wrong input type", replaceOnce(input.workflow, "        type: boolean\n", "        type: string\n")],
    ["unsafe default", replaceOnce(input.workflow, "        default: false\n", "        default: true\n")],
  ];
  const weakenedGuards = [
    ["missing mutation guard", replaceOnce(input.workflow, publicationCondition + "\n", "")],
    ["unconditional mutation guard", replaceOnce(input.workflow, publicationCondition, "        if: true")],
    ["missing explicit opt-in", replaceOnce(input.workflow, " && inputs.publish == true", "")],
    ["missing successful gates", replaceOnce(input.workflow, "if: success() && (github.event_name", "if: (github.event_name")],
  ];
  let negativeChecks = 0;
  for (const [name, yaml] of malformedInputs) {
    for (const variant of [yaml, crlf(yaml)]) { rejected(input.source, variant); negativeChecks++; }
  }
  groups.push("missing input, wrong type and unsafe default remain rejected in both encodings");
  for (const [name, yaml] of weakenedGuards) {
    for (const variant of [yaml, crlf(yaml)]) { rejected(input.source, variant); negativeChecks++; }
  }
  groups.push("missing, unconditional, opt-in-free and success-free guards remain rejected in both encodings");
  return {
    status: "passed",
    scope: "V8 execution of the exact final test body with mocked readFileSync/assert/node:vm; no Node, Git checkout, GitHub Actions or Windows execution",
    groups,
    baselineLF,
    baselineCRLF,
    correctedLF,
    correctedCRLF,
    negativeChecks,
    workflowUntouched: git(input.workflow) === expected.workflow,
  };
})
