import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {
  validateWorkspace,layoutForMode,modeShortcutIndex,modeShortcutLabel,modeAnnouncement,documentLabel,MODE_SHORTCUT_COUNT,
} from "../src/components/shell/workspace-model.ts";
import {
  presetNameProblem,presetNameMessage,copyName,validatePresetList,presetActions,layoutsEqual,PRESET_NAME_MAX,BUILT_IN_PRESET_IDS,
} from "../src/components/shell/workspace-preset-model.ts";
import {
  itemsForSelection,validateToolbarItems,splitOverflow,overflowDescription,
} from "../src/components/shell/contextual-toolbar-model.ts";
import {
  validateExportFormats,snapQuality,applyFormat,defaultExportSettings,filenameProblem,buildExportRequest,exportSummary,
  statusText,importAccept,matchImportFormat,unsupportedFileMessage,destinationLabel,
} from "../src/components/files/file-transfer-model.ts";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(root,"src/components",p),"utf8");

const editLayout={left:{panels:["layers"],active:"layers",size:240},floating:[]};
const colorLayout={right:{panels:["scopes","wheels"],active:"wheels",size:280},floating:[]};
const MODES=[
  {id:"edit",label:"Edit",panels:["layers","properties"],defaultLayout:editLayout},
  {id:"color",label:"Color",panels:["scopes","wheels","layers"],defaultLayout:colorLayout},
];
const PANELS=["layers","properties","scopes","wheels"];

test("workspace validation catches bad modes and layouts outside a mode's panels",()=>{
  validateWorkspace(MODES,{},PANELS);
  validateWorkspace(MODES,{gone:{bottom:{panels:["nope"],active:"nope",size:1},floating:[]}},PANELS);
  assert.throws(()=>validateWorkspace([],{},PANELS),/at least one mode/);
  assert.throws(()=>validateWorkspace([MODES[0],MODES[0]],{},PANELS),/Duplicate/);
  assert.throws(()=>validateWorkspace([{...MODES[0],label:"  "}],{},PANELS),/label/);
  assert.throws(()=>validateWorkspace([{...MODES[0],panels:["ghost"]}],{},PANELS),/unknown panel ghost/);
  assert.throws(()=>validateWorkspace(MODES,{edit:colorLayout},PANELS),/Unknown panel/);
});

test("a mode shows its stored layout, else its default",()=>{
  assert.equal(layoutForMode(MODES[0],{}),editLayout);
  const stored={floating:[{id:"layers",rect:{x:0,y:0,width:200,height:200}}]};
  assert.equal(layoutForMode(MODES[0],{edit:stored}),stored);
});

test("Ctrl or Cmd plus 1 to 9 picks a mode; other chords do not",()=>{
  const k=(key,mods={})=>({key,ctrlKey:false,metaKey:false,altKey:false,shiftKey:false,...mods});
  assert.equal(modeShortcutIndex(k("1",{ctrlKey:true})),0);
  assert.equal(modeShortcutIndex(k("9",{metaKey:true})),8);
  assert.equal(modeShortcutIndex(k("&",{ctrlKey:true,code:"Digit1"})),0,"AZERTY digit row");
  assert.equal(modeShortcutIndex(k("0",{ctrlKey:true})),null);
  assert.equal(modeShortcutIndex(k("1")),null);
  assert.equal(modeShortcutIndex(k("1",{ctrlKey:true,metaKey:true})),null);
  assert.equal(modeShortcutIndex(k("1",{ctrlKey:true,shiftKey:true})),null);
  assert.equal(modeShortcutIndex(k("1",{metaKey:true,altKey:true})),null);
  assert.equal(MODE_SHORTCUT_COUNT,9);
  assert.equal(modeShortcutLabel(0,false),"Ctrl+1");
  assert.equal(modeShortcutLabel(2,true),"⌘3");
  assert.equal(modeShortcutLabel(9,true),undefined);
});

test("mode switches and the document title read as words",()=>{
  assert.equal(modeAnnouncement(MODES,"color"),"Color mode, 2 of 2");
  assert.equal(modeAnnouncement(MODES,"nope"),"");
  assert.equal(documentLabel({id:"d",title:"Poster",dirty:true}),"Poster, unsaved changes");
  assert.equal(documentLabel({id:"d",title:"Poster"}),"Poster");
});

