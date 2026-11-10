import {build} from "esbuild";
import {readFile} from "node:fs/promises";
import {createServer} from "node:http";
import {dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {themeCssVariables} from "../../../core/src/theme.ts";
import {INFRAX_THEME,INFRAX_DARK_THEME} from "../../../core/src/presets/infrax.ts";

const here=dirname(fileURLToPath(import.meta.url));
// The kit styles through `className`, which the host's Uniwind passes to the
// DOM on web. Plain react-native-web drops it, so this lane forwards it the
// same way; without that, every token class silently vanishes from the render.
const forwardClassName={name:"forward-class-name",setup(b){
  b.onLoad({filter:/react-native-web[\\/]dist[\\/]modules[\\/](forwardedProps|createDOMProps)[\\/]index\.js$/},async args=>{
    let text=await readFile(args.path,"utf8");
    const patched=args.path.includes("forwardedProps")
      ?text.replace("export var defaultProps = {","export var defaultProps = {\n  className: true,")
      :text.replace("domProps.className = className;","domProps.className = props.className ? className + \" \" + props.className : className;")
        .replace("if (className) {","if (className || props.className) {");
    if(patched===text)throw new Error("className forwarding patch no longer applies to "+args.path);
    return {contents:patched,loader:"js"};
  });
}};
const bundle=await build({entryPoints:[resolve(here,"fixture.tsx")],bundle:true,write:false,
  format:"iife",jsx:"automatic",platform:"browser",plugins:[forwardClassName],
  alias:{"react-native":"react-native-web",
    // Same source the expo-controls tsconfig maps; the kit is not an npm dependency here.
    "@nyc-tron/ui":resolve(here,"../../../ui/src"),
    // Public core geometry shared by the UI overlays; use its real source in this isolated lane.
    "@nyc-tron/core/overlays":resolve(here,"../../../core/src/overlays.ts"),
    // One React and one Zustand even when a workspace install left copies in packages/*/node_modules.
    "react":resolve(here,"node_modules/react"),"react-dom":resolve(here,"node_modules/react-dom"),
    "zustand":resolve(here,"node_modules/zustand")},nodePaths:[resolve(here,"node_modules")],
  define:{"process.env.NODE_ENV":'"development"'}});
// Stand-in for the consuming app's Tailwind/Uniwind output: the InFraX tokens
// as CSS variables plus only the utility classes these components use. The
// components themselves only ever name tokens.
const vars=theme=>Object.entries(themeCssVariables(theme)).map(([k,v])=>k+":"+v).join(";");
const css=[
  ":root{"+vars(INFRAX_THEME)+";color-scheme:light}",
  ":root[data-theme=dark]{"+vars(INFRAX_DARK_THEME)+";color-scheme:dark}",
  "html,body{margin:0;background:var(--color-surface-sunken);color:var(--color-text);font:16px/1.4 system-ui,sans-serif}",
  "::selection{background:var(--color-accent);color:var(--color-on-primary)}",
  // Inset so rings survive overflow-hidden overlay surfaces.
  ":focus-visible{outline:2px solid var(--color-focus);outline-offset:-2px}",
  ".bg-primary\\/10,.focus-visible\\:bg-primary\\/10:focus-visible{background-color:color-mix(in srgb,var(--color-primary) 10%,transparent)}",
  ".bg-surface-raised{background-color:var(--color-surface-raised)}",
  ".bg-surface-sunken,.focus-visible\\:bg-surface-sunken:focus-visible{background-color:var(--color-surface-sunken)}",
  ".border{border-width:1px;border-style:solid}.border-b{border-bottom-width:1px;border-bottom-style:solid}",
  ".border-border{border-color:var(--color-border)}.border-danger{border-color:var(--color-danger)}",
  ".text-text{color:var(--color-text)}.text-text-muted{color:var(--color-text-muted)}.text-danger{color:var(--color-danger)}",
  ".text-sm{font-size:14px}.text-base{font-size:16px}.font-semibold{font-weight:600}",
  ".rounded-control{border-radius:var(--radius-control,4px)}",
  ".p-2{padding:8px}.px-2{padding-left:8px;padding-right:8px}.px-3{padding-left:12px;padding-right:12px}.py-1{padding-top:4px;padding-bottom:4px}",
  ".gap-1{gap:4px}.gap-2{gap:8px}.min-h-12{min-height:48px}.min-h-11{min-height:44px}",
  ".flex-row{flex-direction:row}.items-center{align-items:center}.flex-1{flex:1 1 0%}.w-full{width:100%}.min-w-0{min-width:0}",
  ".opacity-50{opacity:.5}",
].join("\n");
// Only the test document bootstrap is HTML. The rendered UI uses the actual RN components.
const document='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Overlay acceptance</title><style>'+css+'</style><script>if(new URLSearchParams(location.search).get("theme")==="dark")document.documentElement.dataset.theme="dark";</script></head><body><div id="root"></div><script src="/bundle.js"></script></body></html>';
createServer((req,res)=>{
  if(req.url==="/bundle.js"){
    res.writeHead(200,{"Content-Type":"text/javascript"});res.end(bundle.outputFiles[0].contents);
  }else if(req.url==="/"||req.url.startsWith("/?")){
    res.writeHead(200,{"Content-Type":"text/html"});res.end(document);
  }else{res.writeHead(404);res.end();}
}).listen(4178,"127.0.0.1");
