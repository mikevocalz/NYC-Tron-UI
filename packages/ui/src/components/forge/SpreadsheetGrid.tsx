import { useEffect, useMemo, useRef, type ComponentRef } from "react";
import { ScrollView, Text, TextInput, Pressable, View, type ViewProps } from "react-native";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import { flexRender, tableFeatures, useTable } from "@tanstack/react-table";
import { cellAddress, columnName, sheetWindow, responsiveSheetMetrics, reanchorSheetScroll } from "./sheet-window.ts";
import { commitCellEdit } from "./cell-commit.ts";
import { joinClasses } from "../styles.ts";

/** Only presentation data supplied by the app's TallyDocument.getRange(). */
export interface SpreadsheetCell {
  readonly addr: string;
  readonly raw: string;
  readonly computed: string | number | boolean | null;
}
export interface SpreadsheetGridProps extends Omit<ViewProps, "children"> {
  readonly sheetId: string;
  readonly rowCount: number;
  readonly columnCount: number;
  readonly cells: Readonly<Record<string, SpreadsheetCell>>;
  /** Width and height may be provided by the host or measured via onLayout. */
  readonly width?: number;
  readonly height?: number;
  /** Content breakpoint only: never changes foldable hardware navigation. */
  readonly compactBelow?: number;
  readonly rowHeight?: number;
  readonly columnWidth?: number;
  readonly selectedCell?: string|null;
  readonly onSelectionChange?: (address: string) => void;
  readonly onCommitCell?: (address:string,raw:string)=>Promise<unknown>|unknown;
  /** Ask the host's TallyDocument for just this visible range. */
  readonly onWindowChange?: (range:{
    startRow:number;endRow:number;startColumn:number;endColumn:number;
  })=>void;
  readonly className?:string;
  readonly cellClassName?:string;
  readonly headerClassName?:string;
  readonly unstyled?:boolean;
}
type GridLocal = { x:number;y:number;draft:string;dirty:boolean;pending:boolean;editVersion:number;error:string|null;measuredWidth:number;measuredHeight:number };
const coreFeatures=tableFeatures({});

