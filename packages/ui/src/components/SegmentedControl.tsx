import { useRef, type ComponentRef } from "react";
import { I18nManager, Platform, Pressable, Text, View, type ViewProps } from "react-native";
import { joinClasses } from "./styles.ts";
import { domIsRTL, isModified, nextChoiceIndex, rovingStop, webKey } from "./forms/choice-keys.ts";

export interface SegmentedOption<T extends string=string> {
  readonly value:T;
  readonly label:string;
  readonly disabled?:boolean;
}
export interface SegmentedControlProps<T extends string=string> extends Omit<ViewProps,"children"|"role"> {
  options:readonly SegmentedOption<T>[];
  /** A value matching no option leaves every segment unchecked. */
  value:T|"";
  onChange:(value:T)=>void;
  /** Name of the radio group. Give this or `aria-labelledby`. */
  "aria-label"?:string;
  "aria-labelledby"?:string;
  disabled?:boolean;
  className?:string;
  /** Classes for every segment, e.g. a flex-basis that wraps four into a 2x2 grid. */
  segmentClassName?:string;
  labelClassName?:string;
  /** No default visual classes: the app supplies the full recipe. */
  unstyled?:boolean;
}

/**
 * Exclusive choice among a few options, as a WAI-ARIA radio group. On web the
 * checked segment is the only Tab stop; arrows (flipped in RTL) move and
 * select with wrapping, Home/End jump, disabled segments are skipped. Native
 * screen readers reach every segment. Segments are at least 44pt tall and the
 * well wraps onto extra rows instead of overflowing a narrow pane.
 */
export function SegmentedControl<T extends string=string>({
  options,value,onChange,disabled=false,className,segmentClassName,labelClassName,unstyled=false,
  "aria-label":ariaLabel,"aria-labelledby":ariaLabelledBy,...rest
}:SegmentedControlProps<T>){
  const styled=!unstyled;
  const refs=useRef<(ComponentRef<typeof Pressable>|null)[]>([]);
  const off=options.map(o=>disabled||!!o.disabled);
  const checked=options.findIndex(o=>o.value===value);
  const stop=rovingStop(checked,off);
  const select=(i:number)=>{
    const option=options[i];
    if(!option||off[i]||option.value===value)return;
    onChange(option.value);
  };
  const onKeyDown=(i:number)=>(event:unknown)=>{
    const k=webKey(event);
    if(isModified(k))return;
    const rtl=domIsRTL(k.currentTarget)||I18nManager.isRTL;
    const next=nextChoiceIndex(i,k.key,off,{axis:"both",rtl});
    if(next===null)return;
    k.preventDefault();
    (refs.current[next] as unknown as {focus?:()=>void}|null)?.focus?.();
    select(next);
  };
  return <View {...rest} role="radiogroup" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}
    aria-disabled={disabled||undefined}
    {...{className:joinClasses("max-w-full flex-row flex-wrap",
      styled&&"gap-0.5 self-start rounded-control border border-border bg-surface-sunken p-0.5",className)}}>
    {options.map((option,i)=>{
      const active=i===checked;
      return <Pressable key={option.value} ref={node=>{refs.current[i]=node;}}
        role="radio" aria-checked={active} disabled={off[i]}
        accessibilityState={{checked:active,disabled:off[i]}}
        onPress={()=>select(i)}
        {...(Platform.OS==="web"?{onKeyDown:onKeyDown(i),tabIndex:i===stop?0:-1}:{})}
        {...{className:joinClasses("min-h-11 grow items-center justify-center",
          styled&&"rounded-control px-3 py-1.5 focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none",
          styled&&(active?"bg-primary forced-colors:border-2 forced-colors:border-[Highlight]":"bg-transparent hover:bg-surface-raised"),
          off[i]&&"opacity-50",segmentClassName)}}>
        <Text numberOfLines={1} {...{className:joinClasses(styled&&"text-sm font-medium",
          styled&&(active?"text-on-primary":"text-text"),labelClassName)}}>{option.label}</Text>
      </Pressable>;
    })}
  </View>;
}
