import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,symlinkSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {applyStabilityReview,stabilityProposalDigest,sourceFingerprint} from '../library-components.mjs';
import {validateLibraryManifest,validateLibraryReadiness,validateLibraryReceipt,safeEvidenceFile} from '../library-readiness.mjs';
import {libraryFixture,sha} from './fixtures/library-release.mjs';
const ready=f=>validateLibraryReadiness({...f,version:'1.0.0',artifacts:{hashes:f.hashes}},f);
const context=f=>({base:f.rootDir,rootDir:f.rootDir,version:'1.0.0',sourceCommit:f.source.sourceCommit,manifestSha256:f.evidence.receipts[0].manifestSha256,archiveHashes:new Map(f.hashes)});

test('pending owner labels remain null; proposal readiness never passes',t=>{
 const f=libraryFixture(t,{confirmed:false});const result=ready(f);
 assert.equal(result.status,'blocked');assert.equal(result.planningOnly,true);assert.equal(result.stableCount,0);
 assert.ok(f.manifest.components.every(c=>c.stability===null));assert.match(result.blockers.join(' '),/confirmation is pending/);
});
test('owner label map binds every export and proposal to an explicit owner decision',t=>{
 const f=libraryFixture(t),pending={...f.manifest,ownerConfirmation:'pending',components:f.manifest.components.map(c=>({...c,stability:null,ownerConfirmation:'pending'}))};
 for(const mutate of [r=>{r.approval.proposalSha256='a'.repeat(64)},r=>{delete r.approval.labels[pending.components[0].id]},r=>{r.approval.labels.extra='stable'},r=>{r.approval.reviewer='someone'},r=>{r.approval.decision=''},r=>{for(const id of Object.keys(r.approval.labels))r.approval.labels[id]='preview'}]){
  const review=structuredClone(f.decision);mutate(review);assert.throws(()=>applyStabilityReview(pending,review),/stability|stable|owner/);
 }
 const changed=structuredClone(pending);changed.components[0].proposedStability=changed.components[0].proposedStability==='stable'?'preview':'stable';assert.notEqual(stabilityProposalDigest(pending),stabilityProposalDigest(changed));
 assert.throws(()=>applyStabilityReview(changed,f.decision),/different export\/proposal/);
 assert.throws(()=>applyStabilityReview(pending,{schemaVersion:1,status:'pending',approval:{}}),/must not claim/);
});
test('stable missing evidence blocks while preview runtime evidence is not required',t=>{
 const missing=libraryFixture(t);missing.evidence.receipts=[];assert.equal(ready(missing).status,'blocked');
 const f=libraryFixture(t,{previewOne:true}),result=ready(f);
 assert.equal(result.previewCount,1);assert.equal(result.stableCount,15);assert.equal(result.status,'passed');
 const preview=f.manifest.components.find(c=>c.stability==='preview');
 assert.ok(f.evidence.receipts.every(r=>r.components.every(c=>c.imports.every(i=>i.path!==preview.importPath))));
});
test('complete synthetic fixture passes without mutating records',t=>{const f=libraryFixture(t),before=JSON.stringify(f.manifest);assert.equal(ready(f).status,'passed');assert.equal(JSON.stringify(f.manifest),before);});
test('public export deletion cannot reduce the required inventory',t=>{const f=libraryFixture(t);f.manifest.components.pop();f.manifest.summary.componentCount--;assert.throws(()=>validateLibraryManifest(f.manifest,f),/complete public export inventory|component count/);});
test('receipt rejects wrong candidate/archive, stale source, unrun checks and changed artifact bytes',t=>{
 const f=libraryFixture(t),base=f.evidence.receipts.find(r=>r.platform==='web');
 for(const mutate of [r=>{r.candidate.version='1.0.1'},r=>{r.candidate.sourceCommit='b'.repeat(40)},r=>{r.candidate.sourceDirty=true},r=>{r.candidate.archives[0].sha256='b'.repeat(64)},r=>{r.manifestSha256='b'.repeat(64)},r=>{r.runner.exitCode=1},r=>{r.runner.testSha256='b'.repeat(64)},r=>{r.assertions.skipped=1},r=>{r.components[0].imports[0].rendered=false},r=>{r.components.find(c=>c.symbol==='Button').imports[0].assertedStates=['irrelevant']}]){
  const receipt=structuredClone(base);mutate(receipt);assert.throws(()=>validateLibraryReceipt(receipt,context(f)),/receipt|artifact/);
 }
 writeFileSync(join(f.rootDir,'proof/test.log'),'tampered');assert.throws(()=>validateLibraryReceipt(base,context(f)),/checksum mismatch/);
});
test('proof for another export does not satisfy the selected component',t=>{
 const f=libraryFixture(t);for(const r of f.evidence.receipts)for(const c of r.components)for(const i of c.imports)i.path='@nyc-tron/other';
 assert.equal(ready(f).status,'blocked');assert.ok(ready(f).components.every(c=>c.missing.includes('web')));
});
test('dirty source is reported as a release blocker',t=>{const f=libraryFixture(t);f.source.sourceDirty=true;assert.match(ready(f).blockers.join(' '),/clean source commit/);});
test('evidence paths cannot escape through traversal or symlinks',t=>{
 const f=libraryFixture(t);assert.throws(()=>safeEvidenceFile(f.rootDir,'../outside'),/unsafe/);
 const outside=mkdtempSync(join(tmpdir(),'tron-proof-outside-'));t.after(()=>rmSync(outside,{recursive:true,force:true}));writeFileSync(join(outside,'proof.txt'),'outside fixture');
 try {symlinkSync(outside,join(f.rootDir,'escaping'),process.platform==='win32'?'junction':'dir');}
 catch(error){if(['EPERM','EACCES','ENOSYS'].includes(error.code)){t.diagnostic('Alias assertion unavailable on this filesystem; traversal guard above executed.');return;}throw error;}
 assert.throws(()=>safeEvidenceFile(f.rootDir,'escaping/proof.txt'),/escaping/);
});
test('owner distribution algorithms and exact archive byte binding remain unchanged',()=>{
 const source=readFileSync(new URL('../release-readiness.mjs',import.meta.url),'utf8');
 const preserved=source.slice(source.indexOf('export function releaseChannel'),source.indexOf('/** Read-only gate.'));
 assert.equal(sourceFingerprint(preserved),'8adb0b6e9b39a4b4290b65a13431f9ea4061dea9b362fe08d311b5be94dd6f76');
});

