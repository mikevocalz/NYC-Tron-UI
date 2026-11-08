import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const ledger=JSON.parse(readFileSync(resolve(root,'docs/completion/library-progress.json'),'utf8'));
const fail=message=>{throw new Error(`Component program: ${message}`);};
if(ledger.components.length!==341)fail('The canonical scope must retain all 341 IDs');
const ids=new Set();let implemented=0,partial=0;
const manifests=readdirSync(resolve(root,'packages')).flatMap(name=>{const p=resolve(root,'packages',name,'package.json');return existsSync(p)?[{dir:dirname(p),manifest:JSON.parse(readFileSync(p,'utf8'))}]:[];});
for(const row of ledger.components){
 if(!row.id||ids.has(row.id))fail(`Duplicate/missing ID ${row.id}`);ids.add(row.id);
 if(!row.name||!row.phase||!row.requirement||typeof row.libraryScope!=='boolean')fail(`Missing scope metadata for ${row.id}`);
 for(const source of row.sourceCandidates){if(!source.startsWith('packages/')||source.includes('..')||!existsSync(resolve(root,source)))fail(`${row.id} has a missing source candidate: ${source}`);}
 if(['implemented','partial'].includes(row.implementationReview)){
  // Library rows count toward the library total. Non-library rows may record
  // an implemented NYC-Tron-owned adapter (e.g. a platform-services subpath)
  // while their engine/platform acceptance stays unverified; they still need
  // owned source, evidence and a public export, but never count as library
  // implementations and cannot be partial.
  if(row.libraryScope){
   implemented++;
   if(row.implementationReview==='partial'){partial++;if(!row.remainingLibraryWork?.length)fail(`${row.id} must name its remaining library work`);}
   else if(row.remainingLibraryWork?.length)fail(`${row.id} still has unfinished library requirements`);
  }else if(row.implementationReview==='partial')fail(`${row.id} is outside library scope; record implemented or pending`);
  if(!row.sourceCandidates.length||!row.evidence?.length)fail(`${row.id} needs owned source and evidence`);
  for(const report of row.evidence)if(report.includes('..')||!existsSync(resolve(root,'docs/completion',report)))fail(`${row.id} has a missing report`);
  const exported=row.sourceCandidates.some(source=>{
   const dist=resolve(root,source.replace('/src/','/dist/').replace(/\.tsx?$/,'.js'));
   return manifests.some(({dir,manifest})=>Object.values(manifest.exports??{}).some(target=>{
    const values=typeof target==='string'?[target]:Object.values(target);return values.some(value=>typeof value==='string'&&resolve(dir,value)===dist);
   }));
  });
  if(!exported)fail(`${row.id} needs an independent public export`);
 }
 if(row.acceptance==='accepted')for(const platform of ledger.requiredPlatforms){
  const gate=row.platformEvidence?.[platform];if(gate?.status!=='passed'||!gate.evidence?.length)fail(`${row.id} cannot be accepted without ${platform} proof`);
  for(const report of gate.evidence)if(report.includes('..')||!existsSync(resolve(root,'docs/completion',report)))fail(`${row.id} has missing ${platform} proof`);
 }
}
console.log(`Component program: ${ids.size} canonical IDs retained; ${implemented} reviewed library implementations (${partial} partial); acceptance remains evidence-gated.`);
