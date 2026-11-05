import { Pressable, Text, View, type LayoutRectangle } from "react-native";
import { create } from "zustand";
import { NativeDropdown } from "@nyc-tron/expo-controls/NativeDropdown";
import { NativeActionMenu } from "@nyc-tron/expo-controls/NativeActionMenu";
import { NativePopover } from "@nyc-tron/expo-controls/NativePopover";
import { Tooltip } from "@nyc-tron/expo-controls/Tooltip";

// Same demo palette as App.tsx; the consuming app owns real theme tokens.
const colors={surface:"#20202C",text:"#F6F6FD",muted:"#AAAABB",accent:"#B2A7FF",onAccent:"#101017"};

type OverlayState={
  quality:string;lastAction:string;popoverOpen:boolean;anchor:LayoutRectangle|null;
  font:string;strokeOpen:boolean;
  setQuality:(value:string)=>void;setAction:(id:string)=>void;
  setPopover:(open:boolean)=>void;setAnchor:(rect:LayoutRectangle)=>void;
};
const useOverlays=create<OverlayState>(set=>({
  quality:"high",lastAction:"none",popoverOpen:false,anchor:null,font:"inter",strokeOpen:false,
  setQuality:quality=>set({quality}),setAction:lastAction=>set({lastAction}),
  setPopover:popoverOpen=>set({popoverOpen}),setAnchor:anchor=>set({anchor}),
}));
const qualities=[{value:"low",label:"Low"},{value:"medium",label:"Medium"},{value:"high",label:"High"}];
// Headed groups: SwiftUI Sections on iOS, heading rows between dividers in the Material menu.
const typefaces=[
  {heading:"Sans serif",options:[{value:"inter",label:"Inter"},{value:"plex",label:"IBM Plex Sans"}]},
  {heading:"Serif",options:[{value:"source",label:"Source Serif"}]},
];
const actions=[
  {id:"duplicate",title:"Duplicate"},
  {id:"pin",title:"Pin",checked:false},
  {id:"share",title:"Share",subactions:[{id:"copy-link",title:"Copy link"}]},
  {id:"delete",title:"Delete",destructive:true},
];

/** Controls rendered inside the scrolling content. */
export function OverlayControls(){
  const quality=useOverlays(s=>s.quality),lastAction=useOverlays(s=>s.lastAction);
  const {setQuality,setAction,setPopover}=useOverlays.getState();
  return <View style={{gap:16}}>
    <Text style={{color:colors.text,fontWeight:"600",fontSize:20}}>Overlays</Text>
    <NativeDropdown label="Render quality" value={quality} options={qualities} onValueChange={setQuality}/>
    <NativeDropdown label="Typeface" value={useOverlays(s=>s.font)} groups={typefaces}
      onValueChange={font=>useOverlays.setState({font})}/>
    {/* Trigger form: the popover measures this button and anchors to it. */}
    <NativePopover open={useOverlays(s=>s.strokeOpen)} onOpenChange={strokeOpen=>useOverlays.setState({strokeOpen})}
      accessibilityLabel="Stroke width" width={240}
      trigger={({toggle,triggerProps})=><Pressable {...triggerProps} accessibilityRole="button"
        accessibilityLabel="Stroke width" onPress={toggle}
        style={{minHeight:44,justifyContent:"center",paddingHorizontal:16,borderRadius:12,backgroundColor:colors.surface}}>
        <Text style={{color:colors.text}}>Stroke width</Text>
      </Pressable>}>
      <View style={{padding:16}}><Text style={{color:colors.text}}>2 pt</Text></View>
    </NativePopover>
    <NativeActionMenu accessibilityLabel="Layer actions" actions={actions} onAction={setAction}
      trigger={<View style={{minHeight:44,justifyContent:"center",paddingHorizontal:16,
        borderRadius:12,backgroundColor:colors.surface}}><Text style={{color:colors.text}}>Layer actions</Text></View>}/>
    <Tooltip label="Opens the layer settings popover">
      <Pressable accessibilityRole="button" accessibilityLabel="Layer settings" onPress={()=>setPopover(true)}
        style={{minHeight:44,minWidth:44,justifyContent:"center",paddingHorizontal:16,
          borderRadius:12,backgroundColor:colors.accent}}>
        <Text style={{color:colors.onAccent,fontWeight:"600"}}>Layer settings</Text>
      </Pressable>
    </Tooltip>
    <Text style={{color:colors.muted}}>Quality: {quality} | Last action: {lastAction}</Text>
  </View>;
}

/**
 * Popover layer for the screen root, so `anchor` and `usableRegions` share
 * the root's coordinate space. The anchor probe is a fixed rect near the top.
 */
export function OverlayLayer({width,height}:{width:number;height:number}){
  const open=useOverlays(s=>s.popoverOpen),anchor=useOverlays(s=>s.anchor);
  const {setPopover,setAnchor}=useOverlays.getState();
  return <>
    <View pointerEvents="none" style={{position:"absolute",left:20,top:40,width:44,height:44}}
      onLayout={event=>setAnchor(event.nativeEvent.layout)}/>
    {anchor&&width>0&&height>0?<NativePopover open={open} onOpenChange={setPopover}
      anchor={anchor} usableRegions={[{x:0,y:0,width,height}]}
      accessibilityLabel="Layer settings" width={280}>
      <View style={{padding:16,gap:12}}>
        <Text style={{color:colors.text,fontWeight:"600"}}>Layer settings</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Done" onPress={()=>setPopover(false)}
          style={{minHeight:44,justifyContent:"center"}}>
          <Text style={{color:colors.accent}}>Done</Text>
        </Pressable>
      </View>
    </NativePopover>:null}
  </>;
}
