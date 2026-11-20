// Usage: node tokenuse.mjs <repoRoot> <repo-relative source file>...
// Prints, per file, which tokens from docs/agent-native/tokens.json the file uses, via tokens.map.json.
import fs from "node:fs";
const root=process.argv[2];const map=JSON.parse(fs.readFileSync(root+"/docs/agent-native/tokens.map.json")).categories;
const N="(-?[0-9]*\\.?[0-9]+)";
const props={spacing:"padding|paddingHorizontal|paddingVertical|paddingTop|paddingBottom|paddingLeft|paddingRight|paddingStart|paddingEnd|margin|marginTop|marginBottom|marginLeft|marginRight|marginHorizontal|marginVertical|marginStart|marginEnd|gap|rowGap|columnGap",radius:"borderRadius|border(?:Top|Bottom)(?:Left|Right|Start|End)Radius",fontSize:"fontSize",lineHeight:"lineHeight",borderWidth:"borderWidth|borderTopWidth|borderBottomWidth|borderLeftWidth|borderRightWidth",minSize44:"minWidth|minHeight"};
const colorRe=/\b(?:bg|text|border|ring|fill|stroke|divide|outline|placeholder|caret|accent|shadow)-(on-primary|on-danger|surface-raised|surface-sunken|text-muted|primary|border|text|focus|danger|accent|info|success)(?:\/\d+)?\b/g;
const camel=s=>s.replace(/-(\w)/g,(_,c)=>c.toUpperCase());
for(const f of process.argv.slice(3)){const t=fs.readFileSync(root+"/"+f,"utf8");const out={};
 for(const [cat,p] of Object.entries(props)){const re=new RegExp(`\\b(${p})\\s*:\\s*${N}(?![0-9.]*\\s*[*+/%\\w])`,"g");
  for(const m of t.matchAll(re)){const v=m[2];const c=map[cat];const hit=c.onScale?.[v];const off=c.offScale?.[v];
   const tok=hit?hit.token:off?(off.tokenPattern||"offscale").replace("<Component>","<Comp>"):cat==="minSize44"?"no token (only 44 maps, to size.touch)":"UNMAPPED";
   (out[cat]??={});const k=`${m[1]}: ${v} -> ${tok}`;out[cat][k]=(out[cat][k]||0)+1;}}
 for(const m of t.matchAll(/\bopacity\s*:\s*([^,}\n]{1,60})/g))for(const n of m[1].matchAll(/(?<![\w.])(0?\.[0-9]+)(?![\w.])/g)){const v=n[1].replace(/^\./,"0.");const h=map.opacity.onScale?.[v];(out.opacity??={});const k=`opacity ${v} -> ${h?h.token:"offscale/"+JSON.stringify(map.opacity.offScale?.[v]?.tokenPattern)}`;out.opacity[k]=(out.opacity[k]||0)+1;}
 const col={};for(const m of t.matchAll(colorRe)){const k="color."+camel(m[1]);col[k]=(col[k]||0)+1;}if(Object.keys(col).length)out.colorClasses=col;
 const sh={};for(const m of t.matchAll(/rounded-(control|card)\b/g)){sh["radius."+m[1]]=(sh["radius."+m[1]]||0)+1}if(Object.keys(sh).length)out.radiusClasses=sh;
 const tw={};for(const m of t.matchAll(/\b(?:text-(?:xs|sm|base|lg|xl)|font-(?:semibold|medium|bold)|gap-\d+|p[xy]?-\d+|min-h-\[?\w+\]?|min-w-\[?\w+\]?|h-\d+|w-\d+|shadow-\w+|rounded-\w+|opacity-\d+|border(?:-\d+)?)\b/g)){tw[m[0]]=(tw[m[0]]||0)+1}if(Object.keys(tw).length)out.tailwindDefaultClasses=tw;
 console.log("### "+f);console.log(JSON.stringify(out,null,1));}
