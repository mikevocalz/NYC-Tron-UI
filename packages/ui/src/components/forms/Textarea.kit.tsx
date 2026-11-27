/*
 * Behaviour adapted from NYC-MON packages/ui/Textarea.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): React Native TextInput for hosts
 * without Expo UI (QNX, Marathon) with Field wiring, auto-grow and counter.
 */
import { useState } from "react";
import { TextInput, View, useWindowDimensions, type TextInputContentSizeChangeEvent } from "react-native";
import { joinClasses } from "../styles.ts";
import { useField } from "./Field.tsx";
import { autoGrowHeight, fieldControlProps, rowsHeight } from "./field-model.ts";
import { TextareaCounter, useTextareaCounter } from "./Textarea.shared.tsx";
import { resolveTextareaConfig, type TextareaProps } from "./Textarea.types.ts";

export type { CounterState, TextareaProps } from "./Textarea.types.ts";

/**
 * Multi-line text input on a React Native `TextInput` (kit implementation
 * for hosts without Expo UI: QNX, Marathon). Inside a {@linkcode Field} it takes the Field's label,
 * description, error, required and disabled state; on its own, give it an
 * `accessibilityLabel`. Height is measured in rows and follows the system
 * font size; with `minRows`/`maxRows` it grows with its content.
 */
export function Textarea({
  rows,minRows,maxRows,maxLength,showCount=false,countThreshold,countLabel,
  invalid,disabled,editable,lineHeight=24,inset,colorScheme:_colorScheme,
  className,inputClassName,counterClassName,unstyled=false,
  value,defaultValue,onChangeText,onContentSizeChange,style,...props
}:TextareaProps) {
  const {bounds,threshold}=resolveTextareaConfig({rows,minRows,maxRows,maxLength,countThreshold});
  const styled=!unstyled;
  const metrics={lineHeight,fontScale:useWindowDimensions().fontScale||1,inset:inset??(styled?18:0)};
  const minHeight=rowsHeight(bounds.min,metrics);

  const field=useField();
  const off=!!disabled||!!field?.disabled||editable===false;
  const bad=invalid??field?.invalid??false;
  const counter=useTextareaCounter({showCount,maxLength,threshold,countLabel,value,defaultValue});

  // Measured text height; layout state, not app state.
  const [content,setContent]=useState(0);
  const grow=bounds.autoGrow?autoGrowHeight(content,bounds,metrics):undefined;

  const counterId=counter.count?counter.id:undefined;
  const wired=field?fieldControlProps({...field,disabled:off,invalid:bad},counterId):undefined;

  return (
    <View {...{className:joinClasses("w-full min-w-0",styled&&"gap-1",className)}}>
      <TextInput
        {...wired}
        {...(!field&&counterId?{"aria-describedby":counterId}:{})}
        {...(!field?{"aria-invalid":bad||undefined}:{})}
        {...props}
        multiline
        numberOfLines={bounds.min}
        textAlignVertical="top"
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        editable={!off}
        scrollEnabled={grow?grow.scroll:true}
        accessibilityState={{...wired?.accessibilityState,...props.accessibilityState,disabled:off}}
        onChangeText={text=>{counter.track(text);onChangeText?.(text);}}
        onContentSizeChange={(event:TextInputContentSizeChangeEvent)=>{
          if(bounds.autoGrow)setContent(event.nativeEvent.contentSize.height);
          onContentSizeChange?.(event);
        }}
        style={[{minHeight},grow?{height:grow.height}:undefined,style]}
        {...{className:joinClasses(
          "w-full",
          styled&&"rounded-control border bg-surface-sunken px-3 py-2 text-base text-text placeholder:text-text-muted",
          // One border color at a time; the focus ring still shows on an invalid field.
          styled&&(bad?"border-danger":"border-border focus:border-focus"),
          styled&&"focus:ring-2 focus:ring-focus motion-reduce:transition-none",
          styled&&off&&"opacity-50",
          inputClassName,
        )}}
      />
      {counter.count?<TextareaCounter id={counter.id} count={counter.count} near={counter.near}
        words={counter.words} styled={styled} className={counterClassName}/>:null}
    </View>
  );
}
