import test from "node:test";
import assert from "node:assert/strict";
import {createNavigationStore} from "../route-store.ts";

test("pending and rejected routes preserve selection; acceptance commits once",()=>{
 const store=createNavigationStore();
 store.getState().requestRoute("workspace");
 assert.equal(store.getState().selectedId,"home");
 assert.equal(store.getState().pendingId,"workspace");
 store.getState().rejectRoute();
 assert.equal(store.getState().selectedId,"home");
 assert.equal(store.getState().pendingId,null);
 store.getState().requestRoute("workspace");
 store.getState().acceptRoute();
 assert.equal(store.getState().selectedId,"workspace");
 assert.equal(store.getState().pendingId,null);
});
test("disabled/stale routes and settings never replace committed selection",()=>{
 const store=createNavigationStore();
 for(const id of ["disabled","missing","home"])store.getState().requestRoute(id);
 assert.equal(store.getState().pendingId,null);
 store.getState().openSettings();
 store.getState().setPaneOpen(false);
 store.getState().closeSettings();
 assert.equal(store.getState().selectedId,"home");
 assert.equal(store.getState().settingsOpen,false);
 assert.equal(store.getState().paneOpen,false);
});
