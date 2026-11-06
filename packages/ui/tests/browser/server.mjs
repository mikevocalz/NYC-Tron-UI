import {build} from "esbuild";
import {execFileSync} from "node:child_process";
import {readdirSync,readFileSync} from "node:fs";
import {createServer} from "node:http";
import {dirname,resolve} from "node:path";
import {createRequire} from "node:module";
import {fileURLToPath} from "node:url";

const here=dirname(fileURLToPath(import.meta.url));
const css=execFileSync(resolve(here,"node_modules/.bin/tailwindcss"),["-i",resolve(here,"theme.css")],{cwd:here,encoding:"utf8"});
// One bundle per fixture: fixture.tsx at "/", primitives.tsx at "/primitives",
// and each fixtures/<name>.tsx at "/<name>".
const fixtures=[["spreadsheet",resolve(here,"spreadsheet.tsx")],["",resolve(here,"fixture.tsx")],["primitives",resolve(here,"primitives.tsx")],
  ...readdirSync(resolve(here,"fixtures")).filter(f=>f.endsWith(".tsx")).map(f=>[f.slice(0,-4),resolve(here,"fixtures",f)])];
const uiRequire=createRequire(resolve(here,"../../package.json"));
const bundleOf=entry=>build({
  plugins:[{name:"public-ui-exports",setup(builder){
    builder.onResolve({filter:/^@nyc-tron\/ui(?:\/|$)/},args=>({path:uiRequire.resolve(args.path)}));
  }}],entryPoints:[entry],bundle:true,write:false,
  format:"iife",jsx:"automatic",platform:"browser",
  // Match web-aware consumers when a package ships platform file siblings.
  resolveExtensions:[".web.tsx",".web.ts",".web.jsx",".web.js",".tsx",".ts",".jsx",".js",".json"],
  // Pin one React and one zustand: the component sources sit in packages/ui,
  // whose own node_modules (after a workspace install) would otherwise win.
  alias:{"react-native":resolve(here,"rn-shim.tsx"),
    "react-native-gesture-handler":resolve(here,"../../node_modules/react-native-gesture-handler"),
    react:resolve(here,"node_modules/react"),"react-dom":resolve(here,"node_modules/react-dom"),
    zustand:resolve(here,"node_modules/zustand"),
    // Uniwind's web ScopedTheme, reproduced (see uniwind-shim.tsx).
    uniwind:resolve(here,"uniwind-shim.tsx"),
    // NativeSeekBar renders @expo/ui's universal web build (plain RN Views).
    "@expo/ui":resolve(here,"node_modules/@expo/ui/build/universal/index.js")},
  nodePaths:[resolve(here,"node_modules")],
  define:{"process.env.NODE_ENV":'"development"',__DEV__:"true"}});
const bundles=new Map((await Promise.all(fixtures.map(async([name,entry])=>[name,(await bundleOf(entry)).outputFiles[0].contents]))));
// Only the test document bootstrap is HTML. The rendered UI is React Native components.
const doc=script=>'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>UI acceptance</title><link rel="stylesheet" href="/theme.css"></head><body><div id="root" style="min-height:100vh;display:flex"></div><script src="'+script+'"></script></body></html>';
createServer((req,res)=>{
  const path=(req.url??"/").split("?")[0];
  const name=path.slice(1);
  if(path==="/decoder.webm"){res.writeHead(200,{"Content-Type":"video/webm"});res.end(readFileSync(resolve(here,"../../../platform-services/tests/fixtures/decoder.webm")));}
  else if(path==="/bundle.js"){res.writeHead(200,{"Content-Type":"text/javascript"});res.end(bundles.get(""));}
  else if(name.endsWith(".js")&&bundles.has(name.slice(0,-3))){res.writeHead(200,{"Content-Type":"text/javascript"});res.end(bundles.get(name.slice(0,-3)));}
  else if(path==="/theme.css"){res.writeHead(200,{"Content-Type":"text/css"});res.end(css);}
  else if(bundles.has(name)){res.writeHead(200,{"Content-Type":"text/html"});res.end(doc(name?"/"+name+".js":"/bundle.js"));}
  else{res.writeHead(404);res.end();}
}).listen(Number(process.env.UI_ACCEPTANCE_PORT??4179),"127.0.0.1");
