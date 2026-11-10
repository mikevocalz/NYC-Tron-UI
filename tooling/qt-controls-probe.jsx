// Real installed-package input fixture for tests/qt-controls-consumer in RN-QNX.
// The native runner sends QMouse/QKey events; calls below only mount stages or
// change controlled props. No component callback is invoked by the driver.
import React from "react";
import {AppRegistry,Pressable,Text,View,useWindowDimensions} from "react-native";
import {createStore} from "zustand/vanilla";
import {useStore} from "zustand";
import {NativeDropdown} from "@nyc-tron/expo-controls/NativeDropdown";
import {Select} from "@nyc-tron/expo-controls/Select";
import {NativeActionMenu} from "@nyc-tron/expo-controls/NativeActionMenu";
import {NativePopover} from "@nyc-tron/expo-controls/NativePopover";
import {NativeSliderField} from "@nyc-tron/expo-controls/NativeSliderField";
import {NativeSplitButton} from "@nyc-tron/expo-controls/NativeSplitButton";
import {ContextMenu} from "@nyc-tron/expo-controls/ContextMenu";
import {FindReplacePopover} from "@nyc-tron/expo-controls/FindReplacePopover";
import {Tooltip} from "@nyc-tron/expo-controls/Tooltip";
import {findLiteralText,replaceLiteralText} from "@nyc-tron/ui/components/shell/find-replace-model";

const state=createStore(()=>({stage:"tooltip",selection:"a",dropdown:"a",slider:25,
  actions:0,primary:0,split:0,context:0,popover:true,find:true,tooltipPresses:0,
  document:{id:"qt-probe-document",revision:"1",text:"Alpha document"},findCalls:0}));
const choices=[{value:"a",label:"Alpha"},{value:"locked",label:"Locked",disabled:true},{value:"b",label:"Beta"}];
const actions=[{id:"save",title:"Save"},{id:"locked",title:"Locked",disabled:true}];
const change=patch=>state.setState(patch);
const inc=key=>change({[key]:state.getState()[key]+1});
const steps=[],checks=[],calls=[];
const add=(step,check=()=>true,call)=>{steps.push(step);checks.push(check);calls.push(call);};
const mount=(stage,visible)=>add({action:"call",label:"Mount "+stage,visible},()=>state.getState().stage===stage,()=>change({stage}));

add({action:"assert",label:"Fixture mounted",visible:"qt-root"});
add({action:"hover",target:"qt-tooltip-anchor",label:"Tooltip opens from native hover",visible:"qt-tooltip-body"});
add({action:"key",target:"qt-tooltip-anchor",key:"Escape",label:"Escape dismisses hover tooltip",hidden:"qt-tooltip-body"});
add({action:"leave",target:"qt-tooltip-anchor",label:"Pointer leaves tooltip",hidden:"qt-tooltip-body"});
add({action:"focus",target:"qt-focus-reset",label:"Focus leaves tooltip"});
add({action:"focus",target:"qt-tooltip-anchor",label:"Tooltip opens from native focus",visible:"qt-tooltip-body"});
add({action:"key",key:"Escape",label:"Escape dismisses focused tooltip",hidden:"qt-tooltip-body"});

mount("select","qt-select");
add({action:"key",target:"qt-select",key:"ArrowDown",label:"Select opens from arrow key",visible:"qt-select-list"});
add({action:"key",target:"qt-select",key:"ArrowDown",label:"Select skips disabled option"});
add({action:"key",target:"qt-select",key:"Enter",label:"Select commits enabled choice",hidden:"qt-select-list"},()=>state.getState().selection==="b");
add({action:"key",target:"qt-select",key:"ArrowDown",label:"Select reopens",visible:"qt-select-list"});
add({action:"key",target:"qt-select",key:"Escape",label:"Select cancels with Escape",hidden:"qt-select-list"},()=>state.getState().selection==="b");

mount("dropdown","qt-dropdown");
add({action:"click",target:"qt-dropdown",label:"Dropdown opens by pointer",visible:"qt-dropdown-list"});
add({action:"key",target:"qt-dropdown",key:"End",label:"Dropdown moves to final choice"});
add({action:"key",target:"qt-dropdown",key:"Enter",label:"Dropdown commits final choice",hidden:"qt-dropdown-list"},()=>state.getState().dropdown==="b");

mount("actions","qt-actions-trigger");
add({action:"click",target:"qt-actions-trigger",label:"Action menu opens",visible:"qt-actions-surface"});
add({action:"key",key:"Enter",label:"Action menu selects once",hidden:"qt-actions-surface"},()=>state.getState().actions===1);

mount("slider","qt-slider-track");
add({action:"key",target:"qt-slider-track",key:"Home",label:"Slider Home commits lower bound"},()=>state.getState().slider===0);
add({action:"key",target:"qt-slider-track",key:"ArrowRight",label:"Slider arrow commits one step"},()=>state.getState().slider===1);
add({action:"key",target:"qt-slider-track",key:"End",label:"Slider End commits upper bound"},()=>state.getState().slider===100);

mount("split","qt-split-primary");
add({action:"click",target:"qt-split-primary",label:"Split primary action remains separate"},()=>state.getState().primary===1&&state.getState().split===0);
add({action:"key",target:"qt-split-menu",key:"ArrowDown",label:"Split menu opens by keyboard",visible:"qt-split-menu-popover"});
add({action:"key",key:"Enter",label:"Split menu selects once",hidden:"qt-split-menu-popover"},()=>state.getState().primary===1&&state.getState().split===1);

