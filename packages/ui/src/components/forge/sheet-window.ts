/**
 * The 2-D viewport policy for Tally's visible window. Never allocate a
 * million-row workbook in JS just to render a screenful. The Rust Tally engine
 * remains authoritative; TanStack owns only visible row/column presentation.
 */
export interface SheetWindowOptions {
  readonly rowCount: number;
  readonly columnCount: number;
  readonly scrollX: number;
  readonly scrollY: number;
  readonly viewportWidth: number;
  readonly viewportHeight: number;
  readonly rowHeight: number;
  readonly columnWidth: number;
  readonly rowHeaderWidth?: number;
  readonly columnHeaderHeight?: number;
  readonly overscan?: number;
}
export interface SheetWindow {
  readonly rows: { start: number; end: number };
  readonly columns: { start: number; end: number };
  readonly totalWidth: number;
  readonly totalHeight: number;
}
export function sheetWindow(options: SheetWindowOptions): SheetWindow {
  const {
    rowCount,columnCount,scrollX,scrollY,viewportWidth,viewportHeight,
    rowHeight,columnWidth,rowHeaderWidth=52,columnHeaderHeight=38,overscan=2
  }=options;
  if (![rowCount,columnCount,rowHeight,columnWidth,viewportWidth,viewportHeight,
    scrollX,scrollY,rowHeaderWidth,columnHeaderHeight,overscan].every(Number.isFinite) ||
    !Number.isSafeInteger(rowCount) || rowCount<0 ||
    !Number.isSafeInteger(columnCount) || columnCount<0 ||
    !Number.isSafeInteger(overscan) || overscan<0 ||
    rowHeight<=0 || columnWidth<=0 || viewportWidth<0 || viewportHeight<0 ||
    scrollX<0 || scrollY<0 || rowHeaderWidth<0 || columnHeaderHeight<0) {
    throw new RangeError("Invalid spreadsheet viewport geometry");
  }
  const startRow=Math.max(0,Math.floor(scrollY/rowHeight)-overscan);
  const endRow=Math.min(rowCount,Math.ceil((scrollY + Math.max(0,viewportHeight-columnHeaderHeight))/rowHeight)+overscan);
  const startCol=Math.max(0,Math.floor(Math.max(0,scrollX-rowHeaderWidth)/columnWidth)-overscan);
  const endCol=Math.min(columnCount,Math.ceil((scrollX+viewportWidth)/columnWidth)+overscan);
  return {
    rows:{start:Math.min(rowCount,startRow),end:Math.min(rowCount,Math.max(startRow,endRow))},
    columns:{start:Math.min(columnCount,startCol),end:Math.min(columnCount,Math.max(startCol,endCol))},
    totalWidth:rowHeaderWidth+columnCount*columnWidth,
    totalHeight:columnHeaderHeight+rowCount*rowHeight,
  };
}
export function columnName(index:number):string {
  if(!Number.isSafeInteger(index)||index<0)throw new RangeError("Column must be nonnegative");
  let n=index+1,out="";
  while(n){n-=1;out=String.fromCharCode(65+n%26)+out;n=Math.floor(n/26);}
  return out;
}
export function cellAddress(row:number,column:number):string {
  if(!Number.isSafeInteger(row)||row<0)throw new RangeError("Row must be nonnegative");
  return columnName(column)+String(row+1);
}
