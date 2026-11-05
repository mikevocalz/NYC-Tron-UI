import { useEffect, useMemo, useRef } from "react";
import { Animated, Text, TextInput, Pressable, View, type ViewProps } from "react-native";
import type { ScrollViewInstance } from "react-native";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import {
  cellAddress, columnName, frozenSheetWindow, moveSheetSelection, parseCellAddress, rangeContains, revealCellScroll,
  responsiveSheetMetrics, selectionRange, sheetPrefetchRange, type SheetRange, type SheetSelection,
} from "./sheet-window.ts";
import { rangeToTsv } from "./range-tsv.ts";
import { referenceHighlights } from "./formula-refs.ts";
import { commitCellEdit, selectCellAfterCommit } from "./cell-commit.ts";
import { joinClasses } from "../styles.ts";

/** Only presentation data supplied by the app's TallyDocument.getRange(). */
export interface SpreadsheetCell {
  readonly addr: string;
  readonly raw: string;
  readonly computed: string | number | boolean | null;
}
/**
 * Range {@linkcode SpreadsheetGrid} asks the host to load. `startRow..endRow`
 * and `startColumn..endColumn` (end-exclusive) are block-snapped with one
 * block of lookahead. Frozen panes always show rows `0..frozenRows` and
 * columns `0..frozenColumns`, so the host must load those too.
 */
export interface SpreadsheetWindowRequest {
  readonly startRow: number;
  readonly endRow: number;
  readonly startColumn: number;
  readonly endColumn: number;
  readonly frozenRows: number;
  readonly frozenColumns: number;
}
export interface SpreadsheetGridProps extends Omit<ViewProps, "children"> {
  readonly sheetId: string;
  /** Display name used to keep `'This Sheet'!A1` references highlighted; other sheets' references are not. */
  readonly sheetName?: string;
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
  /** Leading rows kept visible above the scrolling body. @default 0 */
  readonly frozenRows?: number;
  /** Leading columns kept visible beside the scrolling body. @default 0 */
  readonly frozenColumns?: number;
  /**
   * Controlled range selection. `focus` is the cell the formula bar edits.
   * Omit to let the grid own selection; pass `null` for "nothing selected".
   */
  readonly selection?: SheetSelection | null;
  readonly onSelectionChange?: (selection: SheetSelection) => void;
  readonly onCommitCell?: (address:string,raw:string)=>Promise<unknown>|unknown;
  /**
   * Ctrl/Cmd+C or the screen-reader "Copy" action. The kit builds the TSV from
   * `cells` (absent addresses are empty fields) and never touches the
   * clipboard; the app writes it.
   */
  readonly onCopyRange?: (range: SheetRange, tsv: string) => void;
  /** Largest selection {@linkcode SpreadsheetGridProps.onCopyRange} serializes. @default 1_000_000 */
  readonly maxCopyCells?: number;
  /** Shade cells referenced by the formula in the formula bar. @default true */
  readonly highlightReferences?: boolean;
  /** Ask the host's TallyDocument for just this range. */
  readonly onWindowChange?: (range: SpreadsheetWindowRequest) => void;
  readonly className?:string;
  readonly cellClassName?:string;
  readonly headerClassName?:string;
  readonly unstyled?:boolean;
}
type GridLocal = {
  x:number;y:number;draft:string;dirty:boolean;pending:boolean;editVersion:number;error:string|null;
  measuredWidth:number;measuredHeight:number;selection:SheetSelection|null;
};

function display(value:SpreadsheetCell["computed"]|undefined) {
  if(value === null || value === undefined)return "";
  return String(value);
}
/**
 * Three-pane sheet: frozen headers and frozen rows/columns sit outside the
 * body scroll views and follow them through native-driver transforms, so a
 * fling never shows the strips a frame behind. Only the visible window is
 * rendered on every pane.
 */
