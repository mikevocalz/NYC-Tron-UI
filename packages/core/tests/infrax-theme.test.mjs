import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {INFRAX_THEME,INFRAX_DARK_THEME,infraxTokens} from '../src/presets/infrax.ts';
const lum=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255)
  .map(v=>v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4);return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2];};
const contrast=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);};
test('InFraX orange/navy preserved for native and web',()=>{
 assert.equal(INFRAX_THEME.colors.text,'#000d1a');
 assert.equal(INFRAX_DARK_THEME.colors.surfaceSunken,'#000d1a');
 // Deprecated names stay readable for existing callers.
 assert.equal(INFRAX_THEME.colors.foreground,'#000d1a');
 assert.equal(infraxTokens()['--color-primary'],'#f37021');
});
test('presets remain independently themeable',()=>{
 const override={...INFRAX_THEME,colors:{...INFRAX_THEME.colors,primary:'#ff9933'}};
 assert.equal(infraxTokens(override)['--color-primary'],'#ff9933');
 assert.equal(infraxTokens()['--color-primary'],'#f37021');
 const textOnly={...INFRAX_THEME,colors:{...INFRAX_THEME.colors,text:'#111111'}};
 assert.equal(infraxTokens(textOnly)['--color-text'],'#111111','spread-and-override of a current key wins over its alias');
 const status={danger:'#9f1239',onDanger:'#ffffff',accent:'#0e7490'};
 assert.equal(infraxTokens(INFRAX_THEME,{status})['--color-accent'],'#0e7490');
});
test('InFraX emits exactly the variables NYC-Tron components read',()=>{
 const doc=readFileSync(new URL('../../../docs/THEME_TOKENS.md',import.meta.url),'utf8');
 const table=doc.slice(0,doc.indexOf('## Reference'));
 const documented=new Set([...table.matchAll(/`(--(?:color|radius)-[a-z-]+)`/g)].map(m=>m[1]));
 for(const appearance of ['light','dark']){
  const vars=infraxTokens(appearance==='dark'?INFRAX_DARK_THEME:INFRAX_THEME);
  assert.equal(Object.keys(vars).length,15,appearance);
  assert.deepEqual(new Set(Object.keys(vars)),documented,appearance);
 }
});
test('InFraX text pairs meet WCAG AA in light and dark',()=>{
 for(const theme of [INFRAX_THEME,INFRAX_DARK_THEME]){
  const v=infraxTokens(theme);
  const pairs=[
   ['--color-on-primary','--color-primary'],['--color-on-danger','--color-danger'],
   ['--color-text','--color-surface-raised'],['--color-text','--color-surface-sunken'],
   ['--color-text-muted','--color-surface-raised'],['--color-text-muted','--color-surface-sunken'],
   ['--color-danger','--color-surface-raised'],['--color-danger','--color-surface-sunken'],
  ];
  for(const [fg,bg] of pairs)assert.ok(contrast(v[fg],v[bg])>=4.5,`${fg} on ${bg}: ${contrast(v[fg],v[bg]).toFixed(2)}`);
  for(const ui of ['--color-accent','--color-focus','--color-info','--color-success'])
   assert.ok(contrast(v[ui],v['--color-surface-sunken'])>=3,`${ui} on sunken: ${contrast(v[ui],v['--color-surface-sunken']).toFixed(2)}`);
 }
});
test('the theme-agnostic core barrel does not export a brand preset',()=>{
 const index=readFileSync(new URL('../src/index.ts',import.meta.url),'utf8');
 assert.ok(!index.includes('presets/'));
});
