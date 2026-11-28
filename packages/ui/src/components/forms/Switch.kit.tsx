/*
 * Behaviour adapted from NYC-MON packages/ui/cards/NeonSwitch.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): plain token-styled switch for hosts
 * without Expo UI (QNX, Marathon); NYC-MON neon styling removed.
 */
import { useEffect, useState } from "react";
import {
  AccessibilityInfo, Animated, Easing, Platform, Pressable, Text, View,
} from "react-native";
import { joinClasses } from "../styles.ts";
import { isModified, webKey } from "./choice-keys.ts";
import {
  isKeyboardPress, keyRepeat, requireName, switchGeometry, toggleKeyAction, validateDuration,
} from "./toggle-model.ts";
import type { SwitchProps } from "./Switch.types.ts";

export type { SwitchProps, SwitchSize } from "./Switch.types.ts";


/** Follows the platform's reduce-motion setting (RN Web reads prefers-reduced-motion). */
function useReduceMotion():boolean{
  const [reduce,setReduce]=useState(false);
  useEffect(()=>{
    let alive=true;
    let sub:{remove?:()=>void}|undefined;
    try{AccessibilityInfo.isReduceMotionEnabled?.()?.then(v=>{if(alive)setReduce(!!v);},()=>{});}catch{}
    try{sub=AccessibilityInfo.addEventListener("reduceMotionChanged",v=>setReduce(!!v));}catch{}
    return ()=>{alive=false;sub?.remove?.();};
  },[]);
  return reduce;
}

/**
 * On/off control that takes effect immediately (a setting, not a form field
 * waiting for Submit). The whole row, label included, is one 44pt target
 * with the `switch` role and `checked` state. On web Space and Enter toggle.
 * The thumb's position is set with `marginStart`, so it mirrors in RTL and
 * on/off is shown by position as well as by the track fill.
 *
 * Kit implementation for hosts without Expo UI (QNX, Marathon); web, iOS and
 * Android use @expo/ui's universal Switch (`Switch.tsx`, `Switch.native.tsx`).
 */
export function Switch({
  ref,value,onValueChange,label,size="md",disabled=false,animationMs=150,colorScheme:_colorScheme,color:_color,style,
  className,trackClassName,thumbClassName,labelClassName,unstyled=false,...rest
}:SwitchProps){
  const name=requireName("Switch",label,rest.accessibilityLabel);
  const duration=validateDuration(animationMs);
  const g=switchGeometry(size);
  const styled=!unstyled;
  const reduce=useReduceMotion();
  const [anim]=useState(()=>new Animated.Value(value?1:0));
  useEffect(()=>{
    const to=value?1:0;
    if(reduce||duration===0){anim.stopAnimation();anim.setValue(to);return;}
    const run=Animated.timing(anim,{toValue:to,duration,easing:Easing.out(Easing.quad),useNativeDriver:false});
    run.start();
    return ()=>run.stop();
  },[value,reduce,duration,anim]);
  const toggle=()=>{if(!disabled)onValueChange(!value);};
  const onKeyDown=(event:unknown)=>{
    const k=webKey(event);
    if(isModified(k))return;
    const act=toggleKeyAction(k.key,"switch",keyRepeat(event));
    if(!act)return;
    k.preventDefault();
    if(act==="activate")toggle();
  };
  return (
    <Pressable {...rest} ref={ref}
      {...(Platform.OS==="web"?{onKeyDown}:{})}
      accessibilityRole="switch"
      accessibilityLabel={name}
      accessibilityState={{...rest.accessibilityState,checked:value,disabled}}
      aria-checked={value}
      disabled={disabled}
      // RN Web also presses on the Enter/Space keyup; onKeyDown already toggled.
      onPress={event=>{if(Platform.OS==="web"&&isKeyboardPress(event))return;toggle();}}
      style={[{minHeight:44,minWidth:44},style]}
      {...{className:joinClasses("flex-row items-center",
        styled&&"gap-3 rounded-control focus-visible:ring-2 focus-visible:ring-focus",
        disabled&&"opacity-50",className)}}>
      {label ? (
        <Text style={{flexShrink:1}} {...{className:joinClasses("min-w-0 flex-1",
          styled&&"text-base leading-6 text-text",labelClassName)}}>{label}</Text>
      ) : null}
      <View aria-hidden importantForAccessibility="no-hide-descendants"
        style={{width:g.trackWidth,height:g.trackHeight,borderWidth:g.trackBorder,flexDirection:"row",alignItems:"center",flexShrink:0}}
        {...{className:joinClasses(
          styled&&"rounded-full motion-reduce:transition-none",
          styled&&(value?"bg-primary border-primary forced-colors:border-[Highlight]":"bg-surface-sunken border-border"),
          trackClassName)}}>
        <Animated.View style={{marginStart:anim.interpolate({inputRange:[0,1],outputRange:[g.offStart,g.onStart]})}}>
          <View style={{width:g.thumb,height:g.thumb,borderWidth:1}}
            {...{className:joinClasses(styled&&"rounded-full",
              styled&&(value?"bg-on-primary border-on-primary":"bg-surface-raised border-text-muted"),
              thumbClassName)}}/>
        </Animated.View>
      </View>
    </Pressable>
  );
}