const PRESETS=[
  ...BUILT_IN_PRESET_IDS.map(id=>({id,name:id[0].toUpperCase()+id.slice(1),builtIn:true,modified:false})),
  {id:"c1",name:"Night grade",builtIn:false,modified:true},
];
test("preset names are trimmed, capped and unique regardless of case",()=>{
  assert.equal(presetNameProblem("  ",PRESETS),"empty");
  assert.equal(presetNameProblem("x".repeat(PRESET_NAME_MAX+1),PRESETS),"too-long");
  assert.equal(presetNameProblem("x".repeat(PRESET_NAME_MAX),PRESETS),undefined);
  assert.equal(presetNameProblem(" night GRADE ",PRESETS),"duplicate");
  assert.equal(presetNameProblem("Night grade",PRESETS,"c1"),undefined,"renaming to its own name");
  assert.equal(presetNameProblem("color",PRESETS),"duplicate","built-in names are taken too");
  assert.equal(presetNameMessage("duplicate"," Color "),"A preset named “Color” already exists.");
  assert.equal(presetNameMessage(undefined,"x"),undefined);
});

test("copies get the first free name that fits the cap",()=>{
  assert.equal(copyName("Night grade",PRESETS),"Night grade copy");
  assert.equal(copyName("Night grade",[...PRESETS,{id:"c2",name:"Night grade copy",builtIn:false,modified:false}]),"Night grade copy 2");
  const long="L".repeat(PRESET_NAME_MAX);
  const copy=copyName(long,PRESETS);
  assert.ok(copy.length<=PRESET_NAME_MAX&&copy.endsWith(" copy"));
});

test("built-ins are read-only and reset needs a modified layout",()=>{
  validatePresetList(PRESETS);
  assert.throws(()=>validatePresetList([...PRESETS,PRESETS[0]]),/Duplicate/);
  assert.deepEqual(presetActions(PRESETS[0]),{canRename:false,canDelete:false,canReset:false});
  assert.deepEqual(presetActions(PRESETS[5]),{canRename:true,canDelete:true,canReset:true});
  assert.deepEqual(presetActions(undefined),{canRename:false,canDelete:false,canReset:false});
  assert.ok(layoutsEqual(editLayout,{floating:[],left:{size:240,active:"layers",panels:["layers"]}}));
  assert.ok(!layoutsEqual(editLayout,{...editLayout,left:{...editLayout.left,size:241}}));
  assert.ok(layoutsEqual(editLayout,{...editLayout,right:undefined}));
});

const ITEMS=[
  {id:"bold",label:"Bold",priority:3,appliesTo:["text","mixed"],pressed:true},
  {id:"italic",label:"Italic",priority:2,appliesTo:["text","mixed"],pressed:false},
  {id:"fill",label:"Fill",priority:3,appliesTo:["shape","mixed"]},
  {id:"crop",label:"Crop",priority:1,appliesTo:["image"],disabledReason:"Select one image to crop"},
  {id:"align",label:"Align",priority:1},
  {id:"lock",label:"Lock",priority:1},
];
test("items follow the selection kind and keep declared order",()=>{
  validateToolbarItems(ITEMS);
  assert.throws(()=>validateToolbarItems([...ITEMS,ITEMS[0]]),/Duplicate/);
  assert.throws(()=>validateToolbarItems([{id:"x",label:" "}]),/label/);
  assert.throws(()=>validateToolbarItems([{id:"x",label:"X",priority:Number.NaN}]),/priority/);
  assert.deepEqual(itemsForSelection(ITEMS,"text").map(i=>i.id),["bold","italic","align","lock"]);
  assert.deepEqual(itemsForSelection(ITEMS,"mixed").map(i=>i.id),["bold","italic","fill","align","lock"]);
  assert.deepEqual(itemsForSelection(ITEMS,"none").map(i=>i.id),["align","lock"]);
});

