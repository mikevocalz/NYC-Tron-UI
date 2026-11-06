import type { ReactNode } from "react";
import { I18nManager, Platform, Text, View, type ViewProps } from "react-native";
import { joinClasses } from "./styles.ts";
import { arrowStep, domIsRTL, isModified, webKey } from "./forms/choice-keys.ts";

export interface ToolbarProps extends Omit<ViewProps,"children"|"role"> {
  title?:string;
  /** Leading control slot (back, menu, drag handle). */
  leading?:ReactNode;
  /** Trailing action controls, usually IconButtons. */
  actions?:ReactNode;
  /** `compact` is pane chrome; `default` is a screen-top bar. */
  density?:"default"|"compact";
  /** Names the action group for assistive tech; defaults to "<title> actions". */
  actionsLabel?:string;
  className?:string;
  titleClassName?:string;
  unstyled?:boolean;
}

const FOCUSABLE='button:not([disabled]),a[href],[role="button"]:not([aria-disabled="true"]),[tabindex="0"]';
/** Web arrow keys between the action controls; Tab still reaches every one. */
function moveFocus(event:unknown){
  const k=webKey(event);
  if(isModified(k))return;
  const root=k.currentTarget as {querySelectorAll?:(s:string)=>ArrayLike<{focus:()=>void}>;ownerDocument?:{activeElement:unknown}};
  const items=Array.from(root.querySelectorAll?.(FOCUSABLE)??[]);
  if(!items.length)return;
  const at=items.indexOf(root.ownerDocument?.activeElement as {focus:()=>void});
  let next:number|null=null;
  if(k.key==="Home")next=0;
  else if(k.key==="End")next=items.length-1;
  else{
    const step=arrowStep(k.key,"horizontal",domIsRTL(k.currentTarget)||I18nManager.isRTL);
    if(step!==null)next=at<0?0:(at+step+items.length)%items.length;
  }
  if(next===null)return;
  k.preventDefault();
  items[next]!.focus();
}

/**
 * Contextual top bar: optional leading control, a title announced as a
 * heading, and a trailing action group with toolbar semantics. Layout uses
 * logical order, so leading sits at the start edge in RTL. Minimum height is
 * 52pt compact / 56pt default so 44pt controls fit with breathing room.
 */
export function Toolbar({
  title,leading,actions,density="default",actionsLabel,className,titleClassName,unstyled=false,...rest
}:ToolbarProps){
  const styled=!unstyled,compact=density==="compact";
  return <View {...rest}
    {...{className:joinClasses("w-full min-w-0 flex-row items-center gap-2",
      compact?"min-h-13 px-2":"min-h-14 px-4",
      styled&&"border-b border-border bg-surface-raised",className)}}>
    {leading?<View {...{className:"shrink-0 flex-row items-center gap-1"}}>{leading}</View>:null}
    {title
      ?<Text accessibilityRole="header" numberOfLines={1}
        {...(Platform.OS==="web"?{"aria-level":compact?3:2}:{})}
        {...{className:joinClasses("min-w-0 flex-1",
          styled&&(compact?"text-sm font-semibold text-text":"text-lg font-semibold text-text"),titleClassName)}}>{title}</Text>
      :<View style={{flex:1}}/>}
    {actions
      ?<View role="toolbar" aria-label={actionsLabel??(title?title+" actions":"Actions")}
        {...({className:"shrink-0 flex-row items-center gap-1",...(Platform.OS==="web"?{onKeyDown:moveFocus}:{})} as object)}>{actions}</View>
      :null}
  </View>;
}
