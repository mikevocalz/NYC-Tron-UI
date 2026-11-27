/*
 * Behaviour adapted from NYC-MON packages/ui/cards/NeonCheckbox.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): plain token-styled checkbox for hosts
 * without Expo UI (QNX, Marathon) and the web/iOS indeterminate fallback;
 * NYC-MON neon styling removed.
 */
import { useId } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { joinClasses } from "../styles.ts";
import { isModified, webKey } from "./choice-keys.ts";
import {
  a11yChecked, isKeyboardPress, keyRepeat, nextCheckedState, requireName, toggleKeyAction,
} from "./toggle-model.ts";
import type { CheckboxProps } from "./Checkbox.types.ts";

export type { CheckboxProps, CheckedState } from "./Checkbox.types.ts";


const BOX=20;

/**
 * A checkbox drawn with views (no icon font): a box with a check or a dash.
 * The whole row is one 44pt target with the `checkbox` role and checked
 * true, false or mixed. On web Space toggles; Enter is left to the form.
 *
 * Kit implementation for hosts without Expo UI (QNX, Marathon), and the
 * fallback `Checkbox.tsx` (web) and `Checkbox.native.tsx` (iOS) render for
 * the indeterminate state, which the universal Checkbox cannot show.
 */
export function Checkbox({
  ref,checked,onCheckedChange,label,description,error,disabled=false,colorScheme:_colorScheme,color:_color,style,
  className,rowClassName,boxClassName,markClassName,labelClassName,descriptionClassName,errorClassName,
  unstyled=false,...rest
}:CheckboxProps){
  const name=requireName("Checkbox",label,rest.accessibilityLabel);
  const styled=!unstyled;
  const id=useId();
  const descId=description?id+"-desc":undefined,errId=error?id+"-err":undefined;
  const on=checked!==false;
  const toggle=()=>{if(!disabled)onCheckedChange(nextCheckedState(checked));};
  const onKeyDown=(event:unknown)=>{
    const k=webKey(event);
    if(isModified(k))return;
    const act=toggleKeyAction(k.key,"checkbox",keyRepeat(event));
    if(!act)return;
    k.preventDefault();
    if(act==="activate")toggle();
  };
  const hint=[description,error].filter(Boolean).join(". ")||undefined;
  const web=Platform.OS==="web"?{onKeyDown,
    "aria-describedby":[descId,errId].filter(Boolean).join(" ")||undefined,
    "aria-invalid":error?true:undefined}:{};
  const mark=markClassName??(styled?"border-on-primary":undefined);
  return (
    <View style={style} {...{className:joinClasses(styled&&"gap-1",className)}}>
      <Pressable {...rest} ref={ref} {...web}
        accessibilityRole="checkbox"
        accessibilityLabel={name}
        accessibilityHint={rest.accessibilityHint??hint}
        accessibilityState={{...rest.accessibilityState,checked:a11yChecked(checked),disabled}}
        aria-checked={a11yChecked(checked)}
        disabled={disabled}
        // RN Web also presses on the Space/Enter keyup; onKeyDown owns the keyboard.
        onPress={event=>{if(Platform.OS==="web"&&isKeyboardPress(event))return;toggle();}}
        style={{minHeight:44,minWidth:44,flexDirection:"row",alignItems:"flex-start"}}
        {...{className:joinClasses("flex-row items-start",
          styled&&"gap-3 py-2.5 rounded-control focus-visible:ring-2 focus-visible:ring-focus",
          disabled&&"opacity-50",rowClassName)}}>
        <View aria-hidden importantForAccessibility="no-hide-descendants"
          // 20pt box centered on the label's 24pt first line.
          style={{width:BOX,height:BOX,marginTop:2,borderWidth:2,alignItems:"center",justifyContent:"center",flexShrink:0}}
          {...{className:joinClasses(styled&&"rounded",
            styled&&(on?"bg-primary":"bg-surface-raised"),
            styled&&(error?"border-danger":on?"border-primary":"border-text-muted"),
            boxClassName)}}>
          {checked===true ? (
            // Two borders of a rotated box make the check; forced colors keeps borders.
            <View style={{width:10,height:6,marginTop:-2,borderLeftWidth:2,borderBottomWidth:2,transform:[{rotate:"-45deg"}]}}
              {...{className:mark}}/>
          ) : checked==="indeterminate" ? (
            <View style={{width:10,height:0,borderTopWidth:2}} {...{className:mark}}/>
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
      {error ? (
        <Text nativeID={errId} accessibilityLiveRegion="polite"
          {...{className:joinClasses(styled&&"ps-8 text-sm leading-5 text-danger",errorClassName)}}>{error}</Text>
      ) : null}
    </View>
  );
}