test('source immutability hash accepts CRLF checkouts but detects changed owner logic',()=>{
 const text=readFileSync(new URL('../release-readiness.mjs',import.meta.url),'utf8').replace(/\r\n/g,'\n');
 const protectedPart=value=>value.slice(value.indexOf('export function releaseChannel'),value.indexOf('/** Read-only gate.'));
 assert.equal(sourceFingerprint(protectedPart(text.replace(/\n/g,'\r\n'))),sourceFingerprint(protectedPart(text)));
 assert.notEqual(sourceFingerprint(protectedPart(text.replace('invalid release version','changed validation'))),sourceFingerprint(protectedPart(text)));
});

test('documentation binds page, source, data and example bytes to executed verification',t=>{
 const f=libraryFixture(t);f.write(f.documentation.components[0].example,'// changed after verification\n');
 assert.equal(ready(f).status,'blocked');assert.match(ready(f).blockers.join(' '),/checksum mismatch/);
});
test('documentation receipt cannot borrow route or example proof from another manifest',t=>{
 const f=libraryFixture(t);const path='website/generated/verification.json',receipt=JSON.parse(readFileSync(join(f.rootDir,path),'utf8'));receipt.manifestSha256='b'.repeat(64);f.write(path,receipt);assert.match(ready(f).blockers.join(' '),/for this manifest/);
});
test('structured results must agree with the claimed assertions and import coverage',t=>{
 const f=libraryFixture(t),receipt=f.evidence.receipts[0],artifact=receipt.artifacts[0];
 const result=JSON.parse(readFileSync(join(f.rootDir,artifact.path),'utf8'));result.assertions.passed=999;f.write(artifact.path,result);artifact.sha256=sha(readFileSync(join(f.rootDir,artifact.path)));
 assert.throws(()=>validateLibraryReceipt(receipt,context(f)),/actual structured results/);
});
test('one declaration cannot carry conflicting alias stability promises',t=>{
 const f=libraryFixture(t),manifest=structuredClone(f.manifest),review=structuredClone(f.decision);manifest.components[1].declarationIdentities=manifest.components[0].declarationIdentities;
 review.approval.proposalSha256=stabilityProposalDigest(manifest);review.approval.labels[manifest.components[0].id]='preview';
 assert.throws(()=>applyStabilityReview(manifest,review),/disagree across aliases/);
});

