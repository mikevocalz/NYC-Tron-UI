import { ScrollView, Text, View, useWindowDimensions } from "react-native";
import { create } from "zustand";
import { ArcKnob } from "@nyc-tron/native-controls/ArcKnob";
import { XYPad } from "@nyc-tron/native-controls/XYPad";
import { OverlayControls, OverlayLayer } from "./OverlayDemo";
import { NativeChart } from "@nyc-tron/native-charts/NativeChart";
import { chartColorsFromTheme } from "@nyc-tron/native-charts/types";
import type { NativeChartSeries } from "@nyc-tron/native-charts/types";

// Semantic tokens for this demo's dark surface; real apps pass theme.colors.
const chartColors=chartColorsFromTheme({
 primary:"#B2A7FF",accent:"#5EEAD4",focus:"#FDE68A",
 text:"#F6F6FD",textMuted:"#AAAABB",border:"#33334A"
});
const levelSeries:readonly NativeChartSeries[]=[
 {id:"input",label:"Input",points:[{x:0,y:-18},{x:1,y:-12},{x:2,y:-9},{x:3,y:-14},{x:4,y:-6},{x:5,y:-8}]},
 {id:"output",label:"Output",points:[{x:0,y:-20},{x:1,y:-15},{x:2,y:-12},{x:3,y:-16},{x:4,y:-10},{x:5,y:-11}]}
];

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
   <Text style={{color:"#F6F6FD",fontWeight:"600",fontSize:20}}>Levels</Text>
   <NativeChart kind="line" series={levelSeries} colors={chartColors}
     xAxisLabel="Bar" yAxisLabel="dBFS" height={220}/>
   <Text style={{color:"#AAAABB"}}>Gain: {gain.toFixed(2)} | Pan: {pan.toFixed(2)} | XY: {xy.x.toFixed(2)}, {xy.y.toFixed(2)}</Text>
   <OverlayControls/>
 </ScrollView>
 <OverlayLayer width={width} height={height}/>
 </View>;
}
