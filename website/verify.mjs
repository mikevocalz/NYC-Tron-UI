import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'..');
mkdirSync(join(here,'generated'),{recursive:true});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const run=(command,args,log)=>{
  const r=spawnSync(command,args,{cwd:root,encoding:'utf8',maxBuffer:30*1024*1024,env:{...process.env,CI:process.env.CI??'1'}});
  const output='$ '+(command===process.execPath?'node':command)+' '+args.join(' ')+'\n'+(r.stdout??'')+(r.stderr??'');
  writeFileSync(join(here,'generated',log),output);process.stdout.write(output);
  if(r.status!==0)throw Error('Documentation check failed: '+args.join(' '));
};
try{
  rmSync(join(here,'generated/route-results.json'),{force:true});
  run(process.execPath,['website/build.mjs'],'build.log');
  run(process.execPath,['tooling/library-docs.mjs','--check-examples'],'examples.log');
  run('npm',['--prefix','website','test'],'unit.log');
  run('npm',['--prefix','website','run','test:browser'],'browser.log');
  const metadata=JSON.parse(readFileSync(join(root,'docs/library/documentation.json'),'utf8'));
  const examples=JSON.parse(readFileSync(join(here,'generated/example-validation.json'),'utf8'));
  const browser=JSON.parse(readFileSync(join(here,'generated/browser-results.json'),'utf8'));
  const catalog=JSON.parse(readFileSync(join(here,'generated/catalog.json'),'utf8'));
  if(examples.checked!==metadata.componentCount||examples.errors.length)throw Error('Example coverage or validation failed');
  if(browser.stats.expected!==5||browser.stats.unexpected!==0||browser.stats.skipped!==0||browser.stats.flaky!==0)throw Error('All five browser tests must pass without skips');
  const paths=['docs/library/documentation.json','website/generated/example-validation.json','website/generated/browser-results.json','website/generated/route-results.json','website/package.json','website/package-lock.json','website/playwright.config.mjs','website/guides.mjs','website/generated/build.log','website/generated/examples.log','website/generated/unit.log','website/generated/browser.log','website/src/App.tsx','website/src/native.web.tsx','website/src/theme.css','website/build.mjs','website/props.mjs','website/verify.mjs','website/tests/catalog.test.mjs','website/tests/browser/docs.spec.mjs','tooling/library-docs.mjs','website/dist/app.js','website/dist/theme.css','packages/ui/src/components/Button.tsx','packages/ui/src/components/Card.tsx','packages/ui/src/components/TextField.tsx','packages/ui/src/components/NavigationRail.tsx','packages/ui/src/components/html/semantic.web.tsx'];
  const artifacts=paths.map(path=>({path,sha256:hash(readFileSync(join(root,path)))}));
  const button=catalog.components.find(c=>c.package==='@nyc-tron/ui'&&c.symbol==='Button');
  const receipt={schemaVersion:1,kind:'documentation',status:'passed',manifestSha256:metadata.manifestSha256,components:metadata.components.map(c=>c.id),command:'npm --prefix website run verify',exitCode:0,checks:{labels:{status:'passed',count:metadata.componentCount},routes:{status:'passed',count:metadata.componentCount,proof:'Chromium rendered each exact import-bound route and accessibility heading'},examples:{status:'passed',count:examples.checked,errors:0,method:'Reviewed declaration graphs and matching-version native declarations; not a native runtime measurement'},accessibility:{status:'passed',violations:0,scope:'shared documentation templates',sampledRoutes:['/','/components/',`/components/${button.slug}/`,'/guides/installation/'],widths:[1440,390],standard:'automated WCAG 2.1 AA tag scan; manual speech and full conformance not claimed'}},artifacts};
  writeFileSync(join(here,'generated/verification.json'),JSON.stringify(receipt,null,2)+'\n');
  console.log(`Documentation verification passed: ${metadata.componentCount} routes/examples, five browser tests, no automated AA violations. No stability or distribution approval inferred.`);
}catch(error){
  writeFileSync(join(here,'generated/verification.json'),JSON.stringify({schemaVersion:1,kind:'documentation',status:'failed',command:'npm --prefix website run verify',exitCode:1,error:String(error.message)},null,2)+'\n');
  console.error(error.message);process.exitCode=1;
}
