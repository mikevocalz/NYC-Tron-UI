import { useRef, type ComponentRef, type ReactNode } from "react";
import { I18nManager, Platform, Pressable, Text, View, type ViewProps } from "react-native";
import { joinClasses } from "./styles.ts";
import { domIsRTL, isModified, nextChoiceIndex, rovingStop, webKey } from "./forms/choice-keys.ts";

/** Handed to an icon render function so the glyph can follow the active state. */
export interface TabIconState { readonly active:boolean }
export interface TabBarTab {
  key:string;
  label:string;
  /** A node, or a function of the active state. */
  icon?:ReactNode|((state:TabIconState)=>ReactNode);
  active?:boolean;
  disabled?:boolean;
  onPress?:()=>void;
  /** Link destination in `semantics="navigation"`; rendered as an anchor on web. */
  href?:string;
}
export interface TabBarProps extends Omit<ViewProps,"children"|"role"> {
  tabs:readonly TabBarTab[];
  /**
   * `tabs` (default): a tablist that switches a panel, `aria-selected` on the
   * active tab. `navigation`: route links with `aria-current="page"` and no
   * tab roles, because going to a section is not switching a tab panel.
   */
  semantics?:"tabs"|"navigation";
  /** `navigation`: phone bottom bar, icon over label. `compact`: pane tabs, icon beside label. */
  density?:"navigation"|"compact";
  "aria-label"?:string;
  className?:string;
  tabClassName?:string;
  labelClassName?:string;
  unstyled?:boolean;
}
const renderIcon=(icon:TabBarTab["icon"],state:TabIconState)=>typeof icon==="function"?icon(state):icon;

/**
 * Presentational tab bar: the router or pane owner holds the active tab and
 * passes it in. In `tabs` mode on web the active tab is the only Tab stop and
 * arrows (flipped in RTL) move and activate, Home/End jump. Every tab is at
 * least 44pt in both dimensions.
 */
export function TabBar({
  tabs,semantics="tabs",density="navigation","aria-label":ariaLabel="Navigation",
  className,tabClassName,labelClassName,unstyled=false,...rest
}:TabBarProps){
  const styled=!unstyled,nav=semantics==="navigation",compact=density==="compact";
  const refs=useRef<(ComponentRef<typeof Pressable>|null)[]>([]);
  const off=tabs.map(t=>!!t.disabled);
  const activeIndex=tabs.findIndex(t=>t.active);
  const stop=rovingStop(activeIndex,off);
  const onKeyDown=(i:number)=>(event:unknown)=>{
    const k=webKey(event);
    if(isModified(k))return;
    const next=nextChoiceIndex(i,k.key,off,{axis:"horizontal",rtl:domIsRTL(k.currentTarget)||I18nManager.isRTL});
    if(next===null)return;
    k.preventDefault();
    (refs.current[next] as unknown as {focus?:()=>void}|null)?.focus?.();
    tabs[next]?.onPress?.();
  };
  return <View {...rest} role={nav?"navigation":"tablist"} aria-label={ariaLabel}
    {...{className:joinClasses("w-full min-w-0 flex-row items-stretch",
      styled&&(compact?"gap-0.5":"border-t border-border bg-surface-raised px-1 py-1"),className)}}>
    {tabs.map((tab,i)=>{
      const active=!!tab.active;
      const web=Platform.OS==="web";
      const linkProps=nav&&tab.href&&web?{href:tab.href}:{};
      return <Pressable key={tab.key} ref={node=>{refs.current[i]=node;}}
        role={nav?"link":"tab"}
        aria-label={tab.label}
        aria-selected={nav?undefined:active}
        aria-disabled={tab.disabled||undefined}
        disabled={tab.disabled}
        accessibilityState={nav?{disabled:!!tab.disabled}:{selected:active,disabled:!!tab.disabled}}
        onPress={tab.onPress}
        {...linkProps}
        {...(web?{
          "aria-current":nav&&active?"page":undefined,
          ...(nav?{}:{onKeyDown:onKeyDown(i),tabIndex:i===stop?0:-1}),
        }:{})}
        {...{className:joinClasses("min-h-11 min-w-11 items-center justify-center",
          compact?"min-w-0 shrink flex-row gap-1.5 px-2":"flex-1 gap-1 px-1 py-1.5 min-h-14",
          styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none",
          styled&&(active?"bg-primary forced-colors:border-2 forced-colors:border-[Highlight]":"bg-transparent hover:bg-surface-sunken"),
          tab.disabled&&"opacity-50",tabClassName)}}>
        {tab.icon?<View aria-hidden {...{className:"items-center justify-center"}}>{renderIcon(tab.icon,{active})}</View>:null}
        <Text numberOfLines={1} {...{className:joinClasses(styled&&"text-sm font-medium",
          compact&&"min-w-0 shrink",
          styled&&(active?"text-on-primary":"text-text-muted"),labelClassName)}}>{tab.label}</Text>
      </Pressable>;
    })}
  </View>;
}
