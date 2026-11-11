import {useEffect,useMemo,useRef,type ReactNode} from "react";
import {Animated,FlatList,Pressable,Text,View,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {
  moveColumn,orderTreeColumns,toggleTreeSelection,treeGridKey,treeRowAccessibilityLabel,
  visibleTreeRows,type TreeGridNavState,type TreeGridNode,type VisibleTreeRow,
} from "./tree-grid.ts";
import {createRowHeightIndex} from "./tree-row-heights.ts";
import {joinClasses} from "../styles.ts";

/** A value column of {@linkcode TreeGrid}. The hierarchy label column is always first and always pinned. */
export interface TreeGridColumn {id:string;title:string;width?:number}
type Local={
  expanded:readonly string[];selected:readonly string[];order:readonly string[]|undefined;
  focusId:string|undefined;anchorId:string|undefined;width:number;
};
export interface TreeGridProps extends Omit<ViewProps,"children"> {
  nodes:readonly TreeGridNode[];
  columns:readonly TreeGridColumn[];
  expandedIds?:readonly string[];
  defaultExpandedIds?:readonly string[];
  onExpandedChange?:(next:readonly string[])=>void;
  /** Controlled multi-selection. Omit to let the grid own selection. */
  selectedIds?:readonly string[];
  defaultSelectedIds?:readonly string[];
  /** Fires for taps, Space, and Shift range extension. */
  onSelectionChange?:(next:readonly string[])=>void;
  /** Controlled column order by id; unknown ids are ignored, missing columns keep authored order. */
  columnOrder?:readonly string[];
  /** Called by the header's screen-reader "Move left/right" actions. */
  onColumnOrderChange?:(next:readonly string[])=>void;
  /** Columns kept beside the label column while the rest scroll horizontally. */
  pinnedColumnIds?:readonly string[];
  renderCell?:(node:TreeGridNode,column:TreeGridColumn)=>ReactNode;
  compactBelow?:number;
  rowHeight?:number;
  maxHeight?:number;
  emptyLabel?:string;
  className?:string;
  unstyled?:boolean;
}
const LABEL_WIDTH=224;
/**
 * Native RN + FlatList hierarchy; no WebView, no HTML table. Rows have dynamic
 * heights (wrapped labels, custom cells) because FlatList measures them; the
 * grid never assumes a fixed row height for scrolling.
 */
export function TreeGrid({
  nodes,columns,expandedIds,defaultExpandedIds=[],onExpandedChange,
  selectedIds,defaultSelectedIds=[],onSelectionChange,
  columnOrder,onColumnOrderChange,pinnedColumnIds,renderCell,
  compactBelow=620,rowHeight=48,maxHeight=640,emptyLabel="No items",className,unstyled=false,onLayout,...rest
}:TreeGridProps){
  const local=useRef<StoreApi<Local>|null>(null);
  if(!local.current)local.current=createStore<Local>(()=>({
    expanded:defaultExpandedIds,selected:defaultSelectedIds,order:undefined,focusId:undefined,anchorId:undefined,width:0,
  }));
  const store=local.current;
  const internalExpanded=useStore(store,s=>s.expanded);
  const internalSelected=useStore(store,s=>s.selected);
  const internalOrder=useStore(store,s=>s.order);
  const focusId=useStore(store,s=>s.focusId);
  const width=useStore(store,s=>s.width);
  const expandedList=expandedIds??internalExpanded;
  const selectedList=selectedIds??internalSelected;
  const expanded=useMemo(()=>new Set(expandedList),[expandedList]);
  const selected=useMemo(()=>new Set(selectedList),[selectedList]);
  const rows=useMemo(()=>visibleTreeRows(nodes,expanded),[nodes,expanded]);
  const order=columnOrder??internalOrder;
  const {ordered,pinned,scrollable}=useMemo(()=>orderTreeColumns(columns,order,pinnedColumnIds),[columns,order,pinnedColumnIds]);
  const compact=width<compactBelow;
  const scrollX=useRef(new Animated.Value(0)).current;
  const listRef=useRef<FlatList<VisibleTreeRow>>(null);
  // Heights live by row id so expanding a branch does not misattribute them to shifted positions.
  const measuredById=useRef(new Map<string,number>());
  const heights=useRef(createRowHeightIndex(0,rowHeight));
  const rowsForHeights=useRef<readonly VisibleTreeRow[]|null>(null);
  if(rowsForHeights.current!==rows){
    rowsForHeights.current=rows;
    const next=createRowHeightIndex(rows.length,rowHeight);
    rows.forEach((r,i)=>{const h=measuredById.current.get(r.node.id);if(h!==undefined)next.setHeight(i,h);});
    heights.current=next;
  }

  const setExpanded=(next:readonly string[])=>{
    if(expandedIds===undefined)store.setState({expanded:next});
    onExpandedChange?.(next);
  };
  const setSelected=(next:readonly string[])=>{
    if(selectedIds===undefined)store.setState({selected:next});
    onSelectionChange?.(next);
  };
  const toggleExpanded=(id:string)=>setExpanded(expanded.has(id)?expandedList.filter(x=>x!==id):[...expandedList,id]);
  const press=(id:string)=>{
    store.setState({focusId:id,anchorId:id});
    setSelected(toggleTreeSelection(selectedList,id));
  };
  // Pinned and scrolling columns render as separate groups, so "move left"
  // swaps with the neighbour in the same group; across the boundary it is a no-op.
  const reorder=(id:string,delta:number)=>{
    const group=(pinned.some(c=>c.id===id)?pinned:scrollable).map(c=>c.id);
    const neighbour=group[group.indexOf(id)+delta];
    if(neighbour===undefined)return;
    const current=ordered.map(c=>c.id);
    const next=moveColumn(current,id,current.indexOf(neighbour));
    if(columnOrder===undefined)store.setState({order:next});
    onColumnOrderChange?.(next);
  };
  // Expansion and selection are app state; the reducer result is routed back
  // through the same controlled/uncontrolled setters as taps.
  const onKey=(key:string,shiftKey:boolean)=>{
    const s=store.getState();
    const nav:TreeGridNavState={focusId:s.focusId,anchorId:s.anchorId,selectedIds:selectedList,expandedIds:expandedList};
    const next=treeGridKey(rows,nav,{key,shiftKey});
    if(!next)return false;
    store.setState({focusId:next.focusId,anchorId:next.anchorId});
    if(next.selectedIds!==nav.selectedIds)setSelected(next.selectedIds);
    if(next.expandedIds!==nav.expandedIds)setExpanded(next.expandedIds);
    // Only keyboard moves scroll; taps and parent re-renders leave the list where the user put it.
    const index=rows.findIndex(r=>r.node.id===next.focusId);
    if(index>=0&&next.focusId!==nav.focusId)listRef.current?.scrollToIndex({index,viewPosition:0.5,animated:false});
    return true;
  };
  // The wide layout's scroller remounts at offset 0 after a compact round
  // trip (fold, resize); the pinned translate must start there too.
  useEffect(()=>{if(!compact)scrollX.setValue(0);},[compact,scrollX]);

  const styled=!unstyled;
  const text=joinClasses(styled&&"text-text");
  const muted=joinClasses(styled&&"text-text-muted");
  const surface=joinClasses(styled&&"bg-surface-raised");
  const cellValue=(n:TreeGridNode,c:TreeGridColumn):ReactNode=>
    renderCell?.(n,c)??<Text {...{className:text}}>{String(n.values?.[c.id]??"")}</Text>;
  const pinnedWidth=LABEL_WIDTH+pinned.reduce((sum,c)=>sum+(c.width??140),0);
  const scrollWidth=scrollable.reduce((sum,c)=>sum+(c.width??140),0);
  // Pinned cells live inside the horizontal scroller but are translated by the
  // scroll offset on the native driver, so body swipes scroll both axes and
  // the label/pinned strip never lags behind a JS frame.
  const stick={transform:[{translateX:scrollX}],zIndex:1};
  const header=(c:TreeGridColumn,isPinned:boolean)=><View key={c.id} role="columnheader"
    accessibilityLabel={c.title+(isPinned?", pinned":"")}
    accessibilityActions={onColumnOrderChange||columnOrder===undefined
      ?[{name:"moveLeft",label:"Move column left"},{name:"moveRight",label:"Move column right"}]:undefined}
    onAccessibilityAction={e=>reorder(c.id,e.nativeEvent.actionName==="moveLeft"?-1:1)}
    style={{width:c.width??140,justifyContent:"center"}}>
    <Text {...{className:text}} style={{fontWeight:"700"}}>{c.title}</Text>
  </View>;

  const renderRow=({item,index}:{item:VisibleTreeRow;index:number})=>{
    const id=item.node.id;
    const isSelected=selected.has(id);
    const isFocused=focusId===id;
    const isExpanded=expanded.has(id);
    const label=<View style={{flexDirection:"row",alignItems:"center",minHeight:44,
      width:compact?undefined:LABEL_WIDTH,flex:compact?1:undefined,paddingLeft:Math.min(item.depth*16,128)}}>
      {item.hasChildren?<Pressable accessibilityRole="button"
        accessibilityLabel={(isExpanded?"Collapse ":"Expand ")+item.node.label}
        accessibilityState={{expanded:isExpanded}}
        onPress={()=>toggleExpanded(id)}
        {...{className:joinClasses(styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus")}}
        style={{minWidth:44,minHeight:44,justifyContent:"center",alignItems:"center"}}>
        <Text {...{className:text}}>{isExpanded?"▾":"▸"}</Text>
      </Pressable>
      // Leaves get a spacer, not a disabled "Expand" button screen readers would announce.
      :<View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden
        style={{minWidth:44,minHeight:44}}/>}
      <Text {...{className:text}} style={{flex:1,fontWeight:isSelected?"700":"400"}}>{item.node.label}</Text>
    </View>;
    const cells=(list:readonly TreeGridColumn[])=>list.map(c=><View key={c.id} role="cell"
      style={{width:compact?"100%":c.width??140,
      flexDirection:compact?"row":"column",gap:8,alignItems:compact?"center":"flex-start",justifyContent:"center",
      minHeight:compact?28:44}}>
      {compact?<Text {...{className:muted}} style={{width:"42%",fontWeight:"600"}}>{c.title}</Text>:null}
      <View style={{flex:1}}>{cellValue(item.node,c)}</View>
    </View>);
    // `role` (not accessibilityRole): "row" and "cell" are absent from
    // Android's AccessibilityRole enum and would throw there; `role` maps
    // unknown ARIA roles to no role instead.
    return <Pressable role="row" accessibilityLabel={treeRowAccessibilityLabel(item)}
      aria-selected={isSelected} aria-expanded={item.hasChildren?isExpanded:undefined}
      onPress={()=>press(id)}
      onLayout={e=>{
        const h=e.nativeEvent.layout.height;
        if(h>0&&index<heights.current.count&&heights.current.setHeight(index,h))measuredById.current.set(id,h);
      }}
      {...{className:joinClasses(styled&&"border-b border-border",
        styled&&isSelected&&"bg-primary/10",styled&&isFocused&&"ring-2 ring-focus")}}
      style={{minHeight:compact?rowHeight+44:rowHeight,flexDirection:compact?"column":"row",paddingVertical:4}}>
      {compact
        ?<>{label}<View style={{paddingLeft:44}}>{cells([...pinned,...scrollable])}</View></>
        // The pinned strip is opaque so scrolled cells pass under it; it
        // repeats the row's selection and focus tint on its inner layer.
        :<><Animated.View {...{className:surface}} style={[{width:pinnedWidth},stick]}>
            <View {...{className:joinClasses(styled&&isSelected&&"bg-primary/10",styled&&isFocused&&"ring-2 ring-focus")}}
              style={{flexDirection:"row",flex:1}}>{label}{cells(pinned)}</View>
          </Animated.View>
          <View style={{flexDirection:"row"}}>{cells(scrollable)}</View></>}
    </Pressable>;
  };

  const list=<FlatList ref={listRef} data={rows} style={{maxHeight}} keyExtractor={r=>r.node.id}
    renderItem={renderRow}
    onScrollToIndexFailed={info=>listRef.current?.scrollToOffset({
      offset:info.index<heights.current.count?heights.current.offsetOf(info.index):info.averageItemLength*info.index,animated:false})}
    ListEmptyComponent={<Text {...{className:text}} style={{padding:12}}>{emptyLabel}</Text>}/>;

  return <View {...rest} role="treegrid" focusable
    accessibilityLabel={rest.accessibilityLabel??"Tree grid"}
    onKeyDown={e=>{
      if(onKey(e.nativeEvent.key,e.nativeEvent.shiftKey))e.preventDefault?.();
    }}
    {...{className:joinClasses("min-w-0",surface,className)}}
    onLayout={e=>{
      const w=e.nativeEvent.layout.width;
      if(Number.isFinite(w)&&w>=0&&store.getState().width!==w)store.setState({width:w});
      onLayout?.(e);
    }}>
    {compact?list:<Animated.ScrollView horizontal scrollEventThrottle={16}
      onScroll={Animated.event([{nativeEvent:{contentOffset:{x:scrollX}}}],{useNativeDriver:true})}>
      <View style={{width:pinnedWidth+scrollWidth}}>
        <View role="row" {...{className:joinClasses(styled&&"border-b border-border bg-surface-sunken")}}
          style={{flexDirection:"row",height:44,alignItems:"center"}}>
          <Animated.View {...{className:joinClasses(styled&&"bg-surface-sunken")}}
            style={[{flexDirection:"row",width:pinnedWidth,height:44,alignItems:"center"},stick]}>
            <View role="columnheader" style={{width:LABEL_WIDTH,paddingLeft:44,justifyContent:"center"}}>
              <Text {...{className:text}} style={{fontWeight:"700"}}>Name</Text>
            </View>
            {pinned.map(c=>header(c,true))}
          </Animated.View>
          {scrollable.map(c=>header(c,false))}
        </View>
        {list}
      </View>
    </Animated.ScrollView>}
  </View>;
}
