/*
 * Behaviour adapted from NYC-MON packages/ui/Textarea.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): counter text and live region shared by
 * the three Textarea implementations.
 */
import { useEffect, useId, useRef, useState } from "react";
import { AccessibilityInfo, Platform, Text } from "react-native";
import { joinClasses } from "../styles.ts";
import { counterIsNearLimit, counterState, counterText, safeId, shouldAnnounceCount, type CounterState } from "./field-model.ts";

/** Counter state for both Textarea forks, with the iOS announcement. */
export function useTextareaCounter({
  showCount,maxLength,threshold,countLabel=counterText,value,defaultValue,
}:{
  showCount:boolean;maxLength?:number;threshold:number;
  countLabel?:(state:CounterState)=>string;value?:string;defaultValue?:string;
}) {
  const id=safeId(useId())+"-count";
  // Uncontrolled length is tracked only for the counter.
  const [typed,setTyped]=useState(()=>(defaultValue??"").length);
  const length=value!==undefined?value.length:typed;
  const count=showCount?counterState(length,maxLength):undefined;
  const near=count?counterIsNearLimit(count,threshold):false;
  const words=count?countLabel(count):"";

  // iOS has no live regions: announce near the limit when the count changes.
  const lastRemaining=useRef<number|undefined>(undefined);
  useEffect(()=>{
    if(!count)return;
    if(Platform.OS==="ios"&&shouldAnnounceCount(lastRemaining.current,count,threshold)){
      AccessibilityInfo.announceForAccessibility(words);
    }
    lastRemaining.current=count.remaining;
  },[count?.remaining,words,threshold]);

  return {id,count,near,words,track:(text:string)=>{if(value===undefined)setTyped(text.length);}};
}

/**
 * Counter line. Words, not only digits; a polite live region only near the
 * limit (Android and web), so typing far from it stays quiet.
 */
export function TextareaCounter({
  id,count,near,words,styled,className,
}:{id:string;count:CounterState;near:boolean;words:string;styled:boolean;className?:string}) {
  const over=count.remaining!==undefined&&count.remaining<0;
  return (
    <Text nativeID={id} accessibilityLiveRegion={near?"polite":"none"}
      {...{className:joinClasses(styled&&"self-end text-sm",styled&&(over?"text-danger":"text-text-muted"),className)}}>
      {words}
    </Text>
  );
}
