// Index actual collector files and retain their tested archive bytes. Never invent a pass.
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {copyFileSync,existsSync,readFileSync,realpathSync,writeFileSync} from 'node:fs';
import {dirname,join,relative,resolve} from 'node:path';
import {isMainModule} from './library-components.mjs';
import {safeEvidenceFile} from './library-readiness.mjs';
import {releaseChecksums,verifyArchiveHash} from './consumer-model.mjs';
const sha=value=>createHash('sha256').update(value).digest('hex');
const fail=message=>{throw new Error('Library evidence collector: '+message);};
export const RECEIPT_FILES=Object.freeze(['web/unit.json','web/unit-exports.json','web/unit-declarations.json','web/web.json','web/web-accessibility.json','ios/ios.json','android/android.json']);
export function collectLibraryEvidence(input,output){
 const directory=realpathSync(resolve(input)),base=realpathSync(dirname(resolve(output)));
 const receipts=[];
 for(const file of RECEIPT_FILES){if(!existsSync(join(directory,file)))continue;const path=safeEvidenceFile(directory,file),portable=relative(base,path).replaceAll('\\','/');
  if(portable.startsWith('../')||portable.startsWith('/'))fail('output index must contain the receipt tree');
  receipts.push({path:portable,sha256:sha(readFileSync(path))});
 }
 const result={schemaVersion:1,receipts,missing:RECEIPT_FILES.filter(file=>!existsSync(join(directory,file))),note:'Index only. Readiness independently validates execution, candidate bytes, results and coverage; missing checks remain NOT RUN.'};
 writeFileSync(output,JSON.stringify(result,null,2)+'\n');return result;
}
export function mergeTestedLibraryArchives(input,output,{version,revision}){
 const source=realpathSync(resolve(input)),destination=realpathSync(resolve(output));
 const candidate=JSON.parse(readFileSync(safeEvidenceFile(source,'candidate.json'),'utf8'));
 if(candidate.version!==version||candidate.sourceCommit!==revision||candidate.sourceDirty!==false||!/^[a-f0-9]{40}$/.test(revision??''))fail('tested library archives require this exact clean candidate revision and version');
 if(!Array.isArray(candidate.archives)||candidate.archives.length!==2||new Set(candidate.archives.map(a=>a.package)).size!==2||!['@nyc-tron/core','@nyc-tron/ui'].every(name=>candidate.archives.some(a=>a.package===name)))fail('candidate must identify the exact installed core and UI archives');
 const checksumPath=join(destination,'SHA256SUMS'),bytes=readFileSync(checksumPath,'utf8'),hashes=releaseChecksums(bytes),additions=[];
 for(const archive of candidate.archives){
  const filename=archive.package.slice(1).replace('/','-')+'-'+version+'.tgz';
  if(archive.filename!==filename||archive.version!==version||hashes.has(filename)||existsSync(join(destination,filename)))fail('tested archives cannot replace freshly repacked candidate files');
  const file=safeEvidenceFile(source,filename);verifyArchiveHash(filename,readFileSync(file),archive.sha256);
  const manifest=JSON.parse(execFileSync('tar',['-xOf',file,'package/package.json'],{encoding:'utf8',maxBuffer:1024*1024}));
  if(manifest.name!==archive.package||manifest.version!==version||manifest.private!==true)fail('tested archive package identity differs from candidate metadata');
  additions.push({archive,file});
 }
 // Validate every input before the first mutation.
 for(const {archive,file} of additions)copyFileSync(file,join(destination,archive.filename));
 writeFileSync(checksumPath,bytes.trimEnd()+'\n'+additions.map(({archive})=>archive.sha256+'  '+archive.filename).join('\n')+'\n');
 copyFileSync(join(source,'candidate.json'),join(destination,'library-tested-candidate.json'));
 return {status:'retained tested archive bytes',version,revision,archives:candidate.archives};
}
if(isMainModule(import.meta.url)){
 const [command,input,output,version,revision,...extra]=process.argv.slice(2);
 if(extra.length||!input||!output||!['index','merge'].includes(command))fail('usage: index <proof-directory> <index.json> | merge <archive-directory> <candidate-directory> <version> <revision>');
 console.log(JSON.stringify(command==='index'?collectLibraryEvidence(input,output):mergeTestedLibraryArchives(input,output,{version,revision}),null,2));
}
