import {useEffect,useRef} from "react";
import {Platform,Text,TextInput,View,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {joinClasses} from "../styles.ts";
import {MenuButton} from "./MenuButton.tsx";
import {shellKey} from "./shell-keys.ts";
import {formatUnitValue,parseUnitExpression,unitScale,type UnitContext,type UnitName} from "./unit-expression.ts";

export type {UnitContext,UnitDimension,UnitName} from "./unit-expression.ts";

/** Props for {@linkcode UnitInput}. */
export interface UnitInputProps extends Omit<ViewProps,"children"> {
  /** Visible label and accessible name. */
  label:string;
  /** Committed value in the dimension's base unit (pixels, seconds, decibels or a ratio). */
  value:number;
  /** Exactly once per accepted entry or arrow step, with the clamped base-unit value. */
  onCommit:(value:number)=>void;
  /** Units and conversion facts. Omit for a plain number field that still accepts arithmetic. */
  context?:UnitContext;
  /** Display units offered in the unit menu. The menu is hidden unless there are two or more. */
  units?:readonly UnitName[];
  /** The person picked another display unit. The value does not change. */
  onUnitChange?:(unit:UnitName)=>void;
  /** Lower bound in base units. */
  min?:number;
  /** Upper bound in base units. */
  max?:number;
  /** Arrow-key step in display units; Shift multiplies by ten, Alt divides by ten. @default 1 */
  step?:number;
  /** Decimals for a plain number field. @default 2 */
  precision?:number;
  disabled?:boolean;
  /** Hide the visible label (the field keeps it as its accessible name). @default false */
  hideLabel?:boolean;
  className?:string;
  unstyled?:boolean;
}

type Local={editing:boolean;draft:string;error:string|undefined};
const PLAIN:UnitContext={dimension:"ratio",unit:"x"};

/** Display text for a plain or unit value. */
function display(value:number,ctx:UnitContext|undefined,precision:number):string{
  if(!ctx)return String(Number(value.toFixed(precision)));
  return formatUnitValue(value,ctx);
}

/**
 * Controlled measurement field. It shows the value in the context's display
 * unit and accepts arithmetic across units (`12mm + 4pt`, `1.5s - 12f`,
 * `(100% - 16px) / 2`) through a bounded parser with no `eval`. Enter or
 * leaving the field commits; Escape restores the committed value; ArrowUp and
 * ArrowDown step. A parse error stays in the field with its message and is
 * announced. Results are clamped to `min` and `max`.
 */
export function UnitInput({
  label,value,onCommit,context,units,onUnitChange,min,max,step=1,precision=2,disabled=false,hideLabel=false,
  className,unstyled=false,style,...rest
}:UnitInputProps){
  const styled=!unstyled;
  const local=useRef<StoreApi<Local>|null>(null);
  if(!local.current)local.current=createStore<Local>(()=>({editing:false,draft:"",error:undefined}));
  const store=local.current;
  const {editing,draft,error}=useStore(store,s=>s);
  const shown=display(value,context,precision);
  useEffect(()=>{if(!store.getState().editing)store.setState({error:undefined});},[value,store]);
  const bound=(v:number)=>Math.max(min??-Infinity,Math.min(max??Infinity,v));
  const commit=(next:number)=>{
    const bounded=bound(next);
    store.setState({editing:false,error:undefined});
    if(bounded!==value)onCommit(bounded);
  };
  const apply=()=>{
    const s=store.getState();
    if(!s.editing)return;
    const result=parseUnitExpression(s.draft,context??PLAIN);
    if(!result.ok){store.setState({error:result.error});return;}
    commit(result.value);
  };
  const nudge=(steps:number)=>{
    const scale=context?unitScale(context.unit,context):1;
    commit(value+steps*step*scale);
  };
  const errorId=`unit-error-${label.replace(/\W+/g,"-")}`;
  return <View {...rest} {...{className:joinClasses("gap-1",className)}} style={[{opacity:disabled?0.5:1},style]}>
    {!hideLabel?<Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}}>{label}</Text>:null}
    <View style={{flexDirection:"row",alignItems:"center",gap:4}}>
      <TextInput accessibilityLabel={label} editable={!disabled} aria-disabled={disabled} accessibilityState={{disabled}}
        aria-invalid={!!error} aria-describedby={error?errorId:undefined}
        value={editing?draft:shown}
        selectTextOnFocus inputMode="text" autoCorrect={false} autoCapitalize="none" returnKeyType="done"
        // Enter commits and keeps focus, so an error stays next to the text that caused it.
        submitBehavior="submit" {...(Platform.OS==="web"?{blurOnSubmit:false}:{})}
        onFocus={()=>store.setState({editing:true,draft:shown,error:undefined})}
        onChangeText={text=>store.setState({editing:true,draft:text,error:undefined})}
        onSubmitEditing={apply}
        onBlur={()=>{
          apply();
          const failed=store.getState();
          // Leaving with text that does not parse restores the value and says so.
          if(failed.editing&&failed.error)store.setState({editing:false,error:"Not applied. "+failed.error});
        }}
        onKeyPress={event=>{
          const k=shellKey(event);
          if(k.key==="Escape"){store.setState({editing:false,error:undefined,draft:shown});return;}
          if(k.key==="ArrowUp"||k.key==="ArrowDown"){
            k.preventDefault();
            nudge((k.key==="ArrowUp"?1:-1)*(k.shiftKey?10:k.altKey?0.1:1));
          }
        }}
        {...{className:joinClasses(styled&&"rounded-control border bg-surface-sunken text-text px-2",
          styled&&(error?"border-danger":editing?"border-focus":"border-border"))}}
        style={{flex:1,minWidth:64,minHeight:44,fontVariant:["tabular-nums"]}}/>
      {context&&units&&units.length>1&&onUnitChange?<MenuButton label={label+" unit, "+context.unit}
        items={units.map(u=>({id:u,label:u,description:u===context.unit?"Current":undefined}))}
        onSelect={u=>{if(u!==context.unit)onUnitChange(u as UnitName);}} menuWidth={160} disabled={disabled}
        {...{className:joinClasses(styled&&"border border-border bg-surface-raised px-2")}}>
        <Text {...{className:joinClasses(styled&&"text-text text-sm")}}>{context.unit}</Text>
      </MenuButton>:null}
    </View>
    {error?<Text nativeID={errorId} accessibilityLiveRegion="assertive" {...{id:errorId,className:joinClasses(styled&&"text-danger text-xs")}}>{error}</Text>:null}
  </View>;
}
