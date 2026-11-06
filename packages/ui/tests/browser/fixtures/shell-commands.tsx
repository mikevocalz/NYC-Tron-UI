import {useMemo} from "react";
import {AppRegistry,Pressable,ScrollView,Text,TextInput,View} from "react-native";
import {create} from "zustand";
import {RibbonTabs,type RibbonTab} from "../../../src/components/shell/RibbonTabs.tsx";
import {SplitButton} from "../../../src/components/shell/SplitButton.tsx";
import {ContextMenu} from "../../../src/components/shell/ContextMenu.tsx";
import {PresetGallery,type Preset,type PresetFilter} from "../../../src/components/shell/PresetGallery.tsx";
import {KeyboardShortcutHUD,type ShortcutCommand} from "../../../src/components/shell/KeyboardShortcutHUD.tsx";
import {FocusAndA11yLayer,useA11yPreferences,useAnnounce} from "../../../src/components/shell/FocusAndA11yLayer.tsx";
import {createKeyboardMap} from "../../../src/components/shell/keyboard-map.ts";
// The web entry of @nyc-tron/hardware-keys: document keydown through the keyboard map.
import {useHardwareKeyboard} from "../../../../hardware-keys/src/platform.web.ts";

// A document editor's command surfaces: ribbon, export split button, layer
// context menu, color-grade presets and the shortcut sheet. `?dir=rtl`
// flips direction; `?apple=1` shows Apple keycaps.
const params=new URLSearchParams(location.search);
const rtl=params.get("dir")==="rtl";
const apple=params.get("apple")==="1";

type Demo={
  tab:string;collapsed:boolean;bold:boolean;style:string;last:string;
  preset:string;preview:string;favorites:Record<string,boolean>;filter:PresetFilter;
  hud:boolean;bindings:Record<string,string|undefined>;layerName:string;
};
const DEFAULTS:Record<string,string>={save:"Mod+S",export:"Mod+Shift+E",bold:"Mod+B",palette:"Mod+K",zoomIn:"Mod+=",brush:"Alt+B",hand:"H"};
const useDemo=create<Demo>(()=>({
  tab:"home",collapsed:false,bold:false,style:"body",last:"none",
  preset:"warm",preview:"none",favorites:{warm:true},filter:"all",hud:params.get("hud")==="1",bindings:{...DEFAULTS},layerName:"Harbor photo",
}));

const swatch=(cls:string)=><View {...{className:cls}} style={{flex:1}}/>;
const typePreview=(size:number,weight:"400"|"700")=><Text {...{className:"text-text"}} style={{fontSize:size,fontWeight:weight}}>Aa</Text>;

