import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import esbuild from 'esbuild';
import { guides, resolveGuides, documentedExample } from './guides.mjs';
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'..');
const gen=spawnSync(process.execPath,['tooling/library-docs.mjs'],{cwd:root,stdio:'inherit'});if(gen.status)process.exit(gen.status);
const catalog=JSON.parse(readFileSync(join(here,'generated/catalog.json'),'utf8'));
const resolvedGuides=resolveGuides(catalog.ownerConfirmation);
const dist=join(here,'dist');rmSync(dist,{recursive:true,force:true});mkdirSync(join(dist,'data/components'),{recursive:true});mkdirSync(join(dist,'data/guides'),{recursive:true});mkdirSync(join(here,'generated/examples'),{recursive:true});
const shell=(title)=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title.replace(/[<>&"]/g,'')} | NYC-Tron UI</title><meta name="description" content="Independent React Native UI library documentation: imports, generated props, examples and evidence-based platform support."><link rel="stylesheet" href="/theme.css"></head><body><div id="root"></div><script type="module" src="/app.js"></script></body></html>`;
const page=(path,title)=>{mkdirSync(join(dist,path),{recursive:true});writeFileSync(join(dist,path,'index.html'),shell(title));};page('','Documentation');page('components','Components');
for(const c of catalog.components){writeFileSync(join(dist,'data/components',c.slug+'.json'),JSON.stringify(c));writeFileSync(join(here,'generated/examples',c.slug+'.tsx'),c.example.code);page(join('components',c.slug),c.symbol);}
for(const g of resolvedGuides){writeFileSync(join(dist,'data/guides',g.slug+'.json'),JSON.stringify(g));page(join('guides',g.slug),g.title);}
writeFileSync(join(dist,'data/index.json'),JSON.stringify({ownerConfirmation:catalog.ownerConfirmation,components:catalog.components.map(({id,slug,symbol,package:p,importPath,category,proposedStability,stability,ownerConfirmation})=>({id,slug,symbol,package:p,importPath,category,proposedStability,stability,ownerConfirmation})),guides:resolvedGuides.map(({slug,title})=>({slug,title}))}));
writeFileSync(join(dist,'App.example.tsx'),documentedExample);
await esbuild.build({entryPoints:[join(here,'src/App.tsx')],outfile:join(dist,'app.js'),bundle:true,format:'esm',minify:true,jsx:'automatic',platform:'browser',target:['es2022'],alias:{'react-native':join(here,'src/native.web.tsx')},nodePaths:[join(here,'node_modules')],define:{'process.env.NODE_ENV':'"production"'},logLevel:'info'});
const tailwind=spawnSync(process.execPath,[join(here,'node_modules/@tailwindcss/cli/dist/index.mjs'),'-i',join(here,'src/theme.css'),'-o',join(dist,'theme.css'),'--minify'],{cwd:here,stdio:'inherit'});if(tailwind.status)process.exit(tailwind.status);
const digest=path=>createHash('sha256').update(readFileSync(join(root,path))).digest('hex');
const metadata={schemaVersion:1,verification:{path:'website/generated/verification.json'},manifestSha256:createHash('sha256').update(readFileSync(join(root,'docs/library/components.json'),'utf8').replace(/\r\n/g,'\n')).digest('hex'),ownerConfirmation:catalog.ownerConfirmation,source:'website/src/App.tsx',componentCount:catalog.components.length,components:catalog.components.map(c=>({id:c.id,importPath:c.importPath,symbol:c.symbol,route:`/components/${c.slug}/`,page:`website/dist/components/${c.slug}/index.html`,pageSource:'website/src/App.tsx',data:`website/dist/data/components/${c.slug}.json`,propsSources:c.variants.map(v=>({snapshot:v.snapshot,declaration:v.declarationIdentity})),accessibilityNotes:c.accessibility.notes,stability:c.stability,proposedStability:c.proposedStability,example:`website/generated/examples/${c.slug}.tsx`,pageSha256:digest(`website/dist/components/${c.slug}/index.html`),dataSha256:digest(`website/dist/data/components/${c.slug}.json`),pageSourceSha256:digest('website/src/App.tsx'),exampleSha256:digest(`website/generated/examples/${c.slug}.tsx`),exampleStatus:c.example.status,unresolvedExampleProps:c.example.limitations.map(p=>p.prop)}))};
writeFileSync(join(root,'docs/library/documentation.json'),JSON.stringify(metadata,null,2)+'\n');
console.log(`Docs build: ${catalog.components.length} component routes and ${guides.length} guides; ${metadata.components.filter(c=>c.exampleStatus==='interactive fixture available').length} alias-aware live fixture routes.`);
