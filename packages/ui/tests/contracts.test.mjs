import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync,existsSync,readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve,dirname } from "node:path";
import { dataTableLayout,tableContentWidth } from "../src/components/data/table-layout.ts";
const pkgPath=new URL("../package.json",import.meta.url);
const root=dirname(fileURLToPath(pkgPath));
const pkg=JSON.parse(readFileSync(pkgPath,"utf8"));
test("all direct component export targets are actual independent files",()=>{
 for(const [subpath,target] of Object.entries(pkg.exports)){
   const entry=typeof target==="string"?target:target.default;
  assert.equal(typeof entry,"string",`Expected ESM export path for ${subpath}`);
  const base=entry.replace("/dist/","/src/");
  const fallback=base.endsWith(".js")?base.slice(0,-3):base;
  assert.ok(
    existsSync(resolve(root,entry)) ||
    existsSync(resolve(root,fallback+".ts")) ||
    existsSync(resolve(root,fallback+".tsx")),
    `Missing source or compiled export ${subpath}: ${entry}`
  );
 }
 // The editor controls moved to @nitro-forge/editor-controls; none of their
 // subpaths may come back, and the root barrel stays free of them.
 assert.ok(!Object.keys(pkg.exports).some(k=>k.startsWith("./components/forge/")),"no components/forge subpaths");
 assert.ok(!readFileSync(resolve(root,"src/index.ts"),"utf8").includes("./components/forge"));
});
// The helpers that stayed in NYC-Tron when the editor controls moved to
// @nitro-forge/editor-controls (from forge/toggle-a11y.ts and
// forge/canvas/SettingSwitch.tsx); the moved controls keep these checks there.
test("relocated editor helpers never import engine packages or app-specific palettes",()=>{
 for(const file of ["forms/toggle-a11y.ts","forms/SettingSwitch.tsx"]){
  const text=readFileSync(resolve(root,"src/components",file),"utf8");
  assert.ok(!/from\s+["'](?:@nitro-forge\/|@acme\/|@reactvision\/)/.test(text),file);
 }
 assert.ok(!/\buseState\b/.test(readFileSync(resolve(root,"src/components/forms/SettingSwitch.tsx"),"utf8")),"SettingSwitch keeps app state in React state");
});
test("data tables switch to labeled record cards in portrait and narrow split panes",()=>{
  for(const width of [280,320,360,390,430,480,599]){
    assert.equal(dataTableLayout({containerWidth:width}),"cards",String(width));
  }
  for(const width of [620,768,900,1024]){
    assert.equal(dataTableLayout({containerWidth:width}),"table",String(width));
  }
  assert.equal(dataTableLayout({containerWidth:null}),"cards");
  assert.equal(dataTableLayout({containerWidth:900,layout:"cards"}),"cards");
  assert.equal(dataTableLayout({containerWidth:320,layout:"table"}),"table");
  assert.equal(dataTableLayout({containerWidth:410,cardsBelow:400}),"table");
  assert.equal(tableContentWidth(400,7,144),1008);
  assert.equal(tableContentWidth(900,3,144),900);
});

test("responsive implementation measures host panes, not window screen dimensions",()=>{
  const data=readFileSync(resolve(root,"src/components/data/DataTable.tsx"),"utf8");
  assert.ok(data.includes("onLayout={onHostLayout}"));
  assert.ok(data.includes('displayMode === "cards"'));
  assert.ok(data.includes("getColumnLabel"));
  assert.ok(data.includes("ListEmptyComponent"));
  assert.ok(!data.includes("useWindowDimensions"));
});

const componentSources=(dir=resolve(root,"src/components"))=>
  readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()
    ? componentSources(resolve(dir,e.name))
    : /\.tsx?$/.test(e.name)?[resolve(dir,e.name)]:[]);
test("every semantic token a component uses is documented for consumers",()=>{
  const doc=readFileSync(resolve(root,"../../docs/THEME_TOKENS.md"),"utf8");
  const documented=new Set([...doc.matchAll(/--(?:color|radius)-([a-z-]+)/g)].map(m=>m[1]));
  const tokenClass=/\b(?:bg|text|border|ring|rounded)-((?:on-)?(?:primary|danger)|info|success|surface-(?:raised|sunken)|text(?:-muted)?|accent|border|focus|control|card)\b/g;
  const used=new Set();
  for(const file of componentSources()){
    for(const m of readFileSync(file,"utf8").matchAll(tokenClass))used.add(m[1]);
  }
  assert.ok(used.size>5);
  for(const token of used)assert.ok(documented.has(token),`Undocumented token ${token}`);
  // Names a theme might define but no component recipe documents. Only
  // string literals are checked, so prose in comments cannot trip it.
  const legacy=new Set(["text-foreground","bg-surface","text-muted","bg-background","border-surface"]);
  for(const file of componentSources()){
    const literals=readFileSync(file,"utf8").match(/"[^"\n]*"|'[^'\n]*'/g)??[];
    for(const lit of literals)for(const cls of lit.slice(1,-1).split(/\s+/)){
      assert.ok(!legacy.has(cls),`${file} uses undocumented token ${cls}`);
    }
  }
});
test("interactive controls keep screen-reader semantics",()=>{
  const read=p=>readFileSync(resolve(root,"src/components",p),"utf8");
  const rail=read("NavigationRail.tsx");
  assert.ok(rail.includes('accessibilityRole="tablist"'));
  assert.ok(rail.includes('accessibilityRole="tab"'));
  assert.ok(!rail.includes('accessibilityRole="menu"'));
  const table=read("data/DataTable.tsx");
  assert.ok(!table.includes("accessibilityLabel={`Record "),"record cards must not hide field values");
  assert.ok(!table.includes("Open record"));
});
test("components take colors from theme tokens, not hardcoded hex values",()=>{
  for(const file of componentSources()){
    const text=readFileSync(file,"utf8");
    const hex=text.match(/["'`]#[0-9A-Fa-f]{3,8}["'`]/g);
    assert.equal(hex,null,`${file} hardcodes ${hex}`);
  }
});
test("every adjustable control can be adjusted by a screen reader",()=>{
  for(const file of componentSources()){
    const text=readFileSync(file,"utf8");
    const adjustable=(text.match(/accessibilityRole=(?:"adjustable"|\{[^}]*"adjustable")/g)??[]).length;
    const actions=(text.match(/accessibilityActions=/g)??[]).length;
    assert.ok(actions>=adjustable,`${file}: ${adjustable} adjustable roles but ${actions} action sets`);
  }
});
// RN 0.88 ReactAccessibilityDelegate.AccessibilityRole.fromValue throws
// IllegalArgumentException for anything outside this list; ARIA-only roles
// such as row/cell/columnheader must go through the `role` prop instead.
const ANDROID_ACCESSIBILITY_ROLES=new Set(["none","button","dropdownlist","togglebutton","link","search","image",
  "imagebutton","keyboardkey","text","adjustable","summary","header","alert","checkbox","combobox","menu","menubar",
  "menuitem","progressbar","radio","radiogroup","scrollbar","spinbutton","switch","tab","tabbar","tablist","timer",
  "list","grid","pager","scrollview","horizontalscrollview","viewgroup","webview","drawerlayout","slidingdrawer",
  "iconmenu","toolbar"]);
test("accessibilityRole only uses values Android's enum accepts",()=>{
  let checked=0;
  for(const file of componentSources()){
    const text=readFileSync(file,"utf8");
    for(const m of text.matchAll(/accessibilityRole=(\{[^}]*\}|"[^"]*")/g)){
      for(const role of m[1].matchAll(/"([a-z]+)"/g)){
        assert.ok(ANDROID_ACCESSIBILITY_ROLES.has(role[1]),`${file}: accessibilityRole "${role[1]}" crashes Android; use role=`);
        checked++;
      }
    }
  }
  assert.ok(checked>20);
});
test("data grids expose grid semantics instead of per-cell buttons",()=>{
  const tree=readFileSync(resolve(root,"src/components/data/TreeGrid.tsx"),"utf8");
  for(const role of ["treegrid","row","columnheader","cell"])assert.ok(tree.includes(`role="${role}"`),role);
  assert.ok(tree.includes("treeRowAccessibilityLabel(item)"));
  assert.ok(tree.includes("minHeight:44"));
});
