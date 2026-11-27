/*
 * Behaviour adapted from NYC-MON packages/ui/Textarea.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): universal TextInput on web with Field
 * ARIA written onto the textarea, auto-grow and counter.
 */
import { useImperativeHandle, useLayoutEffect, useReducer, useRef, useState, type ComponentRef } from "react";
import { Platform, View, useWindowDimensions, type TextInput, type ViewStyle } from "react-native";
import { Host, TextInput as UniversalTextInput, useNativeState, type TextInputRef } from "@expo/ui";
import { joinClasses } from "../styles.ts";
import { ariaValue, expoUiWebHostStyle } from "../expo-ui-web-model.ts";
import { useWebAriaPatch } from "../useWebAriaPatch.ts";
import { useField } from "./Field.tsx";
import { autoGrowHeight, controlledTextPush, fieldControlProps } from "./field-model.ts";
import { TextareaCounter, useTextareaCounter } from "./Textarea.shared.tsx";
import { resolveTextareaConfig, type TextareaProps } from "./Textarea.types.ts";

export type { CounterState, TextareaProps } from "./Textarea.types.ts";

/** Block-axis padding plus border of @expo/ui's universal web field (11pt + 1pt, both edges). */
const UNIVERSAL_WEB_INSET=24;

/**
 * Multi-line text input on @expo/ui's universal `TextInput` (`multiline`).
 * This file serves web and the default export condition; iOS and Android
 * load `Textarea.native.tsx`, hosts without Expo UI load `Textarea.kit.tsx`.
 *
 * On web the universal field is a React Native Web `<textarea>` with
 * @expo/ui's own border and focus ring, colored through the Host style that
 * maps `--expo-ui-*` onto the app's tokens. The universal component takes
 * only an `accessibilityLabel`, so the Field wiring is written onto the
 * `<textarea>`: `id`, `aria-labelledby`, `aria-describedby` (description,
 * error and counter), `aria-required`, `aria-invalid` and `aria-disabled`.
 * Inside a {@linkcode Field} it takes the Field's label, description, error,
 * required and disabled state; on its own, give it an `accessibilityLabel`.
 *
 * Fixed `rows` set the `<textarea>` rows. With `minRows`/`maxRows` the
 * height follows the measured content between those bounds and the system
 * font size. Invalid fields get a `danger` border. `inputClassName` is not
 * applied here (the universal field takes no class); style it through the
 * theme variables.
 */
export function Textarea({
  rows,minRows,maxRows,maxLength,showCount=false,countThreshold,countLabel,
  invalid,disabled,editable,lineHeight=24,inset,colorScheme,className,counterClassName,unstyled=false,
  value,defaultValue,onChangeText,onFocus,onBlur,placeholder,autoFocus,autoCapitalize,autoCorrect,keyboardType,
  selectTextOnFocus,placeholderTextColor,selectionColor,cursorColor,testID,accessibilityLabel,ref,
}:TextareaProps) {
  const {bounds,threshold}=resolveTextareaConfig({rows,minRows,maxRows,maxLength,countThreshold});
  const styled=!unstyled;
  const metrics={lineHeight,fontScale:useWindowDimensions().fontScale||1,inset:inset??UNIVERSAL_WEB_INSET};

  const field=useField();
  const off=!!disabled||!!field?.disabled||editable===false;
  const bad=invalid??field?.invalid??false;
  const counter=useTextareaCounter({showCount,maxLength,threshold,countLabel,value,defaultValue});
  const counterId=counter.count?counter.id:undefined;
  const wired=field?fieldControlProps({...field,disabled:off,invalid:bad},counterId):undefined;

  const host=useRef<ComponentRef<typeof View>>(null);
  useWebAriaPatch(host,"textarea",{
    id:wired?.nativeID,
    "aria-labelledby":wired?.["aria-labelledby"],
    "aria-describedby":ariaValue(wired?wired["aria-describedby"]:counterId),
    "aria-required":ariaValue(wired?.["aria-required"]),
    "aria-invalid":ariaValue(bad),
    "aria-disabled":ariaValue(off),
  });

  // The field owns its text in an observable state. After every render the
  // controlled `value` is pushed in when it differs from what the field last
  // sent, which also undoes an edit the parent rejected; a controlled edit
  // forces that render even when the parent does not re-render.
  const text=useNativeState(value??defaultValue??"");
  const sent=useRef(value??defaultValue??"");
  const [,recheck]=useReducer((n:number)=>n+1,0);
  useLayoutEffect(()=>{
    const step=controlledTextPush(value,sent.current,text.get());
    sent.current=step.sent;
    if(step.push!==undefined)text.set(step.push);
  });
  const onText=(next:string)=>{sent.current=next;counter.track(next);onChangeText?.(next);if(value!==undefined)recheck();};

  const universal=useRef<TextInputRef>(null);
  useImperativeHandle(ref,()=>({
    focus:()=>{universal.current?.focus();},
    blur:()=>{universal.current?.blur();},
    clear:()=>{universal.current?.clear();},
    isFocused:()=>universal.current?.isFocused()??false,
  }) as unknown as ComponentRef<typeof TextInput>,[]);

  // Measured field height; layout state, not app state.
  const [content,setContent]=useState(0);
  const grow=bounds.autoGrow?autoGrowHeight(content,bounds,metrics):undefined;

  return (
    <View {...{className:joinClasses("w-full min-w-0",styled&&"gap-1",className)}}>
      <View ref={host} style={{width:"100%"}}>
        <Host colorScheme={colorScheme} matchContents={{vertical:true}} ignoreSafeArea="all"
          style={Platform.OS==="web"?{width:"100%",...expoUiWebHostStyle()} as ViewStyle:{width:"100%"}}>
          <UniversalTextInput ref={universal} value={text} onChangeText={onText} multiline
            numberOfLines={bounds.min} maxLength={maxLength} editable={!off}
            accessibilityLabel={wired?.accessibilityLabel??accessibilityLabel}
            placeholder={placeholder} autoFocus={autoFocus} autoCapitalize={autoCapitalize} autoCorrect={autoCorrect}
            keyboardType={keyboardType} selectTextOnFocus={selectTextOnFocus} placeholderTextColor={placeholderTextColor}
            selectionColor={selectionColor} cursorColor={cursorColor} testID={testID}
            onFocus={()=>onFocus?.()} onBlur={()=>onBlur?.()}
            onContentSizeChange={bounds.autoGrow?size=>setContent(size.height):undefined}
            textStyle={{fontSize:16,lineHeight}}
            style={{
              width:"100%",
              ...(grow?{height:grow.height}:{}),
              ...(bad?{borderColor:"var(--color-danger)"}:{}),
              ...(off?{opacity:0.5}:{}),
            }}/>
        </Host>
      </View>
      {counter.count?<TextareaCounter id={counter.id} count={counter.count} near={counter.near}
        words={counter.words} styled={styled} className={counterClassName}/>:null}
    </View>
  );
}
