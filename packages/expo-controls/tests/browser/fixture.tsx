import { AppRegistry, Pressable, Text, View } from "react-native";
import { create } from "zustand";
import { NativeActionMenu } from "../../src/components/NativeActionMenu.web.tsx";
import { NativePopover } from "../../src/components/NativePopover.web.tsx";
import { Tooltip } from "../../src/components/Tooltip.web.tsx";
import { CommandPopover } from "@nyc-tron/ui/components/overlays/CommandPopover";
import { CommandPalette } from "@nyc-tron/ui/components/overlays/CommandPalette";

type Overlay="none"|"popover"|"commands"|"palette";
const useFixture = create<{
  selected:string;count:number;overlay:Overlay;
  select:(id:string)=>void;show:(overlay:Overlay)=>void;
}>(set=>({
  selected:"none",count:0,overlay:"none",
  select:selected=>set(state=>({selected,count:state.count+1})),
  show:overlay=>set({overlay}),
}));
const actions=[
  {id:"edit",title:"Edit"},
  {id:"delete",title:"Delete",disabled:true},
  {id:"group",title:"Unavailable group",disabled:true,subactions:[{id:"blocked",title:"Blocked child"}]},
  {id:"shareGroup",title:"Sharing",subactions:[{id:"share",title:"Share"}]},
  {id:"pin",title:"Pin",checked:false}
];
const commandItems=[
  {id:"cut",label:"Cut"},
  {id:"copy",label:"Copy",disabled:true},
  {id:"paste",label:"Paste"},
];
const paletteCommands=[
  {id:"file.open",label:"Open file",group:"File",keywords:["load"]},
  {id:"file.save",label:"Save",group:"File",keywords:["write"]},
  {id:"edit.delete",label:"Delete selection",group:"Edit",disabled:true},
  {id:"view.reopen",label:"Reopen closed tab",group:"View"},
];
const anchor={x:24,y:160,width:160,height:44};
const regions=()=>[{x:0,y:0,width:window.innerWidth,height:window.innerHeight}];

function Button({label,onPress}:{label:string;onPress:()=>void}){
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
    style={{minHeight:44,minWidth:44,justifyContent:"center",paddingHorizontal:12}}>
    <Text>{label}</Text>
  </Pressable>;
}

function Fixture(){
  const selected=useFixture(state=>state.selected);
  const select=useFixture(state=>state.select);
  const count=useFixture(state=>state.count);
  const overlay=useFixture(state=>state.overlay);
  const show=useFixture(state=>state.show);
  const close=()=>show("none");
  return <View style={{padding:24,gap:8}}>
    <NativeActionMenu accessibilityLabel="Document actions" actions={actions}
      longPress onAction={select} trigger={<Text>Document actions</Text>}/>
    <View style={{flexDirection:"row",gap:8}}>
      <Button label="Open popover" onPress={()=>show("popover")}/>
      <Button label="Open commands" onPress={()=>show("commands")}/>
      <Button label="Open palette" onPress={()=>show("palette")}/>
      <Tooltip label="Writes the document to disk" delayMs={150} testID="save-tooltip">
        <Pressable accessibilityRole="button" accessibilityLabel="Save" onPress={()=>select("save")}
          style={{minHeight:44,minWidth:44,justifyContent:"center",paddingHorizontal:12}}>
          <Text>Save</Text>
        </Pressable>
      </Tooltip>
    </View>
    <Text testID="selection">{selected}</Text>
    <Text testID="action-count">{count}</Text>
    <NativePopover open={overlay==="popover"} onOpenChange={next=>{if(!next)close();}}
      anchor={anchor} usableRegions={regions()} accessibilityLabel="Layer settings" testID="popover">
      <View style={{padding:12,gap:8}}>
        <Text>Layer settings</Text>
        <Button label="Popover first" onPress={()=>select("first")}/>
        <Button label="Popover second" onPress={()=>select("second")}/>
        <Button label="Done" onPress={close}/>
      </View>
    </NativePopover>
    <CommandPopover visible={overlay==="commands"} onDismiss={close} onSelect={select}
      anchor={anchor} usableRegions={regions()} items={commandItems} accessibilityLabel="Clipboard"/>
    <CommandPalette open={overlay==="palette"} onOpenChange={next=>{if(!next)close();}}
      onSelect={select} commands={paletteCommands} anchor={anchor} usableRegions={regions()}
      testID="palette"/>
  </View>;
}
AppRegistry.registerComponent("MenuAcceptance",()=>Fixture);
AppRegistry.runApplication("MenuAcceptance",{rootTag:document.getElementById("root")});
