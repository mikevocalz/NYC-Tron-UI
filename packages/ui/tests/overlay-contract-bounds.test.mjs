import test from 'node:test';
import assert from 'node:assert/strict';
import {hasUsableRegion,placePopover} from '../src/components/overlays/popover-position.ts';
import {validateCommands} from '../src/components/overlays/command-filter.ts';
import {validatePresets} from '../src/components/shell/preset-model.ts';
import {validateShortcutCommands} from '../src/components/shell/shortcut-model.ts';
test('temporarily unavailable or malformed panes are distinguished from a usable bounded pane',()=>{assert.equal(hasUsableRegion([]),false);assert.equal(hasUsableRegion([{x:0,y:0,width:0,height:10}]),false);assert.equal(hasUsableRegion([{x:NaN,y:0,width:10,height:10}]),false);assert.equal(hasUsableRegion([{x:40,y:20,width:300,height:500}]),true);const placed=placePopover({x:200,y:40,width:44,height:44},[{x:40,y:20,width:300,height:500}],560,560);assert.ok(placed.x>=40&&placed.x+placed.width<=340);assert.ok(placed.y>=20&&placed.y+placed.height<=520);});
test('command, preset and shortcut budgets reject ambiguous identities and invalid permissions',()=>{assert.throws(()=>validateCommands(Array.from({length:1001},(_,i)=>({id:String(i),label:'Action'}))),/Too many/);assert.throws(()=>validatePresets([{id:'warm',name:'Warm',favorite:'yes'}]),/favorite/);assert.throws(()=>validateShortcutCommands([{id:'rename',label:'Rename',binding:'Hyper+R'}]),/binding/);assert.throws(()=>validateShortcutCommands([{id:'rename',label:'Rename'},{id:'rename',label:'Other'}]),/Duplicate/);validateShortcutCommands([{id:'rename',label:'Rename',binding:'Mod+R',defaultBinding:'F2'}]);});
