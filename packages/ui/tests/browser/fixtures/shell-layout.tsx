import {AppRegistry,Text,View} from "react-native";
import {create} from "zustand";
import {PaneSplitter} from "../../../src/components/shell/PaneSplitter.tsx";
import {AdaptiveDock,type DockLayout} from "../../../src/components/shell/AdaptiveDock.tsx";
import {DocumentTabBar,moveDocument,activeAfterClose,type DocumentTab} from "../../../src/components/shell/DocumentTabBar.tsx";
import {ToolRail,type RailTool} from "../../../src/components/shell/ToolRail.tsx";
import {StatusBar} from "../../../src/components/shell/StatusBar.tsx";

// An image editor shell: document tabs, a tool rail, docked panels around the
// canvas and a status strip. `?hinge=1` adds a simulated book-posture hinge
// to the standalone splitter, `?dir=rtl` flips reading direction.
const params=new URLSearchParams(location.search);
const rtl=params.get("dir")==="rtl";
const hinge=params.get("hinge")==="1";

type Demo={
  docs:DocumentTab[];active:string|undefined;closed:number;
  tool:string;groups:Record<string,string>;
  layout:DockLayout;split:number;splitPreview:number;splitCommits:number;
  zoom:number;units:string;
};
const useDemo=create<Demo>(()=>({
  docs:[{id:"poster",title:"Harbor poster.psd",dirty:true},{id:"logo",title:"Logo mark.svg"},
    {id:"scan",title:"Archive scan 1931.tif"},{id:"grid",title:"Layout grid.png"}],
  active:"poster",closed:0,tool:"move",groups:{},
  layout:{left:{panels:["layers","channels"],active:"layers",size:240},right:{panels:["properties"],active:"properties",size:260},
    bottom:{panels:["history"],active:"history",size:150},floating:[]},
  split:320,splitPreview:320,splitCommits:0,zoom:100,units:"px",
}));

// Drawn glyphs stand in for the app's icon set. Strokes are borders so
// forced-colors mode keeps them.
type Ink=(cls:string)=>React.ReactNode;
const icon=(draw:Ink)=>({active}:{active:boolean})=><>{draw(active?"border-on-primary":"border-text")}</>;
const marquee=(round:boolean):Ink=>c=><View {...{className:c}} style={{width:18,height:14,borderWidth:2,borderStyle:"dashed",borderRadius:round?9:0}}/>;
const TOOLS:RailTool[]=[
  {id:"move",label:"Move",shortcut:"V",icon:icon(c=><View style={{width:18,height:18,alignItems:"center",justifyContent:"center"}}>
    <View {...{className:c}} style={{position:"absolute",width:18,height:0,borderTopWidth:2}}/><View {...{className:c}} style={{position:"absolute",width:0,height:18,borderLeftWidth:2}}/></View>)},
  {id:"select",label:"Selection",icon:icon(marquee(false)),
    variants:[{id:"marquee",label:"Rectangle marquee",shortcut:"M",icon:icon(marquee(false))},
      {id:"lasso",label:"Lasso",shortcut:"L",icon:icon(marquee(true))}]},
  {id:"brush",label:"Brush",shortcut:"B",icon:icon(c=><View {...{className:c}} style={{width:6,height:18,borderRadius:3,borderWidth:3,transform:[{rotate:"35deg"}]}}/>)},
  {id:"text",label:"Type",shortcut:"T",icon:icon(c=><View style={{alignItems:"center"}}><View {...{className:c}} style={{width:16,height:0,borderTopWidth:2}}/><View {...{className:c}} style={{width:0,height:14,borderLeftWidth:2}}/></View>)},
  {id:"crop",label:"Crop",shortcut:"C",disabled:true,icon:icon(c=><View {...{className:c}} style={{width:14,height:14,borderLeftWidth:2,borderBottomWidth:2}}/>)},
];

function Panel({lines}:{lines:string[]}){
  return <View style={{padding:12,gap:8}}>{lines.map((l,i)=><Text key={i} {...{className:"text-text text-sm"}}>{l}</Text>)}</View>;
}
const PANELS=[
  {id:"layers",title:"Layers",content:<Panel lines={["Title type","Harbor photo","Paper texture","Background"]}/>},
  {id:"channels",title:"Channels",content:<Panel lines={["RGB","Red","Green","Blue"]}/>},
  {id:"properties",title:"Properties",content:<Panel lines={["Harbor photo","Width 2480 px","Opacity 86%"]}/>},
  {id:"history",title:"History",content:<Panel lines={["Open","Place Harbor photo","Add text layer"]}/>},
];

