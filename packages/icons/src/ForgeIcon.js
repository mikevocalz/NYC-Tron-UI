import React,{useEffect,useId,useRef} from "react";
import {Animated,Easing,Platform,Pressable,View} from "react-native";
import Svg,{Defs,G,Mask,Path,Rect} from "react-native-svg";
import {getGlyph} from "./glyphs.js";
import {resolveIconState} from "./state.js";
import {iconStroke,iconMotion} from "./tokens.js";

// react-native-svg's web build spreads every prop onto the DOM <svg>, so the
// RN-only `accessible` reached the DOM there and React warned about it. Web
// hides the drawing with aria-hidden and keeps it out of the Tab order with
// the SVG `focusable` attribute; native keeps the RN accessibility props.
const web=()=>Platform.OS==="web";
/** Decorative SVG is hidden from VoiceOver, TalkBack and web screen readers. */
const hiddenSvg=()=>web()?{"aria-hidden":true,focusable:"false"}:{accessible:false,focusable:false,"aria-hidden":true};
function pathProps(d,mode,ink){
 const solid=mode==="fill"||(mode==="knockout"&&/[zZ]\s*$/.test(d));
 return {d,stroke:solid?"none":ink,fill:solid?ink:"none",
   strokeWidth:iconStroke.width,strokeLinecap:"round",
   strokeLinejoin:"round",fillRule:"evenodd"};
}
function IconPaths({name,variant,color,size}){
 const maskId="tron-icon-knockout-"+useId().replace(/[^A-Za-z0-9_-]/g,"");
 const paths=getGlyph(name,variant);
 if(!paths)return null;
 const ink=paths.filter(([,mode])=>mode!=="knockout");
 const knockouts=paths.filter(([,mode])=>mode==="knockout");
 const drawn=ink.map(([d,mode],index)=>React.createElement(Path,{key:index,...pathProps(d,mode,color)}));
 if(knockouts.length===0)
   return React.createElement(Svg,{width:size,height:size,viewBox:"0 0 24 24",...hiddenSvg()},drawn);
 // Knockout detail is a real cutout through a mask, so filled glyphs stay
 // correct on gradients, images and any theme surface; no surface color needed.
 return React.createElement(Svg,{width:size,height:size,viewBox:"0 0 24 24",...hiddenSvg()},
   React.createElement(Defs,null,
     React.createElement(Mask,{id:maskId,maskUnits:"userSpaceOnUse",x:0,y:0,width:24,height:24},
       React.createElement(Rect,{x:0,y:0,width:24,height:24,fill:"white"}),
       knockouts.map(([d,mode],index)=>React.createElement(Path,{key:index,...pathProps(d,mode,"black")})))),
   React.createElement(G,{mask:"url(#"+maskId+")"},drawn));
}
/**
 * Shared native/web icon. Selected=filled, idle=outline.
 * Can render a real host-supplied Rive artboard, otherwise an Animated
 * outline-to-filled crossfade. Never invents operation success.
 * Decorative by default; pass accessibilityLabel for a meaningful standalone
 * icon, which is then exposed as one labelled image.
 */