test("overflow drops the lowest priority, last declared first, and always leaves the trigger room",()=>{
  const items=itemsForSelection(ITEMS,"mixed");
  const widths={bold:44,italic:44,fill:60,align:60,lock:44};
  const geo={widths,gap:4,overflowWidth:44};
  // 44+4+44+4+60+4+60+4+44 = 268
  assert.deepEqual(splitOverflow(items,{...geo,available:268}),{visible:["bold","italic","fill","align","lock"],overflow:[]});
  // One point short: reserve 44+4 for More, so 219 for items. Lock (last p1) leaves, then align.
  assert.deepEqual(splitOverflow(items,{...geo,available:267}),{visible:["bold","italic","fill"],overflow:["align","lock"]});
  // Priority is strict: italic (2) leaves before fill (3) even though it is narrower.
  assert.deepEqual(splitOverflow(items,{...geo,available:150}),{visible:["bold"],overflow:["italic","fill","align","lock"]});
  assert.deepEqual(splitOverflow(items,{...geo,available:160}),{visible:["bold","fill"],overflow:["italic","align","lock"]});
  assert.deepEqual(splitOverflow(items,{...geo,available:60}),{visible:[],overflow:["bold","italic","fill","align","lock"]});
  assert.deepEqual(splitOverflow(items,{...geo,available:10}).visible,[]);
  // Unmeasured items count as the fallback width.
  assert.deepEqual(splitOverflow(items,{widths:{},gap:0,overflowWidth:44,available:5*44}).overflow,[]);
  assert.throws(()=>splitOverflow(items,{...geo,available:Number.NaN}),RangeError);
  assert.equal(overflowDescription(ITEMS[0]),"On");
  assert.equal(overflowDescription(ITEMS[1]),"Off");
  assert.equal(overflowDescription(ITEMS[3]),"Select one image to crop");
  assert.equal(overflowDescription(ITEMS[4]),undefined);
});

const FORMATS=[
  {id:"png",label:"PNG",extension:"png",mimeType:"image/png",
    metadata:[{kind:"text",id:"title",label:"Title"},{kind:"text",id:"author",label:"Author"}]},
  {id:"jpeg",label:"JPEG",extension:"jpg",mimeType:"image/jpeg",quality:{min:10,max:100,step:5,default:85,unit:"%"},
    metadata:[{kind:"text",id:"title",label:"Title"},{kind:"toggle",id:"strip-location",label:"Remove location data",default:true}]},
];
const DESTS=[{id:"share",available:false,reason:"Sharing needs the iOS or Android app"},{id:"files",available:true},{id:"download",available:true}];

test("export formats validate and quality snaps into range",()=>{
  validateExportFormats(FORMATS);
  assert.throws(()=>validateExportFormats([]),/at least one/);
  assert.throws(()=>validateExportFormats([{...FORMATS[0],extension:".png"}]),/without a dot/);
  assert.throws(()=>validateExportFormats([{...FORMATS[1],quality:{min:10,max:5,step:1,default:7,unit:"%"}}]),RangeError);
  assert.throws(()=>validateExportFormats([{...FORMATS[0],metadata:[{kind:"text",id:"t",label:"T"},{kind:"text",id:"t",label:"T"}]}]),/repeats/);
  const q=FORMATS[1].quality;
  assert.equal(snapQuality(83,q),85);
  assert.equal(snapQuality(500,q),100);
  assert.equal(snapQuality(Number.NaN,q),85);
});

test("default settings pick the first available destination and switching format swaps the extension",()=>{
  const s=defaultExportSettings(FORMATS,DESTS,"Harbor poster");
  assert.deepEqual(s,{formatId:"png",metadata:{title:"",author:""},destination:"files",filename:"Harbor poster.png"});
  const jpeg=applyFormat({...s,metadata:{title:"Harbor",author:"Ana"}},FORMATS[1]);
  assert.deepEqual(jpeg,{formatId:"jpeg",metadata:{title:"Harbor","strip-location":true},destination:"files",filename:"Harbor poster.jpg",quality:85});
  assert.equal(applyFormat({...jpeg,quality:40},FORMATS[1]).quality,40);
  assert.equal(applyFormat({...s,filename:"   "},FORMATS[1]).filename,"");
  assert.equal(applyFormat({...s,filename:"notes"},FORMATS[1]).filename,"notes.jpg");
});

test("file names are checked for extension, characters, length and reserved names",()=>{
  assert.equal(filenameProblem("Poster.png","png"),undefined);
  assert.equal(filenameProblem("Poster.PNG","png"),undefined);
  assert.equal(filenameProblem(" ","png"),"Enter a file name.");
  assert.equal(filenameProblem("Poster.jpg","png"),"End the name with .png.");
  assert.equal(filenameProblem(".png","png"),"Enter a name before .png.");
  assert.match(filenameProblem("a/b.png","png"),/can’t contain/);
  assert.match(filenameProblem("x".repeat(260)+".png","png"),/255/);
  assert.match(filenameProblem("CON.png","png"),/reserved on Windows/);
  assert.equal(filenameProblem("Poster .png","png"),"Remove the space or dot before the extension.");
});

