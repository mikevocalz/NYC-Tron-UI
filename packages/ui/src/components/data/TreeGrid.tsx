import {useMemo,useRef,type ReactNode} from "react";
import {FlatList,Pressable,ScrollView,Text,View,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {visibleTreeRows,type TreeGridNode} from "./tree-grid";
import {joinClasses} from "../styles";

export interface TreeGridColumn {id:string;title:string;width?:number}
type Local={expanded:ReadonlySet<string>;width:number};
export interface TreeGridProps extends Omit<ViewProps,"children"> {
  nodes:readonly TreeGridNode[];
  columns:readonly TreeGridColumn[];
  expandedIds?:readonly string[];
  defaultExpandedIds?:readonly string[];
  onExpandedChange?:(next:readonly string[])=>void;
  selectedId?:string|null;
  onSelect?:(id:string)=>void;
  renderCell?:(node:TreeGridNode,column:TreeGridColumn)=>ReactNode;
  compactBelow?:number;
  rowHeight?:number;
  maxHeight?:number;
  className?:string;
  unstyled?:boolean;
}
/** Native RN + FlatList hierarchy; no WebView, no HTML table. */
export function TreeGrid({
  nodes,columns,expandedIds,defaultExpandedIds=[],onExpandedChange,selectedId,onSelect,renderCell,
  compactBelow=620,rowHeight=48,maxHeight=640,className,unstyled=false,onLayout,...rest
}:TreeGridProps){
  const local=useRef<StoreApi<Local>|null>(null);
  if(!local.current)local.current=createStore<Local>(()=>({expanded:new Set(defaultExpandedIds),width:0}));
  const store=local.current;
  const internalExpanded=useStore(store,s=>s.expanded);
  const width=useStore(store,s=>s.width);
  const expanded=useMemo(()=>expandedIds?new Set(expandedIds):internalExpanded,[expandedIds,internalExpanded]);
  const rows=useMemo(()=>visibleTreeRows(nodes,expanded),[nodes,expanded]);
  const compact=width<compactBelow;
  const toggle=(id:string)=>{
    const next=new Set(expanded);
    if(next.has(id))next.delete(id);else next.add(id);
    if(expandedIds===undefined)store.setState({expanded:next});
    onExpandedChange?.([...next]);
  };
  const cellValue=(n:TreeGridNode,c:TreeGridColumn):ReactNode=>
    renderCell?.(n,c)??<Text>{String(n.values?.[c.id]??"")}</Text>;
  return <View {...rest} {...{className:joinClasses("min-w-0",!unstyled&&"bg-surface-raised",className)}}
    onLayout={e=>{
      const w=e.nativeEvent.layout.width;
      if(Number.isFinite(w)&&w>=0&&store.getState().width!==w)store.setState({width:w});
      onLayout?.(e);
    }}>
    {compact?null:<ScrollView horizontal style={{flexGrow:0}} contentContainerStyle={{minWidth:width}}>
      <View style={{flexDirection:"row",height:44,alignItems:"center"}}>
        <Text style={{minWidth:180,flex:1,fontWeight:"700"}}>Name</Text>
        {columns.map(c=><Text key={c.id} style={{width:c.width??140,fontWeight:"700"}}>{c.title}</Text>)}
      </View>
    </ScrollView>}
    <FlatList data={rows} style={{maxHeight}} keyExtractor={r=>r.node.id}
      renderItem={({item})=><View style={{minHeight:compact?rowHeight+44:rowHeight,flexDirection:compact?"column":"row",
        borderBottomWidth:unstyled?0:1,borderColor:unstyled?undefined:"#343443",paddingVertical:4,paddingLeft:Math.min(item.depth*16,128)}}>
        <View style={{flexDirection:"row",alignItems:"center",minHeight:40,minWidth:180,flex:1}}>
          <Pressable accessible accessibilityRole="button"
            accessibilityLabel={(expanded.has(item.node.id)?"Collapse ":"Expand ")+item.node.label}
            accessibilityState={{expanded:expanded.has(item.node.id),disabled:!item.hasChildren}}
            disabled={!item.hasChildren} onPress={()=>toggle(item.node.id)}
            style={{minWidth:44,minHeight:44,justifyContent:"center",alignItems:"center"}}>
            <Text>{item.hasChildren?(expanded.has(item.node.id)?"▾":"▸"):"·"}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={item.node.label}
            accessibilityState={{selected:selectedId===item.node.id}} onPress={()=>onSelect?.(item.node.id)}
            style={{flex:1,minHeight:44,justifyContent:"center"}}>
            <Text style={{fontWeight:selectedId===item.node.id?"700":"400"}}>{item.node.label}</Text>
          </Pressable>
        </View>
        <View style={{flexDirection:compact?"column":"row",paddingLeft:compact?44:0}}>
          {columns.map(c=><View key={c.id} style={{width:compact?"100%":c.width??140,
            flexDirection:compact?"row":"column",gap:8,alignItems:compact?"center":"flex-start",justifyContent:"center",
            minHeight:compact?28:44}}>
            {compact?<Text style={{width:"42%",fontWeight:"600"}}>{c.title}</Text>:null}
            <View style={{flex:1}}>{cellValue(item.node,c)}</View>
          </View>)}
        </View>
      </View>}
      ListEmptyComponent={<Text>No items</Text>}/>
  </View>;
}
