import { ScrollView, Text, View, useWindowDimensions } from "react-native";
import { create } from "zustand";
import { ArcKnob } from "@nyc-tron/native-controls/ArcKnob";
import { XYPad } from "@nyc-tron/native-controls/XYPad";
import { OverlayControls, OverlayLayer } from "./OverlayDemo";
import { FoldRegionsDemo } from "./FoldRegionsDemo";

type DemoState={gain:number;pan:number;xy:{x:number;y:number};setGain:(v:number)=>void;setPan:(v:number)=>void;setXY:(x:number,y:number)=>void};
const useDemoStore=create<DemoState>(set=>({
 gain:.75,pan:0,xy:{x:.5,y:.5},
 setGain:gain=>set({gain}),setPan:pan=>set({pan}),
 setXY:(x,y)=>set({xy:{x,y}})
}));
export default function App(){
 const gain=useDemoStore(s=>s.gain),pan=useDemoStore(s=>s.pan),xy=useDemoStore(s=>s.xy);
 const setGain=useDemoStore(s=>s.setGain),setPan=useDemoStore(s=>s.setPan),setXY=useDemoStore(s=>s.setXY);
 const {width,height}=useWindowDimensions();
 return <View style={{flex:1,backgroundColor:"#101017"}}>
 <ScrollView style={{flex:1}} contentContainerStyle={{
    minHeight:"100%",gap:20,paddingHorizontal:20,paddingTop:80,paddingBottom:60
 }}>
   <Text style={{color:"#F6F6FD",fontWeight:"800",fontSize:30}}>NYC-Tron Instruments</Text>
   <Text style={{color:"#AAAABB"}}>Real native SwiftUI / Jetpack Compose controls</Text>
   <View style={{flexDirection:"row",flexWrap:"wrap",gap:28}}>
     <ArcKnob label="Gain" value={gain} minimum={0} maximum={1} step={.01}
       accentColor="#B2A7FF" textColor="#FFFFFF" size={150} onCommit={setGain}/>
     <ArcKnob label="Pan" value={pan} minimum={-1} maximum={1} step={.01}
       accentColor="#B2A7FF" textColor="#FFFFFF" size={150} onCommit={setPan}/>
   </View>
   <Text style={{color:"#F6F6FD",fontWeight:"600",fontSize:20}}>XY Pad</Text>
   <XYPad label="Filter X/Y" x={xy.x} y={xy.y} size={220}
     accentColor="#B2A7FF" backgroundColor="#20202C"
     onCommit={p=>setXY(p.x,p.y)}/>
   <Text style={{color:"#AAAABB"}}>Gain: {gain.toFixed(2)} | Pan: {pan.toFixed(2)} | XY: {xy.x.toFixed(2)}, {xy.y.toFixed(2)}</Text>
   <OverlayControls/>
   <FoldRegionsDemo/>
 </ScrollView>
 <OverlayLayer width={width} height={height}/>
 </View>;
}
