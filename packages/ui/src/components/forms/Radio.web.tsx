import { createContext, use, useCallback, useEffect, useId, useMemo, useRef, useState, type ComponentRef } from "react";
import { I18nManager, Platform, Pressable, Text, View } from "react-native";
import { joinClasses } from "../styles.ts";
import { domIsRTL, isModified, nextChoiceIndex, webKey } from "./choice-keys.ts";
import {
  documentOrder, isKeyboardPress, keyRepeat, radioTabStop, requireName, toggleKeyAction,
  type RadioEntry,
} from "./toggle-model.ts";
import type { RadioGroupItemProps, RadioGroupProps } from "./Radio.types.ts";

export type { RadioGroupItemProps, RadioGroupProps, RadioProps } from "./Radio.types.ts";

type PressableRef=ComponentRef<typeof Pressable>;
type Registered={value:string;disabled:boolean;node:{current:PressableRef|null}};
interface GroupContext{
  value:string;disabled:boolean;unstyled:boolean;tabStop:string|null;
  select:(value:string)=>void;
  register:(entry:Registered)=>()=>void;
  ordered:()=>RadioEntry[];
}
const RadioGroupContext=createContext<GroupContext|null>(null);

/**
 * Single choice from a short list, all options visible. On web the checked
 * item (or the first enabled one) is the only Tab stop; arrow keys move and
 * select, flipped horizontally in RTL, Home/End jump, disabled items are
 * skipped and Space selects the focused item. Native screen readers reach
 * every item.
 */
export function RadioGroup({
  ref,value,onValueChange,label,orientation="vertical",disabled=false,colorScheme:_colorScheme,children,
  className,labelClassName,itemsClassName,unstyled=false,style,...rest
}:RadioGroupProps){
  const name=requireName("RadioGroup",label,rest.accessibilityLabel);
  const styled=!unstyled;
  const labelId=useId()+"-label";
  const items=useRef(new Map<string,Registered>());
  const latest=useRef({value,onValueChange,disabled});
  latest.current={value,onValueChange,disabled};
  const [tabStop,setTabStop]=useState<string|null>(null);
  const ordered=useCallback(():RadioEntry[]=>documentOrder([...items.current.values()].map(e=>({
    value:e.value,disabled:e.disabled||latest.current.disabled,node:e.node.current??undefined,
  }))),[]);
  const recompute=useCallback(()=>setTabStop(radioTabStop(ordered(),latest.current.value)),[ordered]);
  useEffect(recompute,[value,disabled,recompute]);
  // Stable, so items register once per mount instead of on every selection.
  const register=useCallback((entry:Registered)=>{
    items.current.set(entry.value,entry);
    recompute();
    return ()=>{
      if(items.current.get(entry.value)===entry)items.current.delete(entry.value);
      recompute();
    };
  },[recompute]);
  const select=useCallback((next:string)=>{
    const l=latest.current;
    if(l.disabled||next===l.value)return;
    l.onValueChange(next);
  },[]);
  const ctx=useMemo<GroupContext>(()=>({value,disabled,unstyled,tabStop,select,register,ordered}),
    [value,disabled,unstyled,tabStop,select,register,ordered]);
  const web=Platform.OS==="web"&&label?{"aria-labelledby":labelId}:{};
  return (
    <View {...rest} ref={ref} {...web}
      accessibilityRole="radiogroup"
      accessibilityLabel={name}
      accessibilityState={{...rest.accessibilityState,disabled}}
      style={style}
      {...{className:joinClasses(styled&&"gap-2",className)}}>
      {label ? <Text nativeID={labelId}
        {...{className:joinClasses(styled&&"text-sm font-semibold leading-5 text-text",labelClassName)}}>{label}</Text> : null}
      <View style={orientation==="horizontal"?{flexDirection:"row",flexWrap:"wrap"}:undefined}
        {...{className:joinClasses(orientation==="horizontal"?"flex-row flex-wrap":"flex-col",
          styled&&(orientation==="horizontal"?"gap-x-6":"gap-0"),itemsClassName)}}>
        <RadioGroupContext value={ctx}>{children}</RadioGroupContext>
      </View>
    </View>
  );
}


const RING=20,DOT=10;

