import {build} from "esbuild";
import {createServer} from "node:http";
import {dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url";

const here=dirname(fileURLToPath(import.meta.url));
const bundle=await build({entryPoints:[resolve(here,"fixture.tsx")],bundle:true,write:false,
  format:"iife",jsx:"automatic",platform:"browser",
  alias:{"react-native":"react-native-web",
    // Same source the expo-controls tsconfig maps; the kit is not an npm dependency here.
    "@nyc-tron/ui":resolve(here,"../../../ui/src"),
    // One React and one Zustand even when a workspace install left copies in packages/*/node_modules.
    "react":resolve(here,"node_modules/react"),"react-dom":resolve(here,"node_modules/react-dom"),
    "zustand":resolve(here,"node_modules/zustand")},nodePaths:[resolve(here,"node_modules")],
  define:{"process.env.NODE_ENV":'"development"'}});
// Only the test document bootstrap is HTML. The rendered UI uses the actual RN components.
const document='<!doctype html><html><head><meta charset="utf-8"><title>Menu acceptance</title></head><body><div id="root"></div><script src="/bundle.js"></script></body></html>';
createServer((req,res)=>{
  if(req.url==="/bundle.js"){
    res.writeHead(200,{"Content-Type":"text/javascript"});res.end(bundle.outputFiles[0].contents);
  }else if(req.url==="/"){
    res.writeHead(200,{"Content-Type":"text/html"});res.end(document);
  }else{res.writeHead(404);res.end();}
}).listen(4178,"127.0.0.1");
