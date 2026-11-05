import {AppRegistry,Pressable,Text,View} from "react-native";
import {create} from "zustand";
import {InspectorPanel,type InspectorSelection} from "../../../src/components/shell/InspectorPanel.tsx";
import {InspectorSection} from "../../../src/components/shell/InspectorSection.tsx";
import {PropertyRow} from "../../../src/components/shell/PropertyRow.tsx";
import {UnitInput,type UnitName} from "../../../src/components/shell/UnitInput.tsx";
import {SliderField} from "../../../src/components/shell/SliderField.tsx";
import {RangeSlider,type RangeValue} from "../../../src/components/shell/RangeSlider.tsx";
import {RotaryKnob} from "../../../src/components/shell/RotaryKnob.tsx";

// The properties inspector of an image editor with a layer selected.
// `?select=none|multiple` changes the selection, `?dir=rtl` flips direction.
const params=new URLSearchParams(location.search);
const rtl=params.get("dir")==="rtl";

type Demo={
  query:string;open:Record<string,boolean>;shadow:boolean;
  opacity:number;opacityPreview:number;opacityCommits:number;
  x:number;unit:UnitName;duration:number;
  levels:RangeValue;levelCommits:number;angle:number;angleCommits:number;blur:number;
  fillOverridden:boolean;
};
const useDemo=create<Demo>(()=>({
  query:"",open:{layer:true,transform:true,rotation:true,levels:true,shadow:false,timing:true},shadow:true,
  opacity:86,opacityPreview:86,opacityCommits:0,x:240,unit:"mm",duration:2,
  levels:[12,240],levelCommits:0,angle:-15,angleCommits:0,blur:8,fillOverridden:true,
}));
const selection:InspectorSelection=params.get("select")==="none"?{kind:"none"}
  :params.get("select")==="multiple"?{kind:"multiple",count:3,noun:{one:"layer",other:"layers"}}
  :{kind:"single",title:"Harbor photo",detail:"Pixel layer, 2480 × 3508"};

