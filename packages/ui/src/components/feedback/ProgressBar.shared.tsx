/*
 * Behaviour adapted from NYC-MON packages/ui/progress/ProgressBar.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): Tron token classes, determinate and
 * indeterminate bars with progressbar semantics and reduced motion; no
 * NYC-MON theme or icons.
 */
import { useEffect, useRef, useSyncExternalStore } from "react";
import { AccessibilityInfo, Animated, Easing, Text, View } from "react-native";
import { joinClasses } from "../styles.ts";
import { createSystemFlag } from "./progress-model.ts";
import { resolveProgressBar, type ProgressBarProps, type ProgressBarTone } from "./ProgressBar.types.ts";

const FILL:Record<ProgressBarTone,string>={default:"bg-primary",success:"bg-success",danger:"bg-danger"};
/** Width of the moving segment, and of the static segment under reduced motion. */
const SEGMENT="35%";

const reducedMotion=createSystemFlag(
  ()=>AccessibilityInfo.isReduceMotionEnabled?.(),
  receive=>AccessibilityInfo.addEventListener?.("reduceMotionChanged",receive),
);
/** Whether reduce motion is on (system setting; web reads `prefers-reduced-motion`). */
export const useReducedMotion=()=>useSyncExternalStore(reducedMotion.subscribe,reducedMotion.get,()=>false);

/**
 * Kit build of ProgressBar: React Native views and theme tokens. Linear progress for work with a known or unknown end. The fill grows from
 * the start edge, so it runs right to left in RTL. Indeterminate progress
 * slides a segment along the track with React Native `Animated`; with reduce
 * motion on, it shows a still segment at the start instead. Throws a
 * RangeError when `min >= max`, when a bound or the value is not finite, and a
 * TypeError when there is no label in words.
 */
export function KitProgressBar(props:ProgressBarProps) {
  const {
    ref,value:_value,min:_min,max:_max,indeterminate:_indeterminate,label,showValue=false,valueText:_valueText,busyText:_busyText,
    tone="default",size:_size,color:_color,colorScheme:_colorScheme,
    className,labelClassName,valueClassName,trackClassName,fillClassName,unstyled=false,
    accessibilityLabel:_accessibilityLabel,accessibilityState,style,...rest
  }=props;
  const {height,a11y}=resolveProgressBar(props);
  const reduced=useReducedMotion();
  const styled=!unstyled;
  const sliding=a11y.busy&&!reduced;
  const offset=useRef(new Animated.Value(0)).current;

  useEffect(()=>{
    if(!sliding)return;
    offset.setValue(0);
    const loop=Animated.loop(Animated.timing(offset,{
      toValue:1,duration:1400,easing:Easing.inOut(Easing.ease),
      // Width is a layout property, which the native driver cannot animate.
      useNativeDriver:false,isInteraction:false,
    }));
    loop.start();
    return ()=>loop.stop();
  },[sliding,offset]);

  const fill=joinClasses("h-full",styled&&"rounded-full",styled&&FILL[tone],fillClassName);
  return (
    <View {...rest} ref={ref} style={[{gap:6},style]} accessible
      accessibilityRole="progressbar"
      accessibilityLabel={a11y.accessibilityLabel}
      accessibilityState={{...accessibilityState,busy:a11y.busy}}
      accessibilityValue={a11y.accessibilityValue}
      aria-valuetext={a11y.accessibilityValue.text}
      {...{className:joinClasses("w-full",className)}}>
      <ProgressLabelRow label={label} value={showValue&&!a11y.busy?a11y.accessibilityValue.text:undefined}
        unstyled={unstyled} labelClassName={labelClassName} valueClassName={valueClassName}/>
      {/* Row direction follows the layout direction, so the fill starts at the start edge in RTL too. */}
      <View aria-hidden importantForAccessibility="no-hide-descendants" accessibilityElementsHidden style={{height,flexDirection:"row",overflow:"hidden"}}
        {...{className:joinClasses("w-full",styled&&"rounded-full bg-surface-sunken",trackClassName)}}>
        {!a11y.busy ? (
          <View style={{width:`${a11y.fraction*100}%`}} {...{className:fill}}/>
        ) : sliding ? (
          <>
            {/* A spacer pushes the segment toward the end edge; the segment grows in from the start first. */}
            <Animated.View style={{flexShrink:0,width:offset.interpolate({inputRange:[0,1],outputRange:["0%","100%"]})}}/>
            <Animated.View style={{flexShrink:0,width:offset.interpolate({inputRange:[0,0.3,1],outputRange:["0%",SEGMENT,SEGMENT]})}} {...{className:fill}}/>
          </>
        ) : (
          <View style={{width:SEGMENT}} {...{className:fill}}/>
        )}
      </View>
    </View>
  );
}

/**
 * Visible label and value text above a bar, in both forks. Hidden from
 * assistive tech: the progress element already carries the name and value.
 */
export function ProgressLabelRow({label,value,unstyled=false,labelClassName,valueClassName}:{
  label?:string|undefined;value?:string|undefined;unstyled?:boolean|undefined;labelClassName?:string|undefined;valueClassName?:string|undefined;
}) {
  if(!label&&value===undefined)return null;
  const styled=!unstyled;
  return (
    <View aria-hidden importantForAccessibility="no-hide-descendants" accessibilityElementsHidden
      {...{className:"flex-row items-baseline justify-between gap-3"}}>
      {label ? <Text {...{className:joinClasses("min-w-0 flex-1",styled&&"text-sm font-semibold text-text",labelClassName)}}>{label}</Text> : <View/>}
      {value!==undefined ? <Text {...{className:joinClasses(styled&&"text-sm text-text-muted",valueClassName)}}>{value}</Text> : null}
    </View>
  );
}
