import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
const pkg=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const root=resolve(pkg,'../..');

test('geometry tarball retains both existing port licenses alongside Floating UI',()=>{
 const out=mkdtempSync(join(tmpdir(),'geometry-provenance-'));
 try{
  const packed=execFileSync('pnpm',['pack','--json','--pack-destination',out],{cwd:pkg,encoding:'utf8',stdio:['ignore','pipe','pipe'],shell:process.platform==='win32'});
  const name=JSON.parse(packed.slice(packed.indexOf('{'))).filename;
  const archive=resolve(out,name);
  const extract=path=>execFileSync('tar',['-xOf',archive,'package/'+path]);
  const notice=extract('THIRD_PARTY_NOTICES.md').toString('utf8');
  for(const source of ['NYC-MON','NeonBlade','Floating UI'])assert.ok(notice.includes(source),source+' attribution');
  for(const [name,source] of [['NYC-MON-MIT.txt',root],['NEONBLADE-MIT.txt',root],['floating-ui-MIT.txt',pkg]]){
   assert.deepEqual(extract('licenses/'+name),readFileSync(join(source,'licenses',name)),name+' must ship verbatim');
  }
  const entries=execFileSync('tar',['-tzf',archive],{encoding:'utf8'}).split(/\r?\n/);
  for(const name of ['corner-cut','overlay-placement'])assert.ok(entries.includes('package/dist/'+name+'.js'),name+' distribution');
 }finally{rmSync(out,{recursive:true,force:true});}
});
