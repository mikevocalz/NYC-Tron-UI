import assert from 'node:assert/strict';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {mkdirSync,mkdtempSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {collectLibraryEvidence,mergeTestedLibraryArchives} from '../collect-library-evidence.mjs';
import {loadLibraryEvidence} from '../library-readiness.mjs';
const sha=value=>createHash('sha256').update(value).digest('hex');
function fixture(t){const root=mkdtempSync(join(tmpdir(),'tron-synthetic-collector-'));t.after(()=>rmSync(root,{recursive:true,force:true}));const input=join(root,'input'),output=join(root,'output');mkdirSync(input);mkdirSync(output);writeFileSync(join(output,'SHA256SUMS'),sha('other')+'  other.tgz\n');
 const candidate={version:'1.0.0',sourceCommit:'a'.repeat(40),sourceDirty:false,archives:[]};
 for(const name of ['core','ui']){const folder=join(root,name);mkdirSync(join(folder,'package'),{recursive:true});writeFileSync(join(folder,'package/package.json'),JSON.stringify({name:'@nyc-tron/'+name,version:'1.0.0',private:true}));const filename='nyc-tron-'+name+'-1.0.0.tgz';execFileSync('tar',['-czf',join(input,filename),'-C',folder,'package']);candidate.archives.push({package:'@nyc-tron/'+name,version:'1.0.0',filename,sha256:sha(readFileSync(join(input,filename)))});}
 const write=()=>writeFileSync(join(input,'candidate.json'),JSON.stringify(candidate));write();return{root,input,output,candidate,write,options:{version:'1.0.0',revision:'a'.repeat(40)}};}
test('collector preserves missing checks rather than inventing successful receipts',t=>{const f=fixture(t);mkdirSync(join(f.input,'web'));writeFileSync(join(f.input,'web/unit.json'),JSON.stringify({synthetic:true}));const index=join(f.input,'evidence.json'),result=collectLibraryEvidence(f.input,index);assert.equal(result.receipts.length,1);assert.equal(result.missing.length,6);assert.equal(loadLibraryEvidence(index).receipts.length,1);writeFileSync(join(f.input,'web/unit.json'),'tampered');assert.throws(()=>loadLibraryEvidence(index),/checksum mismatch/);});
test('tested archive merge reuses exact bytes and forbids repacked replacements',t=>{const f=fixture(t);const before=f.candidate.archives.map(a=>readFileSync(join(f.input,a.filename)));mergeTestedLibraryArchives(f.input,f.output,f.options);for(const [i,a]of f.candidate.archives.entries())assert.deepEqual(readFileSync(join(f.output,a.filename)),before[i]);assert.throws(()=>mergeTestedLibraryArchives(f.input,f.output,f.options),/cannot replace/);});
test('dirty, wrong-revision, wrong-version and tampered candidate archives fail',t=>{for(const change of [c=>{c.sourceDirty=true},c=>{c.sourceCommit='b'.repeat(40)},c=>{c.version='1.0.1'},c=>{c.archives[0].sha256='b'.repeat(64)}]){const f=fixture(t);change(f.candidate);f.write();assert.throws(()=>mergeTestedLibraryArchives(f.input,f.output,f.options),/candidate|checksum/);assert.equal(readFileSync(join(f.output,'SHA256SUMS'),'utf8'),sha('other')+'  other.tgz\n');}});