function Fixture(){
  const s=useDemo();
  const set=useDemo.setState;
  const section=(id:string)=>({expanded:!!s.open[id],onExpandedChange:(v:boolean)=>set({open:{...s.open,[id]:v}})});
  return <View style={{flex:1,direction:rtl?"rtl":"ltr",padding:12,gap:12,alignItems:"center"}} {...{className:"bg-surface-sunken"}}>
    <View {...{className:"rounded-card border border-border"}} style={{width:"100%",maxWidth:420,height:1080,overflow:"hidden"}}>
      <InspectorPanel selection={selection} query={s.query} onQueryChange={query=>set({query})}>
        <InspectorSection title="Layer" {...section("layer")}>
          <PropertyRow label="Opacity" keywords={["alpha","transparency"]}>
            {({disabled,editorLabel})=><SliderField hideLabel label={editorLabel} value={s.opacity} min={0} max={100} step={1} unit="%"
              defaultValue={100} disabled={disabled}
              onPreview={v=>set({opacityPreview:v})}
              onCommit={v=>set({opacity:v,opacityPreview:v,opacityCommits:s.opacityCommits+1})}/>}
          </PropertyRow>
          <PropertyRow label="Blend mode" mixed={selection.kind==="multiple"}>
            <Text {...{className:"text-text text-sm"}}>Multiply</Text>
          </PropertyRow>
          <PropertyRow label="Fill" override={s.fillOverridden?"overridden":"inherited"} onRevert={()=>set({fillOverridden:false})}>
            <Text {...{className:"text-text text-sm"}}>{s.fillOverridden?"72%":"100%"}</Text>
          </PropertyRow>
        </InspectorSection>
        <InspectorSection title="Transform" {...section("transform")}>
          <PropertyRow label="Position X" keywords={["left","offset"]}>
            {({disabled,editorLabel})=><UnitInput label={editorLabel} hideLabel value={s.x} disabled={disabled}
              context={{dimension:"length",unit:s.unit,percentOf:2480}} units={["mm","px","pt","in"]}
              onUnitChange={unit=>set({unit})} onCommit={x=>set({x})}/>}
          </PropertyRow>
          <InspectorSection title="Rotation" {...section("rotation")}>
            <PropertyRow label="Angle" keywords={["rotate","turn"]}>
              {({disabled,editorLabel})=><RotaryKnob hideLabel label={editorLabel} value={s.angle} min={-180} max={180} step={1} unit="°"
                defaultValue={0} disabled={disabled} style={{alignSelf:"flex-start"}}
                onCommit={angle=>set({angle,angleCommits:s.angleCommits+1})}/>}
            </PropertyRow>
          </InspectorSection>
        </InspectorSection>
        <InspectorSection title="Levels" {...section("levels")}>
          <PropertyRow label="Input range" keywords={["black point","white point"]} stackBelow={420}>
            {({disabled})=><RangeSlider hideLabel label="Input range" value={s.levels} min={0} max={255} step={1} minGap={2}
              thumbLabels={["Black point","White point"]} disabled={disabled}
              onCommit={levels=>set({levels,levelCommits:s.levelCommits+1})}/>}
          </PropertyRow>
        </InspectorSection>
        <InspectorSection title="Drop shadow" {...section("shadow")} enabled={s.shadow} onEnabledChange={shadow=>set({shadow})}
          onReset={()=>set({blur:8})} modified={s.blur!==8}>
          <PropertyRow label="Blur" keywords={["softness"]}>
            {({disabled,editorLabel})=><UnitInput label={editorLabel} hideLabel value={s.blur} min={0} max={250} disabled={disabled}
              context={{dimension:"length",unit:"px"}} onCommit={blur=>set({blur})}/>}
          </PropertyRow>
        </InspectorSection>
        <InspectorSection title="Timing" {...section("timing")}>
          <PropertyRow label="Duration" keywords={["length","time"]}>
            {({editorLabel})=><UnitInput label={editorLabel} hideLabel value={s.duration} min={0}
              context={{dimension:"time",unit:"f",frameRate:24,sampleRate:48000}} onCommit={duration=>set({duration})}/>}
          </PropertyRow>
        </InspectorSection>
      </InspectorPanel>
    </View>
    <View style={{gap:4,width:"100%",maxWidth:420}}>
      <Pressable accessibilityRole="button" onPress={()=>set({blur:12})} style={{minHeight:44,justifyContent:"center"}}>
        <Text {...{className:"text-text-muted text-xs"}}>Simulate a blur edit</Text>
      </Pressable>
      <Text testID="opacity" {...{className:"text-text-muted text-xs"}}>{`opacity ${s.opacity} preview ${s.opacityPreview} commits ${s.opacityCommits}`}</Text>
      <Text testID="x" {...{className:"text-text-muted text-xs"}}>{`x ${Math.round(s.x*100)/100} unit ${s.unit}`}</Text>
      <Text testID="levels" {...{className:"text-text-muted text-xs"}}>{`levels ${s.levels.join("-")} commits ${s.levelCommits}`}</Text>
      <Text testID="angle" {...{className:"text-text-muted text-xs"}}>{`angle ${s.angle} commits ${s.angleCommits}`}</Text>
      <Text testID="shadow" {...{className:"text-text-muted text-xs"}}>{`shadow ${s.shadow?"on":"off"} blur ${s.blur}`}</Text>
      <Text testID="duration" {...{className:"text-text-muted text-xs"}}>{`duration ${Math.round(s.duration*1000)/1000}`}</Text>
    </View>
  </View>;
}
document.documentElement.dataset.theme=params.get("theme")??"light";
document.documentElement.dir=rtl?"rtl":"ltr";
AppRegistry.registerComponent("ShellInspector",()=>Fixture);
AppRegistry.runApplication("ShellInspector",{rootTag:document.getElementById("root")});