/** One option of a {@linkcode RadioGroup}. Throws when rendered outside one. */
export function RadioGroupItem({
  ref,value,label,description,disabled=false,style,className,indicatorClassName,dotClassName,
  labelClassName,descriptionClassName,unstyled,...rest
}:RadioGroupItemProps){
  const group=use(RadioGroupContext);
  if(!group)throw new Error("RadioGroupItem must be rendered inside a RadioGroup");
  const name=requireName("RadioGroupItem",label,rest.accessibilityLabel);
  const styled=!(unstyled??group.unstyled);
  const off=disabled||group.disabled;
  const checked=group.value===value;
  const node=useRef<PressableRef|null>(null);
  const descId=useId()+"-desc";
  const {register}=group;
  useEffect(()=>register({value,disabled,node}),[register,value,disabled]);
  const setRef=(n:PressableRef|null)=>{
    node.current=n;
    if(typeof ref==="function")ref(n);
    else if(ref)(ref as {current:PressableRef|null}).current=n;
  };
  const select=()=>{if(!off)group.select(value);};
  const onKeyDown=(event:unknown)=>{
    const k=webKey(event);
    if(isModified(k))return;
    const act=toggleKeyAction(k.key,"radio",keyRepeat(event));
    if(act){k.preventDefault();if(act==="activate")select();return;}
    const list=group.ordered();
    const rtl=domIsRTL(k.currentTarget)||I18nManager.isRTL;
    const next=nextChoiceIndex(list.findIndex(e=>e.value===value),k.key,list.map(e=>e.disabled),{axis:"both",rtl});
    if(next===null)return;
    k.preventDefault();
    const target=list[next]!;
    (target.node as {focus?:()=>void}|undefined)?.focus?.();
    group.select(target.value);
  };
  // Before the group's first effect, the checked item holds the stop.
  const stop=group.tabStop??(group.value||null);
  const web=Platform.OS==="web"?{onKeyDown,tabIndex:(!off&&stop===value?0:-1) as 0|-1,
    "aria-describedby":description?descId:undefined}:{};
  return (
    <Pressable {...rest} ref={setRef} {...web}
      accessibilityRole="radio"
      accessibilityLabel={name}
      accessibilityHint={rest.accessibilityHint??description}
      accessibilityState={{...rest.accessibilityState,checked,disabled:off}}
      aria-checked={checked}
      disabled={off}
      // RN Web also presses on the Space/Enter keyup; onKeyDown owns the keyboard.
      onPress={event=>{if(Platform.OS==="web"&&isKeyboardPress(event))return;select();}}
      style={[{minHeight:44,minWidth:44,flexDirection:"row",alignItems:"flex-start"},style]}
      {...{className:joinClasses("flex-row items-start",
        styled&&"gap-3 py-2.5 rounded-control focus-visible:ring-2 focus-visible:ring-focus",
        off&&"opacity-50",className)}}>
      <View aria-hidden importantForAccessibility="no-hide-descendants"
        // 20pt ring centered on the label's 24pt first line.
        style={{width:RING,height:RING,marginTop:2,borderWidth:2,alignItems:"center",justifyContent:"center",flexShrink:0}}
        {...{className:joinClasses(styled&&"rounded-full bg-surface-raised",
          styled&&(checked?"border-primary":"border-text-muted"),indicatorClassName)}}>
        {checked ? (
          // A solid border, not a fill, so forced colors keeps the dot.
          <View style={{width:DOT,height:DOT,borderWidth:DOT/2}}
            {...{className:joinClasses(styled&&"rounded-full border-primary",dotClassName)}}/>
        ) : null}
      </View>
      {label||description ? (
        <View style={{flexShrink:1}} {...{className:joinClasses("min-w-0 flex-1",styled&&"gap-0.5")}}>
          {label ? <Text {...{className:joinClasses(styled&&"text-base leading-6 text-text",labelClassName)}}>{label}</Text> : null}
          {description ? <Text nativeID={descId}
            {...{className:joinClasses(styled&&"text-sm leading-5 text-text-muted",descriptionClassName)}}>{description}</Text> : null}
        </View>
      ) : null}
    </Pressable>
  );
}

/** Short name for {@linkcode RadioGroupItem}. */
export const Radio=RadioGroupItem;
