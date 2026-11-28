// Synthetic assertion fixtures only. Never repository acceptance or owner evidence.
import {createHash} from 'node:crypto';
import {mkdirSync,mkdtempSync,rmSync,writeFileSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {generateLibraryManifest,stabilityProposalDigest,sourceFingerprint} from '../../library-components.mjs';
import {createImage,encodePng} from '../../app-identity/png.mjs';
import {LIBRARY_EVIDENCE_KINDS,REQUIRED_COMPONENT_STATES} from '../../library-readiness.mjs';
export const sha = value => createHash('sha256').update(value).digest('hex');
export function libraryFixture(t,{confirmed=true,label='stable',previewOne=false,version='1.0.0'}={}) {
 const validPng=encodePng(createImage(1,1,[0,0,0,255]));
 const rootDir=mkdtempSync(join(tmpdir(),'tron-synthetic-release-'));t.after(()=>rmSync(rootDir,{recursive:true,force:true}));
 const write=(path,data)=>{mkdirSync(join(rootDir,path,'..'),{recursive:true});writeFileSync(join(rootDir,path),typeof data==='string'?data:JSON.stringify(data,null,2)+'\n');};
 const records=[{packages:{},declarations:{},externalTypes:{}},{packages:{},declarations:{},externalTypes:{}},{packages:{},declarations:{},externalTypes:{}}];
 const hashes=[], sums=[];
 for(let i=0;i<16;i++){
  const relative=i===14?'windows-fluent/rnw-fabric':i===15?'macos-appkit/spark':'example'+i;
  const name='@nyc-tron/'+(i===14?'windows-fluent-fabric':i===15?'macos-appkit':i===0?'ui':'example'+i);
  const symbol=i===0?'Button':'Control',subpath=i===0?'.':'./Control';
  const target='./dist/Control.d.ts',conditions={types:target,default:'./dist/Control.js'};
  write('packages/'+relative+'/package.json',{name,private:true,version,exports:{[subpath]:conditions}});
  const snapshot=records[i<14?0:i===14?1:2],identity=name+'/dist/Control.d.ts#'+symbol;
  snapshot.packages[name]={[subpath]:[{target,conditions,symbols:{[symbol]:[identity]}}]};
  snapshot.declarations[identity]={signatures:['export declare function '+symbol+'(props: {}): React.JSX.Element;'],references:[]};
  const filename=name.slice(1).replace('/','-')+'-'+version+'.tgz',bytes='SYNTHETIC archive fixture '+i;
  write('artifacts/'+filename,bytes);hashes.push([filename,sha(bytes)]);sums.push(sha(bytes)+'  '+filename);
 }
 for(const [i,name] of ['api-signatures.json','api-signatures-windows.json','api-signatures-macos.json'].entries())write('docs/'+name,records[i]);
 write('docs/api-surface.json',{});write('docs/desktop-support.json',{lanes:{macos:{supported:[],struck:[],notVerified:[]},windows:{supported:[],struck:[],notVerified:[]}}});
 write('artifacts/SHA256SUMS',sums.join('\n')+'\n');
 let manifest=generateLibraryManifest({rootDir});
 const decision={schemaVersion:1,status:'pending',approval:null};
 if(confirmed){decision.status='confirmed';decision.approval={reviewer:'mikevocalz',decision:'SYNTHETIC TEST DECISION ONLY',proposalSha256:stabilityProposalDigest(manifest),labels:Object.fromEntries(manifest.components.map((c,i)=>[c.id,previewOne&&i===0?'preview':label]))};}
 write('docs/library/stability-review.json',decision);manifest=generateLibraryManifest({rootDir});write('docs/library/components.json',manifest);
 const manifestSha256=sourceFingerprint(JSON.stringify(manifest,null,2)+'\n');
 write('tooling/synthetic-test.mjs','// synthetic fixture only\n');write('proof/test.log','synthetic fixture only\n');write('proof/results.json',{synthetic:true,passed:16,failed:0,skipped:0});
 writeFileSync(join(rootDir,'proof/screenshot.png'),validPng);
 const source={sourceCommit:'a'.repeat(40),sourceDirty:false};
 const components=manifest.components.filter(c=>!previewOne||c.stability!=='preview').map(c=>({symbol:c.symbol,status:'passed',imports:[{path:c.importPath,symbol:c.symbol,rendered:true,assertedStates:REQUIRED_COMPONENT_STATES[c.symbol]??['synthetic fixture assertion']}]}));
 const receipts=LIBRARY_EVIDENCE_KINDS.map(kind=>({schemaVersion:1,kind:['web','ios','android'].includes(kind)?'nyc-tron-library-render-evidence':kind,...(['web','ios','android'].includes(kind)?{platform:kind}:{}),status:'passed',manifestSha256,candidate:{...source,version,installCommand:['npm','install','--allow-remote=all','--no-audit','--no-fund'],archives:hashes.map(([filename,sha256])=>({filename,sha256,version,package:'@nyc-tron/'+filename.slice('nyc-tron-'.length,-('-'+version+'.tgz').length)}))},runner:{name:kind==='web'?'playwright':['ios','android'].includes(kind)?'maestro':'node-react-ssr',command:['ios','android'].includes(kind)?'node tooling/kitchen-sink/native-proof.mjs --platform '+kind:'node tooling/synthetic-test.mjs',testSource:kind==='web'?'tooling/kitchen-sink/web-proof.mjs':['ios','android'].includes(kind)?'tooling/kitchen-sink/native-flow.mjs':'tooling/synthetic-test.mjs',testSha256:sha('// synthetic fixture only\n'),exitCode:0,screenshots:[{path:'proof/screenshot.png',sha256:sha(validPng)}],log:{path:'proof/test.log',sha256:sha('synthetic fixture only\n')}},artifacts:[{path:'proof/results.json',sha256:sha(JSON.stringify({synthetic:true,passed:16,failed:0,skipped:0},null,2)+'\n')}],assertions:{passed:16,failed:0,skipped:0},violations:0,standards:['WCAG 2.1 AA'],components}));
 for(const receipt of receipts){
  const kind=receipt.platform??receipt.kind;
  if(['unit','exports'].includes(kind)){receipt.runner.name='node-react-ssr';receipt.runner.testSource='tooling/kitchen-sink/unit-fixture.tsx';}
  if(kind==='declarations'){receipt.runner.name='typescript';receipt.runner.testSource='examples/kitchen-sink/App.tsx';receipt.runner.command='tsc --noEmit (synthetic test only)';}
  if(kind==='accessibility'){receipt.runner.name='playwright';receipt.runner.testSource='tooling/kitchen-sink/web-proof.mjs';}
  write(receipt.runner.testSource,'// synthetic fixture only\n');const path='proof/'+kind+'-results.json';
  const result={synthetic:true,evidenceKinds:['unit','exports'].includes(kind)?['unit','exports']:['web','accessibility'].includes(kind)?['web','accessibility']:[kind],...(['web','accessibility','ios','android'].includes(kind)?{platform:kind==='accessibility'?'web':kind}:{}),...(['web','accessibility'].includes(kind)?{cases:[{axeViolations:0}]}:{}),status:'passed',assertions:receipt.assertions,components:receipt.components};
  write(path,result);receipt.artifacts=[{path,sha256:sha(JSON.stringify(result,null,2)+'\n')}];
 }

 const documentation={schemaVersion:1,manifestSha256,verification:{path:'website/generated/verification.json'},components:manifest.components.map((c,i)=>{
  const page='website/dist/components/fixture'+i+'/index.html',data='website/dist/components/fixture'+i+'/data.json',example='website/examples/fixture'+i+'.tsx';
  write(page,'<html><body>'+c.stability+'</body></html>');write(data,{...c,slug:'fixture'+i});write(example,'// synthetic snippet\n');
  return {...c,page,data,example,pageSource:'website/src/App.tsx',route:'/components/fixture'+i+'/',accessibilityNotes:['Synthetic notes'],exampleStatus:'verified'};
 })};write('website/src/App.tsx','// synthetic docs source\n');
 for(const record of documentation.components)for(const key of ['page','pageSource','data','example'])record[key+'Sha256']=sha(readFileSync(join(rootDir,record[key])));
 write('docs/library/documentation.json',documentation);
 const browser={stats:{expected:5,unexpected:0,skipped:0,flaky:0}},examples={checked:manifest.components.length,errors:[]};write('website/generated/browser.json',browser);write('website/generated/examples.json',examples);
 const routes={status:'passed',routes:documentation.components.map(c=>({id:c.id,route:c.route,importPath:c.importPath,symbol:c.symbol,label:c.stability??'Proposed '+c.proposedStability,ownerConfirmation:c.ownerConfirmation,status:'passed'}))};write('website/generated/route-results.json',routes);
 const verification={schemaVersion:1,kind:'documentation',status:'passed',exitCode:0,command:'synthetic fixture only',manifestSha256,components:manifest.components.map(c=>c.id),checks:{labels:{status:'passed',count:manifest.components.length},routes:{status:'passed',count:manifest.components.length},examples:{status:'passed',count:manifest.components.length,errors:0},accessibility:{status:'passed',violations:0}},artifacts:['docs/library/documentation.json','website/generated/browser.json','website/generated/examples.json','website/generated/route-results.json'].map(path=>({path,sha256:sha(readFileSync(join(rootDir,path)))}))};write('website/generated/verification.json',verification);
 return {rootDir,write,manifest,decision,evidence:{schemaVersion:1,receipts},documentation,source,hashes,artifacts:join(rootDir,'artifacts')};
}
