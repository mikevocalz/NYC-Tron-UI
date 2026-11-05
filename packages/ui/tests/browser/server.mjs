import {build} from "esbuild";
import {execFileSync} from "node:child_process";
import {createServer} from "node:http";
import {dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url";

const here=dirname(fileURLToPath(import.meta.url));
const css=execFileSync(resolve(here,"node_modules/.bin/tailwindcss"),["-i",resolve(here,"theme.css")],{cwd:here,encoding:"utf8"});
const bundleOf=entry=>build({entryPoints:[resolve(here,entry)],bundle:true,write:false,
  format:"iife",jsx:"automatic",platform:"browser",
  // Pin one React and one zustand: the component sources sit in packages/ui,
  // whose own node_modules (after a workspace install) would otherwise win.
  alias:{"react-native":resolve(here,"rn-shim.tsx"),
    react:resolve(here,"node_modules/react"),"react-dom":resolve(here,"node_modules/react-dom"),
    zustand:resolve(here,"node_modules/zustand")},
  nodePaths:[resolve(here,"node_modules")],
  define:{"process.env.NODE_ENV":'"development"'}});
const bundle=await bundleOf("fixture.tsx");
const primitives=await bundleOf("primitives.tsx");
// Only the test document bootstrap is HTML. The rendered UI is React Native components.
const shell=script=>'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>UI acceptance</title><link rel="stylesheet" href="/theme.css"></head><body><div id="root" style="min-height:100vh;display:flex"></div><script src="'+script+'"></script></body></html>';
const page=shell("/bundle.js");
createServer((req,res)=>{
  const path=(req.url??"/").split("?")[0];
  if(path==="/primitives.js"){res.writeHead(200,{"Content-Type":"text/javascript"});res.end(primitives.outputFiles[0].contents);}
  else if(path==="/primitives"){res.writeHead(200,{"Content-Type":"text/html"});res.end(shell("/primitives.js"));}
  else if(path==="/bundle.js"){res.writeHead(200,{"Content-Type":"text/javascript"});res.end(bundle.outputFiles[0].contents);}
  else if(path==="/theme.css"){res.writeHead(200,{"Content-Type":"text/css"});res.end(css);}
  else if(path==="/"){res.writeHead(200,{"Content-Type":"text/html"});res.end(page);}
  else{res.writeHead(404);res.end();}
}).listen(4179,"127.0.0.1");
