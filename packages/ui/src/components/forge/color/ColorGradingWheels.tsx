import { Text, View, type ViewProps } from "react-native";
import { SliderField } from "../../shell/SliderField.tsx";
import { ColorDiscPicker } from "./ColorDiscPicker.tsx";
import { joinClasses } from "../../styles.ts";
import { validateGrade,type ColorGrade } from "./color-adjustments.ts";
export type { ColorGrade } from "./color-adjustments.ts";
/** Three controlled grading ranges with preview and transaction boundaries. */
export interface ColorGradingWheelsProps extends Omit<ViewProps,"children"> {
 readonly value:ColorGrade; readonly onCommit:(value:ColorGrade)=>void;
 readonly onPreview?:(value:ColorGrade|undefined)=>void;
 readonly disabled?:boolean; readonly unstyled?:boolean;
}
/** Tonal hue/saturation wheels and explicit exposure, balance and blending controls. */
export function ColorGradingWheels({value,onCommit,onPreview,disabled=false,unstyled=false,...props}:ColorGradingWheelsProps){
 validateGrade(value);
 return <View {...props} style={[{gap:12},props.style]}>{(['shadows','midtones','highlights'] as const).map(key=><View key={key} style={{gap:8}}>
   <Text accessibilityRole="header" {...{className:joinClasses(!unstyled&&"text-text font-semibold")}}>{key}</Text>
   <ColorDiscPicker value={{h:value[key].hue,s:value[key].saturation,v:1,alpha:1}} maxSize={180} showBrightness={false} disabled={disabled} unstyled={unstyled}
    onPreview={color=>onPreview?.(color.h===value[key].hue&&color.s===value[key].saturation?undefined:{...value,[key]:{...value[key],hue:color.h,saturation:color.s}})} onCommit={color=>{onPreview?.(undefined);if(!disabled)onCommit({...value,[key]:{...value[key],hue:color.h,saturation:color.s}});}}/>
   <SliderField label={`${key} exposure EV`} value={value[key].exposureEv} min={-10} max={10} step={.01} disabled={disabled} unstyled={unstyled} onPreview={number=>onPreview?.(number===value[key].exposureEv?undefined:{...value,[key]:{...value[key],exposureEv:number}})} onCommit={number=>{onPreview?.(undefined);if(!disabled)onCommit({...value,[key]:{...value[key],exposureEv:number}});}}/>
 </View>)}<SliderField label="Tonal balance" value={value.balance} min={-1} max={1} step={.01} disabled={disabled} unstyled={unstyled} onCommit={balance=>{if(!disabled)onCommit({...value,balance});}}/>
 <SliderField label="Grading blend" value={value.blend} min={0} max={1} step={.01} disabled={disabled} unstyled={unstyled} onCommit={blend=>{if(!disabled)onCommit({...value,blend});}}/>
 </View>;
}
