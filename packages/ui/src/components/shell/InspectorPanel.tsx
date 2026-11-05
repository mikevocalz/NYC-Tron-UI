import {useMemo,useRef,type ReactNode} from "react";
import {ScrollView,Text,View,type ViewProps} from "react-native";
import {useStore} from "zustand";
import {joinClasses} from "../styles.ts";
import {InspectorPanelContext} from "./inspector-context.ts";
import {createStore,type StoreApi} from "zustand/vanilla";
import {matchingRowCount,matchSummary,selectionHeading,type InspectorRegistryState,type InspectorSelection} from "./inspector-model.ts";
import {InspectorSearch} from "./InspectorSearch.tsx";

export type {InspectorSelection} from "./inspector-model.ts";

/** Props for {@linkcode InspectorPanel}. */
export interface InspectorPanelProps extends Omit<ViewProps,"children"> {
  selection:InspectorSelection;
  /** {@linkcode InspectorSection}s and {@linkcode PropertyRow}s for the selection. */
  children?:ReactNode;
  /** Filter text. With `onQueryChange` the panel shows an {@linkcode InspectorSearch}. */
  query?:string;
  onQueryChange?:(query:string)=>void;
  /** Header buttons, e.g. a pin or a panel menu. */
  actions?:ReactNode;
  /** Shown instead of the sections when nothing is selected. @default "Select an object to see its properties." */
  emptyMessage?:string;
  className?:string;
  unstyled?:boolean;
}

/**
 * Selection-aware properties panel. The heading names the selected object or
 * the count of a multiple selection, and with nothing selected the panel
 * says how to get started instead of showing empty sections. A search query
 * filters rows by label and keywords: sections with no matching rows hide,
 * matching sections show expanded, and the match count is announced.
 */
export function InspectorPanel({
  selection,children,query="",onQueryChange,actions,emptyMessage="Select an object to see its properties.",
  className,unstyled=false,style,...rest
}:InspectorPanelProps){
  const styled=!unstyled;
  const registry=useRef<StoreApi<InspectorRegistryState>|null>(null);
  if(!registry.current)registry.current=createStore<InspectorRegistryState>(()=>({rows:{}}));
  const matches=useStore(registry.current,s=>matchingRowCount(s));
  const context=useMemo(()=>({query,registry:registry.current!}),[query]);
  const searching=!!query.trim();
  const detail=selection.kind==="single"?selection.detail:selection.kind==="multiple"?"Changes apply to every selected object.":undefined;
  return <View {...rest} accessibilityLabel={"Properties of "+selectionHeading(selection)}
    {...{role:"region",className:joinClasses(styled&&"bg-surface-raised",className)}} style={[{flex:1,minHeight:0},style]}>
    <View {...{className:joinClasses(styled&&"border-b border-border px-3 py-2")}} style={{gap:8}}>
      <View style={{flexDirection:"row",alignItems:"center",gap:8,minHeight:44}}>
        <View style={{flex:1,minWidth:0}}>
          <Text accessibilityRole="header" numberOfLines={1} {...{className:joinClasses(styled&&"text-text text-base font-semibold")}}>
            {selectionHeading(selection)}</Text>
          {detail?<Text numberOfLines={1} {...{className:joinClasses(styled&&"text-text-muted text-xs")}}>{detail}</Text>:null}
        </View>
        {actions}
      </View>
      {onQueryChange&&selection.kind!=="none"?<InspectorSearch query={query} onQueryChange={onQueryChange}
        summary={matchSummary(matches,query)} unstyled={unstyled}/>:null}
    </View>
    {selection.kind==="none"
      ?<View style={{padding:16}}><Text {...{className:joinClasses(styled&&"text-text-muted text-sm")}}>{emptyMessage}</Text></View>
      :<ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:16}}>
        <InspectorPanelContext.Provider value={context}>{children}</InspectorPanelContext.Provider>
        {searching&&matches===0?<View style={{padding:16,gap:4}}>
          <Text {...{className:joinClasses(styled&&"text-text text-sm")}}>{`Nothing matches "${query.trim()}".`}</Text>
          <Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}}>Try a shorter word, or clear the search to see every property.</Text>
        </View>:null}
      </ScrollView>}
  </View>;
}