function Fixture(){
  const s=useDemo();
  const set=useDemo.setState;
  const ids=s.docs.map(d=>d.id);
  return <View style={{flex:1,minHeight:"100vh" as unknown as number,direction:rtl?"rtl":"ltr"}} {...{className:"bg-surface-sunken"}}>
    <DocumentTabBar documents={s.docs} activeId={s.active}
      onActivate={id=>set({active:id})}
      onClose={id=>set({docs:s.docs.filter(d=>d.id!==id),active:activeAfterClose(ids,id,s.active),closed:s.closed+1})}
      onReorder={(id,to)=>{const order=moveDocument(ids,id,to);set({docs:order.map(o=>s.docs.find(d=>d.id===o)!)});}}/>
    <View style={{flexDirection:"row",height:520}}>
      <ToolRail tools={TOOLS} activeToolId={s.tool} groupSelection={s.groups} edge={rtl?"right":"left"}
        onSelectTool={id=>set({tool:id,groups:id==="marquee"||id==="lasso"?{...s.groups,select:id}:s.groups})}/>
      <AdaptiveDock style={{flex:1}} panels={PANELS} layout={s.layout} onLayoutChange={layout=>set({layout})} isRTL={rtl}>
        <View style={{flex:1,alignItems:"center",justifyContent:"center",padding:16}}>
          <View {...{className:"rounded-card border border-border bg-surface-raised"}} style={{width:"70%",aspectRatio:0.75,maxHeight:"90%"}}/>
        </View>
      </AdaptiveDock>
    </View>
    <StatusBar selection={{count:s.tool==="move"?1:0,noun:{one:"layer",other:"layers"}}}
      activity={{kind:"rendering",progress:0.42,label:"Exporting preview"}}
      units={{value:s.units,options:[{value:"px",label:"Pixels"},{value:"mm",label:"Millimeters"},{value:"pt",label:"Points"}],onChange:units=>set({units})}}
      zoom={{value:s.zoom,onChange:zoom=>set({zoom}),onFit:()=>set({zoom:66.7})}}/>
    <View style={{padding:16,gap:8}}>
      <Text {...{className:"text-text text-sm font-semibold"}}>Split view</Text>
      <View {...{className:"rounded-card border border-border bg-surface-raised"}} style={{height:180,overflow:"hidden"}}>
        <PaneSplitter axis="horizontal" label="Resize reference image" size={s.split} isRTL={rtl}
          minStart={120} minEnd={120}
          {...(hinge?{features:[{bounds:{x:316,y:0,width:24,height:2000},orientation:"vertical" as const,separating:true,occlusion:"full" as const}],
            container:{x:0,y:0,width:1000,height:180}}:{})}
          onPreview={size=>set({splitPreview:size})}
          onCommit={size=>set({split:size,splitPreview:size,splitCommits:s.splitCommits+1})}
          start={<Panel lines={["Reference"]}/>} end={<Panel lines={["Canvas"]}/>}/>
      </View>
      <Text testID="split" {...{className:"text-text-muted text-xs"}}>{`split ${Math.round(s.split)} preview ${Math.round(s.splitPreview)} commits ${s.splitCommits}`}</Text>
      <Text testID="tabs" {...{className:"text-text-muted text-xs"}}>{`tabs ${ids.join(",")} active ${s.active??"none"} closed ${s.closed}`}</Text>
      <Text testID="tool" {...{className:"text-text-muted text-xs"}}>{`tool ${s.tool}`}</Text>
      <Text testID="dock" {...{className:"text-text-muted text-xs"}}>{`dock left ${s.layout.left?.panels.join("+")??"-"} right ${s.layout.right?.panels.join("+")??"-"} floating ${s.layout.floating.map(f=>f.id).join("+")||"-"}`}</Text>
      <Text testID="status" {...{className:"text-text-muted text-xs"}}>{`zoom ${s.zoom} units ${s.units}`}</Text>
    </View>
  </View>;
}
document.documentElement.dataset.theme=params.get("theme")??"light";
document.documentElement.dir=rtl?"rtl":"ltr";
AppRegistry.registerComponent("ShellLayout",()=>Fixture);
AppRegistry.runApplication("ShellLayout",{rootTag:document.getElementById("root")});
