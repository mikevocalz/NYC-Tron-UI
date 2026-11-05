import { useId, useRef } from "react";
import { Platform, Pressable, ScrollView, Text, View, type ViewProps } from "react-native";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import { joinClasses } from "./styles.ts";
import { isModified, nextChoiceIndex, typeaheadIndex, webKey } from "./forms/choice-keys.ts";
import { flattenOptionGroups, validateOptionGroups, type OptionGroup } from "./forms/option-groups.ts";

export interface SelectOption {
  readonly value:string;
  /** Shown text; the value is shown when omitted. */
  readonly label?:string;
  readonly disabled?:boolean;
}
/** Options under a heading in a {@linkcode Select} list. @see {@linkcode SelectGroupsChoice.groups} */
export type SelectGroup=OptionGroup<SelectOption>;
/** A flat list of choices. */
export interface SelectOptionsChoice {
  options:readonly SelectOption[];
  groups?:undefined;
}
/** Choices under headings; the list shows each heading above its options. */
export interface SelectGroupsChoice {
  /** Headed groups in display order. Keyboard order runs through every group's options in turn. */
  groups:readonly SelectGroup[];
  options?:undefined;
}
/** Props shared by both choice shapes of {@linkcode Select}. */
export interface SelectBaseProps extends Omit<ViewProps,"children"|"role"> {
  /** Visible caption and the accessible name of the field. */
  label:string;
  value:string;
  onValueChange:(value:string)=>void;
  disabled?:boolean;
  /** Text shown when `value` matches no option. */
  placeholder?:string;
  hint?:string;
  errorText?:string;
  className?:string;
  triggerClassName?:string;
  unstyled?:boolean;
}
/** {@linkcode Select} props: either flat `options` or headed `groups`, never both. */
export type SelectProps=SelectBaseProps&(SelectOptionsChoice|SelectGroupsChoice);
/** Every option a {@linkcode Select} offers, in keyboard order, whichever choice shape it was given. */
export function selectOptions(props:SelectOptionsChoice|SelectGroupsChoice):readonly SelectOption[]{
  if(props.groups!==undefined){
    if(props.options!==undefined)throw new TypeError("Select takes `options` or `groups`, not both");
    validateOptionGroups(props.groups);
    return flattenOptionGroups(props.groups);
  }
  return props.options;
}
type OpenState={open:boolean;active:number};
const optionLabel=(o:SelectOption)=>o.label??o.value;

/**
 * Single choice from a list, drawn from theme tokens on every platform.
 *
 * Web: a select-only combobox (WAI-ARIA APG). Focus stays on the trigger and
 * the highlighted option is announced through aria-activedescendant.
 * ArrowDown/ArrowUp/Enter/Space open; in the list arrows move, Home/End jump,
 * a letter jumps to the next option starting with it, Enter/Space pick,
 * Escape closes, Tab closes without picking.
 *
 * Native: the list opens in flow under the trigger, so a parent can never
 * clip it; long lists scroll inside a 320pt cap. Hosts on Expo 58 that want
 * the platform SwiftUI/Compose picker use `@nyc-tron/expo-controls/Select`,
 * which takes these same props.
 */
