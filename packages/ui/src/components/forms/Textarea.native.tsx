// Behaviour adapted from NYC-MON packages/ui/Textarea.tsx (MIT).
import { useEffect, useImperativeHandle, useRef, type ComponentRef } from "react";
import { Platform, View, type TextInput } from "react-native";
import { Host } from "@expo/ui";
import { TextField as SwiftUITextField, useNativeState, type TextFieldRef as SwiftUITextFieldRef } from "@expo/ui/swift-ui";
import {
  accessibilityHint as swiftUIHint, accessibilityLabel as swiftUILabel, disabled as swiftUIDisabled,
  lineLimit, textFieldStyle,
} from "@expo/ui/swift-ui/modifiers";
import {
  OutlinedTextField as ComposeTextField, Text as ComposeText, type TextFieldRef as ComposeTextFieldRef,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth, semantics, testID as composeTestID } from "@expo/ui/jetpack-compose/modifiers";
import { joinClasses } from "../styles.ts";
import { useField } from "./Field.tsx";
import { fieldHint, fieldLabelText } from "./field-model.ts";
import { TextareaCounter, useTextareaCounter } from "./Textarea.shared.tsx";
import { resolveTextareaConfig, type TextareaProps } from "./Textarea.types.ts";

export type { CounterState, TextareaProps } from "./Textarea.types.ts";

function joinSentences(...parts:Array<string|undefined>):string|undefined {
  const kept=parts.map(p=>p?.trim()).filter((p):p is string=>!!p);
  return kept.length?kept.join(" "):undefined;
}

/**
 * Multi-line text input on the OS field (native fork, `@expo/ui`): SwiftUI
 * `TextField` with a vertical axis on iOS, Material 3 `OutlinedTextField`
 * on Android. Inside a {@linkcode Field} it takes the Field's label,
 * description, error, required and disabled state; the Field's kit label and
 * messages sit around the native field. Rows map to SwiftUI `lineLimit`
 * and Compose `minLines`/`maxLines`, so height follows the system font size.
 *
 * iOS has no native error state: the error reaches VoiceOver through the
 * hint and the Field's visible message. Android sets Material's `isError`.
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

  // The native field owns its text in an observable state; a controlled
  // `value` is pushed in only when it differs from what the field last sent.
  const text=useNativeState(value??defaultValue??"");
  const sent=useRef(value??defaultValue??"");
  useEffect(()=>{
    if(value!==undefined&&value!==sent.current){sent.current=value;text.set(value);}
  },[value,text]);
  const onText=(next:string)=>{sent.current=next;counter.track(next);onChangeText?.(next);};

  const swift=useRef<SwiftUITextFieldRef>(null);
  const compose=useRef<ComposeTextFieldRef>(null);
  const focused=useRef(false);
  useImperativeHandle(ref,()=>{
    const native=Platform.OS==="android"?compose:swift;
    return {
      focus:()=>{void native.current?.focus();},
      blur:()=>{void native.current?.blur();},
      clear:()=>{void native.current?.clear();},
      isFocused:()=>focused.current,
    } as unknown as ComponentRef<typeof TextInput>;
  },[]);
  const onFocusChange=(isFocused:boolean)=>{
    focused.current=isFocused;
    // RN focus events carry a native event; the OS fields do not, so none is passed.
    if(isFocused)(onFocus as (()=>void)|undefined)?.();
    else (onBlur as (()=>void)|undefined)?.();
  };

  const label=field?.label?fieldLabelText(field.label,field.required,field.requiredText):accessibilityLabel;
  const hint=joinSentences(
    field?fieldHint({description:field.description,error:field.error,errorPrefix:field.errorPrefix}):accessibilityHint,
    bad&&!field?.error?"Invalid entry.":undefined,
    counter.count?counter.words+".":undefined,
  );

  const native=Platform.OS==="android"
    ? <ComposeTextField ref={compose} value={text} onValueChange={onText} onFocusChanged={onFocusChange}
        enabled={!off} isError={bad} singleLine={false} minLines={bounds.min} maxLines={bounds.max}
        maxLength={maxLength} autoFocus={autoFocus}
        modifiers={[
          fillMaxWidth(),
          ...(label||hint?[semantics({contentDescription:joinSentences(label?label+".":undefined,hint)})]:[]),
          ...(testID?[composeTestID(testID)]:[]),
        ]}>
        {placeholder?<ComposeTextField.Placeholder><ComposeText>{placeholder}</ComposeText></ComposeTextField.Placeholder>:null}
      </ComposeTextField>
    : <SwiftUITextField ref={swift} text={text} onTextChange={onText} onFocusChange={onFocusChange}
        axis="vertical" placeholder={placeholder} maxLength={maxLength} autoFocus={autoFocus} testID={testID}
        modifiers={[
          textFieldStyle(styled?"roundedBorder":"automatic"),
          bounds.autoGrow?lineLimit({min:bounds.min,max:bounds.max}):lineLimit(bounds.min,{reservesSpace:true}),
          ...(label?[swiftUILabel(label)]:[]),
          ...(hint?[swiftUIHint(hint)]:[]),
          ...(off?[swiftUIDisabled(true)]:[]),
        ]}/>;

  return (
    <View {...{className:joinClasses("w-full min-w-0",styled&&"gap-1",className)}}>
      <Host matchContents={{vertical:true}} colorScheme={colorScheme} style={{width:"100%"}}>{native}</Host>
      {counter.count?<TextareaCounter id={counter.id} count={counter.count} near={counter.near}
        words={counter.words} styled={styled} className={counterClassName}/>:null}
    </View>
  );
}
