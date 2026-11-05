import {useRef} from "react";
import {LinearGradient} from "expo-linear-gradient";
import {Column,Host,Slider,Text as NativeText} from "@expo/ui";
import {PanResponder,Pressable,Text,View,type GestureResponderEvent,type ViewProps} from "react-native";
import {joinClasses} from "../../styles.ts";
import {Button} from "../../Button.tsx";
import {ColorChannels} from "../ColorChannels.tsx";
import {assertHsv,hsvToRgb,rgbToHsv,rgbaToHex,wrapHue,type HsvColor} from "../color.ts";
import {clamp} from "../inputs/precision.ts";
import {createFieldGesture} from "./fieldGesture.ts";

/** Props for {@linkcode HsvPicker}. */
export interface HsvPickerProps extends Omit<ViewProps,"children"> {
  /** The one authoritative color. Keep it in the host's store or engine. */
  readonly value:HsvColor;
  /** Called on every preview change: field drag, slider, stepper or channel edit. */
  readonly onValueChange:(next:HsvColor)=>void;
  /** Shows an Apply button. Commit one engine/undo transaction here; it is never called on drag release. */
  readonly onApply?:(color:HsvColor)=>void;
  /** Shows a Cancel button. The host restores its own committed color. */
  readonly onCancel?:()=>void;
  /** Saturation/value field height in dp, 80..1000. @default 210 */
  readonly fieldHeight?:number;
  /** Saturation and brightness change per stepper press or screen-reader action, 0.001..1. @default 0.05 */
  readonly step?:number;
  /** Hue change in degrees per screen-reader hue action, 1..180. @default 5 */
  readonly hueStep?:number;
  /** Shows the RGBA {@linkcode ColorChannels} sliders under the HSV controls. @default true */
  readonly showChannels?:boolean;
  /** Shows the opacity slider inside the channel sliders. @default true */
  readonly showAlpha?:boolean;
  readonly disabled?:boolean;
  className?:string;
  /** Drops the default token recipe; the app supplies every class. */
  unstyled?:boolean;
}

const pure=(h:number)=>rgbaToHex(hsvToRgb({h,s:1,v:1,alpha:1}),false);
// Gradient stops are color-model values (pure hues, white, black), not
// theme colors, so they are computed instead of written as palette literals.
const SPECTRUM=[0,60,120,180,240,300,360].map(pure) as unknown as readonly [string,string,...string[]];
const WHITE=rgbaToHex(hsvToRgb({h:0,s:0,v:1,alpha:1}),false);
const CLEAR_BLACK=rgbaToHex({r:0,g:0,b:0,alpha:0});
const BLACK=rgbaToHex({r:0,g:0,b:0,alpha:1},false);
const TARGET={minWidth:44,minHeight:44,alignItems:"center" as const,justifyContent:"center" as const};
const round3=(n:number)=>Math.round(n*1000)/1000;

/**
 * Controlled HSV display-color picker: a saturation/value field, a native
 * `@expo/ui` hue slider, 44pt saturation/brightness steppers and optional RGBA
 * channels. It holds no color state; the only refs are the measured field
 * size and the latest props for the responder.
 *
 * Requires the optional peers `@expo/ui` and `expo-linear-gradient`. Nothing
 * animates: the thumb tracks the finger 1:1 and steppers jump directly, so
 * there is no motion for reduce-motion to suppress.
 */
