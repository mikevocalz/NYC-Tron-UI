import {AppRegistry,ScrollView,Text,View} from "react-native";
import {create} from "zustand";
import {Select} from "../../src/components/Select.tsx";
import {SegmentedControl} from "../../src/components/SegmentedControl.tsx";
import {TabBar} from "../../src/components/TabBar.tsx";
import {Toolbar} from "../../src/components/Toolbar.tsx";
import {List,ListItem} from "../../src/components/List.tsx";
import {IconButton} from "../../src/components/IconButton.tsx";
import {FieldGroup} from "../../src/components/FieldGroup.tsx";

// Studio primitives in the slots nitro-forge's StudioUIProvider fills:
// a docked panel (TabBar + Toolbar + List), the properties inspector
// (FieldGroup + Select), and the dock-position SegmentedControl.
type Demo={tab:string;dock:string;font:string;row:number;bold:boolean;closes:number};
const useDemo=create<Demo>(()=>({tab:"outline",dock:"left",font:"inter",row:1,bold:false,closes:0}));

// Drawn glyphs stand in for the app's icon system; the controls take any node.
const Bar=({w,h,round,on}:{w:number;h:number;round?:boolean;on?:boolean})=>
  <View {...{className:on?"bg-on-primary":"bg-text-muted"}} style={{width:w,height:h,borderRadius:round?h/2:1}}/>;
const Glyph={
  outline:(on=false)=><View style={{gap:3}}><Bar on={on} w={16} h={2}/><Bar on={on} w={11} h={2}/><Bar on={on} w={14} h={2}/></View>,
  properties:(on=false)=><View style={{gap:4}}><Bar on={on} w={16} h={2}/><Bar on={on} w={16} h={2}/></View>,
  history:(on=false)=><Bar on={on} w={14} h={14} round/>,
  close:()=><View style={{width:14,height:14,alignItems:"center",justifyContent:"center"}}>
    <View {...{className:"bg-text"}} style={{position:"absolute",width:16,height:2,transform:[{rotate:"45deg"}]}}/>
    <View {...{className:"bg-text"}} style={{position:"absolute",width:16,height:2,transform:[{rotate:"-45deg"}]}}/></View>,
  bold:()=><View {...{className:"border-2 border-text"}} style={{width:12,height:14,borderRadius:2}}/>,
};
const ROWS=[["Heading","Quarterly infrastructure review"],["Paragraph","Inspection backlog by borough"],["Table","12 rows, 4 columns"],["Paragraph",""]];

function Fixture(){
  const s=useDemo();
  const tabs=[["outline","Outline"],["properties","Properties"],["history","History"]].map(([key,label])=>({
    key:key!,label:label!,active:s.tab===key,onPress:()=>useDemo.setState({tab:key}),
    icon:({active}:{active:boolean})=>Glyph[key as "outline"](active),
  }));
  return <ScrollView contentContainerStyle={{padding:16,gap:20,maxWidth:720,width:"100%",alignSelf:"center"}}>
    <View {...{className:"rounded-card border border-border bg-surface-raised"}} style={{overflow:"hidden"}}>
      <View style={{padding:4}}><TabBar semantics="tabs" density="compact" aria-label="Left dock panels" tabs={tabs}/></View>
      <Toolbar density="compact" title="Document outline"
        actions={<>
          <IconButton aria-label="Bold" size="sm" variant="ghost" selected={s.bold}
            onPress={()=>useDemo.setState({bold:!s.bold})} icon={Glyph.bold()}/>
          <IconButton aria-label="Hide outline" size="sm" variant="ghost" cornerRadius={4}
            onPress={()=>useDemo.setState({closes:s.closes+1})} icon={Glyph.close()}/>
        </>}/>
      <View style={{padding:12}}>
        <List aria-label="Document blocks">
          {ROWS.map(([label,value],i)=><ListItem key={i} supportingText={value||"Empty paragraph"}
            selected={s.row===i} onPress={()=>useDemo.setState({row:i})}>{label}</ListItem>)}
        </List>
      </View>
    </View>
    <FieldGroup>
      <FieldGroup.Section title="Document details" footer="Applies to every page in this document.">
        <Select label="Body font" value={s.font} onValueChange={font=>useDemo.setState({font})}
          options={[{value:"inter",label:"Inter"},{value:"plex",label:"IBM Plex Sans"},
            {value:"source",label:"Source Serif"},{value:"mono",label:"JetBrains Mono",disabled:true}]}/>
        <Select label="Page size" value="" placeholder="Choose a size" onValueChange={()=>{}}
          hint="Letter is the default for US documents." options={[{value:"letter",label:"Letter"},{value:"a4",label:"A4"}]}/>
        <Select label="Locked template" value="memo" disabled onValueChange={()=>{}} options={[{value:"memo",label:"Memo"}]}/>
      </FieldGroup.Section>
      <FieldGroup.Section title="Panel position">
        <SegmentedControl aria-label="Dock position for Outline" value={s.dock}
          onChange={dock=>useDemo.setState({dock})}
          options={[{value:"left",label:"Left"},{value:"right",label:"Right"},{value:"bottom",label:"Bottom"}]}/>
      </FieldGroup.Section>
    </FieldGroup>
    <View style={{marginHorizontal:-16}}>
      <TabBar semantics="navigation" aria-label="Studios" tabs={[
        {key:"docs",label:"Docs",href:"#docs",active:true,icon:Glyph.outline(true)},
        {key:"sheets",label:"Sheets",href:"#sheets",icon:Glyph.properties()},
        {key:"slides",label:"Slides",href:"#slides",icon:Glyph.history()}]}/>
    </View>
    <View style={{gap:4}}>
      <Text testID="state" {...{className:"text-text-muted"}}>{`tab ${s.tab} dock ${s.dock} font ${s.font} row ${s.row} bold ${s.bold} closes ${s.closes}`}</Text>
    </View>
  </ScrollView>;
}
const q=new URLSearchParams(location.search);
document.documentElement.dataset.theme=q.get("theme")??"light";
document.documentElement.dataset.brand="infrax";
if(q.get("dir")==="rtl")document.documentElement.dir="rtl";
AppRegistry.registerComponent("Primitives",()=>Fixture);
AppRegistry.runApplication("Primitives",{rootTag:document.getElementById("root")});
