import {copyFileSync,readdirSync,readFileSync,writeFileSync} from "node:fs";
import {createRequire} from "node:module";
import {dirname,relative,resolve} from "node:path";
import {fileURLToPath} from "node:url";
const require=createRequire(import.meta.url);
const library=dirname(require.resolve("@nyc-tron/windows-fluent-fabric/package.json"));
const libraryProject=resolve(library,"windows/NYCTronFluentFabric/NYCTronFluentFabric.vcxproj");
const windowsPath=value=>value.split("/").join("\\");
const root=new URL("../",import.meta.url);
function edit(path,transform){
 const url=new URL(path,root);
 writeFileSync(url,transform(readFileSync(url,"utf8")));
}
edit("windows/NYCTronWindowsExample/NYCTronWindowsExample.vcxproj",source=>{
 if(source.includes("NYCTronFluentFabric.vcxproj"))return source;
 const reference=[
  "<ItemGroup>",
  '<ProjectReference Include="'+windowsPath(relative(fileURLToPath(new URL("windows/NYCTronWindowsExample/",root)),libraryProject))+'">',
  "<Project>{8C8B9277-3013-47BD-A3E4-F6B2D83DF641}</Project>",
  "</ProjectReference>",
  "</ItemGroup>"
 ].join("\n");
 if(!source.includes("</Project>"))throw new Error("Official app project template changed");
 return source.replace("</Project>",reference+"\n</Project>");
});
// RNW app projects import RequireSolution.targets, so the app only builds
// through its solution. A ProjectReference to a project missing from the
// solution is built with its default Debug|Win32 configuration, which this
// x64-only library does not have. Register it the way RNW autolinking does.
const libraryGuid="{8C8B9277-3013-47BD-A3E4-F6B2D83DF641}";
edit("windows/NYCTronWindowsExample.sln",source=>{
 if(source.includes(libraryGuid))return source;
 const eol=source.includes("\r\n")?"\r\n":"\n";
 const project=[
  'Project("{8BC9CEB8-8B4A-11D0-8D11-00A0C91BC942}") = "NYCTronFluentFabric", "'+windowsPath(relative(fileURLToPath(new URL("windows/",root)),libraryProject))+'", "'+libraryGuid+'"',
  "EndProject",
 ].join(eol);
 const configs=["Debug","Release"].flatMap(cfg=>[
  "\t\t"+libraryGuid+"."+cfg+"|x64.ActiveCfg = "+cfg+"|x64",
  "\t\t"+libraryGuid+"."+cfg+"|x64.Build.0 = "+cfg+"|x64",
 ]).join(eol);
 const globalMarker=eol+"Global"+eol;
 const configMarker="\tGlobalSection(ProjectConfigurationPlatforms) = postSolution"+eol;
 if(!source.includes(globalMarker)||!source.includes(configMarker))
  throw new Error("Official app solution template changed");
 return source
  .replace(globalMarker,eol+project+globalMarker)
  .replace(configMarker,configMarker+configs+eol);
});
edit("windows/NYCTronWindowsExample/NYCTronWindowsExample.cpp",source=>{
 if(source.includes("winrt::NYCTronFluentFabric::ReactPackageProvider"))return source;
 const marker="RegisterAutolinkedNativeModulePackages(settings.PackageProviders());";
 if(!source.includes(marker))throw new Error("Official app host registration point changed");
 return source.replace('#include "pch.h"','#include "pch.h"\n#include <winrt/NYCTronFluentFabric.h>')
  .replace(marker,marker+"\n  settings.PackageProviders().Append(winrt::NYCTronFluentFabric::ReactPackageProvider());");
});
// The installed tarballs must resolve the consumer's one React runtime.
// A project resolveRequest replaces the CLI's out-of-tree platform resolver
// (framework defaults are merged under the project config), so this one
// also performs its react-native -> react-native-windows redirect.
const singletonResolver=[
 "    resolveRequest: (context, moduleName, platform) => {",
 "      let name = moduleName;",
 "      if (platform === 'windows' && (name === 'react-native' || name.startsWith('react-native/'))) {",
 "        name = 'react-native-windows' + name.slice('react-native'.length);",
 "      }",
 "      const singleton = ['react', 'react-native-windows'].some(",
 "        root => name === root || name.startsWith(root + '/'));",
 "      return context.resolveRequest(",
 "        singleton ? {...context, originModulePath: path.join(__dirname, 'index.js')} : context,",
 "        name,",
 "        platform,",
 "      );",
 "    },",
].join("\n");
edit("metro.config.js",source=>{
 const marker="const config = {";
 const resolverMarker="  resolver: {";
 if(!source.includes(marker)||!source.includes(resolverMarker))throw new Error("Official Metro template changed");
 if(!source.includes("watchFolders: []"))
  source=source.replace(marker,marker+"\n  watchFolders: [],");
 if(!source.includes("const singleton = "))
  source=source.replace(resolverMarker,resolverMarker+"\n"+singletonResolver);
 return source;
});
// App identity: replace the template's tile and logo images and .ico files,
// by name, with the ones derived from assets/icon.png
// (tooling/app-identity/derive-icons.mjs). Only files the template already
// has are replaced, so the generated project file needs no edit.
const iconDir=fileURLToPath(new URL("assets/icon/windows/",root));
const windowsDir=fileURLToPath(new URL("windows/",root));
const derived=new Set(readdirSync(resolve(iconDir,"Assets")));
let replaced=0;
(function walk(dir){
 for(const entry of readdirSync(dir,{withFileTypes:true})){
  const full=resolve(dir,entry.name);
  if(entry.isDirectory()){ if(!["node_modules","x64","Debug","Release"].includes(entry.name)) walk(full); continue; }
  if(derived.has(entry.name)){ copyFileSync(resolve(iconDir,"Assets",entry.name),full); replaced++; }
  else if(entry.name.endsWith(".ico")){ copyFileSync(resolve(iconDir,"app.ico"),full); replaced++; }
 }
})(windowsDir);
console.log(`Replaced ${replaced} template icon files with the derived app icon.`);
// App identity: init-windows writes the project name into the package
// manifest, and Start and the taskbar show the manifest's DisplayName, not
// app.json displayName. Write the launcher name into both DisplayName fields.
const displayName=JSON.parse(readFileSync(new URL("app.json",root),"utf8")).displayName;
if(typeof displayName!=="string"||!displayName.trim())throw new Error("app.json has no displayName");
const xmlName=displayName.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
let manifests=0;
(function walk(dir){
 for(const entry of readdirSync(dir,{withFileTypes:true})){
  const full=resolve(dir,entry.name);
  if(entry.isDirectory()){ if(!["node_modules","x64","Debug","Release","AppPackages"].includes(entry.name)) walk(full); continue; }
  if(!entry.name.endsWith(".appxmanifest"))continue;
  let source=readFileSync(full,"utf8");
  const properties=/<DisplayName>[^<]*<\/DisplayName>/;
  const visual=/(<uap:VisualElements\b[^>]*?\bDisplayName=")[^"]*(")/;
  if(!properties.test(source)||!visual.test(source))throw new Error(`Official package manifest template changed: ${entry.name}`);
  source=source.replace(properties,`<DisplayName>${xmlName}</DisplayName>`).replace(visual,`$1${xmlName}$2`);
  writeFileSync(full,source);
  manifests++;
 }
})(windowsDir);
if(manifests===0)throw new Error("No package manifest found under windows/");
console.log(`Set the package DisplayName to "${displayName}" in ${manifests} manifest(s).`);
// With labels shown, the taskbar names a button by its window title, which
// the template sets to the project name.
edit("windows/NYCTronWindowsExample/NYCTronWindowsExample.cpp",source=>{
 const title=/(\.Title\(L")NYCTronWindowsExample("\))/;
 if(!title.test(source)){ console.log("Window title left as is: the host has no .Title(L\"NYCTronWindowsExample\")."); return source; }
 console.log(`Set the window title to "${displayName}".`);
 return source.replace(title,`$1${displayName.replace(/\\/g,"\\\\").replace(/"/g,'\\"')}$2`);
});
console.log("Prepared Windows consumer solution entry, ProjectReference and native package registration.");
