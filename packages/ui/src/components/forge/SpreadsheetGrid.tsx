import { useEffect, useMemo, useRef } from "react";
import { ScrollView, Text, TextInput, Pressable, View, type ViewProps } from "react-native";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import { flexRender, tableFeatures, useTable } from "@tanstack/react-table";
import { cellAddress, columnName, sheetWindow } from "./sheet-window";
import { joinClasses } from "../styles";

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
  readonly width: number;
  readonly height: number;
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
type GridLocal = { x:number;y:number;draft:string;dirty:boolean;pending:boolean;error:string|null };
const coreFeatures=tableFeatures({});

function display(value:SpreadsheetCell["computed"]|undefined) {
  if(value === null || value === undefined)return "";
  return String(value);
}
export function SpreadsheetGrid({
  sheetId,rowCount,columnCount,cells,width,height,rowHeight=32,columnWidth=112,
  selectedCell=null,onSelectionChange,onCommitCell,onWindowChange,
  className,headerClassName,cellClassName,unstyled=false,style,...props
}:SpreadsheetGridProps) {
  const stateRef=useRef<StoreApi<GridLocal>|null>(null);
  if(!stateRef.current)stateRef.current=createStore<GridLocal>(()=>({
    x:0,y:0,draft:"",dirty:false,pending:false,error:null
  }));
  const state=stateRef.current;
  const x=useStore(state,s=>s.x);
  const y=useStore(state,s=>s.y);
  const draft=useStore(state,s=>s.draft);
  const dirty=useStore(state,s=>s.dirty);
  const pending=useStore(state,s=>s.pending);
  const error=useStore(state,s=>s.error);
  const window=sheetWindow({rowCount,columnCount,scrollX:x,scrollY:y,
    viewportWidth:width,viewportHeight:height,rowHeight,columnWidth});
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
  const lastSelected=useRef(selected);
  useEffect(()=>{
    if(selected!==lastSelected.current){
      lastSelected.current=selected;
      state.setState({draft:selected?cells[selected]?.raw??"":"",dirty:false,error:null});
    }
  },[selected,cells,state]);
  useEffect(()=>{
    onWindowChange?.({startRow:window.rows.start,endRow:window.rows.end,
      startColumn:window.columns.start,endColumn:window.columns.end});
  },[onWindowChange,window.rows.start,window.rows.end,window.columns.start,window.columns.end]);
  const commit=async()=>{
    if(!selected || !onCommitCell || pending || !dirty)return;
    state.setState({pending:true,error:null});
    try{
      await onCommitCell(selected,state.getState().draft);
      // Parent must update its Rust-backed cells; local state isn't source data.
      state.setState({dirty:false});
    }catch(err){
      state.setState({error:err instanceof Error?err.message:"Could not update cell"});
    }finally{state.setState({pending:false});}
  };
  const left=52;
  const headerHeight=38;
  const visibleColumns=table.getHeaderGroups().at(0)?.headers??[];
  const leftGap=window.columns.start*columnWidth;
  const rightGap=(columnCount-window.columns.end)*columnWidth;
  return <View {...props}
    accessibilityLabel={props.accessibilityLabel??"Spreadsheet"}
    {...{className:joinClasses("overflow-hidden",!unstyled&&"border border-border bg-surface-raised",className)}}
    style={[{width,height},style]}>
    <View style={{minHeight:46,flexDirection:"row",alignItems:"center",gap:8,paddingHorizontal:8}}>
      <Text style={{minWidth:60}}>{selected || "A1"}</Text>
      <TextInput
        style={{flex:1,minHeight:36,paddingHorizontal:10}}
        accessibilityLabel="Formula bar"
        editable={Boolean(selected&&onCommitCell)&&!pending}
        value={dirty?draft:(selected?cells[selected]?.raw??"":"")}
        onChangeText={next=>state.setState({draft:next,dirty:true})}
        onSubmitEditing={()=>void commit()}
        onBlur={()=>{if(dirty)void commit();}}
        returnKeyType="done"
      />
    </View>
    {error?<Text accessibilityLiveRegion="polite">{error}</Text>:null}
    <ScrollView horizontal scrollEventThrottle={32}
      onScroll={event=>{
        const next=Math.max(0,event.nativeEvent.contentOffset.x);
        if(Math.abs(next-state.getState().x)>columnWidth/4)state.setState({x:next});
      }}>
      <View style={{width:window.totalWidth}}>
        <View style={{flexDirection:"row",height:headerHeight,
          borderBottomWidth:1,alignItems:"stretch"}}>
          <View style={{width:left}}><Text> </Text></View>
          <View style={{width:leftGap}}/>
          {visibleColumns.map(h=><View key={h.id}
            {...{className:joinClasses(!unstyled&&"border-r border-border bg-surface-sunken",headerClassName)}}
            style={{width:columnWidth,justifyContent:"center",alignItems:"center"}}>
            <Text>{String(flexRender(h.column.columnDef.header,h.getContext())??"")}</Text>
          </View>)}
          <View style={{width:rightGap}}/>
        </View>
        <ScrollView style={{height:Math.max(0,height-46-headerHeight)}}
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
                <Text>{realRow+1}</Text>
              </View>
              <View style={{width:leftGap}}/>
              {row.getAllCells().map((cell,i)=>{
                const col=window.columns.start+i;
                const addr=cellAddress(realRow,col);
                return <Pressable
                  key={addr}
                  accessibilityRole="button"
                  accessibilityLabel={`Cell ${addr}, ${display(cells[addr]?.computed)}`}
                  accessibilityState={{selected:selected===addr}}
                  onPress={()=>{
                    onSelectionChange?.(addr);
                    state.setState({draft:cells[addr]?.raw??"",dirty:false,error:null});
                  }}
                  {...{className:joinClasses(!unstyled&&"border-r border-b border-border",cellClassName,
                    selected===addr&&!unstyled&&"bg-primary/10")}}
                  style={{width:columnWidth,justifyContent:"center",paddingHorizontal:8}}>
                  <Text numberOfLines={1}>{display(cells[addr]?.computed)}</Text>
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