export function SpreadsheetGrid({
  sheetId,sheetName,rowCount,columnCount,cells,width,height,rowHeight:preferredRowHeight=32,
  columnWidth:preferredColumnWidth=112,compactBelow=540,frozenRows=0,frozenColumns=0,
  selection:selectionProp,onSelectionChange,onCommitCell,onCopyRange,maxCopyCells=1_000_000,
  highlightReferences=true,onWindowChange,
  className,headerClassName,cellClassName,unstyled=false,onLayout,style,...props
}:SpreadsheetGridProps) {
  const stateRef=useRef<StoreApi<GridLocal>|null>(null);
  if(!stateRef.current)stateRef.current=createStore<GridLocal>(()=>({
    x:0,y:0,draft:"",dirty:false,pending:false,editVersion:0,error:null,measuredWidth:0,measuredHeight:0,selection:null,
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
  const internalSelection=useStore(state,s=>s.selection);
  const selection=selectionProp===undefined?internalSelection:selectionProp;
  const viewportWidth=width??measuredWidth;
  const viewportHeight=height??measuredHeight;
  const metrics=responsiveSheetMetrics({
    width:viewportWidth,rowHeight:preferredRowHeight,
    columnWidth:preferredColumnWidth,compactBelow
  });
  const rowHeight=metrics.rowHeight;
  const columnWidth=metrics.columnWidth;
  const left=metrics.rowHeaderWidth;
  const headerHeight=metrics.columnHeaderHeight;
  const horizontalRef=useRef<ScrollViewInstance>(null);
  const verticalRef=useRef<ScrollViewInstance>(null);
  const scrollX=useRef(new Animated.Value(0)).current;
  const scrollY=useRef(new Animated.Value(0)).current;
  const previousCellMetrics=useRef({
    rowHeight,columnWidth,rowHeaderWidth:metrics.rowHeaderWidth,
  });
  // Body offsets exclude the row header (a separate pane), so keeping the
  // same logical cell at the leading edge is a plain ratio per axis.
  useEffect(()=>{
    const previous=previousCellMetrics.current;
    const next={rowHeight,columnWidth,rowHeaderWidth:metrics.rowHeaderWidth};
    if(previous.rowHeight!==rowHeight || previous.columnWidth!==columnWidth){
      const current=state.getState();
      const anchor={x:current.x*columnWidth/previous.columnWidth,y:current.y*rowHeight/previous.rowHeight};
      state.setState(anchor);
      horizontalRef.current?.scrollTo({x:anchor.x,animated:false});
      verticalRef.current?.scrollTo({y:anchor.y,animated:false});
    }
    previousCellMetrics.current=next;
  },[rowHeight,columnWidth,metrics.rowHeaderWidth,state]);
  const gridHeight=Math.max(0,viewportHeight-metrics.formulaBarHeight);
  const frozen=frozenSheetWindow({rowCount,columnCount,scrollX:x,scrollY:y,
    viewportWidth,viewportHeight:gridHeight,rowHeight,columnWidth,
    rowHeaderWidth:left,columnHeaderHeight:headerHeight,frozenRows,frozenColumns});
  const fr=frozen.frozenRows;
  const fc=frozen.frozenColumns;
  const body=frozen.body;
  const bodyHeight=Math.max(0,gridHeight-headerHeight-frozen.frozenHeight);
  // An invalid controlled address is a host bug; selectionRange throws with the address.
  const range=useMemo(()=>selection?selectionRange(selection):null,[selection]);
  const focus=range?selection!.focus:"";

  const lastFocus=useRef({sheetId,focus});
  useEffect(()=>{
    if(focus!==lastFocus.current.focus || sheetId!==lastFocus.current.sheetId){
      lastFocus.current={sheetId,focus};
      state.setState({draft:focus?cells[focus]?.raw??"":"",dirty:false,error:null,editVersion:state.getState().editVersion+1});
    }
  },[sheetId,focus,cells,state]);

  const prefetch=sheetPrefetchRange(body,{rowCount,columnCount});
  const onWindowChangeRef=useRef(onWindowChange);
  onWindowChangeRef.current=onWindowChange;
  const ready=viewportWidth>0&&viewportHeight>metrics.formulaBarHeight;
  useEffect(()=>{
    if(!ready)return;
    onWindowChangeRef.current?.({...prefetch,frozenRows:fr,frozenColumns:fc});
  },[sheetId,ready,prefetch.startRow,prefetch.endRow,prefetch.startColumn,prefetch.endColumn,fr,fc]);

  const commit=()=>commitCellEdit(focus,onCommitCell,state.getState,patch=>state.setState(patch));
  const select=(next:SheetSelection)=>{
    const apply=()=>{
      if(selectionProp===undefined)state.setState({selection:next});
      onSelectionChange?.(next);
    };
    // Moving only the anchor-to-focus extent keeps the same focus cell; the
    // draft for a new focus cell is only discarded after a successful save.
    if(next.focus===focus){apply();return;}
    void selectCellAfterCommit(state.getState,commit,()=>{
      apply();
      state.setState(current=>({draft:cells[next.focus]?.raw??"",dirty:false,error:null,editVersion:current.editVersion+1}));
    });
  };
  const copy=()=>{
    if(!range||!onCopyRange)return;
    try{
      const tsv=rangeToTsv(range,(r,c)=>cells[cellAddress(r,c)]?.computed,{maxCells:maxCopyCells});
      onCopyRange(range,tsv);
    }catch(e){
      state.setState({error:e instanceof Error?e.message:"Could not copy range"});
    }
  };
  const pageRows=Math.max(1,Math.floor(bodyHeight/rowHeight)-1);
  const onKey=(key:string,mods:{shiftKey:boolean;ctrlKey:boolean;metaKey:boolean})=>{
    if((mods.ctrlKey||mods.metaKey)&&(key==="c"||key==="C")){copy();return true;}
    if(rowCount<1||columnCount<1)return false;
    const current=selection&&range?selection:{anchor:"A1",focus:"A1"};
    const next=moveSheetSelection(current,{key,...mods},{rowCount,columnCount,pageRows});
    if(!next)return false;
    select(next);
    // Ctrl+End or PageDown can move focus outside the rendered window; bring
    // it into view so the focus ring and the formula bar agree.
    const cell=parseCellAddress(next.focus)!;
    const s=state.getState();
    const target=revealCellScroll({row:cell.row,column:cell.column,scrollX:s.x,scrollY:s.y,
      bodyWidth:Math.max(0,viewportWidth-left-frozen.frozenWidth),bodyHeight,rowHeight,columnWidth,
      frozenRows:fr,frozenColumns:fc});
    if(target.x!==s.x||target.y!==s.y){
      state.setState(target);
      horizontalRef.current?.scrollTo({x:target.x,animated:false});
      verticalRef.current?.scrollTo({y:target.y,animated:false});
    }
    return true;
  };

  const formulaText=dirty?draft:(focus?cells[focus]?.raw??"":"");
  const highlights=useMemo(()=>highlightReferences?referenceHighlights(formulaText,sheetName):[],
    [highlightReferences,formulaText,sheetName]);

  // RN Text does not inherit color; every label needs the theme text token or
  // it renders platform-default black on a dark surface.
  const textClass=!unstyled?"text-text":undefined;
  const mutedClass=!unstyled?"text-text-muted":undefined;
  const headerClass=joinClasses(!unstyled&&"border-r border-b border-border bg-surface-sunken",headerClassName);
  const bodyColumns=useMemo(()=>Array.from({length:body.columns.end-body.columns.start},(_,i)=>body.columns.start+i),
    [body.columns.start,body.columns.end]);
  const bodyRows=useMemo(()=>Array.from({length:body.rows.end-body.rows.start},(_,i)=>body.rows.start+i),
    [body.rows.start,body.rows.end]);
  const frozenColumnList=useMemo(()=>Array.from({length:fc},(_,i)=>i),[fc]);
  const frozenRowList=useMemo(()=>Array.from({length:fr},(_,i)=>i),[fr]);
  const leftGap=(body.columns.start-fc)*columnWidth;
  const rightGap=(columnCount-body.columns.end)*columnWidth;
  const topGap=(body.rows.start-fr)*rowHeight;
  const bottomGap=Math.max(0,(rowCount-body.rows.end)*rowHeight);
  const translateX={transform:[{translateX:Animated.multiply(scrollX,-1)}]};
  const translateY={transform:[{translateY:Animated.multiply(scrollY,-1)}]};

  const columnHeader=(col:number)=><View key={col} role="columnheader" accessibilityLabel={`Column ${columnName(col)}`}
    {...{className:headerClass}} style={{width:columnWidth,height:headerHeight,justifyContent:"center",alignItems:"center"}}>
    <Text {...{className:textClass}}>{columnName(col)}</Text>
  </View>;
  const rowHeader=(row:number)=><View key={row} role="rowheader" accessibilityLabel={`Row ${row+1}`}
    {...{className:headerClass}} style={{width:left,height:rowHeight,justifyContent:"center",alignItems:"center"}}>
    <Text {...{className:mutedClass}}>{row+1}</Text>
  </View>;
  const cell=(row:number,col:number)=>{
    const addr=cellAddress(row,col);
    const inRange=range!==null&&rangeContains(range,row,col);
    const isFocus=addr===focus;
    const referenced=highlights.some(h=>rangeContains(h.range,row,col));
    const value=display(cells[addr]?.computed);
    // `role` (not accessibilityRole): "cell" is absent from Android's
    // AccessibilityRole enum, where accessibilityRole would throw.
    return <Pressable
      key={addr}
      role="cell"
      accessibilityLabel={`${addr}, ${value||"empty"}${referenced?", referenced by formula":""}`}
      accessibilityHint="Select the cell to edit its value in the formula bar. Long press to extend the selection."
      aria-selected={inRange}
      onPress={()=>select({anchor:addr,focus:addr})}
      onLongPress={()=>select({anchor:selection&&range?selection.anchor:addr,focus:addr})}
      {...{className:joinClasses(!unstyled&&"border-r border-b border-border",cellClassName,
        !unstyled&&referenced&&"bg-accent/10",
        !unstyled&&inRange&&"bg-primary/10",
        !unstyled&&isFocus&&"border-2 border-focus")}}
      style={{width:columnWidth,height:rowHeight,justifyContent:"center",paddingHorizontal:8}}>
      <Text numberOfLines={1} {...{className:textClass}}>{value}</Text>
    </Pressable>;
  };
  const cellRow=(row:number,cols:readonly number[],gaps:boolean)=><View key={row} role="row" style={{height:rowHeight,flexDirection:"row"}}>
    {gaps?<View style={{width:leftGap}}/>:null}
    {cols.map(col=>cell(row,col))}
    {gaps?<View style={{width:rightGap}}/>:null}
  </View>;

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
        <Text selectable {...{className:textClass}}
          accessibilityLabel={range?`Selected ${range.startRow===range.endRow&&range.startColumn===range.endColumn?"cell":"range"} ${selection!.anchor===focus?focus:`${selection!.anchor} to ${focus}`}`:"No cell selected"}>
          {range?(selection!.anchor===focus?focus:`${selection!.anchor}:${focus}`):""}
        </Text>
        {metrics.compact?<Text numberOfLines={1} style={{fontSize:11}} {...{className:mutedClass}}>
          Swipe sideways for more columns
        </Text>:null}
      </View>
      <TextInput
        {...{className:joinClasses(!unstyled&&"rounded-control border border-border bg-surface-sunken text-text focus:border-focus")}}
        style={{flex:metrics.compact?undefined:1,
          width:metrics.compact?"100%":undefined,minHeight:44,paddingHorizontal:10}}
        accessibilityLabel="Formula bar"
        editable={Boolean(focus&&onCommitCell)&&!pending}
        value={formulaText}
        onChangeText={next=>state.setState(current=>({draft:next,dirty:true,editVersion:current.editVersion+1}))}
        onSubmitEditing={()=>void commit()}
        onBlur={()=>{if(dirty)void commit();}}
        returnKeyType="done"
      />
    </View>
    {error?<Text selectable accessibilityLiveRegion="polite" accessibilityRole="alert"
      {...{className:joinClasses("px-2",!unstyled&&"text-danger")}}>{error}</Text>:null}
    {/* Keys are handled here, not on the root, so arrows typed in the formula bar never move the selection. */}
    <View role="grid" focusable
      aria-label={`${sheetName??"Sheet"}, ${rowCount} rows by ${columnCount} columns`}
      accessibilityActions={onCopyRange?[{name:"copy",label:"Copy selection"}]:undefined}
      onAccessibilityAction={e=>{if(e.nativeEvent.actionName==="copy")copy();}}
      onKeyDown={e=>{
        const n=e.nativeEvent;
        if(onKey(n.key,{shiftKey:n.shiftKey,ctrlKey:n.ctrlKey,metaKey:n.metaKey}))e.preventDefault?.();
      }}
      style={{height:gridHeight}}>
      {/* Top band: corner and frozen columns are fixed; column headers and frozen rows follow scrollX. */}
      <View style={{flexDirection:"row"}}>
        <View>
          <View role="row" style={{flexDirection:"row"}}>
            <View {...{className:headerClass}} style={{width:left,height:headerHeight}}/>
            {frozenColumnList.map(columnHeader)}
          </View>
          {frozenRowList.map(row=><View key={row} role="row" style={{flexDirection:"row"}}>
            {rowHeader(row)}{frozenColumnList.map(col=>cell(row,col))}
          </View>)}
        </View>
        <View style={{flex:1,overflow:"hidden"}}>
          <Animated.View style={[{width:body.totalWidth},translateX]}>
            <View role="row" style={{flexDirection:"row"}}>
              <View style={{width:leftGap}}/>
              {bodyColumns.map(columnHeader)}
              <View style={{width:rightGap}}/>
            </View>
            {frozenRowList.map(row=>cellRow(row,bodyColumns,true))}
          </Animated.View>
        </View>
      </View>
      {/* Body band: row headers and frozen columns follow scrollY; the body scrolls on both axes. */}
      <View style={{flexDirection:"row",height:bodyHeight}}>
        <View style={{overflow:"hidden",width:left+frozen.frozenWidth}}>
          <Animated.View style={translateY}>
            <View style={{height:topGap}}/>
            {bodyRows.map(row=><View key={row} role="row" style={{flexDirection:"row"}}>
              {rowHeader(row)}{frozenColumnList.map(col=>cell(row,col))}
            </View>)}
            <View style={{height:bottomGap}}/>
          </Animated.View>
        </View>
        <Animated.ScrollView ref={horizontalRef} horizontal scrollEventThrottle={16} keyboardShouldPersistTaps="handled"
          accessibilityLabel="Spreadsheet grid, scroll sideways for additional columns"
          onScroll={Animated.event([{nativeEvent:{contentOffset:{x:scrollX}}}],{useNativeDriver:true,
            listener:(event:{nativeEvent:{contentOffset:{x:number}}})=>{
              const next=Math.max(0,event.nativeEvent.contentOffset.x);
              if(Math.abs(next-state.getState().x)>columnWidth/4)state.setState({x:next});
            }})}>
          <View style={{width:body.totalWidth}}>
            <Animated.ScrollView ref={verticalRef} nestedScrollEnabled style={{height:bodyHeight}}
              scrollEventThrottle={16}
              onScroll={Animated.event([{nativeEvent:{contentOffset:{y:scrollY}}}],{useNativeDriver:true,
                listener:(event:{nativeEvent:{contentOffset:{y:number}}})=>{
                  const next=Math.max(0,event.nativeEvent.contentOffset.y);
                  if(Math.abs(next-state.getState().y)>rowHeight/3)state.setState({y:next});
                }})}>
              <View style={{height:topGap}}/>
              {bodyRows.map(row=>cellRow(row,bodyColumns,true))}
              <View style={{height:bottomGap}}/>
            </Animated.ScrollView>
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  </View>;
}
