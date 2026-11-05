import {readFileSync,writeFileSync} from "node:fs";
const root=new URL("../",import.meta.url);
function edit(path,transform){
 const url=new URL(path,root);
 writeFileSync(url,transform(readFileSync(url,"utf8")));
}
edit("windows/NYCTronWindowsExample/NYCTronWindowsExample.vcxproj",source=>{
 if(source.includes("NYCTronFluentFabric.vcxproj"))return source;
 const reference=[
  "<ItemGroup>",
  '<ProjectReference Include="..\\..\\..\\windows\\NYCTronFluentFabric\\NYCTronFluentFabric.vcxproj">',
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
  'Project("{8BC9CEB8-8B4A-11D0-8D11-00A0C91BC942}") = "NYCTronFluentFabric", "..\\..\\windows\\NYCTronFluentFabric\\NYCTronFluentFabric.vcxproj", "'+libraryGuid+'"',
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
edit("metro.config.js",source=>{
 const marker="const config = {";
 if(!source.includes(marker))throw new Error("Official Metro template changed");
 if(source.includes("watchFolders: [path.resolve(__dirname, '..')]"))return source;
 return source.replace(marker,marker+"\n  watchFolders: [path.resolve(__dirname, '..')],");
});
console.log("Prepared Windows consumer solution entry, ProjectReference and native package registration.");
