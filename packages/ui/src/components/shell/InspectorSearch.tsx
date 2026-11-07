import {useLayoutEffect,useRef} from "react";
import {Pressable,Text,TextInput,View,type ViewProps} from "react-native";
import {joinClasses} from "../styles.ts";
import {shellKey} from "./shell-keys.ts";

export {matchesQuery} from "./inspector-model.ts";

/** Props for {@linkcode InspectorSearch}. */
export interface InspectorSearchProps extends Omit<ViewProps,"children"> {
  scope?:string;disabled?:boolean;
  query:string;
  maxLength?:number;
  onQueryChange:(query:string)=>void;
  /** Accessible name and placeholder. @default "Search properties" */
  label?:string;
  /**
   * Polite live-region text such as "3 properties match". {@linkcode InspectorPanel}
   * supplies it; standalone filters (assets, controls) pass their own.
   */
  summary?:string;
  className?:string;
  unstyled?:boolean;
}

/**
 * Filter field for inspector properties, controls or assets. Typing filters
 * as you go; Escape or the 44pt clear button empties it. Pair it with
 * {@linkcode matchesQuery} to filter app-owned lists the same way the
 * inspector filters rows.
 */
export function InspectorSearch({
  scope="inspector-search",disabled=false,query,maxLength=2048,onQueryChange,label="Search properties",summary,className,unstyled=false,style,...rest
}:InspectorSearchProps){
  if(!Number.isInteger(maxLength)||maxLength<1||maxLength>100000)throw new RangeError("Invalid inspector search budget");
  const styled=!unstyled;
  const committed=useRef<{scope:string;disabled:boolean;onQueryChange:typeof onQueryChange}|null>(null);
  useLayoutEffect(()=>{committed.current={scope,disabled,onQueryChange};});
  useLayoutEffect(()=>()=>{committed.current=null;},[]);
  const change=(value:string)=>{const p=committed.current;if(p?.scope===scope&&!p.disabled)p.onQueryChange(value.slice(0,maxLength));};
  return <View {...rest} {...{className:joinClasses("gap-1",className)}} style={style}>
    <View {...{className:joinClasses(styled&&"rounded-control border border-border bg-surface-sunken focus-within:border-focus")}}
      style={{flexDirection:"row",alignItems:"center",minHeight:44,paddingHorizontal:10}}>
      <SearchGlyph styled={styled}/>
      <TextInput role="searchbox" accessibilityLabel={label} placeholder={label}
        value={query} maxLength={maxLength} editable={!disabled} accessibilityState={{disabled}} onChangeText={change} autoCorrect={false} autoCapitalize="none" returnKeyType="search"
        onKeyPress={event=>{
          const k=shellKey(event);
          if(k.key==="Escape"&&query){k.preventDefault();change("");}
        }}
        {...{className:joinClasses(styled&&"text-text placeholder:text-text-muted focus-visible:outline-none")}}
        style={{flex:1,minHeight:44,paddingHorizontal:8}}/>
      {query?<Pressable accessibilityRole="button" accessibilityLabel="Clear search" disabled={disabled} onPress={()=>change("")}
        {...{className:joinClasses("min-h-11 min-w-11 items-center justify-center",styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus")}}>
        <View pointerEvents="none" style={{width:12,height:12,alignItems:"center",justifyContent:"center"}}>
          <View {...{className:joinClasses(styled&&"border-text-muted")}} style={{position:"absolute",width:13,height:0,borderTopWidth:1.5,transform:[{rotate:"45deg"}]}}/>
          <View {...{className:joinClasses(styled&&"border-text-muted")}} style={{position:"absolute",width:13,height:0,borderTopWidth:1.5,transform:[{rotate:"-45deg"}]}}/>
        </View>
      </Pressable>:null}
    </View>
    <Text accessibilityLiveRegion="polite" {...{className:joinClasses(styled&&"text-text-muted text-xs")}}
      style={{minHeight:summary?undefined:0}}>{summary??""}</Text>
  </View>;
}

function SearchGlyph({styled}:{styled:boolean}){
  return <View pointerEvents="none" style={{width:14,height:14}}>
    <View {...{className:joinClasses(styled&&"border-text-muted")}} style={{width:10,height:10,borderRadius:5,borderWidth:1.5}}/>
    <View {...{className:joinClasses(styled&&"border-text-muted")}}
      style={{position:"absolute",left:8,top:10,width:5,height:0,borderTopWidth:1.5,transform:[{rotate:"45deg"}]}}/>
  </View>;
}
