import {AppRegistry,ScrollView,Text,View} from "react-native";
import {create} from "zustand";
import {TabBar} from "../../../src/components/TabBar.tsx";
import {Select} from "../../../src/components/Select.tsx";

// Nitro Forge Design Studio gaps: TabBar in narrow panes and Select groups
// (?w=320|360|390 sets the select panel width). The LayerStack panel half of
// this page moved with the editor controls to Nitro Forge's
// packages/editor-controls/tests/browser lane.
type Demo={tab:string;tab3:string;font:string};
const useDemo=create<Demo>(()=>({tab:"document",tab3:"layers",font:"inter"}));

const q=new URLSearchParams(location.search);
const width=Number(q.get("w")??390);

// Stands in for a 17pt app icon such as ForgeIcon.
const Glyph=()=><View {...{className:"border-2 border-text-muted"}} style={{width:17,height:17,borderRadius:3}}/>;

function Panel({title,width:w,children,testID,clip=true}:{title:string;width:number;children:React.ReactNode;testID?:string;clip?:boolean}){
  return <View testID={testID} {...{className:"rounded-card border border-border bg-surface-raised"}}
    style={{width:w,overflow:clip?"hidden":"visible",zIndex:clip?0:1}}>
    <Text {...{className:"text-text-muted text-xs"}} style={{paddingHorizontal:12,paddingVertical:8}}>{title}</Text>
    {children}
  </View>;
}

function Fixture(){
  const s=useDemo();
  return <ScrollView contentContainerStyle={{padding:16,gap:20,alignItems:"flex-start"}}>
    <Panel title="One tab with icon, 200 wide" width={200} testID="tabs-one">
      {/* Forge's dock header: the TabBar in a flex:1 cell beside a close button. */}
      <View style={{flexDirection:"row",alignItems:"center",padding:5}}>
        <View style={{flex:1,minWidth:0}}>
          <TabBar semantics="tabs" density="compact" aria-label="Single panel"
            tabs={[{key:"document",label:"Document",active:true,onPress:()=>{},icon:<Glyph/>}]}/>
        </View>
        <View {...{className:"bg-text-muted"}} style={{width:44,height:44,borderRadius:4,opacity:0.3}}/>
      </View>
    </Panel>
    <Panel title="Header row: tabs beside an action, 200 wide" width={200} testID="tabs-row">
      <View style={{flexDirection:"row",alignItems:"center",padding:5,gap:4}}>
        <TabBar semantics="tabs" density="compact" aria-label="Row panels"
          tabs={[{key:"document",label:"Document",active:true,onPress:()=>{},icon:<Glyph/>}]}/>
        <View testID="row-action" {...{className:"bg-text-muted"}} style={{width:44,height:44,borderRadius:4,opacity:0.3}}/>
      </View>
    </Panel>
    <Panel title="Header row: two tabs beside a title, 260 wide" width={260} testID="tabs-title">
      <View style={{flexDirection:"row",alignItems:"center",padding:5,gap:4}}>
        <Text numberOfLines={1} {...{className:"text-text font-semibold"}} style={{flex:1,minWidth:0}}>Inspector</Text>
        <TabBar semantics="tabs" density="compact" aria-label="Title panels"
          tabs={[{key:"document",label:"Document",active:true,onPress:()=>{}},{key:"layer",label:"Layer",onPress:()=>{}}]}/>
      </View>
    </Panel>
    <Panel title="Three tabs, 320 wide" width={320} testID="tabs-three">
      <View style={{padding:4}}>
        <TabBar semantics="tabs" density="compact" aria-label="Inspector panels"
          tabs={[["layers","Layers"],["document","Document"],["history","History"]].map(([key,label])=>({
            key:key!,label:label!,active:s.tab3===key,onPress:()=>useDemo.setState({tab3:key}),icon:<Glyph/>}))}/>
      </View>
    </Panel>
    <Panel title="Four long tabs, 240 wide" width={240} testID="tabs-tight">
      <View style={{padding:4}}>
        <TabBar semantics="tabs" density="compact" aria-label="Crowded panels"
          tabs={[["a","Properties"],["b","Appearance"],["c","Accessibility"],["d","Animation"]].map(([key,label],i)=>({
            key:key!,label:label!,active:i===0,onPress:()=>{}}))}/>
      </View>
    </Panel>
    <Panel title="Grouped select" width={Math.min(width,360)} testID="select-groups" clip={false}>
      <View style={{padding:12}}>
        <Select label="Typeface" value={s.font} onValueChange={font=>useDemo.setState({font})}
          groups={[{heading:"Sans serif",options:[{value:"inter",label:"Inter"},{value:"plex",label:"IBM Plex Sans"}]},
            {heading:"Serif",options:[{value:"source",label:"Source Serif"},{value:"lora",label:"Lora",disabled:true}]},
            {heading:"Monospace",options:[{value:"mono",label:"JetBrains Mono"}]}]}/>
      </View>
    </Panel>
    <Text testID="state" {...{className:"text-text-muted"}}>
      {"font "+s.font}
    </Text>
  </ScrollView>;
}
document.documentElement.dataset.theme=q.get("theme")??"light";
const dir=q.get("dir")==="rtl"?"rtl":"ltr";
document.documentElement.dir=dir;
function Root(){return <View {...{dir}} style={{flex:1}}><Fixture/></View>;}
AppRegistry.registerComponent("StudioGaps",()=>Root);
AppRegistry.runApplication("StudioGaps",{rootTag:document.getElementById("root")});
