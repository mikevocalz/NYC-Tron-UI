// Rehydrate reviewed local declarations, resolving matching-version native props
// from the pinned documentation tooling installation. No runtime is mounted here.
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import {createHash} from 'node:crypto';
import { fileURLToPath } from 'node:url';
const here=dirname(fileURLToPath(import.meta.url)),require=createRequire(join(here,'package.json'));
const ts=require('@typescript/typescript6');
const nativeVersion=require('react-native/package.json').version;
export function createPropsReader(snapshot){
 const workspace=JSON.parse(readFileSync(join(here,'../docs/api-signatures.json'),'utf8'));
 const core=Object.fromEntries(Object.entries(workspace.declarations).filter(([id])=>id.startsWith('@nyc-tron/core/')));
 snapshot={...snapshot,declarations:{...core,...snapshot.declarations},packages:{'@nyc-tron/core':workspace.packages['@nyc-tron/core'],...snapshot.packages}};
 const records=snapshot.declarations,groups=new Map();
 for(const[id,record]of Object.entries(records)){const file=id.slice(0,id.lastIndexOf('#'));if(!groups.has(file))groups.set(file,[]);groups.get(file).push({id,record,name:id.slice(id.lastIndexOf('#')+1)});}
 const virtual=new Map();
 for(const[file,rs]of groups){const own=new Set(rs.map(r=>r.name)),imports=new Map();
  for(const{record}of rs)for(const ref of record.references??[]){const name=ref.slice(ref.lastIndexOf('#')+1);if(!/^[A-Za-z_$][\w$]*$/.test(name)||own.has(name)||name.startsWith('$$'))continue;
   if(records[ref]){const target=ref.slice(0,ref.lastIndexOf('#'));if(target!==file)imports.set(name,target);}
   else{const ext=snapshot.externalTypes[ref];if(ext?.package==='react-native'&&ext.version===nativeVersion){const target=join(here,'node_modules/react-native',ext.file);if(existsSync(target))imports.set(name,'__native__'+target);}}
  }
  virtual.set('/__docs__/'+file,'import * as React from "react";\nimport type {ReactNode,ReactElement,Ref,ComponentRef,ForwardRefExoticComponent,PropsWithChildren} from "react";\n'+[...imports].map(([name,mod])=>`import {${name}} from ${JSON.stringify(mod)};`).join('\n')+'\n'+rs.flatMap(r=>r.record.signatures).join('\n'));
 }
 const options={target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,strict:true,skipLibCheck:true,noEmit:true,types:[],jsx:ts.JsxEmit.ReactJSX};
 const host=ts.createCompilerHost(options),originalRead=host.readFile.bind(host),originalExists=host.fileExists.bind(host);
 host.readFile=f=>virtual.get(f)??originalRead(f);host.fileExists=f=>virtual.has(f)||originalExists(f);host.getSourceFile=(f,language)=>{const text=host.readFile(f);return text===undefined?undefined:ts.createSourceFile(f,text,language,true);};
 host.resolveModuleNames=(names,containing)=>names.map(name=>groups.has(name)?{resolvedFileName:'/__docs__/'+name,extension:ts.Extension.Dts}:name.startsWith('__native__')?{resolvedFileName:name.slice(10),extension:ts.Extension.Dts}:ts.resolveModuleName(name,(containing.startsWith('/__docs__/')||containing.startsWith('/__examples__/'))?join(here,'virtual.ts'):containing,options,host).resolvedModule);
 const publicModules=new Map();
 for(const[pkg,paths]of Object.entries(snapshot.packages))for(const[subpath,variants]of Object.entries(paths)){const specifier=pkg+(subpath==='.'?'':subpath.slice(1));const path='/__docs__/exports/'+createHash('sha256').update(specifier).digest('hex')+'.d.ts';const exports=[];for(const[name,ids]of Object.entries(variants[0].symbols)){const id=ids.find(id=>records[id]);if(!id)continue;const target=id.slice(0,id.lastIndexOf('#')),original=id.slice(id.lastIndexOf('#')+1);if(/^[A-Za-z_$][\w$]*$/.test(original))exports.push('export {'+original+' as '+name+'} from '+JSON.stringify(target)+';');}virtual.set(path,exports.join('\n'));publicModules.set(specifier,path);}
 const originalResolve=host.resolveModuleNames;host.resolveModuleNames=(names,containing)=>names.map(name=>publicModules.has(name)?{resolvedFileName:publicModules.get(name),extension:ts.Extension.Dts}:originalResolve([name],containing)[0]);
 const program=ts.createProgram([...virtual.keys()],options,host),checker=program.getTypeChecker();
 const read=id=>{const file=id.slice(0,id.lastIndexOf('#')),name=id.slice(id.lastIndexOf('#')+1),source=program.getSourceFile('/__docs__/'+file);if(!source)return[];let symbol=checker.getSymbolsInScope(source,ts.SymbolFlags.Value).find(s=>s.name===name&&s.declarations?.some(d=>d.getSourceFile()===source));if(!symbol)return[];symbol=checker.getExportSymbolOfSymbol(symbol);const declaration=symbol.valueDeclaration??symbol.declarations?.[0];if(!declaration)return[];const type=checker.getTypeOfSymbolAtLocation(symbol,declaration);const signature=type.getCallSignatures()[0]??type.getConstructSignatures()[0];const parameter=signature?.getParameters()[0];if(!parameter)return[];const props=checker.getTypeOfSymbolAtLocation(parameter,parameter.valueDeclaration??declaration);if(props.flags&(ts.TypeFlags.Any|ts.TypeFlags.Unknown))return[];
 return checker.getPropertiesOfType(props).map(property=>{const d=property.valueDeclaration??property.declarations?.[0]??declaration;const value=checker.getTypeOfSymbolAtLocation(property,d);const tags=property.getJsDocTags(checker);return{name:property.name,type:checker.typeToString(value,d,ts.TypeFormatFlags.NoTruncation).replace(/import\(["'][^"']+["']\)\./g,''),required:!(property.flags&ts.SymbolFlags.Optional),source:d.getSourceFile().fileName.startsWith('/__docs__/')?d.getSourceFile().fileName.slice(10):'react-native@'+nativeVersion+' declarations',description:ts.displayPartsToString(property.getDocumentationComment(checker)),default:tags.find(t=>t.name==='default')?.text?.map(p=>p.text).join('')??null};}).sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0);
 };
 read.checkExamples=cases=>{for(const c of cases)virtual.set('/__examples__/'+c.slug+'.tsx',c.example.code);const p=ts.createProgram([...virtual.keys()],options,host);const errors=ts.getPreEmitDiagnostics(p).filter(d=>d.category===ts.DiagnosticCategory.Error&&d.file?.fileName.startsWith('/__examples__/')).map(d=>({slug:d.file.fileName.slice(14,-4),code:d.code,message:ts.flattenDiagnosticMessageText(d.messageText,' '),line:d.file.getLineAndCharacterOfPosition(d.start??0).line+1}));return errors;};
 return read;
}

