// Executes the installation guide in a fresh directory; never rewrites an app.
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { documentedExample, guides } from '../website/guides.mjs';
import { isMainModule } from './library-components.mjs';
export function prepareCleanDocsConsumer(output){
 const target=resolve(output);if(existsSync(target))throw new Error('Clean docs consumer output already exists; choose a new directory.');
 const run=(command,args,cwd)=>{console.log('$ '+command+' '+args.join(' '));const result=spawnSync(command,args,{cwd,stdio:'inherit',env:{...process.env,CI:'1',EXPO_NO_TELEMETRY:'1'}});if(result.status!==0)throw new Error('Docs consumer command failed with exit '+result.status);};
 run('npx',['--yes','create-expo-app@5.0.0',target,'--template','blank-typescript','--yes'],dirname(target));
 const install=guides.find(g=>g.slug==='installation').sections.find(s=>s.title==='Install the release').code;
 const urls=install.match(/https:\/\/[^\s\\]+\.tgz/g);if(urls?.length!==2)throw new Error('Installation guide must supply the exact two release URLs.');
 run('npm',['install','--allow-remote=all',...urls],target);
 writeFileSync(join(target,'App.tsx'),documentedExample);
 run('npx',['expo','install','react-native-web','react-dom'],target);
 run('npx',['expo','export','--platform','web','--output-dir','docs-web'],target);
 const manifest=JSON.parse(readFileSync(join(target,'package.json'),'utf8'));
 const proof={schemaVersion:1,kind:'docs-clean-consumer',status:'built',source:'website/guides.mjs',release:'1.0.0-rc.2',commands:'create app; exact documented npm install; copy exact App.tsx; Expo-compatible web peers; export web',installed:{core:manifest.dependencies['@nyc-tron/core'],ui:manifest.dependencies['@nyc-tron/ui']},example:documentedExample};
 writeFileSync(join(target,'docs-consumer-proof.json'),JSON.stringify(proof,null,2)+'\n');return target;
}
if(isMainModule(import.meta.url)){const args=process.argv.slice(2);if(args.length!==2||args[0]!=='--output')throw new Error('Usage: docs-clean-consumer.mjs --output <new-directory>');prepareCleanDocsConsumer(args[1]);}
