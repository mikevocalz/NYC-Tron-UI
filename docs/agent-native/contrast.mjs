// Usage: node docs/agent-native/contrast.mjs [--json]
// WCAG 2.1 contrast ratios for the colour-token pairs the tier 1 components use.
// Values come from docs/agent-native/tokens.json (reference_light / reference_dark),
// which mirrors packages/core/src/theme.ts TRON_THEME_TOKENS and docs/THEME_TOKENS.md.
// No dependencies. Thresholds: text 4.5, UI component or graphic 3.0 (SC 1.4.3, 1.4.11).
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const tokens=JSON.parse(fs.readFileSync(path.join(here,"tokens.json"),"utf8")).tokens;
const C={light:{},dark:{}};
for(const t of tokens)if(t.category==="color"){
  const k=t.name.replace(/^color\./,"");C.light[k]=t.value.reference_light;C.dark[k]=t.value.reference_dark;}
const hex=h=>{h=h.replace("#","");return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16));};
const lin=v=>{v/=255;return v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4;};
const lum=([r,g,b])=>0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);};
// colour spec: "name" or "name/alpha>over" meaning name at alpha composited over token `over`
const resolve=(spec,mode)=>{
  const m=/^(\w+)\/(\d+)>(\w+)$/.exec(spec);
  if(spec.startsWith("#"))return hex(spec);
  if(!m)return hex(C[mode][spec]);
  const f=hex(C[mode][m[1]]),b=hex(C[mode][m[3]]),a=+m[2]/100;
  return f.map((v,i)=>Math.round(v*a+b[i]*(1-a)));
};
// [id, foreground, background, kind, where it occurs]
const PAIRS=[
 ["text/surfaceRaised","text","surfaceRaised","text","body and label text on cards, popovers, banners, list rows"],
 ["text/surfaceSunken","text","surfaceSunken","text","field text, tab bars, inspector rows"],
 ["textMuted/surfaceRaised","textMuted","surfaceRaised","text","supporting text, inactive tabs, group labels on raised surfaces"],
 ["textMuted/surfaceSunken","textMuted","surfaceSunken","text","neutral Badge label, hint text, inactive tabs on sunken surfaces"],
 ["onPrimary/primary","onPrimary","primary","text","Button primary, selected tab, segment, tool, drawer item, Select option"],
 ["onDanger/danger","onDanger","danger","text","Button danger"],
 ["danger/surfaceRaised","danger","surfaceRaised","text","text-danger on raised surfaces (ErrorMessage, Select message)"],
 ["danger/surfaceSunken","danger","surfaceSunken","text","text-danger on sunken surfaces (TextField, UnitInput errors)"],
 ["text/primary10>surfaceRaised","text","primary/10>surfaceRaised","text","selected row or tool tint (CommandPalette, RibbonTabs, PresetGallery)"],
 ["textMuted/primary10>surfaceRaised","textMuted","primary/10>surfaceRaised","text","muted text on the selected tint"],
 ["textMuted/dangerHover","textMuted","danger","graphic","WindowTitleBar glyph strokes (border-text-muted) on hover:bg-danger (windows layout, close)"],
 ["border/surfaceRaised","border","surfaceRaised","ui","control and card outline on raised surfaces"],
 ["border/surfaceSunken","border","surfaceSunken","ui","field outline on sunken surfaces (TextField, Select, FindReplace)"],
 ["focus/surfaceRaised","focus","surfaceRaised","ui","focus ring against raised surfaces"],
 ["focus/surfaceSunken","focus","surfaceSunken","ui","focus ring against sunken surfaces"],
 ["focus/primary","focus","primary","ui","focus ring against a selected (bg-primary) control"],
 ["accent/surfaceRaised","accent","surfaceRaised","ui","accent slider thumb, progress fill, toggled outline"],
 ["accent/surfaceSunken","accent","surfaceSunken","ui","accent track fill, scrubber progress"],
 ["info/surfaceRaised","info","surfaceRaised","ui","Banner and Badge info border and mark"],
 ["success/surfaceRaised","success","surfaceRaised","ui","Banner and Badge success border and mark"],
 ["danger/surfaceRaisedUI","danger","surfaceRaised","ui","Banner and Badge danger border and mark"],
 ["primary/surfaceRaised","primary","surfaceRaised","ui","ToastAndProgress bar fill on a raised track"],
 ["surfaceSunken/surfaceRaised","surfaceSunken","surfaceRaised","ui","hover and active-option highlight (bg-surface-sunken) against a raised list or bar"],
 ["primary10>surfaceRaised/surfaceRaised","primary/10>surfaceRaised","surfaceRaised","ui","active-option highlight (bg-primary/10) against the raised list (CommandPalette, CommandPopover)"],
 ["iosSpinner/primary","#999999","primary","ui","ActivityIndicator with no color prop on iOS (#999999 per the React Native docs) inside a primary Button"],
 ["iosSpinner/surfaceRaised","#999999","surfaceRaised","ui","same spinner on a raised surface (ToastAndProgress rows)"],
 ["iosSpinner/danger","#999999","danger","ui","same spinner inside a danger Button"],
 ["textMuted/surfaceRaisedUI","textMuted","surfaceRaised","graphic","glyph strokes (clear, chevron, close) drawn in text-muted"],
 ["textMuted/surfaceSunkenUI","textMuted","surfaceSunken","graphic","glyph strokes on sunken surfaces"],
];
export function compute(){
  const rows=[];
  for(const [id,fg,bg,kind,where] of PAIRS){
    const r={id,kind,where,fg,bg};
    for(const mode of ["light","dark"]){
      const f=resolve(fg,mode),b=resolve(bg,mode);
      const need=kind==="text"?4.5:3;
      const v=ratio(f,b);r[mode]={ratio:+v.toFixed(2),need,pass:v>=need};
    }
    r.status=r.light.pass&&r.dark.pass?"PASS":"FAIL";
    rows.push(r);
  }
  return rows;
}
// Smallest step from `from` toward `toward` that reaches `need`:1 on every surface listed. Used for the deferred-fix candidates.
export function suggest(from,toward,surfaces,need=3){
  for(const mode of ["light","dark"]){
    let hit=null;
    for(let p=0;p<=100;p++){
      const a=hex(C[mode][from]),b=hex(C[mode][toward]);
      const c=a.map((v,i)=>Math.round(v+(b[i]-v)*p/100));
      if(surfaces.every(s=>ratio(c,hex(C[mode][s]))>=need)){hit=c;break;}
    }
    console.log(mode,hit?"#"+hit.map(v=>v.toString(16).padStart(2,"0")).join(""):"none");
  }
}
if(process.argv[1]===fileURLToPath(import.meta.url)&&process.argv[2]==="--suggest"){
  // node docs/agent-native/contrast.mjs --suggest border text surfaceRaised,surfaceSunken 3
  suggest(process.argv[3],process.argv[4],process.argv[5].split(","),+(process.argv[6]||3));
}else if(process.argv[1]===fileURLToPath(import.meta.url)){
  const rows=compute();
  if(process.argv.includes("--json"))console.log(JSON.stringify(rows,null,1));
  else{
    console.log("pair | kind | light | dark | need | status");
    for(const r of rows)console.log(`${r.id} | ${r.kind} | ${r.light.ratio} | ${r.dark.ratio} | ${r.light.need} | ${r.status}`);
  }
}