export function Select(props:SelectProps){
  const {
    label,value,onValueChange,disabled=false,placeholder="Choose…",hint,errorText,
    className,triggerClassName,unstyled=false,testID,options:_options,groups,...rest
  }=props;
  const options=selectOptions(props);
  const styled=!unstyled,web=Platform.OS==="web";
  const id=useId().replace(/:/g,"");
  const local=useRef<StoreApi<OpenState>|null>(null);
  if(!local.current)local.current=createStore<OpenState>(()=>({open:false,active:-1}));
  const store=local.current;
  const open=useStore(store,s=>s.open);
  const active=useStore(store,s=>s.active);
  const off=options.map(o=>!!o.disabled);
  const selectedIndex=options.findIndex(o=>o.value===value);
  const selected=options[selectedIndex];
  const firstEnabled=off.findIndex(x=>!x);
  const show=()=>{if(!disabled)store.setState({open:true,active:selectedIndex>=0&&!off[selectedIndex]?selectedIndex:firstEnabled});};
  const hide=()=>store.setState({open:false,active:-1});
  const pick=(i:number)=>{
    const o=options[i];
    if(!o||o.disabled)return;
    hide();
    if(o.value!==value)onValueChange(o.value);
  };
  // RNW also fires the trigger's onPress on Enter/Space keyup. The key handler owns
  // the keyboard, so a key-originated press is ignored instead of reopening.
  const onTriggerPress=(event?:unknown)=>{
    // RNW passes the DOM keyup itself; a synthetic event carries it on nativeEvent.
    const e=event as {type?:unknown;nativeEvent?:{type?:unknown}}|undefined;
    const type=String(e?.nativeEvent?.type??e?.type??"");
    if(web&&type.startsWith("key"))return;
    if(open)hide();else show();
  };
  const onKeyDown=(event:unknown)=>{
    if(disabled)return;
    const k=webKey(event);
    if(isModified(k))return;
    const activates=k.key==="Enter"||k.key===" ";
    if(!open){
      if(activates||k.key==="ArrowDown"||k.key==="ArrowUp"){k.preventDefault();show();}
      return;
    }
    if(activates){k.preventDefault();pick(active);return;}
    if(k.key==="Escape"){k.preventDefault();hide();return;}
    if(k.key==="Tab"){hide();return;}
    const next=nextChoiceIndex(active,k.key,off,{axis:"vertical",wrap:false});
    if(next!==null){k.preventDefault();store.setState({active:next});return;}
    const hit=typeaheadIndex(options.map(optionLabel),off,active,k.key);
    if(hit>=0)store.setState({active:hit});
  };
  const listId=id+"-list",optionId=(i:number)=>id+"-opt-"+i;
  const shown=selected?optionLabel(selected):placeholder;
  const message=errorText??hint;
  const triggerWeb=web?{
    nativeID:id+"-trigger",onKeyDown,onBlur:hide,
    "aria-haspopup":"listbox","aria-expanded":open,
    "aria-controls":open?listId:undefined,
    "aria-activedescendant":open&&active>=0?optionId(active):undefined,
    "aria-invalid":errorText?true:undefined,
    "aria-describedby":message?id+"-msg":undefined,
  }:{};
  const renderOption=(o:SelectOption,i:number)=>{
    const isSelected=i===selectedIndex,isActive=i===active;
    return <Pressable key={o.value+":"+i} role="option" nativeID={optionId(i)}
      aria-selected={isSelected} aria-disabled={o.disabled||undefined} disabled={o.disabled}
      accessibilityState={{selected:isSelected,disabled:!!o.disabled}}
      onPress={()=>pick(i)}
      // Keep focus on the trigger so its blur fires only when focus really leaves.
      {...(web?{tabIndex:-1,onMouseDown:(e:{preventDefault:()=>void})=>e.preventDefault()}:{})}
      {...{className:joinClasses("min-h-11 w-full justify-center",
        styled&&"px-3 py-2",
        styled&&(isSelected?"bg-primary forced-colors:border-2 forced-colors:border-[Highlight]":isActive?"bg-surface-sunken":"bg-transparent hover:bg-surface-sunken"),
        o.disabled&&"opacity-50")}}>
      <Text numberOfLines={2} {...{className:joinClasses(styled&&"text-base",
        styled&&(isSelected?"text-on-primary font-semibold":"text-text"))}}>{optionLabel(o)}</Text>
    </Pressable>;
  };
  const list=<View role={"listbox" as never} nativeID={listId} aria-label={label}
    {...{className:joinClasses("w-full",
      web?"absolute left-0 right-0 top-full z-50 mt-1":"mt-1",
      styled&&"overflow-hidden rounded-control border border-border bg-surface-raised shadow-md")}}>
    <ScrollView style={{maxHeight:320}} nestedScrollEnabled keyboardShouldPersistTaps="handled">
      {groups===undefined?options.map((o,i)=>renderOption(o,i)):groups.map((group,g)=>{
        // Keyboard order runs through the flattened list, so each group starts at its offset.
        const start=groups.slice(0,g).reduce((n,x)=>n+x.options.length,0);
        const headingId=id+"-group-"+g;
        return <View key={"group:"+g} role={"group" as never} aria-labelledby={headingId}>
          {/* APG grouped listbox: on web the group takes its name from this presentational heading. */}
          <Text nativeID={headingId} role={(web?"presentation":"heading") as never}
            {...{className:joinClasses(styled&&"px-3 pt-3 pb-1 text-xs font-semibold text-text-muted")}}>{group.heading}</Text>
          {group.options.map((o,j)=>renderOption(o,start+j))}
        </View>;
      })}
    </ScrollView>
  </View>;
  return <View {...rest} {...{className:joinClasses("w-full min-w-0 gap-2",open&&web&&"relative z-50",className)}}>
    <Text nativeID={id+"-label"} {...{className:joinClasses(styled&&"text-sm font-semibold text-text")}}>{label}</Text>
    <View {...{className:"relative w-full"}}>
      <Pressable role="combobox" testID={testID}
        accessibilityLabel={web?label:label+", "+shown}
        accessibilityHint={message}
        accessibilityState={{disabled,expanded:open}}
        disabled={disabled} onPress={onTriggerPress}
        {...triggerWeb}
        {...{className:joinClasses("min-h-12 w-full flex-row items-center gap-2",
          styled&&"rounded-control border bg-surface-sunken px-3 focus-visible:ring-2 focus-visible:ring-focus",
          styled&&(errorText?"border-danger":"border-border"),
          disabled&&"opacity-50",triggerClassName)}}>
        <Text numberOfLines={1} {...{className:joinClasses("min-w-0 flex-1",
          styled&&(selected?"text-base text-text":"text-base text-text-muted"))}}>{shown}</Text>
        {/* Chevron drawn from borders so it takes the text token without an icon dependency. */}
        <View aria-hidden {...{className:joinClasses("h-2 w-2 border-b-2 border-r-2",styled&&"border-text-muted")}}
          style={{transform:[{translateY:open?2:-2},{rotate:open?"-135deg":"45deg"}]}}/>
      </Pressable>
      {open&&web?list:null}
    </View>
    {open&&!web?list:null}
    {message?<Text nativeID={id+"-msg"}
      {...(errorText?{accessibilityRole:"alert" as const,accessibilityLiveRegion:"polite" as const}:{})}
      {...{className:joinClasses(styled&&"text-sm",styled&&(errorText?"text-danger":"text-text-muted"))}}>{message}</Text>:null}
  </View>;
}