test('rendered route proof verifies labels in an SPA shell instead of raw HTML text',t=>{
 const f=libraryFixture(t,{previewOne:true});for(const c of f.documentation.components){f.write(c.page,'<!doctype html><div id="root"></div><script src="/app.js"></script>');c.pageSha256=sha(readFileSync(join(f.rootDir,c.page)));}
 f.write('docs/library/documentation.json',f.documentation);const p='website/generated/verification.json',r=JSON.parse(readFileSync(join(f.rootDir,p),'utf8'));r.artifacts.find(a=>a.path==='docs/library/documentation.json').sha256=sha(readFileSync(join(f.rootDir,'docs/library/documentation.json')));f.write(p,r);
 assert.equal(ready(f).status,'passed');
});
test('wrong executed badge or route cannot satisfy a preview documentation contract',t=>{
 for(const field of ['label','route']){const f=libraryFixture(t,{previewOne:true}),path='website/generated/route-results.json',result=JSON.parse(readFileSync(join(f.rootDir,path),'utf8'));result.routes[0][field]='wrong';f.write(path,result);
 const p='website/generated/verification.json',r=JSON.parse(readFileSync(join(f.rootDir,p),'utf8'));r.artifacts.find(a=>a.path===path).sha256=sha(readFileSync(join(f.rootDir,path)));f.write(p,r);assert.match(ready(f).blockers.join(' '),/executed component route or visible stability label/);}
});
test('rehashing built data cannot substitute a different stability label',t=>{
 const f=libraryFixture(t,{previewOne:true}),record=f.documentation.components[0],data=JSON.parse(readFileSync(join(f.rootDir,record.data),'utf8'));data.stability='stable';f.write(record.data,data);record.dataSha256=sha(readFileSync(join(f.rootDir,record.data)));f.write('docs/library/documentation.json',f.documentation);
 const p='website/generated/verification.json',r=JSON.parse(readFileSync(join(f.rootDir,p),'utf8'));r.artifacts.find(a=>a.path==='docs/library/documentation.json').sha256=sha(readFileSync(join(f.rootDir,'docs/library/documentation.json')));f.write(p,r);assert.match(ready(f).blockers.join(' '),/label metadata differs/);
});
test('actual kitchen install token array is accepted; substring commands cannot impersonate an install',t=>{
 const f=libraryFixture(t),receipt=f.evidence.receipts.find(r=>r.platform==='web');assert.equal(validateLibraryReceipt(receipt,context(f)).kind,'web');
 for(const command of ['echo npm install', ['echo','npm install'],['npm','uninstall'],['npm','install','']]){const r=structuredClone(receipt);r.candidate.installCommand=command;assert.throws(()=>validateLibraryReceipt(r,context(f)),/install command/);}
});

test('web proof cannot be relabeled as an iOS or Android mount',t=>{
 const f=libraryFixture(t),web=f.evidence.receipts.find(r=>r.platform==='web');
 for(const platform of ['ios','android']){const receipt=structuredClone(web);receipt.platform=platform;assert.throws(()=>validateLibraryReceipt(receipt,context(f)),/runner or executable source/);}
});
test('native proof cannot be transplanted to a different executed platform',t=>{
 const f=libraryFixture(t),receipt=structuredClone(f.evidence.receipts.find(r=>r.platform==='android'));receipt.platform='ios';receipt.runner.command=receipt.runner.command.replace('--platform android','--platform ios');
 assert.throws(()=>validateLibraryReceipt(receipt,context(f)),/executed result.*(kind|platform)/);
});

test('SSR proof cannot be relabeled as TypeScript declarations or accessibility execution',t=>{
 const f=libraryFixture(t),unit=f.evidence.receipts.find(r=>r.kind==='unit');
 for(const kind of ['declarations','accessibility']){const receipt=structuredClone(unit);receipt.kind=kind;receipt.violations=0;receipt.standards=['WCAG 2.1 AA'];assert.throws(()=>validateLibraryReceipt(receipt,context(f)),/claimed evidence kind/);}
});
test('executed result evidence kind is bound independently of receipt labels',t=>{
 const f=libraryFixture(t),receipt=f.evidence.receipts.find(r=>r.kind==='declarations'),a=receipt.artifacts[0],r=JSON.parse(readFileSync(join(f.rootDir,a.path),'utf8'));r.evidenceKinds=['unit'];f.write(a.path,r);a.sha256=sha(readFileSync(join(f.rootDir,a.path)));assert.throws(()=>validateLibraryReceipt(receipt,context(f)),/executed result does not establish/);
});

test('PNG signature stubs and truncated screenshots cannot establish render evidence',t=>{
 for(const corrupt of [bytes=>bytes.subarray(0,8),bytes=>bytes.subarray(0,bytes.length-12)]){const f=libraryFixture(t),receipt=f.evidence.receipts.find(r=>r.platform==='web'),shot=receipt.runner.screenshots[0],bytes=readFileSync(join(f.rootDir,shot.path));writeFileSync(join(f.rootDir,shot.path),corrupt(bytes));shot.sha256=sha(readFileSync(join(f.rootDir,shot.path)));assert.throws(()=>validateLibraryReceipt(receipt,context(f)),/complete decodable positive-dimension PNG/);}
});
