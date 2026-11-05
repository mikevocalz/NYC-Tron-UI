import {AppRegistry,ScrollView,Text,View} from "react-native";
import {create} from "zustand";
import {PrecisionScrubber} from "../../src/components/forge/inputs/PrecisionScrubber.tsx";
import {DragGrabHandle} from "../../src/components/DragGrabHandle.tsx";

type Row={id:string;name:string};
type Demo={
  opacity:number;preview:number;commits:number;
  rows:Row[];dragging:string|undefined;dragY:number;handleCommits:number;handleCancels:number;
};
const useDemo=create<Demo>(()=>({
  opacity:40,preview:40,commits:0,
  rows:[{id:"a",name:"Background"},{id:"b",name:"Portrait"},{id:"c",name:"Title"}],
  dragging:undefined,dragY:0,handleCommits:0,handleCancels:0,
}));
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

function Fixture(){
  const opacity=useDemo(s=>s.opacity);
  const preview=useDemo(s=>s.preview);
  const commits=useDemo(s=>s.commits);
  const rows=useDemo(s=>s.rows);
  const handleCommits=useDemo(s=>s.handleCommits);
  const handleCancels=useDemo(s=>s.handleCancels);
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
    <View style={{gap:4}}>
      <Text testID="value" {...{className:"text-text-muted"}}>{"value "+opacity}</Text>
      <Text testID="preview" {...{className:"text-text-muted"}}>{"preview "+preview}</Text>
      <Text testID="commits" {...{className:"text-text-muted"}}>{"commits "+commits}</Text>
      <Text testID="order" {...{className:"text-text-muted"}}>{"order "+rows.map(r=>r.id).join("")}</Text>
      <Text testID="handle" {...{className:"text-text-muted"}}>{"handle "+handleCommits+"/"+handleCancels}</Text>
    </View>
  </ScrollView>;
}
document.documentElement.dataset.theme=new URLSearchParams(location.search).get("theme")??"light";
AppRegistry.registerComponent("UiAcceptance",()=>Fixture);
AppRegistry.runApplication("UiAcceptance",{rootTag:document.getElementById("root")});
