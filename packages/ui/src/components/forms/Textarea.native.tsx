/*
 * Behaviour adapted from NYC-MON packages/ui/Textarea.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): universal TextInput on iOS, Compose
 * OutlinedTextField on Android, Field wiring through accessibility label and
 * hint.
 */
import { useImperativeHandle, useLayoutEffect, useReducer, useRef, type ComponentRef } from "react";
import { Platform, View, type TextInput } from "react-native";
import { Host, TextInput as UniversalTextInput, useNativeState, type TextInputRef } from "@expo/ui";
import { accessibilityHint as swiftUIHint, lineLimit, textFieldStyle } from "@expo/ui/swift-ui/modifiers";
import {
  OutlinedTextField as ComposeTextField, Text as ComposeText, type TextFieldRef as ComposeTextFieldRef,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth, semantics, testID as composeTestID } from "@expo/ui/jetpack-compose/modifiers";
import { joinClasses } from "../styles.ts";
import { useField } from "./Field.tsx";
import { controlledTextPush, fieldHint, fieldLabelText } from "./field-model.ts";
import { TextareaCounter, useTextareaCounter } from "./Textarea.shared.tsx";
import { resolveTextareaConfig, type TextareaProps } from "./Textarea.types.ts";

export type { CounterState, TextareaProps } from "./Textarea.types.ts";

/**
 * On iOS and Android @expo/ui's universal `useNativeState` is the same
 * function as the Compose one (`@expo/ui/jetpack-compose` re-exports it);
 * only its declared type comes from the web build, so the Compose field
 * takes it through this type.
 */
type ComposeTextFieldState=Parameters<typeof ComposeTextField>[0]["value"];

function joinSentences(...parts:Array<string|undefined>):string|undefined {
  const kept=parts.map(p=>p?.trim()).filter((p):p is string=>!!p);
  return kept.length?kept.join(" "):undefined;
}

/**
 * Multi-line text input on the OS field. Inside a {@linkcode Field} it takes
 * the Field's label, description, error, required and disabled state; the
 * Field's kit label and messages sit around the native field.
 *
 * iOS: @expo/ui's universal `TextInput` with `multiline`, which renders a
 * SwiftUI `TextField` on the vertical axis. Fixed `rows` go through the
 * universal `numberOfLines`; auto-grow adds `lineLimit(min...max)`, which
 * the universal props cannot express. The hint (error, description, counter)
 * is a SwiftUI `accessibilityHint` modifier. iOS has no native error state:
 * the error reaches VoiceOver through that hint and the Field's message.
 *
 * Android: Material 3 `OutlinedTextField` from `@expo/ui/jetpack-compose`,
 * not the universal `TextInput`. The universal Android field is an
 * undecorated `BasicTextField` with equal min and max lines and no error
 * state; the outlined field draws the outline, sets `isError` and takes
 * separate `minLines`/`maxLines`.
 *
 * Rows follow the system font size on both. This fork exists because those
 * modifiers and Compose views load native modules, so the web file
 * (`Textarea.tsx`) cannot import them.
 */
export function Textarea({
  rows,minRows,maxRows,maxLength,showCount=false,countThreshold,countLabel,
  invalid,disabled,editable,colorScheme,className,counterClassName,unstyled=false,
  value,defaultValue,onChangeText,onFocus,onBlur,placeholder,autoFocus,testID,
  accessibilityLabel,accessibilityHint,ref,
}:TextareaProps) {
  const {bounds,threshold}=resolveTextareaConfig({rows,minRows,maxRows,maxLength,countThreshold});
  const styled=!unstyled;
  const field=useField();
  const off=!!disabled||!!field?.disabled||editable===false;
  const bad=invalid??field?.invalid??false;
  const counter=useTextareaCounter({showCount,maxLength,threshold,countLabel,value,defaultValue});

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
  const compose=useRef<ComposeTextFieldRef>(null);
  const focused=useRef(false);
  useImperativeHandle(ref,()=>{
    return {
      focus:()=>{void (Platform.OS==="android"?compose.current:universal.current)?.focus();},
      blur:()=>{void (Platform.OS==="android"?compose.current:universal.current)?.blur();},
      clear:()=>{void (Platform.OS==="android"?compose.current:universal.current)?.clear();},
      isFocused:()=>focused.current,
    } as unknown as ComponentRef<typeof TextInput>;
  },[]);
  const onFocusChange=(isFocused:boolean)=>{
    focused.current=isFocused;
    // RN focus events carry a native event; the OS fields do not, so none is
    // passed (TextareaProps types the event as optional).
    if(isFocused)onFocus?.();
    else onBlur?.();
  };

  const label=field?.label?fieldLabelText(field.label,field.required,field.requiredText):accessibilityLabel;
  const hint=joinSentences(
    field?fieldHint({description:field.description,error:field.error,errorPrefix:field.errorPrefix}):accessibilityHint,
    bad&&!field?.error?"Invalid entry.":undefined,
    counter.count?counter.words+".":undefined,
  );

  const native=Platform.OS==="android"
    ? <ComposeTextField ref={compose} value={text as unknown as ComposeTextFieldState} onValueChange={onText} onFocusChanged={onFocusChange}
        enabled={!off} isError={bad} singleLine={false} minLines={bounds.min} maxLines={bounds.max}
        maxLength={maxLength} autoFocus={autoFocus}
        modifiers={[
          fillMaxWidth(),
          ...(label||hint?[semantics({contentDescription:joinSentences(label?label+".":undefined,hint)})]:[]),
          ...(testID?[composeTestID(testID)]:[]),
        ]}>
        {placeholder?<ComposeTextField.Placeholder><ComposeText>{placeholder}</ComposeText></ComposeTextField.Placeholder>:null}
      </ComposeTextField>
    : <UniversalTextInput ref={universal} value={text} onChangeText={onText} multiline
        numberOfLines={bounds.autoGrow?undefined:bounds.min} maxLength={maxLength} editable={!off}
        accessibilityLabel={label} placeholder={placeholder} autoFocus={autoFocus} testID={testID}
        onFocus={()=>onFocusChange(true)} onBlur={()=>onFocusChange(false)}
        modifiers={[
          textFieldStyle(styled?"roundedBorder":"automatic"),
          ...(bounds.autoGrow?[lineLimit({min:bounds.min,max:bounds.max})]:[]),
          ...(hint?[swiftUIHint(hint)]:[]),
        ]}/>;

  return (
    <View {...{className:joinClasses("w-full min-w-0",styled&&"gap-1",className)}}>
      <Host matchContents={{vertical:true}} colorScheme={colorScheme} style={{width:"100%"}}>{native}</Host>
      {counter.count?<TextareaCounter id={counter.id} count={counter.count} near={counter.near}
        words={counter.words} styled={styled} className={counterClassName}/>:null}
    </View>
  );
}
