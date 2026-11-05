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
console.log("Prepared Windows consumer ProjectReference and native package registration.");
