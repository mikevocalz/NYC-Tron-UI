import test from 'node:test';
import assert from 'node:assert/strict';
import {INFRAX_THEME,INFRAX_DARK_THEME,infraxTokens} from '../src/presets/infrax.ts';
test('InFraX orange/navy preserved for native and web',()=>{
 assert.equal(INFRAX_THEME.colors.foreground,'#000d1a');
 assert.equal(INFRAX_DARK_THEME.colors.background,'#000d1a');
 assert.equal(infraxTokens()['--color-primary'],'#f37021');
});
test('presets remain independently themeable',()=>{
 const override={...INFRAX_THEME,colors:{...INFRAX_THEME.colors,primary:'#ff9933'}};
 assert.equal(infraxTokens(override)['--color-primary'],'#ff9933');
 assert.equal(infraxTokens()['--color-primary'],'#f37021');
});
