import { useRef } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import { Host } from "@expo/ui";
import { Slider as SwiftUISlider, Text as SwiftUIText } from "@expo/ui/swift-ui";
import { disabled as swiftUIDisabled } from "@expo/ui/swift-ui/modifiers";
import { Slider as ComposeSlider } from "@expo/ui/jetpack-compose";
import { semantics, testID as composeTestID } from "@expo/ui/jetpack-compose/modifiers";
import { UnitInput } from "@nyc-tron/ui/components/shell/UnitInput";
import { composeSteps, type NativeSliderFieldProps } from "./NativeSliderField.types.ts";
export type { NativeSliderFieldProps } from "./NativeSliderField.types.ts";

/**
 * The OS slider (SwiftUI `Slider` on iOS, Material 3 `Slider` on Android)
 * with the SliderField contract around it: an RN label, a typed value field
 * and Reset. The thumb previews through `onPreview`; the value commits once
 * when the OS reports the drag ended (`onEditingChanged(false)` on iOS,
 * `onValueChangeFinished` on Android), not on every frame.
 *
 * The label goes into the native control (SwiftUI `label`, Compose
 * `contentDescription`) so VoiceOver and TalkBack name the slider; the
 * visible RN caption is hidden from assistive tech so it is not read twice.
 */
export function NativeSliderField({
  label,value,min,max,step,onPreview,onCommit,defaultValue,unit,disabled=false,testID,colorScheme,
}:NativeSliderFieldProps){
  const local=useRef<StoreApi<{preview:number|undefined}>|null>(null);
  if(!local.current)local.current=createStore<{preview:number|undefined}>(()=>({preview:undefined}));
  const store=local.current;
  const preview=useStore(store,s=>s.preview);
  const shown=preview??value;
  const preview_=(next:number)=>{
    const snapped=Math.min(max,Math.max(min,min+Math.round((next-min)/step)*step));
    store.setState({preview:snapped});
    onPreview?.(snapped);
  };
  const finish=()=>{
    const next=store.getState().preview;
    store.setState({preview:undefined});
    if(next!==undefined&&next!==value)onCommit(next);
  };
  const commit=(next:number)=>{if(!disabled&&next!==value)onCommit(next);};
  const decimals=Math.max(0,-Math.floor(Math.log10(step)));
  return <View style={{gap:4,opacity:disabled?0.5:1}} testID={testID}>
    <View style={{flexDirection:"row",alignItems:"center",gap:8,minHeight:44}}>
      <Text accessibilityElementsHidden importantForAccessibility="no" style={{flex:1}}
        {...{className:"text-text text-sm"}}>{label}</Text>
      {defaultValue!==undefined&&defaultValue!==value?<Pressable accessibilityRole="button"
        accessibilityLabel={"Reset "+label} disabled={disabled} onPress={()=>commit(defaultValue)}
        style={{minHeight:44,minWidth:44,alignItems:"center",justifyContent:"center"}}>
        <Text {...{className:"text-text-muted text-xs"}}>Reset</Text>
      </Pressable>:null}
      <UnitInput label={label+" value"} hideLabel value={shown} min={min} max={max} step={step}
        precision={decimals} disabled={disabled} onCommit={commit} style={{width:80}}/>
      {unit?<Text {...{className:"text-text-muted text-xs"}}>{unit}</Text>:null}
    </View>
    <Host colorScheme={colorScheme} matchContents={{vertical:true}} style={{width:"100%",minHeight:44}}>
      {Platform.OS==="android"
        ? <ComposeSlider value={shown} min={min} max={max} steps={composeSteps(min,max,step)} enabled={!disabled}
            onValueChange={preview_} onValueChangeFinished={finish}
            modifiers={[semantics({contentDescription:label}),...(testID?[composeTestID(testID+"-slider")]:[])]}/>
        : <SwiftUISlider value={shown} min={min} max={max} step={step} label={<SwiftUIText>{label}</SwiftUIText>}
            onValueChange={preview_} onEditingChanged={editing=>{if(!editing)finish();}}
            modifiers={disabled?[swiftUIDisabled(true)]:[]}/>}
    </Host>
  </View>;
}