export function ForgeIcon({
 name,selected=false,disabled=false,loading=false,pressed=false,hovered=false,
 status="idle",size="default",appearance="light",color,selectedColor,disabledColor,
 successColor,errorColor,reducedMotion=false,renderRive,testID,accessibilityLabel
}){
 const input={selected,disabled,loading,pressed,hovered,status,
   size,appearance,color,selectedColor,disabledColor,successColor,
   errorColor,reducedMotion};
 const label=typeof accessibilityLabel==="string"&&accessibilityLabel.trim()?accessibilityLabel:undefined;
 const view=resolveIconState(input);
 const progress=useRef(new Animated.Value(selected?1:0)).current;
 const scale=useRef(new Animated.Value(1)).current;
 const rotation=useRef(new Animated.Value(0)).current;
 useEffect(()=>{
   progress.stopAnimation();
   if(disabled||reducedMotion){progress.setValue(selected?1:0);return;}
   const motion=Animated.timing(progress,{toValue:selected?1:0,
     duration:selected?iconMotion.selectMs:iconMotion.deselectMs,
     easing:Easing.out(Easing.cubic),useNativeDriver:true});
   motion.start();return()=>motion.stop();
 },[progress,selected,reducedMotion,disabled]);
 useEffect(()=>{
   scale.stopAnimation();
   if(disabled||reducedMotion){scale.setValue(1);return;}
   const motion=Animated.spring(scale,{toValue:pressed?iconMotion.pressScale:
     selected?iconMotion.selectedScale:1,stiffness:260,damping:22,
     mass:0.8,useNativeDriver:true});
   motion.start();return()=>motion.stop();
 },[scale,pressed,selected,reducedMotion,disabled]);
 useEffect(()=>{
   rotation.stopAnimation();rotation.setValue(0);
   if(!loading||disabled||reducedMotion)return;
   const motion=Animated.loop(Animated.timing(rotation,{toValue:1,
     duration:iconMotion.loadingMs,easing:Easing.linear,useNativeDriver:true}));
   motion.start();return()=>{motion.stop();rotation.setValue(0);};
 },[rotation,loading,reducedMotion,disabled]);
 const rive=typeof renderRive==="function"?renderRive({
   name,selected,disabled,loading,pressed,hovered,status,
   color:view.color,size:view.size,reducedMotion,artboard:"ForgeIcon",
   stateMachine:"ForgeIconStates"
 }):null;
 if(rive!==null&&rive!==undefined)return rive;
 if(!getGlyph(name,"outline"))return null;
 const invisible=progress.interpolate({inputRange:[0,1],outputRange:[1,0]});
 const spin=rotation.interpolate({inputRange:[0,1],outputRange:["0deg","360deg"]});
 const box={position:"absolute",left:0,top:0,width:view.size,height:view.size};
 // Web takes the ARIA form only; react-native-web maps role and aria-* itself.
 const a11y=web()?(label?{role:"img","aria-label":label}:{"aria-hidden":true}):
  label?{accessible:true,accessibilityRole:"image",role:"img",
   accessibilityLabel:label,"aria-label":label}:
   {accessible:false,accessibilityElementsHidden:true,
    importantForAccessibility:"no-hide-descendants","aria-hidden":true};
 return React.createElement(Animated.View,{testID,...a11y,
   style:{width:view.size,height:view.size,opacity:view.opacity,
     transform:[{scale},{rotate:spin}]}},
   React.createElement(View,{style:{width:view.size,height:view.size}},
     React.createElement(Animated.View,{style:{...box,opacity:invisible}},
       React.createElement(IconPaths,{name,variant:"outline",color:view.color,
         size:view.size})),
     React.createElement(Animated.View,{style:{...box,opacity:progress}},
       React.createElement(IconPaths,{name,variant:"filled",color:view.color,
         size:view.size}))));
}
/** Accessible min-44pt hit target. Host owns selection via Zustand/other store. */
export function ForgeIconButton({name,label,onPress,selected=false,disabled=false,
 loading=false,size="default",testID,...rest}){
 if(typeof label!=="string"||!label.trim())
   throw new TypeError("ForgeIconButton requires an accessible label");
 return React.createElement(Pressable,{
   testID,disabled:disabled||loading,onPress,
   accessibilityRole:"button",accessibilityLabel:label,
   accessibilityState:{selected,disabled:disabled||loading,busy:loading},hitSlop:4,
   style:{minWidth:44,minHeight:44,justifyContent:"center",alignItems:"center"}
 },({pressed})=>React.createElement(ForgeIcon,{
   ...rest,accessibilityLabel:undefined,name,selected,disabled,loading,size,pressed
 }));
}
