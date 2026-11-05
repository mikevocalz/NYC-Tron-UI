import { useRef, type ReactNode } from "react";
import { Text, View, type LayoutChangeEvent, type ViewProps } from "react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { joinClasses } from "../styles.ts";

export interface KeyValueItem {
  key:string;
  label:string;
  /** The rendered value. `null`/`undefined` draws `emptyLabel` in muted text. */
  value:ReactNode;
  /** A control beside the value (copy, reveal). */
  action?:ReactNode;
}

/** Props for {@linkcode KeyValueList}. Drop-in for Nitro Forge's `StudioKeyValueListProps`. */
export interface KeyValueListProps extends Omit<ViewProps,"children"> {
  items:readonly KeyValueItem[];
  /**
   * Upper bound. Two columns only when the list's own measured width is at
   * least `twoColumnMinWidth`; a narrow pane or fold segment always gets one.
   * @default 2
   */
  columns?:1|2;
  /** @default 600 */
  twoColumnMinWidth?:number;
  /** Shown for a missing value. @default "Not set" */
  emptyLabel?:string;
  /**
   * Accepted so Forge's `surface="night"` call sites compile unchanged. Colors
   * follow the nearest scheme scope (`NightScope`), not this prop.
   */
  surface?:"page"|"night";
  className?:string;
  labelClassName?:string;
  valueClassName?:string;
  unstyled?:boolean;
}

type Measured={width:number|null};

/**
 * Read-only record fields: label above value, in reading order. Measures its
 * own pane (onLayout), never the window, so a split view or a foldable
 * segment decides the column count.
 */
export function KeyValueList({
  items,columns=2,twoColumnMinWidth=600,emptyLabel="Not set",surface:_surface,
  className,labelClassName,valueClassName,unstyled=false,onLayout,...rest
}:KeyValueListProps) {
  const storeRef=useRef<StoreApi<Measured>|null>(null);
  if(!storeRef.current)storeRef.current=createStore<Measured>(()=>({width:null}));
  const store=storeRef.current;
  const width=useStore(store,s=>s.width);
  const twoUp=columns===2&&width!==null&&width>=twoColumnMinWidth;
  const styled=!unstyled;
  return (
    <View {...rest} role="list"
      onLayout={(event:LayoutChangeEvent)=>{store.setState({width:event.nativeEvent.layout.width});onLayout?.(event);}}
      {...{className:joinClasses("w-full flex-row flex-wrap",styled&&"gap-y-4",className)}}>
      {items.map(item=>{
        const missing=item.value===null||item.value===undefined;
        return (
          <View key={item.key} role="listitem"
            style={{width:twoUp?"50%":"100%",paddingEnd:twoUp?16:0}}
            {...{className:joinClasses(styled&&"gap-0.5")}}>
            <Text {...{className:joinClasses(styled&&"text-xs leading-4 text-text-muted",labelClassName)}}>{item.label}</Text>
            <View {...{className:"flex-row items-center gap-2"}}>
              <View {...{className:"min-w-0 shrink"}}>
                {missing
                  ? <Text {...{className:joinClasses(styled&&"text-sm leading-5 text-text-muted italic")}}>{emptyLabel}</Text>
                  : typeof item.value==="string"||typeof item.value==="number"
                    ? <Text selectable {...{className:joinClasses(styled&&"text-sm leading-5 text-text",valueClassName)}}>{item.value}</Text>
                    : item.value}
              </View>
              {item.action ? <View {...{className:"shrink-0"}}>{item.action}</View> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