function Fixture(){
  const s=useDemo();
  const set=useDemo.setState;
  const prefs=useA11yPreferences();
  const announce=useAnnounce();
  const tabs:RibbonTab[]=[
    {id:"home",label:"Home",groups:[
      {id:"clipboard",label:"Clipboard",commands:[{kind:"button",id:"paste",label:"Paste"},{kind:"button",id:"copy",label:"Copy"}]},
      {id:"font",label:"Font",commands:[{kind:"button",id:"bold",label:"Bold",pressed:s.bold}]},
      {id:"styles",label:"Styles",commands:[{kind:"gallery",id:"style",label:"Text styles",selectedId:s.style,inline:3,items:[
        {id:"body",label:"Body",preview:typePreview(12,"400")},{id:"title",label:"Title",preview:typePreview(18,"700")},
        {id:"heading",label:"Heading",preview:typePreview(15,"700")},{id:"quote",label:"Quote",preview:typePreview(13,"400")},
        {id:"caption",label:"Caption",preview:typePreview(10,"400")}]}]},
    ]},
    {id:"insert",label:"Insert",groups:[{id:"media",label:"Media",commands:[
      {kind:"split",id:"image",label:"Image",items:[{id:"file",label:"From file"},{id:"camera",label:"From camera"}]}]}]},
    {id:"picture",label:"Format",contextualGroup:"Picture",groups:[{id:"adjust",label:"Adjust",commands:[
      {kind:"button",id:"crop",label:"Crop"},{kind:"button",id:"remove-bg",label:"Remove background",disabled:true}]}]},
  ];
  const presets:Preset[]=[
    {id:"warm",name:"Warm film",preview:swatch("bg-danger/40")},
    {id:"cool",name:"Cool dusk",preview:swatch("bg-primary/40")},
    {id:"mono",name:"Silver mono",preview:swatch("bg-border")},
    {id:"teal",name:"Harbor teal",preview:swatch("bg-accent/50")},
    {id:"fade",name:"Faded print",preview:swatch("bg-text-muted/30")},
  ].map(p=>({...p,favorite:!!s.favorites[p.id]}));
  const commands:ShortcutCommand[]=[
    {id:"save",label:"Save",group:"File"},{id:"export",label:"Export",group:"File"},
    {id:"bold",label:"Bold",group:"Format",keywords:["strong"]},{id:"palette",label:"Command palette",group:"Navigation"},
    {id:"zoomIn",label:"Zoom in",group:"View"},{id:"hand",label:"Hand tool",group:"Tools"},
    {id:"brush",label:"Brush tool",group:"Tools"},
  ].map(c=>({...c,binding:s.bindings[c.id],defaultBinding:DEFAULTS[c.id]}));
  // One map feeds the sheet and the dispatcher; the sheet owns the keyboard while it is open.
  const map=useMemo(()=>createKeyboardMap(commands,apple),[s.bindings]);
  useHardwareKeyboard({map,enabled:!s.hud,onCommand:entry=>{
    if(entry.id==="bold")set(st=>({bold:!st.bold}));
    set({last:"key:"+entry.id});
  }});
  return <ScrollView style={{flex:1,direction:rtl?"rtl":"ltr"}} {...{className:"bg-surface-sunken"}} contentContainerStyle={{gap:16,paddingBottom:24}}>
    <RibbonTabs tabs={tabs} activeTabId={s.tab} onTabChange={tab=>set({tab})}
      collapsed={s.collapsed} onCollapsedChange={collapsed=>set({collapsed})}
      onCommand={(id,item)=>{
        if(id==="bold")set({bold:!s.bold});
        if(id==="style"&&item)set({style:item});
        set({last:item?`${id}:${item}`:id});
      }}/>
    <View style={{paddingHorizontal:16,gap:16,maxWidth:720,width:"100%",alignSelf:"center"}}>
      <View style={{flexDirection:"row",gap:12,flexWrap:"wrap",alignItems:"center"}}>
        <SplitButton variant="primary" label="Export" onPress={()=>{set({last:"export"});announce("Exported Harbor poster.png");}}
          items={[{id:"png",label:"Export as PNG"},{id:"pdf",label:"Export as PDF"},{id:"svg",label:"Export as SVG",disabled:true}]}
          onSelect={id=>set({last:"export:"+id})}/>
        <SplitButton label="Share" onPress={()=>set({last:"share"})}
          items={[{id:"link",label:"Copy link"},{id:"invite",label:"Invite people"}]} onSelect={id=>set({last:"share:"+id})}/>
        <Pressable accessibilityRole="button" accessibilityLabel="Keyboard shortcuts" onPress={()=>set({hud:true})}
          {...{className:"min-h-11 justify-center rounded-control border border-border bg-surface-raised px-3 focus-visible:ring-2 focus-visible:ring-focus"}}>
          <Text {...{className:"text-text text-sm"}}>Keyboard shortcuts</Text>
        </Pressable>
      </View>
      <ContextMenu label="Harbor photo layer" accessibilityRole="button" accessibilityLabel="Harbor photo layer"
        items={[{id:"duplicate",label:"Duplicate layer"},{id:"rename",label:"Rename"},{id:"delete",label:"Delete layer",danger:true}]}
        onSelect={id=>set({last:"layer:"+id})} onPress={()=>set({last:"layer:select"})}
        {...{className:"min-h-11 justify-center rounded-card border border-border bg-surface-raised p-4 focus-visible:ring-2 focus-visible:ring-focus"}}>
        <Text {...{className:"text-text text-sm font-semibold"}}>Harbor photo</Text>
        <Text {...{className:"text-text-muted text-xs"}}>Right-click, long press or Shift+F10 for layer actions</Text>
      </ContextMenu>
      <View {...{className:"rounded-card border border-border bg-surface-raised"}} style={{padding:12,gap:8}}>
        <Text accessibilityRole="header" {...{className:"text-text text-sm font-semibold"}}>Color grade</Text>
        <PresetGallery label="Color grade presets" presets={presets} selectedId={s.preset} filter={s.filter}
          onFilterChange={filter=>set({filter})} onSelect={preset=>set({preset})} onPreview={id=>set({preview:id??"none"})}
          onFavoriteChange={(id,fav)=>set({favorites:{...s.favorites,[id]:fav}})}/>
      </View>
      <View style={{gap:4}}>
        <Text nativeID="layer-name-label" {...{className:"text-text text-sm"}}>Layer name</Text>
        <TextInput value={s.layerName} onChangeText={layerName=>set({layerName})} accessibilityLabel="Layer name"
          {...{className:"min-h-11 rounded-control border border-border bg-surface-raised px-3 text-text text-sm focus-visible:ring-2 focus-visible:ring-focus"}}/>
        <Text testID="last" {...{className:"text-text-muted text-xs"}}>{`last ${s.last}`}</Text>
        <Text testID="preset" {...{className:"text-text-muted text-xs"}}>{`preset ${s.preset} preview ${s.preview} favorites ${Object.keys(s.favorites).filter(k=>s.favorites[k]).join("+")||"-"}`}</Text>
        <Text testID="bindings" {...{className:"text-text-muted text-xs"}}>{`bindings ${commands.map(c=>c.id+"="+(c.binding??"-")).join(" ")}`}</Text>
        <Text testID="prefs" {...{className:"text-text-muted text-xs"}}>{`motion ${prefs.reduceMotion?"reduced":"full"} contrast ${prefs.highContrast?"high":"normal"} input ${prefs.inputModality}`}</Text>
      </View>
    </View>
    <KeyboardShortcutHUD visible={s.hud} onDismiss={()=>set({hud:false})} commands={commands} apple={apple}
      onRebind={(id,binding)=>set(st=>({bindings:{...st.bindings,[id]:binding}}))}/>
  </ScrollView>;
}
document.documentElement.dataset.theme=params.get("theme")??"light";
document.documentElement.dir=rtl?"rtl":"ltr";
AppRegistry.registerComponent("ShellCommands",()=>()=><FocusAndA11yLayer><Fixture/></FocusAndA11yLayer>);
AppRegistry.runApplication("ShellCommands",{rootTag:document.getElementById("root")});
