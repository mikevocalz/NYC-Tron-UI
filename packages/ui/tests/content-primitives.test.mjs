import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { acceptsFile, dragDepth, matchesAccept, matchesMime, parseAccept } from "../src/components/files/drop-model.ts";

const pkg=JSON.parse(readFileSync(new URL("../package.json",import.meta.url),"utf8"));
const src=p=>readFileSync(new URL("../src/components/"+p,import.meta.url),"utf8");

test("accept strings follow the HTML input syntax",()=>{
  assert.deepEqual(parseAccept(" .DOCX, .nfd ,,image/*,application/pdf"),[
    {kind:"extension",value:".docx"},{kind:"extension",value:".nfd"},
    {kind:"mimeGroup",value:"image/"},{kind:"mime",value:"application/pdf"},
  ]);
  assert.equal(matchesAccept({fileName:"Essay.DOCX",type:""},".docx,.nfd"),true);
  assert.equal(matchesAccept({fileName:"essay.docx.exe",type:""},".docx"),false);
  assert.equal(matchesAccept({fileName:"a.png",type:"image/png"},"image/*"),true);
  assert.equal(matchesAccept({fileName:"a.pdf",type:"application/pdf"},"image/*"),false);
  assert.equal(matchesAccept({fileName:"x"},undefined),true);
  assert.equal(matchesAccept({fileName:"x"},""),true);
});

test("MIME allowlists keep expo-drag-drop-content-view semantics",()=>{
  assert.equal(matchesMime("image/png",undefined),true);
  assert.equal(matchesMime("image/png",[]),false);
  const re=/^image\//g;
  // A global RegExp keeps lastIndex between calls; it must not skip a match.
  assert.equal(matchesMime("image/png",[re]),true);
  assert.equal(matchesMime("image/jpeg",[re]),true);
  assert.equal(acceptsFile({fileName:"a.nfd",type:""},".nfd",["application/octet-stream"]),true);
  assert.equal(acceptsFile({fileName:"a.nfd",type:""},".nfd",["image/png"]),false);
});

test("nested drag targets report one enter and one exit",()=>{
  let s={depth:0};const edges=[];
  for(const e of ["enter","enter","leave","enter","leave","leave"]){
    s=dragDepth(s.depth,e);if(s.edge)edges.push(s.edge);
  }
  assert.deepEqual(edges,["enter","exit"]);
  assert.deepEqual(dragDepth(2,"drop"),{depth:0,edge:"exit"});
  assert.deepEqual(dragDepth(0,"drop"),{depth:0,edge:null});
  assert.deepEqual(dragDepth(0,"leave"),{depth:0,edge:null});
});

test("every part B primitive has its own subpath with platform forks where needed",()=>{
  for(const sub of ["feedback/Banner","feedback/Badge","feedback/EmptyState","feedback/ErrorMessage",
    "content/KeyValueList","theme/NightScope","files/drop-model"]){
    assert.ok(pkg.exports["./components/"+sub],sub);
  }
  for(const sub of ["files/DropZone","files/FilePicker","html"]){
    const e=pkg.exports["./components/"+sub];
    assert.match(e["react-native"],/\.native\.js$/,sub);
    assert.match(e.browser,/\.web\.js$/,sub);
    assert.match(e.default,/\.web\.js$/,sub);
  }
  assert.ok(!readFileSync(new URL("../src/index.ts",import.meta.url),"utf8").match(/feedback|content\/|files\/|html\/|NightScope/),
    "root barrel stays small");
});

test("native-only and styling peers stay optional and confined to their subpaths",()=>{
  for(const peer of ["expo-drag-drop-content-view","uniwind"]){
    assert.ok(pkg.peerDependencies[peer],peer);
    assert.equal(pkg.peerDependenciesMeta[peer]?.optional,true,peer);
  }
  assert.ok(src("files/DropZone.native.tsx").includes('from "expo-drag-drop-content-view"'));
  assert.ok(!src("files/DropZone.web.tsx").includes('from "expo-drag-drop-content-view"'),
    "the package's 0.9.2 web bundle breaks Vite; web uses its own listeners");
  for(const f of ["feedback/Banner.tsx","feedback/Badge.tsx","feedback/EmptyState.tsx","feedback/ErrorMessage.tsx",
    "content/KeyValueList.tsx","files/DropZone.web.tsx","html/semantic.web.tsx","html/semantic.native.tsx"]){
    assert.ok(!src(f).includes("uniwind"),f+" must not need uniwind");
  }
});

test("feedback semantics: live regions, alert only on request, 44pt dismiss, no color-only state",()=>{
  const banner=src("feedback/Banner.tsx");
  assert.ok(banner.includes('live="status"'),"polite by default");
  assert.ok(banner.includes("role={live}"));
  assert.ok(banner.includes("min-h-11 min-w-11"),"dismiss target is 44pt");
  assert.ok(banner.includes('accessibilityLabel={dismissLabel}'));
  const error=src("feedback/ErrorMessage.tsx");
  assert.ok(error.includes('role="alert"'));
  assert.ok(error.includes("if(!message)return null"));
  assert.ok(error.includes('StatusGlyph tone="danger"'),"a drawn mark, not color alone");
  assert.ok(src("feedback/EmptyState.tsx").includes('role="heading"'));
  assert.ok(src("files/FilePicker.types.ts").includes("min-h-11"));
});

test("semantic set: real elements on web, roles (never accessibilityRole) on native",()=>{
  const web=src("html/semantic.web.tsx");
  for(const tag of ['"main"','"header"','"footer"','"section"','"nav"','"p"','"span"','"a"','"h"+level']){
    assert.ok(web.includes(tag),tag);
  }
  assert.ok(web.includes("unstable_createElement"));
  const native=src("html/semantic.native.tsx");
  assert.ok(!native.includes("accessibilityRole="),"Android's enum throws on landmark roles");
  for(const role of ['"main"','"banner"','"contentinfo"','"region"','"navigation"','"heading"']){
    assert.ok(native.includes(role),role);
  }
  assert.ok(native.includes("Linking.openURL"));
  assert.ok(native.includes('role={press?"link":undefined}'),"a link with nowhere to go is not announced as one");
});

test("FilePicker never renders a dead control on native",()=>{
  const native=src("files/FilePicker.native.tsx");
  assert.ok(native.includes("return null"));
  assert.ok(native.includes("DEFER (2026-11-05)"));
  const web=src("files/FilePicker.web.tsx");
  assert.ok(web.includes('accessibilityRole="button"'));
  assert.ok(web.includes("input.remove()"),"the transient input is cleaned up");
});