test("the export request is validated and carries only what the format declares",()=>{
  const settings={formatId:"jpeg",quality:83,metadata:{title:"  Harbor  ",author:"Ana","strip-location":true},destination:"files",filename:" Poster.jpg "};
  assert.deepEqual(buildExportRequest(settings,FORMATS,DESTS),
    {formatId:"jpeg",metadata:{title:"Harbor","strip-location":true},destination:"files",filename:"Poster.jpg",quality:85});
  assert.deepEqual(buildExportRequest({...settings,formatId:"png",filename:"Poster.png"},FORMATS,DESTS),
    {formatId:"png",metadata:{title:"Harbor",author:"Ana"},destination:"files",filename:"Poster.png"});
  assert.throws(()=>buildExportRequest({...settings,destination:"share"},FORMATS,DESTS),/not available/);
  assert.throws(()=>buildExportRequest({...settings,filename:"Poster.png"},FORMATS,DESTS),/End the name with \.jpg/);
  assert.throws(()=>buildExportRequest({...settings,formatId:"tiff"},FORMATS,DESTS),/Unknown export format/);
});

test("summary and status lines read as sentences",()=>{
  const s={formatId:"jpeg",quality:80,metadata:{title:"Harbor","strip-location":true},destination:"files",filename:"Poster.jpg"};
  assert.equal(exportSummary(s,FORMATS[1]),"JPEG, quality 80%, title added, remove location data. Saves “Poster.jpg” to Files.");
  assert.equal(exportSummary({...s,formatId:"png",metadata:{title:"A",author:"B"},destination:"download",filename:"P.png"},FORMATS[0]),
    "PNG, title and author added. Downloads “P.png”.");
  assert.equal(exportSummary({...s,destination:"share"},FORMATS[1]).endsWith("Shares “Poster.jpg”."),true);
  assert.equal(statusText({kind:"working",progress:0.425},"export"),"Exporting… 43%");
  assert.equal(statusText({kind:"working"},"import"),"Importing…");
  assert.equal(statusText({kind:"error",message:"Disk full."},"export"),"Disk full.");
  assert.equal(statusText({kind:"done"},"export","Poster.jpg"),"Exported “Poster.jpg”.");
  assert.equal(statusText({kind:"idle"},"export"),"");
  assert.equal(destinationLabel("files"),"Save to Files");
});

const IMPORTS=[{id:"image",label:"PNG or JPEG image",extensions:["png","jpg","jpeg"],mimeTypes:["image/png","image/jpeg"]},
  {id:"nfd",label:"Forge document",extensions:["nfd"]}];
test("imports match by extension, then MIME type, and refuse the rest by name",()=>{
  assert.equal(importAccept(IMPORTS),".png,.jpg,.jpeg,image/png,image/jpeg,.nfd");
  assert.equal(matchImportFormat("Scan.JPG",undefined,IMPORTS),"image");
  assert.equal(matchImportFormat("board.nfd","application/octet-stream",IMPORTS),"nfd");
  assert.equal(matchImportFormat("clipboard","image/png",IMPORTS),"image");
  assert.equal(matchImportFormat("notes.txt","text/plain",IMPORTS),undefined);
  assert.equal(unsupportedFileMessage("notes.txt",IMPORTS),"“notes.txt” can’t be imported. Choose a PNG or JPEG image or Forge document file.");
});

test("the studio shell sources stay platform-safe and engine-free",()=>{
  for(const file of ["shell/WorkspaceHost.tsx","shell/workspace-model.ts","shell/WorkspacePresetSwitcher.tsx","shell/workspace-preset-model.ts",
    "shell/ContextualToolbar.tsx","shell/contextual-toolbar-model.ts","files/FileImportExportSheet.shared.tsx",
    "files/FileImportExportSheet.web.tsx","files/FileImportExportSheet.native.tsx","files/file-transfer-model.ts"]){
    const text=read(file);
    assert.ok(!/from\s+["'](?:@nitro-forge\/|@acme\/)/.test(text),file);
    assert.ok(!/\buseState\b/.test(text),file+" keeps state in the host or a local store");
  }
  const host=read("shell/WorkspaceHost.tsx");
  assert.ok(host.includes("key={document.id}"),"the canvas is keyed by document id");
  const dock=read("shell/AdaptiveDock.tsx");
  assert.ok(dock.includes("workspaceSlot"),"the dock keeps its workspace in a stable layer");
});