function display(value:SpreadsheetCell["computed"]|undefined) {
  if(value === null || value === undefined)return "";
  return String(value);
}
export function SpreadsheetGrid({
  sheetId,rowCount,columnCount,cells,width,height,rowHeight:preferredRowHeight=32,columnWidth:preferredColumnWidth=112,compactBelow=540,
  selectedCell=null,onSelectionChange,onCommitCell,onWindowChange,
  className,headerClassName,cellClassName,unstyled=false,onLayout,style,...props
}:SpreadsheetGridProps) {
  const stateRef=useRef<StoreApi<GridLocal>|null>(null);
  if(!stateRef.current)stateRef.current=createStore<GridLocal>(()=>({
    x:0,y:0,draft:"",dirty:false,pending:false,editVersion:0,error:null,measuredWidth:0,measuredHeight:0
  }));
  const state=stateRef.current;
  const x=useStore(state,s=>s.x);
  const y=useStore(state,s=>s.y);
  const draft=useStore(state,s=>s.draft);
  const dirty=useStore(state,s=>s.dirty);
  const pending=useStore(state,s=>s.pending);
  const error=useStore(state,s=>s.error);
  const measuredWidth=useStore(state,s=>s.measuredWidth);
  const measuredHeight=useStore(state,s=>s.measuredHeight);
  const viewportWidth=width??measuredWidth;
  const viewportHeight=height??measuredHeight;
  const metrics=responsiveSheetMetrics({
    width:viewportWidth,rowHeight:preferredRowHeight,
    columnWidth:preferredColumnWidth,compactBelow
  });
  const rowHeight=metrics.rowHeight;
  const columnWidth=metrics.columnWidth;
  const horizontalRef=useRef<ComponentRef<typeof ScrollView>>(null);
  const verticalRef=useRef<ComponentRef<typeof ScrollView>>(null);
  const previousCellMetrics=useRef({
    rowHeight,columnWidth,rowHeaderWidth:metrics.rowHeaderWidth,
  });
  useEffect(()=>{
    const previous=previousCellMetrics.current;
    const next={rowHeight,columnWidth,rowHeaderWidth:metrics.rowHeaderWidth};
    if(previous.rowHeight!==rowHeight || previous.columnWidth!==columnWidth ||
       previous.rowHeaderWidth!==metrics.rowHeaderWidth){
      const current=state.getState();
      const anchor=reanchorSheetScroll({x:current.x,y:current.y},previous,next);
      state.setState({x:anchor.x,y:anchor.y});
      horizontalRef.current?.scrollTo({x:anchor.x,animated:false});
      verticalRef.current?.scrollTo({y:anchor.y,animated:false});
    }
    previousCellMetrics.current=next;
  },[rowHeight,columnWidth,metrics.rowHeaderWidth,state]);
  const window=sheetWindow({rowCount,columnCount,scrollX:x,scrollY:y,
    viewportWidth,viewportHeight:Math.max(0,viewportHeight-metrics.formulaBarHeight),
    rowHeight,columnWidth,rowHeaderWidth:metrics.rowHeaderWidth,
    columnHeaderHeight:metrics.columnHeaderHeight});
  const rows=useMemo(()=>Array.from(
    {length:window.rows.end-window.rows.start},
    (_,i)=>({index:window.rows.start+i})
  ),[window.rows.start,window.rows.end]);
  const columns=useMemo(()=>Array.from(
    {length:window.columns.end-window.columns.start},(_,i)=>{
      const col=window.columns.start+i;
      return {id:columnName(col),header:columnName(col),
        accessorFn:(row:{index:number})=>cells[cellAddress(row.index,col)]?.computed ?? null
      };
    }),[window.columns.start,window.columns.end,cells]);
  const table=useTable({key:`nyc-tron-sheet-${sheetId}`,
    features:coreFeatures,data:rows,columns});
  const selected=selectedCell??"";
  const lastSelected=useRef({sheetId,selected});
  useEffect(()=>{
    if(selected!==lastSelected.current.selected || sheetId!==lastSelected.current.sheetId){
      lastSelected.current={sheetId,selected};
      state.setState({draft:selected?cells[selected]?.raw??"":"",dirty:false,error:null,editVersion:state.getState().editVersion+1});
    }
  },[sheetId,selected,cells,state]);
  const onWindowChangeRef=useRef(onWindowChange);
  onWindowChangeRef.current=onWindowChange;
  useEffect(()=>{
    if(viewportWidth<=0||viewportHeight<=metrics.formulaBarHeight)return;
    onWindowChangeRef.current?.({startRow:window.rows.start,endRow:window.rows.end,
      startColumn:window.columns.start,endColumn:window.columns.end});
  },[sheetId,window.rows.start,window.rows.end,window.columns.start,
    window.columns.end,viewportWidth>0,viewportHeight>metrics.formulaBarHeight]);
  const commit=()=>commitCellEdit(selected,onCommitCell,state.getState,patch=>state.setState(patch));
  // RN Text does not inherit color; every label needs the theme text token or
  // it renders platform-default black on a dark surface.
  const textClass=!unstyled?"text-text":undefined;
  const mutedClass=!unstyled?"text-text-muted":undefined;
  const left=metrics.rowHeaderWidth;
  const headerHeight=metrics.columnHeaderHeight;
  const visibleColumns=table.getHeaderGroups().at(0)?.headers??[];
  const leftGap=window.columns.start*columnWidth;
  const rightGap=(columnCount-window.columns.end)*columnWidth;
  return <View {...props}
    onLayout={event=>{
      const {width:nextWidth,height:nextHeight}=event.nativeEvent.layout;
      const current=state.getState();
      if(Number.isFinite(nextWidth)&&Number.isFinite(nextHeight)&&
        nextWidth>=0&&nextHeight>=0&&
        (current.measuredWidth!==nextWidth||current.measuredHeight!==nextHeight)){
        state.setState({measuredWidth:nextWidth,measuredHeight:nextHeight});
      }
      onLayout?.(event);
    }}
    accessibilityLabel={props.accessibilityLabel??"Spreadsheet"}
    {...{className:joinClasses("overflow-hidden",!unstyled&&"border border-border bg-surface-raised",className)}}
    style={[{width:width??"100%",height:height??"100%"},style]}>
    <View style={{
      height:metrics.formulaBarHeight,
      flexDirection:metrics.compact?"column":"row",
      alignItems:metrics.compact?"stretch":"center",
      gap:metrics.compact?4:8,paddingHorizontal:8,
      paddingVertical:metrics.compact?6:0,
    }}>
      <View style={{flexDirection:"row",alignItems:"center",
        justifyContent:"space-between",minWidth:metrics.compact?0:60}}>
        <Text {...{className:textClass}} accessibilityLabel={selected?`Selected cell ${selected}`:"No cell selected"}>{selected}</Text>
        {metrics.compact?<Text numberOfLines={1} style={{fontSize:11}} {...{className:mutedClass}}>
          Swipe sideways for more columns
        </Text>:null}
      </View>
      <TextInput
        {...{className:joinClasses(!unstyled&&"rounded-control border border-border bg-surface-sunken text-text focus:border-focus")}}
        style={{flex:metrics.compact?undefined:1,
          width:metrics.compact?"100%":undefined,minHeight:44,paddingHorizontal:10}}
        accessibilityLabel="Formula bar"
        editable={Boolean(selected&&onCommitCell)&&!pending}
        value={dirty?draft:(selected?cells[selected]?.raw??"":"")}
        onChangeText={next=>state.setState(current=>({draft:next,dirty:true,editVersion:current.editVersion+1}))}
        onSubmitEditing={()=>void commit()}
        onBlur={()=>{if(dirty)void commit();}}
        returnKeyType="done"
      />
    </View>
    {error?<Text accessibilityLiveRegion="polite" accessibilityRole="alert"
      {...{className:joinClasses("px-2",!unstyled&&"text-danger")}}>{error}</Text>:null}
    <ScrollView ref={horizontalRef} horizontal scrollEventThrottle={32} keyboardShouldPersistTaps="handled"
      accessibilityLabel="Spreadsheet grid, scroll sideways for additional columns"
      onScroll={event=>{
        const next=Math.max(0,event.nativeEvent.contentOffset.x);
        if(Math.abs(next-state.getState().x)>columnWidth/4)state.setState({x:next});
      }}>
      <View style={{width:window.totalWidth}}>
        <View {...{className:joinClasses(!unstyled&&"border-b border-border")}}
          style={{flexDirection:"row",height:headerHeight,alignItems:"stretch"}}>
          <View style={{width:left}}/>
          <View style={{width:leftGap}}/>
          {visibleColumns.map(h=><View key={h.id}
            {...{className:joinClasses(!unstyled&&"border-r border-border bg-surface-sunken",headerClassName)}}
            style={{width:columnWidth,justifyContent:"center",alignItems:"center"}}>
            <Text {...{className:textClass}}>{String(flexRender(h.column.columnDef.header,h.getContext())??"")}</Text>
          </View>)}
          <View style={{width:rightGap}}/>
        </View>
        <ScrollView ref={verticalRef} nestedScrollEnabled style={{height:Math.max(0,viewportHeight-metrics.formulaBarHeight-headerHeight)}}
          scrollEventThrottle={32}
          onScroll={event=>{
            const next=Math.max(0,event.nativeEvent.contentOffset.y);
            if(Math.abs(next-state.getState().y)>rowHeight/3)state.setState({y:next});
          }}>
          <View style={{height:window.rows.start*rowHeight}}/>
          {table.getRowModel().rows.map((row,relativeIndex)=>{
            const realRow=window.rows.start+relativeIndex;
            return <View key={realRow} style={{height:rowHeight,flexDirection:"row"}}>
              <View style={{width:left,justifyContent:"center",alignItems:"center"}}>
                <Text {...{className:mutedClass}}>{realRow+1}</Text>
              </View>
              <View style={{width:leftGap}}/>
              {row.getAllCells().map((cell,i)=>{
                const col=window.columns.start+i;
                const addr=cellAddress(realRow,col);
                return <Pressable
                  key={addr}
                  accessibilityRole="button"
                  accessibilityLabel={`Cell ${addr}, ${display(cells[addr]?.computed)}`}
                  accessibilityHint="Select the cell to edit its value in the formula bar"
                  accessibilityState={{selected:selected===addr}}
                  onPress={()=>{
                    onSelectionChange?.(addr);
                    state.setState(current=>({draft:cells[addr]?.raw??"",dirty:false,error:null,editVersion:current.editVersion+1}));
                  }}
                  {...{className:joinClasses(!unstyled&&"border-r border-b border-border",cellClassName,
                    selected===addr&&!unstyled&&"bg-primary/10")}}
                  style={{width:columnWidth,justifyContent:"center",paddingHorizontal:8}}>
                  <Text numberOfLines={1} {...{className:textClass}}>{display(cells[addr]?.computed)}</Text>
                </Pressable>;
              })}
              <View style={{width:rightGap}}/>
            </View>;
          })}
          <View style={{height:Math.max(0,(rowCount-window.rows.end)*rowHeight)}}/>
        </ScrollView>
      </View>
    </ScrollView>
  </View>;
}

