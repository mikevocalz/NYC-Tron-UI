import {AppRegistry,ScrollView,Text,View} from "react-native";
import {create} from "zustand";
import {PrecisionScrubber} from "../../src/components/forge/inputs/PrecisionScrubber.tsx";
import {DragGrabHandle} from "../../src/components/DragGrabHandle.tsx";
import {Button} from "../../src/components/Button.tsx";
import {LayerStack} from "../../src/components/forge/layers/LayerStack.tsx";
import {moveLayer,removeLayer,type LayerRow} from "../../src/components/forge/layers/layer-model.ts";
import {NativeSeekBar} from "../../src/components/forge/NativeSeekBar.web.tsx";
import {FRAME_RATES} from "../../src/components/forge/timebase.ts";

type Row={id:string;name:string};
type Demo={
  opacity:number;preview:number;commits:number;
  frame:number;seekPreviews:number;seekCommits:number;rows:Row[];dragging:string|undefined;dragY:number;handleCommits:number;handleCancels:number;
};
const useDemo=create<Demo>(()=>({
  opacity:40,preview:40,commits:0,frame:120,seekPreviews:0,seekCommits:0,
  rows:[{id:"a",name:"Background"},{id:"b",name:"Portrait"},{id:"c",name:"Title"}],
  dragging:undefined,dragY:0,handleCommits:0,handleCancels:0,
}));
// Prism-style document: the fills are layer content, not theme colours.
const initialLayers:LayerRow[]=[
  {id:"title",name:"Headline",visible:true,opacity:1,kind:"text"},
  {id:"badge",name:"Badge",visible:true,opacity:0.8,kind:"vector",kindLabel:"Ellipse",
    thumbnail:{fill:"#e0402a",label:"red fill"}},
  {id:"card",name:"Card background",visible:false,opacity:0.6,kind:"vector",kindLabel:"Rectangle",
    thumbnail:{fill:"#f4c430",label:"yellow fill"}},
  {id:"photo",name:"Skyline",visible:true,opacity:1,kind:"raster",kindLabel:"Raster",locked:true,
    thumbnail:{node:<View style={{width:"100%",height:"100%",backgroundColor:"#3a6ea5"}}>
      <View style={{position:"absolute",bottom:0,left:4,width:6,height:14,backgroundColor:"#1d2b3a"}}/>
      <View style={{position:"absolute",bottom:0,left:12,width:8,height:20,backgroundColor:"#1d2b3a"}}/>
    </View>,label:"skyline photo"}},
];
type Removed={row:LayerRow;index:number};
const useLayers=create<{layers:LayerRow[];selected:string|undefined;undo:Removed[]}>(()=>({
  layers:initialLayers,selected:"badge",undo:[],
}));
const patch=(id:string,f:(l:LayerRow)=>LayerRow)=>useLayers.setState(s=>({layers:s.layers.map(l=>l.id===id?f(l):l)}));

function LayerPanel(){
  const layers=useLayers(s=>s.layers);
  const selected=useLayers(s=>s.selected);
  const undo=useLayers(s=>s.undo);
  return <View style={{gap:8}}>
    <LayerStack layers={layers} selectedId={selected}
      onSelect={id=>useLayers.setState({selected:id})}
      onToggleVisible={id=>patch(id,l=>({...l,visible:!l.visible}))}
      onOpacityCommit={(id,opacity)=>patch(id,l=>({...l,opacity}))}
      onMove={(id,to)=>useLayers.setState(s=>({layers:moveLayer(s.layers,id,to)}))}
      onRename={(id,name)=>patch(id,l=>({...l,name}))}
      onRemove={id=>useLayers.setState(s=>({layers:removeLayer(s.layers,id),
        undo:[...s.undo,{row:s.layers.find(l=>l.id===id)!,index:s.layers.findIndex(l=>l.id===id)}],
        selected:s.selected===id?undefined:s.selected}))}/>
    <View style={{flexDirection:"row",alignItems:"center",gap:12}}>
      <Button variant="secondary" size="sm" title="Undo remove" disabled={undo.length===0}
        onPress={()=>useLayers.setState(s=>{
          const last=s.undo.at(-1);
          if(!last)return s;
          const next=[...s.layers];next.splice(last.index,0,last.row);
          return {layers:next,undo:s.undo.slice(0,-1)};
        })}/>
      <Text testID="layers" {...{className:"text-text-muted"}}>{"layers "+layers.map(l=>l.id).join(",")}</Text>
    </View>
  </View>;
}
const forcedColors=typeof matchMedia==="function"&&matchMedia("(forced-colors: active)").matches;
const ROW=56;
// Pointer y at drag start, kept outside React state: it is gesture bookkeeping.
const start:{y:number|undefined}={y:undefined};

