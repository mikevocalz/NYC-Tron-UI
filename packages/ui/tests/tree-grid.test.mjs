import test from "node:test";
import assert from "node:assert/strict";
import {
  visibleTreeRows,treeRowAccessibilityLabel,orderTreeColumns,moveColumn,
  treeRangeIds,toggleTreeSelection,treeGridKey,
} from "../src/components/data/tree-grid.ts";

const nodes=[
  {id:"a",label:"Assets",children:[
    {id:"a1",label:"Cash"},{id:"a2",label:"Stock",children:[{id:"a2x",label:"Lot 7"}]},{id:"a3",label:"Bonds"},
  ]},
  {id:"b",label:"Liabilities"},
];
const rowsOf=expanded=>visibleTreeRows(nodes,new Set(expanded));
const ids=rows=>rows.map(r=>r.node.id);

test("rows carry level, sibling position and set size independent of expansion",()=>{
  const rows=rowsOf(["a","a2"]);
  assert.deepEqual(rows.map(r=>[r.node.id,r.depth,r.position,r.setSize,r.parentId]),[
    ["a",0,1,2,undefined],["a1",1,1,3,"a"],["a2",1,2,3,"a"],["a2x",2,1,1,"a2"],["a3",1,3,3,"a"],["b",0,2,2,undefined],
  ]);
  assert.equal(treeRowAccessibilityLabel(rows[2]),"Stock, level 2, 2 of 3");
  assert.equal(treeRowAccessibilityLabel(rows[5]),"Liabilities, level 1, 2 of 2");
});

test("column order is controlled, tolerant of stale ids, and pinned columns split out",()=>{
  const cols=[{id:"qty"},{id:"price"},{id:"total"},{id:"note"}];
  const r=orderTreeColumns(cols,["total","gone","qty","total"],["qty"]);
  assert.deepEqual(r.pinned.map(c=>c.id),["qty"]);
  assert.deepEqual(r.scrollable.map(c=>c.id),["total","price","note"]);
  assert.deepEqual(r.ordered.map(c=>c.id),["total","qty","price","note"]);
  assert.deepEqual(orderTreeColumns(cols).scrollable.map(c=>c.id),["qty","price","total","note"]);
  assert.throws(()=>orderTreeColumns([{id:"x"},{id:"x"}]),/duplicate/);
  assert.deepEqual(moveColumn(["a","b","c"],"a",2),["b","c","a"]);
  assert.deepEqual(moveColumn(["a","b","c"],"c",-5),["c","a","b"]);
  assert.throws(()=>moveColumn(["a"],"z",0),/Unknown/);
});

test("selection helpers toggle and build visible-order ranges",()=>{
  const rows=rowsOf(["a"]);
  assert.deepEqual(treeRangeIds(rows,"a3","a1"),["a1","a2","a3"]);
  assert.deepEqual(toggleTreeSelection(["a","b"],"a"),["b"]);
  assert.deepEqual(toggleTreeSelection(["b"],"a"),["b","a"]);
});

test("arrow, Home and End move focus; Shift extends from the anchor",()=>{
  const rows=rowsOf(["a"]);
  let s={focusId:"a1",anchorId:"a1",selectedIds:[],expandedIds:["a"]};
  s=treeGridKey(rows,s,{key:"ArrowDown"});
  assert.equal(s.focusId,"a2");assert.equal(s.anchorId,"a2");
  s=treeGridKey(rows,s,{key:"ArrowDown",shiftKey:true});
  s=treeGridKey(rows,s,{key:"ArrowDown",shiftKey:true});
  assert.equal(s.focusId,"b");
  assert.deepEqual(s.selectedIds,["a2","a3","b"]);
  s=treeGridKey(rows,s,{key:"Home",shiftKey:true});
  assert.deepEqual(s.selectedIds,["a","a1","a2"]);
  assert.equal(treeGridKey(rows,s,{key:"End"}).focusId,"b");
  assert.equal(treeGridKey(rows,{...s,focusId:"b"},{key:"ArrowDown"}).focusId,"b");
});

test("Space toggles, Shift+Space selects the range, other keys pass through",()=>{
  const rows=rowsOf(["a"]);
  let s={focusId:"a1",anchorId:"a1",selectedIds:["b"],expandedIds:["a"]};
  s=treeGridKey(rows,s,{key:" "});
  assert.deepEqual(s.selectedIds,["b","a1"]);
  s=treeGridKey(rows,s,{key:" "});
  assert.deepEqual(s.selectedIds,["b"]);
  s={...s,focusId:"a3"};
  assert.deepEqual(treeGridKey(rows,s,{key:" ",shiftKey:true}).selectedIds,["a1","a2","a3"]);
  assert.equal(treeGridKey(rows,s,{key:"x"}),undefined);
  assert.equal(treeGridKey([],s,{key:"ArrowDown"}),undefined);
});

test("ArrowRight expands then enters; ArrowLeft collapses then returns to parent",()=>{
  let s={focusId:"a",selectedIds:[],expandedIds:[]};
  s=treeGridKey(rowsOf(s.expandedIds),s,{key:"ArrowRight"});
  assert.deepEqual(s.expandedIds,["a"]);assert.equal(s.focusId,"a");
  s=treeGridKey(rowsOf(s.expandedIds),s,{key:"ArrowRight"});
  assert.equal(s.focusId,"a1");
  assert.equal(treeGridKey(rowsOf(s.expandedIds),s,{key:"ArrowRight"}),undefined,"leaf");
  s=treeGridKey(rowsOf(s.expandedIds),s,{key:"ArrowLeft"});
  assert.equal(s.focusId,"a");
  s=treeGridKey(rowsOf(s.expandedIds),s,{key:"ArrowLeft"});
  assert.deepEqual(s.expandedIds,[]);
  assert.equal(treeGridKey(rowsOf([]),s,{key:"ArrowLeft"}),undefined,"collapsed root");
  assert.deepEqual(ids(rowsOf(s.expandedIds)),["a","b"]);
});
