import { AppRegistry, Text, View } from "react-native";
import { create } from "zustand";
import { NativeActionMenu } from "../../src/components/NativeActionMenu.web.tsx";

const useSelection = create<{selected:string;count:number;select:(id:string)=>void}>(set=>({
  selected:"none",count:0, select:selected=>set(state=>({selected,count:state.count+1}))
}));
const actions=[
  {id:"edit",title:"Edit"},
  {id:"delete",title:"Delete",disabled:true},
  {id:"group",title:"Unavailable group",disabled:true,subactions:[{id:"blocked",title:"Blocked child"}]},
  {id:"shareGroup",title:"Sharing",subactions:[{id:"share",title:"Share"}]},
  {id:"pin",title:"Pin",checked:false}
];
function Fixture(){
  const selected=useSelection(state=>state.selected);
  const select=useSelection(state=>state.select);
  const count=useSelection(state=>state.count);
  return <View style={{padding:24}}>
    <NativeActionMenu accessibilityLabel="Document actions" actions={actions}
      longPress onAction={select} trigger={<Text>Document actions</Text>}/>
    <Text testID="selection">{selected}</Text>
    <Text testID="action-count">{count}</Text>
  </View>;
}
AppRegistry.registerComponent("MenuAcceptance",()=>Fixture);
AppRegistry.runApplication("MenuAcceptance",{rootTag:document.getElementById("root")});