function Layers(){
  const rows=useDemo(s=>s.rows);
  const dragging=useDemo(s=>s.dragging);
  return <View {...{className:"rounded-card border border-border bg-surface-raised"}} style={{overflow:"hidden"}}>
    {rows.map((row,i)=><View key={row.id} {...{className:i<rows.length-1?"border-b border-border":undefined}}
      style={{flexDirection:"row",alignItems:"center",minHeight:ROW,paddingHorizontal:8,gap:8,
        opacity:dragging&&dragging!==row.id?0.6:1}}>
      <DragGrabHandle label={"Reorder "+row.name}
        onStart={()=>{start.y=undefined;useDemo.setState({dragging:row.id,dragY:0});}}
        onMove={p=>{if(start.y===undefined)start.y=p.y;useDemo.setState({dragY:p.y-start.y});}}
        onCommit={()=>{
          const s=useDemo.getState();
          const from=s.rows.findIndex(r=>r.id===row.id);
          const to=Math.max(0,Math.min(s.rows.length-1,from+Math.round(s.dragY/ROW)));
          const next=[...s.rows];next.splice(to,0,...next.splice(from,1));
          useDemo.setState({rows:next,dragging:undefined,handleCommits:s.handleCommits+1});
        }}
        onCancel={()=>useDemo.setState(s=>({dragging:undefined,handleCancels:s.handleCancels+1}))}/>
      <Text {...{className:"text-text"}}>{row.name}</Text>
    </View>)}
  </View>;
}

function Seek(){
  const frame=useDemo(s=>s.frame);
  return <NativeSeekBar testID="seek" frame={frame} durationFrames={240} frameRate={FRAME_RATES.FILM_24}
    onPreview={()=>useDemo.setState(s=>({seekPreviews:s.seekPreviews+1}))}
    onCommit={next=>useDemo.setState(s=>({frame:next,seekCommits:s.seekCommits+1}))}/>;
}

function Fixture(){
  const opacity=useDemo(s=>s.opacity);
  const preview=useDemo(s=>s.preview);
  const commits=useDemo(s=>s.commits);
  const rows=useDemo(s=>s.rows);
  const handleCommits=useDemo(s=>s.handleCommits);
  const handleCancels=useDemo(s=>s.handleCancels);
  const frame=useDemo(s=>s.frame);
  const seekPreviews=useDemo(s=>s.seekPreviews);
  const seekCommits=useDemo(s=>s.seekCommits);
  return <ScrollView contentContainerStyle={{padding:16,gap:24,maxWidth:560,width:"100%",alignSelf:"center"}}>
    <View {...{className:"rounded-card border border-border bg-surface-raised"}} style={{padding:16,gap:16}}>
      <PrecisionScrubber label="Layer opacity" value={opacity} min={0} max={100} step={1} unit="%"
        detents={[50]} forcedColors={forcedColors}
        onPreview={value=>useDemo.setState({preview:value})}
        onCommit={value=>useDemo.setState(s=>({opacity:value,preview:value,commits:s.commits+1}))}/>
      <PrecisionScrubber label="Exposure" value={0} min={-2} max={2} step={0.1} unit=" EV"
        disabled forcedColors={forcedColors} onCommit={()=>{}}/>
    </View>
    <Layers/>
    <Seek/>
    <LayerPanel/>
    <View style={{gap:4}}>
      <Text testID="value" {...{className:"text-text-muted"}}>{"value "+opacity}</Text>
      <Text testID="preview" {...{className:"text-text-muted"}}>{"preview "+preview}</Text>
      <Text testID="commits" {...{className:"text-text-muted"}}>{"commits "+commits}</Text>
      <Text testID="order" {...{className:"text-text-muted"}}>{"order "+rows.map(r=>r.id).join("")}</Text>
      <Text testID="frame" {...{className:"text-text-muted"}}>{"frame "+frame}</Text>
      <Text testID="seek-log" {...{className:"text-text-muted"}}>{"seek "+seekPreviews+"/"+seekCommits}</Text>
      <Text testID="handle" {...{className:"text-text-muted"}}>{"handle "+handleCommits+"/"+handleCancels}</Text>
    </View>
  </ScrollView>;
}
const query=new URLSearchParams(location.search);
document.documentElement.dataset.theme=query.get("theme")??"light";
document.documentElement.dir=query.get("dir")==="rtl"?"rtl":"ltr";
// React Native Web resolves start/end styles from a `dir` on an ancestor View,
// the way an RTL app sets it, not from the document's dir attribute.
const dir=document.documentElement.dir as "rtl"|"ltr";
function Root(){return <View {...{dir}} style={{flex:1}}><Fixture/></View>;}
AppRegistry.registerComponent("UiAcceptance",()=>Root);
AppRegistry.runApplication("UiAcceptance",{rootTag:document.getElementById("root")});
