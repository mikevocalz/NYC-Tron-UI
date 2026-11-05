import { Pressable, ScrollView, Text, View, useColorScheme, type LayoutRectangle } from "react-native";
import { create } from "zustand";
import { NativeDropdown } from "@nyc-tron/expo-controls/NativeDropdown";
import { NativeActionMenu } from "@nyc-tron/expo-controls/NativeActionMenu";
import { NativePopover } from "@nyc-tron/expo-controls/NativePopover";
import { Tooltip } from "@nyc-tron/expo-controls/Tooltip";

// The app owns its theme. These two token sets stand in for the consuming
// app's Uniwind/Tailwind resources so the demo follows light and dark.
const themes={
  light:{background:"#F6F6FA",surface:"#FFFFFF",text:"#14141C",muted:"#55556A",accent:"#5B4BD6"},
  dark:{background:"#101017",surface:"#1C1C26",text:"#F6F6FD",muted:"#AAAABB",accent:"#B2A7FF"},
} as const;

type DemoState={
  quality:string;lastAction:string;popoverOpen:boolean;anchor:LayoutRectangle|null;
  window:{width:number;height:number};
  setQuality:(value:string)=>void;setAction:(id:string)=>void;
  setPopover:(open:boolean)=>void;setAnchor:(rect:LayoutRectangle)=>void;
  setWindow:(width:number,height:number)=>void;
};
const useDemo=create<DemoState>(set=>({
  quality:"high",lastAction:"none",popoverOpen:false,anchor:null,window:{width:0,height:0},
  setQuality:quality=>set({quality}),setAction:lastAction=>set({lastAction}),
  setPopover:popoverOpen=>set({popoverOpen}),setAnchor:anchor=>set({anchor}),
  setWindow:(width,height)=>set({window:{width,height}}),
}));

const qualities=[{value:"low",label:"Low"},{value:"medium",label:"Medium"},{value:"high",label:"High"}];
const actions=[
  {id:"duplicate",title:"Duplicate"},
  {id:"pin",title:"Pin",checked:false},
  {id:"share",title:"Share",subactions:[{id:"copy-link",title:"Copy link"}]},
  {id:"delete",title:"Delete",destructive:true},
];

/**
 * Compile harness for the native lanes: renders every expo-controls overlay
 * so `expo prebuild` + Gradle/Xcode link the @expo/ui SwiftUI and Compose
 * views they use. It is not a device test.
 */
export default function App(){
  const t=themes[useColorScheme()==="light"?"light":"dark"];
  const quality=useDemo(s=>s.quality),lastAction=useDemo(s=>s.lastAction);
  const popoverOpen=useDemo(s=>s.popoverOpen),anchor=useDemo(s=>s.anchor),win=useDemo(s=>s.window);
  const {setQuality,setAction,setPopover,setAnchor,setWindow}=useDemo.getState();
  const regions=win.width>0?[{x:0,y:0,width:win.width,height:win.height}]:[];
  return <View style={{flex:1,backgroundColor:t.background}}
    onLayout={event=>setWindow(event.nativeEvent.layout.width,event.nativeEvent.layout.height)}>
    <ScrollView contentContainerStyle={{gap:20,paddingHorizontal:20,paddingTop:80,paddingBottom:60}}>
      <Text style={{color:t.text,fontWeight:"800",fontSize:28}}>NYC-Tron overlays</Text>
      <NativeDropdown label="Render quality" value={quality} options={qualities} onValueChange={setQuality}/>
      <NativeActionMenu accessibilityLabel="Layer actions" actions={actions} onAction={setAction}
        trigger={<View style={{minHeight:44,justifyContent:"center",paddingHorizontal:16,
          borderRadius:12,backgroundColor:t.surface}}><Text style={{color:t.text}}>Layer actions</Text></View>}/>
      <Tooltip label="Opens the layer settings popover">
        <Pressable accessibilityRole="button" accessibilityLabel="Layer settings"
          onPress={()=>setPopover(true)}
          style={{minHeight:44,minWidth:44,justifyContent:"center",paddingHorizontal:16,
            borderRadius:12,backgroundColor:t.accent}}>
          <Text style={{color:t.background,fontWeight:"600"}}>Layer settings</Text>
        </Pressable>
      </Tooltip>
      <Text style={{color:t.muted}}>Quality: {quality} | Last action: {lastAction}</Text>
    </ScrollView>
    {/* Anchor in root coordinates: a fixed probe rect the popover attaches to. */}
    <View pointerEvents="none" style={{position:"absolute",left:20,top:40,width:44,height:44}}
      onLayout={event=>setAnchor(event.nativeEvent.layout)}/>
    {anchor&&regions.length?<NativePopover open={popoverOpen} onOpenChange={setPopover}
      anchor={anchor} usableRegions={regions} accessibilityLabel="Layer settings" width={280}>
      <View style={{padding:16,gap:12}}>
        <Text style={{color:t.text,fontWeight:"600"}}>Layer settings</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Done" onPress={()=>setPopover(false)}
          style={{minHeight:44,justifyContent:"center"}}>
          <Text style={{color:t.accent}}>Done</Text>
        </Pressable>
      </View>
    </NativePopover>:null}
  </View>;
}
