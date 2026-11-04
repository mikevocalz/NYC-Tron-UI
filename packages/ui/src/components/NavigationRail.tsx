import type { ReactNode } from "react";
import {
  Pressable,Text,View,
  type ViewProps
} from "react-native";
import { joinClasses } from "./styles";

export interface NavigationItem {
  readonly id:string;
  readonly label:string;
  readonly icon?:ReactNode;
  readonly disabled?:boolean;
}
export interface NavigationRailProps extends Omit<ViewProps,"children"> {
  items:readonly NavigationItem[];
  selectedId:string|null;
  onSelectionChange:(id:string)=>void;
  /** Collapses LABELS only, never primary actions or hit targets. */
  collapsed?:boolean;
  className?:string;
  itemClassName?:string;
  selectedItemClassName?:string;
  labelClassName?:string;
  /** Caller provides the actual OS-backed navigation policy. */
  edge:"left"|"right";
}
/** Shared semantic rail; never determines hardware identity from width. */
export function NavigationRail({
  items,selectedId,onSelectionChange,collapsed=false,edge,
  className,itemClassName,selectedItemClassName,labelClassName,style,...rest
}:NavigationRailProps) {
  return (
    <View
      {...rest}
      {...{className:joinClasses(
        "shrink-0 items-center gap-1 bg-surface-raised py-3",
        collapsed?"w-16":"w-52",edge==="right"?"border-l border-border":"border-r border-border",
        className
      )}}
      style={style}
      accessibilityRole="menu"
    >
      {items.map(item=> {
        const selected=item.id===selectedId;
        return <Pressable
          key={item.id}
          onPress={()=>onSelectionChange(item.id)}
          disabled={item.disabled}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          accessibilityState={{selected,disabled:!!item.disabled}}
          {...{className:joinClasses(
            "flex-row w-full min-h-11 items-center gap-2 rounded-control px-3",
            selected?"bg-primary":"bg-transparent",
            item.disabled&&"opacity-40",
            itemClassName,selected&&selectedItemClassName
          )}}
        >
          {item.icon ? <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            {item.icon}
          </View> : null}
          {!collapsed ?
            <Text numberOfLines={1}
              {...{className:joinClasses(
                "flex-1 text-sm",selected?"text-on-primary":"text-text",labelClassName
              )}}
            >{item.label}</Text> : null}
        </Pressable>;
      })}
    </View>
  );
}
export interface NavigationShellProps extends Omit<ViewProps,"children"> {
  children:ReactNode;
  rail:ReactNode;
  /** Physical placement; independent of text RTL. */
  edge:"left"|"right";
  className?:string;
  contentClassName?:string;
  isRTL?:boolean;
}
/**
 * The outer row is explicitly physically LTR to prevent RTL mirroring the
 * rail edge. The content restores its own semantic text/layout direction.
 */
export function NavigationShell({
 children,rail,edge,className,contentClassName,isRTL=false,style,...props
}:NavigationShellProps){
 return <View {...props}
  {...{className:joinClasses("flex-1",className)}}
  style={[{flexDirection:"row",direction:"ltr"},style]}>
    {edge==="left" ? rail : null}
    <View {...{className:joinClasses("flex-1",contentClassName)}}
      style={{direction:isRTL?"rtl":"ltr"}}>{children}</View>
    {edge==="right" ? rail : null}
  </View>;
}
