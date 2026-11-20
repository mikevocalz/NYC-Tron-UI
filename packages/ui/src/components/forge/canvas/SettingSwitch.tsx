import {Pressable,Text,View} from "react-native";
import {joinClasses} from "../../styles.ts";
import {space,radius,opacity,size} from "../../../tokens.ts";

/**
 * Labeled on/off row shared by the canvas settings panels: a 44pt switch with
 * the label on the start side and the track on the end side (mirrored in RTL).
 */
export function SettingSwitch({label,on,onChange,disabled,styled,hint}:{
  label:string;on:boolean;onChange:(on:boolean)=>void;disabled:boolean;styled:boolean;hint?:string|undefined;
}){
  return <Pressable role="switch" aria-checked={on} accessibilityRole="switch" accessibilityState={{checked:on,disabled}}
    aria-label={label} accessibilityHint={hint} disabled={disabled} onPress={()=>onChange(!on)}
    {...{className:joinClasses(styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus")}}
    style={{minHeight:size.touch,flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:space[3],paddingHorizontal:space[1],opacity:disabled?opacity[50]:1}}>
    <Text {...{className:joinClasses(styled&&"text-text text-sm")}} style={{flexShrink:1}}>{label}</Text>
    <View pointerEvents="none" {...{className:joinClasses(styled&&"border",styled&&(on?"bg-primary border-primary":"bg-surface-sunken border-border"))}}
      style={{width:40,height:24,borderRadius:radius[12],padding:space[0.5],justifyContent:"center",alignItems:on?"flex-end":"flex-start"}}>
      <View {...{className:joinClasses(styled&&(on?"bg-on-primary":"bg-text-muted"))}} style={{width:18,height:18,borderRadius:radius[9]}}/>
    </View>
  </Pressable>;
}