export function HsvPicker({
  value,onValueChange,onApply,onCancel,fieldHeight=210,step=0.05,hueStep=5,
  showChannels=true,showAlpha=true,disabled=false,className,unstyled=false,testID,...rest
}:HsvPickerProps){
  assertHsv(value);
  if(!Number.isFinite(fieldHeight)||fieldHeight<80||fieldHeight>1000)
    throw new RangeError("fieldHeight must be 80..1000 dp");
  if(!Number.isFinite(step)||step<0.001||step>1)throw new RangeError("step must be 0.001..1");
  if(!Number.isFinite(hueStep)||hueStep<1||hueStep>180)throw new RangeError("hueStep must be 1..180 degrees");

  const latest=useRef({value,onValueChange,disabled});
  latest.current={value,onValueChange,disabled};
  // Stays 0x0 until onLayout; the gesture ignores touches until then.
  const size=useRef({width:0,height:0});
  const responder=useRef<ReturnType<typeof PanResponder.create>|null>(null);
  if(!responder.current){
    const gesture=createFieldGesture({
      getSize:()=>size.current,
      getValue:()=>latest.current.value,
      getDisabled:()=>latest.current.disabled,
      onChange:next=>latest.current.onValueChange(next),
    });
    const point=(e:GestureResponderEvent)=>({x:e.nativeEvent.locationX,y:e.nativeEvent.locationY});
    responder.current=PanResponder.create({
      onStartShouldSetPanResponder:gesture.shouldStart,
      onStartShouldSetPanResponderCapture:gesture.shouldStart,
      onMoveShouldSetPanResponder:gesture.shouldStart,
      onMoveShouldSetPanResponderCapture:gesture.shouldStart,
      onPanResponderGrant:e=>gesture.grant(point(e)),
      onPanResponderMove:e=>gesture.move(point(e)),
      onPanResponderRelease:gesture.release,
      onPanResponderTerminate:gesture.terminate,
      onPanResponderTerminationRequest:gesture.terminationRequest,
      onShouldBlockNativeResponder:()=>true,
    });
  }

  const nudge=(axis:"s"|"v",direction:-1|1)=>{
    if(disabled)return;
    const next=round3(clamp(value[axis]+direction*step,0,1));
    if(next!==value[axis])onValueChange({...value,[axis]:next});
  };
  const nudgeHue=(direction:-1|1)=>{
    if(!disabled)onValueChange({...value,h:wrapHue(value.h+direction*hueStep)});
  };
  const hue=Math.round(wrapHue(value.h));
  const sat=Math.round(value.s*100);
  const bri=Math.round(value.v*100);
  const rgb=hsvToRgb(value);
  const hex=rgbaToHex(rgb);
  const styled=!unstyled;
  const text=joinClasses(styled&&"text-text");
  const muted=joinClasses(styled&&"text-text-muted");
  const id=(suffix:string)=>testID?{testID:testID+"-"+suffix}:{};
  const stepper=(axis:"s"|"v",label:string,shown:number)=>
    <View style={{flexDirection:"row",alignItems:"center",gap:8}}>
      <Pressable accessibilityRole="button" accessibilityLabel={"Decrease "+label}
        accessibilityState={{disabled}} disabled={disabled} onPress={()=>nudge(axis,-1)}
        {...id(axis==="s"?"saturation-decrease":"brightness-decrease")}
        {...{className:joinClasses(styled&&"rounded-control border border-border bg-surface-sunken")}}
        style={{...TARGET,opacity:disabled?0.45:1}}>
        <Text {...{className:text}}>−</Text>
      </Pressable>
      <Text {...{className:muted}} style={{minWidth:120,textAlign:"center"}}>{label} {shown}%</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={"Increase "+label}
        accessibilityState={{disabled}} disabled={disabled} onPress={()=>nudge(axis,1)}
        {...id(axis==="s"?"saturation-increase":"brightness-increase")}
        {...{className:joinClasses(styled&&"rounded-control border border-border bg-surface-sunken")}}
        style={{...TARGET,opacity:disabled?0.45:1}}>
        <Text {...{className:text}}>+</Text>
      </Pressable>
    </View>;

  return <View {...rest} {...(testID?{testID}:{})}
    {...{className:joinClasses("w-full gap-3",styled&&"rounded-control bg-surface-raised p-3",className)}}>
    <View {...responder.current.panHandlers} {...id("field")}
      onLayout={e=>{
        const l=e.nativeEvent.layout;
        size.current={width:l.width,height:l.height};
      }}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="Saturation and brightness"
      accessibilityValue={{text:`Saturation ${sat} percent, brightness ${bri} percent, hue ${hue} degrees, ${rgbaToHex(rgb,false)}`}}
      accessibilityState={{disabled}}
      accessibilityHint="Swipe up or down to change saturation; use the actions menu for brightness and hue"
      accessibilityActions={[
        {name:"increment",label:"Increase saturation"},{name:"decrement",label:"Decrease saturation"},
        {name:"increaseBrightness",label:"Increase brightness"},{name:"decreaseBrightness",label:"Decrease brightness"},
        {name:"increaseHue",label:"Increase hue"},{name:"decreaseHue",label:"Decrease hue"},
      ]}
      onAccessibilityAction={e=>{
        const a=e.nativeEvent.actionName;
        if(a==="increment")nudge("s",1);
        else if(a==="decrement")nudge("s",-1);
        else if(a==="increaseBrightness")nudge("v",1);
        else if(a==="decreaseBrightness")nudge("v",-1);
        else if(a==="increaseHue")nudgeHue(1);
        else if(a==="decreaseHue")nudgeHue(-1);
      }}
      {...{className:joinClasses(styled&&"rounded-control border-border")}}
      style={{width:"100%",height:fieldHeight,borderWidth:1,overflow:"hidden",opacity:disabled?0.45:1}}>
      <LinearGradient pointerEvents="none" colors={[WHITE,pure(value.h)]}
        start={{x:0,y:0}} end={{x:1,y:0}} style={{position:"absolute",width:"100%",height:"100%"}}/>
      <LinearGradient pointerEvents="none" colors={[CLEAR_BLACK,BLACK]}
        start={{x:0,y:0}} end={{x:0,y:1}} style={{position:"absolute",width:"100%",height:"100%"}}/>
      {/* Two token rings keep the thumb visible on light and dark field areas. */}
      <View pointerEvents="none" {...{className:joinClasses(styled&&"border-text")}}
        style={{position:"absolute",left:`${value.s*100}%`,top:`${(1-value.v)*100}%`,
          width:28,height:28,borderRadius:14,borderWidth:2,
          transform:[{translateX:-14},{translateY:-14}],alignItems:"center",justifyContent:"center"}}>
        <View {...{className:joinClasses(styled&&"border-surface-raised")}}
          style={{width:24,height:24,borderRadius:12,borderWidth:2,backgroundColor:hex}}/>
      </View>
    </View>
    {stepper("s","Saturation",sat)}
    {stepper("v","Brightness",bri)}
    <LinearGradient pointerEvents="none" colors={SPECTRUM}
      start={{x:0,y:0}} end={{x:1,y:0}} style={{height:12,borderRadius:6}}/>
    <Host style={{width:"100%"}}>
      <Column>
        <NativeText>{`Hue ${hue}°`}</NativeText>
        <Slider value={hue===360?0:hue} min={0} max={359} step={1} disabled={disabled}
          onValueChange={h=>{if(!disabled)onValueChange({...value,h:wrapHue(h)});}}/>
        <NativeText>{`Hex ${hex}`}</NativeText>
      </Column>
    </Host>
    {showChannels?<ColorChannels value={rgb} showAlpha={showAlpha} disabled={disabled} unstyled {...id("channels")}
      onValueChange={rgba=>onValueChange(rgbToHsv(rgba,value.h))}/>:null}
    {onApply||onCancel?<View style={{flexDirection:"row",gap:8,justifyContent:"flex-end"}}>
      {onCancel?<Button title="Cancel" variant="secondary" disabled={disabled} onPress={onCancel} {...id("cancel")}/>:null}
      {onApply?<Button title="Apply color" disabled={disabled} onPress={()=>onApply(value)} {...id("apply")}/>:null}
    </View>:null}
  </View>;
}
