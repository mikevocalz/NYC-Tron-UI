import test from 'node:test';
import assert from 'node:assert/strict';
import {importSpecifiers} from '../../../tooling/import-specifiers.mjs';
test('package dependency scanner reads declarations without interpreting import/export UI copy',()=>{
 const source=`import {View} from 'react-native'; export {thing} from './thing.js'; const label='Choose file to import'; const props={label:"Export file", disabled:true}; import 'zustand';`;
 assert.deepEqual(importSpecifiers(source),['react-native','./thing.js','zustand']);
});