mount("context","qt-context");
add({action:"key",target:"qt-context",key:"ContextMenu",label:"Context menu opens by Menu key",visible:"qt-context-menu"});
add({action:"key",key:"Enter",label:"Context action commits once",hidden:"qt-context-menu"},()=>state.getState().context===1);

mount("popover","qt-popover");
add({action:"key",target:"qt-popover",key:"Escape",label:"Popover Escape requests close",hidden:"qt-popover"},()=>!state.getState().popover);
add({action:"call",label:"Reopen controlled popover",visible:"qt-popover-close"},()=>state.getState().popover,()=>change({popover:true}));
add({action:"click",target:"qt-popover-close",label:"Popover close control works",hidden:"qt-popover"},()=>!state.getState().popover);

mount("find","qt-find");
add({action:"assert",label:"Find uses the actual literal document provider"},()=>state.getState().findCalls>0);
add({action:"key",target:"qt-find",key:"Escape",label:"Find and replace closes",hidden:"qt-find"},()=>!state.getState().find);
add({action:"assert",label:"All controlled outcomes retained"},()=>{
  const s=state.getState();return s.selection==="b"&&s.dropdown==="b"&&s.slider===100&&s.actions===1&&s.primary===1&&s.split===1&&s.context===1&&!s.popover&&!s.find;
});

globalThis.__qtProbeSteps=steps;
globalThis.__qtProbeCheck=index=>checks[index]?.()===true;
globalThis.__qtProbeAction=index=>calls[index]?.();
globalThis.__qtProbeSnapshot=()=>JSON.stringify(state.getState());

function Probe(){
  const s=useStore(state),screen=useWindowDimensions();
  const width=Math.max(240,Math.min(560,screen.width-48));
  const regions=[{x:0,y:0,width:screen.width,height:screen.height}];
  const anchor={x:24,y:100,width:200,height:44};
  let content;
  if(s.stage==="tooltip")content=<>
    <Tooltip label="Writes this document" delayMs={30} testID="qt-tooltip-body">
      <Pressable testID="qt-tooltip-anchor" accessibilityRole="button" onPress={()=>inc("tooltipPresses")}
        style={{width:220,minHeight:48,justifyContent:"center",padding:12,backgroundColor:"#e9edf3"}}>
        <Text style={{fontSize:16,color:"#172334"}}>Save document</Text>
      </Pressable>
    </Tooltip>
    <Pressable testID="qt-focus-reset" accessibilityRole="button" onPress={()=>change({tooltipPresses:0})} style={{marginTop:80,minHeight:44}}>
      <Text style={{color:"#172334",fontSize:16}}>Next control</Text>
    </Pressable>
  </>;
  if(s.stage==="select")content=<Select testID="qt-select" label="Workspace" value={s.selection} options={choices} onValueChange={selection=>change({selection})}/>;
  if(s.stage==="dropdown")content=<NativeDropdown testID="qt-dropdown" label="Workspace" value={s.dropdown}
    groups={[{heading:"Saved",options:[{value:"a",label:"Alpha"},{value:"b",label:"Beta"}]}]} onValueChange={dropdown=>change({dropdown})}/>;
  if(s.stage==="actions")content=<NativeActionMenu testID="qt-actions" accessibilityLabel="Document actions"
    trigger={<Text style={{fontSize:16,color:"#172334"}}>Document actions</Text>} actions={actions} onAction={()=>inc("actions")}/>;
  if(s.stage==="slider")content=<NativeSliderField testID="qt-slider" label="Opacity" value={s.slider} min={0} max={100} step={1} onCommit={slider=>change({slider})}/>;
  if(s.stage==="split")content=<NativeSplitButton testID="qt-split" label="Save" onPress={()=>inc("primary")} actions={actions} onAction={()=>inc("split")}/>;
  if(s.stage==="context")content=<ContextMenu testID="qt-context" accessibilityLabel="Document" actions={actions} onAction={()=>inc("context")}>
    <Text style={{fontSize:16,color:"#172334"}}>Document context actions</Text>
  </ContextMenu>;
  if(s.stage==="popover")content=<NativePopover testID="qt-popover" open={s.popover} onOpenChange={popover=>change({popover})}
    anchor={anchor} usableRegions={regions} accessibilityLabel="Document settings">
    <View style={{padding:16}}><Text style={{fontSize:16,color:"#172334"}}>Document settings</Text>
      <Pressable testID="qt-popover-close" accessibilityRole="button" onPress={()=>change({popover:false})} style={{minHeight:48,justifyContent:"center"}}>
        <Text style={{fontSize:16,color:"#172334"}}>Close settings</Text>
      </Pressable>
    </View>
  </NativePopover>;
  if(s.stage==="find")content=<FindReplacePopover testID="qt-find" open={s.find} onOpenChange={find=>change({find})}
    anchor={anchor} usableRegions={regions} document={s.document} initialQuery="Alpha"
    onFind={query=>{inc("findCalls");return findLiteralText(state.getState().document.text,query);}}
    onReplace={request=>{const current=state.getState().document;change({document:{...current,text:replaceLiteralText(current,request),revision:String(Number(current.revision)+1)}});}}
    onNavigate={(_document,match)=>change({match:match.id})}/>;
  return <View testID="qt-root" style={{flex:1,padding:24,backgroundColor:"#f6f7fa"}}>
    <Text testID="qt-status" style={{fontSize:18,fontWeight:"600",color:"#172334",marginBottom:16}}>Qt controls: {s.stage}</Text>
    <View style={{width,minHeight:240}}>{content}</View>
  </View>;
}
AppRegistry.registerComponent("RNQnxQtControlsProbe",()=>Probe);
